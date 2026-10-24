import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { TelopHubSDK } from '../TelopHubClient';
import { SDKConfig, TelopHubContextType } from '../types';
import { IDBStateStore } from '../IDBStateStore';
import { safeDeepMergeState, getInitialSyncedState, computeStateChecksum, cleanBase64Deep } from '../stateUtils';


export const TelopHubContext = createContext<TelopHubContextType>({ 
    sdk: null, 
    syncedState: {}, 
    syncedStateRef: { current: {} },
    setSyncedState: () => {},
    projectName: '',
    isConnected: false,
    connectionStates: {},
    targetMachineIds: [],
    isSyncingSnapshot: false,
    uploadAsset: () => Promise.resolve(''),
    gcAssets: () => Promise.resolve(null)
});

export const TelopHubProvider: React.FC<{ 
    config?: Partial<SDKConfig>; 
    projectName?: string; 
    socket?: any; 
    children: React.ReactNode 
}> = ({ config, projectName: providedProjectName, socket: providedSocket, children }) => {
    const [sdk, setSdk] = useState<TelopHubSDK | null>(null);
    const [syncedState, setSyncedState] = useState<any>(() => getInitialSyncedState(providedProjectName));
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStates, setConnectionStates] = useState<Record<string, boolean>>({});
    const [targetMachineIds, setTargetMachineIds] = useState<string[]>([]);
    const [projectName, setProjectName] = useState('');
    
    // Keep a ref to setSyncedState so the SDK can always call it directly
    const setSyncedStateRef = useRef<(state: any) => void>(setSyncedState);
    useEffect(() => {
        setSyncedStateRef.current = setSyncedState;
    }, [setSyncedState]);

    // syncedStateRef initialized immediately with synchronous LocalStorage cache
    const syncedStateRef = useRef<any>(syncedState);

    const [isSyncingSnapshot, setIsSyncingSnapshot] = useState<boolean>(false);

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

        let pendingStorageState: any = null;
        let isStorageMicrotaskScheduled = false;
        const scheduleStorageSave = (stateToSave: any) => {
            pendingStorageState = stateToSave;
            if (!isStorageMicrotaskScheduled) {
                isStorageMicrotaskScheduled = true;
                queueMicrotask(() => {
                    isStorageMicrotaskScheduled = false;
                    if (pendingStorageState !== null) {
                        const finalToSave = pendingStorageState;
                        pendingStorageState = null;
                        try {
                            localStorage.setItem(storageKey, JSON.stringify(finalToSave));
                        } catch (e) {}
                        IDBStateStore.setItem(storageKey, finalToSave);
                    }
                });
            }
        };

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
        s.setLocalStateSetter((updater: any) => {
            setSyncedState((prev: any) => {
                const next = typeof updater === 'function' ? updater(prev) : updater;
                if (next && typeof next === 'object') {
                    const current = syncedStateRef.current || {};
                    const merged = safeDeepMergeState(current, next);
                    syncedStateRef.current = merged;
                    scheduleStorageSave(merged);
                    return merged;
                }
                return prev;
            });
        });

        s.setLocalStateGetter(() => syncedStateRef.current || {});
        
        setSdk(s);

        const isNetworkStateReceivedRef = { current: false };

        const unsubStart = s.onAction('project:start-full-snapshot', () => {
            console.log('[SDK Provider] 🔒 Full snapshot transfer started. Locking UI...');
            setIsSyncingSnapshot(true);
        });

        const unsubFinish = s.onAction('project:finish-full-snapshot', () => {
            console.log('[SDK Provider] 🔓 Full snapshot transfer finished. Unlocking UI...');
            setIsSyncingSnapshot(false);
        });

        const unsub = s.onSyncedStateChange((serverState) => {
            if (!serverState || typeof serverState !== 'object') return;

            isNetworkStateReceivedRef.current = true;
            console.log('[SDK Provider] 📦 Full snapshot received, updating local state...');
            const cleaned = cleanBase64Deep(serverState);

            syncedStateRef.current = cleaned;
            setSyncedState(cleaned);
            scheduleStorageSave(cleaned);
            setIsSyncingSnapshot(false);
        });

        const unsubPatch = s.onSyncedPatch((patch) => {
            if (!patch || !patch.changes || typeof patch.changes !== 'object') return;

            isNetworkStateReceivedRef.current = true;
            const current = syncedStateRef.current || {};
            const merged = safeDeepMergeState(current, patch.changes);

            syncedStateRef.current = merged;
            setSyncedState(merged);
            scheduleStorageSave(merged);

            const changeKeys = Object.keys(patch.changes).join(', ');
            console.log(`[SDK Provider] ⚡ Patch received (${changeKeys}) (rev: ${patch.rev})`);
        });

        // Respond to incoming state requests from remote nodes (LOCAL dispatch only to prevent flooding WebRTC with multi-MB full state)
        const unsubReq = s.onAction('project:request-state', (data) => {
            if (data && data.senderId && data.senderId === s.myId) {
                return;
            }
            if (syncedStateRef.current && Object.keys(syncedStateRef.current).length > 0) {
                console.log('[SDK Provider] 📤 Remote state request received, dispatching state response locally...');
                // Use dispatchActionLocally instead of sendAction to avoid sending multi-MB full state
                // (including Base64 images) over WebRTC to all hubs, which would overflow the DataChannel buffer
                s.dispatchActionLocally('project:state-response', syncedStateRef.current);
            }
        });

        // Handle targeted state response from remote node
        const unsubStateResp = s.onAction('project:state-response', (incomingState) => {
            if (!incomingState || typeof incomingState !== 'object') return;
            console.log('[SDK Provider] 📦 Initial state response received from remote node, updating local state...');
            isNetworkStateReceivedRef.current = true;
            const cleaned = cleanBase64Deep(incomingState);
            syncedStateRef.current = cleaned;
            setSyncedState(cleaned);
            scheduleStorageSave(cleaned);
            setIsSyncingSnapshot(false);
        });

        // Hydrate latest state asynchronously from IndexedDB, but NEVER overwrite if remote state arrived first!
        IDBStateStore.getItem(storageKey).then(idbState => {
            if (idbState && typeof idbState === 'object' && !isNetworkStateReceivedRef.current) {
                console.log('[SDK Provider] 💾 Async IndexedDB Hydration succeeded:', idbState);
                const current = syncedStateRef.current || {};
                const merged = safeDeepMergeState(current, idbState);
                syncedStateRef.current = merged;
                setSyncedState(merged);
            }
        });

        const hasRequestedInitialStateRef = { current: false };

        const unsubConn = s.onConnectionChange((connected, states) => {
            setIsConnected(connected);
            setConnectionStates(states || {});
            setTargetMachineIds(s.getTargetMachineIds());

            // Only request active state snapshot ONCE on initial fresh connection if local state is uninitialized
            if (connected && !hasRequestedInitialStateRef.current && (!syncedStateRef.current || Object.keys(syncedStateRef.current).length === 0)) {
                hasRequestedInitialStateRef.current = true;
                console.log('[SDK Provider] 🔌 Initial connection with empty state. Requesting active state snapshot...');
                s.requestState();
            }
        });




        return () => {
            unsub();
            unsubPatch();
            unsubConn();
            unsubReq();
            unsubStateResp();
            unsubStart();
            unsubFinish();
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

    // Memoize the uploadAsset and gcAssets handlers
    const uploadAsset = useCallback((file: Blob | File, destPath: string) => {
        return sdk ? sdk.uploadAsset(file, destPath) : Promise.resolve('');
    }, [sdk]);
    const gcAssets = useCallback((activeUrls: string[], options?: { dryRun?: boolean; timeoutMs?: number }) => {
        return sdk ? sdk.gcAssets(activeUrls, options) : Promise.resolve(null);
    }, [sdk]);

    return (
        <TelopHubContext.Provider value={{ sdk, syncedState, syncedStateRef, setSyncedState, projectName, isConnected, connectionStates, targetMachineIds, isSyncingSnapshot, uploadAsset, gcAssets }}>
            {children}
        </TelopHubContext.Provider>
    );

};
