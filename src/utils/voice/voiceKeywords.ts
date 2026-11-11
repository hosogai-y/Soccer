/**
 * 音声送出のキーワード（Voice Keywords タブで登録）。
 * 「大得点」「スタッツ」のように CG 名を言うと、その CG の TAKE を、
 * 「CGクリア」「2項目目」のように操作名を言うと、その操作を実行する（確認カードの「実行」、または確認なしで実行）。
 *
 * 設定は共有ステート（全端末）に JSON で保存し、Voice Keywords タブから JSON ファイルに書き出し・読み込みできる。
 */
import { kanaKey, isKanaOnly } from './kana';
import { readingOf } from './reading';

type Tokenizer = Parameters<typeof readingOf>[0];

export type VoiceKeywordGroup = 'cg' | 'command';

export type VoiceKeywordItem = {
    id: string;              // 実行するアクション（voiceActions.ts）
    group: VoiceKeywordGroup;
    label: string;
    telop?: string;          // CG のテロップ名（一覧の表示・ハンドラがないときの送出に使う）
    note?: string;           // 一覧に出す説明
    defaults: string[];      // 標準のキーワード
};

/** CG グラフィックス一覧（キーワードで TAKE する CG） */
export const VOICE_KEYWORD_CGS: VoiceKeywordItem[] = [
    { id: 'cg.big_score', group: 'cg', label: '大得点', telop: '大得点', note: '「得点者込みで送出」の設定とステータスに従う', defaults: ['大得点', 'だいとくてん', 'おおとくてん'] },
    { id: 'cg.big_score_pk', group: 'cg', label: '大得点（PK戦結果込み）', telop: '大得点PK', note: '得点者込みの設定に従う', defaults: ['PK結果', 'ぴーけーけっか'] },
    { id: 'cg.small_score', group: 'cg', label: '小得点', telop: '小得点', note: 'タイマーも一緒に出す', defaults: ['小得点', 'しょうとくてん'] },
    { id: 'cg.timer', group: 'cg', label: 'タイマー', telop: 'タイマー', defaults: ['タイマー', 'たいまー'] },
    { id: 'cg.additional_time', group: 'cg', label: 'アディショナルタイム', telop: 'アディショナルタイム', note: '選択中の分数で送出', defaults: ['アディショナルタイム', 'あでぃしょなるたいむ', 'ろすたいむ'] },
    { id: 'cg.matchup_text', group: 'cg', label: '対戦カード（文字版）', telop: '対戦カード', defaults: ['対戦カード', 'たいせんかーど'] },
    { id: 'cg.matchup_image', group: 'cg', label: '対戦カード（画像版）', telop: '対戦カード画像', defaults: ['対戦カード画像', 'たいせんかーどがぞう'] },
    { id: 'cg.formation_left', group: 'cg', label: 'フォーメーション（左チーム）', telop: 'フォーメーション左', defaults: ['左フォーメーション', 'ひだりふぉーめーしょん', 'ひだりのふぉーめーしょん'] },
    { id: 'cg.formation_right', group: 'cg', label: 'フォーメーション（右チーム）', telop: 'フォーメーション右', defaults: ['右フォーメーション', 'みぎふぉーめーしょん', 'みぎのふぉーめーしょん'] },
    { id: 'cg.subs_left', group: 'cg', label: '控え選手（左チーム）', telop: 'サブ下位置左', defaults: ['左控え', 'ひだりひかえ', 'ひだりのひかえ'] },
    { id: 'cg.subs_right', group: 'cg', label: '控え選手（右チーム）', telop: 'サブ下位置左', defaults: ['右控え', 'みぎひかえ', 'みぎのひかえ'] },
    { id: 'cg.stats', group: 'cg', label: 'スタッツ', telop: 'スタッツ', defaults: ['スタッツ', 'すたっつ'] },
    { id: 'cg.weather', group: 'cg', label: '気象', telop: '気象', note: '入力済みの天候・気温・湿度で送出', defaults: ['気象', 'きしょう', 'てんき'] },
    { id: 'cg.pk_center', group: 'cg', label: 'PK（センター）', telop: 'PK', defaults: ['PK戦', 'ぴーけーせん', 'せんたーぴーけー'] },
    { id: 'cg.pk_topleft', group: 'cg', label: 'PK（左上）', telop: '左上PK', defaults: ['左上PK', 'ひだりうえぴーけー'] }
];

