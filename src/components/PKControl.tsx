import React from 'react';
import { useTelop, useSyncedState } from '@sdk/TelopHubSDK';

export interface PKState {
    teamFirst: string;
    teamSecond: string;
    kicksFirst: string[];  // 10 elements: 'goal' | 'miss' | ''
    kicksSecond: string[]; // 10 elements: 'goal' | 'miss' | ''
    manualUnlock: boolean;
}

const DEFAULT_PK_STATE: PKState = {
    teamFirst: '札幌創成',
    teamSecond: '札幌大谷',
    kicksFirst: Array(10).fill(''),
    kicksSecond: Array(10).fill(''),
    manualUnlock: false
};

export default function PKControl() {
    const [pkState, setPkState] = useSyncedState<PKState>('pk_shootout_state', DEFAULT_PK_STATE);
    
    const pkCenter = useTelop('PK');
    const pkTopLeft = useTelop('左上PK');

    const state = pkState || DEFAULT_PK_STATE;

    // Calculate score up to round 5 and total
    const scoreFirst = state.kicksFirst.filter(k => k === 'goal').length;
    const scoreSecond = state.kicksSecond.filter(k => k === 'goal').length;

    // Calculate score after first 5 rounds specifically
    const scoreFirst5 = state.kicksFirst.slice(0, 5).filter(k => k === 'goal').length;
    const scoreSecond5 = state.kicksSecond.slice(0, 5).filter(k => k === 'goal').length;
    const isTiedAfter5 = scoreFirst5 === scoreSecond5;

    // Check if round 5 is completed (both 5th kicks entered)
    const isRound5Completed = (state.kicksFirst[4] !== '' && state.kicksSecond[4] !== '');

    // Check if any kicks in rounds 6-10 are entered
    const hasSuddenDeathKicks = state.kicksFirst.slice(5).some(k => k !== '') || state.kicksSecond.slice(5).some(k => k !== '');

    // 6th Inning display condition
    const showInning6 = state.manualUnlock || hasSuddenDeathKicks || (isRound5Completed && isTiedAfter5);

    // Determine unlocked status for each round (0 to 9)
    // Rounds 1-5 (indices 0..4) are ALWAYS unlocked.
    // Round 6 (index 5) is unlocked if score is tied after 5 rounds.
    // Round N (index i >= 5) is unlocked if score after i rounds is tied (or previous round was tied).
    const getRoundUnlocked = (roundIndex: number): boolean => {
        if (roundIndex < 5) return true;
        if (state.manualUnlock) return true;

        // Check if tied after round 5
        if (!isTiedAfter5) return false;

        // For rounds 6..9 (indices 5..8):
        // Each sudden death round opens if the previous sudden death rounds resulted in a tie
        for (let r = 5; r <= roundIndex; r++) {
            const scoreF_prev = state.kicksFirst.slice(0, r).filter(k => k === 'goal').length;
            const scoreS_prev = state.kicksSecond.slice(0, r).filter(k => k === 'goal').length;
            if (scoreF_prev !== scoreS_prev && r < roundIndex) {
                return false;
            }
        }
        return true;
    };

    const handleKickChange = (team: 'first' | 'second', roundIndex: number, val: string) => {
        setPkState(prev => {
            const safe = prev || DEFAULT_PK_STATE;
            const newFirst = [...(safe.kicksFirst || Array(10).fill(''))];
            const newSecond = [...(safe.kicksSecond || Array(10).fill(''))];

            if (team === 'first') newFirst[roundIndex] = val;
            else newSecond[roundIndex] = val;

            return {
                ...safe,
                kicksFirst: newFirst,
                kicksSecond: newSecond
            };
        });
    };

    const resetPK = () => {
        if (confirm('PKの結果をリセットしますか？')) {
            setPkState(prev => ({
                ...(prev || DEFAULT_PK_STATE),
                kicksFirst: Array(10).fill(''),
                kicksSecond: Array(10).fill('')
            }));
        }
    };

    // Prepare data payload for CG Telop
    const buildPayload = (type: 'PK' | '左上PK') => {
        const goalImg = type === 'PK' ? 'img/HD2D_P07_Parts1.png' : 'img/HD2D_P09_Parts1.png';
        const missImg = type === 'PK' ? 'img/HD2D_P07_Parts2.png' : 'img/HD2D_P09_Parts2.png';
        const blankImg = 'img/HD2D_P09_Parts3.png';

        const mapKickImg = (val: string) => {
            if (val === 'goal') return goalImg;
            if (val === 'miss') return missImg;
            return blankImg;
        };

        const payload: any = {
            '先攻学校名': state.teamFirst,
            '後攻学校名': state.teamSecond,
            '先攻得点': String(scoreFirst),
            '後攻得点': String(scoreSecond),
            '先攻合計得点': String(scoreFirst),
            '後攻合計得点': String(scoreSecond),
            'showInning6': showInning6,
            '6回目表示': showInning6
        };

        // Kicks 1 to 5
        for (let i = 0; i < 5; i++) {
            payload[`先攻${i + 1}`] = mapKickImg(state.kicksFirst[i]);
            payload[`後攻${i + 1}`] = mapKickImg(state.kicksSecond[i]);
        }

        // Kick 6 (or current active sudden death kick)
        // Find if there is an active kick in rounds 6-10
        let sdFirst = state.kicksFirst[5];
        let sdSecond = state.kicksSecond[5];

        for (let r = 5; r < 10; r++) {
            if (state.kicksFirst[r] || state.kicksSecond[r]) {
                sdFirst = state.kicksFirst[r];
                sdSecond = state.kicksSecond[r];
            }
        }

        payload['先攻6'] = mapKickImg(sdFirst);
        payload['後攻6'] = mapKickImg(sdSecond);

        return payload;
    };

    const sendToCenterPK = () => {
        const payload = buildPayload('PK');
        pkCenter.setData(payload);
        pkCenter.show(payload);
    };

    const sendToTopLeftPK = () => {
        const payload = buildPayload('左上PK');
        pkTopLeft.setData(payload);
        pkTopLeft.show(payload);
    };

    const updateLivePK = () => {
        if (pkCenter.isVisible) {
            pkCenter.update(buildPayload('PK'));
        }
        if (pkTopLeft.isVisible) {
            pkTopLeft.update(buildPayload('左上PK'));
        }
    };

    // One-click toggle between Left-Top PK and Center PK
    const togglePKTelopType = () => {
        if (pkCenter.isVisible) {
            pkCenter.hide();
            setTimeout(() => {
                sendToTopLeftPK();
            }, 150);
        } else if (pkTopLeft.isVisible) {
            pkTopLeft.hide();
            setTimeout(() => {
                sendToCenterPK();
            }, 150);
        } else {
            // Default to Left-Top PK if neither is on air
            sendToTopLeftPK();
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', borderColor: 'var(--accent-primary)' }}>
            
            {/* Header Controls */}
            <div className="flex-between" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffca28' }}>⚽ PK戦 入力 & CG送出</h3>
                    <span className="status-badge" style={{ background: showInning6 ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: showInning6 ? '#ffca28' : '#aaa' }}>
                        {showInning6 ? '⚖️ 6イニング目表示 (5回目ベース非表示 / 6回目得点表示)' : '5イニング目表示 (デフォルト)'}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                        className="btn btn-warning" 
                        style={{ fontWeight: 'bold', padding: '6px 14px', fontSize: '0.9rem' }}
                        onClick={togglePKTelopType}
                        title="ワンクリックで左上PKとセンターPKを切り替えます"
                    >
                        🔄 PK表示切替 ({pkTopLeft.isVisible ? '左上PK OnAir ➔ PKへ' : pkCenter.isVisible ? 'PK OnAir ➔ 左上PKへ' : '左上PKを表示'})
                    </button>
                    <button className="btn btn-primary" onClick={updateLivePK} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                        Update LIVE
                    </button>
                    <button className="btn btn-secondary" onClick={resetPK} style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
                        リセット
                    </button>
                </div>
            </div>

            {/* Team Names Input & Scoreboard Display */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', marginBottom: '16px', alignItems: 'center', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px' }}>
                <div>
                    <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>先攻チーム</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        value={state.teamFirst} 
                        onChange={e => setPkState(prev => ({ ...(prev || DEFAULT_PK_STATE), teamFirst: e.target.value }))}
                        style={{ fontWeight: 'bold', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ textAlign: 'center', padding: '0 12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>PK SCORE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '4px', color: '#ffca28' }}>
                        {scoreFirst} - {scoreSecond}
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '4px' }}>後攻チーム</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        value={state.teamSecond} 
                        onChange={e => setPkState(prev => ({ ...(prev || DEFAULT_PK_STATE), teamSecond: e.target.value }))}
                        style={{ fontWeight: 'bold', fontSize: '1rem' }}
                    />
                </div>
            </div>

            {/* Manual Unlock Checkbox */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#aaa' }}>
                    <input 
                        type="checkbox" 
                        checked={state.manualUnlock} 
                        onChange={e => setPkState(prev => ({ ...(prev || DEFAULT_PK_STATE), manualUnlock: e.target.checked }))} 
                    />
                    <span>6〜10本目を手動で常に解放する</span>
                </label>
            </div>

            {/* PK Kick Matrix (Rounds 1 - 10) */}
            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table className="modern-table" style={{ width: '100%', fontSize: '0.85rem', textAlign: 'center' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ textAlign: 'left', width: '100px' }}>チーム</th>
                            {[...Array(10)].map((_, i) => {
                                const isUnlocked = getRoundUnlocked(i);
                                return (
                                    <th key={i} style={{ color: i >= 5 ? (isUnlocked ? '#ffca28' : '#666') : 'white', minWidth: '70px' }}>
                                        {i + 1}本目 {i >= 5 ? (isUnlocked ? '🔓' : '🔒') : ''}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {/* 先攻 Row */}
                        <tr>
                            <td style={{ fontWeight: 'bold', textAlign: 'left', color: '#198754' }}>
                                先攻: {state.teamFirst}
                            </td>
                            {[...Array(10)].map((_, i) => {
                                const isUnlocked = getRoundUnlocked(i);
                                const currentVal = state.kicksFirst[i];
                                return (
                                    <td key={i} style={{ opacity: isUnlocked ? 1 : 0.45, background: isUnlocked ? 'transparent' : 'rgba(0,0,0,0.3)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minHeight: '28px', color: currentVal === 'goal' ? '#4caf50' : currentVal === 'miss' ? '#f44336' : '#555' }}>
                                                {currentVal === 'goal' ? '◯' : currentVal === 'miss' ? '✕' : '-'}
                                            </div>
                                            {isUnlocked && (
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    <button 
                                                        className={`btn ${currentVal === 'goal' ? 'btn-success' : 'btn-secondary'}`}
                                                        style={{ padding: '2px 4px', fontSize: '0.65rem' }} 
                                                        onClick={() => handleKickChange('first', i, currentVal === 'goal' ? '' : 'goal')}
                                                    >◯</button>
                                                    <button 
                                                        className={`btn ${currentVal === 'miss' ? 'btn-danger' : 'btn-secondary'}`}
                                                        style={{ padding: '2px 4px', fontSize: '0.65rem' }} 
                                                        onClick={() => handleKickChange('first', i, currentVal === 'miss' ? '' : 'miss')}
                                                    >✕</button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* 後攻 Row */}
                        <tr>
                            <td style={{ fontWeight: 'bold', textAlign: 'left', color: '#0dcaf0' }}>
                                後攻: {state.teamSecond}
                            </td>
                            {[...Array(10)].map((_, i) => {
                                const isUnlocked = getRoundUnlocked(i);
                                const currentVal = state.kicksSecond[i];
                                return (
                                    <td key={i} style={{ opacity: isUnlocked ? 1 : 0.45, background: isUnlocked ? 'transparent' : 'rgba(0,0,0,0.3)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minHeight: '28px', color: currentVal === 'goal' ? '#4caf50' : currentVal === 'miss' ? '#f44336' : '#555' }}>
                                                {currentVal === 'goal' ? '◯' : currentVal === 'miss' ? '✕' : '-'}
                                            </div>
                                            {isUnlocked && (
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    <button 
                                                        className={`btn ${currentVal === 'goal' ? 'btn-success' : 'btn-secondary'}`}
                                                        style={{ padding: '2px 4px', fontSize: '0.65rem' }} 
                                                        onClick={() => handleKickChange('second', i, currentVal === 'goal' ? '' : 'goal')}
                                                    >◯</button>
                                                    <button 
                                                        className={`btn ${currentVal === 'miss' ? 'btn-danger' : 'btn-secondary'}`}
                                                        style={{ padding: '2px 4px', fontSize: '0.65rem' }} 
                                                        onClick={() => handleKickChange('second', i, currentVal === 'miss' ? '' : 'miss')}
                                                    >✕</button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Direct Individual Graphic Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', borderLeft: pkTopLeft.isVisible ? '4px solid var(--accent-success)' : '4px solid transparent' }}>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.9rem' }}>左上PK (Top-Left Scoreboard)</strong>
                        {pkTopLeft.isVisible && <span className="status-badge status-connected" style={{ fontSize: '0.65rem' }}>ON AIR</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-success" style={{ flex: 1, padding: '4px', fontSize: '0.8rem' }} onClick={sendToTopLeftPK}>TAKE 左上PK</button>
                        <button className="btn btn-danger" style={{ flex: 1, padding: '4px', fontSize: '0.8rem' }} onClick={pkTopLeft.hide}>HIDE</button>
                    </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', borderLeft: pkCenter.isVisible ? '4px solid var(--accent-success)' : '4px solid transparent' }}>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.9rem' }}>PK (Center Screen)</strong>
                        {pkCenter.isVisible && <span className="status-badge status-connected" style={{ fontSize: '0.65rem' }}>ON AIR</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-success" style={{ flex: 1, padding: '4px', fontSize: '0.8rem' }} onClick={sendToCenterPK}>TAKE センターPK</button>
                        <button className="btn btn-danger" style={{ flex: 1, padding: '4px', fontSize: '0.8rem' }} onClick={pkCenter.hide}>HIDE</button>
                    </div>
                </div>
            </div>

        </div>
    );
}
