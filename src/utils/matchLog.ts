import { Player } from '../components/PlayerRegistry';

// 当日の操作ログ（Lineups 画面と CGOperation の操作で記録し、得点・選手のゴール数の元データになる）
// SDK の状態マージは空配列で既存の配列を上書きしないため、キューと同じく JSON 文字列で保存する
export const MATCH_LOG_KEY = 'match_log_json';
// 「初期状態にする」で退避した過去のログ（新しい順）
export const MATCH_LOG_ARCHIVE_KEY = 'match_log_archive_json';
export const MATCH_LOG_ARCHIVE_LIMIT = 20;

export type MatchLogType = 'goal' | 'yellow' | 'red' | 'sub' | 'period';

export type MatchLogEntry = {
    id: string;
    at: number;           // 記録した日時 (Date.now())
    period: string;       // 記録時の前後半 (match_timer_period)
    time: string;         // 試合時間 (例: "23:15")
    type: MatchLogType;
    team?: string;        // 学校名（period 以外）
    playerId?: string;    // ゴール・カードの選手 / 交代で OUT の選手（ゴールで空なら選手不明・OG）
    playerName?: string;
    playerNumber?: string;
    inPlayerId?: string;  // 交代で IN の選手
    inPlayerName?: string;
    inPlayerNumber?: string;
    event?: string;       // period のときの内容 (例: "後半開始")
    note?: string;        // 補足 (例: イエローの "2枚目")
};

/** 記録する内容（id・日時・前後半・時刻は記録時に入る） */
export type MatchLogDraft = Omit<MatchLogEntry, 'id' | 'at' | 'period' | 'time'> & { time?: string, period?: string };

/**
 * CG の出し直し・キューからの再送出で同じ記録が重ならないよう、同じ出来事かを見るキー。
 * ゴールは同じ選手が何度も決めるので重複扱いしない（null）
 */
export function dedupeKey(e: MatchLogDraft): string | null {
    if (e.type === 'goal') return null;
    return [e.type, e.team || '', e.playerId || '', e.inPlayerId || '', e.event || '', e.note || ''].join('|');
}

export function parseLogJson<T>(json: unknown): T[] {
    if (typeof json !== 'string') return [];
    try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export type MatchLogArchive = {
    savedAt: number;
    title: string;        // 例: "札幌大谷 vs 北海"
    entries: MatchLogEntry[];
};

export const LOG_TYPE_LABELS: Record<MatchLogType, string> = {
    goal: '⚽ ゴール',
    yellow: '🟨 イエロー',
    red: '🟥 レッド',
    sub: '🔄 交代',
    period: '⏱ 前後半'
};

export const PERIOD_EVENTS = [
    '前半開始', '前半終了', '後半開始', '後半終了',
    '延長前半開始', '延長前半終了', '延長後半開始', '延長後半終了',
    'PK戦開始', '試合終了'
];

// 前後半イベント → タイマーの前後半 (match_timer_period)。試合終了・PK戦は前後半を変えない
const EVENT_TO_PERIOD: Record<string, string> = {
    '前半開始': '前半', '前半終了': '前半',
    '後半開始': '後半', '後半終了': '後半',
    '延長前半開始': '延長前半', '延長前半終了': '延長前半',
    '延長後半開始': '延長後半', '延長後半終了': '延長後半'
};

/** ログの最後の前後半イベントから前後半を求める（なければ null） */
export function periodFromLog(log: MatchLogEntry[]): string | null {
    for (let i = log.length - 1; i >= 0; i--) {
        const p = log[i].type === 'period' ? EVENT_TO_PERIOD[log[i].event || ''] : undefined;
        if (p) return p;
    }
    return null;
}

/** チームごとのゴール数 */
export function teamGoals(log: MatchLogEntry[], team: string): number {
    return log.filter(e => e.type === 'goal' && e.team === team).length;
}

/** 選手ごとの Today ゴール数 */
export function playerGoals(log: MatchLogEntry[], playerId: string): number {
    return log.filter(e => e.type === 'goal' && e.playerId === playerId).length;
}

const toNum = (s?: string) => parseInt(s || '0', 10) || 0;

/** 試合前の通算ゴール。未保存なら今の Total − Today から求める */
export function baseGoalsOf(p: Player): number {
    if (p.baseTotalGoals !== undefined && p.baseTotalGoals !== '') return toNum(p.baseTotalGoals);
    return Math.max(0, toNum(p.totalGoals) - toNum(p.todayGoals));
}

/**
 * ログから選手の Today ゴールを数え直し、Total = 試合前の通算 + Today にする。
 * ids を渡したときはその選手だけ（手入力した他の選手のゴール数は触らない）
 */
export function applyLogGoals(players: Player[], log: MatchLogEntry[], ids?: Set<string>): Player[] {
    return players.map(p => {
        if (ids && !ids.has(p.id)) return p;
        const base = baseGoalsOf(p);
        const today = playerGoals(log, p.id);
        return { ...p, baseTotalGoals: String(base), todayGoals: String(today), totalGoals: String(base + today) };
    });
}

/** 全選手の Today ゴールを 0 にし、Total を試合前の通算に戻す */
export function resetTodayGoals(players: Player[]): Player[] {
    return players.map(p => {
        const base = baseGoalsOf(p);
        return { ...p, baseTotalGoals: String(base), todayGoals: '0', totalGoals: String(base) };
    });
}

/** "２３：１５" や "23" を "23:15" / "23:00" にそろえる */
export function normalizeMatchTime(input: string): string {
    const s = input.trim()
        .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
        .replace(/[：]/g, ':');
    if (/^\d+$/.test(s)) return `${parseInt(s, 10)}:00`;
    return s;
}

/** タイマーの経過 ms を "m:ss" に */
export function formatMatchTime(ms: number): string {
    const total = Math.floor(Math.max(0, ms) / 1000);
    const s = total % 60;
    return `${Math.floor(total / 60)}:${s < 10 ? '0' : ''}${s}`;
}
