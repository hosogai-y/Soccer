import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface BackgroundTimer {
    stop: () => void;
}

function startBackgroundInterval(callback: () => void, delay: number): BackgroundTimer {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
        try {
            const blob = new Blob([
                `
                let timerId = null;
                self.onmessage = function(e) {
                    if (e.data.type === 'start') {
                        timerId = setInterval(() => {
                            self.postMessage('tick');
                        }, e.data.delay);
                    } else if (e.data.type === 'stop') {
                        if (timerId) clearInterval(timerId);
                    }
                };
                `
            ], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const worker = new Worker(url);

            let active = true;
            worker.onmessage = () => {
                if (active) callback();
            };
            worker.postMessage({ type: 'start', delay });

            return {
                stop: () => {
                    if (!active) return;
                    active = false;
                    try {
                        worker.postMessage({ type: 'stop' });
                        worker.terminate();
                    } catch (e) {}
                    try {
                        URL.revokeObjectURL(url);
                    } catch (e) {}
                }
            };
        } catch (err) {
            console.warn('[SDK] Background worker interval creation failed, using native fallback:', err);
        }
    }
    const id = setInterval(callback, delay);
    return {
        stop: () => clearInterval(id)
    };
}

function startBackgroundTimeout(callback: () => void, delay: number): BackgroundTimer {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
        try {
            const blob = new Blob([
                `
                let timerId = null;
                self.onmessage = function(e) {
                    if (e.data.type === 'start') {
                        timerId = setTimeout(() => {
                            self.postMessage('timeout');
                        }, e.data.delay);
                    } else if (e.data.type === 'stop') {
                        if (timerId) clearTimeout(timerId);
                    }
                };
                `
            ], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const worker = new Worker(url);

            let active = true;
            worker.onmessage = () => {
                if (!active) return;
                active = false;
                try {
                    worker.terminate();
                } catch (e) {}
                try {
                    URL.revokeObjectURL(url);
                } catch (e) {}
                callback();
            };
            worker.postMessage({ type: 'start', delay });

            return {
                stop: () => {
                    if (!active) return;
                    active = false;
                    try {
                        worker.postMessage({ type: 'stop' });
                        worker.terminate();
                    } catch (e) {}
                    try {
                        URL.revokeObjectURL(url);
                    } catch (e) {}
                }
            };
        } catch (err) {
            console.warn('[SDK] Background worker timeout creation failed, using native fallback:', err);
        }
    }
    const id = setTimeout(callback, delay);
    return {
        stop: () => clearTimeout(id)
    };
}

function backgroundDelay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        startBackgroundTimeout(resolve, ms);
    });
}

/**
 * TelopHub Action SDK
 * A lightweight library for project-specific dashboards to interact with TelopHub players.
 */

export interface SDKConfig {
    machineId: string;      // The target machine to control (same machineId as Main Dashboard)
    role?: string;          // Role to register with the host (default: 'dashboard')
    socketUrl?: string;     // Signaling server URL (TelopHub server)
}

import { Peer, DataConnection } from 'peerjs';

export class TelopHubSDK {
    public myId: string;
    private peer: Peer | null = null;
    private hostConn: DataConnection | null = null;
    private config: SDKConfig;
    private currentProject: string | null = null;
    
    private stateListeners: ((state: any) => void)[] = [];
    private connectionListeners: ((connected: boolean) => void)[] = [];
    private actionListeners: Map<string, Array<(data: any) => void>> = new Map();
    private localStateSetter: ((state: any) => void) | null = null;
    
    private pendingAppActions: any[] = [];
    private syncInProgress = false;
    private reconnectTimer: any = null;
    private destroyed = false;
    private chunkBuffers: Map<string, { chunks: string[]; receivedCount: number; total: number; timer: any }> = new Map();
    private bc: BroadcastChannel | null = null;

