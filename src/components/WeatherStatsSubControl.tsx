import React, { useState } from 'react';
import { useTelop, useSyncedState } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from './TeamSettings';
import { useCgQueueRegister } from '../utils/cgQueue';
import { TEAM_LINEUPS_KEY, TeamLineup, hasRegistered, registeredStarters, registeredSubs, formatGrade, subChangeBaseImage } from '../utils/lineup';

export type StatsData = {
    leftShoot: string;
    rightShoot: string;
    leftFK: string;
    rightFK: string;
    leftCK: string;
    rightCK: string;
    leftYellow: string;
    rightYellow: string;
    leftRed: string;
    rightRed: string;
};

export default function WeatherStatsSubControl() {
    const statsTelop = useTelop('スタッツ');
    const smallScoreTelop = useTelop('小得点');
    const bigScoreTelop = useTelop('大得点');

    // Stats State (シュート、FK、CK、イエロー、レッド)
    const [statsData, setStatsData] = useSyncedState<StatsData>('match_stats_data', {
        leftShoot: '0',
        rightShoot: '0',
        leftFK: '0',
        rightFK: '0',
        leftCK: '0',
        rightCK: '0',
        leftYellow: '0',
        rightYellow: '0',
        leftRed: '0',
        rightRed: '0'
    });

    // 小得点とリンクしているチーム名・得点
    const leftTeamName = smallScoreTelop.data['左チーム名'] || bigScoreTelop.data['左チーム名'] || '北海';
    const rightTeamName = smallScoreTelop.data['右チーム名'] || bigScoreTelop.data['右チーム名'] || '帯広北';
    const leftScore = smallScoreTelop.data['左チーム得点'] || bigScoreTelop.data['左チーム得点'] || '0';
    const rightScore = smallScoreTelop.data['右チーム得点'] || bigScoreTelop.data['右チーム得点'] || '0';

    // サイドチェンジ（Left ⇄ Right の全項目スワップ反転）
    const handleSideChange = () => {
        // 1. スタッツ数値の左右スワップ
        setStatsData(prev => {
            const current = prev || {
                leftShoot: '0', rightShoot: '0',
                leftFK: '0', rightFK: '0',
                leftCK: '0', rightCK: '0',
                leftYellow: '0', rightYellow: '0',
                leftRed: '0', rightRed: '0'
            };
            return {
                leftShoot: current.rightShoot,
                rightShoot: current.leftShoot,
                leftFK: current.rightFK,
                rightFK: current.leftFK,
                leftCK: current.rightCK,
                rightCK: current.leftCK,
                leftYellow: current.rightYellow,
                rightYellow: current.leftYellow,
                leftRed: current.rightRed,
                rightRed: current.leftRed
            };
        });

        // 2. 小得点・大得点のチーム名・得点・チームカラーのスワップ
        const curSmall = smallScoreTelop.data || {};
        const curBig = bigScoreTelop.data || {};

        const swappedData = {
            '左チーム名': curSmall['右チーム名'] || curBig['右チーム名'] || rightTeamName,
            '右チーム名': curSmall['左チーム名'] || curBig['左チーム名'] || leftTeamName,
            '左チーム得点': curSmall['右チーム得点'] || curBig['右チーム得点'] || rightScore,
            '右チーム得点': curSmall['左チーム得点'] || curBig['左チーム得点'] || leftScore,
            'LeftTeamColor': curSmall['RigtTeamColor'] || curBig['RightTeamColorLargePoint'] || '#bd39fb',
            'RigtTeamColor': curSmall['LeftTeamColor'] || curBig['LeftTeamColorLargePoint'] || '#bd39fb',
            'LeftTeamColorLargePoint': curSmall['RigtTeamColor'] || '#bd39fb',
            'RightTeamColorLargePoint': curSmall['LeftTeamColor'] || '#bd39fb',
            'LeftTeamColorSmallPoint': curSmall['RigtTeamColor'] || '#bd39fb',
            'RightTeamColorSmallPoint': curSmall['LeftTeamColor'] || '#bd39fb'
        };

        smallScoreTelop.setData((prev: any) => ({ ...prev, ...swappedData }));
        bigScoreTelop.setData((prev: any) => ({ ...prev, ...swappedData }));

        // もしスタッツ送出中なら、スタッツも即時更新
        if (statsTelop.isVisible) {
            setTimeout(() => {
                sendStats(false);
            }, 100);
        }
    };

    // スタッツ更新ヘルパー
    const updateStat = (key: keyof StatsData, delta: number) => {
        setStatsData(prev => {
            const current = prev || {
                leftShoot: '0', rightShoot: '0',
                leftFK: '0', rightFK: '0',
                leftCK: '0', rightCK: '0',
                leftYellow: '0', rightYellow: '0',
                leftRed: '0', rightRed: '0'
            };
            const currentVal = parseInt(current[key] || '0', 10);
            const newVal = String(Math.max(0, currentVal + delta));
            return { ...current, [key]: newVal };
        });
    };

    const setStatValue = (key: keyof StatsData, val: string) => {
        setStatsData(prev => ({
            ...(prev || {
                leftShoot: '0', rightShoot: '0',
                leftFK: '0', rightFK: '0',
                leftCK: '0', rightCK: '0',
                leftYellow: '0', rightYellow: '0',
                leftRed: '0', rightRed: '0'
            }),
            [key]: val
        }));
    };

    // Send Stats (得点は小得点とリンク！)
    const sendStats = (isTake: boolean = true) => {
        const payload = {
            '左側チーム名': leftTeamName,
            '右側チーム名': rightTeamName,
            'Left得点数値': leftScore,
            'Right得点数値': rightScore,
            '左側シュート数値': statsData?.leftShoot || '0',
            '右側シュート数値': statsData?.rightShoot || '0',
            '左側FK数値': statsData?.leftFK || '0',
            '右側FK数値': statsData?.rightFK || '0',
            '左側CK数値': statsData?.leftCK || '0',
            '右側CK数値': statsData?.rightCK || '0',
            '左側イエロー数値': statsData?.leftYellow || '0',
            '右側イエロー数値': statsData?.rightYellow || '0',
            '左側レッド数値': statsData?.leftRed || '0',
            '右側レッド数値': statsData?.rightRed || '0'
        };

        statsTelop.setData(payload);
        if (isTake) {
            statsTelop.show(payload);
        } else {
            statsTelop.update(payload);
        }
    };

    return (
        <div>

            {/* Stats Card (Enhanced with Side Change & Full Inputs) */}
            <div className="glass-panel" style={{ padding: '16px' }}>
                <div className="flex-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#198754' }}>📊 スタッツ (Stats)</h4>
                        {statsTelop.isVisible && <span className="status-badge status-connected">ON AIR</span>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                            className="btn btn-warning" 
                            style={{ padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'bold' }} 
                            onClick={handleSideChange}
                            title="左チームと右チームのスタッツ・得点・チーム名を反転"
                        >
                            🔄 サイドチェンジ (反転)
                        </button>
                        <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => sendStats(false)}>
                            UPDATE
                        </button>
                        <button className="btn btn-success" style={{ padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'bold' }} onClick={() => sendStats(true)}>
                            TAKE スタッツ
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 14px' }} onClick={statsTelop.hide}>
                            HIDE
                        </button>
                    </div>
                </div>

                {/* Team Names and Scores (Linked with 小得点) */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8 }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: 2 }}>左チーム名 (小得点リンク)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0dcaf0' }}>{leftTeamName}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: 40, textAlign: 'center' }}>{leftScore}</div>
                        <div style={{ fontSize: '1.2rem', opacity: 0.5 }}>-</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: 40, textAlign: 'center' }}>{rightScore}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: 2 }}>右チーム名 (小得点リンク)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffc107' }}>{rightTeamName}</div>
                    </div>
                </div>

                {/* Stats Table Inputs */}
                <table className="modern-table" style={{ width: '100%', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ width: '38%', textAlign: 'center', color: '#0dcaf0' }}>{leftTeamName} (左)</th>
                            <th style={{ width: '24%', textAlign: 'center' }}>項目</th>
                            <th style={{ width: '38%', textAlign: 'center', color: '#ffc107' }}>{rightTeamName} (右)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* シュート */}
                        <tr>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.leftShoot || '0'} 
                                    onChange={v => setStatValue('leftShoot', v)} 
                                    onDelta={d => updateStat('leftShoot', d)} 
                                />
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>シュート</td>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.rightShoot || '0'} 
                                    onChange={v => setStatValue('rightShoot', v)} 
                                    onDelta={d => updateStat('rightShoot', d)} 
                                />
                            </td>
                        </tr>

                        {/* フリーキック (FK) */}
                        <tr>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.leftFK || '0'} 
                                    onChange={v => setStatValue('leftFK', v)} 
                                    onDelta={d => updateStat('leftFK', d)} 
                                />
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>フリーキック (FK)</td>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.rightFK || '0'} 
                                    onChange={v => setStatValue('rightFK', v)} 
                                    onDelta={d => updateStat('rightFK', d)} 
                                />
                            </td>
                        </tr>

                        {/* コーナーキック (CK) */}
                        <tr>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.leftCK || '0'} 
                                    onChange={v => setStatValue('leftCK', v)} 
                                    onDelta={d => updateStat('leftCK', d)} 
                                />
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>コーナーキック (CK)</td>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.rightCK || '0'} 
                                    onChange={v => setStatValue('rightCK', v)} 
                                    onDelta={d => updateStat('rightCK', d)} 
                                />
                            </td>
                        </tr>

                        {/* イエローカード */}
                        <tr>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.leftYellow || '0'} 
                                    onChange={v => setStatValue('leftYellow', v)} 
                                    onDelta={d => updateStat('leftYellow', d)} 
                                    accentColor="#ffeb3b"
                                />
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#ffeb3b' }}>🟨 イエロー</td>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.rightYellow || '0'} 
                                    onChange={v => setStatValue('rightYellow', v)} 
                                    onDelta={d => updateStat('rightYellow', d)} 
                                    accentColor="#ffeb3b"
                                />
                            </td>
                        </tr>

                        {/* レッドカード */}
                        <tr>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.leftRed || '0'} 
                                    onChange={v => setStatValue('leftRed', v)} 
                                    onDelta={d => updateStat('leftRed', d)} 
                                    accentColor="#f44336"
                                />
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#f44336' }}>🟥 レッド</td>
                            <td>
                                <StatCounterRow 
                                    value={statsData?.rightRed || '0'} 
                                    onChange={v => setStatValue('rightRed', v)} 
                                    onDelta={d => updateStat('rightRed', d)} 
                                    accentColor="#f44336"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// 気象情報 (CG Operation「試合スコア & タイマー & 1Shot」タブで使用)
