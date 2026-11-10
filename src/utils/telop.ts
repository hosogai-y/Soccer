import { useCallback } from 'react';
import { useTelop as useSdkTelop } from '@sdk/TelopHubSDK';
import { isPvMode, pvShow, pvUpdate, pvHide, pvHas } from './pv';

/**
 * SDK の useTelop に PV モードを足したもの（ダッシュボードはすべてこちらを使う）。
 * PV モードの間: show / hide / toggle は PV モニターだけに出し、OA には送らない（送出中フラグも変えない）。
 * update はいつも OA に送る（タイマー・得点の +1 など送出中 CG のその場更新）。PV モニターに出ていればそちらも更新。
 * isVisible は OA の状態のまま。
 */
export function useTelop<T = any>(name: string, initialData?: T, options?: Parameters<typeof useSdkTelop>[2]) {
    const telop = useSdkTelop<T>(name, initialData, options);
    const { data } = telop;
    const resolve = useCallback((d?: any): any => (typeof d === 'function' ? d('') : (d ?? data)), [data]);

    const show = useCallback((d?: any) => {
        if (isPvMode()) pvShow(name, resolve(d));
        else telop.show(d);
    }, [name, resolve, telop.show]);

    const hide = useCallback(() => {
        if (isPvMode()) pvHide(name);
        else telop.hide();
    }, [name, telop.hide]);

    const update = useCallback((d?: any) => {
        pvUpdate(name, resolve(d));
        telop.update(d);
    }, [name, resolve, telop.update]);

    const toggle = useCallback((d?: any) => {
        if (!isPvMode()) telop.toggle(d);
        else if (pvHas(name)) pvHide(name);
        else pvShow(name, resolve(d));
    }, [name, resolve, telop.toggle]);

    return { ...telop, name, show, hide, update, toggle };
}
