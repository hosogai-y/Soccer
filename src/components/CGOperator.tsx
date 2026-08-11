import React, { useState, useEffect } from 'react';
import { useTelop, useClearAll, useSyncedState } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { TimerState } from './GlobalTimerManager';

const ALL_TELOPS = [
    { name: '大得点', label: 'Big Score' },
    { name: '小得点', label: 'Small Score' },
    { name: 'タイマー', label: 'Timer' },
    { name: 'アディショナルタイム', label: 'Additional Time' },
    { name: '1Shot', label: '1Shot' },
    { name: '顔付き1Shot', label: '1Shot (Face)' },
    { name: 'プロ２', label: 'Profile 2' },
    { name: '顔付きプロ２', label: 'Profile 2 (Face)' },
    { name: '前所属', label: 'Prev Team' },
    { name: 'フォーメーション右', label: 'Formation (Right)' },
    { name: 'フォーメーション左', label: 'Formation (Left)' },
    { name: 'サブ下位置左', label: 'Substitutes' }
];

export default function CGOperator() {
    const { clearOnAir, clearPreview, clearAll } = useClearAll();
    const [players] = useSyncedState<Player[]>('roster', []);
    
    // CG Queue State
    const [cgQueue, setCgQueue] = useSyncedState<any[]>('cg_queue', []);
    const [queueMode, setQueueMode] = useState(false);

    // Queue logic
    const addToQueue = (telopName: string, label: string) => {
        setCgQueue(prev => [...(prev || []), { id: Date.now().toString(), telopName, label, skipped: false }]);
    };

    const toggleSkipQueueItem = (id: string) => {
        setCgQueue(prev => (prev || []).map(item => item.id === id ? { ...item, skipped: !item.skipped } : item));
    };

    const deleteQueueItem = (id: string) => {
        setCgQueue(prev => (prev || []).filter(item => item.id !== id));
    };

    const takeNextQueue = () => {
        if (!cgQueue || cgQueue.length === 0) return;
        const nextIdx = cgQueue.findIndex(item => !item.skipped);
        if (nextIdx === -1) {
            alert('No active items in queue.');
            return;
        }

        const item = cgQueue[nextIdx];
        
        // 1. Hide all non-essential items (everything except score/timer)
        window.dispatchEvent(new Event('TRIGGER_HIDE_QUEUE_ITEMS'));
        
        // 2. Remove from queue
        setCgQueue(prev => prev.filter((_, i) => i !== nextIdx));

        // 3. Show after short delay to allow clear to process
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('TRIGGER_TAKE', { detail: item.telopName }));
        }, 200);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr 350px', gap: '24px', minHeight: '80vh' }}>
            
            {/* LEFT COLUMN: Left Team Players */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#198754' }}>
                    <h3 style={{ color: '#198754' }}>Left Team - Starters</h3>
                    <PlayerGrid players={(players || []).filter(p => p.teamId === 'left' && !p.isSubbed)} />
                </div>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#8bc34a' }}>
                    <h3 style={{ color: '#8bc34a' }}>Left Team - Subs</h3>
                    <PlayerGrid players={(players || []).filter(p => p.teamId === 'left' && p.isSubbed)} />
                </div>
            </div>

            {/* CENTER COLUMN: Dashboards & CG Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', gap: '24px' }}>
                    {/* Live Data Editor (Score + Timer) */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <MatchScorePanel />
                        <MatchTimerPanel />
                    </div>
                    
                    {/* CG Queue List */}
                    <div className="glass-panel" style={{ width: '350px', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex-between" style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: 0 }}>CG Queue List</h3>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={queueMode} onChange={e => setQueueMode(e.target.checked)} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: queueMode ? 'var(--accent-warning)' : '#aaa' }}>QUEUE MODE</span>
                            </label>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px', marginBottom: '16px' }}>
                            {(cgQueue || []).length === 0 && <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>Queue is empty</div>}
                            {(cgQueue || []).map((item, idx) => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', background: item.skipped ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '4px', marginBottom: '8px', opacity: item.skipped ? 0.5 : 1 }}>
                                    <div style={{ marginRight: '12px', fontWeight: 'bold', color: '#888' }}>{idx + 1}</div>
                                    <div style={{ flex: 1, fontWeight: 'bold' }}>{item.label}</div>
                                    <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.7rem', marginRight: '4px' }} onClick={() => toggleSkipQueueItem(item.id)}>SKIP</button>
                                    <button className="btn btn-danger" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={() => deleteQueueItem(item.id)}>X</button>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-success" style={{ padding: '12px', fontSize: '1.2rem', fontWeight: 'bold' }} onClick={takeNextQueue} disabled={(cgQueue || []).filter(i => !i.skipped).length === 0}>
                            TAKE NEXT (w/ Clear)
                        </button>
                    </div>
                </div>

                {/* CG Operations Buttons */}
                <div className="glass-panel">
                    <div className="flex-between" style={{ marginBottom: 16 }}>
                        <h3 style={{ margin: 0 }}>CG Controls</h3>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-warning" onClick={clearPreview}>Clear Preview</button>
                            <button className="btn btn-danger" onClick={clearOnAir}>Clear On Air</button>
                            <button className="btn btn-secondary" onClick={clearAll} style={{ borderColor: 'var(--accent-danger)' }}>Clear All</button>
                        </div>
                    </div>
                    <div className="grid-cards">
                        {ALL_TELOPS.map(t => (
                            <TelopControl key={t.name} telopName={t.name} label={t.label} queueMode={queueMode} onAddToQueue={() => addToQueue(t.name, t.label)} />
                        ))}
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Right Team Players */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#0dcaf0' }}>
                    <h3 style={{ color: '#0dcaf0' }}>Right Team - Starters</h3>
                    <PlayerGrid players={(players || []).filter(p => p.teamId === 'right' && !p.isSubbed)} />
                </div>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#0d6efd' }}>
                    <h3 style={{ color: '#0d6efd' }}>Right Team - Subs</h3>
                    <PlayerGrid players={(players || []).filter(p => p.teamId === 'right' && p.isSubbed)} />
                </div>
            </div>

        </div>
    );
}

// --------------------------------------------------------
// Subcomponents
// --------------------------------------------------------

function PlayerGrid({ players }: { players: Player[] }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="modern-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Pos</th>
                        <th title="累積イエロー">Yel</th>
                        <th title="通算ゴール">T.G</th>
                        <th title="Todaysゴール">D.G</th>
                        <th title="交代フラグ">Sub</th>
                    </tr>
                </thead>
                <tbody>
                    {players.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', opacity: 0.5 }}>No players</td></tr>}
                    {players.sort((a,b) => parseInt(a.number) - parseInt(b.number)).map(p => (
                        <tr key={p.id}>
                            <td style={{ fontWeight: 'bold' }}>{p.number}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{p.name}</td>
                            <td>{p.position}</td>
                            <td>{p.yellowCards || ''}</td>
                            <td>{p.totalGoals || ''}</td>
                            <td>{p.todayGoals || ''}</td>
                            <td>{p.isSubbed ? '🔄' : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TelopControl({ telopName, label, queueMode, onAddToQueue }: { telopName: string, label: string, queueMode: boolean, onAddToQueue: () => void }) {
    const { show, hide, update, isVisible } = useTelop(telopName);

    useEffect(() => {
        const handleTake = (e: any) => {
            if (e.detail === telopName) {
                show();
            }
        };
        const handleHideAll = () => {
            const protectedTelops = ['大得点', '小得点', 'タイマー', 'アディショナルタイム'];
            if (!protectedTelops.includes(telopName)) {
                hide();
            }
        };
        window.addEventListener('TRIGGER_TAKE', handleTake);
        window.addEventListener('TRIGGER_HIDE_QUEUE_ITEMS', handleHideAll);
        return () => {
            window.removeEventListener('TRIGGER_TAKE', handleTake);
            window.removeEventListener('TRIGGER_HIDE_QUEUE_ITEMS', handleHideAll);
        };
    }, [telopName, show, hide]);

    return (
        <div className="glass-panel" style={{ padding: '12px', borderLeft: isVisible ? '4px solid var(--accent-success)' : '4px solid transparent' }}>
            <div className="flex-between" style={{ marginBottom: 12 }}>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>{label}</h4>
                {isVisible && <span className="status-badge status-connected" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>ON AIR</span>}
            </div>
            
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {queueMode ? (
                    <button className="btn btn-warning" style={{ flex: 1, padding: '4px' }} onClick={onAddToQueue}>Q-ADD</button>
                ) : (
                    <button className="btn btn-success" style={{ flex: 1, padding: '4px' }} onClick={() => show()}>TAKE</button>
                )}
                <button className="btn btn-danger" style={{ flex: 1, padding: '4px' }} onClick={hide}>HIDE</button>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '4px' }} onClick={() => update()}>UPDATE</button>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// Match Score Panel (Migrated & Improved)
// --------------------------------------------------------

function MatchScorePanel() {
    const bigScore = useTelop('大得点');
    const smallScore = useTelop('小得点');

    const syncScores = (data: any) => {
        bigScore.setData((prev: any) => ({ ...prev, ...data }));
        smallScore.setData((prev: any) => ({ ...prev, ...data }));
    };

    const updateScores = () => {
        bigScore.update();
        smallScore.update();
    };

    const bsData = bigScore.data || {};

    return (
        <div className="glass-panel">
            <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Match Score</h3>
                <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={updateScores}>Update LIVE</button>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
                {/* Left Team */}
                <div style={{ flex: 1, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                    <div className="form-group" style={{ marginBottom: 8 }}>
                        <input type="text" className="form-input" placeholder="Left Name" value={bsData.左チーム名 || ''} onChange={e => syncScores({ 左チーム名: e.target.value })} style={{ padding: '4px 8px', fontSize: '0.9rem' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 8 }}>
                        <input type="color" className="form-input" value={bsData.LeftTeamColor || '#bd39fb'} onChange={e => syncScores({ LeftTeamColor: e.target.value })} style={{ height: 24, padding: 0, width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '1rem' }} onClick={() => syncScores({ 左チーム得点: String(Math.max(0, parseInt(bsData.左チーム得点 || '0') - 1)) })}>-</button>
                        <input type="text" className="form-input" style={{ flex: 1, textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', padding: '4px', minWidth: '3rem' }} value={bsData.左チーム得点 || '0'} onChange={e => syncScores({ 左チーム得点: e.target.value })} />
                        <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '1rem' }} onClick={() => syncScores({ 左チーム得点: String(parseInt(bsData.左チーム得点 || '0') + 1) })}>+</button>
                    </div>
                </div>

                {/* Right Team */}
                <div style={{ flex: 1, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                    <div className="form-group" style={{ marginBottom: 8 }}>
                        <input type="text" className="form-input" placeholder="Right Name" value={bsData.右チーム名 || ''} onChange={e => syncScores({ 右チーム名: e.target.value })} style={{ padding: '4px 8px', fontSize: '0.9rem' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 8 }}>
                        <input type="color" className="form-input" value={bsData.RigtTeamColor || '#bd39fb'} onChange={e => syncScores({ RigtTeamColor: e.target.value })} style={{ height: 24, padding: 0, width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '1rem' }} onClick={() => syncScores({ 右チーム得点: String(Math.max(0, parseInt(bsData.右チーム得点 || '0') - 1)) })}>-</button>
                        <input type="text" className="form-input" style={{ flex: 1, textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', padding: '4px', minWidth: '3rem' }} value={bsData.右チーム得点 || '0'} onChange={e => syncScores({ 右チーム得点: e.target.value })} />
                        <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '1rem' }} onClick={() => syncScores({ 右チーム得点: String(parseInt(bsData.右チーム得点 || '0') + 1) })}>+</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// Match Timer Panel (Migrated & Improved)
// --------------------------------------------------------

function MatchTimerPanel() {
    const timer = useTelop('タイマー');
    const additionalTime = useTelop('アディショナルタイム');
    
    const [timerState, setTimerState] = useSyncedState<TimerState>('match_timer_state', {
        isRunning: false,
        lastTick: Date.now(),
        accumulatedMs: 0
    });

    const [presetVal, setPresetVal] = useState("0");
    const [displayMs, setDisplayMs] = useState(0);
    const [showAdjustments, setShowAdjustments] = useState(false);

    // Keep UI ticking
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

    const isRunning = timerState?.isRunning || false;

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

    return (
        <div className="glass-panel">
            <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Match Timer</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`} onClick={toggleTimer} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                        {isRunning ? 'STOP' : 'START'}
                    </button>
                    <button className="btn btn-primary" onClick={() => timer.update()} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Update LIVE</button>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <select className="form-select" value={timer.data.前後半 || '前半'} onChange={e => timer.setData({...timer.data, 前後半: e.target.value})} style={{ padding: '4px 8px' }}>
                        <option value="前半">前半 (1st)</option>
                        <option value="後半">後半 (2nd)</option>
                        <option value="延長前半">延前 (Ex1)</option>
                        <option value="延長後半">延後 (Ex2)</option>
                    </select>
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                    <input type="text" className="form-input" value={timer.data.時刻 || '00:00'} readOnly style={{ fontSize: '1.8rem', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', padding: '0px' }} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '2px 8px' }} onClick={() => setShowAdjustments(!showAdjustments)}>
                    {showAdjustments ? 'Hide Adjustments ▲' : 'Show Adjustments ▼'}
                </button>
            </div>

            {showAdjustments && (
                <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255, 193, 7, 0.3)' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <select className="form-select" value={presetVal} onChange={e => setPresetVal(e.target.value)} style={{ flex: 1, padding: '4px' }}>
                            <option value="0">00:00</option>
                            <option value="2400000">40:00</option>
                            <option value="2700000">45:00</option>
                        </select>
                        <button className="btn btn-warning" onClick={applyPreset} style={{ padding: '4px 12px' }}>Set</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '2px' }} onClick={() => adjustTime(-60000)}>-1m</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '2px' }} onClick={() => adjustTime(-1000)}>-1s</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '2px' }} onClick={() => adjustTime(-100)}>-.1s</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '2px' }} onClick={() => adjustTime(100)}>+.1s</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '2px' }} onClick={() => adjustTime(1000)}>+1s</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '2px' }} onClick={() => adjustTime(60000)}>+1m</button>
                    </div>
                </div>
            )}

            <div style={{ height: 1, background: 'var(--border-color)', margin: '12px 0' }}></div>
            
            <div className="flex-between" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Additional Time</span>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 3" 
                        value={additionalTime.data.AT || ''} 
                        onChange={e => additionalTime.setData({ ...additionalTime.data, AT: e.target.value })} 
                        style={{ width: '60px', textAlign: 'center', padding: '4px' }} 
                    />
                    <button className="btn btn-primary" onClick={() => additionalTime.update()} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Update</button>
                </div>
            </div>
        </div>
    );
}
