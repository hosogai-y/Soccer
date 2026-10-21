export interface PhotoItem {
    school: string;
    filename: string;
    number: string;
    name: string;
    url: string;
}

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

// 選手情報と写真リストの照合
export function matchPlayerPhoto(
    player: { schoolName?: string; teamId?: string; number?: string; name?: string; photoUrl?: string },
    photos: PhotoItem[],
    fallbackSchool?: string
): PhotoItem | null {
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

    const targetList = schoolPhotos.length > 0 ? schoolPhotos : photos;

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

// Photoフォルダの写真一覧API取得
export async function fetchPhotoList(): Promise<PhotoItem[]> {
    // 静的ビルド (TelopHub内) と Vite開発サーバー両方に対応
    const endpoints = ['./photos.json', 'photos.json', '/photos.json', '/api/photos'];
    for (const url of endpoints) {
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            const list = (data.photos || []).map((ph: any) => ({
                ...ph,
                // 人間が読める平文パス形式 (/Photo/高校名/ファイル名) に統一
                plainUrl: `/Photo/${ph.school}/${ph.filename}`
            }));
            if (list.length > 0) return list;
        } catch {
            // 次のエンドポイントを試行
        }
    }
    return [];
}

// 高校名による写真の選別（フィルタリング）
export function getPhotosBySchool(photos: PhotoItem[], schoolName?: string): PhotoItem[] {
    if (!photos || photos.length === 0 || !schoolName) return [];
    const cleanTarget = cleanStr(schoolName);
    return photos.filter(ph => {
        const cleanSchool = cleanStr(ph.school);
        return cleanSchool === cleanTarget ||
               cleanSchool.includes(cleanTarget) ||
               cleanTarget.includes(cleanSchool);
    });
}

// 写真パスの正規化（どんな入力形式でも /Photo/高校名/顔写真.png に統一）
export function normalizePhotoUrl(
    inputPath?: string,
    schoolName?: string,
    photos: PhotoItem[] = []
): string {
    if (!inputPath || !inputPath.trim()) return '';
    let raw = inputPath.trim().replace(/\\/g, '/');

    // すでに /Photo/高校名/ファイル名 の形式になっているかチェック
    const photoMatch = raw.match(/\/Photo\/([^\/]+)\/(.+)$/i) || raw.match(/Photo\/([^\/]+)\/(.+)$/i);
    if (photoMatch) {
        const school = photoMatch[1].trim();
        const filename = photoMatch[2].trim();
        return `/Photo/${school}/${filename}`;
    }

    // パスからファイル名のみを取り出す（ディレクトリ部分を除去）
    const lastSlashIdx = raw.lastIndexOf('/');
    let filename = lastSlashIdx !== -1 ? raw.substring(lastSlashIdx + 1).trim() : raw;

    // 拡張子がない場合（例: "14 菅野桜抜き"）、.png を付与
    if (!/\.[a-zA-Z0-9]+$/.test(filename)) {
        filename += '.png';
    }

    // 高校名の決定
    const targetSchool = schoolName?.trim() || '北海';

    // もし photos リストがある場合、その高校フォルダ内の実在写真から最も近いものを照合
    if (photos && photos.length > 0) {
        const schoolPhotos = getPhotosBySchool(photos, targetSchool);
        if (schoolPhotos.length > 0) {
            // 1. ファイル名完全一致
            const exactFile = schoolPhotos.find(p => p.filename === filename);
            if (exactFile) return `/Photo/${exactFile.school}/${exactFile.filename}`;

            // 2. スペースを除去したファイル名一致
            const cleanFn = cleanStr(filename);
            const looseMatch = schoolPhotos.find(p => cleanStr(p.filename) === cleanFn);
            if (looseMatch) return `/Photo/${looseMatch.school}/${looseMatch.filename}`;
        }
    }

    return `/Photo/${targetSchool}/${filename}`;
}

// ブラウザ/SVGで安全に読み込めるURIエンコード
export function encodePhotoUrl(url?: string): string {
    if (!url) return '';
    let clean = String(url).trim();
    try {
        clean = decodeURI(clean);
    } catch {}
    return encodeURI(clean);
}
