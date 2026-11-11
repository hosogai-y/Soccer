import { useCallback } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import { MatchLogDraft } from './matchLog';

/** CG Queue List に積む項目。payload 付きの項目は TAKE NEXT でそのデータのまま送出する */
export type CgQueueItem = {
    id: string;
    telopName: string;
    label: string;
    skipped: boolean;
    played?: boolean;
    payload?: Record<string, any>;
    logEntries?: MatchLogDraft[]; // 送出したときに当日操作ログへ記録する内容（交代・カード）
    reflected?: boolean;          // 交代反映（スタメンと控えの入れ替え）済み
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

/** キューから送出中の CG（一覧の ON AIR の印・HIDE ボタンの対象） */
export type CgQueueOnAir = { telopName: string, label: string, id?: string };

/**
 * 送出中の記録も JSON 文字列で保存する（'{}' = 送出中なし）。
 * SDK の状態マージは null を「変更なし」として無視し、100 文字を超える文字列を空文字では上書きしない
 * （選手交代2枚などラベルが長いと '' で消せない）ため、「なし」も空でない文字列にする。
 */
const CG_QUEUE_ON_AIR_KEY = 'cg_queue_on_air_json';
const NO_ON_AIR = '{}';

export function useCgQueueOnAir(): [CgQueueOnAir | null, (next: CgQueueOnAir | null) => void] {
    const [json, setJson] = useSyncedState<string>(CG_QUEUE_ON_AIR_KEY, NO_ON_AIR);
    let onAir: CgQueueOnAir | null = null;
    if (json) {
        try {
            const parsed = JSON.parse(json);
            if (parsed && typeof parsed.telopName === 'string') onAir = parsed;
        } catch { /* 壊れた値は送出中なしとして扱う */ }
    }
    const setOnAir = useCallback((next: CgQueueOnAir | null) => {
        setJson(next ? JSON.stringify(next) : NO_ON_AIR);
    }, [setJson]);
    return [onAir, setOnAir];
}

/** payload 付きでキューに積む関数を返す */
export function useCgQueueRegister() {
    const [, setQueue] = useCgQueue();
    return useCallback((telopName: string, label: string, payload: Record<string, any>, logEntries?: MatchLogDraft[]) => {
        const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        setQueue(prev => [...prev, { id, telopName, label, skipped: false, payload, ...(logEntries ? { logEntries } : {}) }]);
    }, [setQueue]);
}
