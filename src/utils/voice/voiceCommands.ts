/**
 * 音声送出の「1Shot 以外」の指示: 選手交代・気象（気温・湿度）・得点者。
 * 認識結果から中身を読み取って返すだけで、送出・記録はしない（確認カードで TAKE / Q登録 / ログに記録 を押す）。
 *
 * 言い方の例
 * - 交代: 「創成 13番アウト 20番イン」「13番に代わって20番」「アウト13 イン20 アウト7 イン15」（2 組で交代2枚）
 * - 気象: 「気温22.3度 湿度81パーセント」「気温は22度、湿度81」
 * - 得点: 「前半39分 創成 10番」「後半5分 浅田」「前半40分プラス2分 帯広北 9番 PK」
 */
import type { Player } from '../../components/PlayerRegistry';
import { kanaKey, normalizeDigits, kanaNumberAt } from './kana';
import { readingOf } from './reading';
import { parseUtterance, findSide, SideWords, PreparedTarget, VoiceCandidate } from './voiceMatch';

type Tokenizer = Parameters<typeof readingOf>[0];
export type Side = 'left' | 'right';

/** チームごとのスタメン・控え（交代の背番号を選手にするのに使う） */
export type SideRoster = { starters: Player[], subs: Player[], subbedOut: string[] };

export type VoiceSubPair = { outId: string, inId: string, outNo: string, inNo: string };
export type VoiceSubCommand = {
    kind: 'sub';
    side: Side;
    sideSure: boolean; // チームを言った・背番号から 1 チームに決まった（false = 直前のチームを仮に使っている）
    pairs: VoiceSubPair[]; // 1 組 = 交代1枚、2 組 = 交代2枚
    notes: string[]; // 確認してほしいこと
    transcript: string;
};
export type VoiceWeatherCommand = { kind: 'weather', temp: string | null, humidity: string | null, transcript: string };
export type VoiceGoalCommand = {
    kind: 'goal';
    period: string | null; // 言わなかったら null（今の前後半を使う）
    minute: number; // 前後半の中の分（言ったまま）
    plus: number; // アディショナル（「40分プラス2」の 2）
    side: Side | null;
    playerId: string; // '' = 選手不明・OG
    ownGoal: boolean;
    pk: boolean;
    candidates: VoiceCandidate[];
    transcript: string;
};
export type VoiceCommand = VoiceSubCommand | VoiceWeatherCommand | VoiceGoalCommand;

export type CommandContext = {
    targets: PreparedTarget[];
    tokenizer: Tokenizer;
    sideWords: SideWords;
    rosters: Record<Side, SideRoster>;
    lastSide: Side; // チームを言わなかったときに使うチーム
};

// 交代 2 組だと「札幌創成 13番アウト 20番イン 7番アウト 15番イン」で 30 字ほど
const MAX_COMMAND_CHARS = 80;

// ---------------------------------------------------------------- 文字の準備

/**
 * 読みがな（カタカナのキー）の中の数詞を、後ろに単位が続くときだけ数字にする。
 * 「ジュウサンバンアウト」→「13バンアウト」、「ニジュウニテンサンド」→「22テン3ド」
 * （「ゴール」の「ゴ」のように、単位が続かない字は数字にしない）
 */
const KANA_UNITS = ['バン', 'アウト', 'イン', 'ニカワツテ', 'カワツテ', 'カラ', 'ド', 'テン', 'パセント', 'フン', 'プン', 'ブン', 'プラス'];
export function kanaDigits(key: string): string {
    let out = '';
    for (let i = 0; i < key.length;) {
        const n = kanaNumberAt(key, i);
        if (n && KANA_UNITS.some(u => key.startsWith(u, i + n.length))) {
            out += String(n.value);
            i += n.length;
        } else {
            out += key[i];
            i++;
        }
    }
    return out;
}

type Texts = { raw: string, key: string, digits: string, kana: string };

