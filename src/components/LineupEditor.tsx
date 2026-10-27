import React, { useEffect, useState } from 'react';
import { useSyncedState, useTelop } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { TeamConfig, DEFAULT_TEAM_CONFIGS, FORMATION_OPTIONS } from './TeamSettings';
import FormationBoard, { BoardPlate } from './FormationBoard';
import MatchLog from './MatchLog';
import {
    FORMATION_SLOTS, SUB_SLOT_COUNT, TEAM_LINEUPS_KEY, TeamLineup,
    emptyLineup, migrateStarters, buildFormationPayload
} from '../utils/lineup';
import { Point, defaultPositions, resolvePositions, roleMap } from '../utils/formationLayout';

// Mirror map for horizontally flipping left formation onto right formation
const MIRROR_SLOT_MAP: Record<string, string> = {
    'GK': 'GK',
    'DF1': 'DF4',
    'DF2': 'DF3',
    'DF3': 'DF2',
    'DF4': 'DF1',
    'MF1': 'MF5',
    'MF2': 'MF4',
    'MF3': 'MF3',
    'MF4': 'MF2',
    'MF5': 'MF1',
    'FW': 'FW'
};

type AssignTarget = { kind: 'starter'; slotId: string } | { kind: 'sub'; index: number };

const normalizeLineup = (l?: TeamLineup | null): TeamLineup => ({
    starters: { ...(l?.starters || {}) },
    subs: Array.from({ length: SUB_SLOT_COUNT }, (_, i) => l?.subs?.[i] || ''),
    ...(l?.formation ? { formation: { system: l.formation.system, positions: { ...l.formation.positions } } } : {})
});