    constructor(config: SDKConfig) {
        this.config = config;
        this.myId = crypto.randomUUID();
        this.initPeer();

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                this.destroy();
            });
        }
    }

    private initPeer() {
        if (this.destroyed) return;
        
        let host = window.location.hostname;
        let port = parseInt(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80);
        
        if (this.config.socketUrl) {
            try {
                const url = new URL(this.config.socketUrl);
                host = url.hostname;
                port = parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80);
            } catch (e) {}
        }

        this.peer = new (Peer as any)({
            path: '/api/peerjs',
            host: host,
            port: port,
            secure: window.location.protocol === 'https:' || this.config.socketUrl?.startsWith('https'),
            debug: 0
        });

        this.peer!.on('open', (id) => {
            console.log(`[SDK] Connected to PeerJS server with ID: ${id}`);
            this.connectToHost();
        });

        this.peer!.on('disconnected', () => {
            console.log(`[SDK] Disconnected from server. Reconnecting...`);
            if (!this.destroyed) {
                setTimeout(() => {
                    if (!this.destroyed && this.peer && this.peer.disconnected) {
                        this.peer.reconnect();
                    }
                }, 2000);
            }
        });

        this.peer!.on('error', (err: any) => {
            console.error(`[SDK] PeerJS Error:`, err);
            if (err.type === 'peer-unavailable' || err.type === 'network' || err.type === 'server-error') {
                this.scheduleReconnect();
            }
        });
    }

    private connectToHost() {
        if (!this.peer || this.destroyed) return;
        
        console.log(`[SDK] 📡 Connecting to Main Dashboard host: ${this.config.machineId}`);
        try {
            const conn = this.peer.connect(this.config.machineId, { reliable: true });

            const connectTimeout = setTimeout(() => {
                if (this.hostConn !== conn && !conn.open) {
                    console.warn(`[SDK] ⚠️ Connection timed out (Ghost Host?). Retrying...`);
                    try { conn.close(); } catch (e) {}
                    this.scheduleReconnect();
                }
            }, 6000);

            conn.on('open', () => {
                clearTimeout(connectTimeout);
                console.log(`[SDK] ✅ DataChannel opened with Main Dashboard`);
                this.hostConn = conn;
                this.handleConnection(conn);
            });

            conn.on('close', () => {
                console.log(`[SDK] ❌ DataChannel closed with Main Dashboard`);
                this.hostConn = null;
                this.notifyConnectionListeners();
                this.scheduleReconnect();
            });

            conn.on('error', (err) => {
                console.error(`[SDK] Connection error:`, err);
                this.hostConn = null;
                this.notifyConnectionListeners();
                this.scheduleReconnect();
            });
        } catch (e) {
            console.error(`[SDK] Synchronous connection error:`, e);
            this.scheduleReconnect();
        }
    }

    private handleConnection(conn: DataConnection) {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        this.notifyConnectionListeners();
        this.sendPayloadSafely(JSON.stringify({ type: 'register-role', role: this.config.role || 'dashboard' }));

        const pc = conn.peerConnection;
        if (pc) {
            pc.addEventListener('iceconnectionstatechange', () => {
                console.log(`[SDK] ❄️ ICE Connection State: ${pc.iceConnectionState}`);
                if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
                    console.warn(`[SDK] ⚠️ ICE Connection lost (state: ${pc.iceConnectionState}). Reconnecting...`);
                    if (this.hostConn === conn) {
                        this.hostConn = null;
                        this.notifyConnectionListeners();
                        this.scheduleReconnect();
                    }
                }
            });
        }

        if (this.pendingAppActions.length > 0) {
            console.log(`[SDK] 🔄 Flushing ${this.pendingAppActions.length} pending actions...`);
            this.pendingAppActions.forEach(({ message, data }) => {
                const payload = JSON.stringify({ type: 'app-action', message, data });
                this.sendPayloadSafely(payload);
            });
            this.pendingAppActions = [];
        }

        conn.on('data', (data: any) => {
            try {
                const message = typeof data === 'string' ? JSON.parse(data) : data;
                this.processIncomingMessage(message);
            } catch (err) {
                console.error('[SDK] Error parsing incoming message', err);
            }
        });
    }

    private scheduleReconnect() {
        if (this.destroyed || this.reconnectTimer) return;
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            console.log(`[SDK] 🔄 Re-initializing PeerJS to clear stale cache...`);
            if (this.hostConn) {
                try { this.hostConn.close(); } catch (e) {}
                this.hostConn = null;
            }
            if (this.peer) {
                try { this.peer.destroy(); } catch (e) {}
                this.peer = null;
            }
            this.initPeer();
        }, 3000);
    }

    public onConnectionChange(callback: (connected: boolean) => void) {
        this.connectionListeners.push(callback);
        callback(this.hostConn ? this.hostConn.open : false);
        return () => {
            this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback);
        };
    }

    private notifyConnectionListeners() {
        const connected = this.hostConn ? this.hostConn.open : false;
        this.connectionListeners.forEach(cb => cb(connected));
    }

    public joinProject(projectName: string) {
        this.currentProject = projectName;
        if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
            if (this.bc) {
                try { this.bc.close(); } catch (e) {}
            }
            try {
                this.bc = new BroadcastChannel(`telop-hub-bc-${projectName}`);
                this.bc.onmessage = (e) => {
                    if (!e.data || typeof e.data !== 'object') return;
                    if (e.data.type === 'action') {
                        this.dispatchActionLocally(e.data.message, e.data.data);
                    } else if (e.data.type === 'state') {
                        this.stateListeners.forEach(cb => cb(e.data.state));
                    }
                };
            } catch (err) {}
        }
    }

    private async handleDashboardUpdated(data: { projectName: string }) {
        console.log('[SDK] 🔄 Project dashboard update detected! Re-syncing...');
        const proj = data.projectName || this.currentProject;
        if (!proj) return;
        
        try {
            const opfsRoot = await navigator.storage.getDirectory();
            const syncRoot = await opfsRoot.getDirectoryHandle('SyncedTelops', { create: true });
            
            try {
                const dir = await syncRoot.getDirectoryHandle(proj);
                const hubDir = await dir.getDirectoryHandle('.hub');
                await hubDir.removeEntry('dashboard_dist', { recursive: true });
            } catch (e) {
                try {
                    const hubDir = await syncRoot.getDirectoryHandle('.hub');
                    await hubDir.removeEntry('dashboard_dist', { recursive: true });
                } catch (e2) {}
            }
            window.location.reload();
        } catch (err) {
            console.error('[SDK] Failed to clear OPFS for dashboard update', err);
        }
    }

    public setLocalStateSetter(setter: (state: any) => void) {
        this.localStateSetter = setter;
    }

    public updateSyncedState(state: any) {
        // Always update local React state immediately (regardless of remote connection)
        if (this.localStateSetter) {
            this.localStateSetter(state);
        }
        this.stateListeners.forEach(cb => cb(state));
        this.sendAction('project:update-state', state);
    }

    public onSyncedStateChange(callback: (state: any) => void) {
        this.stateListeners.push(callback);
        return () => {
            this.stateListeners = this.stateListeners.filter(cb => cb !== callback);
        };
    }

    private async sendPayloadSafely(payload: string) {
        if (!this.hostConn || !this.hostConn.open) return;

        try {
            const CHUNK_SIZE = 32768; // 32KB safe WebRTC DataChannel chunk size
            if (payload.length <= CHUNK_SIZE) {
                this.hostConn.send(payload);
                return;
            }

            const chunkId = 'chk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const totalChunks = Math.ceil(payload.length / CHUNK_SIZE);
            console.log(`[SDK] 📦 Splitting large JSON payload (${Math.round(payload.length / 1024)} KB) into ${totalChunks} chunks (32KB each)...`);

            const dc = (this.hostConn as any).dataChannel as RTCDataChannel | undefined;

            for (let i = 0; i < totalChunks; i++) {
                if (i > 0 && i % 16 === 0) {
                    await new Promise(r => setTimeout(r, 2));
                } else if (dc && dc.bufferedAmount > 128000) {
                    await new Promise(r => setTimeout(r, 10));
                }

                const chunkData = payload.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                const chunkMsg = JSON.stringify({
                    type: 'chunked-message',
                    chunkId,
                    index: i,
                    total: totalChunks,
                    data: chunkData
                });
                this.hostConn.send(chunkMsg);
            }
        } catch (err) {
            console.error('[SDK] ❌ Failed to send payload via PeerJS DataChannel:', err);
        }
    }

    private processIncomingMessage(message: any) {
        if (!message || typeof message !== 'object') return;

        if (message.type === 'chunked-message') {
            const { chunkId, index, total, data } = message;
            if (!chunkId || index === undefined || total === undefined || data === undefined) return;

            let buffer = this.chunkBuffers.get(chunkId);
            if (!buffer) {
                const timer = setTimeout(() => {
                    this.chunkBuffers.delete(chunkId);
                }, 30000);

                const newBuf = { chunks: new Array(total), receivedCount: 0, total, timer };
                this.chunkBuffers.set(chunkId, newBuf);
                buffer = newBuf;
            }

            if (!buffer.chunks[index]) {
                buffer.chunks[index] = data;
                buffer.receivedCount++;
            }

            if (buffer.receivedCount === buffer.total) {
                clearTimeout(buffer.timer);
                const fullPayload = buffer.chunks.join('');
                this.chunkBuffers.delete(chunkId);
                try {
                    const parsed = JSON.parse(fullPayload);
                    this.processIncomingMessage(parsed);
                } catch (err) {
                    console.error('[SDK] Error parsing reassembled chunk JSON payload', err);
                }
            }
            return;
        }

        if (message.type === 'app-action') {
            if (message.message === 'project:update-state') {
                this.stateListeners.forEach(cb => cb(message.data));
            } else if (message.message === 'dashboard-updated') {
                this.handleDashboardUpdated(message.data);
            }

            // Dispatch incoming actions (e.g. ShowTelopOnAir, HideTelopOnAir) to registered action listeners
            const listeners = this.actionListeners.get(message.message);
            if (listeners) {
                listeners.forEach(cb => cb(message.data));
            }
        } else if (message.type === 'sync-state-initial') {
            this.stateListeners.forEach(cb => cb(message.data));
        }
    }

    public onAction(message: string, callback: (data: any) => void) {
        if (!this.actionListeners.has(message)) {
            this.actionListeners.set(message, []);
        }
        this.actionListeners.get(message)!.push(callback);
        return () => {
            const list = this.actionListeners.get(message);
            if (list) {
                this.actionListeners.set(message, list.filter(cb => cb !== callback));
            }
        };
    }

    public dispatchActionLocally(message: string, data?: any) {
        const listeners = this.actionListeners.get(message);
        if (listeners) {
            listeners.forEach(cb => cb(data));
        }
    }

    public async sendAction(message: string, data?: any) {
        // 1. Dispatch locally to current instance action listeners
        this.dispatchActionLocally(message, data);

        // 2. Broadcast via BroadcastChannel (No 5MB LocalStorage limit!)
        if (this.bc) {
            try {
                this.bc.postMessage({ type: 'action', message, data });
            } catch (e) {}
        }

        // 3. Fallback LocalStorage (swallow 5MB QuotaExceededError if payload is multi-megabyte)
        if (typeof window !== 'undefined') {
            try {
                const actionKey = `telop-hub-action-${this.currentProject || 'default'}`;
                localStorage.setItem(actionKey, JSON.stringify({ message, data, _t: Date.now() }));
            } catch (e) {}
        }

        // 4. Send via 32KB safe WebRTC chunking over PeerJS DataChannel if connected to remote host
        if (!this.hostConn || !this.hostConn.open) {
            console.warn('[SDK] ⚠️ Host DataChannel not active. Queued action for remote host:', message);
            this.pendingAppActions.push({ message, data });
            return;
        }

        try {
            const payload = JSON.stringify({ type: 'app-action', message, data });
            await this.sendPayloadSafely(payload);
        } catch (err) {
            console.error('[SDK] ❌ Failed to send payload via PeerJS DataChannel:', err);
        }
    }

    public resolveAssetPath(projectName: string, relativePath: string): string {
        return `/telop-assets/${encodeURIComponent(projectName)}/${relativePath}`;
    }

    /**
     * Proxy fetch through TelopHub server to bypass browser CORS restrictions.
     */
    public async fetchProxy(url: string, options?: { method?: string; headers?: Record<string, string> }): Promise<string> {
        try {
            let baseUrl = '';
            if (this.config && this.config.socketUrl) {
                baseUrl = this.config.socketUrl.replace(/\/$/, '');
            } else if (typeof window !== 'undefined') {
                baseUrl = window.location.origin;
            }
            const endpoint = `${baseUrl}/api/proxy/fetch`;

            console.log(`[SDK] Requesting proxy fetch via ${endpoint} for: ${url}`);
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, options })
            });

            if (!resp.ok) {
                throw new Error(`TelopHub server proxy error (${resp.status}): ${resp.statusText}`);
            }

            const data = await resp.json();
            if (!data.success || data.error) {
                throw new Error(data.error || 'Server proxy fetch failed');
            }

            return data.body;
        } catch (err) {
            console.warn('[SDK] Server proxy fetch failed, attempting direct fetch fallback:', err);
            const directResp = await fetch(url, { method: options?.method || 'GET', headers: options?.headers });
            return await directResp.text();
        }
    }

    public destroy() {
        this.destroyed = true;

        // Clean up client session on the server immediately
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

        if (this.bc) {
            try { this.bc.close(); } catch (e) {}
            this.bc = null;
        }

        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        if (this.hostConn) {
            try { this.hostConn.close(); } catch (e) {}
            this.hostConn = null;
        }
        if (this.peer) {
            try { this.peer.destroy(); } catch (e) {}
            this.peer = null;
        }
    }
}

