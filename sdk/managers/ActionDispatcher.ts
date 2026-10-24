import { DataConnection } from 'peerjs';
import { TelopHubSDK } from '../TelopHubClient';
import { SendActionOptions } from '../types';

export class ActionDispatcher {
    private client: TelopHubSDK;
    private processedActionIds: Set<string> = new Set();
    private chunkBuffers: Map<string, { chunks: string[]; receivedCount: number; total: number; timer: any }> = new Map();
    private bcs: BroadcastChannel[] = [];
    private storageListener: ((e: StorageEvent) => void) | null = null;
    
    constructor(client: TelopHubSDK) {
        this.client = client;
    }

    public onAction(message: string, callback: (data: any) => void) {
        if (!this.client.actionListeners.has(message)) {
            this.client.actionListeners.set(message, []);
        }
        this.client.actionListeners.get(message)!.push(callback);
        return () => {
            const list = this.client.actionListeners.get(message);
            if (list) {
                this.client.actionListeners.set(message, list.filter(cb => cb !== callback));
            }
        };
    }

    public dispatchActionLocally(message: string, data?: any) {
        if (message === 'project:update-state') {
            if (data && typeof data._rev === 'number') {
                this.client.stateManager.setRevision(Math.max(this.client.stateManager.getRevision(), data._rev));
            }
            this.client.stateManager.notifyStateListeners(data);
        } else if (message === 'project:patch-state') {
            if (data && typeof data === 'object') {
                if (data.senderId && data.senderId === this.client.myId) {
                    return;
                }
                this.client.stateManager.notifyPatchListeners(data);
                if (typeof data.rev === 'number') {
                    this.client.stateManager.setRevision(Math.max(this.client.stateManager.getRevision(), data.rev));
                }
            }
        }

        const listeners = this.client.actionListeners.get(message);
        if (listeners) {
            listeners.forEach(cb => cb(data));
        }
    }

