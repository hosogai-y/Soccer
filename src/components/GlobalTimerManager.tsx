import { useCallback, useEffect, useRef } from 'react';
import { useSyncedState, useTelop, useTelopHub, useBackgroundInterval } from '@sdk/TelopHubSDK';
import { buildTimerPayload, buildTimerClockKeys, buildTimerPeriodPayload } from '../utils/timerHelper';

export type TimerState = {
    isRunning: boolean;
    lastTick: number; // Date.now() when started
    accumulatedMs: number; // total ms accumulated before this start
    rev?: number; // 時計の状態の版（START/STOP/微調整/プリセット/TAKE で増える。テロップは新しい版で合わせ直す）
    by?: string;  // 最後に時計を操作したタブ
};

const DEFAULT_TIMER_STATE: TimerState = { isRunning: false, lastTick: Date.now(), accumulatedMs: 0 };

/** このページ（タブ）の識別子。読み込み直すと変わる */
export const TIMER_TAB_ID = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// 表示中のタイマーへ時計を送る間隔。テロップは自分の時計で秒を進めるが、
// 届くたびに描き直すので、プレイヤーのページが裏に回って間引かれても表示が止まらない
const TICK_INTERVAL_MS = 1000;

/** タイマーステートから現在の経過時刻(ms)を算出 */
export function getTimerMs(state?: TimerState | null): number {
    if (!state) return 0;
    let currentMs = state.accumulatedMs || 0;
    if (state.isRunning) {
        currentMs += (Date.now() - (state.lastTick || Date.now()));
    }
    return Math.max(0, currentMs);
}

/**
 * 時計を変える（START/STOP/微調整/プリセット/リセット/TAKE）ときの次のステート。
 * 版(rev)は必ず前より大きくし、操作したタブを記録する
 */
export function nextTimerState(prev: TimerState | null | undefined, patch: Partial<TimerState>): TimerState {
    const base = prev || DEFAULT_TIMER_STATE;
    return {
        ...base,
        ...patch,
        rev: Math.max(Date.now(), (base.rev || 0) + 1),
        by: TIMER_TAB_ID
    };
}

/** このタブが時計を最後に操作したか（版の無い古いステートなら true） */
const isClockOwner = (state?: TimerState | null) => !state?.by || state.by === TIMER_TAB_ID;

/** タイマーテロップの全項目（表示時）: 時刻・各桁の画像・前後半・自走クロック用キー */
export function buildTimerShowPayload(state: TimerState | null | undefined, period: string) {
    const s = state || DEFAULT_TIMER_STATE;
    const ms = getTimerMs(s);
    return { ...buildTimerPayload(ms, period), ...buildTimerClockKeys(ms, !!s.isRunning, s.rev, isClockOwner(s)) };
}

/**
 * 時計だけのペイロード（表示中の UPDATE 用）。時刻・各桁の画像は送らず、秒はテロップ側の時計で進める。
 * 時計を操作したタブ以外からの送信は timerAuth '0'（テロップは描き直すだけで、時計は合わせ直さない）
 */
export function buildTimerClockPayload(state: TimerState | null | undefined, period: string) {
    const s = state || DEFAULT_TIMER_STATE;
    return { ...buildTimerPeriodPayload(period), ...buildTimerClockKeys(getTimerMs(s), !!s.isRunning, s.rev, isClockOwner(s)) };
}

/**
 * タイマーCGを「GUIの通し時間」でONにする関数を返す。
 * タイマーON ボタン・小得点 TAKE の両方からこれを使う（HIDE→ON でも 0:00 から始めない）。
 * TAKE したタブで時計の版を上げてから出すので、テロップは必ず今の GUI の時刻に合わせ直す。
 * show 直後はプレイヤーの読み込み・IN アニメーション中で受け取れないことがあるため、時計だけを数回追い送りする
 */
export function useShowTimerAtCurrentTime() {
    const { syncedStateRef } = useTelopHub();
    const timer = useTelop('タイマー');
    const [, setTimerState] = useSyncedState<TimerState>('match_timer_state', DEFAULT_TIMER_STATE);

    const latest = useCallback(() => {
        const s = syncedStateRef.current || {};
        return {
            state: (s.match_timer_state as TimerState) || DEFAULT_TIMER_STATE,
            period: (s.match_timer_period as string) || '前半'
        };
    }, [syncedStateRef]);

    return useCallback(() => {
        const { state: prev, period } = latest();
        // 値は変えずに版だけ上げる（このタブが時計の持ち主になる）
        const state = nextTimerState(prev, { accumulatedMs: getTimerMs(prev), lastTick: Date.now() });
        setTimerState(state);
        const payload = buildTimerShowPayload(state, period);
        // ON 時にプレイヤー側が保存済みデータで描画しても 0:00 に戻らないよう、show の直前だけ保存データを揃える
        timer.setData(payload);
        timer.show(payload);
        [300, 1000, 2000].forEach(delay => {
            setTimeout(() => {
                const now = latest();
                timer.update(buildTimerClockPayload(now.state, now.period));
            }, delay);
        });
    }, [timer, latest, setTimerState]);
}

/**
 * タイマーテロップへ時計を送る（画面には何も出さない）。
 * - 時計の状態が変わったら（START/STOP/微調整/プリセット）、操作したタブからすぐ送る
 * - 表示中は 1 秒ごとに送る（開いているどのタブからも）。テロップは版が古いデータを捨て、
 *   同じ版なら描き直すだけなので、送信が遅れたり重なったりしても秒は戻らない
 */
export default function GlobalTimerManager() {
    const { syncedStateRef } = useTelopHub();
    const [timerState] = useSyncedState<TimerState>('match_timer_state', DEFAULT_TIMER_STATE);
    const timerTelop = useTelop('タイマー');
    const isOwner = isClockOwner(timerState);

    const sendClock = useCallback(() => {
        const s = syncedStateRef.current || {};
        const state = (s.match_timer_state as TimerState) || DEFAULT_TIMER_STATE;
        const period = (s.match_timer_period as string) || '前半';
        timerTelop.update(buildTimerClockPayload(state, period));
    }, [syncedStateRef, timerTelop]);

    // 時計の状態が変わったら、操作したタブからすぐ送る
    const lastSentRevRef = useRef<number | undefined>(undefined);
    useEffect(() => {
        if (!timerTelop.isVisible || !isOwner) return;
        if (lastSentRevRef.current === timerState?.rev) return;
        lastSentRevRef.current = timerState?.rev;
        sendClock();
    }, [timerState?.rev, timerTelop.isVisible, isOwner, sendClock]);

    // 非表示になったら送信済みの記録を外す（次に表示したとき必ず送る）
    useEffect(() => {
        if (!timerTelop.isVisible) lastSentRevRef.current = undefined;
    }, [timerTelop.isVisible]);

    // 表示中は 1 秒ごとに送る（Web Worker の刻みなので、このタブが裏に回っても止まらない）
    useBackgroundInterval(() => {
        if (timerTelop.isVisible) sendClock();
    }, TICK_INTERVAL_MS);

    return null;
}
