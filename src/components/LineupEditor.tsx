import React, { useState } from 'react';
import { useSyncedState, useTelop } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from './TeamSettings';

export const FORMATION_SLOTS = [
    { id: 'GK', label: 'GK', miniIdx: 1, posPrefix: 'GK' },
    { id: 'DF1', label: 'DF (1)', miniIdx: 2, posPrefix: 'DF' },
    { id: 'DF2', label: 'DF (2)', miniIdx: 3, posPrefix: 'DF' },
    { id: 'DF3', label: 'DF (3)', miniIdx: 4, posPrefix: 'DF' },
    { id: 'DF4', label: 'DF (4)', miniIdx: 5, posPrefix: 'DF' },
    { id: 'MF1', label: 'MF (1)', miniIdx: 6, posPrefix: 'MF' },
    { id: 'MF2', label: 'MF (2)', miniIdx: 7, posPrefix: 'MF' },
    { id: 'MF3', label: 'MF (3)', miniIdx: 8, posPrefix: 'MF' },
    { id: 'MF4', label: 'MF (4)', miniIdx: 9, posPrefix: 'MF' },
    { id: 'FW1', label: 'FW (1)', miniIdx: 10, posPrefix: 'FW' },
    { id: 'FW2', label: 'FW (2)', miniIdx: 11, posPrefix: 'FW' }
];

// Mirror map for horizontally flipping left formation onto right formation
const MIRROR_SLOT_MAP: Record<string, string> = {
    'GK': 'GK',
    'DF1': 'DF4',
    'DF2': 'DF3',
    'DF3': 'DF2',
    'DF4': 'DF1',
    'MF1': 'MF4',
    'MF2': 'MF3',
    'MF3': 'MF2',
    'MF4': 'MF1',
    'FW1': 'FW2',
    'FW2': 'FW1'
};

