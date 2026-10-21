import { TelopHubSDK } from '../TelopHubClient';
import { computeStateChecksum } from '../stateUtils';

export class StateManager {
    private client: TelopHubSDK;
    private currentRev: number = 0;
    private stateListeners: ((state: any) => void)[] = [];
    private patchListeners: ((patch: { rev: number; changes: Record<string, any>; checksum: string; senderId: string }) => void)[] = [];
    private localStateSetter: ((state: any) => void) | null = null;
    private localStateGetter: (() => any) | null = null;
    private pendingPatchChanges: Record<string, any> = {};
    private isPatchMicrotaskScheduled = false;
    private fullSaveTimer: any = null;

    constructor(client: TelopHubSDK) {
        this.client = client;
    }

    public setLocalStateSetter(setter: (state: any) => void) {
        this.localStateSetter = setter;
    }

    public setLocalStateGetter(getter: () => any) {
        this.localStateGetter = getter;
    }

    public getRevision(): number {
        return this.currentRev;
    }

    public setRevision(rev: number) {
        if (typeof rev === 'number' && !isNaN(rev)) {
            this.currentRev = rev;
        }
    }

    public onSyncedStateChange(callback: (state: any) => void) {
        this.stateListeners.push(callback);
        return () => {
            this.stateListeners = this.stateListeners.filter(cb => cb !== callback);
        };
    }

    public onSyncedPatch(callback: (patch: { rev: number; changes: Record<string, any>; checksum: string; senderId: string }) => void) {
        this.patchListeners.push(callback);
        return () => {
            this.patchListeners = this.patchListeners.filter(cb => cb !== callback);
        };
    }

    public notifyStateListeners(state: any) {
        this.stateListeners.forEach(cb => cb(state));
    }

    public notifyPatchListeners(patch: any) {
        this.patchListeners.forEach(cb => cb(patch));
    }

    public patchSyncedState(changes: Record<string, any>) {
        if (!changes || typeof changes !== 'object' || Object.keys(changes).length === 0) return;

        if (this.localStateSetter) {
            this.localStateSetter(changes);
        }

        Object.assign(this.pendingPatchChanges, changes);

        if (!this.isPatchMicrotaskScheduled) {
            this.isPatchMicrotaskScheduled = true;
            queueMicrotask(() => {
                this.isPatchMicrotaskScheduled = false;
                if (Object.keys(this.pendingPatchChanges).length > 0 && !this.client.isDestroyed) {
                    const finalChanges = { ...this.pendingPatchChanges };
                    this.pendingPatchChanges = {};

                    this.currentRev++;
                    const currentState = this.localStateGetter ? this.localStateGetter() : {};
                    const checksum = computeStateChecksum(currentState);

                    const patchPayload = {
                        rev: this.currentRev,
                        changes: finalChanges,
                        checksum,
                        senderId: this.client.myId
                    };

                    console.log(`[SDK Engine] ⚡ Patch (${Object.keys(finalChanges).join(', ')}) sent (rev: ${this.currentRev})`);
                    this.client.actionDispatcher.sendAction('project:patch-state', patchPayload);
                    
                    if (this.fullSaveTimer) clearTimeout(this.fullSaveTimer);
                    this.fullSaveTimer = setTimeout(() => {
                        if (!this.client.isDestroyed) {
                            const fullState = this.localStateGetter ? this.localStateGetter() : {};
                            fullState._rev = this.currentRev;
                            this.client.actionDispatcher.sendAction('project:update-state', fullState);
                        }
                    }, 2000);
                }
            });
        }
    }

    public updateSyncedState(state: any, forceFullSnapshot: boolean = false) {
        if (!state || typeof state !== 'object') return;

        if (this.localStateSetter) {
            this.localStateSetter(state);
        }

        if (forceFullSnapshot) {
            this.currentRev++;
            console.log(`[SDK Engine] 🔄 Broadcasting Full Snapshot (rev: ${this.currentRev})`);
            this.client.actionDispatcher.dispatchActionLocally('project:start-full-snapshot', { senderId: this.client.myId });
            this.client.actionDispatcher.sendAction('project:start-full-snapshot', { senderId: this.client.myId });

            const payload = { ...state, _rev: this.currentRev, _senderId: this.client.myId };
            (async () => {
                try {
                    await this.client.actionDispatcher.sendAction('project:update-state', payload);
                } finally {
                    this.client.actionDispatcher.sendAction('project:finish-full-snapshot', { senderId: this.client.myId });
                    this.client.actionDispatcher.dispatchActionLocally('project:finish-full-snapshot', { senderId: this.client.myId });
                }
            })();
        } else {
            this.patchSyncedState(state);
        }
    }
}
