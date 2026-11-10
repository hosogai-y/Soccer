import { useSyncedState } from '@sdk/TelopHubSDK';
import { useTelop } from './telop';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from '../components/TeamSettings';
import { StatsData, STATS_DATA_KEY, EMPTY_STATS, swapStats, buildStatsPayload } from './stats';
import { TeamColorSet, teamColorSet, teamColorKeys } from './teamColor';

/** OA 左右チームの TeamSettings（チームカラー・小得点/大得点の表記）。CGOperation 全体で同じ求め方をする */
export function useOaTeamSettings() {
    const [oaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;
    const leftConfig = teams.find(t => t.name === oaLeftTeam);
    const rightConfig = teams.find(t => t.name === oaRightTeam);
    // チームカラーは TeamSettings の OA 左チーム・右チームの色そのまま（CG に残った色から左右を推測しない）
    const leftSet = teamColorSet(leftConfig, 'left');
    const rightSet = teamColorSet(rightConfig, 'right');
    return {
        oaLeftTeam,
        oaRightTeam,
        leftSet,
        rightSet,
        leftColor: leftSet.color,
        rightColor: rightSet.color,
        leftSmallName: leftConfig?.smallScoreName || oaLeftTeam,
        rightSmallName: rightConfig?.smallScoreName || oaRightTeam,
        leftBigName: leftConfig?.bigScoreName || oaLeftTeam,
        rightBigName: rightConfig?.bigScoreName || oaRightTeam
    };
}

/** 小得点・大得点・大得点得点者に入れるチームカラーのキー一式（カラー1・カラー2・エッジ） */
export function scoreColorKeys(left: TeamColorSet, right: TeamColorSet): Record<string, string> {
    return {
        'LeftTeamColor': left.color,
        'RigtTeamColor': right.color,
        'LeftTeamColorLargePoint': left.color,
        'RightTeamColorLargePoint': right.color,
        'LeftTeamColorSmallPoint': left.color,
        'RightTeamColorSmallPoint': right.color,
        ...teamColorKeys(left, 'L'),
        ...teamColorKeys(right, 'R')
    };
}

/** CG に入っているチームカラーが、指定の色一式と同じか（カラー1・カラー2・エッジすべて） */
export function sameScoreColors(data: Record<string, any>, left: TeamColorSet, right: TeamColorSet): boolean {
    const want = scoreColorKeys(left, right);
    return Object.keys(want).every(k => (data[k] ?? '') === want[k]);
}

/**
 * 🔄 サイド反転（Match Score とスタッツタブで共通）。
 * OA 左右チーム (oa_left_team / oa_right_team) を入れ替え、得点・チーム名・チームカラー・スタッツも左右反転する。
 * チームカラーは TeamSettings の色を入れ替え後のチームに合わせて入れるので、左右がテレコにならない。
 * 送出中の小得点・大得点・スタッツはその場で UPDATE する
 */
export function useScoreSideChange() {
    const smallScore = useTelop('小得点');
    const bigScore = useTelop('大得点');
    const statsTelop = useTelop('スタッツ');
    const [, setOaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [, setOaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const [subsOnAirSide, setSubsOnAirSide] = useSyncedState<string>('subs_telop_side', '');
    const [, setAppliedNameSource] = useSyncedState<string | null>('score_team_name_source', null);
    const [statsData, setStatsData] = useSyncedState<StatsData>(STATS_DATA_KEY, EMPTY_STATS);
    const oa = useOaTeamSettings();

    return () => {
        setOaLeftTeam(oa.oaRightTeam);
        setOaRightTeam(oa.oaLeftTeam);
        // 控え選手CG（サブ下位置左）の送出中サイドもチームに合わせて入れ替える
        if (subsOnAirSide) setSubsOnAirSide(subsOnAirSide === 'left' ? 'right' : 'left');

        // OA チームの左右が入れ替わるだけなので、チーム名の入れ直しは起こさず、今の名前（手入力含む）を左右反転する
        setAppliedNameSource([oa.oaRightTeam, oa.oaLeftTeam, oa.rightSmallName, oa.leftSmallName, oa.rightBigName, oa.leftBigName].join('|'));

        const cur = smallScore.data || {};
        const curBig = bigScore.data || {};

        // 入れ替え後: 左 = 今の右チーム、右 = 今の左チーム
        const swapped = {
            '左チーム得点': cur['右チーム得点'] || curBig['右チーム得点'] || '0',
            '右チーム得点': cur['左チーム得点'] || curBig['左チーム得点'] || '0',
            ...scoreColorKeys(oa.rightSet, oa.leftSet)
        };
        // チーム名は小得点・大得点で表記が違うので、それぞれの名前を左右反転する
        const smallNames = {
            '左チーム名': cur['右チーム名'] || oa.rightSmallName,
            '右チーム名': cur['左チーム名'] || oa.leftSmallName
        };
        const bigNames = {
            '左チーム名': curBig['右チーム名'] || oa.rightBigName,
            '右チーム名': curBig['左チーム名'] || oa.leftBigName
        };
        smallScore.setData((prev: any) => ({ ...prev, ...swapped, ...smallNames }));
        bigScore.setData((prev: any) => ({ ...prev, ...swapped, ...bigNames }));

        // 送出中の小得点・大得点にも反転後の内容をその場で UPDATE する（setData は CG には届かないため）
        if (smallScore.isVisible) smallScore.update({ ...cur, ...swapped, ...smallNames });
        if (bigScore.isVisible) bigScore.update({ ...curBig, ...swapped, ...bigNames });

        const swappedStats = swapStats(statsData);
        setStatsData(swappedStats);

        // スタッツ送出中なら、反転後のチーム名・得点・チームカラー・数値で UPDATE する
        if (statsTelop.isVisible) {
            const statsPayload = buildStatsPayload({
                leftName: smallNames['左チーム名'],
                rightName: smallNames['右チーム名'],
                leftScore: swapped['左チーム得点'],
                rightScore: swapped['右チーム得点'],
                leftSet: oa.rightSet,
                rightSet: oa.leftSet
            }, swappedStats);
            statsTelop.setData(statsPayload);
            statsTelop.update(statsPayload);
        }
    };
}
