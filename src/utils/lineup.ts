import type { Player } from '../components/PlayerRegistry';
import { FormationLayout, resolvePositions, toSidePosition } from './formationLayout';

/**
 * スタメン・控えの登録データとフォーメーション／控え選手テロップのペイロード生成。
 * 登録データは学校名ごとに synced state `team_lineups` に保存する（サイド反転・対戦校変更でも崩れない）。
 */

// フォーメーションテロップ（フォーメーション左／右）の枠。id は登録データ (team_lineups) の保存キー、
// ps はテロップのグループ名・KeyExp `<ps>_氏名` 等と一致させる
export const FORMATION_SLOTS = [
    { id: 'GK', ps: 'PS1', label: 'GK', posPrefix: 'GK' },
    { id: 'DF1', ps: 'PS2', label: 'DF (1)', posPrefix: 'DF' },
    { id: 'DF2', ps: 'PS3', label: 'DF (2)', posPrefix: 'DF' },
    { id: 'DF3', ps: 'PS4', label: 'DF (3)', posPrefix: 'DF' },
    { id: 'DF4', ps: 'PS5', label: 'DF (4)', posPrefix: 'DF' },
    { id: 'MF1', ps: 'PS6', label: 'MF (1)', posPrefix: 'MF' },
    { id: 'MF2', ps: 'PS7', label: 'MF (2)', posPrefix: 'MF' },
    { id: 'MF3', ps: 'PS8', label: 'MF (3)', posPrefix: 'MF' },
    { id: 'MF4', ps: 'PS9', label: 'MF (4)', posPrefix: 'MF' },
    { id: 'MF5', ps: 'PS10', label: 'MF (5)', posPrefix: 'MF' },
    { id: 'FW', ps: 'PS11', label: 'FW', posPrefix: 'FW' }
];

// サブ下位置左テロップの控え枠数（KeyExp 選手名1〜9）
export const SUB_SLOT_COUNT = 9;

export type TeamLineup = {
    starters: Record<string, string>; // slotId -> player.id
    subs: string[]; // 控え枠順の player.id（空枠は ''）
    formation?: FormationLayout; // 陣形（未設定ならチーム設定の基本フォーメーションの標準配置）
    updatedAt?: number;
};

export const TEAM_LINEUPS_KEY = 'team_lineups';

export const emptyLineup = (): TeamLineup => ({ starters: {}, subs: Array(SUB_SLOT_COUNT).fill('') });

/** 旧形式 (left_lineup / right_lineup, 4-4-2 の FW1/FW2) を新しい枠に読み替える */
export function migrateStarters(old: Record<string, string> | undefined): Record<string, string> {
    const out: Record<string, string> = {};
    if (!old) return out;
    FORMATION_SLOTS.forEach(slot => {
        if (old[slot.id]) out[slot.id] = old[slot.id];
    });
    if (!out.FW && old.FW1) out.FW = old.FW1;
    return out;
}

/** 登録済みかどうか（スタメンか控えが1人でもいる） */
export function hasRegistered(lineup?: TeamLineup | null): boolean {
    if (!lineup) return false;
    return Object.values(lineup.starters || {}).some(Boolean) || (lineup.subs || []).some(Boolean);
}

const findPlayer = (players: Player[], id?: string) => (id ? players.find(p => p.id === id) : undefined);

/** 登録順のスタメン選手（フォーメーション枠順） */
export function registeredStarters(lineup: TeamLineup | undefined, players: Player[]): Player[] {
    return FORMATION_SLOTS
        .map(slot => findPlayer(players, lineup?.starters?.[slot.id]))
        .filter((p): p is Player => !!p);
}

/** 登録順の控え選手 */
export function registeredSubs(lineup: TeamLineup | undefined, players: Player[]): Player[] {
    return (lineup?.subs || [])
        .map(id => findPlayer(players, id))
        .filter((p): p is Player => !!p);
}

export const formatGrade = (grade?: string) => {
    if (!grade) return '';
    return grade.includes('年') ? `(${grade})` : `(${grade}年)`;
};

const SUB_POSITION_IMAGES: Record<string, string> = {
    GK: 'img/HD2D_F01_new_BaseGK_FIX.png',
    DF: 'img/HD2D_F01_new_BaseDF_FIX.png',
    MF: 'img/HD2D_F01_new_BaseMF_FIX.png',
    FW: 'img/HD2D_F01_new_BaseFW.png'
};

/** 選手交代1枚／2枚の OUT/IN ベース画像（ポジション帯）。ポジション不明時は MF */
export function subChangeBaseImage(kind: 'OUT' | 'IN', position?: string) {
    const pos = (position || '').toUpperCase().slice(0, 2);
    return `img/HD2D_S04_Base${kind}_${['GK', 'DF', 'MF', 'FW'].includes(pos) ? pos : 'MF'}.png`;
}

/**
 * フォーメーション左／右のペイロード（空枠は '' を送り、テロップ側で非表示になる）。
 * <ps>_X / <ps>_Y はプレート左上の座標で、テロップの customJs がグループ位置に反映する。
 * ColorRect はチームカラー（チームカラーザブトンの Rectangle に反映）。
 */
export function buildFormationPayload(
    lineup: TeamLineup | undefined, players: Player[], schoolLabel: string,
    side: 'left' | 'right', fallbackSystem: string, teamColor: string
) {
    const data: Record<string, string> = { '学校名': schoolLabel, 'ColorRect': teamColor };
    const positions = resolvePositions(lineup?.formation, fallbackSystem);
    FORMATION_SLOTS.forEach(slot => {
        const p = findPlayer(players, lineup?.starters?.[slot.id]);
        const pos = toSidePosition(positions[slot.ps], side);
        data[`${slot.ps}_氏名`] = p?.name || '';
        data[`${slot.ps}_背番号`] = p?.number || '';
        data[`${slot.ps}_学年`] = formatGrade(p?.grade);
        data[`${slot.ps}_X`] = String(pos.x);
        data[`${slot.ps}_Y`] = String(pos.y);
    });
    return data;
}

/** サブ下位置左のペイロード（ポジション帯の画像は選手のポジションから選ぶ。ColorRect はチームカラー） */
export function buildSubsPayload(lineup: TeamLineup | undefined, players: Player[], schoolLabel: string, teamColor: string) {
    const data: Record<string, string> = { '学校名': schoolLabel, 'ColorRect': teamColor };
    for (let i = 0; i < SUB_SLOT_COUNT; i++) {
        const p = findPlayer(players, lineup?.subs?.[i]);
        const n = i + 1;
        const pos = (p?.position || '').toUpperCase().slice(0, 2);
        data[`選手名${n}`] = p?.name || '';
        data[`背番号${n}`] = p?.number || '';
        data[`学年${n}`] = formatGrade(p?.grade);
        data[`ポジション${n}`] = p ? (SUB_POSITION_IMAGES[pos] || '') : '';
    }
    return data;
}
