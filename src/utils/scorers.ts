import type { Player } from '../components/PlayerRegistry';
import type { MatchLogEntry } from './matchLog';

/**
 * 大得点得点者テロップの得点者履歴。
 * 当日操作ログのゴールから、チームごとに「選手名」と「前半12分 後半5分(P)」のような得点時間の一覧を作る。
 */

export const SCORER_TELOP = '大得点得点者';
export const SCORER_ROWS = 4;
// 大得点 TAKE で得点者込みのテロップを出すか（CGOperation のチェックボックス）
export const BIG_SCORE_WITH_SCORERS_KEY = 'big_score_with_scorers';
// 得点者の表示ページ（0 = 最新の 4 人。カットチェンジで次の 4 人）
export const SCORER_PAGE_KEY = 'scorer_page';
// 前後半・延長の 1 本の長さ（分）。得点時間を「前後半の中の何分か」と「アディショナル（+）」に分けるのに使う
export const PERIOD_MINUTES_KEY = 'match_period_minutes';

export type PeriodMinutes = { half: number; extra: number };
export const DEFAULT_PERIOD_MINUTES: PeriodMinutes = { half: 40, extra: 10 };

const PERIOD_ORDER = ['前半', '後半', '延長前半', '延長後半'];

/** "23:15" → 秒 */
function toSeconds(time: string): number {
    const [m, s] = (time || '0:00').split(':').map(n => parseInt(n, 10) || 0);
    return m * 60 + s;
}

/**
 * タイマーは前半 0:00 からの通し時間（後半は 前後半の長さ から、延長前半は 2 本分から…）として、
 * 前後半の中の分（1 分目 = 0:00〜0:59。分だけで入れた記録は入れた分）を求める。長さを超えた分はアディショナルとして「40+2」と書く。
 * 前後半ごとにタイマーを 0:00 に戻している記録（通し時間より小さい）は、そのままの分を使う
 */
export function goalMinuteLabel(e: Pick<MatchLogEntry, 'period' | 'time' | 'minuteOnly'>, lengths: PeriodMinutes): string {
    const period = e.period || '前半';
    // 秒まで入れた時刻（タイマー・"39:20"）は 39:00〜39:59 を 40 分目とする。分だけで入れた（"39"）ときはその分のまま
    const minuteTotal = Math.floor(toSeconds(e.time) / 60) + (e.minuteOnly ? 0 : 1);
    const isExtra = period.startsWith('延長');
    const length = isExtra ? lengths.extra : lengths.half;
    const base = period === '後半' ? lengths.half
        : period === '延長前半' ? lengths.half * 2
        : period === '延長後半' ? lengths.half * 2 + lengths.extra
        : 0;
    let minute = minuteTotal - base;
    if (minute < 1) minute = minuteTotal;
    const label = minute > length ? `${length}+${minute - length}` : String(minute);
    return `${period}${label}分`;
}

export type ScorerLine = {
    key: string;          // 選手 id（オウンゴール・選手不明はゴールごと）
    name: string;         // フルネーム
    times: string;        // 例: "前半12分 後半5分(P)"
    lastOrder: number;    // いちばん新しいゴールの並び順（大きいほど新しい）
};

/** ゴールの時間順（前後半 → 時刻 → ログの順） */
function goalOrder(e: MatchLogEntry, index: number): number {
    const p = PERIOD_ORDER.indexOf(e.period);
    return (p < 0 ? 0 : p) * 1e7 + toSeconds(e.time) * 100 + Math.min(index, 99);
}

/**
 * チームの得点者一覧（新しくゴールした選手が先）。
 * 同じ選手の複数得点は 1 行にまとめ、得点時間を古い順に並べる
 */
export function scorerLines(entries: MatchLogEntry[], team: string, players: Player[], lengths: PeriodMinutes): ScorerLine[] {
    const goals = entries
        .map((e, i) => ({ e, order: goalOrder(e, i) }))
        .filter(({ e }) => e.type === 'goal' && e.team === team)
        .sort((a, b) => a.order - b.order);

    const lines = new Map<string, ScorerLine & { parts: string[] }>();
    goals.forEach(({ e, order }) => {
        const key = e.playerId || `og_${e.id}`;
        const player = e.playerId ? players.find(p => p.id === e.playerId) : undefined;
        const name = player?.name || e.playerName || 'オウンゴール';
        const part = goalMinuteLabel(e, lengths) + (e.pk ? '(P)' : '');
        const line = lines.get(key);
        if (line) {
            line.parts.push(part);
            line.lastOrder = order;
        } else {
            lines.set(key, { key, name, times: '', lastOrder: order, parts: [part] });
        }
    });

    return Array.from(lines.values())
        .map(({ parts, ...line }) => ({ ...line, times: parts.join(' ') }))
        .sort((a, b) => b.lastOrder - a.lastOrder);
}

/** ページ数（どちらかのチームが 5 人以上なら 2 ページ目がある） */
export function scorerPageCount(left: ScorerLine[], right: ScorerLine[]): number {
    return Math.max(1, Math.ceil(left.length / SCORER_ROWS), Math.ceil(right.length / SCORER_ROWS));
}

/**
 * テロップの行のキー。1 ページ 4 人で、行は下詰め（2 人なら 3・4 行目）、上の行ほど新しい得点者
 */
export function scorerRowKeys(left: ScorerLine[], right: ScorerLine[], page: number): Record<string, string> {
    const data: Record<string, string> = {};
    const fill = (side: '左' | '右', lines: ScorerLine[]) => {
        const shown = lines.slice(page * SCORER_ROWS, page * SCORER_ROWS + SCORER_ROWS);
        for (let n = 1; n <= SCORER_ROWS; n++) {
            const line = shown[n - 1 - (SCORER_ROWS - shown.length)];
            data[`${side}得点者${n}`] = line?.name || '';
            data[`${side}得点時間${n}`] = line?.times || '';
        }
    };
    fill('左', left);
    fill('右', right);
    return data;
}