// --- React Support ---

const TelopHubContext = createContext<{ 
    sdk: TelopHubSDK | null; 
    syncedState: any; 
    syncedStateRef: React.MutableRefObject<any>;
    setSyncedState: React.Dispatch<React.SetStateAction<any>>;
    projectName: string;
    isConnected: boolean;
}>({ 
    sdk: null, 
    syncedState: {}, 
    syncedStateRef: { current: {} },
    setSyncedState: () => {},
    projectName: '',
    isConnected: false 
});

export function cleanBase64Deep(obj: any): any {
    if (typeof obj === 'string') {
        const trimmed = obj.trim();
        if (trimmed.startsWith('data:image')) {
            return trimmed.replace(/[\r\n\s]/g, '');
        }
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(cleanBase64Deep);
    }
    if (obj && typeof obj === 'object') {
        const cleaned: any = {};
        for (const k of Object.keys(obj)) {
            cleaned[k] = cleanBase64Deep(obj[k]);
        }
        return cleaned;
    }
    return obj;
}

function safeDeepMergeState(current: any, incomingRaw: any): any {
    const incoming = cleanBase64Deep(incomingRaw);
    if (!incoming || typeof incoming !== 'object') return current;
    if (!current || typeof current !== 'object') return incoming;

    const result = { ...current };

    Object.keys(incoming).forEach(k => {
        const incVal = incoming[k];
        const curVal = current[k];

        if (incVal === undefined || incVal === null) {
            return;
        }

        const DIRECT_REPLACE_KEYS = ['zigzag', 'set_scores', 'libero_active', 'set_lineups', 'player_points', 'match_events', 'sub_queue'];

        // Object deep merge (e.g. team objects, nested configs) vs direct replacement (discrete state objects)
        if (DIRECT_REPLACE_KEYS.includes(k)) {
            result[k] = incVal;
        } else if (
            typeof incVal === 'object' && !Array.isArray(incVal) &&
            typeof curVal === 'object' && !Array.isArray(curVal)
        ) {
            result[k] = safeDeepMergeState(curVal, incVal);
        } else if (Array.isArray(incVal)) {
            // Anti-destruction guard: preserve current populated array if incoming array is unexpectedly empty
            if (incVal.length === 0 && Array.isArray(curVal) && curVal.length > 0) {
                // Keep current non-empty array
            } else if (Array.isArray(curVal) && curVal.length > 0) {
                // Deep merge array elements (e.g., players) to preserve Base64 photos/logos if incoming items have empty strings
                result[k] = incVal.map((incItem: any, idx: number) => {
                    if (incItem && typeof incItem === 'object') {
                        const curItem = curVal.find((c: any) => c && c.id && incItem.id && c.id === incItem.id) || curVal[idx];
                        if (curItem && typeof curItem === 'object') {
                            return safeDeepMergeState(curItem, incItem);
                        }
                    }
                    return incItem;
                });
            } else {
                result[k] = incVal;
            }
        } else {
            // Anti-destruction guard: preserve long Base64 data URI if incoming string is empty
            if (typeof curVal === 'string' && curVal.length > 100 && (incVal === '' || incVal === undefined || incVal === null)) {
                // Keep existing Base64 photo/logo
            } else {
                result[k] = incVal;
            }
        }
    });

    return result;
}

