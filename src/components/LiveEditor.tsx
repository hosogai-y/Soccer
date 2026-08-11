import React, { useState, useEffect } from 'react';
import { useTelop, useBackgroundInterval } from '@sdk/TelopHubSDK';

export default function LiveEditor() {
    const bigScore = useTelop('大得点', {
        左チーム得点: "0", 右チーム得点: "0", 左チーム名: "", 右チーム名: "", LeftTeamColor: "#bd39fb", RigtTeamColor: "#bd39fb"
    });
    
    const smallScore = useTelop('小得点', {
        左チーム得点: "0", 右チーム得点: "0", 左チーム名: "", 右チーム名: "", LeftTeamColor: "#bd39fb", RigtTeamColor: "#bd39fb"
    });

    const timer = useTelop('タイマー', {
        時刻: "00:00", 前後半: "前半",
        Rectangle: { visible: true }, // Ensure Rectangle object exists and is visible
        Rectangle_visible: true       // Support fallback naming conventions for visibility
    });

    // --- Timer Logic ---
    const [timeMs, setTimeMs] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [presetVal, setPresetVal] = useState("0");

    useEffect(() => {
        const totalSeconds = Math.floor(timeMs / 1000);
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        timer.setData(prev => ({ ...prev, 時刻: `${m}:${s}` }));
    }, [timeMs]);

    useBackgroundInterval(() => {
        setTimeMs(prev => prev + 100);
    }, isRunning ? 100 : null);

    const adjustTime = (ms: number) => {
        setTimeMs(prev => Math.max(0, prev + ms));
    };

    const applyPreset = () => {
        setTimeMs(parseInt(presetVal, 10));
    };
    // -------------------

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
                            <button className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`} onClick={() => setIsRunning(!isRunning)}>
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
                            <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.8rem', marginTop: 4 }}>Internal: {(timeMs / 1000).toFixed(1)}s</div>
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
