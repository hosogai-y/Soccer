import { Peer, DataConnection } from 'peerjs';
import { TelopHubSDK } from '../TelopHubClient';

export class ConnectionManager {
    private client: TelopHubSDK;
    private peer: Peer | null = null;
    private reconnectTimer: any = null;

    constructor(client: TelopHubSDK) {
        this.client = client;
    }

    public initPeer() {
        if (this.client.isDestroyed) return;
        
        let host = window.location.hostname;
        let port = parseInt(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80);
        
        if (this.client.config.socketUrl) {
            try {
                const url = new URL(this.client.config.socketUrl);
                host = url.hostname;
                port = parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80);
            } catch (e) {}
        }

        this.peer = new (Peer as any)({
            path: '/api/peerjs',
            host: host,
            port: port,
            secure: window.location.protocol === 'https:' || this.client.config.socketUrl?.startsWith('https'),
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            },
            debug: 0
        });

        this.peer!.on('open', (id) => {
            console.log(`[SDK] Connected to PeerJS server with ID: ${id}`);
            this.connectToHosts();
        });

        this.peer!.on('disconnected', () => {
            console.log(`[SDK] Disconnected from server. Reconnecting...`);
            if (!this.client.isDestroyed) {
                setTimeout(() => {
                    if (!this.client.isDestroyed && this.peer && this.peer.disconnected) {
                        this.peer.reconnect();
                    }
                }, 2000);
            }
        });

        this.peer!.on('connection', (conn: DataConnection) => {
            const peerId = conn.peer;
            console.log(`[SDK] 📥 Incoming WebRTC DataChannel connection from: ${peerId}`);
            conn.on('open', () => {
                console.log(`[SDK] ✅ DataChannel opened with incoming peer: ${peerId}`);
                const prev = this.client.hostConns.get(peerId);
                if (prev && prev !== conn) {
                    try { prev.close(); } catch (e) {}
                    try { prev.peerConnection?.close(); } catch (e) {}
                }
                this.client.hostConns.set(peerId, conn);
                this.handleConnection(conn, peerId);
                this.client.notifyConnectionListeners();
            });
            conn.on('close', () => {
                console.log(`[SDK] ℹ️ DataChannel closed with incoming peer: ${peerId}`);
                try { conn.peerConnection?.close(); } catch (e) {}
                this.client.hostConns.delete(peerId);
                this.client.notifyConnectionListeners();
            });
            conn.on('error', () => {
                try { conn.peerConnection?.close(); } catch (e) {}
                this.client.hostConns.delete(peerId);
                this.client.notifyConnectionListeners();
            });
        });

        this.peer!.on('error', (err: any) => {
            if (err.type === 'peer-unavailable') {
                console.log(`[SDK] ℹ️ Target peer is currently offline (${err.message || 'peer-unavailable'}). Will retry in background.`);
                return;
            }
            if (err.type === 'network' || err.type === 'disconnected' || (err.message && err.message.includes('Lost connection to server'))) {
                console.log(`[SDK] ℹ️ Signaling server connection reset (${err.message || err.type}). Direct P2P channels remain active.`);
                return;
            }
            console.error(`[SDK] PeerJS Error:`, err);
            if (err.type === 'server-error') {
                this.scheduleReconnect();
            }
        });
    }

    private connectToHosts() {
        if (!this.peer || this.client.isDestroyed) return;

        if (this.client.targetMachineIds.length === 0) {
            console.warn(`[SDK] ⚠️ No target machine IDs specified.`);
            return;
        }

        this.client.targetMachineIds.forEach(machineId => {
            this.connectToSingleHost(machineId);
        });
    }

    private connectToSingleHost(machineId: string) {
        if (!this.peer || this.client.isDestroyed) return;

        const existing = this.client.hostConns.get(machineId);
        if (existing && existing.open) return;
        
        console.log(`[SDK] 📡 Connecting to Main Dashboard host: ${machineId}`);
        try {
            const conn = this.peer.connect(machineId, { reliable: true });

            const connectTimeout = setTimeout(() => {
                if (!conn.open && (this.client.hostConns.get(machineId) !== conn)) {
                    console.log(`[SDK] ℹ️ Host ${machineId} is currently unresponsive. Retrying in 2s...`);
                    try { conn.close(); } catch (e) {}
                    try { conn.peerConnection?.close(); } catch (e) {}
                    if (!this.client.isDestroyed) {
                        setTimeout(() => this.connectToSingleHost(machineId), 2000);
                    }
                }
            }, 5000);

            conn.on('open', () => {
                clearTimeout(connectTimeout);
                console.log(`[SDK] ✅ DataChannel opened with Main Dashboard: ${machineId}`);
                const prev = this.client.hostConns.get(machineId);
                if (prev && prev !== conn) {
                    try { prev.close(); } catch (e) {}
                    try { prev.peerConnection?.close(); } catch (e) {}
                }
                this.client.hostConns.set(machineId, conn);
                this.handleConnection(conn, machineId);
                this.client.notifyConnectionListeners();
                this.client.requestState();
            });

            conn.on('close', () => {
                console.log(`[SDK] ℹ️ DataChannel closed with host: ${machineId}`);
                try { conn.peerConnection?.close(); } catch (e) {}
                this.client.hostConns.delete(machineId);
                this.client.notifyConnectionListeners();
                if (!this.client.isDestroyed) {
                    setTimeout(() => this.connectToSingleHost(machineId), 1500);
                }
            });

            conn.on('error', (err) => {
                console.warn(`[SDK] DataChannel error with host: ${machineId}`, err);
                try { conn.peerConnection?.close(); } catch (e) {}
                this.client.hostConns.delete(machineId);
                this.client.notifyConnectionListeners();
                if (!this.client.isDestroyed) {
                    setTimeout(() => this.connectToSingleHost(machineId), 1500);
                }
            });
        } catch (e) {
            if (!this.client.isDestroyed) {
                setTimeout(() => this.connectToSingleHost(machineId), 2000);
            }
        }
    }

    private handleConnection(conn: DataConnection, machineId: string) {
        this.client.notifyConnectionListeners();
        this.client.actionDispatcher.sendPayloadSafelyToConn(conn, JSON.stringify({ type: 'register-role', role: this.client.config.role || 'dashboard' }));

        const pc = conn.peerConnection;
        if (pc) {
            const handleIceState = () => {
                console.log(`[SDK] ❄️ ICE Connection State [${machineId}]: ${pc.iceConnectionState}`);
                if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
                    console.warn(`[SDK] ⚠️ ICE Connection lost/failed (${pc.iceConnectionState}) for ${machineId}. Cleaning up and reconnecting in 1.5s...`);
                    if (this.client.hostConns.get(machineId) === conn) {
                        this.client.hostConns.delete(machineId);
                        this.client.notifyConnectionListeners();
                        try { conn.close(); } catch (e) {}
                        try { pc.close(); } catch (e) {}
                        if (!this.client.isDestroyed) {
                            setTimeout(() => this.connectToSingleHost(machineId), 1500);
                        }
                    }
                }
            };
            pc.addEventListener('iceconnectionstatechange', handleIceState);
        }

        const heartbeatTimer = setInterval(() => {
            if (!conn || !conn.open || this.client.isDestroyed || this.client.hostConns.get(machineId) !== conn) {
                clearInterval(heartbeatTimer);
                return;
            }
            try {
                conn.send(JSON.stringify({ type: 'ping', senderId: this.client.myId }));
            } catch (e) {}
        }, 5000);

        if (this.client.pendingAppActions.length > 0) {
            console.log(`[SDK] 🔄 Flushing ${this.client.pendingAppActions.length} pending actions to ${machineId}...`);
            this.client.pendingAppActions.forEach(({ message, data }) => {
                const payload = JSON.stringify({ type: 'app-action', message, data });
                this.client.actionDispatcher.sendPayloadSafelyToConn(conn, payload);
            });
        }

        conn.on('data', (data: any) => {
            try {
                const message = typeof data === 'string' ? JSON.parse(data) : data;
                this.client.actionDispatcher.processIncomingMessage(message);
            } catch (err) {
                console.error('[SDK] Error parsing incoming message', err);
            }
        });
    }

    private scheduleReconnect() {
        if (this.client.isDestroyed || this.reconnectTimer) return;
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            console.log(`[SDK] 🔄 Re-initializing PeerJS to clear stale cache...`);
            this.client.hostConns.forEach(conn => {
                try { conn.close(); } catch (e) {}
            });
            this.client.hostConns.clear();

            if (this.peer) {
                try { this.peer.destroy(); } catch (e) {}
                this.peer = null;
            }
            this.initPeer();
        }, 3000);
    }

    public destroy() {
        const targetKickId = this.peer ? this.peer.id : null;
        if (targetKickId) {
            console.log(`[SDK] Sending immediate kick request for: ${targetKickId}`);
            try {
                fetch(`/api/peerjs/kick/${targetKickId}`, {
                    method: 'POST',
                    keepalive: true,
                    headers: { 'Content-Type': 'application/json' }
                }).catch(() => {});
            } catch (e) {}
        }

        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.client.hostConns.forEach((conn) => {
            try { conn.close(); } catch (e) {}
        });
        this.client.hostConns.clear();

        if (this.peer) {
            try { this.peer.destroy(); } catch (e) {}
            this.peer = null;
        }
    }
}
