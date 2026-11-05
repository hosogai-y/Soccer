// TGA（Targa）画像をブラウザで読んで PNG に変換する。
// ブラウザは TGA を表示できないため、顔写真は PNG に変換したものを選手に持たせる。
// 対応: 非圧縮 / RLE 圧縮の カラーマップ・フルカラー（16/24/32bit）・グレースケール

export const isTgaFile = (filename: string): boolean => /\.tga$/i.test(filename.split('?')[0]);

/** "xxx.tga" → "xxx.png"（クエリは外す） */
export const tgaToPngName = (filename: string): string => filename.split('?')[0].replace(/\.tga$/i, '.png');

/** TGA のバイト列を RGBA のピクセルに展開する */
export function decodeTga(buffer: ArrayBuffer): { width: number; height: number; rgba: Uint8ClampedArray<ArrayBuffer> } {
    const d = new Uint8Array(buffer);
    if (d.length < 18) throw new Error('TGA ファイルが短すぎます。');
    const idLength = d[0];
    const colorMapType = d[1];
    const imageType = d[2];
    const cmFirst = d[3] | (d[4] << 8);
    const cmLength = d[5] | (d[6] << 8);
    const cmDepth = d[7];
    const width = d[12] | (d[13] << 8);
    const height = d[14] | (d[15] << 8);
    const depth = d[16];
    const descriptor = d[17];

    const rle = imageType >= 9;
    const kind = imageType & 7; // 1: カラーマップ, 2: フルカラー, 3: グレースケール
    if (![1, 2, 3].includes(kind) || ![1, 2, 3, 9, 10, 11].includes(imageType)) throw new Error(`対応していない TGA 形式です（type ${imageType}）。`);
    if (width === 0 || height === 0) throw new Error('TGA の画像サイズが 0 です。');

    let pos = 18 + idLength;

    // 1 ピクセル分の色を [r, g, b, a] で読む
    const readColor = (bytes: Uint8Array, at: number, bits: number): [number, number, number, number] => {
        if (bits === 32) return [bytes[at + 2], bytes[at + 1], bytes[at], bytes[at + 3]];
        if (bits === 24) return [bytes[at + 2], bytes[at + 1], bytes[at], 255];
        if (bits === 15 || bits === 16) {
            const v = bytes[at] | (bytes[at + 1] << 8);
            const c = (x: number) => (x << 3) | (x >> 2);
            return [c((v >> 10) & 31), c((v >> 5) & 31), c(v & 31), 255];
        }
        throw new Error(`対応していない色深度です（${bits}bit）。`);
    };

    let palette: [number, number, number, number][] = [];
    if (colorMapType === 1) {
        const entryBytes = Math.ceil(cmDepth / 8);
        for (let i = 0; i < cmLength; i++) palette.push(readColor(d, pos + i * entryBytes, cmDepth));
        pos += cmLength * entryBytes;
    }
    if (kind === 1 && palette.length === 0) throw new Error('TGA のカラーマップがありません。');

    const pixelBytes = Math.ceil(depth / 8);
    const pixel = (at: number): [number, number, number, number] => {
        if (kind === 1) {
            const idx = (pixelBytes === 2 ? d[at] | (d[at + 1] << 8) : d[at]) - cmFirst;
            return palette[idx] || [0, 0, 0, 255];
        }
        if (kind === 3) {
            const g = d[at];
            return [g, g, g, pixelBytes === 2 ? d[at + 1] : 255];
        }
        return readColor(d, at, depth);
    };

    // ファイル内の並び順のまま RGBA に展開
    const count = width * height;
    const raw = new Uint8ClampedArray(count * 4);
    let n = 0;
    const put = (c: [number, number, number, number]) => {
        raw[n * 4] = c[0]; raw[n * 4 + 1] = c[1]; raw[n * 4 + 2] = c[2]; raw[n * 4 + 3] = c[3];
        n++;
    };
    while (n < count) {
        if (pos + (rle ? 1 : 0) + pixelBytes > d.length) throw new Error('TGA の画像データが途中で切れています。');
        if (!rle) {
            put(pixel(pos));
            pos += pixelBytes;
            continue;
        }
        const head = d[pos++];
        const len = (head & 0x7f) + 1;
        if (head & 0x80) {
            const c = pixel(pos);
            pos += pixelBytes;
            for (let i = 0; i < len && n < count; i++) put(c);
        } else {
            for (let i = 0; i < len && n < count; i++) {
                put(pixel(pos));
                pos += pixelBytes;
            }
        }
    }

    // 32bit でアルファ ビットが無い指定、または全ピクセルのアルファが 0 の場合は不透明として扱う
    const alphaBits = descriptor & 0x0f;
    let allZero = true;
    for (let i = 3; i < raw.length; i += 4) if (raw[i] !== 0) { allZero = false; break; }
    if ((depth === 32 && alphaBits === 0) || allZero) for (let i = 3; i < raw.length; i += 4) raw[i] = 255;

    // 原点（左下 / 右下 / 左上 / 右上）に合わせて上から下・左から右の並びにする
    const fromRight = (descriptor & 0x10) !== 0;
    const fromTop = (descriptor & 0x20) !== 0;
    const rgba = new Uint8ClampedArray(count * 4);
    for (let y = 0; y < height; y++) {
        const sy = fromTop ? y : height - 1 - y;
        for (let x = 0; x < width; x++) {
            const sx = fromRight ? width - 1 - x : x;
            const s = (sy * width + sx) * 4;
            const t = (y * width + x) * 4;
            rgba[t] = raw[s]; rgba[t + 1] = raw[s + 1]; rgba[t + 2] = raw[s + 2]; rgba[t + 3] = raw[s + 3];
        }
    }
    return { width, height, rgba };
}

/** TGA の Blob を PNG の Blob に変換する */
export async function tgaToPngBlob(tga: Blob): Promise<Blob> {
    const { width, height, rgba } = decodeTga(await tga.arrayBuffer());
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('画像の変換に失敗しました。');
    ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
    return new Promise((resolve, reject) => {
        canvas.toBlob(b => (b ? resolve(b) : reject(new Error('PNG への変換に失敗しました。'))), 'image/png');
    });
}

/** TGA ファイルを PNG の File に変換する（ファイル名は拡張子だけ .png に替える） */
export async function tgaFileToPng(file: File): Promise<File> {
    return new File([await tgaToPngBlob(file)], tgaToPngName(file.name), { type: 'image/png' });
}
