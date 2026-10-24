import { useContext, useCallback, useRef, useEffect, useState } from 'react';
import { TelopHubContext } from './TelopHubContext';
import { IDBStateStore } from '../IDBStateStore';
import { safeDeepMergeState, cleanBase64Deep } from '../stateUtils';
import type { RelayStatus, RelayStreamHandlers, RelayStreamOptions, SerialPortInfo, SerialRelayTarget, TcpRelayTarget } from '../relay';


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





/** show / update に渡すデータ。関数ならマシン ID ごとに呼んで、そのマシンにだけ送る */
export type TelopData<T> = T | ((machineId: string) => T);

export interface UseTelopOptions {
    /** マシン ID ごとに使うテロップ名（例: 英語のマシンだけ `${name}_EN`）。省略なら全マシンで name */
    resolveName?: (machineId: string) => string;
}

/**
 * High-level hook for controlling a specific telop.
 * Supports the three core player actions: show, hide, update.
 * データに関数を渡すか resolveName を指定すると、接続先のマシンごとに中身・テロップ名を変えて送る。
 */
export function useTelop<T = any>(name: string, initialData?: T, options?: UseTelopOptions) {
    const [data, setData] = useSyncedState<T>(name, initialData || {} as T);
    const [isVisible, setIsVisible] = useSyncedState<boolean>(`${name}_visible`, false);
    const { sdk, projectName } = useTelopHub();
    const resolveName = options?.resolveName;

    const keyFor = useCallback((telopName: string) => (
        projectName ? `${projectName}/${telopName}` : telopName
    ), [projectName]);

    /**
     * マシンごとに送る必要があればマシンごと、なければ全マシンへ 1 回送る。
     * 接続先が無い（machineId 未指定）ときは、関数は machineId '' で呼ぶ
     */
    const sendTelop = useCallback((message: string, payloadData?: TelopData<T>) => {
        if (!sdk) return;
        const withData = (machineId: string, telopName: string) => {
            const payload: any = { key: keyFor(telopName) };
            if (message !== 'HideTelopOnAir') {
                const resolved = typeof payloadData === 'function'
                    ? (payloadData as (id: string) => T)(machineId)
                    : (payloadData || data);
                payload.RenderableObject = resolved;
            }
            return payload;
        };

        const machineIds: string[] = sdk.getTargetMachineIds();
        const perMachine = typeof payloadData === 'function' || !!resolveName;
        if (!perMachine || machineIds.length === 0) {
            sdk.sendAction(message, withData('', resolveName ? resolveName('') : name));
            return;
        }
        machineIds.forEach((machineId) => {
            const telopName = resolveName ? resolveName(machineId) : name;
            sdk.sendAction(message, withData(machineId, telopName), { targets: [machineId] });
        });
    }, [sdk, keyFor, name, resolveName, data]);

    const show = useCallback((overrideData?: TelopData<T>) => {
        sendTelop('ShowTelopOnAir', overrideData);
        setIsVisible(true);
    }, [sendTelop, setIsVisible]);

    const hide = useCallback(() => {
        sendTelop('HideTelopOnAir');
        setIsVisible(false);
    }, [sendTelop, setIsVisible]);

    const update = useCallback((overrideData?: TelopData<T>) => {
        sendTelop('UpdateTelopOnAir', overrideData);
    }, [sendTelop]);

    const toggle = useCallback((overrideData?: TelopData<T>) => {
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

export interface RelayStreamState {
    status: RelayStatus;
    /** Why the last attempt failed or the stream dropped (cleared once connected) */
    message?: string;
}

/**
 * Keeps a relay stream open while `target` is set; reconnects when the target's settings change.
 * Handlers are read through a ref, so passing new callbacks on every render does not reconnect.
 */
function useRelayStream<T extends object>(
    kind: 'tcp' | 'serial',
    target: T | null | undefined,
    handlers: RelayStreamHandlers,
    options?: RelayStreamOptions,
): RelayStreamState {
    const { sdk } = useTelopHub();
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;
    const [state, setState] = useState<RelayStreamState>({ status: 'closed' });

    const targetKey = target ? JSON.stringify(target) : '';
    const encoding = options?.encoding;
    const reconnectMs = options?.reconnectMs;
    const maxReconnectMs = options?.maxReconnectMs;

    useEffect(() => {
        if (!sdk || !targetKey) {
            setState({ status: 'closed' });
            return;
        }
        const parsed = JSON.parse(targetKey);
        const relayHandlers: RelayStreamHandlers = {
            onData: (chunk) => handlersRef.current.onData?.(chunk),
            onStatus: (status, message) => {
                setState({ status, message: status === 'open' ? undefined : message });
                handlersRef.current.onStatus?.(status, message);
            },
        };
        // Only decode when the caller wants text (checked when the stream opens)
        if (handlersRef.current.onText) {
            relayHandlers.onText = (text) => handlersRef.current.onText?.(text);
        }
        const relayOptions = { encoding, reconnectMs, maxReconnectMs };
        const stream = kind === 'tcp'
            ? sdk.openTcpStream(parsed, relayHandlers, relayOptions)
            : sdk.openSerialStream(parsed, relayHandlers, relayOptions);
        return () => stream.close();
    }, [sdk, kind, targetKey, encoding, reconnectMs, maxReconnectMs]);

    return state;
}

/** Reads a TCP server through the TelopHub server while `target` is set (pass null to disconnect) */
export function useTcpStream(target: TcpRelayTarget | null | undefined, handlers: RelayStreamHandlers, options?: RelayStreamOptions) {
    return useRelayStream('tcp', target, handlers, options);
}

/** Reads a serial port of the TelopHub machine while `target` is set (pass null to disconnect) */
export function useSerialStream(target: SerialRelayTarget | null | undefined, handlers: RelayStreamHandlers, options?: RelayStreamOptions) {
    return useRelayStream('serial', target, handlers, options);
}

/** Serial ports on the TelopHub machine. Call refresh() to list them again (e.g. after plugging in an adapter) */
export function useSerialPorts() {
    const { sdk } = useTelopHub();
    const [ports, setPorts] = useState<SerialPortInfo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!sdk) return;
        setLoading(true);
        try {
            setPorts(await sdk.listSerialPorts());
            setError(null);
        } catch (err: any) {
            setError(err?.message || 'Could not list serial ports');
        } finally {
            setLoading(false);
        }
    }, [sdk]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { ports, error, loading, refresh };
}
