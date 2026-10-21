import React, { useState } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';

export interface TeamConfig {
    id: string; // 固有ID
    name: string; // １）チーム名 (例: 札幌創成)
    color: string; // ２）チームカラー (例: #198754)
    smallScoreName: string; // ３）小得点のチーム名表記 (例: 創成)
    oneShotName: string; // ４）１SHOTの上段部分のチーム名表記 (例: 札幌創成)
    bigScoreName: string; // ５）大得点のチーム名表記 (例: 札幌創成)
    formationSystem: string; // ６）フォーメーションの設定 (例: 4-4-2, 4-3-3, 4-2-3-1)
    formationTelopName: string; // フォーメーションテロップのチーム名表記 (例: 札幌創成)
}

export const DEFAULT_TEAM_CONFIGS: TeamConfig[] = [
    {
        id: 'sokosei',
        name: '札幌創成',
        color: '#198754',
        smallScoreName: '創成',
        oneShotName: '札幌創成',
        bigScoreName: '札幌創成',
        formationSystem: '4-4-2',
        formationTelopName: '札幌創成'
    },
    {
        id: 'otani',
        name: '札幌大谷',
        color: '#bd39fb',
        smallScoreName: '大谷',
        oneShotName: '札幌大谷',
        bigScoreName: '札幌大谷',
        formationSystem: '4-3-3',
        formationTelopName: '札幌大谷'
    },
    {
        id: 'obihirokita',
        name: '帯広北',
        color: '#0dcaf0',
        smallScoreName: '帯北',
        oneShotName: '帯広北',
        bigScoreName: '帯広北',
        formationSystem: '4-2-3-1',
        formationTelopName: '帯広北'
    },
    {
        id: 'hokkai',
        name: '北海',
        color: '#ffca28',
        smallScoreName: '北海',
        oneShotName: '北海',
        bigScoreName: '北海',
        formationSystem: '4-4-2',
        formationTelopName: '北海'
    }
];

const FORMATION_OPTIONS = ['4-4-2', '4-3-3', '4-2-3-1', '3-4-2-1', '3-5-2', '4-1-4-1', '5-3-2'];

