import React, { useRef } from 'react';
import { useSyncedState, useTelop, useBackgroundInterval } from '@sdk/TelopHubSDK';
import { buildTimerPayload } from '../utils/timerHelper';

export type TimerState = {
    isRunning: boolean;
    lastTick: number; // Date.now() when started
    accumulatedMs: number; // total ms accumulated before this start
};

export default function GlobalTimerManager() {
    const [timerState] = useSyncedState<TimerState>('match_timer_state', {
        isRunning: false,
        lastTick: Date.now(),
        accumulatedMs: 0
    });

    // 前後半のステートを画面(CGOperator)と同期
    const [timerPeriod] = useSyncedState<string>('match_timer_period', '前半');

    const timerTelop = useTelop('タイマー');

    // 直前送信した時刻と前後半を保持（不要な重複送信を防止）
    const lastSentTimeStrRef = useRef<string>('');
    const lastSentPeriodRef = useRef<string>('');

    // ユーザー要件: 200ms〜500msの間隔でタイマー処理 (250msを採用)
    // バックグラウンドWorkerインターバルで正確かつメインスレッドをブロックせずに処理
    useBackgroundInterval(() => {
        if (!timerState) return;

        // タイマーの現在経過時刻(ms)を算出
        let currentMs = timerState.accumulatedMs || 0;
        if (timerState.isRunning) {
            currentMs += (Date.now() - (timerState.lastTick || Date.now()));
        }
        currentMs = Math.max(0, currentMs);

        const totalSeconds = Math.floor(currentMs / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        const newTimeStr = `${m}:${s.toString().padStart(2, '0')}`;
        const currentPeriod = timerPeriod || '前半';

        // 秒の桁または前後半が変化した時のみ送出処理
        if (newTimeStr !== lastSentTimeStrRef.current || currentPeriod !== lastSentPeriodRef.current) {
            lastSentTimeStrRef.current = newTimeStr;
            lastSentPeriodRef.current = currentPeriod;

            // keyExp分2桁、分1桁、秒2桁、秒1桁にGUI上のタイマー表記とリンクした画像を流し込む
            const payload = buildTimerPayload(currentMs, currentPeriod);

            // 【重要：ほかのCG操作・送出の邪魔にならない設計】
            // 1. timerTelop.setData(...) は呼ばない！
            //    (setDataを毎秒呼ぶと全プロジェクトの巨大なSyncedStateが毎回同期・WebRTC送信され、
            //     他のCGボタンや送出アクションをキュー詰まり・遅延させる原因になるため)
            // 2. タイマーがON AIR（表示中）の時のみ update(payload) を送信！
            //    (軽量なタイマー差分データのみを高速送信するため、他のCG送出の邪魔を一切しない)
            if (timerTelop.isVisible) {
                timerTelop.update(payload);
            }
        }
    }, 250);

    return null;
}
