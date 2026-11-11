import { useSyncExternalStore } from 'react';

/**
 * PV モード（送出前の確認）。この端末・このタブだけの状態で、読み込み直すと必ず OFF に戻る。
 * ON の間は TAKE / HIDE / CGクリア が OA に行かず、画面の PV モニター（PvMonitor）に出る。
 * 得点の +1 など「送出中の CG をその場で UPDATE する」動きは今まで通り OA に行く（PV モニターにも反映）。
 */

export type PvLayer = { name: string, data: Record<string, any>, seq: number };
type Snapshot = { mode: boolean, layers: PvLayer[] };

let snapshot: Snapshot = { mode: false, layers: [] };
let seq = 0;
const listeners = new Set<() => void>();

const set = (next: Partial<Snapshot>) => {
    snapshot = { ...snapshot, ...next };
    listeners.forEach(l => l());
};

export const isPvMode = () => snapshot.mode;

export function setPvMode(mode: boolean) {
    // 終わったら PV モニターの中身も消す（次に ON にしたとき古い CG が残らない）
    if (!mode) sendHooks.clear();
    set({ mode, layers: mode ? snapshot.layers : [] });
}

/**
 * PV に出した CG を「ONAIR へ送出」したときに行う処理（当日ログへの記録・キューの送出済み・ON AIR の印など）。
 * PV モードの TAKE では行わず、OA に出したときに初めて行う。テロップごとに 1 つ（TAKE し直すと入れ替わる）
 */
const sendHooks = new Map<string, () => void>();

/** PV に出した name の CG を OA に送出したときに fn を実行する（pvShow の後に呼ぶ） */
export function pvOnSend(name: string, fn: () => void) {
    sendHooks.set(name, fn);
}

/** 送出したときの処理を取り出す（1 回だけ実行するため取り出したら消す） */
export function takePvSendHook(name: string): (() => void) | undefined {
    const fn = sendHooks.get(name);
    sendHooks.delete(name);
    return fn;
}

/** OA に出したときだけ行う処理: PV モードなら ONAIR へ送出したときまで待ち、そうでなければすぐ行う */
export function runOnAir(name: string, fn: () => void) {
    if (snapshot.mode) pvOnSend(name, fn);
    else fn();
}

/** PV モニターに出す（同じテロップなら中身を差し替えて一番上に） */
export function pvShow(name: string, data: Record<string, any> | undefined) {
    seq += 1;
    sendHooks.delete(name); // 前の TAKE の処理は持ち越さない（この後 pvOnSend で付け直す）
    set({ layers: [...snapshot.layers.filter(l => l.name !== name), { name, data: { ...(data || {}) }, seq }] });
}

/** PV モニターに出ているときだけ中身を差し替える */
export function pvUpdate(name: string, data: Record<string, any> | undefined) {
    if (!snapshot.layers.some(l => l.name === name) || !data) return;
    set({ layers: snapshot.layers.map(l => (l.name === name ? { ...l, data: { ...l.data, ...data } } : l)) });
}

export function pvHide(name: string) {
    sendHooks.delete(name);
    if (!snapshot.layers.some(l => l.name === name)) return;
    set({ layers: snapshot.layers.filter(l => l.name !== name) });
}

export const pvHas = (name: string) => snapshot.layers.some(l => l.name === name);

/** keep に入っているテロップ以外を PV モニターから消す（keep を省くと全部） */
export function pvClear(keep: string[] = []) {
    [...sendHooks.keys()].forEach(name => { if (!keep.includes(name)) sendHooks.delete(name); });
    set({ layers: snapshot.layers.filter(l => keep.includes(l.name)) });
}

const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => { listeners.delete(l); };
};

export function usePv(): Snapshot {
    return useSyncExternalStore(subscribe, () => snapshot);
}

// ---------------------------------------------------------------- テロップのページ

const pageCache = new Map<string, Promise<string | null>>();

/**
 * テロップのページの URL（TelopHub 配信: /<project>/<テロップ>/<テロップ>.html、開発サーバー: /<テロップ>/<テロップ>.html）。
 * 見つからなければ null（まだ作っていないテロップなど）
 */
export function telopPageUrl(projectName: string, telopName: string): Promise<string | null> {
    const cacheKey = `${projectName}|${telopName}`;
    if (!pageCache.has(cacheKey)) {
        const file = `${encodeURIComponent(telopName)}/${encodeURIComponent(telopName)}.html`;
        const candidates = [
            ...(projectName ? [`/${projectName.split('/').map(encodeURIComponent).join('/')}/${file}`] : []),
            `/${file}`
        ];
        pageCache.set(cacheKey, (async () => {
            for (const url of candidates) {
                try {
                    const res = await fetch(url, { cache: 'no-store' });
                    const text = res.ok ? await res.text() : '';
                    if (text.includes('player-container')) return url;
                } catch { /* 次の候補 */ }
            }
            pageCache.delete(cacheKey); // 後で作られたら見つかるように
            return null;
        })());
    }
    return pageCache.get(cacheKey)!;
}
