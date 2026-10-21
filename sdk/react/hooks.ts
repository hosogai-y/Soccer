import { useContext, useCallback, useRef, useEffect } from 'react';
import { TelopHubContext } from './TelopHubContext';
import { IDBStateStore } from '../IDBStateStore';
import { safeDeepMergeState, cleanBase64Deep } from '../stateUtils';


export const useTelopHub = () => useContext(TelopHubContext);

export const useConnectionStatus = () => {
    const { isConnected } = useTelopHub();
    return isConnected;
};

export const useMultiConnectionStatus = () => {
    const { isConnected, connectionStates, targetMachineIds } = useTelopHub();
    return {
        isConnected: isConnected || false,
        connectionStates: connectionStates || {},
        machineIds: targetMachineIds || []
    };
};

export const useSyncedState = <T extends any>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] => {
    const { sdk, syncedState, syncedStateRef } = useTelopHub();
    
    const update = useCallback((val: T | ((prev: T) => T)) => {
        if (sdk) {
            const latestState = syncedStateRef.current || {};
            const currentVal = latestState[key] !== undefined ? latestState[key] : defaultValue;
            const nextVal = typeof val === 'function' ? (val as any)(currentVal) : val;

            if (Object.is(currentVal, nextVal)) {
                return;
            }

            // Hand off exact changed key-value pair to SDK for immediate patch batching
            sdk.patchSyncedState({ [key]: nextVal });
        }
    }, [sdk, syncedStateRef, key, defaultValue]);







    const value = syncedState[key] !== undefined ? syncedState[key] : defaultValue;
    return [value, update];
};

export const useBulkSyncedState = () => {
    const { sdk, syncedStateRef, setSyncedState, projectName } = useTelopHub();

    const bulkUpdate = useCallback((partialStateMap: Record<string, any>, forceFullSnapshot: boolean = false) => {
        if (!partialStateMap || typeof partialStateMap !== 'object' || Object.keys(partialStateMap).length === 0) return;

        const storageKey = `telop-hub-state-${projectName || 'default'}`;
        const current = syncedStateRef.current || {};
        const newState = forceFullSnapshot ? cleanBase64Deep(partialStateMap) : safeDeepMergeState(current, partialStateMap);

        if (sdk) {
            sdk.updateSyncedState(newState, forceFullSnapshot);
        } else {
            syncedStateRef.current = newState;
            setSyncedState(newState);
            try {
                localStorage.setItem(storageKey, JSON.stringify(newState));
            } catch (e) {}
            IDBStateStore.setItem(storageKey, newState);
        }
    }, [sdk, syncedStateRef, setSyncedState, projectName]);


    return bulkUpdate;
};

export const useFullSyncedState = () => {
    const bulkUpdate = useBulkSyncedState();
    return useCallback((fullState: Record<string, any>) => {
        bulkUpdate(fullState, true);
    }, [bulkUpdate]);
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

export const useIsSyncingSnapshot = (): boolean => {
    const { isSyncingSnapshot } = useTelopHub();
    return !!isSyncingSnapshot;
};