/** 操作コマンド一覧 */
export const VOICE_KEYWORD_COMMANDS: VoiceKeywordItem[] = [
    { id: 'cmd.cg_clear', group: 'command', label: 'CGクリア', note: '小得点・タイマー・AT 以外を消す（F4 と同じ）', defaults: ['CGクリア', 'しーじーくりあ'] },
    { id: 'cmd.all_clear', group: 'command', label: 'Allクリア', note: '小得点・タイマー・AT も含めて全部消す', defaults: ['オールクリア', 'おーるくりあ', 'ぜんぶけして'] },
    { id: 'cmd.big_score_hide', group: 'command', label: '大得点 HIDE', defaults: ['大得点ハイド', 'だいとくてんはいど', 'だいとくてんけして'] },
    { id: 'cmd.small_score_hide', group: 'command', label: '小得点 HIDE', note: 'タイマー・AT も消す', defaults: ['小得点ハイド', 'しょうとくてんはいど', 'しょうとくてんけして'] },
    { id: 'cmd.scorer_cut_change', group: 'command', label: '得点者カットチェンジ', note: '大得点（得点者込み）の次の 4 件', defaults: ['カットチェンジ', 'かっとちぇんじ'] },
    { id: 'cmd.queue_take_next', group: 'command', label: 'CG キュー TAKE NEXT', defaults: ['テイクネクスト', 'ていくねくすと', 'きゅーそうしゅつ'] },
    { id: 'cmd.oneshot_comment_1', group: 'command', label: '1Shot プロ2 コメント 1 項目目', note: '選択中の選手のコメントを切り替えて送出', defaults: ['1項目目', 'いちこうもくめ', 'こめんといち'] },
    { id: 'cmd.oneshot_comment_2', group: 'command', label: '1Shot プロ2 コメント 2 項目目', note: '選択中の選手のコメントを切り替えて送出', defaults: ['2項目目', 'にこうもくめ', 'こめんとに'] },
    { id: 'cmd.oneshot_comment_3', group: 'command', label: '1Shot プロ2 コメント 3 項目目', note: '選択中の選手のコメントを切り替えて送出', defaults: ['3項目目', 'さんこうもくめ', 'こめんとさん'] },
    { id: 'cmd.oneshot_comment_4', group: 'command', label: '1Shot プロ2 コメント 4 項目目', note: '選択中の選手のコメントを切り替えて送出', defaults: ['4項目目', 'よんこうもくめ', 'こめんとよん'] },
    { id: 'cmd.oneshot_comment_5', group: 'command', label: '1Shot プロ2 コメント 5 項目目', note: '選択中の選手のコメントを切り替えて送出', defaults: ['5項目目', 'ごこうもくめ', 'こめんとご'] },
    { id: 'cmd.oneshot_comment_next', group: 'command', label: '1Shot プロ2 次のコメント', note: '選択中の選手の次のコメントに切り替えて送出', defaults: ['次のコメント', 'つぎのこめんと'] },
    { id: 'cmd.oneshot_pro2', group: 'command', label: '1Shot プロ2 に切替', note: '選択中の選手で送出', defaults: ['プロ2に切り替え', 'ぷろつーにきりかえ', 'こめんとにきりかえ'] },
    { id: 'cmd.oneshot_today', group: 'command', label: "1Shot Today'sゴール に切替", note: '選択中の選手で送出', defaults: ['トゥデイに切り替え', 'とぅでいにきりかえ'] },
    { id: 'cmd.oneshot_total', group: 'command', label: '1Shot 通算ゴール に切替', note: '選択中の選手で送出', defaults: ['トータルに切り替え', 'とーたるにきりかえ'] }
];

export const VOICE_KEYWORD_ITEMS: VoiceKeywordItem[] = [...VOICE_KEYWORD_CGS, ...VOICE_KEYWORD_COMMANDS];
export const voiceKeywordItem = (id: string) => VOICE_KEYWORD_ITEMS.find(i => i.id === id);

/** 項目ごとの設定。keywords がなければ標準のキーワード。immediate = 確認カードを出さずに実行 */
export type VoiceKeywordConfig = { keywords?: string[], immediate?: boolean, disabled?: boolean };
export type VoiceKeywordSettings = Record<string, VoiceKeywordConfig>;

export const VOICE_KEYWORDS_KEY = 'voice_keywords_json';

export function parseKeywordSettings(json: string | null | undefined): VoiceKeywordSettings {
    if (typeof json !== 'string') return {};
    try {
        const v = JSON.parse(json);
        return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    } catch {
        return {};
    }
}

export const keywordsOf = (item: VoiceKeywordItem, settings: VoiceKeywordSettings) =>
    settings[item.id]?.keywords ?? item.defaults;

/** 「、」「,」・空白・改行区切りの入力をキーワードの配列に */
export const splitKeywords = (s: string) => s.split(/[、,，\n]+/).map(w => w.trim()).filter(Boolean);

// ---------------------------------------------------------------- 照合

const rawOf = (s: string) => s.normalize('NFKC').replace(/[\s　、。,.!！?？]/g, '').toUpperCase();
const keyOf = (tokenizer: Tokenizer, s: string) => {
    const raw = rawOf(s);
    return kanaKey(isKanaOnly(raw) ? raw : readingOf(tokenizer, raw));
};

export type KeywordHit = { item: VoiceKeywordItem, keyword: string, transcript: string, immediate: boolean };