    public async sendAction(message: string, data?: any, options?: SendActionOptions) {
        const targets = this.normalizeTargets(options?.targets);
        const actionId = 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        this.processedActionIds.add(actionId);

        // 1. Dispatch locally to current instance action listeners
        this.dispatchActionLocally(message, data);

        // 2. Broadcast via all bound BroadcastChannels
        if (this.bcs && this.bcs.length > 0) {
            this.bcs.forEach(ch => {
                try {
                    ch.postMessage({ type: 'action', actionId, message, data });
                } catch (e) {}
            });
        }

        // 3. Fallback LocalStorage
        if (typeof window !== 'undefined' && message !== 'project:patch-state' && message !== 'project:state-response' && message !== 'project:update-state') {
            const clean = (this.client.currentProject || 'default').replace(/^Telops\//, '');
            const variants = Array.from(new Set([this.client.currentProject || 'default', clean, `Telops/${clean}`])).filter(Boolean);
            variants.forEach(variant => {
                try {
                    const actionKey = `telop-hub-action-${variant}`;
                    localStorage.setItem(actionKey, JSON.stringify({ actionId, message, data, _t: Date.now() }));
                } catch (e) {}
            });
        }

        // 4. Send via WebRTC chunking over PeerJS DataChannels
        if (targets && targets.length === 0) {
            console.warn('[SDK] ⚠️ sendAction: targets is empty. Not sent to any host:', message);
            return;
        }
        if (!this.hasOpenConn(targets)) {
            const where = targets ? ` (${targets.join(', ')})` : '';
            console.warn(`[SDK] ⚠️ Host DataChannel not active${where}. Queued action for remote host:`, message);
            this.client.pendingAppActions.push({ actionId, message, data, targets });
            return;
        }

        try {
            const payload = JSON.stringify({ type: 'app-action', actionId, message, data });
            const sizeKB = Math.round(payload.length / 1024);
            if (sizeKB > 32) {
                console.log(`[SDK] 📡 sendAction: ${message} (Large: ${sizeKB} KB)`);
            }
            await this.sendPayloadSafely(payload, targets);
            // 宛先がまだつながっていない宛先指定の分は、つながったときに送るので残す
            this.client.pendingAppActions = this.client.pendingAppActions.filter(
                (p) => p.targets && !p.targets.every((id: string) => this.isConnOpen(id))
            );
        } catch (err) {
            console.error('[SDK] ❌ Failed to send payload via PeerJS DataChannel:', err);
        }
    }

    /**
     * 宛先を整える。省略なら undefined（全ホスト宛て）。
     * 接続先に入っていない ID はつながることがなく、キューに残り続けるので、警告して外す
     */
    private normalizeTargets(targets?: string[]): string[] | undefined {
        if (!targets) return undefined;
        const ids = Array.from(new Set(targets.map((s) => String(s).trim()).filter(Boolean)));
        const unknown = ids.filter((id) => !this.client.targetMachineIds.includes(id));
        if (unknown.length > 0) {
            console.warn(`[SDK] ⚠️ sendAction: ignoring unknown target machine ID(s): ${unknown.join(', ')}`);
        }
        return ids.filter((id) => this.client.targetMachineIds.includes(id));
    }

    private isConnOpen(machineId: string): boolean {
        const conn = this.client.hostConns.get(machineId);
        return !!(conn && conn.open);
    }

    private hasOpenConn(targets?: string[]): boolean {
        if (!targets) return this.client.isConnected();
        return targets.some((id) => this.isConnOpen(id));
    }

    private async sendPayloadSafely(payload: string, targets?: string[]) {
        const sends: Promise<void>[] = [];
        for (const [machineId, conn] of this.client.hostConns.entries()) {
            if (targets && !targets.includes(machineId)) continue;
            if (conn && conn.open) {
                sends.push(this.sendPayloadSafelyToConn(conn, payload));
            }
        }
        if (sends.length === 0) {
            console.warn('[SDK] ⚠️ No active host DataChannel connection to send payload.');
        } else {
            await Promise.all(sends);
        }
    }

    public async sendPayloadSafelyToConn(conn: DataConnection, payload: string) {
        if (!conn || !conn.open) return;
        const dc = (conn as any).dataChannel as RTCDataChannel | undefined;

        if (dc && dc.bufferedAmount > 65536) {
            let waitCount = 0;
            while (dc && dc.bufferedAmount > 32768 && waitCount < 20 && conn.open) {
                await new Promise(r => setTimeout(r, 10));
                waitCount++;
            }
        }

        if (!conn || !conn.open) return;

        try {
            const CHUNK_SIZE = 32768;
            if (payload.length <= CHUNK_SIZE) {
                conn.send(payload);
                return;
            }

            const chunkId = 'chk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const totalChunks = Math.ceil(payload.length / CHUNK_SIZE);
            const targetPeer = conn.peer || 'peer';
            console.log(`[SDK] 📦 Splitting large JSON payload (${Math.round(payload.length / 1024)} KB) into ${totalChunks} chunks (32KB each) for ${targetPeer}...`);

            for (let i = 0; i < totalChunks; i++) {
                if (!conn || !conn.open) break;

                if (i > 0 && i % 16 === 0) {
                    await new Promise(r => setTimeout(r, 2));
                } else if (dc && dc.bufferedAmount > 65536) {
                    await new Promise(r => setTimeout(r, 10));
                }

                if (!conn || !conn.open) break;

                const chunkData = payload.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                const chunkMsg = JSON.stringify({
                    type: 'chunked-message',
                    chunkId,
                    index: i,
                    total: totalChunks,
                    data: chunkData
                });
                conn.send(chunkMsg);
            }
        } catch (err) {
            console.error('[SDK] ❌ Failed to send payload via PeerJS DataChannel:', err);
        }
    }

    public processIncomingMessage(message: any) {
        if (!message || typeof message !== 'object') return;
        if (message.type === 'ping') return;

        if (message.type === 'chunked-message') {
            const { chunkId, index, total, data } = message;
            if (!chunkId || index === undefined || total === undefined || data === undefined) return;

            let buffer = this.chunkBuffers.get(chunkId);
            if (!buffer) {
                this.dispatchActionLocally('project:start-full-snapshot', { senderId: 'system' });
                const timer = setTimeout(() => {
                    this.chunkBuffers.delete(chunkId);
                    this.dispatchActionLocally('project:finish-full-snapshot', { senderId: 'system' });
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
                this.dispatchActionLocally('project:finish-full-snapshot', { senderId: 'system' });
            }
            return;
        }

        if (message.type === 'app-action') {
            if (message.actionId) {
                if (this.processedActionIds.has(message.actionId)) {
                    return;
                }
                this.processedActionIds.add(message.actionId);
                if (this.processedActionIds.size > 500) {
                    const first = this.processedActionIds.values().next().value;
                    if (first) this.processedActionIds.delete(first);
                }
            }

            if (message.message === 'project:update-state') {
                if (message.data && typeof message.data._rev === 'number') {
                    this.client.stateManager.setRevision(Math.max(this.client.stateManager.getRevision(), message.data._rev));
                }
                this.client.stateManager.notifyStateListeners(message.data);
            } else if (message.message === 'project:patch-state') {
                const patch = message.data;
                if (patch && typeof patch === 'object') {
                    if (patch.senderId && patch.senderId === this.client.myId) {
                        return;
                    }
                    this.client.stateManager.notifyPatchListeners(patch);
                    if (typeof patch.rev === 'number') {
                        this.client.stateManager.setRevision(Math.max(this.client.stateManager.getRevision(), patch.rev));
                    }
                }
            } else if (message.message === 'dashboard-updated') {
                this.handleDashboardUpdated(message.data);
            }

            const listeners = this.client.actionListeners.get(message.message);
            if (listeners) {
                listeners.forEach(cb => cb(message.data));
            }
        } else if (message.type === 'sync-state-initial') {
            this.client.stateManager.notifyStateListeners(message.data);
        }
    }

    public setupLocalBroadcast(projectName: string) {
        if (typeof window !== 'undefined') {
            this.bcs.forEach(ch => {
                try { ch.close(); } catch (e) {}
            });
            this.bcs = [];

            const clean = projectName.replace(/^Telops\//, '');
            const variants = Array.from(new Set([projectName, clean, `Telops/${clean}`])).filter(Boolean);

            if (typeof BroadcastChannel !== 'undefined') {
                variants.forEach(variant => {
                    try {
                        const ch = new BroadcastChannel(`telop-hub-bc-${variant}`);
                        ch.onmessage = (e) => {
                            if (!e.data || typeof e.data !== 'object') return;
                            if (e.data.actionId) {
                                if (this.processedActionIds.has(e.data.actionId)) return;
                                this.processedActionIds.add(e.data.actionId);
                            }
                            if (e.data.type === 'action') {
                                this.dispatchActionLocally(e.data.message, e.data.data);
                            } else if (e.data.type === 'state') {
                                this.client.stateManager.notifyStateListeners(e.data.state);
                            }
                        };
                        this.bcs.push(ch);
                    } catch (err) {}
                });
            }

            if (this.storageListener) {
                window.removeEventListener('storage', this.storageListener);
                this.storageListener = null;
            }
            this.storageListener = (e: StorageEvent) => {
                if (!e.key || !e.newValue) return;
                const matchAction = variants.some(v => e.key === `telop-hub-action-${v}`);
                if (matchAction) {
                    try {
                        const parsed = JSON.parse(e.newValue);
                        if (parsed && parsed.actionId) {
                            if (this.processedActionIds.has(parsed.actionId)) return;
                            this.processedActionIds.add(parsed.actionId);
                        }
                        if (parsed && parsed.message) {
                            this.dispatchActionLocally(parsed.message, parsed.data);
                        }
                    } catch (err) {}
                    return;
                }
            };
            window.addEventListener('storage', this.storageListener);
        }
    }

    private async handleDashboardUpdated(data: { projectName: string }) {
        console.log('[SDK] 🔄 Project dashboard update detected! Re-syncing...');
        const proj = data.projectName || this.client.currentProject;
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

    public destroy() {
        this.bcs.forEach(ch => {
            try { ch.close(); } catch (e) {}
        });
        this.bcs = [];

        if (this.storageListener && typeof window !== 'undefined') {
            window.removeEventListener('storage', this.storageListener);
            this.storageListener = null;
        }
    }
}
