import React, { useState, useEffect } from 'react';
import { useTelop, useSyncedState } from '@sdk/TelopHubSDK';

export type TimerState = {
    isRunning: boolean;
    lastTick: number; // Date.now() when started
    accumulatedMs: number; // total ms accumulated before this start
};

export default function LiveEditor() {
    const bigScore = useTelop('大得点', {
        左チーム得点: "0", 右チーム得点: "0", 左チーム名: "", 右チーム名: "", LeftTeamColor: "#bd39fb", RigtTeamColor: "#bd39fb"
    });
    
    const smallScore = useTelop('小得点', {
        左チーム得点: "0", 右チーム得点: "0", 左チーム名: "", 右チーム名: "", LeftTeamColor: "#bd39fb", RigtTeamColor: "#bd39fb"
    });

    const timer = useTelop('タイマー', {
        時刻: "00:00", 前後半: "前半",
        Rectangle: { visible: true },
        Rectangle_visible: true
    });

    // --- Global Timer Logic ---
    const [timerState, setTimerState] = useSyncedState<TimerState>('match_timer_state', {
        isRunning: false,
        lastTick: Date.now(),
        accumulatedMs: 0
    });

    const [presetVal, setPresetVal] = useState("0");
    const [displayMs, setDisplayMs] = useState(0);

    // Keep the UI ticking locally for the Live Editor view
    useEffect(() => {
        const interval = setInterval(() => {
            if (!timerState) return;
            let currentMs = timerState.accumulatedMs || 0;
            if (timerState.isRunning) {
                currentMs += (Date.now() - (timerState.lastTick || Date.now()));
            }
            setDisplayMs(Math.max(0, currentMs));
        }, 100);
        return () => clearInterval(interval);
    }, [timerState]);

    const adjustTime = (ms: number) => {
        setTimerState(prev => {
            const safePrev = prev || { isRunning: false, lastTick: Date.now(), accumulatedMs: 0 };
            return {
                ...safePrev,
                accumulatedMs: Math.max(0, safePrev.accumulatedMs + ms)
            };
        });
    };

    const applyPreset = () => {
        setTimerState({
            isRunning: false,
            lastTick: Date.now(),
            accumulatedMs: parseInt(presetVal, 10)
        });
    };

    const toggleTimer = () => {
        setTimerState(prev => {
            const safePrev = prev || { isRunning: false, lastTick: Date.now(), accumulatedMs: 0 };
            if (safePrev.isRunning) {
                const newAccumulated = safePrev.accumulatedMs + (Date.now() - (safePrev.lastTick || Date.now()));
                return { ...safePrev, isRunning: false, accumulatedMs: newAccumulated };
            } else {
                return { ...safePrev, isRunning: true, lastTick: Date.now() };
            }
        });
    };

    const isRunning = timerState?.isRunning || false;
    // --------------------------

    const syncScores = (data: any) => {
        bigScore.setData(data);
        smallScore.setData(data);
    };

    const updateScores = () => {
        bigScore.update();
        smallScore.update();
    };

    return (
        <div>
            <h2>Live Data Editor</h2>
            <div className="grid-cards" style={{ marginTop: 24 }}>
                
                {/* Score Panel */}
                <div className="glass-panel">
                    <div className="flex-between" style={{ marginBottom: 20 }}>
                        <h3>Match Score</h3>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={updateScores}>Update LIVE</button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 16 }}>
                        {/* Left Team */}
                        <div style={{ flex: 1, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                            <div className="form-group">
                                <label className="form-label">Left Team Name</label>
                                <input type="text" className="form-input" value={bigScore.data.左チーム名 || ''} onChange={e => syncScores({ ...bigScore.data, 左チーム名: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Left Color</label>
                                <input type="color" className="form-input" value={bigScore.data.LeftTeamColor || '#bd39fb'} onChange={e => syncScores({ ...bigScore.data, LeftTeamColor: e.target.value })} style={{ height: 40, padding: 4 }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Score</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-secondary" onClick={() => syncScores({ ...bigScore.data, 左チーム得点: String(Math.max(0, parseInt(bigScore.data.左チーム得点 || '0') - 1)) })}>-</button>
                                    <input type="number" className="form-input" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }} value={bigScore.data.左チーム得点} onChange={e => syncScores({ ...bigScore.data, 左チーム得点: e.target.value })} />
                                    <button className="btn btn-secondary" onClick={() => syncScores({ ...bigScore.data, 左チーム得点: String(parseInt(bigScore.data.左チーム得点 || '0') + 1) })}>+</button>
                                </div>
                            </div>
                        </div>

                        {/* Right Team */}
                        <div style={{ flex: 1, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                            <div className="form-group">
                                <label className="form-label">Right Team Name</label>
                                <input type="text" className="form-input" value={bigScore.data.右チーム名 || ''} onChange={e => syncScores({ ...bigScore.data, 右チーム名: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Right Color</label>
                                <input type="color" className="form-input" value={bigScore.data.RigtTeamColor || '#bd39fb'} onChange={e => syncScores({ ...bigScore.data, RigtTeamColor: e.target.value })} style={{ height: 40, padding: 4 }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Score</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-secondary" onClick={() => syncScores({ ...bigScore.data, 右チーム得点: String(Math.max(0, parseInt(bigScore.data.右チーム得点 || '0') - 1)) })}>-</button>
                                    <input type="number" className="form-input" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }} value={bigScore.data.右チーム得点} onChange={e => syncScores({ ...bigScore.data, 右チーム得点: e.target.value })} />
                                    <button className="btn btn-secondary" onClick={() => syncScores({ ...bigScore.data, 右チーム得点: String(parseInt(bigScore.data.右チーム得点 || '0') + 1) })}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timer Panel */}
                <div className="glass-panel">
                    <div className="flex-between" style={{ marginBottom: 20 }}>
                        <h3>Match Timer</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`} onClick={toggleTimer}>
                                {isRunning ? 'STOP' : 'START'}
                            </button>
                            <button className="btn btn-primary" onClick={() => timer.update()}>Update LIVE</button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Half</label>
                        <select className="form-select" value={timer.data.前後半 || '前半'} onChange={e => timer.setData({...timer.data, 前後半: e.target.value})}>
                            <option value="前半">前半 (1st Half)</option>
                            <option value="後半">後半 (2nd Half)</option>
                            <option value="延長前半">延長前半 (Ext 1st)</option>
                            <option value="延長後半">延長後半 (Ext 2nd)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Live Time (MM:SS)</label>
                            <input type="text" className="form-input" value={timer.data.時刻 || '00:00'} readOnly style={{ fontSize: '2.5rem', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace' }} />
                            <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.8rem', marginTop: 4 }}>Internal: {(displayMs / 1000).toFixed(1)}s</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Presets & Adjustments</label>
                        
                        {/* Presets */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <select className="form-select" value={presetVal} onChange={e => setPresetVal(e.target.value)} style={{ flex: 1 }}>
                                <option value="0">00:00</option>
                                <option value="2400000">40:00</option>
                                <option value="2700000">45:00</option>
                            </select>
                            <button className="btn btn-secondary" onClick={applyPreset}>Reset / Set</button>
                        </div>

                        {/* Adjustments */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => adjustTime(-60000)}>-1m</button>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => adjustTime(-1000)}>-1s</button>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => adjustTime(-100)}>-100ms</button>
                            <div style={{ width: '100%', height: 1, background: 'var(--border-color)', margin: '4px 0' }}></div>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => adjustTime(100)}>+100ms</button>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => adjustTime(1000)}>+1s</button>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => adjustTime(60000)}>+1m</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