// --------------------------------------------------------
export function WeatherControl() {
    const weatherTelop = useTelop('気象');

    const [weatherData, setWeatherData] = useState({
        condition: '晴れ',
        temp: '22.3',
        humidity: '81'
    });

    const sendWeather = () => {
        const payload = {
            '天候テキスト': weatherData.condition,
            '気温テキスト': weatherData.temp,
            '湿度テキスト': weatherData.humidity
        };
        weatherTelop.setData(payload);
        weatherTelop.show(payload);
    };

    return (
        <div className="glass-panel" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#0dcaf0' }}>🌤️ 気象情報 (Weather)</h4>
                {weatherTelop.isVisible && <span className="status-badge status-connected">ON AIR</span>}
            </div>
            {/* 天候 / 気温 / 湿度 を3行で表示 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'center', columnGap: '6px', rowGap: '6px', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.75rem', color: '#aaa', whiteSpace: 'nowrap' }}>天候</label>
                {/* 最長の選択肢「くもり」+ ドロップダウン矢印が欠けない最小幅を確保 */}
                <select
                    className="form-select"
                    value={weatherData.condition}
                    onChange={e => setWeatherData({ ...weatherData, condition: e.target.value })}
                    style={{ padding: '4px', minWidth: '7em' }}
                >
                    <option value="晴れ">晴れ</option>
                    <option value="くもり">くもり</option>
                    <option value="雨">雨</option>
                    <option value="小雨">小雨</option>
                    <option value="雪">雪</option>
                </select>
                <label style={{ fontSize: '0.75rem', color: '#aaa', whiteSpace: 'nowrap' }}>気温 (℃)</label>
                <input
                    type="text"
                    className="form-input"
                    value={weatherData.temp}
                    onChange={e => setWeatherData({ ...weatherData, temp: e.target.value })}
                    style={{ padding: '4px', minWidth: 0 }}
                />
                <label style={{ fontSize: '0.75rem', color: '#aaa', whiteSpace: 'nowrap' }}>湿度 (%)</label>
                <input
                    type="text"
                    className="form-input"
                    value={weatherData.humidity}
                    onChange={e => setWeatherData({ ...weatherData, humidity: e.target.value })}
                    style={{ padding: '4px', minWidth: 0 }}
                />
            </div>
            {/* 湿度の下: TAKE / HIDE */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-success" style={{ flex: 1, padding: '6px', whiteSpace: 'nowrap' }} onClick={sendWeather}>TAKE 気象</button>
                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={weatherTelop.hide}>HIDE</button>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// 選手交代 共通 (チームは Lineups の左右チームのみ・選手は Lineups 登録のスタメン → 控えの登録順)
// --------------------------------------------------------
type Side = 'left' | 'right';

export type { CgQueueItem } from '../utils/cgQueue';

function useSubTeams() {
    const [players] = useSyncedState<Player[]>('roster', []);
    const [oaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const [teamLineups] = useSyncedState<Record<string, TeamLineup>>(TEAM_LINEUPS_KEY, {});
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);

    const schoolOf = (side: Side) => (side === 'left' ? oaLeftTeam : oaRightTeam);
    const lineupOf = (side: Side) => teamLineups?.[schoolOf(side)];
    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;

    return {
        schoolOf,
        // TeamSettings のチームカラー（未設定時は画面の左右カラー）
        colorOf: (side: Side) => teams.find(t => t.name === schoolOf(side))?.color || (side === 'right' ? '#0dcaf0' : '#198754'),
        isRegistered: (side: Side) => hasRegistered(lineupOf(side)),
        startersOf: (side: Side) => registeredStarters(lineupOf(side), players || []),
        subsOf: (side: Side) => registeredSubs(lineupOf(side), players || []),
        findPlayer: (id: string) => (id ? (players || []).find(p => p.id === id) : undefined)
    };
}

const playerLabel = (p?: Player) => (p ? `${p.number} ${p.name}` : '—');

function SubTeamSelect({ side, onChange, teams }: { side: Side, onChange: (side: Side) => void, teams: ReturnType<typeof useSubTeams> }) {
    return (
        <div>
            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>チーム名 (Lineups)</label>
            <select className="form-select" value={side} onChange={e => onChange(e.target.value as Side)} style={{ padding: '4px' }}>
                <option value="left">{teams.schoolOf('left')} (左)</option>
                <option value="right">{teams.schoolOf('right')} (右)</option>
            </select>
            {!teams.isRegistered(side) && (
                <div style={{ fontSize: '0.7rem', color: '#ffca28', marginTop: 2 }}>
                    {teams.schoolOf(side)} のメンバーが未登録です（Lineups タブで登録してください）
                </div>
            )}
        </div>
    );
}

function SubPlayerSelect({ side, value, onChange, placeholder, teams, style }: { side: Side, value: string, onChange: (id: string) => void, placeholder: string, teams: ReturnType<typeof useSubTeams>, style?: React.CSSProperties }) {
    const starters = teams.startersOf(side);
    const subs = teams.subsOf(side);
    return (
        <select className="form-select" value={value} onChange={e => onChange(e.target.value)} style={{ padding: '4px', ...style }}>
            <option value="">{placeholder}</option>
            {starters.length > 0 && (
                <optgroup label="スタメン">
                    {starters.map(p => <option key={p.id} value={p.id}>{p.number} - {p.name}</option>)}
                </optgroup>
            )}
            {subs.length > 0 && (
                <optgroup label="控え">
                    {subs.map(p => <option key={p.id} value={p.id}>{p.number} - {p.name}</option>)}
                </optgroup>
            )}
        </select>
    );
}

// --------------------------------------------------------
// 選手交代 1枚 (CG Operation「試合スコア & タイマー & 1Shot」タブで使用)
// --------------------------------------------------------
export function Sub1Control() {
    const teams = useSubTeams();
    const registerQueue = useCgQueueRegister();
    const sub1Telop = useTelop('選手交代1枚');

    const [sub1Data, setSub1Data] = useState<{ side: Side, outPlayerId: string, inPlayerId: string }>({
        side: 'left',
        outPlayerId: '',
        inPlayerId: ''
    });

    const buildPayload = () => {
        const outPlayer = teams.findPlayer(sub1Data.outPlayerId);
        const inPlayer = teams.findPlayer(sub1Data.inPlayerId);
        return {
            '高校名テキスト': teams.schoolOf(sub1Data.side),
            'ColorRect': teams.colorOf(sub1Data.side), // CG の チームカラーザブトン (KeyExp: ColorRect)
            'OUT背番号': outPlayer?.number || '',
            'OUT選手名': outPlayer?.name || '',
            'OUT学年': formatGrade(outPlayer?.grade),
            'IN背番号': inPlayer?.number || '',
            'IN選手名': inPlayer?.name || '',
            'IN学年': formatGrade(inPlayer?.grade),
            'OUTポジション': subChangeBaseImage('OUT', outPlayer?.position),
            'INポジション': subChangeBaseImage('IN', inPlayer?.position)
        };
    };

    const sendSub1 = () => {
        const payload = buildPayload();
        sub1Telop.setData(payload);
        sub1Telop.show(payload);
    };

    const registerSub1 = () => {
        if (!sub1Data.outPlayerId || !sub1Data.inPlayerId) {
            alert('OUT 選手と IN 選手を選択してください。');
            return;
        }
        const outPlayer = teams.findPlayer(sub1Data.outPlayerId);
        const inPlayer = teams.findPlayer(sub1Data.inPlayerId);
        registerQueue('選手交代1枚', `交代1枚 ${teams.schoolOf(sub1Data.side)} OUT ${playerLabel(outPlayer)} → IN ${playerLabel(inPlayer)}`, buildPayload());
    };

    return (
        <div className="glass-panel" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffc107' }}>🔄 選手交代 1枚</h4>
                {sub1Telop.isVisible && <span className="status-badge status-connected">ON AIR</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                <SubTeamSelect side={sub1Data.side} onChange={side => setSub1Data({ side, outPlayerId: '', inPlayerId: '' })} teams={teams} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: '#f44336' }}>OUT 選手</label>
                        <SubPlayerSelect side={sub1Data.side} value={sub1Data.outPlayerId} onChange={id => setSub1Data({ ...sub1Data, outPlayerId: id })} placeholder="-- OUT 選択 --" teams={teams} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: '#4caf50' }}>IN 選手</label>
                        <SubPlayerSelect side={sub1Data.side} value={sub1Data.inPlayerId} onChange={id => setSub1Data({ ...sub1Data, inPlayerId: id })} placeholder="-- IN 選択 --" teams={teams} />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-success" style={{ flex: 1, padding: '6px' }} onClick={sendSub1}>TAKE 交代1枚</button>
                <button className="btn btn-warning" style={{ padding: '6px 10px' }} onClick={registerSub1} title="CG Queue List にストック">Q登録</button>
                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={sub1Telop.hide}>HIDE</button>
            </div>
        </div>
    );
}

