import { useCallback } from 'react';
import { useSyncedState, useTelopHub } from '@sdk/TelopHubSDK';
import { useTelop } from './telop';
import { Player } from '../components/PlayerRegistry';
import { TimerState, getTimerMs } from '../components/GlobalTimerManager';
import {
    MATCH_LOG_KEY, MATCH_LOG_ARCHIVE_KEY, MatchLogEntry, MatchLogArchive, MatchLogDraft,
    dedupeKey, parseLogJson, teamGoals, teamCards, applyLogGoals, formatMatchTime, normalizeMatchTime, isMinuteOnlyInput
} from './matchLog';
import { StatsData, STATS_DATA_KEY, EMPTY_STATS } from './stats';

// 書き込んだ直後は共有ステートの反映が次の描画まで遅れるので、連続で記録しても前の記録を消さないよう手元に持つ
let lastWrite: { json: string, at: number } | null = null;
const LAST_WRITE_MS = 1500;
const LEGACY_LOG_KEY = 'match_log';
const LEGACY_ARCHIVE_KEY = 'match_log_archive';

/**
 * 当日操作ログの読み書き。Lineups のログ欄と CGOperation の操作から共通で使う。
 * ゴールを記録・削除すると、小得点/大得点のチーム得点と選手の Today/Total ゴールをログから数え直す。
 */
