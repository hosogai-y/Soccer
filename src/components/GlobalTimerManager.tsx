import React, { useCallback, useEffect, useRef } from 'react';
import { useSyncedState, useTelop, useTelopHub, useBackgroundInterval } from '@sdk/TelopHubSDK';
import { buildTimerPayload } from '../utils/timerHelper';

export type TimerState = {
    isRunning: boolean;
    lastTick: number; // Date.now() when started
    accumulatedMs: number; // total ms accumulated before this start
};

const DEFAULT_TIMER_STATE: TimerState = { isRunning: false, lastTick: Date.now(), accumulatedMs: 0 };

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
 * タイマーCGを「GUIの通し時間」でONにする関数を返す。
 * タイマーON ボタン・小得点 TAKE の両方からこれを使う（HIDE→ON でも 0:00 から始めない）。
 * show 直後はプレイヤーの読み込み・IN アニメーション中で値が反映されないことがあるため、
 * 最新時刻で数回 update を追い送りして確実に GUI 表記と揃える。
 *
 * TelopHub の ON AIR プレイヤーは update で「前回と値が違うキー」の画像しか描き直さない。
 * ON 時にテロップ側が古い値(0:00・前半)で描いてしまうと、同じ値の追い送りでは直らないため、
 * 追い送りでは画像パスを 'img/…' と './img/…'（同じ画像）で交互に書き分けて全桁・前後半を描き直させる。
 */
function withAltImagePath<T extends object>(payload: T): T {
    const out: any = {};
    Object.entries(payload).forEach(([key, val]) => {
        out[key] = typeof val === 'string' && val.startsWith('img/') ? `./${val}` : val;
    });
    return out;
}

export function useShowTimerAtCurrentTime() {
    const { syncedStateRef } = useTelopHub();
    const timer = useTelop('タイマー');

    const buildNow = useCallback(() => {
        const latest = syncedStateRef.current || {};
        const state: TimerState = latest.match_timer_state || DEFAULT_TIMER_STATE;
        const period: string = latest.match_timer_period || '前半';
        return buildTimerPayload(getTimerMs(state), period);
    }, [syncedStateRef]);

    return useCallback(() => {
        // ON 時にプレイヤー側が保存済みデータで描画しても 0:00 に戻らないよう、
        // show の直前だけ保存データを現在時刻に揃える（毎秒の setData はしない）
        const payload = buildNow();
        timer.setData(payload);
        timer.show(payload);
        // 追い送りごとにパス表記を変える（直前と必ず値が違う → 毎回全桁を描き直す）
        [150, 400, 1000, 2000].forEach((delay, i) => {
            setTimeout(() => {
                const now = buildNow();
                timer.update(i % 2 === 0 ? withAltImagePath(now) : now);
            }, delay);
        });
    }, [timer, buildNow]);
}

export default function GlobalTimerManager() {
    const [timerState] = useSyncedState<TimerState>('match_timer_state', DEFAULT_TIMER_STATE);

    // 前後半のステートを画面(CGOperator)と同期
    const [timerPeriod] = useSyncedState<string>('match_timer_period', '前半');

    const timerTelop = useTelop('タイマー');

    // 直前送信した時刻と前後半を保持（不要な重複送信を防止）
    const lastSentTimeStrRef = useRef<string>('');
    const lastSentPeriodRef = useRef<string>('');

    // タイマーCGが表示状態になったら送信済み記録をクリアし、次の tick で必ず現在時刻を送り直す
    useEffect(() => {
        if (timerTelop.isVisible) {
            lastSentTimeStrRef.current = '';
            lastSentPeriodRef.current = '';
        }
    }, [timerTelop.isVisible]);

    // ユーザー要件: 200ms〜500msの間隔でタイマー処理 (250msを採用)
    // バックグラウンドWorkerインターバルで正確かつメインスレッドをブロックせずに処理
    useBackgroundInterval(() => {
        if (!timerState) return;

        // タイマーの現在経過時刻(ms)を算出
        const currentMs = getTimerMs(timerState);

        const totalSeconds = Math.floor(currentMs / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        const newTimeStr = `${m}:${s.toString().padStart(2, '0')}`;
        const currentPeriod = timerPeriod || '前半';

        // 秒の桁または前後半が変化した時のみ送出処理
        if (newTimeStr !== lastSentTimeStrRef.current || currentPeriod !== lastSentPeriodRef.current) {
            // 【重要：ほかのCG操作・送出の邪魔にならない設計】
            // 1. timerTelop.setData(...) は呼ばない！
            //    (setDataを毎秒呼ぶと全プロジェクトの巨大なSyncedStateが毎回同期・WebRTC送信され、
            //     他のCGボタンや送出アクションをキュー詰まり・遅延させる原因になるため)
            // 2. タイマーがON AIR（表示中）の時のみ update(payload) を送信！
            //    非表示中は送信済みとして記録しない（再表示時に必ず最新値を送るため）
            if (timerTelop.isVisible) {
                lastSentTimeStrRef.current = newTimeStr;
                lastSentPeriodRef.current = currentPeriod;
                // keyExp分2桁、分1桁、秒2桁、秒1桁にGUI上のタイマー表記とリンクした画像を流し込む
                timerTelop.update(buildTimerPayload(currentMs, currentPeriod));
            }
        }
    }, 250);

    return null;
}
