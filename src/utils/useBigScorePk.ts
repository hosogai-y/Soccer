import { useEffect, useRef } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import { useTelop } from './telop';
import { useScorerCg } from './useScorerCg';
import { useClearForTake, takeOrUpdate } from './cgExclusive';
import { isPvMode } from './pv';
import { SCORER_ROWS } from './scorers';
import { BIG_SCORE_STATUS_KEY, useBigScoreStatus } from './bigScoreStatus';

/**
 * PK 戦の結果込みの大得点（大得点PK / 大得点得点者PK テロップ）。
 * 大得点と得点者の間に「4 PK 5」（左チーム・右チームの順。大得点の並びと同じ）を出す。
 * 得点者込みにするかは、大得点の「得点者込みで送出」と同じ設定を使う。
 * ステータスは PK 戦なので、終了表示なら「試合終了」（PK 結果はステータスの上）、表示なしなら出さない。
 */
export const BIG_PK_TELOP = '大得点PK';
export const SCORER_PK_TELOP = '大得点得点者PK';

type PkKicks = { firstSide?: 'left' | 'right', teamFirst?: string, kicksFirst?: string[], kicksSecond?: string[] };

/** PK 戦の成功数を、大得点の左右（Lineups の OA 左チーム・右チーム）に並べ直す */
export function pkScoresByLeftRight(state: PkKicks | null | undefined, oaRightTeam: string): { left: number, right: number } {
    const goals = (k?: string[]) => (k || []).filter(x => x === 'goal').length;
    const first = goals(state?.kicksFirst);
    const second = goals(state?.kicksSecond);
    const firstSide = state?.firstSide || (state?.teamFirst && state.teamFirst === oaRightTeam ? 'right' : 'left');
    return firstSide === 'left' ? { left: first, right: second } : { left: second, right: first };
}

const SCORER_ROW_KEY = new RegExp(`^[左右]得点(者|時間)[1-${SCORER_ROWS}]$`);

export function useBigScorePk() {
    const scorer = useScorerCg();
    const bigPk = useTelop(BIG_PK_TELOP);
    const scorerPk = useTelop(SCORER_PK_TELOP);
    const clearForTake = useClearForTake();
    const [pkState] = useSyncedState<PkKicks | null>('pk_shootout_state', null);
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const { pkStatus } = useBigScoreStatus();
    const pk = pkScoresByLeftRight(pkState, oaRightTeam);
    const pkKeys = { '左PK得点': String(pk.left), '右PK得点': String(pk.right), [BIG_SCORE_STATUS_KEY]: pkStatus };

    /** 得点者込みなら得点者の行も入れる。page は得点者のページ */
    const buildPayload = (withScorers: boolean, page: number): Record<string, string> => {
        const all = scorer.buildPayload(page) as Record<string, string>;
        const base = withScorers ? all : Object.fromEntries(Object.entries(all).filter(([k]) => !SCORER_ROW_KEY.test(k)));
        return { ...base, ...pkKeys };
    };

    const take = () => {
        if (scorer.enabled) {
            // 送出中なら今のページのまま UPDATE、出ていなければ 1 ページ目（最新の 4 件）から
            const onAir = scorerPk.isVisible && !isPvMode();
            const page = onAir ? scorer.page : 0;
            if (!onAir && !isPvMode()) scorer.setPage(0);
            const payload = buildPayload(true, page);
            scorerPk.setData(payload);
            takeOrUpdate(scorerPk, payload, () => clearForTake(SCORER_PK_TELOP));
            return;
        }
        const payload = buildPayload(false, 0);
        bigPk.setData(payload);
        takeOrUpdate(bigPk, payload, () => clearForTake(BIG_PK_TELOP));
    };

    const hide = () => {
        bigPk.hide();
        scorerPk.hide();
    };

    return { pk, withScorers: scorer.enabled, setWithScorers: scorer.setEnabled, take, hide, bigPk, scorerPk, buildPayload, page: scorer.page };
}

/**
 * PK 結果込みの大得点が送出中なら、PK の結果・得点・得点者・ページが変わったときにその場で UPDATE する。
 * App に常に置く（ScorerCgSync と同じ）
 */
export function BigScorePkSync() {
    const { bigPk, scorerPk, buildPayload, page } = useBigScorePk();
    const targets = [
        { telop: bigPk, payload: buildPayload(false, 0) },
        { telop: scorerPk, payload: buildPayload(true, page) }
    ];
    const lastSent = useRef<Record<string, string>>({});

    targets.forEach(({ telop, payload }) => {
        const json = JSON.stringify(payload);
        // eslint-disable-next-line react-hooks/rules-of-hooks -- 2 つ固定なので呼び出し順は変わらない
        useEffect(() => {
            const name = telop.name;
            if (!telop.isVisible) {
                lastSent.current[name] = '';
                return;
            }
            // 送出直後は TAKE で送った内容と同じなので送らない
            if (!lastSent.current[name]) {
                lastSent.current[name] = json;
                return;
            }
            if (lastSent.current[name] === json) return;
            lastSent.current[name] = json;
            telop.setData(payload);
            telop.update(payload);
        }, [json, telop.isVisible]);
    });
    return null;
}
