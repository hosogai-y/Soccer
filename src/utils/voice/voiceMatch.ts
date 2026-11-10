/**
 * 音声認識の結果（文字列）から「誰の」「どの CG を」出すかを探す。
 * 送出はしない。見つけた候補を返すだけで、TAKE はオペレーターが確認してから押す。
 */
import type { Player } from '../../components/PlayerRegistry';
import type { StaffMember } from '../staff';
import { kanaKey, normalizeDigits, kanaNumberAt, bestWindowSimilarity, isKanaOnly } from './kana';
import { readingOf } from './reading';

type Tokenizer = Parameters<typeof readingOf>[0];

// ---------------------------------------------------------------- CG（音声で選べる送出の種類）

export type VoiceCgId = '1shot_pro2' | '1shot_today' | '1shot_total' | 'card_yellow1' | 'card_yellow2' | 'card_red';

export type VoiceCgDef = {
    id: VoiceCgId;
    label: string;
    telop: '1Shot' | '1Shotカード';
    staffOk: boolean; // スタッフにも出せるか
    defaultAliases: string[]; // ふりがな（カタカナ・ひらがな）。設定で足せる
};

/** 並び順 = 照合の優先順（「2枚目のイエロー」は「イエロー」より先に見る） */
export const VOICE_CGS: VoiceCgDef[] = [
    { id: 'card_yellow2', label: 'イエロー2枚目（1Shotカード）', telop: '1Shotカード', staffOk: false, defaultAliases: ['にまいめ', 'にまいめのいえろー', 'いえろーにまいめ'] },
    { id: 'card_red', label: 'レッド（1Shotカード）', telop: '1Shotカード', staffOk: false, defaultAliases: ['れっど', 'れっどかーど', 'たいじょう'] },
    { id: 'card_yellow1', label: 'イエロー（1Shotカード）', telop: '1Shotカード', staffOk: false, defaultAliases: ['いえろー', 'いえろーかーど', 'けいこく'] },
    { id: '1shot_today', label: "1Shot Today's ゴール", telop: '1Shot', staffOk: false, defaultAliases: ['とぅでい', 'とぅでー', 'つでい', 'きょうのごーる', 'ほんじつのごーる'] },
    { id: '1shot_total', label: '1Shot 通算ゴール', telop: '1Shot', staffOk: false, defaultAliases: ['とーたる', 'つうさん', 'こんたいかいつうさん'] },
    { id: '1shot_pro2', label: '1Shot プロ2', telop: '1Shot', staffOk: true, defaultAliases: ['わんしょっと', 'ぷろつー', 'ぷろふぃーる', 'しょうかい'] }
];
/** CG を言わなかったときに出すもの */
export const DEFAULT_VOICE_CG: VoiceCgId = '1shot_pro2';

export const voiceCgDef = (id: VoiceCgId) => VOICE_CGS.find(c => c.id === id)!;

/** CG ごとに追加したふりがな（設定画面で編集。共有ステートに JSON で保存） */
export type VoiceCgAliases = Partial<Record<VoiceCgId, string[]>>;

// ---------------------------------------------------------------- 候補（選手・スタッフ）

export type VoiceTarget = {
    key: string;
    kind: 'player' | 'staff';
    side: 'left' | 'right';
    school: string;
    name: string;
    number: string; // スタッフは ''
    label: string; // 画面表示用（#13 浅田 卓人 / 監督 山田 太郎）
    player?: Player;
    staff?: StaffMember;
    kanaMissing: boolean; // ふりがな未登録（名前から自動で読んだ）
};

export type PreparedTarget = VoiceTarget & {
    nameKeys: { key: string, weight: number }[]; // 読み（フル・苗字・名前）
    kanjiKeys: { text: string, weight: number }[]; // 表記（フル・苗字）
    role?: { text: string, key: string }; // スタッフの役職（「総監督」「コーチ」。チーム名と一緒に言えば役職だけで選べる）
};

const splitName = (s: string) => s.trim().split(/[\s　]+/).filter(Boolean);
const noSpace = (s: string) => s.replace(/[\s　]/g, '');