export default function TeamSettings() {
    const [teamConfigs, setTeamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const [schools, setSchools] = useSyncedState<string[]>('school_list', ['札幌創成', '札幌大谷', '帯広北', '北海']);
    const [oaLeftTeam, setOaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam, setOaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');

    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;

    const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'sokosei');
    const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

    // Form state
    const [form, setForm] = useState<TeamConfig>(teams[0] || DEFAULT_TEAM_CONFIGS[0]);

    // Handle Team Selection from List
    const handleSelectTeam = (team: TeamConfig) => {
        setIsCreatingNew(false);
        setSelectedTeamId(team.id);
        setForm({ ...team });
    };

    // Prepare Create New Team Form
    const handleStartCreateNew = () => {
        setIsCreatingNew(true);
        setSelectedTeamId('');
        setForm({
            id: `team_${Date.now()}`,
            name: '',
            color: '#198754',
            smallScoreName: '',
            oneShotName: '',
            bigScoreName: '',
            formationSystem: '4-4-2',
            formationTelopName: ''
        });
    };

    // Auto fill other name fields when main team name changes
    const handleMainNameChange = (val: string) => {
        setForm(prev => {
            const next = { ...prev, name: val };
            if (!prev.smallScoreName || prev.smallScoreName === prev.name) {
                next.smallScoreName = val.length > 2 ? val.slice(-2) : val;
            }
            if (!prev.oneShotName || prev.oneShotName === prev.name) {
                next.oneShotName = val;
            }
            if (!prev.bigScoreName || prev.bigScoreName === prev.name) {
                next.bigScoreName = val;
            }
            if (!prev.formationTelopName || prev.formationTelopName === prev.name) {
                next.formationTelopName = val;
            }
            return next;
        });
    };

    // Save or Update Team
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = form.name.trim();
        if (!trimmedName) {
            alert('チーム名を入力してください。');
            return;
        }

        const updatedConfig: TeamConfig = {
            ...form,
            name: trimmedName,
            color: form.color || '#198754',
            smallScoreName: (form.smallScoreName || trimmedName).trim(),
            oneShotName: (form.oneShotName || trimmedName).trim(),
            bigScoreName: (form.bigScoreName || trimmedName).trim(),
            formationSystem: form.formationSystem || '4-4-2',
            formationTelopName: (form.formationTelopName || trimmedName).trim()
        };

        if (isCreatingNew) {
            // 新規追加
            setTeamConfigs(prev => [...(prev || DEFAULT_TEAM_CONFIGS), updatedConfig]);
            // 学校一覧にも追加
            if (!schools?.includes(trimmedName)) {
                setSchools(prev => [...(prev || []), trimmedName]);
            }
            setIsCreatingNew(false);
            setSelectedTeamId(updatedConfig.id);
            alert(`チーム「${trimmedName}」を登録しました！`);
        } else {
            // 更新
            const oldTeam = teams.find(t => t.id === form.id);
            const oldName = oldTeam?.name;

            setTeamConfigs(prev => (prev || DEFAULT_TEAM_CONFIGS).map(t => t.id === form.id ? updatedConfig : t));

            // 学校名リストの同期
            if (oldName && oldName !== trimmedName) {
                setSchools(prev => (prev || []).map(s => s === oldName ? trimmedName : s));
                if (oaLeftTeam === oldName) setOaLeftTeam(trimmedName);
                if (oaRightTeam === oldName) setOaRightTeam(trimmedName);
            } else if (!schools?.includes(trimmedName)) {
                setSchools(prev => [...(prev || []), trimmedName]);
            }

            alert(`チーム「${trimmedName}」の設定を更新しました！`);
        }
    };

    // Delete Team
    const handleDeleteTeam = (id: string, name: string) => {
        if (confirm(`チーム「${name}」を削除しますか？`)) {
            const nextList = teams.filter(t => t.id !== id);
            setTeamConfigs(nextList);
            if (nextList.length > 0) {
                handleSelectTeam(nextList[0]);
            } else {
                handleStartCreateNew();
            }
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="flex-between" style={{ marginBottom: 20 }}>
                <div>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>🛡️</span>
                        <span>チーム情報・テロップ表記設定 (Team Settings)</span>
                    </h2>
                    <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: '0.9rem' }}>
                        チーム名・カラーおよび各テロップ（小得点・1SHOT・大得点・フォーメーション）での表示表記を一元管理します。
                    </p>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={handleStartCreateNew}
                    style={{ padding: '8px 16px', fontWeight: 'bold' }}
                >
                    ➕ 新規チーム登録
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24 }}>
                
                {/* LEFT: Team List Panel */}
                <div className="glass-panel" style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#ffca28' }}>
                        登録チーム一覧 ({teams.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {teams.map(t => {
                            const isSelected = !isCreatingNew && t.id === selectedTeamId;
                            const isOaLeft = t.name === oaLeftTeam;
                            const isOaRight = t.name === oaRightTeam;
                            return (
                                <div 
                                    key={t.id}
                                    onClick={() => handleSelectTeam(t)}
                                    style={{
                                        padding: '12px 14px',
                                        borderRadius: 8,
                                        background: isSelected ? 'rgba(255, 202, 40, 0.15)' : 'rgba(0,0,0,0.2)',
                                        border: isSelected ? '2px solid #ffca28' : '1px solid rgba(255,255,255,0.08)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {/* Color Indicator */}
                                        <div style={{ 
                                            width: 24, 
                                            height: 24, 
                                            borderRadius: '50%', 
                                            background: t.color,
                                            boxShadow: `0 0 8px ${t.color}`,
                                            border: '2px solid rgba(255,255,255,0.5)'
                                        }} />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>
                                                {t.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#aaa', display: 'flex', gap: 6 }}>
                                                <span>小得点: {t.smallScoreName || t.name}</span>
                                                <span>•</span>
                                                <span>{t.formationSystem || '4-4-2'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* OA Status Badges */}
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {isOaLeft && (
                                            <span style={{ fontSize: '0.65rem', background: '#198754', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 'bold' }}>
                                                OA左
                                            </span>
                                        )}
                                        {isOaRight && (
                                            <span style={{ fontSize: '0.65rem', background: '#0dcaf0', color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 'bold' }}>
                                                OA右
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: Team Edit & Customization Form */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div className="flex-between" style={{ marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', background: form.color, boxShadow: `0 0 8px ${form.color}` }} />
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                                {isCreatingNew ? '➕ 新規チーム登録' : `🛡️ 「${form.name}」の設定編集`}
                            </h3>
                        </div>
                        {!isCreatingNew && teams.length > 1 && (
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                                onClick={() => handleDeleteTeam(form.id, form.name)}
                            >
                                🗑️ チーム削除
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        {/* 1) チーム名編集 & 2) チームカラー指定 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16, marginBottom: 20 }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" style={{ fontWeight: 'bold', color: '#ffca28' }}>
                                    １）チーム名 (正式名称) *
                                </label>
                                <input 
                                    className="form-input" 
                                    style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                    placeholder="例: 札幌創成" 
                                    required 
                                    value={form.name} 
                                    onChange={e => handleMainNameChange(e.target.value)} 
                                />
                                <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                    ※大会登録名・選手所属のベース名
                                </span>
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" style={{ fontWeight: 'bold', color: '#ffca28' }}>
                                    ２）チームカラー (帯・ザブトン) *
                                </label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={form.color || '#198754'} 
                                        onChange={e => setForm({ ...form, color: e.target.value })} 
                                        style={{ width: 44, height: 40, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                                    />
                                    <input 
                                        className="form-input" 
                                        style={{ flex: 1, fontFamily: 'monospace', fontWeight: 'bold' }}
                                        value={form.color || '#198754'} 
                                        onChange={e => setForm({ ...form, color: e.target.value })} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 各テロップでのチーム名表記セクション */}
                        <div style={{ background: 'rgba(0,0,0,0.25)', padding: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
                            <h4 style={{ margin: '0 0 14px', fontSize: '0.95rem', color: '#4caf50' }}>
                                📺 テロップ送出時のチーム名表記指定
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                                
                                {/* 3) 小得点のチーム名表記 */}
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 'bold' }}>
                                        ３）小得点のチーム名表記
                                    </label>
                                    <input 
                                        className="form-input" 
                                        placeholder="例: 創成 (2〜3文字推奨)" 
                                        value={form.smallScoreName} 
                                        onChange={e => setForm({ ...form, smallScoreName: e.target.value })} 
                                        style={{ fontWeight: 'bold' }}
                                    />
                                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                                        常時表示のスコア帯に収まる略称
                                    </span>
                                </div>

                                {/* 4) 1SHOTの上段部分のチーム名表記 */}
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 'bold' }}>
                                        ４）１SHOT上段のチーム名表記
                                    </label>
                                    <input 
                                        className="form-input" 
                                        placeholder="例: 札幌創成" 
                                        value={form.oneShotName} 
                                        onChange={e => setForm({ ...form, oneShotName: e.target.value })} 
                                        style={{ fontWeight: 'bold' }}
                                    />
                                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                                        選手紹介の左上所属に表示
                                    </span>
                                </div>

                                {/* 5) 大得点のチーム名表記 */}
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 'bold' }}>
                                        ５）大得点のチーム名表記
                                    </label>
                                    <input 
                                        className="form-input" 
                                        placeholder="例: 札幌創成" 
                                        value={form.bigScoreName} 
                                        onChange={e => setForm({ ...form, bigScoreName: e.target.value })} 
                                        style={{ fontWeight: 'bold' }}
                                    />
                                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                                        試合開始前・ハーフタイムの大得点
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* 6) フォーメーションの設定 */}
                        <div style={{ background: 'rgba(0,0,0,0.25)', padding: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
                            <h4 style={{ margin: '0 0 14px', fontSize: '0.95rem', color: '#0dcaf0' }}>
                                ６）フォーメーションの設定
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 'bold' }}>
                                        基本フォーメーション (System)
                                    </label>
                                    <select 
                                        className="form-select"
                                        value={form.formationSystem || '4-4-2'}
                                        onChange={e => setForm({ ...form, formationSystem: e.target.value })}
                                        style={{ fontWeight: 'bold', fontSize: '1rem' }}
                                    >
                                        {FORMATION_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                                        チームの標準布陣
                                    </span>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 'bold' }}>
                                        フォーメーションCGの学校名表記
                                    </label>
                                    <input 
                                        className="form-input" 
                                        placeholder="例: 札幌創成" 
                                        value={form.formationTelopName} 
                                        onChange={e => setForm({ ...form, formationTelopName: e.target.value })} 
                                        style={{ fontWeight: 'bold' }}
                                    />
                                    <span style={{ fontSize: '0.72rem', color: '#888' }}>
                                        陣形CG上部に送出される学校名
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 送出プレビュー（リアルタイム確認カード） */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#aaa', marginBottom: 10 }}>
                                👁️ 送出表記プレビュー
                            </div>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                                
                                {/* 小得点バッジ風 */}
                                <div style={{ display: 'flex', alignItems: 'center', background: '#000', border: '1px solid #333', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ width: 8, height: 28, background: form.color }} />
                                    <div style={{ padding: '4px 10px', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>
                                        {form.smallScoreName || form.name || '略称'}
                                    </div>
                                    <div style={{ padding: '4px 8px', background: '#222', color: '#ffca28', fontWeight: 'bold' }}>0</div>
                                </div>

                                {/* 1Shot所属バッジ風 */}
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.6)', border: `2px solid ${form.color}`, borderRadius: 4, padding: '4px 12px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#aaa', marginRight: 6 }}>所属:</span>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fff' }}>
                                        {form.oneShotName || form.name || 'チーム名'}
                                    </span>
                                </div>

                                {/* フォーメーションバッジ */}
                                <div style={{ display: 'flex', alignItems: 'center', background: '#111', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '4px 10px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0dcaf0' }}>
                                        {form.formationTelopName || form.name} ({form.formationSystem})
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button 
                                type="submit" 
                                className="btn btn-success" 
                                style={{ flex: 1, padding: '12px', fontSize: '1rem', fontWeight: 'bold' }}
                            >
                                💾 チーム設定を保存してテロップに反映
                            </button>
                            {isCreatingNew && (
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    style={{ padding: '12px 20px' }}
                                    onClick={() => handleSelectTeam(teams[0])}
                                >
                                    キャンセル
                                </button>
                            )}
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}
