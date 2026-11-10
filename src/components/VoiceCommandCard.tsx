import React from 'react';
import { useTelop, useSyncedState } from '@sdk/TelopHubSDK';
import { useClearForTake, takeOrUpdate } from '../utils/cgExclusive';
import { useCgQueueRegister } from '../utils/cgQueue';
import { useMatchLog, playerFields } from '../utils/useMatchLog';
import { useApplySubstitution } from '../utils/useSubstitution';
import { PERIOD_MINUTES_KEY, PeriodMinutes, DEFAULT_PERIOD_MINUTES, goalMinuteLabel } from '../utils/scorers';
import { teamColorSet } from '../utils/teamColor';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from './TeamSettings';
import {
    useSubTeams, SubTeams, SubPair, buildSub1Payload, buildSub2Payload, subQueueLabel, subLogDrafts,
    SubTeamSelect, SubPlayerSelect, useWeatherData, buildWeatherPayload
} from './WeatherStatsSubControl';
import {
    VoiceCommand, VoiceSubCommand, VoiceWeatherCommand, VoiceGoalCommand, goalTotalMinute
} from '../utils/voice/voiceCommands';

/**
 * 音声送出の確認カード（選手交代・気象・得点者）。聞き取った内容を入れておき、直してから送出・記録する。
 * - 交代: TAKE / Q登録 / 交代反映（1 組 = 交代1枚、2 組 = 交代2枚）
 * - 気象: TAKE / Q登録（気温・湿度は気象パネルの入力にも反映）
 * - 得点者: 当日操作ログに記録するだけ（チーム得点・大得点得点者はログから更新される）。時刻は分だけ（+1 しない）
 */
export default function VoiceCommandCard({ command, onChange, onDone }: {
    command: VoiceCommand,
    onChange: (next: VoiceCommand) => void,
    onDone: () => void
}) {
    const teams = useSubTeams();
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const configs = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;
    const side = command.kind === 'weather' ? null : command.side;
    const color = side ? teamColorSet(configs.find(t => t.name === teams.schoolOf(side)), side).color : '#0dcaf0';

    return (
        <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: `2px solid ${color}` }}>
            {command.kind === 'sub' && <SubCard command={command} onChange={onChange} onDone={onDone} teams={teams} />}
            {command.kind === 'weather' && <WeatherCard command={command} onChange={onChange} onDone={onDone} />}
            {command.kind === 'goal' && <GoalCard command={command} onChange={onChange} onDone={onDone} teams={teams} />}
            <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 6 }}>「{command.transcript}」</div>
        </div>
    );
}

const titleStyle: React.CSSProperties = { fontSize: '1.05rem', fontWeight: 'bold' };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 };
const noteStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#ff9800', fontWeight: 'bold' };

function Buttons({ children, onCancel }: { children: React.ReactNode, onCancel: () => void }) {
    return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {children}
            <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={onCancel}>取消</button>
        </div>
    );
}

// ---------------------------------------------------------------- 選手交代

