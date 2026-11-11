import { useCallback, useEffect, useRef } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import { useTelop } from './telop';
import type { Player } from '../components/PlayerRegistry';
import { useMatchLog } from './useMatchLog';
import { useOaTeamSettings, scoreColorKeys } from './useScoreSideChange';
import { useBigScoreStatus, BIG_SCORE_STATUS_KEY } from './bigScoreStatus';
import {
    SCORER_TELOP, BIG_SCORE_WITH_SCORERS_KEY, SCORER_PAGE_KEY, PERIOD_MINUTES_KEY,
    PeriodMinutes, DEFAULT_PERIOD_MINUTES, scorerLines, scorerPageCount, scorerRowKeys, normalizePeriodMinutes
} from './scorers';

/** 試合時間の設定（前後半・延長の長さと得点時間の表記）。Lineups で設定し、ログ・大得点得点者・音声送出で使う */
export function usePeriodMinutes(): [Required<PeriodMinutes>, (next: PeriodMinutes) => void] {
    const [lengths, setLengths] = useSyncedState<PeriodMinutes>(PERIOD_MINUTES_KEY, DEFAULT_PERIOD_MINUTES);
    const len = normalizePeriodMinutes(lengths);
    const set = useCallback((next: PeriodMinutes) => setLengths(normalizePeriodMinutes(next)), [setLengths]);
    return [len, set];
}

/**
 * 大得点得点者テロップのデータ。チーム名・得点は大得点と同じ値（大得点の表記）、色は TeamSettings、
 * 得点者は当日操作ログのゴールから作る
 */
export function useScorerCg() {
    const scorerTelop = useTelop(SCORER_TELOP);
    const bigScore = useTelop('大得点');
    const { entries } = useMatchLog();
    const [players] = useSyncedState<Player[]>('roster', []);
    const [enabled, setEnabled] = useSyncedState<boolean>(BIG_SCORE_WITH_SCORERS_KEY, false);
    const [page, setPage] = useSyncedState<number>(SCORER_PAGE_KEY, 0);
    const [len, setLengths] = usePeriodMinutes();
    const oa = useOaTeamSettings();
    const { status } = useBigScoreStatus();

    const left = scorerLines(entries, oa.oaLeftTeam, players || [], len);
    const right = scorerLines(entries, oa.oaRightTeam, players || [], len);
    const pageCount = scorerPageCount(left, right);
    const currentPage = Math.min(Math.max(0, page || 0), pageCount - 1);

    const big = bigScore.data || {};
    const buildPayload = useCallback((p: number) => ({
        '左チーム名': big['左チーム名'] || oa.leftBigName,
        '右チーム名': big['右チーム名'] || oa.rightBigName,
        '左チーム得点': big['左チーム得点'] || '0',
        '右チーム得点': big['右チーム得点'] || '0',
        ...scoreColorKeys(oa.leftSet, oa.rightSet),
        ...scorerRowKeys(left, right, p),
        [BIG_SCORE_STATUS_KEY]: status
    }), [big, oa, left, right, status]);

    return {
        scorerTelop, enabled: !!enabled, setEnabled,
        left, right, page: currentPage, pageCount, setPage,
        lengths: len, setLengths, buildPayload
    };
}

/**
 * 大得点得点者が送出中なら、ゴールの記録・修正、得点、チーム名、色、ページが変わったらその場で UPDATE する。
 * App に常に置く（Lineups の当日操作ログでゴールを記録・修正したときも CG に反映する）
 */
export function ScorerCgSync() {
    const { scorerTelop, page, buildPayload } = useScorerCg();
    const payload = buildPayload(page);
    const json = JSON.stringify(payload);
    const lastSentRef = useRef<string>('');

    useEffect(() => {
        if (!scorerTelop.isVisible) {
            lastSentRef.current = '';
            return;
        }
        // 送出直後は TAKE で送った内容と同じなので送らない（TAKE 側で記録する）
        if (lastSentRef.current === '') {
            lastSentRef.current = json;
            return;
        }
        if (lastSentRef.current === json) return;
        lastSentRef.current = json;
        scorerTelop.setData(payload);
        scorerTelop.update(payload);
    }, [json, scorerTelop.isVisible]);

    return null;
}
