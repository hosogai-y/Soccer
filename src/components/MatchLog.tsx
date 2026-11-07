import React, { useState } from 'react';
import { useSyncedState, useTelop, useTelopHub } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { TimerState, nextTimerState } from './GlobalTimerManager';
import { buildTimerPeriodPayload } from '../utils/timerHelper';
import {
    MATCH_LOG_ARCHIVE_LIMIT, MatchLogEntry, MatchLogType,
    LOG_TYPE_LABELS, PERIOD_EVENTS, periodFromLog, teamGoals, applyLogGoals, resetTodayGoals
} from '../utils/matchLog';
import { useMatchLog, playerFields, inPlayerFields } from '../utils/useMatchLog';
import { TEAM_LINEUPS_KEY, TeamLineup, CLEARED_SUBBED_OUT } from '../utils/lineup';

const LOG_ROW_HEIGHT = 30;
const LOG_VISIBLE_ROWS = 5;

/** 初期状態にするときの確認文（Lineups の「Lineups を初期状態にする」と共通） */
export const resetSummary = (left: string, right: string, logCount: number) =>
    `・得点 0 - 0、タイマー 0:00（停止）、前半\n` +
    `・全選手の Today ゴールを 0 にし、Total を試合前の通算に戻します` +
    (logCount > 0 ? `\n・当日ログ（${logCount}件）は「${left} vs ${right}」として過去ログに保管して空にします` : '');

/**
 * 試合の初期化（得点 0-0・タイマー 0:00 停止・前半・Today ゴール 0・当日ログを過去ログへ退避）と前後半の切り替え。
 * MatchLog の「初期状態にする」と Lineups の「Lineups を初期状態にする」で使う。スタメン・控えには触れない
 */
export function useMatchReset() {
    const { syncedStateRef } = useTelopHub();
    const { entries, archives, saveEntries, saveArchives, writeScores } = useMatchLog();
    const [, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [, setTimerState] = useSyncedState<TimerState | null>('match_timer_state', null);
    const [, setTimerPeriod] = useSyncedState<string>('match_timer_period', '前半');
    const timer = useTelop('タイマー');

    // 前後半を変える。ON AIR 中のタイマーには前後半の画像だけ反映（時計は GlobalTimerManager が送る）
    const changePeriod = (period: string) => {
        setTimerPeriod(period);
        if (timer.isVisible) timer.update(buildTimerPeriodPayload(period));
    };

    const resetMatch = (left: string, right: string) => {
        if (entries.length > 0) {
            saveArchives([{ savedAt: Date.now(), title: `${left} vs ${right}`, entries }, ...archives].slice(0, MATCH_LOG_ARCHIVE_LIMIT));
            saveEntries([]);
        }
        setPlayers(prev => resetTodayGoals(prev || []));
        writeScores(0, 0);
        // 0:00 で停止（版を上げて、ON AIR 中のタイマーも合わせ直させる）
        setTimerState(nextTimerState(syncedStateRef.current?.match_timer_state as TimerState | undefined, { isRunning: false, lastTick: Date.now(), accumulatedMs: 0 }));
        changePeriod('前半');
    };

    return { resetMatch, changePeriod, logCount: entries.length };
}

/**
 * 当日の操作ログ（ゴール・カード・交代・前後半）。
 * CGOperation の送出操作でも自動で記録される（useMatchLog）。
 * 「ログから復元」「初期状態にする」で CGOperation の得点・ゴール数・前後半をそろえる。
 */
export default function MatchLog({ oaLeftTeam, oaRightTeam }: { oaLeftTeam: string, oaRightTeam: string }) {
    const { entries, archives, record, remove, update, writeScores } = useMatchLog();
    const { resetMatch, changePeriod } = useMatchReset();
    // ダブルクリックで開く編集ダイアログの対象（当日ログのみ）
    const [editing, setEditing] = useState<MatchLogEntry | null>(null);
    const [players, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [, setTeamLineups] = useSyncedState<Record<string, TeamLineup>>(TEAM_LINEUPS_KEY, {});

    // 入力フォーム
    const [type, setType] = useState<MatchLogType>('goal');
    const [teamInput, setTeamInput] = useState<string>('');
    const [playerId, setPlayerId] = useState('');
    const [inPlayerId, setInPlayerId] = useState('');
    const [periodEvent, setPeriodEvent] = useState(PERIOD_EVENTS[0]);
    const [timeInput, setTimeInput] = useState('');
    // ゴールを PK で決めたか（大得点得点者に "(P)" を付ける）
    const [pkInput, setPkInput] = useState(false);
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
                : { team, ...playerFields(findPlayer(playerId)), ...(type === 'sub' ? inPlayerFields(findPlayer(inPlayerId)) : {}) }),
            ...(type === 'goal' && pkInput ? { pk: true } : {})
        });
        if (added === 0) {
            alert('同じ内容がすでに記録されています。');
            return;
        }
        setPlayerId('');
        setInPlayerId('');
        setTimeInput('');
        setPkInput(false);
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
        if (period) changePeriod(period);
    };

    // 初期状態: 小得点 0-0・タイマー 0:00・前半、Today ゴール 0。当日ログは過去ログへ退避
    const handleReset = () => {
        if (!window.confirm(
            `CGOperation を初期状態にしますか？\n` +
            resetSummary(oaLeftTeam, oaRightTeam, entries.length) + '\n' +
            `・${oaLeftTeam}・${oaRightTeam} の交代済み（グレー表示）を解除します`
        )) return;
        resetMatch(oaLeftTeam, oaRightTeam);
        // 交代済みの印を外す（スタメン・控えの並びはそのまま）
        setTeamLineups(prev => {
            const next = { ...(prev || {}) };
            [oaLeftTeam, oaRightTeam].forEach(team => {
                if (next[team]) next[team] = { ...next[team], subbedOut: CLEARED_SUBBED_OUT };
            });
            return next;
        });
        setViewing('');
    };

    const describe = (e: MatchLogEntry) => {
        const head = `[${e.period} ${e.time}] ${LOG_TYPE_LABELS[e.type]}`;
        if (e.type === 'period') return `${head} ${e.event}`;
        const who = e.playerName ? `#${e.playerNumber} ${e.playerName}` : (e.type === 'goal' ? '(選手不明・OG)' : '');
        if (e.type === 'sub') return `${head} ${e.team} OUT #${e.playerNumber} ${e.playerName} → IN #${e.inPlayerNumber} ${e.inPlayerName}`;
        return `${head}${e.pk ? '(PK)' : ''}${e.note ? `(${e.note})` : ''} ${e.team} ${who}`;
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
                {type === 'goal' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', cursor: 'pointer' }} title="PK で決めたゴール（大得点得点者に (P) を付けます）">
                        <input type="checkbox" checked={pkInput} onChange={e => setPkInput(e.target.checked)} /> PK
                    </label>
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
                    <div key={e.id}
                        onDoubleClick={() => viewing === '' && setEditing(e)}
                        title={viewing === '' ? 'ダブルクリックで編集（時刻・選手など）' : undefined}
                        style={{ height: LOG_ROW_HEIGHT, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap', cursor: viewing === '' ? 'pointer' : undefined, userSelect: 'none' }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', color: e.type === 'goal' ? '#ffca28' : undefined }}>{describe(e)}</span>
                        {score && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{oaLeftTeam} {score} {oaRightTeam}</span>}
                        {viewing === '' && (
                            <button className="btn btn-secondary" style={{ padding: '0 6px', fontSize: '0.75rem', lineHeight: '20px' }} onClick={() => handleDelete(e)} title="この記録を削除">✕</button>
                        )}
                    </div>
                ))}
            </div>

            {editing && (
                <LogEditDialog
                    entry={editing}
                    players={players || []}
                    teams={[oaLeftTeam, oaRightTeam]}
                    onCancel={() => setEditing(null)}
                    onSave={next => {
                        if (!update(next)) alert('この記録は見つかりませんでした（別の端末で削除された可能性があります）。');
                        setEditing(null);
                    }}
                />
            )}
        </div>
    );
}

