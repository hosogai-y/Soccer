import React, { useEffect, useState } from 'react';
import { useSyncedState, useTelop, useBackgroundInterval } from '@sdk/TelopHubSDK';

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

    const timerTelop = useTelop('タイマー', {
        時刻: "00:00", 前後半: "前半",
        Rectangle: { visible: true },
        Rectangle_visible: true
    });

    const [lastRenderedTimeStr, setLastRenderedTimeStr] = useState<string>('');

    useBackgroundInterval(() => {
        if (!timerState) return;

        // Calculate real current time
        let currentMs = timerState.accumulatedMs || 0;
        if (timerState.isRunning) {
            currentMs += (Date.now() - (timerState.lastTick || Date.now()));
        }
        currentMs = Math.max(0, currentMs);

        const totalSeconds = Math.floor(currentMs / 1000);
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        const newTimeStr = `${m}:${s}`;

        // Update when the MM:SS string actually changes
        if (newTimeStr !== lastRenderedTimeStr) {
            setLastRenderedTimeStr(newTimeStr);
            
            // Update the staged data
            timerTelop.setData(prev => ({ ...prev, 時刻: newTimeStr }));

            // If the telop is currently ON AIR (TAKE is active), push the update to the renderer
            // This happens automatically in the background without user interaction!
            if (timerTelop.isVisible) {
                timerTelop.update({ ...timerTelop.data, 時刻: newTimeStr });
            }
        }
    }, 100);

    return null;
}
