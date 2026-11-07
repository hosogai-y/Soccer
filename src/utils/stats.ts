import { TeamColorSet, teamColorKeys } from './teamColor';

export type StatsData = {
    leftShoot: string;
    rightShoot: string;
    leftFK: string;
    rightFK: string;
    leftCK: string;
    rightCK: string;
    leftYellow: string;
    rightYellow: string;
    leftRed: string;
    rightRed: string;
};

export const STATS_DATA_KEY = 'match_stats_data';

export const EMPTY_STATS: StatsData = {
    leftShoot: '0', rightShoot: '0',
    leftFK: '0', rightFK: '0',
    leftCK: '0', rightCK: '0',
    leftYellow: '0', rightYellow: '0',
    leftRed: '0', rightRed: '0'
};

/** スタッツの左右を入れ替える */
export function swapStats(s?: StatsData | null): StatsData {
    const c = s || EMPTY_STATS;
    return {
        leftShoot: c.rightShoot, rightShoot: c.leftShoot,
        leftFK: c.rightFK, rightFK: c.leftFK,
        leftCK: c.rightCK, rightCK: c.leftCK,
        leftYellow: c.rightYellow, rightYellow: c.leftYellow,
        leftRed: c.rightRed, rightRed: c.leftRed
    };
}

/** スタッツテロップのペイロード（チーム名・得点・チームカラーは小得点とリンク） */
export function buildStatsPayload(
    score: { leftName: string, rightName: string, leftScore: string, rightScore: string, leftSet?: TeamColorSet, rightSet?: TeamColorSet },
    statsData?: StatsData | null
) {
    return {
        // チームカラーザブトン（ColorRectL/L2・ColorEdgeL など）。色が分からないときは送らずテロップの色のまま
        ...(score.leftSet ? teamColorKeys(score.leftSet, 'L') : {}),
        ...(score.rightSet ? teamColorKeys(score.rightSet, 'R') : {}),
        '左側チーム名': score.leftName,
        '右側チーム名': score.rightName,
        'Left得点数値': score.leftScore,
        'Right得点数値': score.rightScore,
        '左側シュート数値': statsData?.leftShoot || '0',
        '右側シュート数値': statsData?.rightShoot || '0',
        '左側FK数値': statsData?.leftFK || '0',
        '右側FK数値': statsData?.rightFK || '0',
        '左側CK数値': statsData?.leftCK || '0',
        '右側CK数値': statsData?.rightCK || '0',
        '左側イエロー数値': statsData?.leftYellow || '0',
        '右側イエロー数値': statsData?.rightYellow || '0',
        '左側レッド数値': statsData?.leftRed || '0',
        '右側レッド数値': statsData?.rightRed || '0'
    };
}