export function useMatchLog() {
    const { syncedStateRef } = useTelopHub();
    const [logJson, setLogJson] = useSyncedState<string | null>(MATCH_LOG_KEY, null);
    const [archiveJson, setArchiveJson] = useSyncedState<string | null>(MATCH_LOG_ARCHIVE_KEY, null);
    const [, setPlayers] = useSyncedState<Player[]>('roster', []);
    const smallScore = useTelop('小得点');
    const bigScore = useTelop('大得点');
    const statsTelop = useTelop('スタッツ');
    const [, setStatsData] = useSyncedState<StatsData>(STATS_DATA_KEY, EMPTY_STATS);

    // 旧形式（配列のまま保存していたころ）のログは、新形式で一度保存するまで引き継いで読む
    const [legacyLog] = useSyncedState<MatchLogEntry[]>(LEGACY_LOG_KEY, []);
    const [legacyArchive] = useSyncedState<MatchLogArchive[]>(LEGACY_ARCHIVE_KEY, []);
    const withLegacy = <T,>(json: unknown, legacy: unknown): T[] =>
        typeof json === 'string' ? parseLogJson<T>(json) : (Array.isArray(legacy) ? legacy : []);

    const entries = withLegacy<MatchLogEntry>(logJson, legacyLog);
    const archives = withLegacy<MatchLogArchive>(archiveJson, legacyArchive);

    const latestEntries = useCallback((): MatchLogEntry[] => {
        if (lastWrite && Date.now() - lastWrite.at < LAST_WRITE_MS) return parseLogJson<MatchLogEntry>(lastWrite.json);
        const s = syncedStateRef.current || {};
        return withLegacy<MatchLogEntry>(s[MATCH_LOG_KEY], s[LEGACY_LOG_KEY]);
    }, [syncedStateRef]);

    const saveEntries = useCallback((next: MatchLogEntry[]) => {
        const json = JSON.stringify(next);
        lastWrite = { json, at: Date.now() };
        setLogJson(json);
    }, [setLogJson]);

    const saveArchives = useCallback((next: MatchLogArchive[]) => setArchiveJson(JSON.stringify(next)), [setArchiveJson]);

    // 小得点・大得点のチーム得点をそろえる（ON AIR 中ならその場で UPDATE）
    const writeScores = useCallback((left: number, right: number) => {
        const scores = { '左チーム得点': String(left), '右チーム得点': String(right) };
        [smallScore, bigScore].forEach(t => {
            t.setData((prev: any) => ({ ...prev, ...scores }));
            if (t.isVisible) t.update({ ...(t.data || {}), ...scores });
        });
    }, [smallScore, bigScore]);

    const writeScoresFromLog = useCallback((log: MatchLogEntry[]) => {
        const s = syncedStateRef.current || {};
        writeScores(teamGoals(log, s.oa_left_team || '札幌創成'), teamGoals(log, s.oa_right_team || '帯広北'));
    }, [syncedStateRef, writeScores]);

    /**
     * スタッツ（GUI と CG）のイエロー・レッド・チーム得点をログから数え直す。
     * シュート・FK・CK は手入力のまま。スタッツ CG が ON AIR 中ならその場で UPDATE
     */
    const writeStatsFromLog = useCallback((log: MatchLogEntry[]) => {
        const s = syncedStateRef.current || {};
        const left = s.oa_left_team || '札幌創成';
        const right = s.oa_right_team || '帯広北';
        const cards = {
            leftYellow: String(teamCards(log, left, 'yellow')),
            rightYellow: String(teamCards(log, right, 'yellow')),
            leftRed: String(teamCards(log, left, 'red')),
            rightRed: String(teamCards(log, right, 'red'))
        };
        setStatsData(prev => ({ ...EMPTY_STATS, ...(prev || {}), ...cards }));
        if (!statsTelop.isVisible) return;
        const keys = {
            'Left得点数値': String(teamGoals(log, left)),
            'Right得点数値': String(teamGoals(log, right)),
            '左側イエロー数値': cards.leftYellow,
            '右側イエロー数値': cards.rightYellow,
            '左側レッド数値': cards.leftRed,
            '右側レッド数値': cards.rightRed
        };
        const payload = { ...(statsTelop.data || {}), ...keys };
        statsTelop.setData(payload);
        statsTelop.update(payload);
    }, [syncedStateRef, setStatsData, statsTelop]);

    // ログを保存し、ゴールが変わったときは選手のゴール数とチーム得点を、ゴール・カードが変わったときはスタッツを数え直す
    const commit = useCallback((next: MatchLogEntry[], changed: MatchLogEntry[]) => {
        saveEntries(next);
        if (changed.some(e => e.type === 'goal' || e.type === 'yellow' || e.type === 'red')) writeStatsFromLog(next);
        const goals = changed.filter(e => e.type === 'goal');
        if (goals.length === 0) return;
        const ids = new Set(goals.map(e => e.playerId).filter((id): id is string => !!id));
        if (ids.size > 0) setPlayers(prev => applyLogGoals(prev || [], next, ids));
        writeScoresFromLog(next);
    }, [saveEntries, setPlayers, writeScoresFromLog, writeStatsFromLog]);

    /**
     * 記録する。時刻を省いたら今のタイマー時刻、前後半は今の前後半で入る。
     * ゴール以外は、同じ内容がすでにあれば記録しない（CG の出し直し・キュー再送出で重ならない）
     */
    const record = useCallback((drafts: MatchLogDraft | MatchLogDraft[]) => {
        const list = Array.isArray(drafts) ? drafts : [drafts];
        const current = latestEntries();
        const seen = new Set(current.map(dedupeKey).filter(Boolean));
        const s = syncedStateRef.current || {};
        const added: MatchLogEntry[] = [];
        list.forEach(d => {
            const key = dedupeKey(d);
            if (key && seen.has(key)) return;
            if (key) seen.add(key);
            const typed = d.time ? normalizeMatchTime(d.time) : '';
            // 分だけで入れた時刻（"39"）は秒なしとして残す（大得点得点者で +1 しない）。タイマーの時刻は秒あり
            const minuteOnly = !!typed && (d.minuteOnly ?? isMinuteOnlyInput(d.time || ''));
            const { minuteOnly: _drop, ...rest } = d;
            added.push({
                ...rest,
                id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                at: Date.now(),
                period: d.period || s.match_timer_period || '前半',
                time: typed || formatMatchTime(getTimerMs(s.match_timer_state as TimerState | undefined)),
                ...(minuteOnly ? { minuteOnly: true } : {})
            });
        });
        if (added.length > 0) commit([...current, ...added], added);
        return added.length;
    }, [latestEntries, syncedStateRef, commit]);

    const remove = useCallback((entry: MatchLogEntry) => {
        commit(latestEntries().filter(e => e.id !== entry.id), [entry]);
    }, [latestEntries, commit]);

    /**
     * 記録を書き換える（時刻・選手などの修正）。並び順はそのまま。
     * 変更前・変更後のどちらかがゴールなら、関係する選手のゴール数とチーム得点を数え直す
     */
    const update = useCallback((next: MatchLogEntry) => {
        const current = latestEntries();
        const before = current.find(e => e.id === next.id);
        if (!before) return false;
        const typed = normalizeMatchTime(next.time || '');
        const { minuteOnly: _drop, ...rest } = next;
        // 時刻を分だけで入れ直したら秒なし、秒まで入れたら今まで通り（大得点得点者で +1）
        const minuteOnly = typed ? isMinuteOnlyInput(next.time || '') : !!before.minuteOnly;
        const fixed: MatchLogEntry = { ...rest, time: typed || before.time, ...(minuteOnly ? { minuteOnly: true } : {}) };
        commit(current.map(e => (e.id === next.id ? fixed : e)), [before, fixed]);
        return true;
    }, [latestEntries, commit]);

    return { entries, archives, record, remove, update, saveEntries, saveArchives, writeScores, writeStatsFromLog };
}

/** 選手からログの選手欄を作る */
export function playerFields(p?: Player | null) {
    return p ? { playerId: p.id, playerName: p.name, playerNumber: p.number } : {};
}

export function inPlayerFields(p?: Player | null) {
    return p ? { inPlayerId: p.id, inPlayerName: p.name, inPlayerNumber: p.number } : {};
}
