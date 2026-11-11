import { useEffect, useRef } from 'react';

/**
 * 音声キーワードで実行する操作（アクション）の登録表。
 * 各パネル（大得点・小得点・1Shot など）が、ボタンと同じ処理を自分のアクション名で登録する。
 * 音声送出（VoiceCgPanel）は名前で呼ぶだけ。登録がない（そのパネルが今の画面に無い）ときは呼んだ側が代わりの送出をする。
 */
type Handler = () => void;
const handlers = new Map<string, () => Handler | undefined>();

/**
 * アクションを登録する。get は呼ばれた時点の最新の処理を返す（未登録・使えないときは undefined）。
 * 同じ名前を複数のパネルが登録したら、あとから画面に出たほうを使う
 */
export function useVoiceActions(ids: string[], get: (id: string) => Handler | undefined) {
    const getRef = useRef(get);
    getRef.current = get;
    const idsKey = ids.join('|');
    useEffect(() => {
        const own = ids.map(id => {
            const fn = () => getRef.current(id);
            handlers.set(id, fn);
            return [id, fn] as const;
        });
        return () => own.forEach(([id, fn]) => { if (handlers.get(id) === fn) handlers.delete(id); });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idsKey]);
}

/** 登録されたアクションを実行する。実行できたら true */
export function runVoiceAction(id: string): boolean {
    const handler = handlers.get(id)?.();
    if (!handler) return false;
    handler();
    return true;
}
