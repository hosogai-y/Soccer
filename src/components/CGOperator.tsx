import React, { useState, useEffect } from 'react';
import { useTelop, useClearAll, useSyncedState, useTelopHub } from '@sdk/TelopHubSDK';
import { Player, toHalfWidthNum } from './PlayerRegistry';
import { TimerState } from './GlobalTimerManager';
import { buildTimerPayload } from '../utils/timerHelper';
import PKControl from './PKControl';
import WeatherStatsSubControl, { StatsData } from './WeatherStatsSubControl';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from './TeamSettings';
import { matchPlayerPhoto, fetchPhotoList, PhotoItem, normalizePhotoUrl } from '../utils/photoMatcher';

// Profile 2 (プロ２) はユーザー要望により削除
const ALL_TELOPS = [
    { name: '大得点', label: 'Big Score (大得点)' },
    { name: '小得点', label: 'Small Score (小得点)' },
    { name: 'タイマー', label: 'Timer (タイマー)' },
    { name: 'アディショナルタイム', label: 'Loss Time (AT)' },
    { name: '1Shot', label: '1Shot' },
    { name: '1Shotカード', label: '1Shot Card (カード)' },
    { name: '前所属', label: 'Prev Team' },
    { name: 'フォーメーション左', label: 'Formation (Left)' },
    { name: 'フォーメーション右', label: 'Formation (Right)' },
    { name: '左下ミニフォーメーション', label: 'Mini Formation (Left)' },
    { name: 'サブ下位置左', label: 'Substitutes (Left)' },
    { name: 'PK', label: 'PK (Center)' },
    { name: '左上PK', label: 'PK (Top-Left)' },
    { name: 'スタッツ', label: 'Stats (スタッツ)' },
    { name: '気象', label: 'Weather (気象)' },
    { name: '選手交代1枚', label: 'Sub (1 Player)' },
    { name: '選手交代2枚', label: 'Sub (2 Players)' }
];