export function prepareTargets(targets: VoiceTarget[], kanaOf: (t: VoiceTarget) => string, tokenizer: Tokenizer): PreparedTarget[] {
    return targets.map(t => {
        const given = kanaOf(t).trim();
        const nameParts = splitName(t.name);
        // ふりがながあればそれを、なければ名前を辞書で読む（人名は読み違えることがあるので、ふりがなの登録を勧める）
        const kanaParts = given ? splitName(given) : nameParts.map(p => (isKanaOnly(p) ? p : readingOf(tokenizer, p)));
        const full = kanaKey(kanaParts.join(''));
        const nameKeys = [{ key: full, weight: 1 }];
        if (kanaParts.length >= 2) {
            nameKeys.push({ key: kanaKey(kanaParts[0]), weight: 0.9 });
            nameKeys.push({ key: kanaKey(kanaParts.slice(1).join('')), weight: 0.8 });
        }
        const kanjiKeys = [{ text: noSpace(t.name), weight: 1 }];
        if (nameParts.length >= 2) kanjiKeys.push({ text: nameParts[0], weight: 0.9 });
        const roleText = t.kind === 'staff' ? noSpace(t.staff?.role || '') : '';
        const role = roleText ? { text: roleText, key: kanaKey(isKanaOnly(roleText) ? roleText : readingOf(tokenizer, roleText)) } : undefined;
        return { ...t, kanaMissing: !given, nameKeys: nameKeys.filter(k => k.key.length >= 2), kanjiKeys: kanjiKeys.filter(k => k.text.length >= 2), role };
    });
}

// ---------------------------------------------------------------- 照合

export type VoiceCandidate = { target: VoiceTarget, score: number, why: string };

export type VoiceParse = {
    transcript: string;
    reading: string; // 認識結果の読み（カタカナ・比較用キー）
    cg: VoiceCgId | null; // 言われた CG（なければ null）
    number: string | null;
    side: 'left' | 'right' | null;
    candidates: VoiceCandidate[]; // 点の高い順
};

/**
 * 学校名・左右の言い方・チームカラーの呼び方 → side。
 * 色（leftColors / rightColors）は「赤の13番」「あお13番」「白チーム」のように後ろに の・番号・チームが続くときだけ数える
 * （選手名の「赤木（アカギ）」「青山（アオヤマ）」を色と取り違えないため）
 */
export type SideWords = { left: string[], right: string[], leftColors?: string[], rightColors?: string[] };

const MIN_SCORE = 0.75;
// 照合に使う認識結果の長さ（最後のこの文字数）。「札幌創成の13番 浅田 イエロー2枚目」で 20 字ほど
const MAX_UTTERANCE_CHARS = 40;

function findNumber(raw: string, key: string): string | null {
    const digits = normalizeDigits(raw);
    const m = /背番号\s*(\d{1,3})/.exec(digits) || /(\d{1,3})\s*番/.exec(digits) || /(?:^|[^\d])(\d{1,2})(?![\d枚])/.exec(digits); // 「2枚目」は番号ではない
    if (m) return String(parseInt(m[1], 10));
    // 読みがなに直した結果（「セバンゴウジュウサン」「ジュウサンバン」）
    const sebango = key.indexOf('セバンゴウ');
    if (sebango >= 0) {
        const n = kanaNumberAt(key, sebango + 5);
        if (n) return String(n.value);
    }
    for (let i = 0; i < key.length; i++) {
        const n = kanaNumberAt(key, i);
        if (n && key.startsWith('バン', i + n.length)) return String(n.value);
    }
    return null;
}

function findCg(key: string, aliases: VoiceCgAliases): VoiceCgId | null {
    for (const def of VOICE_CGS) {
        const words = [...def.defaultAliases, ...(aliases[def.id] || [])].map(kanaKey).filter(w => w.length >= 2);
        if (words.some(w => key.includes(w) || (w.length >= 4 && bestWindowSimilarity(key, w) >= 0.85))) return def.id;
    }
    return null;
}

/** 色の呼び方の直後が「の」「チーム」「番号」か（読みがなのキーで見る） */
function colorFollowed(key: string, at: number): boolean {
    const rest = key.slice(at);
    return /^(ノ|チム|\d|セバンゴウ|バン)/.test(rest) || !!kanaNumberAt(key, at);
}

function colorHit(raw: string, key: string, words: string[]): string | null {
    for (const w of words) {
        if (!w) continue;
        // 表記（「赤の」「赤13」）
        for (let i = raw.indexOf(w); i >= 0; i = raw.indexOf(w, i + 1)) {
            if (/^(の|チーム|\d|背番号)/.test(raw.slice(i + w.length))) return w;
        }
        const k = kanaKey(w);
        if (k.length < 2) continue;
        for (let i = key.indexOf(k); i >= 0; i = key.indexOf(k, i + 1)) {
            if (colorFollowed(key, i + k.length)) return w;
        }
    }
    return null;
}

