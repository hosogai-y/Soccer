/**
 * チームカラー（#rrggbb）から、音声で呼ぶときの色の名前を作る。「赤の13番」「みずいろの7番」のように使う。
 * カード CG の呼び方（レッド・イエロー）とぶつからないよう、赤・黄は和名だけにしている。
 */

export type ColorName = { label: string, words: string[] };

function hexToHsl(hex: string): { h: number, s: number, l: number } | null {
    const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
    if (!m) return null;
    const v = m[1].length === 3 ? m[1].split('').map(c => c + c).join('') : m[1];
    const r = parseInt(v.slice(0, 2), 16) / 255;
    const g = parseInt(v.slice(2, 4), 16) / 255;
    const b = parseInt(v.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) return { h: 0, s: 0, l };
    const s = d / (1 - Math.abs(2 * l - 1));
    let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
    return { h, s, l };
}

/** 色コード → 呼び方（例: #198754 → 緑「みどり・ぐりーん」） */
export function colorNameOf(hex: string): ColorName | null {
    const c = hexToHsl(hex || '');
    if (!c) return null;
    const { h, s, l } = c;
    if (l >= 0.85 && s < 0.35) return { label: '白', words: ['白', 'しろ', 'ほわいと'] };
    if (l <= 0.15) return { label: '黒', words: ['黒', 'くろ', 'ぶらっく'] };
    if (s < 0.18) return { label: 'グレー', words: ['灰色', 'はいいろ', 'ぐれー'] };
    if (h < 12 || h >= 345) return l < 0.35 ? { label: 'えんじ', words: ['えんじ', '赤', 'あか'] } : { label: '赤', words: ['赤', 'あか'] };
    if (h < 40) return l < 0.35 ? { label: '茶色', words: ['茶色', 'ちゃいろ'] } : { label: 'オレンジ', words: ['橙', 'だいだい', 'おれんじ'] };
    if (h < 65) return { label: '黄色', words: ['黄色', 'きいろ', '黄'] };
    if (h < 90) return { label: '黄緑', words: ['黄緑', 'きみどり'] };
    if (h < 165) return { label: '緑', words: ['緑', 'みどり', 'ぐりーん'] };
    if (h < 200) return { label: '水色', words: ['水色', 'みずいろ', 'すかい', '青', 'あお'] };
    if (h < 250) return l < 0.3 ? { label: '紺', words: ['紺', 'こん', 'ねいびー', '青', 'あお'] } : { label: '青', words: ['青', 'あお', 'ぶるー'] };
    if (h < 290) return { label: '紫', words: ['紫', 'むらさき', 'ぱーぷる'] };
    return l < 0.4 ? { label: 'えんじ', words: ['えんじ', 'わいん'] } : { label: 'ピンク', words: ['ぴんく', '桃色', 'ももいろ'] };
}