function textsOf(transcript: string, tokenizer: Tokenizer, strip: string[] = []): Texts {
    let raw = transcript.normalize('NFKC').replace(/[\s　、。,]/g, '').slice(-MAX_COMMAND_CHARS);
    const key = kanaKey(readingOf(tokenizer, raw));
    // 学校名の中の数字（「札幌第一」）を背番号と取り違えないよう、学校名を除いてから数字を探す
    let digits = normalizeDigits(raw);
    let kana = kanaDigits(key);
    for (const w of strip.filter(w => w.length >= 2).sort((a, b) => b.length - a.length)) {
        digits = digits.split(normalizeDigits(w.normalize('NFKC'))).join('／');
        const k = kanaKey(readingOf(tokenizer, w));
        if (k.length >= 2) kana = kana.split(kanaDigits(k)).join('／');
    }
    raw = raw.trim();
    return { raw, key, digits, kana };
}

/** 2 つの書き方（表記・読み）の両方で探し、最初に当たったもの */
const firstMatch = (t: Texts, ...res: RegExp[]) => {
    for (const s of [t.digits, t.kana]) {
        for (const re of res) {
            const m = re.exec(s);
            if (m) return m;
        }
    }
    return null;
};

const decimal = (s: string) => s.replace(/点|テン/, '.');

// ---------------------------------------------------------------- 気象

const WEATHER_WORD = /気温|湿度|キオン|シツド/;

export function parseWeather(transcript: string, tokenizer: Tokenizer): VoiceWeatherCommand | null {
    const t = textsOf(transcript, tokenizer);
    if (!WEATHER_WORD.test(t.raw) && !WEATHER_WORD.test(t.key)) return null;
    const NUM = '(\\d{1,2}(?:(?:\\.|点|テン)\\d{1,2})?)';
    const SIGN = '(マイナス|-)?';
    const tm = firstMatch(t,
        new RegExp(`${SIGN}(\\d{1,2})度(\\d)分`), // 「22度3分」= 22.3 度
        new RegExp(`(?:気温|キオン)(?:は|ハ|が|ガ|:)?${SIGN}${NUM}`),
        new RegExp(`${SIGN}${NUM}(?:度|°C?|ド)`));
    let temp: string | null = null;
    if (tm) temp = `${tm[1] ? '-' : ''}${tm[3] !== undefined ? `${tm[2]}.${tm[3]}` : decimal(tm[2])}`;
    const hm = firstMatch(t,
        /(?:湿度|シツド)(?:は|ハ|が|ガ|:)?(\d{1,3})/,
        /(\d{1,3})(?:%|パーセント|パセント)/);
    const humidity = hm ? String(parseInt(hm[1], 10)) : null;
    return { kind: 'weather', temp, humidity, transcript };
}

// ---------------------------------------------------------------- 選手交代

const SUB_WORD = /アウト|OUT|交代|コウタイ|代わって|変わって|替わって|カワツテ/i;

type SubToken = { type: 'num', value: string } | { type: 'out' | 'in' | 'for' };

function subTokens(s: string): SubToken[] {
    const tokens: SubToken[] = [];
    const re = /(\d{1,3})(?:番|バン)?|(アウト|OUT)|(イン|IN)|(?:に|ニ)?(代わって|変わって|替わって|カワツテ)|(から|カラ)/gi;
    for (let m = re.exec(s); m; m = re.exec(s)) {
        if (m[1]) tokens.push({ type: 'num', value: String(parseInt(m[1], 10)) });
        else if (m[2]) tokens.push({ type: 'out' });
        else if (m[3]) tokens.push({ type: 'in' });
        else tokens.push({ type: 'for' }); // 「13番に代わって20番」「13番から20番」= 前が OUT、後ろが IN
    }
    return tokens;
}

