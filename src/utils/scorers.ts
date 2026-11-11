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
// 得点者の表示ページ（0 = 最新の 4 件。カットチェンジで次の 4 件）
export const SCORER_PAGE_KEY = 'scorer_page';
// 前後半・延長の 1 本の長さ（分）。得点時間を「前後半の中の何分か」と「アディショナル（+）」に分けるのに使う
export const PERIOD_MINUTES_KEY = 'match_period_minutes';

/**
 * 得点時間の表記。
 * half: 前後半ごと（後半 1〜40 分。「後半12分」「後半40分+2」）
 * total: 通し（後半 41〜80 分。「後半52分」「後半80分+2」。プロなら 46〜90 分・「後半90分+5」）
 * totalPlain: 通しでアディショナルも足す（「後半83分」。プロなら「後半100分」）
 */
export type GoalTimeStyle = 'half' | 'total' | 'totalPlain';
export const GOAL_TIME_STYLE_LABELS: Record<GoalTimeStyle, string> = {
    half: '前後半ごと（後半12分・40分+2）',
    total: '通し（後半52分・80分+2）',
    totalPlain: '通し・AT加算（後半83分）'
};

export type PeriodMinutes = { half: number; extra: number; style?: GoalTimeStyle };
export const DEFAULT_PERIOD_MINUTES: PeriodMinutes = { half: 40, extra: 10, style: 'half' };

/** 試合形式のひな形（Lineups の試合時間設定） */
export const MATCH_FORMAT_PRESETS: { label: string, value: PeriodMinutes }[] = [
    { label: '高校（40分ハーフ・延長10分）', value: { half: 40, extra: 10 } },
    { label: 'プロ（45分ハーフ・延長15分）', value: { half: 45, extra: 15 } }
];

/** 保存値の欠けを既定値で埋める */
export function normalizePeriodMinutes(v?: Partial<PeriodMinutes> | null): Required<PeriodMinutes> {
    return {
        half: v?.half || DEFAULT_PERIOD_MINUTES.half,
        extra: v?.extra || DEFAULT_PERIOD_MINUTES.extra,
        style: v?.style && v.style in GOAL_TIME_STYLE_LABELS ? v.style : 'half'
    };
}

const PERIOD_ORDER = ['前半', '後半', '延長前半', '延長後半'];

/** "23:15" → 秒 */
function toSeconds(time: string): number {
    // 分だけの記録（"82"）は秒が無いので 0 秒として扱う
    const [m = 0, s = 0] = (time || '0:00').split(':').map(n => parseInt(n, 10) || 0);
    return m * 60 + s;
}

/** 前後半の始まりの通し時間（分）。後半 = 40、延長前半 = 80 … */
export function periodBase(period: string, lengths: PeriodMinutes): number {
    return period === '後半' ? lengths.half
        : period === '延長前半' ? lengths.half * 2
        : period === '延長後半' ? lengths.half * 2 + lengths.extra
        : 0;
}

/** 前後半 1 本の長さ（分） */
export function periodLength(period: string, lengths: PeriodMinutes): number {
    return period.startsWith('延長') ? lengths.extra : lengths.half;
}

/**
 * 記録の時刻を「前後半の中の分」と「アディショナル（分）」に分ける。
 * 時刻は前半 0:00 からの通し時間（後半は 前後半の長さ から、延長前半は 2 本分から…）として扱い、
 * 秒まで入れた時刻（タイマー・"39:20"）は 39:00〜39:59 を 40 分目、分だけで入れた（"39"）記録はその分のまま。
 * 長さを超えた分はアディショナル（タイマーが 40 分を過ぎても自動で 40+2 に分ける）。
 * 前後半ごとにタイマーを 0:00 に戻している記録（通し時間より小さい）は、そのままの分を使う
 */
