import { useEffect, useRef } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import { useTelop } from './telop';
import { useOaTeamSettings } from './useScoreSideChange';
import { teamColorKeys } from './teamColor';
import { encodePhotoUrl } from './photoMatcher';

/**
 * 対戦カード（某対某）。大得点の帯にチーム名、中央に試合時間、上にタイトル。
 * 「対戦カード」はタイトルが文字、「対戦カード画像」はタイトルが画像（Lineups でアップロード）
 */
export const MATCHUP_TEXT_TELOP = '対戦カード';
export const MATCHUP_IMAGE_TELOP = '対戦カード画像';
export const MATCHUP_TELOPS = [MATCHUP_TEXT_TELOP, MATCHUP_IMAGE_TELOP];

// Lineups で入力する内容
export const MATCHUP_CARD_KEY = 'matchup_card';
export type MatchupCard = {
    title: string;       // タイトル（文字版）
    titleImage: string;  // タイトル画像の URL（画像版。uploadAsset の URL）
    first: number;       // 前半の分
    second: number;      // 後半の分
    extraFirst: number;  // 延長前半の分（延長前半・後半とも 0 = 延長なし）
    extraSecond: number; // 延長後半の分
};
export const DEFAULT_MATCHUP_CARD: MatchupCard = { title: '', titleImage: '', first: 40, second: 40, extraFirst: 10, extraSecond: 10 };

// タイトル画像の保存先（プロジェクト内 assets/ 配下）
export const TITLE_ASSET_DIR = 'assets/title';

/** 試合時間の表記（一覧用）。line1「前半40分/後半40分」、line2「延長前半10分/延長後半10分」（延長なしは ''） */
export function matchTimeLines(card: MatchupCard): { line1: string, line2: string } {
    const line1 = `前半${card.first}分/後半${card.second}分`;
    const hasExtra = card.extraFirst > 0 || card.extraSecond > 0;
    return { line1, line2: hasExtra ? `延長前半${card.extraFirst}分/延長後半${card.extraSecond}分` : '' };
}

// MatchTimer の前後半（match_timer_period）と、対戦カードの分数の対応
export const MATCH_PERIODS = ['前半', '後半', '延長前半', '延長後半'] as const;
const PERIOD_FIELD: Record<string, keyof MatchupCard> = {
    '前半': 'first', '後半': 'second', '延長前半': 'extraFirst', '延長後半': 'extraSecond'
};

/** MatchTimer で選んでいる前後半の項目だけ（例: 後半40分）。CG の得点エリアにはこれを出す */
export function currentPeriodLabel(card: MatchupCard, period: string): string {
    const p = (MATCH_PERIODS as readonly string[]).includes(period) ? period : '前半';
    return `${p}${card[PERIOD_FIELD[p]]}分`;
}

export function useMatchupCard() {
    const [card, setCard] = useSyncedState<MatchupCard>(MATCHUP_CARD_KEY, DEFAULT_MATCHUP_CARD);
    // 以前の形式（half / extra）で保存されていれば、前半・後半／延長前半・後半に読み替える
    const legacy = (card || {}) as Partial<MatchupCard> & { half?: number, extra?: number };
    const c: MatchupCard = {
        ...DEFAULT_MATCHUP_CARD,
        ...(legacy.half !== undefined ? { first: legacy.half, second: legacy.half } : {}),
        ...(legacy.extra !== undefined ? { extraFirst: legacy.extra, extraSecond: legacy.extra } : {}),
        ...legacy
    };
    const update = (patch: Partial<MatchupCard>) => setCard({ ...c, ...patch });
    return { card: c, update };
}

/** 対戦カードのペイロード（チーム名は大得点の表記、色は TeamSettings） */
export function useMatchupPayload() {
    const { card } = useMatchupCard();
    const oa = useOaTeamSettings();
    // MatchTimer の前後半（前半・後半・延長前半・延長後半）に当たる項目だけを 1 行で出す。
    // 前後半を切り替えると、送出中の対戦カードも MatchupCgSync がその場で UPDATE する
    const [timerPeriod] = useSyncedState<string>('match_timer_period', '前半');
    const periodLabel = currentPeriodLabel(card, timerPeriod || '前半');
    const common = {
        '左チーム名': oa.leftBigName,
        '右チーム名': oa.rightBigName,
        // テロップは 試合時間2 が空なら「試合時間」を 1 行で中央に出す
        '試合時間': periodLabel,
        '試合時間1': periodLabel,
        '試合時間2': '',
        ...teamColorKeys(oa.leftSet, 'L'),
        ...teamColorKeys(oa.rightSet, 'R')
    };
    return {
        card,
        text: { ...common, 'タイトル': card.title },
        image: { ...common, 'タイトル画像': card.titleImage ? encodePhotoUrl(card.titleImage) : '' }
    };
}

/**
 * 対戦カードが送出中なら、タイトル・試合時間・チーム名・色が変わったときにその場で UPDATE する（App に常に置く）
 */
export function MatchupCgSync() {
    const textTelop = useTelop(MATCHUP_TEXT_TELOP);
    const imageTelop = useTelop(MATCHUP_IMAGE_TELOP);
    const { text, image } = useMatchupPayload();
    useLiveUpdate(textTelop, text);
    useLiveUpdate(imageTelop, image);
    return null;
}

function useLiveUpdate(telop: ReturnType<typeof useTelop>, payload: Record<string, string>) {
    const json = JSON.stringify(payload);
    const lastRef = useRef('');
    useEffect(() => {
        if (!telop.isVisible) {
            lastRef.current = '';
            return;
        }
        // 送出直後は TAKE で送った内容なので送らない
        if (lastRef.current === '') {
            lastRef.current = json;
            return;
        }
        if (lastRef.current === json) return;
        lastRef.current = json;
        telop.setData(payload);
        telop.update(payload);
    }, [json, telop.isVisible]);
}