function SubCard({ command, onChange, onDone, teams }: { command: VoiceSubCommand, onChange: (c: VoiceCommand) => void, onDone: () => void, teams: SubTeams }) {
    const sub1 = useTelop('選手交代1枚');
    const sub2 = useTelop('選手交代2枚');
    const clearForTake = useClearForTake();
    const registerQueue = useCgQueueRegister();
    const applySubstitution = useApplySubstitution();
    const { record: recordLog } = useMatchLog();

    const two = command.pairs.length >= 2;
    const telopName = two ? '選手交代2枚' : '選手交代1枚';
    const pairs: SubPair[] = command.pairs.slice(0, 2).map(p => [p.outId, p.inId]);
    const complete = pairs.every(([o, i]) => o && i);
    const payload = () => (two ? buildSub2Payload(teams, command.side, [pairs[0], pairs[1]]) : buildSub1Payload(teams, command.side, pairs[0]));
    const setPair = (idx: number, field: 'outId' | 'inId', id: string) =>
        onChange({ ...command, pairs: command.pairs.map((p, i) => (i === idx ? { ...p, [field]: id } : p)) });

    const take = () => {
        const telop = two ? sub2 : sub1;
        const data = payload();
        telop.setData(data);
        takeOrUpdate(telop, data, () => clearForTake(telopName));
        recordLog(subLogDrafts(teams, command.side, pairs));
        onDone();
    };
    const register = () => {
        registerQueue(telopName, subQueueLabel(teams, command.side, pairs), payload(), subLogDrafts(teams, command.side, pairs));
        onDone();
    };
    const reflect = () => applySubstitution(teams.schoolOf(command.side), pairs.map(([outId, inId]) => ({ outId, inId })));

    return (
        <>
            <div className="flex-between" style={{ gap: 8, flexWrap: 'wrap' }}>
                <div style={titleStyle}>
                    🔄 {two ? '選手交代 2枚' : '選手交代 1枚'}
                    <span style={{ fontSize: '0.8rem', color: '#ffca28', marginLeft: 8 }}>{teams.schoolOf(command.side)}</span>
                </div>
                <Buttons onCancel={onDone}>
                    <button className="btn btn-success" style={{ padding: '8px 22px', fontWeight: 'bold', fontSize: '1rem' }} onClick={take} disabled={!complete}
                        title={complete ? '' : 'OUT と IN の選手をすべて選んでください'}>TAKE</button>
                    <button className="btn btn-warning" style={{ padding: '8px 12px' }} onClick={register} disabled={!complete} title="CG Queue List にストック">Q登録</button>
                    <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={reflect} disabled={!complete}
                        title="Lineups のスタメンと控えを入れ替えます（OUT 選手は控えでグレー表示）">交代反映</button>
                </Buttons>
            </div>
            {command.notes.map(n => <div key={n} style={noteStyle}>⚠ {n}</div>)}
            <div style={{ marginTop: 8 }}>
                <SubTeamSelect side={command.side} teams={teams}
                    onChange={s => onChange({ ...command, side: s, sideSure: true, notes: [], pairs: command.pairs.map(p => ({ ...p, outId: '', inId: '' })) })} />
            </div>
            {command.pairs.slice(0, 2).map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#f44336', width: 36 }}>OUT{two ? i + 1 : ''}</span>
                    <SubPlayerSelect side={command.side} value={p.outId} onChange={id => setPair(i, 'outId', id)} placeholder={p.outNo ? `${p.outNo}番?` : '-- OUT 選択 --'} teams={teams} style={{ flex: 1 }} />
                    <span style={{ fontSize: '0.75rem', color: '#4caf50', width: 30 }}>→ IN</span>
                    <SubPlayerSelect side={command.side} value={p.inId} onChange={id => setPair(i, 'inId', id)} placeholder={p.inNo ? `${p.inNo}番?` : '-- IN 選択 --'} teams={teams} style={{ flex: 1 }} />
                </div>
            ))}
            <div style={rowStyle}>
                {two ? (
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => onChange({ ...command, pairs: command.pairs.slice(0, 1) })}>
                        2組目を外す（交代1枚にする）
                    </button>
                ) : (
                    <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => onChange({ ...command, pairs: [...command.pairs, { outId: '', inId: '', outNo: '', inNo: '' }] })}>
                        ＋ 2組目（交代2枚にする）
                    </button>
                )}
            </div>
        </>
    );
}

// ---------------------------------------------------------------- 気象

