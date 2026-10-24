/**
 * 陣形フォーメーションの配置（フォーメーション左／右テロップのプレート位置）。
 * 座標はテロップ座標系 (1920x1080) のプレート左上で、左チーム向き（GK が左端・右へ攻める）を正として保存する。
 * 右チーム（フォーメーション右）では点対称に反転して送る。
 */

export type Point = { x: number; y: number };

export type FormationLayout = {
    system: string; // 例: 4-4-2（TeamSettings の基本フォーメーション）
    positions: Record<string, Point>; // PS1〜PS11 -> プレート左上（左チーム向き）
};

export type Role = 'GK' | 'DF' | 'MF' | 'FW';

export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const PLATE_W = 318;
export const PLATE_H = 46;

export const PS_IDS = Array.from({ length: 11 }, (_, i) => `PS${i + 1}`);

const GK_POS: Point = { x: 49, y: 864 };
const LINE_X_FIRST = 400;
const LINE_X_LAST = 1480;
const LINE_CENTER_Y = 857;
// 左右反転時の y 軸（プレート上端の和）。旧テロップの左右配置に合わせた値
const MIRROR_Y_SUM = LINE_CENTER_Y * 2;

/** '4-2-3-1' -> [4, 2, 3, 1]（フィールドプレーヤーが10人でなければ 4-4-2 扱い） */
export function parseSystem(system: string): number[] {
    const lines = (system || '').split('-').map(n => parseInt(n, 10)).filter(n => n > 0);
    return lines.length >= 2 && lines.reduce((a, b) => a + b, 0) === 10 ? lines : [4, 4, 2];
}

/** PS1 は GK、以降は最終ラインから順に DF → MF → FW */
export function roleMap(system: string): Record<string, Role> {
    const lines = parseSystem(system);
    const roles: Record<string, Role> = { PS1: 'GK' };
    let n = 2;
    lines.forEach((count, li) => {
        const role: Role = li === 0 ? 'DF' : li === lines.length - 1 ? 'FW' : 'MF';
        for (let i = 0; i < count; i++) roles[`PS${n++}`] = role;
    });
    return roles;
}

/** 基本フォーメーションの標準配置（ラインごとに縦一列、ライン内は上から PS 番号順） */
export function defaultPositions(system: string): Record<string, Point> {
    const lines = parseSystem(system);
    const positions: Record<string, Point> = { PS1: { ...GK_POS } };
    const step = lines.length > 1 ? (LINE_X_LAST - LINE_X_FIRST) / (lines.length - 1) : 0;
    let n = 2;
    lines.forEach((count, li) => {
        const gap = count >= 5 ? 50 : 60;
        const top = LINE_CENTER_Y - ((count - 1) * gap) / 2;
        for (let i = 0; i < count; i++) {
            positions[`PS${n++}`] = { x: Math.round(LINE_X_FIRST + step * li), y: Math.round(top + gap * i) };
        }
    });
    return positions;
}

/** 保存済み配置（欠けている枠は標準配置で補う） */
export function resolvePositions(layout: FormationLayout | undefined, fallbackSystem: string): Record<string, Point> {
    const base = defaultPositions(layout?.system || fallbackSystem);
    return { ...base, ...(layout?.positions || {}) };
}

export const clampPoint = (p: Point): Point => ({
    x: Math.round(Math.min(Math.max(p.x, 0), CANVAS_W - PLATE_W)),
    y: Math.round(Math.min(Math.max(p.y, 0), CANVAS_H - PLATE_H))
});

/** 左チーム向きの座標 -> 指定サイドのテロップ座標（右は点対称。自身の逆変換にもなる） */
export function toSidePosition(p: Point, side: 'left' | 'right'): Point {
    if (side === 'left') return { x: p.x, y: p.y };
    return { x: CANVAS_W - PLATE_W - p.x, y: MIRROR_Y_SUM - p.y };
}