/** 背番号の組（OUT, IN）を読む。「13アウト20イン」（後ろに付ける）と「アウト13イン20」（前に付ける）の両方 */
export function subNumberPairs(s: string): { out: string, in: string }[] {
    const tokens = subTokens(s);
    const firstNum = tokens.findIndex(t => t.type === 'num');
    const firstRole = tokens.findIndex(t => t.type === 'out' || t.type === 'in');
    const prefix = firstRole >= 0 && firstNum >= 0 && firstRole < firstNum;
    const pairs: { out: string, in: string }[] = [];
    let cur: { out?: string, in?: string } = {};
    const flush = () => {
        if (cur.out && cur.in) pairs.push({ out: cur.out, in: cur.in });
        cur = {};
    };
    tokens.forEach((t, i) => {
        if (t.type !== 'num') return;
        const prev = tokens[i - 1];
        const next = tokens[i + 1];
        let role: 'out' | 'in' | null = null;
        if (prev?.type === 'for') role = 'in';
        else if (next?.type === 'for') role = 'out';
        else if (prefix && (prev?.type === 'out' || prev?.type === 'in')) role = prev.type;
        else if (!prefix && (next?.type === 'out' || next?.type === 'in')) role = next.type;
        if (!role) role = cur.out === undefined ? 'out' : 'in'; // 役割を言わなかったら OUT → IN の順
        if (cur[role] !== undefined) flush();
        cur[role] = t.value;
        if (cur.out && cur.in) flush();
    });
    flush();
    return pairs.slice(0, 2);
}

const byNumber = (list: Player[], no: string) => list.find(p => String(parseInt(p.number, 10)) === no);

/** そのチームで背番号を選手にする。OUT はスタメン優先、IN は（交代済みでない）控え優先 */
function resolvePair(roster: SideRoster, pair: { out: string, in: string }) {
    const availableSubs = roster.subs.filter(p => !roster.subbedOut.includes(p.id));
    const out = byNumber(roster.starters, pair.out) || byNumber(roster.subs, pair.out);
    const inP = byNumber(availableSubs, pair.in) || byNumber(roster.subs, pair.in) || byNumber(roster.starters, pair.in);
    // スタメンから OUT・控えから IN が普通。そうでない組は点を下げる
    const score = (out ? (roster.starters.includes(out) ? 2 : 1) : 0) + (inP ? (availableSubs.includes(inP) ? 2 : 1) : 0);
    return { out, inP, score };
}

export function parseSub(transcript: string, ctx: CommandContext): VoiceSubCommand | null {
    const strip = [...ctx.sideWords.left, ...ctx.sideWords.right];
    const t = textsOf(transcript, ctx.tokenizer, strip);
    if (!SUB_WORD.test(t.raw) && !SUB_WORD.test(t.key)) return null;
    // 「交代2枚」の 2 は背番号ではない
    const noCount = (x: string) => x.replace(/\d枚目?|\dマイ/g, '／');
    let numberPairs = subNumberPairs(noCount(t.digits));
    if (numberPairs.length === 0) numberPairs = subNumberPairs(noCount(t.kana));

    const said = findSide(t.raw, t.key, ctx.sideWords).side;
    const notes: string[] = [];
    let side: Side = said || ctx.lastSide;
    let sideSure = !!said;
    if (!said && numberPairs.length > 0) {
        const total = (s: Side) => numberPairs.reduce((sum, p) => sum + resolvePair(ctx.rosters[s], p).score, 0);
        const l = total('left');
        const r = total('right');
        if (l !== r) { side = l > r ? 'left' : 'right'; sideSure = true; }
    }
    if (!sideSure) notes.push('チーム名を聞き取れなかったので、直前のチームにしています');

    const roster = ctx.rosters[side];
    const pairs: VoiceSubPair[] = numberPairs.map(p => {
        const { out, inP } = resolvePair(roster, p);
        if (!out) notes.push(`OUT ${p.out}番 がいません`);
        if (!inP) notes.push(`IN ${p.in}番 がいません`);
        if (out && !roster.starters.includes(out)) notes.push(`OUT ${p.out}番 はスタメンではありません`);
        if (inP && roster.subbedOut.includes(inP.id)) notes.push(`IN ${p.in}番 は交代済みです`);
        return { outId: out?.id || '', inId: inP?.id || '', outNo: p.out, inNo: p.in };
    });
    if (pairs.length === 0) {
        notes.push('背番号を聞き取れませんでした。選手を選んでください');
        pairs.push({ outId: '', inId: '', outNo: '', inNo: '' });
    }
    return { kind: 'sub', side, sideSure, pairs, notes, transcript };
}