// --------------------------------------------------------
// 選手交代 2枚同時 (CG Operation「試合スコア & タイマー & 1Shot」タブで使用)
// --------------------------------------------------------
export function Sub2Control() {
    const teams = useSubTeams();
    const registerQueue = useCgQueueRegister();
    const sub2Telop = useTelop('選手交代2枚');

    const emptyPicks = { outPlayerId1: '', inPlayerId1: '', outPlayerId2: '', inPlayerId2: '' };
    const [sub2Data, setSub2Data] = useState<{ side: Side } & typeof emptyPicks>({ side: 'left', ...emptyPicks });

    const buildPayload = () => {
        // テロップは KeyExp「〜2」が上段・「〜1」が下段なので、GUI の 1 段目 → 〜2、2 段目 → 〜1 に送る
        const rows = [
            { n: 2, out: teams.findPlayer(sub2Data.outPlayerId1), in: teams.findPlayer(sub2Data.inPlayerId1) },
            { n: 1, out: teams.findPlayer(sub2Data.outPlayerId2), in: teams.findPlayer(sub2Data.inPlayerId2) }
        ];
        const payload: Record<string, string> = {
            '高校名テキスト': teams.schoolOf(sub2Data.side),
            'ColorRect': teams.colorOf(sub2Data.side) // CG の チームカラーザブトン (KeyExp: ColorRect)
        };
        rows.forEach(({ n, out, in: inP }) => {
            payload[`OUT背番号${n}`] = out?.number || '';
            payload[`OUT選手名${n}`] = out?.name || '';
            payload[`OUT学年${n}`] = formatGrade(out?.grade);
            payload[`OUTポジション${n}`] = subChangeBaseImage('OUT', out?.position);
            payload[`IN背番号${n}`] = inP?.number || '';
            payload[`IN選手名${n}`] = inP?.name || '';
            payload[`IN学年${n}`] = formatGrade(inP?.grade);
            payload[`INポジション${n}`] = subChangeBaseImage('IN', inP?.position);
        });
        return payload;
    };

    const sendSub2 = () => {
        const payload = buildPayload();
        sub2Telop.setData(payload);
        sub2Telop.show(payload);
    };

    const registerSub2 = () => {
        if (!sub2Data.outPlayerId1 || !sub2Data.inPlayerId1 || !sub2Data.outPlayerId2 || !sub2Data.inPlayerId2) {
            alert('OUT1 / IN1 / OUT2 / IN2 の選手をすべて選択してください。');
            return;
        }
        const f = teams.findPlayer;
        registerQueue('選手交代2枚', `交代2枚 ${teams.schoolOf(sub2Data.side)} OUT ${playerLabel(f(sub2Data.outPlayerId1))}・${playerLabel(f(sub2Data.outPlayerId2))} → IN ${playerLabel(f(sub2Data.inPlayerId1))}・${playerLabel(f(sub2Data.inPlayerId2))}`, buildPayload());
    };

    const pick = (key: keyof typeof emptyPicks, placeholder: string) => (
        <SubPlayerSelect side={sub2Data.side} value={sub2Data[key]} onChange={id => setSub2Data({ ...sub2Data, [key]: id })} placeholder={placeholder} teams={teams} style={{ flex: 1 }} />
    );

    return (
        <div className="glass-panel" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#ff9800' }}>🔄 選手交代 2枚同時</h4>
                {sub2Telop.isVisible && <span className="status-badge status-connected">ON AIR</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                <SubTeamSelect side={sub2Data.side} onChange={side => setSub2Data({ side, ...emptyPicks })} teams={teams} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    {pick('outPlayerId1', 'OUT1 選択')}
                    {pick('inPlayerId1', 'IN1 選択')}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {pick('outPlayerId2', 'OUT2 選択')}
                    {pick('inPlayerId2', 'IN2 選択')}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-success" style={{ flex: 1, padding: '6px' }} onClick={sendSub2}>TAKE 交代2枚</button>
                <button className="btn btn-warning" style={{ padding: '6px 10px' }} onClick={registerSub2} title="CG Queue List にストック">Q登録</button>
                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={sub2Telop.hide}>HIDE</button>
            </div>
        </div>
    );
}

function StatCounterRow({ value, onChange, onDelta, accentColor }: { value: string, onChange: (v: string) => void, onDelta: (d: number) => void, accentColor?: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '2px 8px', fontSize: '0.85rem', minWidth: 28 }}
                onClick={() => onDelta(-1)}
            >
                -
            </button>
            <input 
                type="number" 
                className="form-input" 
                value={value} 
                onChange={e => onChange(e.target.value)} 
                style={{ width: '56px', textAlign: 'center', padding: '4px', fontWeight: 'bold', fontSize: '1.1rem', color: accentColor || 'white' }}
                min="0"
            />
            <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '2px 8px', fontSize: '0.85rem', minWidth: 28 }}
                onClick={() => onDelta(1)}
            >
                +
            </button>
        </div>
    );
}

