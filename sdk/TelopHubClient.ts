import { DataConnection } from 'peerjs';
import { SDKConfig } from './types';
import { ConnectionManager } from './managers/ConnectionManager';
import { StateManager } from './managers/StateManager';
import { ActionDispatcher } from './managers/ActionDispatcher';
import { AssetManager } from './managers/AssetManager';

export class TelopHubSDK {
    public myId: string;
    public hostConns: Map<string, DataConnection> = new Map();
    public targetMachineIds: string[] = [];
    public config: SDKConfig;
    public currentProject: string | null = null;
    public isDestroyed = false;
    public pendingAppActions: any[] = [];
    public actionListeners: Map<string, Array<(data: any) => void>> = new Map();

    public connectionManager: ConnectionManager;
    public stateManager: StateManager;
    public actionDispatcher: ActionDispatcher;
    public assetManager: AssetManager;

    private connectionListeners: ((connected: boolean, states?: Record<string, boolean>) => void)[] = [];

    // Backward compatibility getter for single host connection
    public get hostConn(): DataConnection | null {
        for (const conn of this.hostConns.values()) {
            if (conn && conn.open) return conn;
        }
        return null;
    }

    constructor(config: SDKConfig) {
        this.config = config;
        this.myId = crypto.randomUUID();
        this.targetMachineIds = this.parseMachineIds(config.machineId || config.machineIds);

        this.connectionManager = new ConnectionManager(this);
        this.stateManager = new StateManager(this);
        this.actionDispatcher = new ActionDispatcher(this);
        this.assetManager = new AssetManager(this);

        this.connectionManager.initPeer();

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                this.destroy();
            });
        }
    }

    private parseMachineIds(input?: string | string[]): string[] {
        if (!input) return [];
        if (Array.isArray(input)) return input.map(s => String(s).trim()).filter(Boolean);
        return String(input).split(',').map(s => s.trim()).filter(Boolean);
    }

    public isConnected(): boolean {
        for (const conn of this.hostConns.values()) {
            if (conn && conn.open) return true;
        }
        return false;
    }

    public getConnectionStates(): Record<string, boolean> {
        const states: Record<string, boolean> = {};
        this.targetMachineIds.forEach((machineId) => {
            const conn = this.hostConns.get(machineId);
            states[machineId] = conn ? conn.open : false;
        });
        return states;
    }

    public getTargetMachineIds(): string[] {
        return [...this.targetMachineIds];
    }

    private lastRequestStateTime = 0;

    public requestState() {
        const now = Date.now();
        if (now - this.lastRequestStateTime < 5000) {
            console.log('[SDK] ⏳ requestState throttled (preventing spam within 5s)');
            return;
        }
        this.lastRequestStateTime = now;
        console.log('[SDK] 📥 Requesting active state snapshot from host dashboard...');
        this.actionDispatcher.sendAction('project:request-state', { senderId: this.myId });
    }

    public onConnectionChange(callback: (connected: boolean, states: Record<string, boolean>) => void) {
        this.connectionListeners.push(callback as any);
        callback(this.isConnected(), this.getConnectionStates());
        return () => {
            this.connectionListeners = this.connectionListeners.filter(cb => cb !== (callback as any));
        };
    }

    public notifyConnectionListeners() {
        const connected = this.isConnected();
        const states = this.getConnectionStates();
        this.connectionListeners.forEach(cb => cb(connected, states as any));
    }

    public joinProject(projectName: string) {
        this.currentProject = projectName;
        this.actionDispatcher.setupLocalBroadcast(projectName);
    }

    public setLocalStateSetter(setter: (state: any) => void) {
        this.stateManager.setLocalStateSetter(setter);
    }

    public setLocalStateGetter(getter: () => any) {
        this.stateManager.setLocalStateGetter(getter);
    }

    public getRevision(): number {
        return this.stateManager.getRevision();
    }

    public setRevision(rev: number) {
        this.stateManager.setRevision(rev);
    }

    public setLastSentState(state: any) {
        // Obsolete in new architecture, kept for backwards compatibility
    }

    public patchSyncedState(changes: Record<string, any>) {
        this.stateManager.patchSyncedState(changes);
    }

    public updateSyncedState(state: any, forceFullSnapshot: boolean = false) {
        this.stateManager.updateSyncedState(state, forceFullSnapshot);
    }

    public updateState(state: any) {
        this.stateManager.updateSyncedState(state);
    }

    public onSyncedStateChange(callback: (state: any) => void) {
        return this.stateManager.onSyncedStateChange(callback);
    }

    public onSyncedPatch(callback: (patch: { rev: number; changes: Record<string, any>; checksum: string; senderId: string }) => void) {
        return this.stateManager.onSyncedPatch(callback);
    }

    public onAction(message: string, callback: (data: any) => void) {
        return this.actionDispatcher.onAction(message, callback);
    }

    public dispatchActionLocally(message: string, data?: any) {
        this.actionDispatcher.dispatchActionLocally(message, data);
    }

    public async sendAction(message: string, data?: any) {
        return this.actionDispatcher.sendAction(message, data);
    }

    public resolveAssetPath(projectName: string, relativePath: string): string {
        return `/telop-assets/${encodeURIComponent(projectName)}/${relativePath}`;
    }

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

    public async uploadAsset(file: Blob | File, destPath: string): Promise<string> {
        return this.assetManager.uploadAsset(file, destPath);
    }

    public gcAssets(activeUrls: string[]) {
        this.assetManager.gcAssets(activeUrls);
    }

    public destroy() {
        this.isDestroyed = true;
        this.actionDispatcher.destroy();
        this.connectionManager.destroy();
    }
}
