import { useCallback } from 'react';
import { useTelop } from '@sdk/TelopHubSDK';

/** CG を送出しても消さないテロップ（左上の小得点・タイマーと、タイマーに付くアディショナルタイム） */
export const KEEP_ON_TAKE = ['小得点', 'タイマー', 'アディショナルタイム'];

/** 送出の前に消すテロップ（KEEP_ON_TAKE 以外の全テロップ） */
const CLEAR_ON_TAKE = [
    '大得点', '1Shot', '1Shotカード', 'フォーメーション左', 'フォーメーション右', '左下ミニフォーメーション',
    'サブ下位置左', 'PK', '左上PK', 'スタッツ', '気象', '選手交代1枚', '選手交代2枚'
];

/**
 * 手動のクリアボタン用。表示中フラグが実際とずれていても消えるよう、フラグを見ずに HIDE を送る。
 * clearCg: 小得点・タイマー・AT 以外を消す／clearAll: 小得点・タイマー・AT も含めて全部消す
 */
export function useClearButtons() {
    const telops = [...CLEAR_ON_TAKE, ...KEEP_ON_TAKE].map(name => ({ name, telop: useTelop(name) }));
    const hideWhere = (pick: (name: string) => boolean) => telops.forEach(({ name, telop }) => { if (pick(name)) telop.hide(); });
    return {
        clearCg: () => hideWhere(name => !KEEP_ON_TAKE.includes(name)),
        clearAll: () => hideWhere(() => true)
    };
}

/**
 * CG が重ならないよう、送出の直前に他の CG を消す関数を返す。
 * keep に渡したテロップ（これから出すもの）と KEEP_ON_TAKE は消さない
 */
export function useClearForTake() {
    // テロップ一覧は固定なので、ループ内で useTelop を呼んでも呼び出し順は変わらない
    const telops = CLEAR_ON_TAKE.map(name => ({ name, telop: useTelop(name) }));

    return useCallback((keep: string | string[] = []) => {
        const keepList = Array.isArray(keep) ? keep : [keep];
        telops.forEach(({ name, telop }) => {
            if (!keepList.includes(name) && telop.isVisible) telop.hide();
        });
    }, telops.map(t => t.telop));
}