export class IDBStateStore {
    private static dbPromise: Promise<IDBDatabase> | null = null;

    private static getDB(): Promise<IDBDatabase> {
        if (this.dbPromise) return this.dbPromise;
        this.dbPromise = new Promise((resolve, reject) => {
            if (typeof indexedDB === 'undefined') {
                reject(new Error('IndexedDB not supported'));
                return;
            }
            const req = indexedDB.open('TelopHubStateDB', 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains('states')) {
                    db.createObjectStore('states');
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
        return this.dbPromise;
    }

    public static async setItem(key: string, value: any): Promise<void> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('states', 'readwrite');
                const store = tx.objectStore('states');
                const req = store.put(value, key);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('[IDBStateStore] Failed to save state to IndexedDB:', e);
        }
    }

    public static async getItem(key: string): Promise<any> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('states', 'readonly');
                const store = tx.objectStore('states');
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('[IDBStateStore] Failed to read state from IndexedDB:', e);
            return null;
        }
    }
}

function getInitialSyncedState(providedProjectName?: string): any {
    try {
        if (typeof window === 'undefined') return {};
        const params = new URLSearchParams(window.location.search);
        const proj = providedProjectName || params.get('project') || window.location.pathname.split('/').filter(p => p !== '')[1] || 'default';
        const storageKey = `telop-hub-state-${proj}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                console.log('[SDK Provider] 0ms Synchronous LocalStorage Hydration succeeded:', parsed);
                return parsed;
            }
        }
    } catch (e) {}
    return {};
}

export const TelopHubProvider: React.FC<{ 
    config?: Partial<SDKConfig>; 
    projectName?: string; 
    socket?: any; 
    children: React.ReactNode 
}> = ({ config, projectName: providedProjectName, socket: providedSocket, children }) => {
    const [sdk, setSdk] = useState<TelopHubSDK | null>(null);
    const [syncedState, setSyncedState] = useState<any>(() => getInitialSyncedState(providedProjectName));
    const [isConnected, setIsConnected] = useState(false);
    const [projectName, setProjectName] = useState('');
    // Keep a ref to setSyncedState so the SDK can always call it directly
    const setSyncedStateRef = useRef<(state: any) => void>(setSyncedState);
    useEffect(() => {
        setSyncedStateRef.current = setSyncedState;
    }, [setSyncedState]);

    // syncedStateRef initialized immediately with synchronous LocalStorage cache
    const syncedStateRef = useRef<any>(syncedState);

    useEffect(() => {
        // 1. Auto-inference
        const params = new URLSearchParams(window.location.search);
        const machineId = config?.machineId || params.get('machineId') || localStorage.getItem('telop-hub-machine-id') || '';
        const proj = providedProjectName || params.get('project') || window.location.pathname.split('/').filter(p => p !== '')[1] || '';
        const socketUrl = config?.socketUrl || params.get('hub') || localStorage.getItem('telop-hub-url') || '';
        
        console.log('[SDK Provider] Initializing with:', { machineId, projectName: proj, socketUrl, origin: window.location.origin });
        setProjectName(proj);

        const s = new TelopHubSDK({ ...config, machineId, socketUrl } as SDKConfig);
        if (proj) s.joinProject(proj);
        
        const storageKey = `telop-hub-state-${proj || 'default'}`;

        // Hydrate latest synchronous state again if project inferred
        try {
            const savedLocal = localStorage.getItem(storageKey);
            if (savedLocal) {
                const parsed = JSON.parse(savedLocal);
                if (parsed && typeof parsed === 'object') {
                    const merged = safeDeepMergeState(syncedStateRef.current, parsed);
                    syncedStateRef.current = merged;
                    setSyncedState(merged);
                }
            }
        } catch (e) {}

        // Wire up direct local state setter so every updateSyncedState call immediately updates React.
        s.setLocalStateSetter((state: any) => {
            const merged = safeDeepMergeState(syncedStateRef.current, state);
            syncedStateRef.current = merged;
            setSyncedStateRef.current(merged);
            try {
                localStorage.setItem(storageKey, JSON.stringify(merged));
            } catch (e) {}
            IDBStateStore.setItem(storageKey, merged);
        });
        
        setSdk(s);

        const unsub = s.onSyncedStateChange((serverState) => {
            if (!serverState || typeof serverState !== 'object') return;

            const current = syncedStateRef.current || {};
            const merged = safeDeepMergeState(current, serverState);

            syncedStateRef.current = merged;
            setSyncedState(merged);
            try {
                localStorage.setItem(storageKey, JSON.stringify(merged));
            } catch (e) {}
            IDBStateStore.setItem(storageKey, merged);
        });

        // Hydrate latest state asynchronously from IndexedDB (persists multi-megabyte Base64 images!)
        IDBStateStore.getItem(storageKey).then(idbState => {
            if (idbState && typeof idbState === 'object') {
                console.log('[SDK Provider] 💾 Async IndexedDB Hydration succeeded (with images!):', idbState);
                const current = syncedStateRef.current || {};
                const merged = safeDeepMergeState(current, idbState);
                syncedStateRef.current = merged;
                setSyncedState(merged);
            }
        });

        const unsubConn = s.onConnectionChange((connected) => {
            setIsConnected(connected);
        });

        return () => {
            unsub();
            unsubConn();
            s.destroy();
        };
    }, [config?.machineId, providedProjectName, config?.socketUrl]);

    // Multi-tab (多重起動) real-time LocalStorage event synchronization
    useEffect(() => {
        const storageKey = `telop-hub-state-${projectName || 'default'}`;
        const handleStorageEvent = (e: StorageEvent) => {
            if (e.key === storageKey && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    if (parsed && typeof parsed === 'object') {
                        console.log('[SDK Provider] Multi-tab storage sync triggered:', parsed);
                        const merged = safeDeepMergeState(syncedStateRef.current, parsed);
                        syncedStateRef.current = merged;
                        setSyncedState(merged);
                    }
                } catch (err) {}
            }
        };

        window.addEventListener('storage', handleStorageEvent);
        return () => window.removeEventListener('storage', handleStorageEvent);
    }, [projectName]);

    // Keep syncedStateRef in sync with React state (for external state updates)
    useEffect(() => {
        syncedStateRef.current = syncedState;
    }, [syncedState]);

    return (
        <TelopHubContext.Provider value={{ sdk, syncedState, syncedStateRef, setSyncedState, projectName, isConnected }}>
            {children}
        </TelopHubContext.Provider>
    );
};

export const useTelopHub = () => useContext(TelopHubContext);

export const useConnectionStatus = () => {
    const { isConnected } = useTelopHub();
    return isConnected;
};

export const useSyncedState = <T extends any>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] => {
    const { sdk, syncedState, syncedStateRef } = useTelopHub();
    
    const update = useCallback((val: T | ((prev: T) => T)) => {
        if (sdk) {
            const latestState = syncedStateRef.current || {};
            const currentVal = latestState[key] !== undefined ? latestState[key] : defaultValue;
            const nextVal = typeof val === 'function' ? (val as any)(currentVal) : val;
            const newState = { ...latestState, [key]: nextVal };
            syncedStateRef.current = newState;
            sdk.updateSyncedState(newState);
        }
    }, [sdk, syncedStateRef, key, defaultValue]);

    const value = syncedState[key] !== undefined ? syncedState[key] : defaultValue;
    return [value, update];
};

export const useBulkSyncedState = () => {
    const { sdk, syncedStateRef, setSyncedState, projectName } = useTelopHub();

    const bulkUpdate = useCallback((partialStateMap: Record<string, any>) => {
        if (!partialStateMap || typeof partialStateMap !== 'object') return;

        const storageKey = `telop-hub-state-${projectName || 'default'}`;
        const current = syncedStateRef.current || {};
        const merged = safeDeepMergeState(current, partialStateMap);

        syncedStateRef.current = merged;
        setSyncedState(merged);

        try {
            localStorage.setItem(storageKey, JSON.stringify(merged));
        } catch (e) {}

        IDBStateStore.setItem(storageKey, merged);

        if (sdk) {
            sdk.updateSyncedState(merged);
        }
    }, [sdk, syncedStateRef, setSyncedState, projectName]);

    return bulkUpdate;
};

/**
 * High-level hook for controlling a specific telop.
 * Supports the three core player actions: show, hide, update.
 */
export function useTelop<T = any>(name: string, initialData?: T) {
    const [data, setData] = useSyncedState<T>(name, initialData || {} as T);
    const [isVisible, setIsVisible] = useSyncedState<boolean>(`${name}_visible`, false);
    const { sdk, projectName } = useTelopHub();
    
    const keyWithProject = projectName ? `${projectName}/${name}` : name;

    const show = useCallback((overrideData?: T) => {
        sdk?.sendAction('ShowTelopOnAir', { key: keyWithProject, RenderableObject: overrideData || data });
        setIsVisible(true);
    }, [sdk, keyWithProject, data, setIsVisible]);

    const hide = useCallback(() => {
        sdk?.sendAction('HideTelopOnAir', { key: keyWithProject });
        setIsVisible(false);
    }, [sdk, keyWithProject, setIsVisible]);

    const update = useCallback((overrideData?: T) => {
        sdk?.sendAction('UpdateTelopOnAir', { key: keyWithProject, RenderableObject: overrideData || data });
    }, [sdk, keyWithProject, data]);

    const toggle = useCallback((overrideData?: T) => {
        if (isVisible) {
            hide();
        } else {
            show(overrideData);
        }
    }, [isVisible, show, hide]);

    return { data, setData, show, hide, update, toggle, isVisible };
}

/**
 * Hook for clearing all telops from On-Air and/or Preview players at once.
 * Returns { clearOnAir, clearPreview, clearAll } functions.
 */
export function useClearAll() {
    const { sdk } = useTelopHub();

    const clearOnAir = useCallback(() => {
        sdk?.sendAction('ClearAllTelopOnAir', {});
    }, [sdk]);

    const clearPreview = useCallback(() => {
        sdk?.sendAction('ClearAllTelopPreview', {});
    }, [sdk]);

    const clearAll = useCallback(() => {
        sdk?.sendAction('ClearAllTelopOnAir', {});
        sdk?.sendAction('ClearAllTelopPreview', {});
    }, [sdk]);

    return { clearOnAir, clearPreview, clearAll };
}

/**
 * A background-safe alternative to standard setInterval using Web Workers.
 * Prevents browser throttling when the tab is inactive or hidden.
 */
export function useBackgroundInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const blob = new Blob([
            `
            let timerId = null;
            self.onmessage = function(e) {
                if (e.data.type === 'start') {
                    if (timerId) clearInterval(timerId);
                    timerId = setInterval(() => {
                        self.postMessage('tick');
                    }, e.data.delay);
                } else if (e.data.type === 'stop') {
                    if (timerId) {
                        clearInterval(timerId);
                        timerId = null;
                    }
                }
            };
            `
        ], { type: 'application/javascript' });

        const blobURL = URL.createObjectURL(blob);
        const worker = new Worker(blobURL);

        worker.onmessage = () => {
            savedCallback.current();
        };

        worker.postMessage({ type: 'start', delay });

        return () => {
            worker.postMessage({ type: 'stop' });
            worker.terminate();
            URL.revokeObjectURL(blobURL);
        };
    }, [delay]);
}