export function goalMinuteParts(e: Pick<MatchLogEntry, 'period' | 'time' | 'minuteOnly'>, lengths: PeriodMinutes): { minute: number, added: number } {
    const period = e.period || '前半';
    const minuteTotal = Math.floor(toSeconds(e.time) / 60) + (e.minuteOnly ? 0 : 1);
    const length = periodLength(period, lengths);
    let minute = minuteTotal - periodBase(period, lengths);
    if (minute < 1) minute = minuteTotal;
    return minute > length ? { minute: length, added: minute - length } : { minute, added: 0 };
}

/** 分とアディショナルを表記に合わせた文字列にする（"12" / "40+2" / "52" / "80+2" / "83"） */
export function formatGoalMinute(period: string, minute: number, added: number, lengths: PeriodMinutes): string {
    const style = normalizePeriodMinutes(lengths).style;
    const offset = style === 'half' ? 0 : periodBase(period, lengths);
    if (style === 'totalPlain') return String(offset + minute + added);
    return added > 0 ? `${offset + minute}+${added}` : String(offset + minute);
}

/** 分とアディショナルを「分」付きで（"12分" / "40分+2" / "80分+2" / "83分"）。大得点得点者・ログの表記 */
export function goalMinuteText(period: string, minute: number, added: number, lengths: PeriodMinutes): string {
    const style = normalizePeriodMinutes(lengths).style;
    const offset = style === 'half' ? 0 : periodBase(period, lengths);
    if (style === 'totalPlain' || added <= 0) return `${offset + minute + (style === 'totalPlain' ? added : 0)}分`;
    return `${offset + minute}分+${added}`;
}

/** 大得点得点者・ログに出す得点時間（例: "前半12分" "後半40分+2"。表記は lengths.style） */
export function goalMinuteLabel(e: Pick<MatchLogEntry, 'period' | 'time' | 'minuteOnly'>, lengths: PeriodMinutes): string {
    const period = e.period || '前半';
    const { minute, added } = goalMinuteParts(e, lengths);
    return `${period}${goalMinuteText(period, minute, added, lengths)}`;
}

// ---------------------------------------------------------------- 手入力の時刻 ⇔ 保存する通し時間

const toHalfWidth = (s: string) => s.trim()
    .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/[：]/g, ':')
    .replace(/[＋]/g, '+');

/**
 * 画面で入れた時刻（表記に合わせた分。"12" / "23:15" / "40+2" / "52"）とアディショナル（分）を、
 * 保存する通し時間の文字列にする（分だけなら "52"、秒まであれば "52:15"）。
 * 前後半ごと表記なら前後半の始まりを足す。長さを超えた分は自動でアディショナルになる（後半 "43" → 40+3）。
 * アディショナルを入れたときは、前後半の終わり + アディショナル（分だけ）で記録する。
 * 時刻が空ならそのまま空（記録時にタイマーの時刻が入る）
 */
export function inputToLogTime(period: string, input: string, added: number, lengths: PeriodMinutes): string {
    const style = normalizePeriodMinutes(lengths).style;
    const base = periodBase(period, lengths);
    const length = periodLength(period, lengths);
    let s = toHalfWidth(input).replace(/分$/, '').replace(/分\s*\+/, '+');
    // "40+2"・"40分+2" のようにアディショナルごと入れたとき
    const plus = /^(\d+)\s*\+\s*(\d+)$/.exec(s);
    if (plus) {
        added = Math.max(added, parseInt(plus[2], 10) || 0);
        s = plus[1];
    }
    if (added > 0) return String(base + length + added);
    if (!s) return '';
    const m = /^(\d+)(?::(\d{1,2}))?$/.exec(s);
    if (!m) return s; // 形式が違うものはそのまま（保存側で整える）
    // 前後半ごと表記・通しのアディショナル加算表記は、前後半の始まりを足す／そのまま
    const offset = style === 'half' ? base : 0;
    const minutes = parseInt(m[1], 10) + offset;
    return m[2] !== undefined ? `${minutes}:${m[2].padStart(2, '0')}` : String(minutes);
}

