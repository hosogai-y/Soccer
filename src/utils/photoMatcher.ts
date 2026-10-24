// 顔写真は VolleyBall と同じく SDK の uploadAsset で TelopHub に上げ、
// /telop-assets/soccer/assets/face/<高校名>/<ファイル名> の URL で選手に持たせる

export interface PhotoItem {
    school: string;
    filename: string;
    number: string;
    name: string;
}

export interface PhotoFile extends PhotoItem {
    file: File;
}

// uploadAsset の保存先（プロジェクト内の assets/ 配下）
export const FACE_ASSET_DIR = 'assets/face';
// uploadAsset が返す URL と同じ形（App.tsx の PROJECT_NAME "Telops/soccer" から Telops/ を除いたもの）
const FACE_URL_BASE = `/telop-assets/soccer/${FACE_ASSET_DIR}`;

// 全角数字を半角数字に変換
export const toHalfWidthNum = (str?: string): string => {
    if (!str) return '';
    return String(str).replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)).trim();
};

// 空白（全角・半角）を除去した文字列
export const cleanStr = (str?: string): string => {
    if (!str) return '';
    return String(str).replace(/[\s　]+/g, '').trim();
};

// 背番号を数値として解析
export const parseNum = (str?: string): number | null => {
    const clean = toHalfWidthNum(str);
    if (!clean) return null;
    const n = parseInt(clean, 10);
    return isNaN(n) ? null : n;
};

export const isImageFile = (filename: string): boolean => /\.(png|jpe?g|webp)$/i.test(filename);

// ファイル名 "14 菅野桜抜き.png" → 背番号 "14" / 氏名 "菅野桜"
export function parsePhotoFilename(filename: string): { number: string; name: string } {
    const cleaned = filename.replace(/\.(png|jpe?g|webp)$/i, '').replace(/抜き$/, '').trim();
    const match = cleaned.match(/^([0-9０-９]+)[\s　]*(.*)$/);
    return match ? { number: match[1], name: match[2].trim() } : { number: '', name: cleaned };
}

// 選んだ画像ファイルを照合用の PhotoFile にする。
// フォルダごと選んだ場合は、ファイルのすぐ上のフォルダ名を高校名として使う
export function toPhotoFile(file: File, fallbackSchool: string): PhotoFile {
    const filename = file.name.normalize('NFC');
    const parts = ((file as any).webkitRelativePath || '').normalize('NFC').split('/').filter(Boolean);
    const school = parts.length >= 2 ? parts[parts.length - 2] : fallbackSchool;
    return { file, school, filename, ...parsePhotoFilename(filename) };
}

// uploadAsset に渡す保存先パス
export const faceAssetPath = (school: string, filename: string): string =>
    `${FACE_ASSET_DIR}/${school}/${filename}`.normalize('NFC');

// 以前の Photo フォルダ形式 (/Photo/高校名/ファイル名) を assets/face の URL に読み替える。
// それ以外（uploadAsset の URL や img/ のパス）はそのまま返す
export function toPhotoAssetUrl(raw?: string): string {
    if (!raw || !raw.trim()) return '';
    const clean = raw.trim().replace(/\\/g, '/');
    const legacy = clean.match(/^(?:\.\.)?\/?Photo\/([^\/]+)\/(.+)$/i);
    if (legacy) {
        return `${FACE_URL_BASE}/${legacy[1].trim()}/${legacy[2].trim()}`;
    }
    return clean;
}

// ブラウザで表示するための URL（日本語・空白をエンコード）
export function encodePhotoUrl(url?: string): string {
    const clean = toPhotoAssetUrl(url);
    if (!clean) return '';
    try {
        return encodeURI(decodeURI(clean));
    } catch {
        return encodeURI(clean);
    }
}

// 選手情報と写真リストの照合
export function matchPlayerPhoto<T extends PhotoItem>(
    player: { schoolName?: string; teamId?: string; number?: string; name?: string; photoUrl?: string },
    photos: T[],
    fallbackSchool?: string
): T | null {
    if (!photos || photos.length === 0) return null;

    // 選手所属校の候補
    const pSchool = player.schoolName || fallbackSchool || (player.teamId === 'right' ? '札幌大谷' : '札幌創成');
    const cleanPSchool = cleanStr(pSchool);

    // 同じ高校の写真一覧を抽出（表記ゆれ対応: 前方一致、包含関係など）
    const schoolPhotos = photos.filter(ph => {
        const phSchoolClean = cleanStr(ph.school);
        return phSchoolClean === cleanPSchool ||
               phSchoolClean.includes(cleanPSchool) ||
               cleanPSchool.includes(phSchoolClean);
    });

    const pNum = parseNum(player.number);
    const pCleanName = cleanStr(player.name);

    // 優先度1: 同じ高校で「背番号かつ氏名」が一致
    if (pNum !== null && pCleanName) {
        const exactMatch = schoolPhotos.find(ph => {
            const phNum = parseNum(ph.number);
            const phCleanName = cleanStr(ph.name);
            return phNum !== null && phNum === pNum &&
                   phCleanName && (phCleanName.includes(pCleanName) || pCleanName.includes(phCleanName));
        });
        if (exactMatch) return exactMatch;
    }

    // 優先度2: 同じ高校で「背番号」が一致（例: "01" と "1"）
    if (pNum !== null) {
        const numMatch = schoolPhotos.find(ph => {
            const phNum = parseNum(ph.number);
            return phNum !== null && phNum === pNum;
        });
        if (numMatch) return numMatch;
    }

    // 優先度3: 同じ高校で「氏名」が一致（スペース除去での部分一致）
    if (pCleanName) {
        const nameMatch = schoolPhotos.find(ph => {
            const phCleanName = cleanStr(ph.name);
            return phCleanName && (phCleanName.includes(pCleanName) || pCleanName.includes(phCleanName));
        });
        if (nameMatch) return nameMatch;
    }

    // 優先度4: 高校の指定が曖昧な場合、全写真から氏名で一致
    if (pCleanName) {
        const globalNameMatch = photos.find(ph => {
            const phCleanName = cleanStr(ph.name);
            return phCleanName && (phCleanName.includes(pCleanName) || pCleanName.includes(phCleanName));
        });
        if (globalNameMatch) return globalNameMatch;
    }

    return null;
}