function WeatherCard({ command, onChange, onDone }: { command: VoiceWeatherCommand, onChange: (c: VoiceCommand) => void, onDone: () => void }) {
    const weather = useTelop('気象');
    const clearForTake = useClearForTake();
    const registerQueue = useCgQueueRegister();
    const { weatherData, setWeatherData, indoor, setIndoor } = useWeatherData();
    // 聞き取れなかった方は、気象パネルの今の値のまま
    const next = { ...weatherData, temp: command.temp ?? weatherData.temp, humidity: command.humidity ?? weatherData.humidity };

    const take = () => {
        setWeatherData(next);
        const payload = buildWeatherPayload(next, indoor);
        weather.setData(payload);
        takeOrUpdate(weather, payload, () => clearForTake('気象'));
        onDone();
    };
    const register = () => {
        setWeatherData(next);
        registerQueue('気象', `気象 ${indoor ? '' : `${next.condition} `}${next.temp}℃ ${next.humidity}%`, buildWeatherPayload(next, indoor));
        onDone();
    };

    const input = (label: string, value: string, unit: string, heard: boolean, set: (v: string) => void) => (
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
            {label}
            <input className="form-input" value={value} onChange={e => set(e.target.value)}
                style={{ width: 80, padding: '4px 6px', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center', color: heard ? '#fff' : '#888' }} />
            {unit}
        </label>
    );

    return (
        <>
            <div className="flex-between" style={{ gap: 8, flexWrap: 'wrap' }}>
                <div style={titleStyle}>🌤️ 気象</div>
                <Buttons onCancel={onDone}>
                    <button className="btn btn-success" style={{ padding: '8px 22px', fontWeight: 'bold', fontSize: '1rem' }} onClick={take}>TAKE</button>
                    <button className="btn btn-warning" style={{ padding: '8px 12px' }} onClick={register} title="CG Queue List にストック">Q登録</button>
                </Buttons>
            </div>
            <div style={rowStyle}>
                {input('気温', next.temp, '℃', command.temp !== null, v => onChange({ ...command, temp: v }))}
                {input('湿度', next.humidity, '%', command.humidity !== null, v => onChange({ ...command, humidity: v }))}
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>天候: {indoor ? '（屋内施設のため出さない）' : weatherData.condition}</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#aaa', cursor: 'pointer' }}>
                    <input type="checkbox" checked={indoor} onChange={e => setIndoor(e.target.checked)} /> 屋内施設
                </label>
            </div>
            {(command.temp === null || command.humidity === null) && (
                <div style={noteStyle}>⚠ {command.temp === null ? '気温' : '湿度'}を聞き取れなかったので、気象パネルの今の値（グレー）を使います</div>
            )}
        </>
    );
}

// ---------------------------------------------------------------- 得点者

const PERIODS = ['前半', '後半', '延長前半', '延長後半'];

function GoalCard({ command, onChange, onDone, teams }: { command: VoiceGoalCommand, onChange: (c: VoiceCommand) => void, onDone: () => void, teams: SubTeams }) {
    const { record: recordLog } = useMatchLog();
    const [lengths] = useSyncedState<PeriodMinutes>(PERIOD_MINUTES_KEY, DEFAULT_PERIOD_MINUTES);
    const [timerPeriod] = useSyncedState<string>('match_timer_period', '前半');
    const len = { ...DEFAULT_PERIOD_MINUTES, ...(lengths || {}) };
    const period = command.period || (PERIODS.includes(timerPeriod) ? timerPeriod : '前半');
    const side = command.side || 'left';
    const players = [...teams.startersOf(side), ...teams.subsOf(side)];
    const player = players.find(p => p.id === command.playerId) || teams.findPlayer(command.playerId);
    const total = goalTotalMinute(period, command.minute, command.plus, len);
    const entry = { period, time: `${total}:00`, minuteOnly: true };
    const label = goalMinuteLabel(entry, len);
    const others = command.candidates.filter(c => c.target.player && c.target.player.id !== command.playerId).slice(0, 3);
    const ambiguous = !!player && command.candidates.length >= 2 && command.candidates[0].target.player?.id === command.playerId &&
        command.candidates[0].score - command.candidates[1].score < 0.05;

    const save = () => {
        recordLog({ type: 'goal', team: teams.schoolOf(side), ...playerFields(player), ...entry, ...(command.pk ? { pk: true } : {}) });
        onDone();
    };

    return (
        <>
            <div className="flex-between" style={{ gap: 8, flexWrap: 'wrap' }}>
                <div style={titleStyle}>
                    ⚽ {label}{command.pk ? '(P)' : ''}
                    <span style={{ marginLeft: 8 }}>{player ? `#${player.number} ${player.name}` : '選手不明・OG'}</span>
                    <span style={{ fontSize: '0.8rem', color: '#ffca28', marginLeft: 8 }}>{teams.schoolOf(side)}</span>
                </div>
                <Buttons onCancel={onDone}>
                    <button className="btn btn-success" style={{ padding: '8px 18px', fontWeight: 'bold', fontSize: '1rem' }} onClick={save}
                        title="当日操作ログにゴールを記録します（チーム得点・大得点得点者はログから更新）">ログに記録</button>
                </Buttons>
            </div>
            {!command.side && <div style={noteStyle}>⚠ チームを聞き取れませんでした。チームを確認してください</div>}
            {!player && !command.ownGoal && <div style={noteStyle}>⚠ 得点者を聞き取れませんでした。選手を選んでください（オウンゴールはこのまま）</div>}
            {ambiguous && <div style={noteStyle}>⚠ 同じくらい近い候補があります。ほかの候補も確認してください</div>}
            <div style={rowStyle}>
                <select className="form-select" value={side} onChange={e => onChange({ ...command, side: e.target.value as 'left' | 'right', playerId: '' })} style={{ width: 'auto', padding: '4px' }}>
                    <option value="left">{teams.schoolOf('left')} (左)</option>
                    <option value="right">{teams.schoolOf('right')} (右)</option>
                </select>
                <select className="form-select" value={command.playerId} onChange={e => onChange({ ...command, playerId: e.target.value, ownGoal: !e.target.value })} style={{ flex: '1 1 160px', padding: '4px' }}>
                    <option value="">-- 選手不明・OG --</option>
                    {players.map(p => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
                </select>
            </div>
            <div style={rowStyle}>
                <select className="form-select" value={period} onChange={e => onChange({ ...command, period: e.target.value })} style={{ width: 'auto', padding: '4px' }}>
                    {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input className="form-input" type="number" min={0} value={command.minute} onChange={e => onChange({ ...command, minute: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                    style={{ width: 64, padding: '4px', textAlign: 'center' }} /> 分
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>+</span>
                <input className="form-input" type="number" min={0} value={command.plus} onChange={e => onChange({ ...command, plus: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                    style={{ width: 52, padding: '4px', textAlign: 'center' }} title="アディショナルタイム（40分+2 の 2）" />
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={command.pk} onChange={e => onChange({ ...command, pk: e.target.checked })} /> PK
                </label>
                <span style={{ fontSize: '0.72rem', color: '#888' }}>（言った分のまま記録。+1 しません）</span>
            </div>
            {others.length > 0 && (
                <div style={{ ...rowStyle, marginTop: 6 }}>
                    <span style={{ fontSize: '0.72rem', color: '#aaa' }}>ほかの候補:</span>
                    {others.map(c => (
                        <button key={c.target.key} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                            onClick={() => onChange({ ...command, side: c.target.side, playerId: c.target.player!.id, ownGoal: false })}>
                            {c.target.label}（{c.target.school}）
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