// ---------------------------------------------------------------- 得点者

const PERIOD_WORDS: [RegExp, string][] = [
    [/延長前半|エンチヨウゼンハン/, '延長前半'],
    [/延長後半|エンチヨウコウハン/, '延長後半'],
    [/前半|ゼンハン/, '前半'],
    [/後半|コウハン/, '後半']
];
const MIN = '(?:分|フン|プン|ブン)';

export function parseGoal(transcript: string, ctx: CommandContext): VoiceGoalCommand | null {
    const t = textsOf(transcript, ctx.tokenizer);
    const period = PERIOD_WORDS.find(([re]) => re.test(t.raw) || re.test(t.key))?.[1] || null;
    const goalWord = /ゴール|得点|トクテン|ゴル/.test(t.raw) || /トクテン|ゴル/.test(t.key);
    if (!period && !goalWord) return null;
    const pm = firstMatch(t, new RegExp(`(\\d{1,3})${MIN}?(?:プラス|\\+)(\\d{1,2})${MIN}?`));
    const mm = pm || firstMatch(t, new RegExp(`(\\d{1,3})${MIN}`));
    if (!mm) return null; // 「今日のゴール」（1Shot）と区別するため、分を言ったときだけ得点にする
    const minute = parseInt(mm[1], 10);
    const plus = pm ? parseInt(pm[2], 10) : 0;
    const pk = /PK|ピーケー/i.test(t.raw) || t.key.includes('ピケ');
    const ownGoal = /オウンゴール|OG/i.test(t.raw) || t.key.includes('オウンゴル');

    // 選手は、前後半・時刻・PK などを除いた残りで探す（「39分」の 39 を背番号と取り違えない）
    let rest = normalizeDigits(t.raw);
    if (mm.input === rest) rest = rest.replace(mm[0], '／');
    rest = rest
        .replace(/延長前半|延長後半|前半|後半|アディショナル(タイム)?|オウンゴール|ゴール|得点|PK|ピーケー/gi, '／');
    const players = ctx.targets.filter(x => x.kind === 'player');
    const parse = parseUtterance(rest, players, ctx.tokenizer, {}, ctx.sideWords);
    const candidates = parse.candidates;
    const top = ownGoal ? undefined : candidates[0];
    return {
        kind: 'goal', period, minute, plus, pk, ownGoal,
        side: parse.side || top?.target.side || null,
        playerId: top?.target.player?.id || '',
        candidates, transcript
    };
}

// ---------------------------------------------------------------- まとめ

/**
 * 1Shot 以外の指示か調べる（気象 → 得点 → 交代 の順）。どれでもなければ null（今までどおり 1Shot として照合する）。
 * 認識候補が複数あるときは、中身がいちばん埋まったものを使う
 */
export function parseCommand(alternatives: string[], ctx: CommandContext): VoiceCommand | null {
    const filled = (c: VoiceCommand) =>
        c.kind === 'weather' ? (c.temp ? 1 : 0) + (c.humidity ? 1 : 0)
            : c.kind === 'sub' ? c.pairs.filter(p => p.outId && p.inId).length * 2 + (c.sideSure ? 1 : 0)
                : (c.playerId ? 2 : 0) + (c.period ? 1 : 0);
    let best: VoiceCommand | null = null;
    for (const alt of alternatives) {
        if (!alt || !alt.trim()) continue;
        const c = parseWeather(alt, ctx.tokenizer) || parseGoal(alt, ctx) || parseSub(alt, ctx);
        if (c && (!best || (c.kind === best.kind && filled(c) > filled(best)))) best = c;
    }
    return best;
}

/** 前後半の中の分 → 試合の通し時間（分）。後半 39 分 → 79（前後半 40 分のとき） */
export function goalTotalMinute(period: string, minute: number, plus: number, lengths: { half: number, extra: number }): number {
    const base = period === '後半' ? lengths.half
        : period === '延長前半' ? lengths.half * 2
        : period === '延長後半' ? lengths.half * 2 + lengths.extra
        : 0;
    return base + minute + plus;
}