/** キーワードが話した言葉に含まれるか。表記（「CGクリア」）と読み（「シージークリア」）の両方で見る。長さ（長いほど優先） */
export function keywordHitLength(transcript: string, keyword: string, tokenizer: Tokenizer): number {
    const raw = rawOf(transcript);
    const kwRaw = rawOf(keyword);
    let best = 0;
    if (kwRaw.length >= 2 && raw.includes(kwRaw)) best = kwRaw.length;
    const key = keyOf(tokenizer, transcript);
    const kwKey = keyOf(tokenizer, keyword);
    if (kwKey.length >= 2 && key.includes(kwKey)) best = Math.max(best, kwKey.length);
    return best;
}

/**
 * 認識結果（候補が複数あればすべて）から、いちばん長く一致したキーワードの項目を返す。どれも当たらなければ null
 */
export function matchKeyword(alternatives: string[], settings: VoiceKeywordSettings, tokenizer: Tokenizer): KeywordHit | null {
    let best: (KeywordHit & { length: number }) | null = null;
    for (const alt of alternatives) {
        if (!alt || !alt.trim()) continue;
        for (const item of VOICE_KEYWORD_ITEMS) {
            const cfg = settings[item.id];
            if (cfg?.disabled) continue;
            for (const kw of keywordsOf(item, settings)) {
                const length = keywordHitLength(alt, kw, tokenizer);
                if (length > 0 && (!best || length > best.length)) {
                    best = { item, keyword: kw, transcript: alt, immediate: !!cfg?.immediate, length };
                }
            }
        }
    }
    if (!best) return null;
    const { length: _length, ...hit } = best;
    return hit;
}

/** 同じキーワードが 2 つ以上の項目に入っていないか（一覧の警告用）。キー = 読み */
export function duplicateKeywords(settings: VoiceKeywordSettings, tokenizer: Tokenizer): Map<string, string[]> {
    const owners = new Map<string, { word: string, labels: string[] }>();
    for (const item of VOICE_KEYWORD_ITEMS) {
        if (settings[item.id]?.disabled) continue;
        for (const kw of keywordsOf(item, settings)) {
            const k = keyOf(tokenizer, kw);
            if (k.length < 2) continue;
            const o = owners.get(k) || { word: kw, labels: [] };
            if (!o.labels.includes(item.label)) o.labels.push(item.label);
            owners.set(k, o);
        }
    }
    const out = new Map<string, string[]>();
    owners.forEach(o => { if (o.labels.length >= 2) out.set(o.word, o.labels); });
    return out;
}

// ---------------------------------------------------------------- JSON ファイル（書き出し・読み込み）

export type VoiceSettingsFile = {
    format: 'soccer-voice-settings';
    version: 1;
    exportedAt: string;
    keywords: VoiceKeywordSettings;      // Voice Keywords（CG・操作コマンド）
    cgAliases: Record<string, string[]>; // 1Shot / 1Shotカード の CG の呼び方
    teamColorWords: Record<string, string[]>; // 学校ごとのチームカラーの呼び方
};

export function buildVoiceSettingsFile(keywords: VoiceKeywordSettings, cgAliases: Record<string, string[]>, teamColorWords: Record<string, string[]>): VoiceSettingsFile {
    return { format: 'soccer-voice-settings', version: 1, exportedAt: new Date().toISOString(), keywords, cgAliases, teamColorWords };
}

const stringListRecord = (v: unknown): Record<string, string[]> => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
    const out: Record<string, string[]> = {};
    Object.entries(v as Record<string, unknown>).forEach(([k, list]) => {
        if (Array.isArray(list)) out[k] = list.filter((w): w is string => typeof w === 'string' && !!w.trim()).map(w => w.trim());
    });
    return out;
};

/** 読み込んだ JSON を確かめて、使える形にする。形式が違えばエラー */
export function readVoiceSettingsFile(text: string): VoiceSettingsFile {
    let v: any;
    try {
        v = JSON.parse(text);
    } catch {
        throw new Error('JSON として読めません');
    }
    if (!v || v.format !== 'soccer-voice-settings') throw new Error('音声設定の JSON ではありません（format が違います）');
    const keywords: VoiceKeywordSettings = {};
    if (v.keywords && typeof v.keywords === 'object') {
        Object.entries(v.keywords as Record<string, any>).forEach(([id, c]) => {
            if (!voiceKeywordItem(id) || !c || typeof c !== 'object') return;
            const cfg: VoiceKeywordConfig = {};
            if (Array.isArray(c.keywords)) cfg.keywords = c.keywords.filter((w: unknown) => typeof w === 'string' && w.trim()).map((w: string) => w.trim());
            if (c.immediate) cfg.immediate = true;
            if (c.disabled) cfg.disabled = true;
            keywords[id] = cfg;
        });
    }
    return {
        format: 'soccer-voice-settings', version: 1, exportedAt: String(v.exportedAt || ''),
        keywords, cgAliases: stringListRecord(v.cgAliases), teamColorWords: stringListRecord(v.teamColorWords)
    };
}
