import React, { useState } from 'react';
import { useTelop, useSyncedState } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from './TeamSettings';
import { useCgQueueRegister } from '../utils/cgQueue';
import { TEAM_LINEUPS_KEY, TeamLineup, hasRegistered, registeredStarters, registeredSubs, formatGrade, subChangeBaseImage } from '../utils/lineup';
import { MatchLogDraft } from '../utils/matchLog';
import { useMatchLog, playerFields, inPlayerFields } from '../utils/useMatchLog';
import { useClearForTake, takeOrUpdate } from '../utils/cgExclusive';
import { useApplySubstitution } from '../utils/useSubstitution';
import { StatsData, buildStatsPayload } from '../utils/stats';
import { useOaTeamSettings, useScoreSideChange } from '../utils/useScoreSideChange';
import { teamColorSet, teamColorKeys } from '../utils/teamColor';

// スタッツの型・ペイロードは utils/stats に移した（サイド反転の共通処理からも使うため）。既存の import 先として再公開する
export { buildStatsPayload } from '../utils/stats';
export type { StatsData } from '../utils/stats';

export default function WeatherStatsSubControl() {
    const statsTelop = useTelop('スタッツ');
    const clearForTake = useClearForTake();
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
    // チームカラーは TeamSettings の OA 左チーム・右チームの色（Match Score と同じ求め方）
    const { leftSet, rightSet } = useOaTeamSettings();

    // サイドチェンジ: Match Score の 🔄 サイド反転と同じ処理（OA 左右チームも入れ替えるので、色がテレコにならない）
    const handleSideChange = useScoreSideChange();

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
        const payload = buildStatsPayload({ leftName: leftTeamName, rightName: rightTeamName, leftScore, rightScore, leftSet, rightSet }, statsData);

        statsTelop.setData(payload);
        if (isTake) {
            // 送出中なら UPDATE。出ていなければ他の CG を消してから出す（小得点・タイマー・ATは残す）
            takeOrUpdate(statsTelop, payload, () => clearForTake('スタッツ'));
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
export type WeatherData = { condition: string, temp: string, humidity: string };
const DEFAULT_WEATHER: WeatherData = { condition: '晴れ', temp: '22.3', humidity: '81' };
// 気象の入力（音声送出から気温・湿度を入れても、この欄に反映されるよう共有ステートに置く）
const WEATHER_DATA_KEY = 'weather_data';

/** 気象の入力と屋内施設の切り替え（気象パネルと音声送出で共通） */
export function useWeatherData() {
    const [data, setData] = useSyncedState<WeatherData>(WEATHER_DATA_KEY, DEFAULT_WEATHER);
    // 屋内施設: ON なら天候の行（天候のベース・タイトル・テキスト）を出さずに送出する（テロップ側の showIf 屋内施設）
    const [indoor, setIndoor] = useSyncedState<boolean>('weather_indoor', false);
    const weatherData: WeatherData = { ...DEFAULT_WEATHER, ...(data || {}) };
    return { weatherData, setWeatherData: setData, indoor: !!indoor, setIndoor };
}

export function buildWeatherPayload(weatherData: WeatherData, indoor: boolean) {
    return {
        '天候テキスト': weatherData.condition,
        '気温テキスト': weatherData.temp,
        '湿度テキスト': weatherData.humidity,
        '屋内施設': indoor ? '1' : ''
    };
}

export function WeatherControl() {
    const weatherTelop = useTelop('気象');
    const clearForTake = useClearForTake();
    const { weatherData, setWeatherData, indoor, setIndoor } = useWeatherData();

    const sendWeather = () => {
        const payload = buildWeatherPayload(weatherData, indoor);
        weatherTelop.setData(payload);
        // 送出中なら UPDATE。出ていなければ他の CG を消してから出す（小得点・タイマー・ATは残す）
        takeOrUpdate(weatherTelop, payload, () => clearForTake('気象'));
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
            {/* 湿度の下: TAKE（HIDE は置かない。消すときは 1Shot エリアの CGクリア か次の CG の TAKE） */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-success" style={{ flex: 1, padding: '6px', whiteSpace: 'nowrap' }} onClick={sendWeather}>TAKE 気象</button>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.85rem', cursor: 'pointer' }}
                title="ON にすると、天候を出さずに気温・湿度だけを送出します">
                <input type="checkbox" checked={indoor} onChange={e => setIndoor(e.target.checked)} />
                屋内施設
            </label>
        </div>
    );
}

// --------------------------------------------------------
// 選手交代 共通 (チームは Lineups の左右チームのみ・選手は Lineups 登録のスタメン → 控えの登録順)
// --------------------------------------------------------
type Side = 'left' | 'right';

export type { CgQueueItem } from '../utils/cgQueue';

export function useSubTeams() {
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
        // チームカラー一式（カラー1・カラー2・エッジ）
        colorsOf: (side: Side) => teamColorSet(teams.find(t => t.name === schoolOf(side)), side === 'right' ? 'right' : 'left'),
        isRegistered: (side: Side) => hasRegistered(lineupOf(side)),
        startersOf: (side: Side) => registeredStarters(lineupOf(side), players || []),
        subsOf: (side: Side) => registeredSubs(lineupOf(side), players || []),
        findPlayer: (id: string) => (id ? (players || []).find(p => p.id === id) : undefined),
        // 交代反映でスタメンから控えに下がった選手（再出場できない）
        isSubbedOut: (side: Side, id: string) => !!lineupOf(side)?.subbedOut?.includes(id)
    };
}

export type SubTeams = ReturnType<typeof useSubTeams>;
export type SubPair = [outId: string, inId: string];

const playerLabel = (p?: Player) => (p ? `${p.number} ${p.name}` : '—');

/** 選手交代1枚のテロップのデータ */
export function buildSub1Payload(teams: SubTeams, side: Side, [outId, inId]: SubPair) {
    const outPlayer = teams.findPlayer(outId);
    const inPlayer = teams.findPlayer(inId);
    return {
        '高校名テキスト': teams.schoolOf(side),
        ...teamColorKeys(teams.colorsOf(side)), // CG の チームカラーザブトン (ColorRect / ColorRect2 / ColorEdge)
        'OUT背番号': outPlayer?.number || '',
        'OUT選手名': outPlayer?.name || '',
        'OUT学年': formatGrade(outPlayer?.grade),
        'IN背番号': inPlayer?.number || '',
        'IN選手名': inPlayer?.name || '',
        'IN学年': formatGrade(inPlayer?.grade),
        'OUTポジション': subChangeBaseImage('OUT', outPlayer?.position),
        'INポジション': subChangeBaseImage('IN', inPlayer?.position)
    };
}

/** 選手交代2枚のテロップのデータ（pairs[0] = GUI の 1 段目） */
export function buildSub2Payload(teams: SubTeams, side: Side, pairs: [SubPair, SubPair]) {
    // テロップは KeyExp「〜2」が上段・「〜1」が下段なので、GUI の 1 段目 → 〜2、2 段目 → 〜1 に送る
    const rows = [
        { n: 2, out: teams.findPlayer(pairs[0][0]), in: teams.findPlayer(pairs[0][1]) },
        { n: 1, out: teams.findPlayer(pairs[1][0]), in: teams.findPlayer(pairs[1][1]) }
    ];
    const payload: Record<string, string> = {
        '高校名テキスト': teams.schoolOf(side),
        ...teamColorKeys(teams.colorsOf(side)) // CG の チームカラーザブトン (ColorRect / ColorRect2 / ColorEdge)
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
}

/** CG Queue List に出す交代の名前 */
export function subQueueLabel(teams: SubTeams, side: Side, pairs: SubPair[]) {
    const f = teams.findPlayer;
    if (pairs.length === 1) return `交代1枚 ${teams.schoolOf(side)} OUT ${playerLabel(f(pairs[0][0]))} → IN ${playerLabel(f(pairs[0][1]))}`;
    return `交代2枚 ${teams.schoolOf(side)} OUT ${pairs.map(p => playerLabel(f(p[0]))).join('・')} → IN ${pairs.map(p => playerLabel(f(p[1]))).join('・')}`;
}

/** 交代の組（OUT, IN）から当日操作ログの記録を作る。片方が未選択の組は記録しない */
export function subLogDrafts(teams: SubTeams, side: Side, pairs: SubPair[]): MatchLogDraft[] {
    return pairs
        .map(([outId, inId]) => [teams.findPlayer(outId), teams.findPlayer(inId)] as const)
        .filter(([out, inP]) => out && inP)
        .map(([out, inP]) => ({ type: 'sub' as const, team: teams.schoolOf(side), ...playerFields(out), ...inPlayerFields(inP) }));
}

export function SubTeamSelect({ side, onChange, teams }: { side: Side, onChange: (side: Side) => void, teams: ReturnType<typeof useSubTeams> }) {
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

export function SubPlayerSelect({ side, value, onChange, placeholder, teams, style }: { side: Side, value: string, onChange: (id: string) => void, placeholder: string, teams: ReturnType<typeof useSubTeams>, style?: React.CSSProperties }) {
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
                    {subs.map(p => teams.isSubbedOut(side, p.id)
                        ? <option key={p.id} value={p.id} disabled style={{ color: '#777' }}>{p.number} - {p.name}（交代済）</option>
                        : <option key={p.id} value={p.id}>{p.number} - {p.name}</option>)}
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
    const clearForTake = useClearForTake();
    const applySubstitution = useApplySubstitution();
    const { record: recordLog } = useMatchLog();

    const [sub1Data, setSub1Data] = useState<{ side: Side, outPlayerId: string, inPlayerId: string }>({
        side: 'left',
        outPlayerId: '',
        inPlayerId: ''
    });

    const buildPayload = () => buildSub1Payload(teams, sub1Data.side, [sub1Data.outPlayerId, sub1Data.inPlayerId]);

    // 当日操作ログに残す交代（OUT・IN の両方が選ばれているときだけ）
    const logDrafts = (): MatchLogDraft[] => subLogDrafts(teams, sub1Data.side, [[sub1Data.outPlayerId, sub1Data.inPlayerId]]);

    const sendSub1 = () => {
        const payload = buildPayload();
        sub1Telop.setData(payload);
        // 送出中なら UPDATE。出ていなければ他の CG を消してから出す（小得点・タイマー・ATは残す）
        takeOrUpdate(sub1Telop, payload, () => clearForTake('選手交代1枚'));
        recordLog(logDrafts());
    };

    // 交代反映: Lineups のスタメンと控えを入れ替える
    const reflectSub1 = () => {
        applySubstitution(teams.schoolOf(sub1Data.side), [{ outId: sub1Data.outPlayerId, inId: sub1Data.inPlayerId }]);
    };

    const registerSub1 = () => {
        if (!sub1Data.outPlayerId || !sub1Data.inPlayerId) {
            alert('OUT 選手と IN 選手を選択してください。');
            return;
        }
        registerQueue('選手交代1枚', subQueueLabel(teams, sub1Data.side, [[sub1Data.outPlayerId, sub1Data.inPlayerId]]), buildPayload(), logDrafts());
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
                <button className="btn btn-primary" style={{ padding: '6px 10px' }} onClick={reflectSub1} title="Lineups のスタメンと控えを入れ替えます（OUT 選手は控えでグレー表示）">交代反映</button>
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
    const clearForTake = useClearForTake();
    const applySubstitution = useApplySubstitution();
    const { record: recordLog } = useMatchLog();

    const emptyPicks = { outPlayerId1: '', inPlayerId1: '', outPlayerId2: '', inPlayerId2: '' };
    const [sub2Data, setSub2Data] = useState<{ side: Side } & typeof emptyPicks>({ side: 'left', ...emptyPicks });

    const buildPayload = () => buildSub2Payload(teams, sub2Data.side, [
        [sub2Data.outPlayerId1, sub2Data.inPlayerId1],
        [sub2Data.outPlayerId2, sub2Data.inPlayerId2]
    ]);

    const logDrafts = (): MatchLogDraft[] => subLogDrafts(teams, sub2Data.side, [
        [sub2Data.outPlayerId1, sub2Data.inPlayerId1],
        [sub2Data.outPlayerId2, sub2Data.inPlayerId2]
    ]);

    const sendSub2 = () => {
        const payload = buildPayload();
        sub2Telop.setData(payload);
        // 送出中なら UPDATE。出ていなければ他の CG を消してから出す（小得点・タイマー・ATは残す）
        takeOrUpdate(sub2Telop, payload, () => clearForTake('選手交代2枚'));
        recordLog(logDrafts());
    };

    // 交代反映: Lineups のスタメンと控えを入れ替える（選ばれている組だけ）
    const reflectSub2 = () => {
        applySubstitution(teams.schoolOf(sub2Data.side), [
            { outId: sub2Data.outPlayerId1, inId: sub2Data.inPlayerId1 },
            { outId: sub2Data.outPlayerId2, inId: sub2Data.inPlayerId2 }
        ]);
    };

    const registerSub2 = () => {
        if (!sub2Data.outPlayerId1 || !sub2Data.inPlayerId1 || !sub2Data.outPlayerId2 || !sub2Data.inPlayerId2) {
            alert('OUT1 / IN1 / OUT2 / IN2 の選手をすべて選択してください。');
            return;
        }
        registerQueue('選手交代2枚', subQueueLabel(teams, sub2Data.side, [
            [sub2Data.outPlayerId1, sub2Data.inPlayerId1],
            [sub2Data.outPlayerId2, sub2Data.inPlayerId2]
        ]), buildPayload(), logDrafts());
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
                <button className="btn btn-primary" style={{ padding: '6px 10px' }} onClick={reflectSub2} title="Lineups のスタメンと控えを入れ替えます（OUT 選手は控えでグレー表示）">交代反映</button>
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

