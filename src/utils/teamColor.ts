import type { TeamConfig } from '../components/TeamSettings';

/**
 * チームカラー一式（TeamSettings で指定）。すべての CG のチームカラーザブトンはこれで塗る。
 * - color  : カラー1（ザブトンの左半分。1 色だけのチームは全体）
 * - color2 : カラー2（ザブトンの右半分。未指定ならカラー1 と同じ = 1 色）
 * - edge   : エッジ（ザブトンの左右 4px）の色。エッジなしは ''（テロップ側でエッジを出さない）
 */
export type TeamColorSet = { color: string; color2: string; edge: string };

export const LEFT_FALLBACK_COLOR = '#198754';
export const RIGHT_FALLBACK_COLOR = '#0dcaf0';

/** TeamSettings からチームカラー一式を作る（チームが見つからないときは画面の左右カラー） */
export function teamColorSet(config: TeamConfig | undefined, side: 'left' | 'right' = 'left'): TeamColorSet {
    const color = config?.color || (side === 'right' ? RIGHT_FALLBACK_COLOR : LEFT_FALLBACK_COLOR);
    return {
        color,
        color2: config?.color2Enabled && config.color2 ? config.color2 : color,
        edge: config?.edgeEnabled ? (config.edgeColor || '#ffffff') : ''
    };
}

/**
 * テロップのチームカラーキー。
 * suffix '' : ColorRect / ColorRect2 / ColorEdge（1 チームだけの CG: 1Shot・フォーメーション・交代など）
 * suffix 'L' / 'R' : ColorRectL / ColorRectL2 / ColorEdgeL など（左右チームの CG: 小得点・大得点・スタッツ）
 */
export function teamColorKeys(set: TeamColorSet, suffix: '' | 'L' | 'R' = ''): Record<string, string> {
    return {
        [`ColorRect${suffix}`]: set.color,
        [`ColorRect${suffix}2`]: set.color2,
        [`ColorEdge${suffix}`]: set.edge
    };
}

/** 画面表示用: カラー1・カラー2 を左右に並べた背景（CSS） */
export function teamColorCss(set: TeamColorSet): string {
    return set.color2 && set.color2 !== set.color
        ? `linear-gradient(90deg, ${set.color} 0 50%, ${set.color2} 50% 100%)`
        : set.color;
}
