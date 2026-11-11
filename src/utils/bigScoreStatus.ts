import { useEffect } from 'react';
import { useSyncedState, useTelopHub } from '@sdk/TelopHubSDK';
import { useTelop } from './telop';

/**
 * 大得点のステータス（得点の上に出す「前半終了」など）。
 * 大得点 / 大得点得点者 / 大得点PK / 大得点得点者PK テロップのキー「ステータス」（空なら出さない）。
 *
 * CG Operation の選択は「表示なし」（既定）と「終了表示」の 2 つ。
 * 終了表示のときの文言は、タイマーの前後半（match_timer_period）と大得点の得点から決める
 *   前半     → 前半終了
 *   後半     → 同点なら後半終了、どちらかが勝っていれば試合終了
 *   延長前半 → 延長前半終了
 *   延長後半 → 同点なら延長後半終了、どちらかが勝っていれば試合終了
 * PK 戦の大得点（大得点PK / 大得点得点者PK）は、終了表示なら「試合終了」、表示なしなら出さない。
 */
export const BIG_SCORE_STATUS_KEY = 'ステータス';
export const PK_BIG_SCORE_STATUS = '試合終了';

// 終了表示にするか（false = 表示なし。既定）
const SHOW_STATE_KEY = 'big_score_status_show';

export function autoBigScoreStatus(period: string, leftScore: string | number, rightScore: string | number): string {
    const tied = (parseInt(String(leftScore || '0'), 10) || 0) === (parseInt(String(rightScore || '0'), 10) || 0);
    switch (period) {
        case '後半': return tied ? '後半終了' : '試合終了';
        case '延長前半': return '延長前半終了';
        case '延長後半': return tied ? '延長後半終了' : '試合終了';
        default: return '前半終了';
    }
}

export function useBigScoreStatus() {
    const bigScore = useTelop('大得点');
    const [period] = useSyncedState<string>('match_timer_period', '前半');
    const [show, setShow] = useSyncedState<boolean>(SHOW_STATE_KEY, false);
    const big = bigScore.data || {};
    // 終了表示にしたときの文言（表示なしのときも選択欄の案内に使う）
    const endLabel = autoBigScoreStatus(period || '前半', big['左チーム得点'], big['右チーム得点']);
    return {
        show: !!show,
        setShow,
        endLabel,
        /** テロップに送る値（表示なしなら空） */
        status: show ? endLabel : '',
        /** PK 戦の大得点に送る値 */
        pkStatus: show ? PK_BIG_SCORE_STATUS : ''
    };
}

/**
 * 大得点のデータにステータスを入れておき、送出中なら変わったときにその場で UPDATE する。
 * （得点者込み・PK 込みの大得点は ScorerCgSync / BigScorePkSync が payload ごと更新する）
 * App に常に置く
 */
export function BigScoreStatusSync() {
    const bigScore = useTelop('大得点');
    const { status } = useBigScoreStatus();
    const { sdk, isConnected, isSyncingSnapshot } = useTelopHub();
    const current = (bigScore.data || {})[BIG_SCORE_STATUS_KEY];
    useEffect(() => {
        // 接続直後の読み込み中は書かない（読み込んだ値を古い値で上書きしないように）
        if (!sdk || !isConnected || isSyncingSnapshot) return;
        if (current === status) return;
        const next = { ...(bigScore.data || {}), [BIG_SCORE_STATUS_KEY]: status };
        bigScore.setData((prev: any) => ({ ...prev, [BIG_SCORE_STATUS_KEY]: status }));
        if (bigScore.isVisible) bigScore.update(next);
    }, [sdk, isConnected, isSyncingSnapshot, status, current, bigScore.isVisible]);
    return null;
}