/**
 * 保存している記録を、編集欄に出す時刻（表記に合わせた分）とアディショナルに分ける（inputToLogTime の逆）。
 * アディショナルがあるときは時刻は前後半の終わり
 */
export function logTimeToInput(e: Pick<MatchLogEntry, 'period' | 'time' | 'minuteOnly'>, lengths: PeriodMinutes): { time: string, added: number } {
    const period = e.period || '前半';
    const style = normalizePeriodMinutes(lengths).style;
    const base = periodBase(period, lengths);
    const offset = style === 'half' ? 0 : base;
    const { minute, added } = goalMinuteParts(e, lengths);
    if (added > 0) return { time: String(offset + minute), added };
    if (e.minuteOnly) return { time: String(offset + minute), added: 0 };
    // 秒まである記録はそのまま（前後半ごと表記なら前後半の始まりを引く。タイマーを戻していた記録は引かない）
    const secs = toSeconds(e.time);
    const shown = style === 'half' && secs >= base * 60 ? secs - base * 60 : secs;
    return { time: `${Math.floor(shown / 60)}:${String(shown % 60).padStart(2, '0')}`, added: 0 };
}

/** ログ一覧に出す時刻（表記に合わせる。アディショナルは "40分+2"、分だけの記録は "39分"、ほかは "23:15"） */
export function logTimeLabel(e: Pick<MatchLogEntry, 'period' | 'time' | 'minuteOnly'>, lengths: PeriodMinutes): string {
    const period = e.period || '前半';
    const { minute, added } = goalMinuteParts(e, lengths);
    if (added > 0 || e.minuteOnly) return goalMinuteText(period, minute, added, lengths);
    return logTimeToInput(e, lengths).time;
}

export type ScorerLine = {
    key: string;          // ゴールごと（ログの id）
    name: string;         // フルネーム
    times: string;        // 例: "前半12分" "後半5分(P)"
    lastOrder: number;    // ゴールの並び順（大きいほど新しい）
};

/** ゴールの時間順（前後半 → 時刻 → ログの順） */
function goalOrder(e: MatchLogEntry, index: number): number {
    const p = PERIOD_ORDER.indexOf(e.period);
    return (p < 0 ? 0 : p) * 1e7 + toSeconds(e.time) * 100 + Math.min(index, 99);
}

/**
 * チームの得点者一覧（新しいゴールが先）。
 * 同じ選手の 2 点目以降も 1 行にまとめず、ほかの選手と同じようにゴールごとに新しい行で足す
 * （まとめると 3 点以上で時間の欄が詰まって読めないため）
 */
export function scorerLines(entries: MatchLogEntry[], team: string, players: Player[], lengths: PeriodMinutes): ScorerLine[] {
    return entries
        .map((e, i) => ({ e, order: goalOrder(e, i) }))
        .filter(({ e }) => e.type === 'goal' && e.team === team)
        .sort((a, b) => b.order - a.order)
        .map(({ e, order }) => {
            const player = e.playerId ? players.find(p => p.id === e.playerId) : undefined;
            return {
                key: `goal_${e.id}`,
                name: player?.name || e.playerName || 'オウンゴール',
                times: goalMinuteLabel(e, lengths) + (e.pk ? '(P)' : ''),
                lastOrder: order
            };
        });
}

/** ページ数（どちらかのチームが 5 点以上なら 2 ページ目がある） */
export function scorerPageCount(left: ScorerLine[], right: ScorerLine[]): number {
    return Math.max(1, Math.ceil(left.length / SCORER_ROWS), Math.ceil(right.length / SCORER_ROWS));
}

/**
 * テロップの行のキー。1 ページ 4 件（ゴールごと）で、行は下詰め（2 件なら 3・4 行目）、上の行ほど新しい得点者
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
