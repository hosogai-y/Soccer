import { useCallback } from 'react';
import { useTelop as useSdkTelop } from '@sdk/TelopHubSDK';
import { isPvMode, pvClear, takePvSendHook, PvLayer } from './pv';
import { useTelop } from './telop';
import { useCgQueueOnAir } from './cgQueue';

/** CG を送出しても消さないテロップ（左上の小得点・タイマーと、タイマーに付くアディショナルタイム） */
export const KEEP_ON_TAKE = ['小得点', 'タイマー', 'アディショナルタイム'];

/** 送出の前に消すテロップ（KEEP_ON_TAKE 以外の全テロップ） */
export const CLEAR_ON_TAKE = [
    '大得点', '大得点得点者', '大得点PK', '大得点得点者PK', '対戦カード', '対戦カード画像', '1Shot', '1Shotカード', 'フォーメーション左', 'フォーメーション右', '左下ミニフォーメーション',
    'サブ下位置左', 'PK', '左上PK', 'スタッツ', '気象', '選手交代1枚', '選手交代2枚'
];

type TakeTarget = {
    isVisible: boolean;
    show: (data?: any) => void;
    update: (data?: any) => void;
};

/**
 * TAKE ボタン共通: そのテロップが送出中なら UPDATE で中身だけ差し替え（一瞬消えるのを防ぐ）、
 * 出ていなければ clear（他の CG を消す処理）を実行してから TAKE する。
 * 戻り値は実際に行った操作
 */
export function takeOrUpdate(telop: TakeTarget, payload?: any, clear?: () => void): 'take' | 'update' {
    // PV モード: OA の状態に関係なく PV モニターに出す（show が PV モニターに行く）
    if (isPvMode()) {
        clear?.();
        telop.show(payload);
        return 'take';
    }
    if (telop.isVisible) {
        telop.update(payload);
        return 'update';
    }
    clear?.();
    telop.show(payload);
    return 'take';
}

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
 * PV モニターの CG を OA に送出する関数を返す（PV モードのままでも OA に出る）。
 * 通常の TAKE と同じく、小得点・タイマー・AT 以外の CG を出すときは他の CG を OA から消し、
 * 送出中の同じ CG は UPDATE で中身だけ差し替える。PV の TAKE で保留していた処理（当日ログ・キューの送出済みなど）もここで行う
 */
export function usePvSendToOnAir() {
    // PV モードで OA に出さない useTelop（utils/telop）ではなく、SDK の useTelop を直接使う
    const telops = [...CLEAR_ON_TAKE, ...KEEP_ON_TAKE].map(name => ({ name, telop: useSdkTelop(name) }));

    return (layers: PvLayer[]) => {
        const names = layers.map(l => l.name);
        if (names.some(name => !KEEP_ON_TAKE.includes(name))) {
            telops.forEach(({ name, telop }) => {
                if (!KEEP_ON_TAKE.includes(name) && !names.includes(name) && telop.isVisible) telop.hide();
            });
        }
        layers.forEach(layer => {
            const target = telops.find(t => t.name === layer.name)?.telop;
            if (!target) return;
            target.setData(layer.data);
            if (target.isVisible) target.update(layer.data);
            else target.show(layer.data);
            takePvSendHook(layer.name)?.();
        });
    };
}

/**
 * PV モードのままでも ONAIR の CG を消す関数を返す（CLEAR CG と同じく小得点・タイマー・AT は残す）。
 * 表示中フラグが実際とずれていても消えるよう、フラグを見ずに HIDE を送る。キューの ON AIR の印も外す
 */
export function useOnAirCgClear() {
    const telops = CLEAR_ON_TAKE.map(name => useSdkTelop(name));
    const [, setQueueOnAir] = useCgQueueOnAir();
    return () => {
        telops.forEach(telop => telop.hide());
        setQueueOnAir(null);
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
        // PV モード: OA は消さず、PV モニターの CG を消す
        if (isPvMode()) {
            pvClear([...keepList, ...KEEP_ON_TAKE]);
            return;
        }
        telops.forEach(({ name, telop }) => {
            if (!keepList.includes(name) && telop.isVisible) telop.hide();
        });
    }, telops.map(t => t.telop));
}
