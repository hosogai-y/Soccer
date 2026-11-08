/**
 * 音声送出で使う読みがなの正規化。ひらがな・カタカナ・空白・長音などの違いを吸収して比べられる形（カタカナ）にする。
 */

/** ひらがな → カタカナ */
export const toKatakana = (s: string) => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));

const SMALL: Record<string, string> = { 'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ', 'ヵ': 'カ', 'ヶ': 'ケ', 'ッ': 'ツ', 'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ', 'ヮ': 'ワ' };
const VOICED: Record<string, string> = { 'ヴ': 'ブ', 'ヂ': 'ジ', 'ヅ': 'ズ', 'ヲ': 'オ' };

/**
 * 比較用キー: カタカナにし、空白・記号・長音を除き、小さい字を大きく、ヂ/ヅ/ヲ/ヴ を同じ音の字に揃える。
 * 「さとう」「サトウ」「サトー」「サ ト ウ」はどれも「サトウ」に近いキーになる（長音「ー」は消す）。
 */
export function kanaKey(s: string): string {
    return toKatakana(s.normalize('NFKC'))
        .replace(/[\s　・ー\-－―‐.,、。!！?？「」『』()（）]/g, '')
        .replace(/[ァィゥェォヵヶッャュョヮ]/g, c => SMALL[c] || c)
        .replace(/[ヴヂヅヲ]/g, c => VOICED[c] || c);
}

/** カタカナ（とひらがな）だけでできているか */
export const isKanaOnly = (s: string) => /^[ぁ-ゖァ-ー\s　]+$/.test(s);

const KANJI_DIGIT: Record<string, number> = { '〇': 0, '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };

/** 「十三」「二十」「百一」などの漢数字（〜999）を数に。数字でなければ null */
export function kanjiToNumber(s: string): number | null {
    if (!/^[〇零一二三四五六七八九十百]+$/.test(s)) return null;
    let total = 0;
    let cur = 0;
    for (const c of s) {
        if (c === '百') { total += (cur || 1) * 100; cur = 0; }
        else if (c === '十') { total += (cur || 1) * 10; cur = 0; }
        else cur = cur * 10 + KANJI_DIGIT[c];
    }
    return total + cur;
}

/** 文中の漢数字・全角数字を半角数字にする（「背番号十三」→「背番号13」） */
export function normalizeDigits(s: string): string {
    return s.normalize('NFKC').replace(/[〇零一二三四五六七八九十百]+/g, m => {
        const n = kanjiToNumber(m);
        // 「一人」「十分」のような語まで変えないよう、番号らしい長さ（1〜3 字）だけ
        return n === null || m.length > 3 ? m : String(n);
    });
}

/** カタカナの数詞（認識結果を読みがなにしたとき）→ 数字。「ジュウサン」→ 13 */
const KANA_DIGITS: [string, number][] = [
    ['キュウ', 9], ['ク', 9], ['ハチ', 8], ['ハツ', 8], ['ナナ', 7], ['シチ', 7], ['ロク', 6], ['ゴ', 5], ['ヨン', 4], ['ヨ', 4], ['シ', 4],
    ['サン', 3], ['ニ', 2], ['イチ', 1], ['イツ', 1], ['レイ', 0], ['ゼロ', 0], ['マル', 0]
];
export function kanaNumberAt(key: string, at: number): { value: number, length: number } | null {
    let i = at;
    let total = 0;
    let cur = -1;
    let used = false;
    const digit = () => {
        for (const [k, v] of KANA_DIGITS) if (key.startsWith(k, i)) { i += k.length; return v; }
        return -1;
    };
    for (;;) {
        if (key.startsWith('ジュウ', i) || key.startsWith('ジユウ', i)) { total += (cur < 0 ? 1 : cur) * 10; cur = -1; i += 3; used = true; continue; }
        const d = digit();
        if (d < 0) break;
        cur = d;
        used = true;
    }
    if (!used) return null;
    return { value: total + (cur < 0 ? 0 : cur), length: i - at };
}

/** 2 つのキーの近さ（0〜1）。レーベンシュタイン距離を長い方の長さで割って 1 から引く */
// 何度も呼ばれるので、作業用の配列は使い回す（呼ぶたびに配列を作ると遅い）
let rowA = new Int32Array(32);
let rowB = new Int32Array(32);
export function similarity(a: string, b: string): number {
    if (a === b) return 1;
    if (!a || !b) return 0;
    const m = a.length;
    const n = b.length;
    if (rowA.length <= n) { rowA = new Int32Array(n + 1); rowB = new Int32Array(n + 1); }
    let prev = rowA;
    let cur = rowB;
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
        cur[0] = i;
        const ca = a.charCodeAt(i - 1);
        for (let j = 1; j <= n; j++) {
            const sub = prev[j - 1] + (ca === b.charCodeAt(j - 1) ? 0 : 1);
            const del = prev[j] + 1;
            const ins = cur[j - 1] + 1;
            cur[j] = sub < del ? (sub < ins ? sub : ins) : (del < ins ? del : ins);
        }
        const t = prev; prev = cur; cur = t;
    }
    return 1 - prev[n] / Math.max(m, n);
}

/** text の中で needle に一番近い部分の近さ（長さ ±1 の窓をずらして比べる） */
export function bestWindowSimilarity(text: string, needle: string): number {
    if (!needle || !text) return 0;
    if (text.includes(needle)) return 1;
    let best = 0;
    for (let len = Math.max(1, needle.length - 1); len <= needle.length + 1; len++) {
        for (let i = 0; i + len <= text.length; i++) {
            const s = similarity(text.slice(i, i + len), needle);
            if (s > best) best = s;
        }
    }
    return best;
}