export default function LineupEditor() {
    const [players] = useSyncedState<Player[]>('roster', []);
    const [schools] = useSyncedState<string[]>('school_list', ['札幌創成', '札幌大谷', '帯広北', '北海']);
    const [oaLeftTeam, setOaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam, setOaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const [teamMode, setTeamMode] = useState<'left' | 'right'>('left');
    
    // Lineup state (slotId -> player.id) for both teams
    const [leftLineup, setLeftLineup] = useSyncedState<Record<string, string>>('left_lineup', {});
    const [rightLineup, setRightLineup] = useSyncedState<Record<string, string>>('right_lineup', {});

    const formationLeft = useTelop('フォーメーション左');
    const formationRight = useTelop('フォーメーション右');
    const miniFormationLeft = useTelop('左下ミニフォーメーション');

    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;
    const currentTargetTeam = teamMode === 'left' ? oaLeftTeam : oaRightTeam;
    const currentTeamConfig = teams.find(t => t.name === currentTargetTeam);
    const formationSchoolName = currentTeamConfig?.formationTelopName || currentTargetTeam;

    const activeSchools = Array.from(new Set([...(schools || ['札幌創成', '札幌大谷', '帯広北', '北海'])]));

    const currentLineup = teamMode === 'left' ? (leftLineup || {}) : (rightLineup || {});
    const targetSchool = teamMode === 'left' ? oaLeftTeam : oaRightTeam;
    const availablePlayers = (players || []).filter(p => {
        const school = p.schoolName || (p.teamId === 'right' ? oaRightTeam : oaLeftTeam);
        return school === targetSchool;
    });

    const handleAssign = (slotId: string, playerId: string) => {
        if (teamMode === 'left') {
            setLeftLineup(prev => ({ ...(prev || {}), [slotId]: playerId }));
        } else {
            setRightLineup(prev => ({ ...(prev || {}), [slotId]: playerId }));
        }
    };

    // Mirror Left lineup & formation onto Right team
    const mirrorLeftToRight = () => {
        const rightPlayers = (players || []).filter(p => {
            const school = p.schoolName || (p.teamId === 'right' ? oaRightTeam : oaLeftTeam);
            return school === oaRightTeam;
        });
        const newRightLineup: Record<string, string> = {};

        // Assign right team players into mirrored slots based on position matching or order
        FORMATION_SLOTS.forEach(slot => {
            const mirroredSlotId = MIRROR_SLOT_MAP[slot.id] || slot.id;
            const leftPlayerId = leftLineup?.[leftPlayerIdKey(mirroredSlotId)];
            
            // Find corresponding right player by index or position
            const leftP = players?.find(p => p.id === leftPlayerId);
            if (leftP) {
                const matchingRightP = rightPlayers.find(p => p.position === leftP.position && !Object.values(newRightLineup).includes(p.id));
                if (matchingRightP) {
                    newRightLineup[slot.id] = matchingRightP.id;
                }
            }
        });

        // Fallback: fill remaining unassigned right slots with available right team starters
        let unassignedIdx = 0;
        FORMATION_SLOTS.forEach(slot => {
            if (!newRightLineup[slot.id] && rightPlayers[unassignedIdx]) {
                while (unassignedIdx < rightPlayers.length && Object.values(newRightLineup).includes(rightPlayers[unassignedIdx].id)) {
                    unassignedIdx++;
                }
                if (rightPlayers[unassignedIdx]) {
                    newRightLineup[slot.id] = rightPlayers[unassignedIdx].id;
                    unassignedIdx++;
                }
            }
        });

        setRightLineup(newRightLineup);
        alert(`左チーム（${oaLeftTeam}）の陣形配置を右チーム（${oaRightTeam}）に反転適用しました！`);
    };

    function leftPlayerIdKey(slotId: string): string {
        return slotId;
    }

    const sendToTelop = () => {
        const data: any = {};
        const miniData: any = {};

        // ６）フォーメーション設定 & チーム設定の表記を反映
        data['学校名'] = formationSchoolName;
        miniData['高校名テキスト'] = formationSchoolName;
        miniData['高校名ベース'] = formationSchoolName;

        FORMATION_SLOTS.forEach(slot => {
            const playerId = currentLineup[slot.id];
            if (playerId) {
                const p = players?.find(x => x.id === playerId);
                if (p) {
                    // Full formation telop data
                    data[slot.id] = {
                        Name: p.name,
                        Number: p.number,
                        GakuNen: p.grade ? (p.grade.includes('年') ? `(${p.grade})` : `(${p.grade}年)`) : '',
                        ...Object.fromEntries(
                            ['1','2','3','4','5'].flatMap(n => [
                                [`Name${n}`, p.name],
                                [`Number${n}`, p.number]
                            ])
                        )
                    };
                    
                    data[`${slot.id}_Name`] = p.name;
                    data[`${slot.id}_Number`] = p.number;

                    // Mini formation telop data mapping (Linked!)
                    if (teamMode === 'left') {
                        miniData[`選手名${slot.miniIdx}`] = p.name;
                        miniData[`ポジション&背番号${slot.miniIdx}`] = `${slot.posPrefix} ${p.number}`;
                    }
                }
            }
        });

        if (teamMode === 'right') {
            formationRight.setData(data);
            formationRight.update(data);
            alert('Sent to Formation (Right)');
        } else {
            // Synchronize both Formation (Left) and Mini Formation (Left)!
            formationLeft.setData(data);
            formationLeft.update(data);
            
            miniFormationLeft.setData(miniData);
            miniFormationLeft.update(miniData);

            alert('Sent to Formation (Left) & Mini Formation (Left) - Linked!');
        }
    };

    return (
        <div>
            <h2>Starting Lineups & Formation Layout</h2>

            {/* 当日OAチーム選択設定パネル */}
            <div className="glass-panel" style={{ marginTop: 16, marginBottom: 20, padding: '16px 20px', border: '1px solid rgba(255, 202, 40, 0.4)', background: 'rgba(255, 202, 40, 0.05)' }}>
                <div className="flex-between" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.2rem' }}>⚽</span>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffca28' }}>
                            当日OAチーム設定 (Today's Broadcast Match)
                        </h3>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                        ※ここでの選択がPlayerRegistry・CGOperation（選手一覧・スコア名・テロップ）に反映されます
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="form-label" style={{ color: '#198754', fontWeight: 'bold' }}>
                            ⬅️ OA左チーム (HOME)
                        </label>
                        <select 
                            className="form-select" 
                            style={{ fontWeight: 'bold', borderColor: '#198754' }}
                            value={oaLeftTeam} 
                            onChange={e => setOaLeftTeam(e.target.value)}
                        >
                            {activeSchools.map(sch => (
                                <option key={sch} value={sch}>{sch}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#888', marginTop: 18 }}>
                        VS
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="form-label" style={{ color: '#0dcaf0', fontWeight: 'bold' }}>
                            ➡️ OA右チーム (AWAY)
                        </label>
                        <select 
                            className="form-select" 
                            style={{ fontWeight: 'bold', borderColor: '#0dcaf0' }}
                            value={oaRightTeam} 
                            onChange={e => setOaRightTeam(e.target.value)}
                        >
                            {activeSchools.map(sch => (
                                <option key={sch} value={sch}>{sch}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="flex-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className={`btn ${teamMode === 'left' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTeamMode('left')} style={{ padding: '8px 16px', fontWeight: 'bold' }}>
                        ⬅️ 左チーム ({oaLeftTeam})
                    </button>
                    <button className={`btn ${teamMode === 'right' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTeamMode('right')} style={{ padding: '8px 16px', fontWeight: 'bold' }}>
                        ➡️ 右チーム ({oaRightTeam})
                    </button>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {teamMode === 'right' && (
                        <button className="btn btn-warning" onClick={mirrorLeftToRight} title="左チームの陣形配置をベースに反転設定します">
                            ⚡ 左ベースで反転適用 (Mirror Left)
                        </button>
                    )}
                    <button className="btn btn-success" onClick={sendToTelop}>
                        {teamMode === 'left' ? `📡 ${oaLeftTeam} 送出 (Formation Left & Mini Linked)` : `📡 ${oaRightTeam} 送出 (Formation Right)`}
                    </button>
                </div>
            </div>

            <div className="glass-panel">
                <div className="flex-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 style={{ margin: 0, color: teamMode === 'left' ? '#198754' : '#0dcaf0' }}>
                            {teamMode === 'left' ? `${oaLeftTeam} スターティングラインナップ (フォーメーション左・ミニ連動)` : `${oaRightTeam} スターティングラインナップ`}
                        </h3>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                            陣形: <strong style={{ color: '#0dcaf0' }}>{currentTeamConfig?.formationSystem || '4-4-2'}</strong>
                        </span>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                            送出表記: <strong style={{ color: '#ffca28' }}>{formationSchoolName}</strong>
                        </span>
                    </div>
                </div>

                <div className="grid-cards">
                    {FORMATION_SLOTS.map(slot => (
                        <div key={slot.id} style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, borderLeft: '3px solid rgba(255,255,255,0.1)' }}>
                            <label className="form-label" style={{ fontWeight: 'bold' }}>{slot.label}</label>
                            <select 
                                className="form-select" 
                                value={currentLineup[slot.id] || ''} 
                                onChange={e => handleAssign(slot.id, e.target.value)}
                            >
                                <option value="">-- Select Player --</option>
                                {availablePlayers.map(p => (
                                    <option key={p.id} value={p.id}>#{p.number} - {p.name} ({p.position})</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