export function findSide(raw: string, key: string, sideWords: SideWords): { side: 'left' | 'right' | null, why: string } {
    const hit = (words: string[]) => words.find(w => w && (raw.includes(w) || (kanaKey(w).length >= 2 && key.includes(kanaKey(w))))) || null;
    const l = hit(sideWords.left) || colorHit(raw, key, sideWords.leftColors || []);
    const r = hit(sideWords.right) || colorHit(raw, key, sideWords.rightColors || []);
    if (!!l === !!r) return { side: null, why: '' };
    return l ? { side: 'left', why: `「${l}」` } : { side: 'right', why: `「${r}」` };
}

/** 1 つの認識結果を照合する */
export function parseUtterance(transcript: string, targets: PreparedTarget[], tokenizer: Tokenizer, aliases: VoiceCgAliases, sideWords: SideWords): VoiceParse {
    // 照合は文の長さにほぼ比例して重くなる（1000 字で数秒ブラウザが止まる）。実況や周りの声を拾い続けると
    // 認識結果がとても長くなるので、指示が入っている最後の部分だけを見る
    const raw = noSpace(transcript.normalize('NFKC')).slice(-MAX_UTTERANCE_CHARS);
    const key = kanaKey(readingOf(tokenizer, raw));
    const cg = findCg(key, aliases);
    const number = findNumber(raw, key);
    const { side, why: sideWhy } = findSide(raw, key, sideWords);

    // 「総監督」と言ったときに「監督」も当たらないよう、その役職を含む長い役職の部分を除いて探す
    const roles = targets.map(t => t.role).filter((r): r is NonNullable<PreparedTarget['role']> => !!r);
    const without = (text: string, part: string, longer: string[]) => longer.filter(l => l !== part && l.includes(part)).reduce((acc, l) => acc.split(l).join(''), text);
    const roleSaid = (r: NonNullable<PreparedTarget['role']>) =>
        without(raw, r.text, roles.map(x => x.text)).includes(r.text) ||
        (r.key.length >= 3 && without(key, r.key, roles.map(x => x.key)).includes(r.key));

    const candidates: VoiceCandidate[] = [];
    for (const t of targets) {
        let nameScore = 0;
        let why = '';
        for (const k of t.kanjiKeys) {
            if (raw.includes(k.text) && k.weight > nameScore) { nameScore = k.weight; why = `表記「${k.text}」`; }
        }
        for (const k of t.nameKeys) {
            const s = bestWindowSimilarity(key, k.key) * k.weight;
            // 2〜3 字の短い読みはあいまい一致だと誤爆しやすいので、完全一致だけ
            const ok = k.key.length <= 3 ? key.includes(k.key) : s >= MIN_SCORE * k.weight;
            if (ok && s > nameScore) { nameScore = s; why = `読み「${k.key}」`; }
        }
        // 役職だけ（「創成の総監督」）: チーム名と一緒に言ったときだけ候補になる点（0.7 台 + チーム 0.15）。
        // 長い役職ほど少し高く（「総監督」と言ったら「監督」より「総監督」）
        if (t.role && roleSaid(t.role)) {
            const roleScore = Math.min(0.74, 0.7 + 0.01 * t.role.text.length);
            if (nameScore > 0) { nameScore += 0.1; why = `${why}・役職「${t.role.text}」`; }
            else if (roleScore > nameScore) { nameScore = roleScore; why = `役職「${t.role.text}」`; }
        }
        const numberHit = !!number && t.kind === 'player' && t.number === number;
        let score = Math.max(nameScore, numberHit ? 0.8 : 0);
        if (numberHit && nameScore > 0) score += 0.3;
        if (numberHit) why = why ? `${why}・背番号${number}` : `背番号${number}`;
        if (side) score += t.side === side ? 0.15 : -0.5;
        if (side && t.side === side && why) why = `${why}・チーム${sideWhy}`;
        if (score >= MIN_SCORE) candidates.push({ target: t, score, why });
    }
    candidates.sort((a, b) => b.score - a.score);
    return { transcript, reading: key, cg, number, side, candidates };
}

/** 認識候補（言い直し・別の聞き取り）をまとめて照合し、一番よいものを返す */
export function parseAlternatives(alternatives: string[], targets: PreparedTarget[], tokenizer: Tokenizer, aliases: VoiceCgAliases, sideWords: SideWords): VoiceParse | null {
    let best: VoiceParse | null = null;
    const top = (p: VoiceParse) => (p.candidates[0]?.score || 0) + (p.cg ? 0.05 : 0);
    for (const alt of alternatives) {
        if (!alt || !alt.trim()) continue;
        const p = parseUtterance(alt, targets, tokenizer, aliases, sideWords);
        if (!best || top(p) > top(best)) best = p;
    }
    return best;
}