export default function CGOperator() {
    const { clearOnAir, clearPreview, clearAll } = useClearAll();
    const [players, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [globalPhotoEnabled, setGlobalPhotoEnabled] = useSyncedState<boolean>('global_photo_enabled', true);
    const [oaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const [photos, setPhotos] = useState<PhotoItem[]>([]);

    useEffect(() => {
        fetchPhotoList().then(list => {
            if (list && list.length > 0) setPhotos(list);
        });
    }, []);
    
    // Active Tab in Dashboard
    const [activeTab, setActiveTab] = useState<'match' | 'pk' | 'extras'>('match');

    // Selected Player for 1Shot / 1Shotカード Operation
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    // CG Controls の最小化（デフォルト: false = 閉じた状態）
    const [isCgControlsOpen, setIsCgControlsOpen] = useState(false);

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
        const nextIdx = cgQueue.findIndex(item => !item.skipped && !item.played);
        if (nextIdx === -1) {
            alert('キューに待機中のテロップがありません。');
            return;
        }

        const item = cgQueue[nextIdx];
        
        // Hide non-essential items
        window.dispatchEvent(new Event('TRIGGER_HIDE_QUEUE_ITEMS'));
        
        setCgQueue(prev => (prev || []).map((q, i) => i === nextIdx ? { ...q, played: true } : q));

        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('TRIGGER_TAKE', { detail: item.telopName }));
        }, 200);
    };

    const selectedPlayer = (players || []).find(p => p.id === selectedPlayerId) || (players && players.length > 0 ? players[0] : null);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: '20px', minHeight: '80vh' }}>
            
            {/* LEFT COLUMN: Left Team Players */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#198754' }}>
                    <div className="flex-between" style={{ marginBottom: 10 }}>
                        <h3 style={{ color: '#198754', margin: 0 }}>{oaLeftTeam} - Starters</h3>
                        <span style={{ fontSize: '0.75rem', color: '#aaa' }}>クリックで1Shot選択</span>
                    </div>
                    <PlayerGrid 
                        players={(players || []).filter(p => (p.schoolName ? p.schoolName === oaLeftTeam : p.teamId !== 'right') && !p.isSubbed)} 
                        selectedId={selectedPlayer?.id}
                        onSelect={p => setSelectedPlayerId(p.id)}
                        photos={photos}
                    />
                </div>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#8bc34a' }}>
                    <div className="flex-between" style={{ marginBottom: 10 }}>
                        <h3 style={{ color: '#8bc34a', margin: 0 }}>{oaLeftTeam} - Subs</h3>
                        <span style={{ fontSize: '0.75rem', color: '#aaa' }}>クリックで1Shot選択</span>
                    </div>
                    <PlayerGrid 
                        players={(players || []).filter(p => (p.schoolName ? p.schoolName === oaLeftTeam : p.teamId !== 'right') && p.isSubbed)} 
                        selectedId={selectedPlayer?.id}
                        onSelect={p => setSelectedPlayerId(p.id)}
                        photos={photos}
                    />
                </div>
            </div>

            {/* CENTER COLUMN: Dashboards & CG Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Center Sub-Nav Tabs */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <button 
                        className={`btn ${activeTab === 'match' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveTab('match')}
                        style={{ padding: '8px 16px', fontWeight: 'bold' }}
                    >
                        ⚽ 試合スコア & タイマー & 1Shot
                    </button>
                    <button 
                        className={`btn ${activeTab === 'pk' ? 'btn-warning' : 'btn-secondary'}`} 
                        onClick={() => setActiveTab('pk')}
                        style={{ padding: '8px 16px', fontWeight: 'bold' }}
                    >
                        🥅 PK戦 入力 & CG
                    </button>
                    <button 
                        className={`btn ${activeTab === 'extras' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveTab('extras')}
                        style={{ padding: '8px 16px', fontWeight: 'bold' }}
                    >
                        📊 スタッツ・気象・選手交代
                    </button>
                </div>

                {/* TAB CONTENT */}
                {activeTab === 'match' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* Row 1: Score Panel & Timer Panel */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <MatchScorePanel />
                            <MatchTimerPanel />
                        </div>

                        {/* Row 2: 1Shot & 1Shotカード 専用送出パネル (後出し優先排他送出) */}
                        <OneShotPlayerControl 
                            player={selectedPlayer} 
                            allPlayers={players || []} 
                            setPlayers={setPlayers}
                            globalPhotoEnabled={globalPhotoEnabled !== false}
                            setGlobalPhotoEnabled={setGlobalPhotoEnabled}
                            photos={photos}
                        />

                        {/* CG Queue List */}
                        <div className="glass-panel" style={{ padding: '16px' }}>
                            <div className="flex-between" style={{ marginBottom: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>CG Queue List (待機キュー)</h3>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={queueMode} onChange={e => setQueueMode(e.target.checked)} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: queueMode ? 'var(--accent-warning)' : '#aaa' }}>QUEUE MODE</span>
                                    </label>
                                    <button className="btn btn-success" style={{ padding: '4px 16px', fontSize: '0.9rem', fontWeight: 'bold' }} onClick={takeNextQueue} disabled={(cgQueue || []).filter(i => !i.skipped && !i.played).length === 0}>
                                        TAKE NEXT (w/ Clear)
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                                {(cgQueue || []).length === 0 && <div style={{ color: '#aaa', padding: '8px' }}>キューは空です</div>}
                                {(cgQueue || []).map((item, idx) => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: item.played ? 'rgba(255,255,255,0.03)' : (item.skipped ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)'), padding: '6px 10px', borderRadius: '6px', whiteSpace: 'nowrap', opacity: (item.skipped || item.played) ? 0.5 : 1 }}>
                                        <span style={{ fontWeight: 'bold', color: '#ffca28' }}>#{idx + 1}</span>
                                        <span style={{ fontWeight: 'bold', textDecoration: item.played ? 'line-through' : 'none' }}>{item.label}</span>
                                        {!item.played && (
                                            <button className="btn btn-secondary" style={{ padding: '1px 5px', fontSize: '0.65rem' }} onClick={() => toggleSkipQueueItem(item.id)}>SKIP</button>
                                        )}
                                        <button className="btn btn-danger" style={{ padding: '1px 5px', fontSize: '0.65rem' }} onClick={() => deleteQueueItem(item.id)}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'pk' && (
                    <PKControl />
                )}

                {activeTab === 'extras' && (
                    <WeatherStatsSubControl />
                )}

                {/* CG Operations Buttons Grid (デフォルト最小化) */}
                <div className="glass-panel" style={{ padding: '12px 16px' }}>
                    <div 
                        className="flex-between" 
                        onClick={() => setIsCgControlsOpen(!isCgControlsOpen)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.9rem', color: '#ffca28' }}>{isCgControlsOpen ? '▼' : '▶'}</span>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#bbb' }}>
                                🛠️ CG Controls (開発・デバッグ用 全テロップ直接操作) {isCgControlsOpen ? '(クリックで折りたたむ)' : '(クリックで展開)'}
                            </h3>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                            <button className="btn btn-warning" style={{ padding: '3px 8px', fontSize: '0.7rem' }} onClick={clearPreview}>Clear Preview</button>
                            <button className="btn btn-danger" style={{ padding: '3px 8px', fontSize: '0.7rem' }} onClick={clearOnAir}>Clear On Air</button>
                            <button className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.7rem', borderColor: 'var(--accent-danger)' }} onClick={clearAll}>Clear All</button>
                        </div>
                    </div>

                    {isCgControlsOpen && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                            {ALL_TELOPS.map(t => (
                                <TelopControl key={t.name} telopName={t.name} label={t.label} queueMode={queueMode} onAddToQueue={() => addToQueue(t.name, t.label)} />
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT COLUMN: Right Team Players */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#0dcaf0' }}>
                    <div className="flex-between" style={{ marginBottom: 10 }}>
                        <h3 style={{ color: '#0dcaf0', margin: 0 }}>{oaRightTeam} - Starters</h3>
                        <span style={{ fontSize: '0.75rem', color: '#aaa' }}>クリックで1Shot選択</span>
                    </div>
                    <PlayerGrid 
                        players={(players || []).filter(p => (p.schoolName ? p.schoolName === oaRightTeam : p.teamId === 'right') && !p.isSubbed)} 
                        selectedId={selectedPlayer?.id}
                        onSelect={p => setSelectedPlayerId(p.id)}
                        photos={photos}
                    />
                </div>
                <div className="glass-panel" style={{ flex: 1, borderColor: '#0d6efd' }}>
                    <div className="flex-between" style={{ marginBottom: 10 }}>
                        <h3 style={{ color: '#0d6efd', margin: 0 }}>{oaRightTeam} - Subs</h3>
                        <span style={{ fontSize: '0.75rem', color: '#aaa' }}>クリックで1Shot選択</span>
                    </div>
                    <PlayerGrid 
                        players={(players || []).filter(p => (p.schoolName ? p.schoolName === oaRightTeam : p.teamId === 'right') && p.isSubbed)} 
                        selectedId={selectedPlayer?.id}
                        onSelect={p => setSelectedPlayerId(p.id)}
                        photos={photos}
                    />
                </div>
            </div>

        </div>
    );
}

// --------------------------------------------------------
// 1Shot & 1Shotカード Dedicated Control Panel (後出し優先排他送出)
// --------------------------------------------------------

function OneShotPlayerControl({ 
    player, 
    allPlayers, 
    setPlayers, 
    globalPhotoEnabled, 
    setGlobalPhotoEnabled,
    photos = []
}: { 
    player: Player | null, 
    allPlayers: Player[], 
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
    globalPhotoEnabled: boolean,
    setGlobalPhotoEnabled: (val: boolean) => void,
    photos?: PhotoItem[]
}) {
    const oneShot = useTelop('1Shot');
    const oneShotCard = useTelop('1Shotカード');
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const [oaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');

    // 選手ごとの登録コメント配列を取得
    const comments = (player?.pro2List && player.pro2List.length > 0)
        ? player.pro2List.filter(c => c.text && c.text.trim() !== '')
        : (player?.pro2Comment ? [{ text: player.pro2Comment, isYellow: false }] : []);

    // 選択中のプロ2コメント番号（0〜4）
    const [selectedCommentIdx, setSelectedCommentIdx] = useState<number>(0);
    
    // 【ユーザー要件】黄色フラグ: ONならプロ2にあるコメント全部が黄色に変化
    // ONの場合: プロ2コメント黄色が表示、プロ2コメントが非表示
    // OFFの場合: プロ2コメントが表示、プロ2コメント黄色が非表示
    const [isYellowFlag, setIsYellowFlag] = useState<boolean>(false);

    // 【最重要要件】選手が変わったら、プロ２コメントが表示、プロ２コメント黄色が非表示のデフォルトに戻す！
    useEffect(() => {
        setSelectedCommentIdx(0);
        setIsYellowFlag(false); // 選手交代時は白（通常）表示、黄色非表示のデフォルトに戻す
    }, [player?.id]);

    if (!player) {
        return (
            <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', color: '#aaa' }}>
                左右のプレイヤー一覧から選手を選択すると、1Shot / 1Shotカードの送出操作が行えます。
            </div>
        );
    }

    // チーム設定（Team Settings）からチームカラーと１SHOT表記を取得
    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;
    const rawSchool = player.schoolName || (player.teamId === 'right' ? oaRightTeam : oaLeftTeam);
    const teamConfig = teams.find(t => t.name === rawSchool) ||
                       teams.find(t => player.teamId === 'right' ? t.name === oaRightTeam : t.name === oaLeftTeam);
    
    const teamColor = teamConfig?.color || (player.teamId === 'right' ? '#0dcaf0' : '#198754');
    // ４）１SHOTの上段部分のチーム名表記
    const oneShotSchoolName = teamConfig?.oneShotName || rawSchool;

    // 顔写真の自動照合・解決（未設定の場合、Photoフォルダから選手番号や氏名で自動検出）
    const matchedPhoto = (!player.photoUrl && photos && photos.length > 0)
        ? matchPlayerPhoto(player, photos, oneShotSchoolName)
        : null;
    const rawPhoto = player.photoUrl || (matchedPhoto ? `/Photo/${matchedPhoto.school}/${matchedPhoto.filename}` : '');
    const effectivePhotoUrl = normalizePhotoUrl(rawPhoto, rawSchool, photos);

    // 自動照合で写真が見つかった場合、選手の photoUrl を /Photo/高校名/顔写真.png 形式で自動同期保存
    useEffect(() => {
        if (player && !player.photoUrl && effectivePhotoUrl) {
            setPlayers(prev => (prev || []).map(p => {
                if (p.id === player.id) {
                    return { ...p, photoUrl: effectivePhotoUrl };
                }
                return p;
            }));
        }
    }, [player?.id, effectivePhotoUrl]);

    const isPhotoActive = globalPhotoEnabled && (player.photoEnabled !== false) && !!effectivePhotoUrl;

    // 現在選択されているプロ2コメント
    const currentComment = comments[selectedCommentIdx] || { text: player.pro2Comment || '', isYellow: false };
    const commentText = currentComment.text || '';

    // ゴール数連動更新
    const handleTodayGoalsUpdate = (newTodayStr: string) => {
        const cleanToday = toHalfWidthNum(newTodayStr);
        const todayNum = parseInt(cleanToday || '0', 10) || 0;
        const baseNum = parseInt(player.baseTotalGoals || '0', 10) || 0;
        const newTotal = String(baseNum + todayNum);

        setPlayers(prev => (prev || []).map(p => {
            if (p.id === player.id) {
                return { ...p, todayGoals: cleanToday, totalGoals: newTotal };
            }
            return p;
        }));
    };

    const toggleIndividualPhoto = () => {
        setPlayers(prev => (prev || []).map(p => {
            if (p.id === player.id) {
                return { ...p, photoEnabled: !(p.photoEnabled !== false) };
            }
            return p;
        }));
    };

    // 共通ペイロード生成（黄色フラグONでプロ2コメント黄色が表示・プロ2コメント非表示、OFFでプロ2コメント表示・黄色非表示）
    const buildBasePayload = (mode: 'pro2' | 'today' | 'total') => {
        const isYellow = isYellowFlag;
        const yellowComment = (mode === 'pro2' && isYellow) ? commentText : '';
        const whiteComment = (mode === 'pro2' && !isYellow) ? commentText : '';

        return {
            'TeamColor': teamColor,
            '背番号': player.number || '',
            '氏名': player.name || '',
            'ポジション': player.position || 'FW',
            '所属': oneShotSchoolName, // １SHOT上段のチーム名表記
            '学年': (player.grade || '').replace('年', ''),
            '身長': player.height || '',
            '体重': player.weight || '',
            // 黄色フラグONなら「プロ2コメント黄色」を使い、「プロ2コメント」は空文字(非表示)
            // 黄色フラグOFFなら「プロ2コメント」を使い、「プロ2コメント黄色」は空文字(非表示)
            'プロ2コメント': whiteComment,
            'プロ２コメント': whiteComment,
            'プロ2コメント黄色': yellowComment,
            'プロ２コメント黄色': yellowComment,
            'isYellow': isYellow,
            'pro2IsYellow': isYellow,
            'useYellowText': isYellow,
            'yellowFlag': isYellow,
            '黄色フラグ': isYellow,
            'Today\'s数値': player.todayGoals || '0',
            'Total数値': player.totalGoals || '0',
            '顔写真': isPhotoActive ? effectivePhotoUrl : '',
            '顔写真_visible': isPhotoActive,
            'showPhoto': isPhotoActive,
            'mode': mode
        };
    };

    // 1Shot 送出 (後出し優先: 1Shotカードが出ている場合は即座に非表示！)
    const handleSend1Shot = (mode: 'pro2' | 'today' | 'total') => {
        oneShotCard.hide(); // 先に出ていた1Shotカードを消去
        const payload = buildBasePayload(mode);
        oneShot.setData(payload);
        oneShot.show(payload);
    };

    // 1Shotカード 送出 (後出し優先: 1Shotが出ている場合は即座に非表示！)
    const handleSend1ShotCard = (cardType: 'yellow1' | 'yellow2' | 'red') => {
        oneShot.hide(); // 先に出ていた1Shotを消去
        const cardImgMap = {
            'yellow1': 'img/Yellow1_15.png',
            'yellow2': 'img/Yellow2_15.png',
            'red': 'img/Red_15.png'
        };
        const payload = {
            ...buildBasePayload('pro2'),
            'カード': cardImgMap[cardType],
            'cardType': cardType
        };
        oneShotCard.setData(payload);
        oneShotCard.show(payload);
    };

    return (
        <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(255, 202, 40, 0.3)', background: 'rgba(255, 202, 40, 0.03)' }}>
            <div className="flex-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${teamColor}` }}>
                        {effectivePhotoUrl ? (
                            <img src={encodeURI(effectivePhotoUrl)} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e: any) => { e.target.style.opacity = '0.3'; }} />
                        ) : (
                            <span style={{ fontSize: '1.4rem' }}>👤</span>
                        )}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>#{player.number} {player.name}</span>
                            <span className="status-badge" style={{ padding: '2px 6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)' }}>{player.position}</span>
                            <span style={{ fontSize: '0.85rem', color: '#ffca28', fontWeight: 'bold' }}>{oneShotSchoolName} ({player.grade || '-'})</span>
                        </div>
                    </div>
                </div>

                {/* Photo Toggles */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button 
                        className={`btn ${player.photoEnabled !== false ? 'btn-success' : 'btn-secondary'}`}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={toggleIndividualPhoto}
                    >
                        選手写真: {player.photoEnabled !== false ? 'ON' : 'OFF'}
                    </button>
                    <button 
                        className={`btn ${globalPhotoEnabled ? 'btn-primary' : 'btn-danger'}`}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setGlobalPhotoEnabled(!globalPhotoEnabled)}
                    >
                        一括写真: {globalPhotoEnabled ? 'ON' : 'OFF'}
                    </button>
                    {effectivePhotoUrl ? (
                        <span style={{ fontSize: '0.75rem', color: isPhotoActive ? '#4caf50' : '#888', fontWeight: 'bold' }}>
                            {isPhotoActive ? '📷 顔写真流し込み中' : '📷 顔写真OFF'}
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.75rem', color: '#ff9800' }}>
                            ※顔写真未検出
                        </span>
                    )}
                </div>
            </div>

            {/* プロ2コメント選択 & 黄色フラグON/OFF切替UI */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex-between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#ffca28' }}>
                            💬 プロ2コメント選択
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
                            ({comments.length > 0 ? `${selectedCommentIdx + 1} / ${comments.length}件` : '未登録'})
                        </span>
                    </div>

                    {/* 【重要要件】黄色フラグON/OFFトグル */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#bbb' }}>黄色フラグ:</span>
                        <button 
                            type="button"
                            className={`btn ${!isYellowFlag ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: !isYellowFlag ? 'bold' : 'normal' }}
                            onClick={() => setIsYellowFlag(false)}
                        >
                            ⚪ OFF (白表示 / 黄非表示)
                        </button>
                        <button 
                            type="button"
                            className={`btn ${isYellowFlag ? 'btn-warning' : 'btn-secondary'}`}
                            style={{ 
                                padding: '3px 8px', 
                                fontSize: '0.72rem', 
                                fontWeight: isYellowFlag ? 'bold' : 'normal',
                                color: isYellowFlag ? '#000' : '#ffca28',
                                border: isYellowFlag ? '2px solid #ffca28' : '1px solid rgba(255,255,255,0.2)'
                            }}
                            onClick={() => setIsYellowFlag(true)}
                        >
                            🟨 ON (黄表示 / 白非表示)
                        </button>
                    </div>
                </div>

                {/* 複数コメント選択ボタン群 (選択しても黄色フラグの状態が維持され全コメントに適用される) */}
                {comments.length > 0 ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {comments.map((c, idx) => {
                            const isSelected = idx === selectedCommentIdx;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`btn ${isSelected ? (isYellowFlag ? 'btn-warning' : 'btn-primary') : 'btn-secondary'}`}
                                    style={{ 
                                        padding: '4px 10px', 
                                        fontSize: '0.78rem', 
                                        fontWeight: isSelected ? 'bold' : 'normal',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 4,
                                        borderColor: isSelected ? '#ffca28' : 'rgba(255,255,255,0.15)',
                                        color: isSelected && isYellowFlag ? '#000' : 'inherit'
                                    }}
                                    onClick={() => setSelectedCommentIdx(idx)}
                                >
                                    <span>#{idx + 1}</span>
                                    {isYellowFlag && <span>🟨</span>}
                                    <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {c.text}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        ※選手にプロ2コメントが登録されていません。（Player Registryで登録可能）
                    </div>
                )}

                {/* プレビュー表示 */}
                {commentText && (
                    <div style={{ marginTop: 8, padding: '6px 10px', background: isYellowFlag ? 'rgba(255,241,0,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: 4, fontSize: '0.82rem', color: isYellowFlag ? '#fff100' : '#ffffff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6, borderLeft: `3px solid ${isYellowFlag ? '#fff100' : '#ffffff'}` }}>
                        <span>送出プレビュー:</span>
                        <span>{isYellowFlag ? '🟨 [プロ2コメント黄色 表示 / 白 非表示]' : '⚪ [プロ2コメント(白) 表示 / 黄色 非表示]'}</span>
                        <span style={{ marginLeft: 6, color: '#fff' }}>"{commentText}"</span>
                    </div>
                )}
            </div>

            {/* Goals & Yellow Cards Quick Editor */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.8rem', color: '#ffca28', fontWeight: 'bold' }}>Today'sゴール:</span>
                    <input 
                        type="number" 
                        min="0"
                        className="form-input" 
                        style={{ width: '50px', textAlign: 'center', padding: '2px', fontWeight: 'bold', color: '#ffca28' }} 
                        value={player.todayGoals || '0'} 
                        onChange={e => handleTodayGoalsUpdate(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.8rem', color: '#4caf50', fontWeight: 'bold' }}>今大会通算(Total):</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4caf50', minWidth: 24, textAlign: 'center' }}>
                        {player.totalGoals || '0'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>(自動連動)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                    <span style={{ fontSize: '0.8rem', color: '#ffeb3b' }}>累積イエロー:</span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ffeb3b' }}>{player.yellowCards || '0'}</span>
                </div>
            </div>

            {/* 送出ボタン群 (後出し優先) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                {/* 1Shot Buttons */}
                <button 
                    className="btn btn-primary" 
                    style={{ padding: '8px 4px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                    onClick={() => handleSend1Shot('pro2')}
                >
                    <span>🎴 1Shot</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>(プロ2表示)</span>
                </button>
                <button 
                    className="btn btn-warning" 
                    style={{ padding: '8px 4px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                    onClick={() => handleSend1Shot('today')}
                >
                    <span>⚽ Today'sゴール</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({player.todayGoals || '0'}G)</span>
                </button>
                <button 
                    className="btn btn-success" 
                    style={{ padding: '8px 4px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                    onClick={() => handleSend1Shot('total')}
                >
                    <span>🏆 Totalゴール</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({player.totalGoals || '0'}G)</span>
                </button>

                {/* 1Shotカード Buttons */}
                <button 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 4px', fontSize: '0.85rem', fontWeight: 'bold', borderColor: '#ffeb3b', color: '#ffeb3b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                    onClick={() => handleSend1ShotCard('yellow1')}
                >
                    <span>🟨 イエロー 1枚</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>カード送出</span>
                </button>
                <button 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 4px', fontSize: '0.85rem', fontWeight: 'bold', borderColor: '#ff9800', color: '#ff9800', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                    onClick={() => handleSend1ShotCard('yellow2')}
                    title="2枚表示後、スライドアウトしてレッドカードがスライドイン！"
                >
                    <span>🟨🟨 イエロー 2枚</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>退場アニメ付き</span>
                </button>
                <button 
                    className="btn btn-danger" 
                    style={{ padding: '8px 4px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                    onClick={() => handleSend1ShotCard('red')}
                >
                    <span>🟥 レッドカード</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>一発退場</span>
                </button>

                {/* HIDE Buttons */}
                <button 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 4px', fontSize: '0.8rem' }}
                    onClick={() => { oneShot.hide(); oneShotCard.hide(); }}
                >
                    ⏹️ 1Shot全消去
                </button>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// Player Grid Subcomponent
// --------------------------------------------------------

function PlayerGrid({ 
    players, 
    selectedId, 
    onSelect,
    photos = []
}: { 
    players: Player[], 
    selectedId?: string, 
    onSelect: (p: Player) => void,
    photos?: PhotoItem[]
}) {
    return (
        <div style={{ overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' }}>
            <table className="modern-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Pos</th>
                        <th title="Todays / 通算">G(T/通)</th>
                        <th title="累積イエロー">Yel</th>
                        <th>写真</th>
                    </tr>
                </thead>
                <tbody>
                    {players.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', opacity: 0.5 }}>選手なし</td></tr>}
                    {players.sort((a,b) => parseInt(a.number) - parseInt(b.number)).map(p => {
                        const isSelected = p.id === selectedId;
                        const hasPhoto = !!p.photoUrl || (photos.length > 0 && !!matchPlayerPhoto(p, photos));
                        return (
                            <tr 
                                key={p.id} 
                                onClick={() => onSelect(p)}
                                style={{ 
                                    cursor: 'pointer', 
                                    background: isSelected ? 'rgba(255, 202, 40, 0.2)' : 'transparent',
                                    borderLeft: isSelected ? '3px solid #ffca28' : '3px solid transparent'
                                }}
                            >
                                <td style={{ fontWeight: 'bold' }}>{p.number}</td>
                                <td style={{ whiteSpace: 'nowrap', fontWeight: isSelected ? 'bold' : 'normal' }}>{p.name}</td>
                                <td>{p.position}</td>
                                <td>
                                    <span style={{ color: '#ffca28', fontWeight: 'bold' }}>{p.todayGoals || '0'}</span>
                                    {'/'}
                                    <span style={{ color: '#4caf50' }}>{p.totalGoals || '0'}</span>
                                </td>
                                <td>{p.yellowCards || '0'}</td>
                                <td title={hasPhoto ? '写真あり' : '写真未登録'}>{hasPhoto ? '📷' : '—'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// --------------------------------------------------------
// Telop Control Button Subcomponent
// --------------------------------------------------------

function TelopControl({ telopName, label, queueMode, onAddToQueue }: { telopName: string, label: string, queueMode: boolean, onAddToQueue: () => void }) {
    const { show, hide, update, isVisible } = useTelop(telopName);
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        const handleTake = (e: any) => {
            if (e.detail === telopName) {
                show();
            }
        };
        const handleHideAll = () => {
            // タイマー、1Shot、1Shotカード、アディショナルタイム、小得点、大得点は消さないよう完全保護！
            const protectedTelops = ['大得点', '小得点', 'タイマー', 'アディショナルタイム', '1Shot', '1Shotカード'];
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
        <div className="glass-panel" style={{ padding: '8px', borderLeft: isVisible ? '4px solid var(--accent-success)' : '4px solid transparent' }}>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
                <h4 style={{ fontSize: '0.8rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</h4>
                {isVisible && <span className="status-badge status-connected" style={{ padding: '1px 4px', fontSize: '0.55rem' }}>ON AIR</span>}
            </div>
            
            <div style={{ display: 'flex', gap: 4 }}>
                {queueMode ? (
                    <button className="btn btn-warning" style={{ flex: 1, padding: '4px', fontSize: '0.75rem' }} onClick={onAddToQueue}>Q-ADD</button>
                ) : (
                    <button className="btn btn-success" style={{ flex: 1, padding: '4px', fontSize: '0.75rem' }} onClick={() => {
                        window.dispatchEvent(new Event('TRIGGER_HIDE_QUEUE_ITEMS'));
                        setTimeout(() => show(), 100);
                    }}>TAKE</button>
                )}
                <button className="btn btn-danger" style={{ flex: 1, padding: '4px', fontSize: '0.75rem' }} onClick={hide}>HIDE</button>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                {showUpdate ? (
                    <>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '2px', fontSize: '0.7rem' }} onClick={() => update()}>UPDATE</button>
                        <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={() => setShowUpdate(false)}>-</button>
                    </>
                ) : (
                    <button className="btn btn-secondary" style={{ width: '100%', padding: '2px', fontSize: '0.65rem' }} onClick={() => setShowUpdate(true)}>+ Update</button>
                )}
            </div>
        </div>
    );
}

// --------------------------------------------------------
// Match Score Panel (独立TAKE/HIDE・タイマーと1SHOTを消さない)
// --------------------------------------------------------

function MatchScorePanel() {
    const { syncedStateRef } = useTelopHub();
    const bigScore = useTelop('大得点');
    const smallScore = useTelop('小得点');
    const timer = useTelop('タイマー');
    const [timerState] = useSyncedState<TimerState>('match_timer_state', {
        isRunning: false,
        lastTick: Date.now(),
        accumulatedMs: 0
    });
    const [timerPeriod] = useSyncedState<string>('match_timer_period', '前半');
    const [oaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);

    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;
    const leftConfig = teams.find(t => t.name === oaLeftTeam);
    const rightConfig = teams.find(t => t.name === oaRightTeam);

    const defaultLeftSmallName = leftConfig?.smallScoreName || oaLeftTeam;
    const defaultRightSmallName = rightConfig?.smallScoreName || oaRightTeam;
    const defaultLeftBigName = leftConfig?.bigScoreName || oaLeftTeam;
    const defaultRightBigName = rightConfig?.bigScoreName || oaRightTeam;
    const defaultLeftColor = leftConfig?.color || '#198754';
    const defaultRightColor = rightConfig?.color || '#0dcaf0';

    const [statsData, setStatsData] = useSyncedState<StatsData>('match_stats_data', {
        leftShoot: '0', rightShoot: '0',
        leftFK: '0', rightFK: '0',
        leftCK: '0', rightCK: '0',
        leftYellow: '0', rightYellow: '0',
        leftRed: '0', rightRed: '0'
    });

    const syncScores = (data: any) => {
        const expandedData = { ...data };
        
        if (data.LeftTeamColor) {
            expandedData.LeftTeamColorLargePoint = data.LeftTeamColor;
            expandedData.LeftTeamColorSmallPoint = data.LeftTeamColor;
        }
        if (data.RigtTeamColor) {
            expandedData.RightTeamColorLargePoint = data.RigtTeamColor;
            expandedData.RightTeamColorSmallPoint = data.RigtTeamColor;
        }
        
        bigScore.setData((prev: any) => ({ ...prev, ...expandedData }));
        smallScore.setData((prev: any) => ({ ...prev, ...expandedData }));
    };

    const updateScores = () => {
        bigScore.update();
        smallScore.update();
    };

    // 🔄 サイドチェンジ（スコア・チーム名・カラーおよびスタッツのスワップ反転）
    const handleScoreSideChange = () => {
        const cur = smallScore.data || {};
        const curBig = bigScore.data || {};

        const swapped = {
            '左チーム名': cur['右チーム名'] || curBig['右チーム名'] || defaultRightSmallName,
            '右チーム名': cur['左チーム名'] || curBig['左チーム名'] || defaultLeftSmallName,
            '左チーム得点': cur['右チーム得点'] || curBig['右チーム得点'] || '0',
            '右チーム得点': cur['左チーム得点'] || curBig['左チーム得点'] || '0',
            'LeftTeamColor': cur['RigtTeamColor'] || defaultRightColor,
            'RigtTeamColor': cur['LeftTeamColor'] || defaultLeftColor,
            'LeftTeamColorLargePoint': cur['RigtTeamColor'] || defaultRightColor,
            'RightTeamColorLargePoint': cur['LeftTeamColor'] || defaultLeftColor,
            'LeftTeamColorSmallPoint': cur['RigtTeamColor'] || defaultRightColor,
            'RightTeamColorSmallPoint': cur['LeftTeamColor'] || defaultLeftColor
        };

        syncScores(swapped);

        setStatsData(prev => {
            const c = prev || {
                leftShoot: '0', rightShoot: '0',
                leftFK: '0', rightFK: '0',
                leftCK: '0', rightCK: '0',
                leftYellow: '0', rightYellow: '0',
                leftRed: '0', rightRed: '0'
            };
            return {
                leftShoot: c.rightShoot,
                rightShoot: c.leftShoot,
                leftFK: c.rightFK,
                rightFK: c.leftFK,
                leftCK: c.rightCK,
                rightCK: c.leftCK,
                leftYellow: c.rightYellow,
                rightYellow: c.leftYellow,
                leftRed: c.rightRed,
                rightRed: c.leftRed
            };
        });
    };

    // 【重要要件】小得点をTAKEする場合は、小得点表記・カラーをセットし、タイマーもONにする
    const handleTakeSmallScore = () => {
        const cur = smallScore.data || {};
        const payload = {
            '左チーム名': cur['左チーム名'] || defaultLeftSmallName,
            '右チーム名': cur['右チーム名'] || defaultRightSmallName,
            '左チーム得点': cur['左チーム得点'] || '0',
            '右チーム得点': cur['右チーム得点'] || '0',
            'LeftTeamColor': cur['LeftTeamColor'] || defaultLeftColor,
            'RigtTeamColor': cur['RigtTeamColor'] || defaultRightColor,
            'LeftTeamColorSmallPoint': cur['LeftTeamColor'] || defaultLeftColor,
            'RightTeamColorSmallPoint': cur['RigtTeamColor'] || defaultRightColor
        };
        smallScore.setData((prev: any) => ({ ...prev, ...payload }));
        smallScore.show(payload);

        // タイマーが未表示の場合のみタイマーをON(show)にする
        // すでに表示中（ON AIR中）ならタイマーはそのまま進み続けるため、再showしてリセットさせない！
        if (!timer.isVisible) {
            const latestTimerState: TimerState = syncedStateRef.current?.match_timer_state || timerState;
            let currentMs = latestTimerState?.accumulatedMs || 0;
            if (latestTimerState?.isRunning) {
                currentMs += (Date.now() - (latestTimerState.lastTick || Date.now()));
            }
            currentMs = Math.max(0, currentMs);
            timer.show(buildTimerPayload(currentMs, timerPeriod || '前半'));
        }
    };

    // 小得点をOFFする際、タイマーも非表示にする
    const handleHideSmallScore = () => {
        smallScore.hide();
        timer.hide();
    };

    // 大得点 TAKE (大得点のチーム名表記を適用)
    const handleTakeBigScore = () => {
        const cur = bigScore.data || {};
        const payload = {
            '左チーム名': cur['左チーム名'] || defaultLeftBigName,
            '右チーム名': cur['右チーム名'] || defaultRightBigName,
            '左チーム得点': cur['左チーム得点'] || '0',
            '右チーム得点': cur['右チーム得点'] || '0',
            'LeftTeamColor': cur['LeftTeamColor'] || defaultLeftColor,
            'RigtTeamColor': cur['RigtTeamColor'] || defaultRightColor,
            'LeftTeamColorLargePoint': cur['LeftTeamColor'] || defaultLeftColor,
            'RightTeamColorLargePoint': cur['RigtTeamColor'] || defaultRightColor
        };
        bigScore.setData((prev: any) => ({ ...prev, ...payload }));
        bigScore.show(payload);
    };

    // 大得点 HIDE
    const handleHideBigScore = () => {
        bigScore.hide();
    };

    const bsData = bigScore.data || {};

    const renderTeamScore = (teamNameKey: string, colorKey: string, scoreKey: string, defaultColor: string, defaultName: string) => {
        return (
            <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="チーム名表記" 
                    value={bsData[teamNameKey] !== undefined ? bsData[teamNameKey] : defaultName} 
                    onChange={e => syncScores({ [teamNameKey]: e.target.value })} 
                    style={{ marginBottom: '6px', padding: '6px 10px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }} 
                />
                <input 
                    type="color" 
                    className="form-input" 
                    value={bsData[colorKey] || defaultColor} 
                    onChange={e => syncScores({ [colorKey]: e.target.value })} 
                    style={{ height: '22px', padding: 0, width: '100%', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '12px' }} 
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" style={{ width: '32px', height: '32px', borderRadius: '6px', fontSize: '1.1rem', padding: 0 }} onClick={() => syncScores({ [scoreKey]: String(Math.max(0, parseInt(bsData[scoreKey] || '0') - 1)) })}>-</button>
                    <input 
                        type="text" 
                        className="form-input" 
                        style={{ width: '60px', height: '48px', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }} 
                        value={bsData[scoreKey] || '0'} 
                        onChange={e => syncScores({ [scoreKey]: e.target.value })} 
                    />
                    <button className="btn btn-secondary" style={{ width: '32px', height: '32px', borderRadius: '6px', fontSize: '1.1rem', padding: 0 }} onClick={() => syncScores({ [scoreKey]: String(parseInt(bsData[scoreKey] || '0') + 1) })}>+</button>
                </div>
            </div>
        );
    };

    return (
        <div className="glass-panel" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Match Score (スコア)</h3>
                    {smallScore.isVisible && <span className="status-badge status-connected" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>小得点 ON AIR</span>}
                    {bigScore.isVisible && <span className="status-badge status-connected" style={{ padding: '2px 6px', fontSize: '0.65rem', background: '#ff9800' }}>大得点 ON AIR</span>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-warning" style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold' }} onClick={handleScoreSideChange}>
                        🔄 サイド反転
                    </button>
                    <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={updateScores}>
                        Update
                    </button>
                    {/* 小得点 TAKE/HIDE */}
                    <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold' }} onClick={handleTakeSmallScore}>
                        小得点 TAKE
                    </button>
                    <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={handleHideSmallScore}>
                        小得点 HIDE
                    </button>
                    {/* 大得点 TAKE/HIDE */}
                    <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold', background: '#e65100', borderColor: '#ff9800' }} onClick={handleTakeBigScore}>
                        大得点 TAKE
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: '#e65100' }} onClick={handleHideBigScore}>
                        大得点 HIDE
                    </button>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
                {renderTeamScore('左チーム名', 'LeftTeamColor', '左チーム得点', defaultLeftColor, defaultLeftSmallName)}
                {renderTeamScore('右チーム名', 'RigtTeamColor', '右チーム得点', defaultRightColor, defaultRightSmallName)}
            </div>
        </div>
    );
}

// --------------------------------------------------------
// Match Timer Panel (0:00 - 100:00 & LossSlide 1-9 AT & UpdateLIVE)
// --------------------------------------------------------

function MatchTimerPanel() {
    const timer = useTelop('タイマー');
    const additionalTime = useTelop('アディショナルタイム');
    
    const [timerState, setTimerState] = useSyncedState<TimerState>('match_timer_state', {
        isRunning: false,
        lastTick: Date.now(),
        accumulatedMs: 0
    });

    // 前後半の選択ステート (GlobalTimerManagerと完全連動！)
    const [timerPeriod, setTimerPeriod] = useSyncedState<string>('match_timer_period', '前半');

    const [presetVal, setPresetVal] = useState("0");
    const [displayMs, setDisplayMs] = useState(0);
    const [showAdjustments, setShowAdjustments] = useState(false);

    // Selected Additional Time number (1 to 9)
    const [selectedLossTime, setSelectedLossTime] = useState<string>("3");

    useEffect(() => {
        const interval = setInterval(() => {
            if (!timerState) return;
            let currentMs = timerState.accumulatedMs || 0;
            if (timerState.isRunning) {
                currentMs += (Date.now() - (timerState.lastTick || Date.now()));
            }
            setDisplayMs(Math.max(0, currentMs));
        }, 250); // 200ms〜500msの範囲内(250ms)でGUI表示更新
        return () => clearInterval(interval);
    }, [timerState]);

    const isRunning = timerState?.isRunning || false;

    // displayMs からリアルタイム時刻文字列（例: 0:00, 45:12, 100:00）を生成
    const totalSec = Math.floor(displayMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const liveTimeString = `${m}:${s < 10 ? '0' : ''}${s}`;

    // 前後半セレクト変更時 (ON AIR中なら即時 UpdateLIVE 送信！)
    const handlePeriodChange = (newPeriod: string) => {
        setTimerPeriod(newPeriod);
        if (timer.isVisible) {
            timer.update(buildTimerPayload(displayMs, newPeriod));
        }
    };

    // タイマースタート／ストップ
    const toggleTimer = () => {
        setTimerState(prev => {
            const safePrev = prev || { isRunning: false, lastTick: Date.now(), accumulatedMs: 0 };
            if (safePrev.isRunning) {
                const newAccumulated = safePrev.accumulatedMs + (Date.now() - (safePrev.lastTick || Date.now()));
                if (timer.isVisible) {
                    timer.update(buildTimerPayload(newAccumulated, timerPeriod || '前半'));
                }
                return { ...safePrev, isRunning: false, accumulatedMs: newAccumulated };
            } else {
                // スタート時: 自動的にタイマーを送出画面に出す！
                const payload = buildTimerPayload(safePrev.accumulatedMs, timerPeriod || '前半');
                if (!timer.isVisible) {
                    timer.show(payload);
                } else {
                    timer.update(payload);
                }
                return { ...safePrev, isRunning: true, lastTick: Date.now() };
            }
        });
    };

    const adjustTime = (ms: number) => {
        setTimerState(prev => {
            const safePrev = prev || { isRunning: false, lastTick: Date.now(), accumulatedMs: 0 };
            const newAccumulated = Math.max(0, safePrev.accumulatedMs + ms);
            if (timer.isVisible) {
                timer.update(buildTimerPayload(newAccumulated, timerPeriod || '前半'));
            }
            return {
                ...safePrev,
                accumulatedMs: newAccumulated
            };
        });
    };

    const applyPreset = () => {
        const presetMs = parseInt(presetVal, 10);
        setTimerState({
            isRunning: false,
            lastTick: Date.now(),
            accumulatedMs: presetMs
        });
        if (timer.isVisible) {
            timer.update(buildTimerPayload(presetMs, timerPeriod || '前半'));
        }
    };

    // アディショナルタイム送出 (LossSlide_1～9.png を切り替えて送出)
    const handleSendAdditionalTime = (numStr?: string) => {
        const targetNum = numStr || selectedLossTime || "3";
        const payload = {
            'アディショナルタイム': targetNum,
            'lossTime': targetNum,
            'アディショナル表示': `img/LossSlide_${targetNum}.png`
        };
        additionalTime.setData(payload);
        additionalTime.show(payload);
    };

    return (
        <div className="glass-panel" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Match Timer (タイマー & AT)</h3>
                    {timer.isVisible && <span className="status-badge status-connected" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>ON AIR</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`} onClick={toggleTimer} style={{ padding: '4px 12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {isRunning ? '⏹️ STOP' : '▶️ START'}
                    </button>
                    <button className="btn btn-primary" onClick={() => timer.update(buildTimerPayload(displayMs, timerPeriod || '前半'))} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                        Update
                    </button>
                    {!timer.isVisible ? (
                        <button className="btn btn-success" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => timer.show(buildTimerPayload(displayMs, timerPeriod || '前半'))}>
                            TAKE
                        </button>
                    ) : (
                        <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={timer.hide}>
                            HIDE
                        </button>
                    )}
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <select 
                        className="form-select" 
                        value={timerPeriod || '前半'} 
                        onChange={e => handlePeriodChange(e.target.value)} 
                        style={{ padding: '4px 6px', fontSize: '0.85rem' }}
                    >
                        <option value="前半">前半 (1st)</option>
                        <option value="後半">後半 (2nd)</option>
                        <option value="延長前半">延前 (Ex1)</option>
                        <option value="延長後半">延後 (Ex2)</option>
                    </select>
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                    <input 
                        type="text" 
                        className="form-input" 
                        value={liveTimeString} 
                        readOnly 
                        style={{ fontSize: '1.6rem', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', padding: '0px', color: '#ffca28' }} 
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                <button className="btn btn-secondary" style={{ fontSize: '0.65rem', padding: '1px 6px' }} onClick={() => setShowAdjustments(!showAdjustments)}>
                    {showAdjustments ? '調整パネルを閉じる ▲' : 'プリセット・微調整 ▼'}
                </button>
            </div>

            {showAdjustments && (
                <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: 8, borderRadius: 6, marginBottom: 10, border: '1px solid rgba(255, 193, 7, 0.3)' }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                        <select className="form-select" value={presetVal} onChange={e => setPresetVal(e.target.value)} style={{ flex: 1, padding: '2px 4px', fontSize: '0.8rem' }}>
                            <option value="0">0:00 (キックオフ)</option>
                            <option value="2400000">40:00</option>
                            <option value="2700000">45:00 (後半スタート)</option>
                            <option value="5400000">90:00 (延長戦)</option>
                            <option value="6000000">100:00 (3桁テスト)</option>
                        </select>
                        <button className="btn btn-warning" onClick={applyPreset} style={{ padding: '2px 8px', fontSize: '0.8rem' }}>Set</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '1px', fontSize: '0.75rem' }} onClick={() => adjustTime(-60000)}>-1m</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '1px', fontSize: '0.75rem' }} onClick={() => adjustTime(-1000)}>-1s</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '1px', fontSize: '0.75rem' }} onClick={() => adjustTime(1000)}>+1s</button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '1px', fontSize: '0.75rem' }} onClick={() => adjustTime(60000)}>+1m</button>
                    </div>
                </div>
            )}

            <div style={{ height: 1, background: 'var(--border-color)', margin: '10px 0' }}></div>
            
            {/* アディショナルタイム送出 (LossSlide_1～9.png) */}
            <div>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f44336' }}>
                        ⏱️ アディショナルタイム (LossSlide_1~9)
                    </span>
                    {additionalTime.isVisible && <span className="status-badge status-connected" style={{ padding: '1px 4px', fontSize: '0.6rem' }}>ON AIR</span>}
                </div>

                <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => (
                        <button
                            key={n}
                            className={`btn ${selectedLossTime === n ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '4px 0', fontSize: '0.8rem', fontWeight: 'bold' }}
                            onClick={() => setSelectedLossTime(n)}
                        >
                            +{n}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                    <button 
                        className="btn btn-danger" 
                        style={{ flex: 1, padding: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}
                        onClick={() => handleSendAdditionalTime()}
                    >
                        TAKE AT (+{selectedLossTime}分)
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        onClick={additionalTime.hide}
                    >
                        HIDE
                    </button>
                </div>
            </div>

        </div>
    );
}
