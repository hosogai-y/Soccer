import React, { useState } from 'react';
import { useSyncedState, useTelop, useTelopHub } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { TimerState, getTimerMs } from './GlobalTimerManager';
import { buildTimerPayload } from '../utils/timerHelper';
import {
    MATCH_LOG_ARCHIVE_LIMIT, MatchLogEntry, MatchLogType,
    LOG_TYPE_LABELS, PERIOD_EVENTS, periodFromLog, teamGoals, applyLogGoals, resetTodayGoals
} from '../utils/matchLog';
import { useMatchLog, playerFields, inPlayerFields } from '../utils/useMatchLog';

const LOG_ROW_HEIGHT = 30;
const LOG_VISIBLE_ROWS = 5;

/**
 * 当日の操作ログ（ゴール・カード・交代・前後半）。
 * CGOperation の送出操作でも自動で記録される（useMatchLog）。
 * 「ログから復元」「初期状態にする」で CGOperation の得点・ゴール数・前後半をそろえる。
 */
export default function MatchLog({ oaLeftTeam, oaRightTeam }: { oaLeftTeam: string, oaRightTeam: string }) {
    const { syncedStateRef } = useTelopHub();
    const { entries, archives, record, remove, saveEntries, saveArchives, writeScores } = useMatchLog();
    const [players, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [, setTimerState] = useSyncedState<TimerState | null>('match_timer_state', null);
    const [, setTimerPeriod] = useSyncedState<string>('match_timer_period', '前半');
    const timer = useTelop('タイマー');

    // 入力フォーム
    const [type, setType] = useState<MatchLogType>('goal');
    const [teamInput, setTeamInput] = useState<string>('');
    const [playerId, setPlayerId] = useState('');
    const [inPlayerId, setInPlayerId] = useState('');
    const [periodEvent, setPeriodEvent] = useState(PERIOD_EVENTS[0]);
    const [timeInput, setTimeInput] = useState('');
    // 表示中のログ（'' = 当日ログ、数字 = 過去ログの番号）
    const [viewing, setViewing] = useState('');

    const team = teamInput === oaRightTeam ? oaRightTeam : oaLeftTeam;
    const teamPlayers = (players || [])
        .filter(p => p.schoolName === team)
        .sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));
    const findPlayer = (id: string) => (players || []).find(p => p.id === id);

    const handleAdd = () => {
        if (type === 'sub' && (!playerId || !inPlayerId)) {
            alert('交代は OUT と IN の選手を選んでください。');
            return;
        }
        if ((type === 'yellow' || type === 'red') && !playerId) {
            alert('カードの選手を選んでください。');
            return;
        }
        const added = record({
            type,
            time: timeInput,
            ...(type === 'period'
                ? { event: periodEvent }
                : { team, ...playerFields(findPlayer(playerId)), ...(type === 'sub' ? inPlayerFields(findPlayer(inPlayerId)) : {}) })
        });
        if (added === 0) {
            alert('同じ内容がすでに記録されています。');
            return;
        }
        setPlayerId('');
        setInPlayerId('');
        setTimeInput('');
    };

    const handleDelete = (entry: MatchLogEntry) => {
        if (!window.confirm(`この記録を削除しますか？\n${describe(entry)}`)) return;
        remove(entry);
    };

    // ログから復元: 全選手の Today/Total ゴール・チーム得点・前後半をログの内容にそろえる（タイマーはそのまま）
    const handleRestore = () => {
        if (entries.length === 0) {
            alert('当日ログがありません。');
            return;
        }
        const period = periodFromLog(entries);
        const left = teamGoals(entries, oaLeftTeam);
        const right = teamGoals(entries, oaRightTeam);
        if (!window.confirm(
            `操作ログ（${entries.length}件）の内容で CGOperation を更新しますか？\n` +
            `・得点: ${oaLeftTeam} ${left} - ${right} ${oaRightTeam}\n` +
            `・選手の Today/Total ゴールをログのゴール数にそろえます\n` +
            (period ? `・前後半: ${period}\n` : '') +
            `・タイマーの時刻は変えません`
        )) return;
        setPlayers(prev => applyLogGoals(prev || [], entries));
        writeScores(left, right);
        if (period) changePeriod(period, null);
    };

    // 初期状態: 小得点 0-0・タイマー 0:00・前半、Today ゴール 0。当日ログは過去ログへ退避
    const handleReset = () => {
        if (!window.confirm(
            `CGOperation を初期状態にしますか？\n` +
            `・得点 0 - 0、タイマー 0:00（停止）、前半\n` +
            `・全選手の Today ゴールを 0 にし、Total を試合前の通算に戻します\n` +
            (entries.length > 0 ? `・当日ログ（${entries.length}件）は過去ログに保管して空にします` : '')
        )) return;
        if (entries.length > 0) {
            const title = `${oaLeftTeam} vs ${oaRightTeam}`;
            saveArchives([{ savedAt: Date.now(), title, entries }, ...archives].slice(0, MATCH_LOG_ARCHIVE_LIMIT));
            saveEntries([]);
        }
        setPlayers(prev => resetTodayGoals(prev || []));
        writeScores(0, 0);
        setTimerState({ isRunning: false, lastTick: Date.now(), accumulatedMs: 0 });
        changePeriod('前半', 0);
        setViewing('');
    };

    // 前後半を変える。ON AIR 中のタイマーにも反映（ms が null なら今の経過時刻のまま）
    const changePeriod = (period: string, ms: number | null) => {
        setTimerPeriod(period);
        if (timer.isVisible) {
            const state = syncedStateRef.current?.match_timer_state as TimerState | undefined;
            timer.update(buildTimerPayload(ms ?? getTimerMs(state), period));
        }
    };

    const describe = (e: MatchLogEntry) => {
        const head = `[${e.period} ${e.time}] ${LOG_TYPE_LABELS[e.type]}`;
        if (e.type === 'period') return `${head} ${e.event}`;
        const who = e.playerName ? `#${e.playerNumber} ${e.playerName}` : (e.type === 'goal' ? '(選手不明・OG)' : '');
        if (e.type === 'sub') return `${head} ${e.team} OUT #${e.playerNumber} ${e.playerName} → IN #${e.inPlayerNumber} ${e.inPlayerName}`;
        return `${head}${e.note ? `(${e.note})` : ''} ${e.team} ${who}`;
    };

    // ゴール行には、その時点のスコアを添える
    const viewEntries = viewing === '' ? entries : (archives[Number(viewing)]?.entries || []);
    const scoreAt = (idx: number) => {
        const upTo = viewEntries.slice(0, idx + 1);
        return `${teamGoals(upTo, oaLeftTeam)} - ${teamGoals(upTo, oaRightTeam)}`;
    };
    const rows = viewEntries.map((e, i) => ({ e, score: e.type === 'goal' ? scoreAt(i) : '' })).reverse();

    const playerOptions = (list: Player[]) => list.map(p => (
        <option key={p.id} value={p.id}>#{p.number} {p.name} ({p.position})</option>
    ));

    return (
        <div className="glass-panel" style={{ marginBottom: 20, padding: '14px 18px' }}>
            <div className="flex-between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                    📝 当日操作ログ <span style={{ fontSize: '0.8rem', color: '#aaa' }}>({entries.length}件)</span>
                </h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <select className="form-select" style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }} value={viewing} onChange={e => setViewing(e.target.value)}>
                        <option value="">当日ログ</option>
                        {archives.map((a, i) => (
                            <option key={a.savedAt} value={String(i)}>
                                過去: {new Date(a.savedAt).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} {a.title} ({a.entries.length}件)
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={handleRestore} disabled={entries.length === 0}
                        title="当日ログの得点・ゴール数・前後半で CGOperation を更新します">
                        📥 ログから復元
                    </button>
                    <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={handleReset}
                        title="小得点 0-0・タイマー 0:00・前半に戻します（当日ログは過去ログに保管）">
                        🔄 初期状態にする
                    </button>
                </div>
            </div>

            {/* 入力フォーム */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                <select className="form-select" style={{ width: 130 }} value={type} onChange={e => setType(e.target.value as MatchLogType)}>
                    {(Object.keys(LOG_TYPE_LABELS) as MatchLogType[]).map(t => <option key={t} value={t}>{LOG_TYPE_LABELS[t]}</option>)}
                </select>
                <input className="form-input" style={{ width: 110 }} placeholder="時刻(自動)" value={timeInput} onChange={e => setTimeInput(e.target.value)}
                    title="空欄なら現在のタイマー時刻で記録します" />
                {type === 'period' ? (
                    <select className="form-select" style={{ width: 160 }} value={periodEvent} onChange={e => setPeriodEvent(e.target.value)}>
                        {PERIOD_EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                    </select>
                ) : (
                    <>
                        <select className="form-select" style={{ width: 140 }} value={team} onChange={e => { setTeamInput(e.target.value); setPlayerId(''); setInPlayerId(''); }}>
                            <option value={oaLeftTeam}>⬅️ {oaLeftTeam}</option>
                            <option value={oaRightTeam}>➡️ {oaRightTeam}</option>
                        </select>
                        <select className="form-select" style={{ flex: '1 1 180px', minWidth: 160 }} value={playerId} onChange={e => setPlayerId(e.target.value)}>
                            <option value="">{type === 'goal' ? '-- 選手不明・OG --' : type === 'sub' ? '-- OUT 選手 --' : '-- 選手 --'}</option>
                            {playerOptions(teamPlayers)}
                        </select>
                        {type === 'sub' && (
                            <select className="form-select" style={{ flex: '1 1 180px', minWidth: 160 }} value={inPlayerId} onChange={e => setInPlayerId(e.target.value)}>
                                <option value="">-- IN 選手 --</option>
                                {playerOptions(teamPlayers.filter(p => p.id !== playerId))}
                            </select>
                        )}
                    </>
                )}
                <button className="btn btn-success" style={{ fontWeight: 'bold' }} onClick={handleAdd} disabled={viewing !== ''}>
                    ＋ 記録
                </button>
            </div>

            {/* ログ一覧（新しい順・5行分の高さでスクロール） */}
            <div style={{ height: LOG_ROW_HEIGHT * LOG_VISIBLE_ROWS, overflowY: 'auto', background: 'rgba(0,0,0,0.25)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                {rows.length === 0 && (
                    <div style={{ padding: '6px 10px', fontSize: '0.85rem', color: '#777' }}>記録はまだありません</div>
                )}
                {rows.map(({ e, score }) => (
                    <div key={e.id} style={{ height: LOG_ROW_HEIGHT, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', color: e.type === 'goal' ? '#ffca28' : undefined }}>{describe(e)}</span>
                        {score && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{oaLeftTeam} {score} {oaRightTeam}</span>}
                        {viewing === '' && (
                            <button className="btn btn-secondary" style={{ padding: '0 6px', fontSize: '0.75rem', lineHeight: '20px' }} onClick={() => handleDelete(e)} title="この記録を削除">✕</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
