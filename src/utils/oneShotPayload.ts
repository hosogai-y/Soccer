import type { Player } from '../components/PlayerRegistry';
import type { TeamConfig } from '../components/TeamSettings';
import type { StaffMember } from './staff';
import { teamColorSet, teamColorKeys } from './teamColor';
import { normalizePosition } from './lineup';
import { toPhotoAssetUrl } from './photoMatcher';

/**
 * 1Shot テロップのペイロード。CG Operation の送出と、Player Registry の「1SHOT確認用 PNG」書き出しで同じものを使う。
 */
export type OneShotMode = 'pro2' | 'today' | 'total';
export type CommentChoice = { text: string, isYellow?: boolean };

/** 選手の登録済みプロ2コメント（空は除く。旧形式の pro2Comment だけのときはそれ 1 件） */
export function playerComments(player: Player): CommentChoice[] {
    return (player.pro2List && player.pro2List.length > 0)
        ? player.pro2List.filter(c => c.text && c.text.trim() !== '')
        : (player.pro2Comment ? [{ text: player.pro2Comment, isYellow: false }] : []);
}

/** 選手の顔写真（全体の写真 ON・選手個別の写真 ON・写真ありのときだけ） */
export function playerPhotoUrl(player: Player, globalPhotoEnabled: boolean): string {
    const url = toPhotoAssetUrl(player.photoUrl);
    return globalPhotoEnabled && player.photoEnabled !== false && url ? url : '';
}

export function buildPlayerOneShotPayload(args: {
    player: Player,
    teamConfig: TeamConfig | undefined,
    side: 'left' | 'right',
    school: string,
    mode: OneShotMode,
    commentText: string,
    isYellow: boolean,
    photoUrl: string
}) {
    const { player, teamConfig, side, school, mode, commentText, isYellow, photoUrl } = args;
    const colorSet = teamColorSet(teamConfig, side);
    // 黄色フラグONなら「プロ2コメント黄色」を使い、「プロ2コメント」は空文字(非表示)。OFFならその逆
    const yellowComment = (mode === 'pro2' && isYellow) ? commentText : '';
    const whiteComment = (mode === 'pro2' && !isYellow) ? commentText : '';
    const hasPhoto = !!photoUrl;
    return {
        'TeamColor': colorSet.color,
        ...teamColorKeys(colorSet), // CG のチームカラーザブトン（ColorRect / ColorRect2 / ColorEdge）
        '背番号': player.number || '',
        '氏名': player.name || '',
        'ポジション': normalizePosition(player.position) || 'FW',
        '所属': teamConfig?.oneShotName || school, // １SHOT上段のチーム名表記
        '学年': (player.grade || '').replace('年', ''),
        '学年単位': '年', // スタッフ送出時は「歳」に差し替わるので毎回送る
        '役職表示': '0', // 0: 選手（身長・体重を表示し、ポジションは通常位置）
        '身長': player.height || '',
        '体重': player.weight || '',
        'プロ2コメント': whiteComment,
        'プロ２コメント': whiteComment,
        'プロ2コメント黄色': yellowComment,
        'プロ２コメント黄色': yellowComment,
        'isYellow': isYellow,
        'pro2IsYellow': isYellow,
        'useYellowText': isYellow,
        'yellowFlag': isYellow,
        '黄色フラグ': isYellow,
        'Today\'s数値': player.todayGoals || '0',
        'Total数値': player.totalGoals || '0',
        '顔写真': photoUrl,
        '顔写真_visible': hasPhoto,
        'showPhoto': hasPhoto,
        'mode': mode
    };
}

export function buildStaffOneShotPayload(args: {
    member: StaffMember,
    teamConfig: TeamConfig | undefined,
    side: 'left' | 'right',
    school: string,
    comment: CommentChoice
}) {
    const { member, teamConfig, side, school, comment } = args;
    const colorSet = teamColorSet(teamConfig, side);
    const yellow = comment.isYellow ? comment.text : '';
    const white = comment.isYellow ? '' : comment.text;
    return {
        'TeamColor': colorSet.color,
        ...teamColorKeys(colorSet),
        '背番号': '',
        '氏名': member.name,
        'ポジション': member.role,
        '所属': teamConfig?.oneShotName || school,
        '学年': member.age,
        '学年単位': member.age ? '歳' : '',
        '役職表示': '1', // 1: スタッフ（身長・体重を隠し、役職を背番号位置のザブトン上に出す）
        '身長': '',
        '体重': '',
        'プロ2コメント': white,
        'プロ２コメント': white,
        'プロ2コメント黄色': yellow,
        'プロ２コメント黄色': yellow,
        "Today's数値": '',
        'Total数値': '',
        '顔写真': '',
        '顔写真_visible': false,
        'mode': 'pro2'
    };
}
