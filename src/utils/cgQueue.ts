import { useCallback } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';

/** CG Queue List に積む項目。payload 付きの項目は TAKE NEXT でそのデータのまま送出する */
export type CgQueueItem = {
    id: string;
    telopName: string;
    label: string;
    skipped: boolean;
    played?: boolean;
    payload?: Record<string, any>;
};

/**
 * キューは JSON 文字列で保存する。
 * SDK の状態マージは「空配列で既存の配列を上書きしない」ため、配列のままだと最後の 1 件が消せない。
 */
const CG_QUEUE_KEY = 'cg_queue_json';
const LEGACY_CG_QUEUE_KEY = 'cg_queue';

const parseQueue = (json: string | null | undefined, legacy: CgQueueItem[] | undefined): CgQueueItem[] => {
    if (typeof json === 'string') {
        try {
            const parsed = JSON.parse(json);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    // 旧形式（配列）のキューが残っていれば引き継ぐ
    return Array.isArray(legacy) ? legacy : [];
};

export function useCgQueue(): [CgQueueItem[], (next: CgQueueItem[] | ((prev: CgQueueItem[]) => CgQueueItem[])) => void] {
    const [json, setJson] = useSyncedState<string | null>(CG_QUEUE_KEY, null);
    const [legacy] = useSyncedState<CgQueueItem[]>(LEGACY_CG_QUEUE_KEY, []);
    const queue = parseQueue(json, legacy);

    const setQueue = useCallback((next: CgQueueItem[] | ((prev: CgQueueItem[]) => CgQueueItem[])) => {
        setJson(prevJson => {
            const prev = parseQueue(prevJson, legacy);
            return JSON.stringify(typeof next === 'function' ? next(prev) : next);
        });
    }, [setJson, legacy]);

    return [queue, setQueue];
}

/** payload 付きでキューに積む関数を返す */
export function useCgQueueRegister() {
    const [, setQueue] = useCgQueue();
    return useCallback((telopName: string, label: string, payload: Record<string, any>) => {
        const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        setQueue(prev => [...prev, { id, telopName, label, skipped: false, payload }]);
    }, [setQueue]);
}