// --------------------------------------------------------
// 当日操作ログの編集ダイアログ（ダブルクリックで開く）。種類はそのまま、前後半・時刻・チーム・選手を直す
// --------------------------------------------------------

const PERIOD_OPTIONS = ['前半', '後半', '延長前半', '延長後半'];

function LogEditDialog({ entry, players, teams, onCancel, onSave }: {
    entry: MatchLogEntry,
    players: Player[],
    teams: string[],
    onCancel: () => void,
    onSave: (next: MatchLogEntry) => void
}) {
    const [period, setPeriod] = useState(entry.period);
    const [time, setTime] = useState(entry.time);
    const [event, setEvent] = useState(entry.event || PERIOD_EVENTS[0]);
    const [team, setTeam] = useState(entry.team || teams[0] || '');
    const [playerId, setPlayerId] = useState(entry.playerId || '');
    const [inPlayerId, setInPlayerId] = useState(entry.inPlayerId || '');
    const [pk, setPk] = useState(!!entry.pk);

    const isPeriod = entry.type === 'period';
    const isSub = entry.type === 'sub';
    // 今の OA チームに、記録のチーム（別の試合のチームなど）も選べるように足す
    const teamOptions = Array.from(new Set([...teams, entry.team || ''].filter(Boolean)));
    const teamPlayers = players
        .filter(p => p.schoolName === team)
        .sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));
    const periodOptions = PERIOD_OPTIONS.includes(period) ? PERIOD_OPTIONS : [period, ...PERIOD_OPTIONS];
    const eventOptions = PERIOD_EVENTS.includes(event) ? PERIOD_EVENTS : [event, ...PERIOD_EVENTS];

    // 選手が名簿から消えていても、選び直していなければ記録の名前・背番号を残す
    const fieldsFor = (id: string, prevId?: string, prevName?: string, prevNumber?: string) => {
        const p = id ? players.find(x => x.id === id) : undefined;
        if (p) return { id: p.id, name: p.name, number: p.number };
        if (id && id === prevId) return { id, name: prevName, number: prevNumber };
        return { id: undefined, name: undefined, number: undefined };
    };

    const handleSave = () => {
        if (!time.trim()) {
            alert('時刻を入力してください。');
            return;
        }
        if (isSub && (!playerId || !inPlayerId)) {
            alert('交代は OUT と IN の選手を選んでください。');
            return;
        }
        if ((entry.type === 'yellow' || entry.type === 'red') && !playerId) {
            alert('カードの選手を選んでください。');
            return;
        }
        if (isPeriod) {
            onSave({ ...entry, period, time, event });
            return;
        }
        const out = fieldsFor(playerId, entry.playerId, entry.playerName, entry.playerNumber);
        const inn = fieldsFor(inPlayerId, entry.inPlayerId, entry.inPlayerName, entry.inPlayerNumber);
        onSave({
            ...entry, period, time, team,
            playerId: out.id, playerName: out.name, playerNumber: out.number,
            ...(isSub ? { inPlayerId: inn.id, inPlayerName: inn.name, inPlayerNumber: inn.number } : {}),
            ...(entry.type === 'goal' ? { pk: pk || undefined } : {})
        });
    };

    const playerOptions = (list: Player[], selectedId: string, fallbackName?: string, fallbackNumber?: string) => (
        <>
            {/* 名簿にいない（削除された・チームが違う）選手が選ばれているときも表示できるようにする */}
            {selectedId && !list.some(p => p.id === selectedId) && (
                <option value={selectedId}>#{fallbackNumber} {fallbackName}（名簿外）</option>
            )}
            {list.map(p => <option key={p.id} value={p.id}>#{p.number} {p.name} ({p.position})</option>)}
        </>
    );

    const labelStyle: React.CSSProperties = { fontSize: '0.8rem', color: '#aaa', width: 72, flexShrink: 0 };
    const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 };

    return (
        <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div className="glass-panel" onClick={e => e.stopPropagation()}
                onKeyDown={e => {
                    if (e.key === 'Escape') onCancel();
                    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') handleSave();
                }}
                style={{ width: 'min(480px, 100%)', padding: '18px 20px', background: '#1c1f2b' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '1rem' }}>
                    ✏️ ログの編集 <span style={{ fontSize: '0.85rem', color: '#ffca28' }}>{LOG_TYPE_LABELS[entry.type]}</span>
                </h3>

                <div style={rowStyle}>
                    <span style={labelStyle}>前後半</span>
                    <select className="form-select" value={period} onChange={e => setPeriod(e.target.value)} style={{ flex: 1 }}>
                        {periodOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>時刻</span>
                    <input className="form-input" value={time} onChange={e => setTime(e.target.value)} placeholder="例: 23:15" style={{ flex: 1 }} autoFocus />
                </div>

                {isPeriod ? (
                    <div style={rowStyle}>
                        <span style={labelStyle}>内容</span>
                        <select className="form-select" value={event} onChange={e => setEvent(e.target.value)} style={{ flex: 1 }}>
                            {eventOptions.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                        </select>
                    </div>
                ) : (
                    <>
                        <div style={rowStyle}>
                            <span style={labelStyle}>チーム</span>
                            <select className="form-select" value={team} onChange={e => { setTeam(e.target.value); setPlayerId(''); setInPlayerId(''); }} style={{ flex: 1 }}>
                                {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div style={rowStyle}>
                            <span style={labelStyle}>{isSub ? 'OUT 選手' : '選手'}</span>
                            <select className="form-select" value={playerId} onChange={e => setPlayerId(e.target.value)} style={{ flex: 1, minWidth: 0 }}>
                                <option value="">{entry.type === 'goal' ? '-- 選手不明・OG --' : '-- 選手 --'}</option>
                                {playerOptions(teamPlayers, playerId, entry.playerName, entry.playerNumber)}
                            </select>
                        </div>
                        {isSub && (
                            <div style={rowStyle}>
                                <span style={labelStyle}>IN 選手</span>
                                <select className="form-select" value={inPlayerId} onChange={e => setInPlayerId(e.target.value)} style={{ flex: 1, minWidth: 0 }}>
                                    <option value="">-- IN 選手 --</option>
                                    {playerOptions(teamPlayers.filter(p => p.id !== playerId), inPlayerId, entry.inPlayerName, entry.inPlayerNumber)}
                                </select>
                            </div>
                        )}
                    </>
                )}

                {entry.type === 'goal' && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>PK</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={pk} onChange={e => setPk(e.target.checked)} />
                            PK で決めたゴール（大得点得点者に (P) を付けます）
                        </label>
                    </div>
                )}

                {entry.type === 'goal' && (
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: 10 }}>
                        ※ゴールの選手・チームを変えると、選手の Today/Total ゴールとチーム得点を数え直します
                    </div>
                )}

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={onCancel}>キャンセル</button>
                    <button className="btn btn-success" style={{ fontWeight: 'bold' }} onClick={handleSave}>保存</button>
                </div>
            </div>
        </div>
    );
}