export default function LineupEditor() {
    const [players] = useSyncedState<Player[]>('roster', []);
    const [schools] = useSyncedState<string[]>('school_list', ['札幌創成', '札幌大谷', '帯広北', '北海']);
    const [oaLeftTeam, setOaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam, setOaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const [teamMode, setTeamMode] = useState<'left' | 'right'>('left');
    // 登録/更新時に ON AIR 中なら配置をそのまま CG へ反映する（CGOperation の TAKE と同じペイロード）
    const formationLeftTelop = useTelop('フォーメーション左');
    const formationRightTelop = useTelop('フォーメーション右');

    // 登録済みメンバー（学校名ごと）。CGOperation の Starters / Subs とフォーメーション・控え選手CGはこれを使う
    const [teamLineups, setTeamLineups] = useSyncedState<Record<string, TeamLineup>>(TEAM_LINEUPS_KEY, {});
    // 旧形式のスタメン配置（未登録の学校の初期値として読み込むだけ）
    const [legacyLeftLineup] = useSyncedState<Record<string, string>>('left_lineup', {});
    const [legacyRightLineup] = useSyncedState<Record<string, string>>('right_lineup', {});

    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;
    const currentTargetTeam = teamMode === 'left' ? oaLeftTeam : oaRightTeam;
    const currentTeamConfig = teams.find(t => t.name === currentTargetTeam);
    const formationSchoolName = currentTeamConfig?.formationTelopName || currentTargetTeam;

    const activeSchools = Array.from(new Set([...(schools || ['札幌創成', '札幌大谷', '帯広北', '北海'])]));

    const targetSchool = teamMode === 'left' ? oaLeftTeam : oaRightTeam;
    const registered = teamLineups?.[targetSchool];
    const availablePlayers = (players || []).filter(p => {
        const school = p.schoolName || (p.teamId === 'right' ? oaRightTeam : oaLeftTeam);
        return school === targetSchool;
    }).sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));

    // 編集中のメンバー（「メンバー登録/更新」を押すまで CGOperation には反映しない）
    const [draft, setDraft] = useState<TeamLineup>(emptyLineup());
    const [draftSchool, setDraftSchool] = useState<string>('');
    const [isDirty, setIsDirty] = useState(false);

    // 対象校が変わったら、または未編集なら登録内容を読み込み直す
    useEffect(() => {
        if (isDirty && draftSchool === targetSchool) return;
        const legacy = teamMode === 'left' ? legacyLeftLineup : legacyRightLineup;
        setDraft(registered ? normalizeLineup(registered) : { ...emptyLineup(), starters: migrateStarters(legacy) });
        setDraftSchool(targetSchool);
        setIsDirty(false);
    }, [targetSchool, registered, isDirty, draftSchool, teamMode, legacyLeftLineup, legacyRightLineup]);

    const switchTeam = (mode: 'left' | 'right') => {
        if (mode === teamMode) return;
        if (isDirty && !window.confirm('未登録の変更があります。破棄して切り替えますか？')) return;
        setIsDirty(false);
        setTeamMode(mode);
    };

    // 同じ選手は1か所にだけ置く（別の枠にいたら外してから入れる）
    const handleAssign = (target: AssignTarget, playerId: string) => {
        setDraft(prev => {
            const starters = { ...prev.starters };
            const subs = [...prev.subs];
            if (playerId) {
                Object.keys(starters).forEach(k => { if (starters[k] === playerId) delete starters[k]; });
                subs.forEach((id, i) => { if (id === playerId) subs[i] = ''; });
            }
            if (target.kind === 'starter') {
                if (playerId) starters[target.slotId] = playerId;
                else delete starters[target.slotId];
            } else {
                subs[target.index] = playerId;
            }
            return { ...prev, starters, subs };
        });
        setIsDirty(true);
    };

    // 陣形フォーメーション（未設定ならチーム設定の基本フォーメーションの標準配置）
    const fallbackSystem = currentTeamConfig?.formationSystem || '4-4-2';
    const formationSystem = draft.formation?.system || fallbackSystem;
    const formationPositions = resolvePositions(draft.formation, fallbackSystem);
    const roles = roleMap(formationSystem);
    const slotLabel = (slot: typeof FORMATION_SLOTS[number]) => `${slot.ps} ${roles[slot.ps] || ''}`;

    const setFormation = (system: string, positions: Record<string, Point>) => {
        setDraft(prev => ({ ...prev, formation: { system, positions } }));
        setIsDirty(true);
    };
    const handleSystemChange = (system: string) => setFormation(system, defaultPositions(system));
    const handlePositionsChange = (positions: Record<string, Point>) => setFormation(formationSystem, positions);
    const handleResetPositions = () => setFormation(formationSystem, defaultPositions(formationSystem));

    // メンバー登録/更新: CGOperation の Starters / Subs とCG送出データに反映。
    // フォーメーションCGが ON AIR 中なら、選手名と陣形の座標をその場で UPDATE する
    const handleRegister = () => {
        const saved: TeamLineup = { ...normalizeLineup(draft), updatedAt: Date.now() };
        setTeamLineups(prev => ({ ...(prev || {}), [targetSchool]: saved }));
        setIsDirty(false);

        const telop = teamMode === 'left' ? formationLeftTelop : formationRightTelop;
        if (telop.isVisible) {
            // TeamSettings のチームカラー（未設定時は画面の左右カラー）
            const color = currentTeamConfig?.color || (teamMode === 'right' ? '#0dcaf0' : '#198754');
            const payload = buildFormationPayload(saved, players || [], formationSchoolName, teamMode, fallbackSystem, color);
            telop.setData(payload);
            telop.update(payload);
        }
    };

    const handleResetDraft = () => {
        setDraft(registered ? normalizeLineup(registered) : emptyLineup());
        setIsDirty(false);
    };

    // Mirror Left lineup & formation onto Right team
    const mirrorLeftToRight = () => {
        const leftStarters = teamLineups?.[oaLeftTeam]?.starters || {};
        const rightPlayers = availablePlayers;
        const newStarters: Record<string, string> = {};
        const used = new Set<string>();

        // Assign right team players into mirrored slots based on position matching
        FORMATION_SLOTS.forEach(slot => {
            const mirroredSlotId = MIRROR_SLOT_MAP[slot.id] || slot.id;
            const leftP = players?.find(p => p.id === leftStarters[mirroredSlotId]);
            if (leftP) {
                const matchingRightP = rightPlayers.find(p => p.position === leftP.position && !used.has(p.id));
                if (matchingRightP) {
                    newStarters[slot.id] = matchingRightP.id;
                    used.add(matchingRightP.id);
                }
            }
        });

        // Fallback: fill remaining unassigned right slots with available right team players
        FORMATION_SLOTS.forEach(slot => {
            if (newStarters[slot.id]) return;
            const next = rightPlayers.find(p => !used.has(p.id));
            if (next) {
                newStarters[slot.id] = next.id;
                used.add(next.id);
            }
        });

        // 陣形も左チームのものを引き継ぐ（座標は左右共通の向きで保存しているので、そのまま右テロップでは反転される）
        const leftFormation = teamLineups?.[oaLeftTeam]?.formation;
        setDraft(prev => ({
            starters: newStarters,
            subs: prev.subs.map(id => (used.has(id) ? '' : id)),
            formation: leftFormation ? { system: leftFormation.system, positions: { ...leftFormation.positions } } : prev.formation
        }));
        setIsDirty(true);
        alert(`左チーム（${oaLeftTeam}）の陣形配置を右チーム（${oaRightTeam}）に反転適用しました。「メンバー登録/更新」で確定してください。`);
    };

    const usedLabel = (playerId: string): string => {
        const slot = FORMATION_SLOTS.find(s => draft.starters[s.id] === playerId);
        if (slot) return ` [${slotLabel(slot)}]`;
        const subIdx = draft.subs.indexOf(playerId);
        return subIdx >= 0 ? ` [控え${subIdx + 1}]` : '';
    };

    const renderPlayerSelect = (value: string, target: AssignTarget) => (
        <select
            className="form-select"
            value={value || ''}
            onChange={e => handleAssign(target, e.target.value)}
        >
            <option value="">-- Select Player --</option>
            {availablePlayers.map(p => (
                <option key={p.id} value={p.id}>
                    #{p.number} - {p.name} ({p.position}){p.id === value ? '' : usedLabel(p.id)}
                </option>
            ))}
        </select>
    );

    const teamColor = teamMode === 'left' ? '#198754' : '#0dcaf0';
    const starterCount = FORMATION_SLOTS.filter(s => draft.starters[s.id]).length;
    const subCount = draft.subs.filter(Boolean).length;
    const registeredAt = registered?.updatedAt ? new Date(registered.updatedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '';

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

            <MatchLog oaLeftTeam={oaLeftTeam} oaRightTeam={oaRightTeam} />

            <div className="flex-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className={`btn ${teamMode === 'left' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => switchTeam('left')} style={{ padding: '8px 16px', fontWeight: 'bold' }}>
                        ⬅️ 左チーム ({oaLeftTeam})
                    </button>
                    <button className={`btn ${teamMode === 'right' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => switchTeam('right')} style={{ padding: '8px 16px', fontWeight: 'bold' }}>
                        ➡️ 右チーム ({oaRightTeam})
                    </button>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {teamMode === 'right' && (
                        <button className="btn btn-warning" onClick={mirrorLeftToRight} title="左チームの陣形配置をベースに反転設定します">
                            ⚡ 左ベースで反転適用 (Mirror Left)
                        </button>
                    )}
                    <span style={{ fontSize: '0.8rem', color: isDirty ? '#ff9800' : '#aaa' }}>
                        {isDirty ? '● 未登録の変更あり' : (registered ? `登録済み ${registeredAt}` : '未登録')}
                    </span>
                    {isDirty && (
                        <button className="btn btn-secondary" onClick={handleResetDraft}>
                            変更を破棄
                        </button>
                    )}
                    <button className="btn btn-success" onClick={handleRegister} style={{ fontWeight: 'bold' }}>
                        ✅ {targetSchool} メンバー登録/更新
                    </button>
                </div>
            </div>

            {/* スタメン（2/3）と控え（1/3）を横並びにし、それぞれ見出しクリックで畳める */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <CollapsiblePanel
                    flex="2 1 520px"
                    color={teamColor}
                    title={`${targetSchool} スターティングメンバー (${starterCount}/${FORMATION_SLOTS.length})`}
                    badges={<>
                        <span style={badgeStyle}>
                            送出CG: <strong style={{ color: '#0dcaf0' }}>{teamMode === 'left' ? 'フォーメーション左' : 'フォーメーション右'}</strong>
                        </span>
                        <span style={badgeStyle}>
                            送出表記: <strong style={{ color: '#ffca28' }}>{formationSchoolName}</strong>
                        </span>
                    </>}
                >
                    <div style={{ ...compactGrid, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                        {FORMATION_SLOTS.map(slot => (
                            <div key={slot.id} style={slotCardStyle}>
                                <label className="form-label" style={{ fontWeight: 'bold' }}>{slotLabel(slot)}</label>
                                {renderPlayerSelect(draft.starters[slot.id], { kind: 'starter', slotId: slot.id })}
                            </div>
                        ))}
                    </div>
                </CollapsiblePanel>

                <CollapsiblePanel
                    flex="1 1 260px"
                    color={teamColor}
                    title={`${targetSchool} 控え選手 (${subCount}/${SUB_SLOT_COUNT})`}
                    badges={
                        <span style={badgeStyle}>
                            送出CG: <strong style={{ color: '#0dcaf0' }}>サブ下位置左</strong>
                        </span>
                    }
                >
                    <div style={{ ...compactGrid, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {draft.subs.map((playerId, idx) => (
                            <div key={idx} style={slotCardStyle}>
                                <label className="form-label" style={{ fontWeight: 'bold' }}>控え {idx + 1}</label>
                                {renderPlayerSelect(playerId, { kind: 'sub', index: idx })}
                            </div>
                        ))}
                    </div>
                </CollapsiblePanel>
            </div>

            <div className="glass-panel" style={{ marginTop: 16 }}>
                <div className="flex-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.2rem' }}>🧭</span>
                        <h3 style={{ margin: 0, color: teamColor }}>
                            {targetSchool} 陣形フォーメーション ({formationSystem})
                        </h3>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                            反映先: <strong style={{ color: '#0dcaf0' }}>{teamMode === 'left' ? 'フォーメーション左' : 'フォーメーション右'}</strong>
                        </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                        ※配置は「メンバー登録/更新」で保存され、ON AIR 中ならその場で、未送出なら次の TAKE から反映されます
                    </span>
                </div>
                <FormationBoard
                    side={teamMode}
                    system={formationSystem}
                    systemOptions={FORMATION_OPTIONS.includes(formationSystem) ? FORMATION_OPTIONS : [formationSystem, ...FORMATION_OPTIONS]}
                    positions={formationPositions}
                    roles={roles}
                    plates={Object.fromEntries(FORMATION_SLOTS.map(slot => {
                        const p = players?.find(pl => pl.id === draft.starters[slot.id]);
                        return [slot.ps, { number: p?.number, name: p?.name } as BoardPlate];
                    }))}
                    schoolLabel={formationSchoolName}
                    teamColor={currentTeamConfig?.color || teamColor}
                    onSystemChange={handleSystemChange}
                    onPositionsChange={handlePositionsChange}
                    onResetPositions={handleResetPositions}
                />
            </div>
        </div>
    );
}

const badgeStyle: React.CSSProperties = { fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 };
const compactGrid: React.CSSProperties = { display: 'grid', gap: 10 };
const slotCardStyle: React.CSSProperties = { background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 8, borderLeft: '3px solid rgba(255,255,255,0.1)' };

// 見出しクリックで開閉するパネル（CGOperation の Subs と同じ ▼/▶ 操作）
function CollapsiblePanel({ flex, color, title, badges, children }: {
    flex: string,
    color: string,
    title: string,
    badges?: React.ReactNode,
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="glass-panel" style={{ flex, minWidth: 0 }}>
            <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: isOpen ? 12 : 0, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setIsOpen(o => !o)}
                title={isOpen ? 'クリックで畳む' : 'クリックで開く'}
            >
                <h3 style={{ margin: 0, color }}>{isOpen ? '▼' : '▶'} {title}</h3>
                {badges}
            </div>
            {isOpen && children}
        </div>
    );
}
