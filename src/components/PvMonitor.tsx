import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTelopHub } from '@sdk/TelopHubSDK';
import { usePv, setPvMode, pvHide, pvClear, telopPageUrl, PvLayer } from '../utils/pv';
import { usePvSendToOnAir, useOnAirCgClear } from '../utils/cgExclusive';

/**
 * PV モードのスイッチ（ナビゲーションバー）と、PV モードの間だけ出る注意の帯。
 * PV モードは読み込み直すと必ず OFF（TAKE が OA に出ないまま本番に入らないように）
 */
export function PvModeToggle() {
    const { mode } = usePv();
    return (
        <button
            className={`btn ${mode ? 'btn-warning' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontWeight: 'bold', fontSize: '0.85rem', ...(mode ? { boxShadow: '0 0 12px rgba(255,152,0,0.7)' } : {}) }}
            onClick={() => setPvMode(!mode)}
            title={mode ? 'PV モードを終える（TAKE が OA に出るようにする）' : 'PV モード: TAKE・HIDE・CGクリアを OA に出さず、画面の PV モニターで確認する'}
        >
            {mode ? '🟧 PVモード ON' : 'PVモード OFF'}
        </button>
    );
}

export function PvModeBanner() {
    const { mode } = usePv();
    if (!mode) return null;
    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 900, background: '#ff9800', color: '#111', padding: '6px 16px', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span>🟧 PVモード中 — TAKE・HIDE・CGクリアは PV モニターだけに出ます（OA されません）。送出中の CG の得点などの更新は今まで通り OA に反映されます</span>
            <button className="btn btn-secondary" style={{ padding: '2px 12px', fontSize: '0.8rem', fontWeight: 'bold', background: '#222', color: '#fff' }} onClick={() => setPvMode(false)}>
                PVモードを終える
            </button>
        </div>
    );
}

// ---------------------------------------------------------------- PV モニター

const CANVAS_W = 1920;
const CANVAS_H = 1080;
type SizeKey = 'S' | 'M' | 'L';
// 以前の 0.25 / 0.4 / 0.6 の 1.75 倍。画面に収まらないときは画面幅に合わせて縮める
const SIZES: Record<SizeKey, number> = { S: 0.4375, M: 0.7, L: 1.05 };
type Bg = 'checker' | 'black' | 'gray';
const BG_STYLE: Record<Bg, React.CSSProperties> = {
    checker: { background: 'repeating-conic-gradient(#3a3a3a 0% 25%, #2a2a2a 0% 50%) 50% / 24px 24px' },
    black: { background: '#000' },
    gray: { background: '#7f7f7f' }
};
const BG_LABEL: Record<Bg, string> = { checker: '市松', black: '黒', gray: 'グレー' };
const PREFS_KEY = 'pv_monitor_prefs';
type Prefs = { size: SizeKey, bg: Bg, x: number | null, y: number | null, collapsed: boolean };

const readPrefs = (): Prefs => {
    const fallback: Prefs = { size: 'S', bg: 'checker', x: null, y: null, collapsed: false };
    try {
        const v = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
        return v && typeof v === 'object' ? { ...fallback, ...v } : fallback;
    } catch {
        return fallback;
    }
};
const writePrefs = (p: Prefs) => {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* 保存できなくても動く */ }
};

/**
 * PV モニター: PV モードで TAKE した CG を、本物のテロップページ（OA と同じ描画）で画面の中に重ねて出す。
 * 操作の邪魔にならないよう、見出しをドラッグして動かせる・大きさを S/M/L で選べる・たためる。
 * 「拡大」で画面いっぱいに出して文字を確かめられる（クリックか Esc で戻る）
 */
export default function PvMonitor() {
    const { mode, layers } = usePv();
    const { projectName } = useTelopHub();
    const [prefs, setPrefsState] = useState<Prefs>(readPrefs);
    const [zoom, setZoom] = useState(false);
    // PV の CG を OA に送出（PV モードのまま）
    const sendToOnAir = usePvSendToOnAir();
    // ONAIR の CG を消す（PV モードのまま。小得点・タイマー・AT は残す）
    const clearOnAirCg = useOnAirCgClear();
    // 直前の操作の結果（少しの間だけ出す）
    const [notice, setNotice] = useState('');
    const send = (target: PvLayer[]) => {
        if (target.length === 0) return;
        sendToOnAir(target);
        setNotice('✔ ONAIR に送出しました');
    };
    const clearOnAir = () => {
        clearOnAirCg();
        setNotice('✔ ONAIR の CG を消しました');
    };
    useEffect(() => {
        if (!notice) return;
        const t = window.setTimeout(() => setNotice(''), 1500);
        return () => window.clearTimeout(t);
    }, [notice]);
    // 外部モニター出力（別ウィンドウ）。チェックを外す・PV モードを終える・ウィンドウを閉じると止まる
    const [popup, setPopup] = useState<Window | null>(null);
    const [externalError, setExternalError] = useState('');
    const external = !!popup;
    const closeExternal = () => setPopup(prev => { if (prev && !prev.closed) prev.close(); return null; });
    const toggleExternal = (on: boolean) => {
        setExternalError('');
        if (!on) { closeExternal(); return; }
        // クリックの中で開く（後から開くとポップアップとしてブロックされる）
        const w = window.open('', 'telop_pv_external', 'width=1280,height=720');
        if (!w) { setExternalError('別ウィンドウを開けませんでした。ブラウザーのポップアップのブロックを解除してください'); return; }
        setPopup(w);
    };
    // PV モードを終えたら閉じる
    useEffect(() => { if (!mode) closeExternal(); }, [mode]);
    // 利用者がウィンドウを閉じたらチェックを外す
    useEffect(() => {
        if (!popup) return;
        const t = window.setInterval(() => { if (popup.closed) setPopup(null); }, 500);
        return () => window.clearInterval(t);
    }, [popup]);
    // ショートカット（PV モードの間だけ）: F1 = ONAIRへ送出、F3 = ONAIR CGクリア。
    // ブラウザーの F1（ヘルプ）・F3（検索）は止める。押しっぱなしの連続入力は無視。外部モニターのウィンドウでも効く
    const keyActions = useRef({ send: () => send(layers), clear: clearOnAir });
    keyActions.current = { send: () => send(layers), clear: clearOnAir };
    useEffect(() => {
        if (!mode) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'F1' && e.key !== 'F3') return;
            e.preventDefault();
            if (e.repeat) return;
            if (e.key === 'F1') keyActions.current.send();
            else keyActions.current.clear();
        };
        const targets: Window[] = [window, ...(popup && !popup.closed ? [popup] : [])];
        targets.forEach(w => w.addEventListener('keydown', onKey));
        return () => targets.forEach(w => w.removeEventListener('keydown', onKey));
    }, [mode, popup]);
    const setPrefs = (next: Partial<Prefs>) => setPrefsState(prev => {
        const merged = { ...prev, ...next };
        writePrefs(merged);
        return merged;
    });

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1600;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const scale = Math.min(SIZES[prefs.size], (vw - 32) / CANVAS_W, (vh - 120) / CANVAS_H);
    const w = Math.round(CANVAS_W * scale);
    const h = Math.round(CANVAS_H * scale);
    const panelW = w + 2;
    // 位置は左上。未設定なら右下。画面からはみ出さないように収める
    const x = Math.max(0, Math.min(prefs.x ?? vw - panelW - 16, vw - 120));
    const y = Math.max(0, Math.min(prefs.y ?? vh - h - 90, vh - 40));

    // 見出しのドラッグで移動
    const drag = useRef<{ dx: number, dy: number } | null>(null);
    const onPointerDown = (e: React.PointerEvent) => {
        // ボタンやチェックボックスはドラッグにしない（ポインターを奪うとクリックが届かない）
        if ((e.target as HTMLElement).closest('button, label, input')) return;
        drag.current = { dx: e.clientX - x, dy: e.clientY - y };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current;
        if (!d) return;
        // 位置はここで確定させる（更新関数は後で実行されるため、その時点では drag.current が null の場合がある）
        const nx = e.clientX - d.dx, ny = e.clientY - d.dy;
        setPrefsState(prev => ({ ...prev, x: nx, y: ny }));
    };
    const onPointerUp = () => {
        if (!drag.current) return;
        drag.current = null;
        setPrefsState(prev => { writePrefs(prev); return prev; });
    };

    useEffect(() => {
        if (!zoom) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoom(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [zoom]);

    if (!mode) return null;

    const smallBtn: React.CSSProperties = { padding: '1px 7px', fontSize: '0.7rem' };
    const zoomScale = Math.min((vw - 40) / CANVAS_W, (vh - 90) / CANVAS_H);

    return (
        <>
            <div style={{ position: 'fixed', left: x, top: y, zIndex: 950, width: panelW, background: '#151821', border: '2px solid #ff9800', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
                <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: '#ff9800', color: '#111', cursor: 'move', userSelect: 'none', flexWrap: 'wrap' }}
                    title="ドラッグで動かせます">
                    <span style={{ fontWeight: 'bold', fontSize: '0.8rem', marginRight: 'auto' }}>🟧 PV モニター（OA されません）</span>
                    {(Object.keys(SIZES) as SizeKey[]).map(k => (
                        <button key={k} className={`btn ${prefs.size === k ? 'btn-primary' : 'btn-secondary'}`} style={smallBtn} onClick={() => setPrefs({ size: k, collapsed: false })}>{k}</button>
                    ))}
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 'bold', cursor: 'pointer', background: external ? '#111' : 'transparent', color: external ? '#ff9800' : '#111', borderRadius: 4, padding: '1px 6px' }}
                        title="PV を別ウィンドウに出します。外部モニターへ動かし、ダブルクリックで全画面にできます">
                        <input type="checkbox" checked={external} onChange={e => toggleExternal(e.target.checked)} />
                        外部モニター出力
                    </label>
                    <button className="btn btn-secondary" style={smallBtn} onClick={() => setZoom(true)} title="画面いっぱいに拡大（クリックか Esc で戻る）">拡大</button>
                    <button className="btn btn-secondary" style={smallBtn} onClick={() => setPrefs({ bg: prefs.bg === 'checker' ? 'black' : prefs.bg === 'black' ? 'gray' : 'checker' })} title="背景を切り替え">
                        背景:{BG_LABEL[prefs.bg]}
                    </button>
                    <button className="btn btn-secondary" style={smallBtn} onClick={() => pvClear()} disabled={layers.length === 0} title="PV モニターの CG をすべて消す">PVクリア</button>
                    <button className="btn btn-secondary" style={smallBtn} onClick={() => setPrefs({ collapsed: !prefs.collapsed })} title={prefs.collapsed ? '開く' : 'たたむ'}>
                        {prefs.collapsed ? '▲' : '▼'}
                    </button>
                </div>
                {externalError && (
                    <div style={{ fontSize: '0.72rem', color: '#ff8a80', padding: '4px 8px', background: '#2a1515' }}>{externalError}</div>
                )}
                {/* PV の CG を ONAIR に TAKE（たたんでいても押せるよう見出しの下に置く） */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', background: '#2a1515', borderBottom: '1px solid rgba(255,152,0,0.4)' }}>
                    <button className="btn btn-danger" style={{ padding: '3px 14px', fontSize: '0.8rem', fontWeight: 'bold' }} onClick={() => send(layers)} disabled={layers.length === 0}
                        title={layers.length === 0 ? 'PV に CG が出ていません' : `PV の CG（${layers.map(l => l.name).join('・')}）を ONAIR に TAKE します。他の CG は消えます（小得点・タイマー・AT は残す）`}>
                        ▶ ONAIRへ送出{layers.length > 1 ? `（${layers.length}件）` : ''} [F1]
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '3px 10px', fontSize: '0.75rem', fontWeight: 'bold', borderColor: 'var(--accent-danger)' }} onClick={clearOnAir}
                        title="ONAIR に出ている CG を消します（小得点・タイマー・AT は残す）。PV モニターの CG はそのまま">
                        ONAIR CGクリア [F3]
                    </button>
                    <span style={{ fontSize: '0.72rem', color: notice ? '#4caf50' : '#aaa', fontWeight: notice ? 'bold' : 'normal' }}>
                        {notice || 'PV で確認した CG をそのまま OA に出します'}
                    </span>
                </div>
                {!prefs.collapsed && (
                    <>
                        <PvStage layers={layers} scale={scale} bg={prefs.bg} projectName={projectName || ''} />
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '4px 6px', minHeight: 24, alignItems: 'center' }}>
                            {layers.length === 0
                                ? <span style={{ fontSize: '0.72rem', color: '#888' }}>TAKE（Q の TAKE NEXT・ダブルクリックも）を押すと、ここに出ます</span>
                                : layers.map(l => (
                                    <span key={l.name} style={{ fontSize: '0.7rem', background: 'rgba(255,152,0,0.18)', border: '1px solid rgba(255,152,0,0.5)', borderRadius: 4, padding: '0 2px 0 6px', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                                        {l.name}
                                        <button className="btn btn-danger" style={{ padding: '0 4px', fontSize: '0.65rem', lineHeight: 1.2 }} onClick={() => send([l])} title={`「${l.name}」だけを ONAIR に TAKE`}>OA</button>
                                        <button className="btn btn-secondary" style={{ padding: '0 4px', fontSize: '0.65rem', lineHeight: 1.2 }} onClick={() => pvHide(l.name)} title="PV モニターから消す">×</button>
                                    </span>
                                ))}
                        </div>
                    </>
                )}
            </div>

            {popup && <ExternalPvWindow popup={popup} layers={layers} bg={prefs.bg} projectName={projectName || ''} />}

            {zoom && (
                <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'zoom-out' }}>
                    <div style={{ color: '#ff9800', fontWeight: 'bold', fontSize: '0.9rem' }}>🟧 PV（OA されません）— クリックか Esc で戻ります</div>
                    <div style={{ border: '2px solid #ff9800' }}>
                        <PvStage layers={layers} scale={zoomScale} bg={prefs.bg} projectName={projectName || ''} />
                    </div>
                </div>
            )}
        </>
    );
}

/**
 * 外部モニター出力: 別ウィンドウを開き、その中に PV をウィンドウいっぱいの大きさ（16:9）で出す。
 * 2 台目の画面が分かれば（ブラウザーの「ウィンドウ管理」の許可があれば）その画面に開く。
 * ダブルクリックで全画面／全画面の解除
 */
function ExternalPvWindow({ popup, layers, bg, projectName }: { popup: Window, layers: PvLayer[], bg: Bg, projectName: string }) {
    const [root, setRoot] = useState<HTMLElement | null>(null);
    const [size, setSize] = useState({ w: 1280, h: 720 });

    useEffect(() => {
        const w = popup;
        const doc = w.document;
        doc.title = 'PV 外部モニター（OA されません）';
        doc.body.style.cssText = 'margin:0;background:#000;overflow:hidden;';
        let el = doc.getElementById('pv-root');
        if (!el) {
            el = doc.createElement('div');
            el.id = 'pv-root';
            doc.body.appendChild(el);
        }
        setRoot(el);
        const resize = () => setSize({ w: w.innerWidth, h: w.innerHeight });
        resize();
        const dbl = () => {
            if (doc.fullscreenElement) doc.exitFullscreen().catch(() => { });
            else doc.documentElement.requestFullscreen().catch(() => { });
        };
        w.addEventListener('resize', resize);
        doc.addEventListener('dblclick', dbl);
        // 2 台目の画面が分かれば（ブラウザーの「ウィンドウ管理」の許可があれば）そこへ動かす
        let cancelled = false;
        (async () => {
            try {
                const getScreenDetails = (window as any).getScreenDetails;
                if (!getScreenDetails) return;
                const details = await getScreenDetails.call(window);
                const other = details.screens.find((sc: any) => sc !== details.currentScreen) as any;
                if (cancelled || !other || w.closed) return;
                w.moveTo(other.availLeft, other.availTop);
                w.resizeTo(other.availWidth, other.availHeight);
            } catch { /* 手で動かしてもらう */ }
        })();
        return () => {
            cancelled = true;
            w.removeEventListener('resize', resize);
            doc.removeEventListener('dblclick', dbl);
        };
    }, [popup]);

    if (!root || popup.closed) return null;
    const scale = Math.min(size.w / CANVAS_W, size.h / CANVAS_H);
    return createPortal(
        <div style={{ width: size.w, height: size.h, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
            <PvStage layers={layers} scale={scale} bg={bg} projectName={projectName} />
        </div>,
        root
    );
}

function PvStage({ layers, scale, bg, projectName }: { layers: PvLayer[], scale: number, bg: Bg, projectName: string }) {
    return (
        <div style={{ position: 'relative', width: Math.round(CANVAS_W * scale), height: Math.round(CANVAS_H * scale), overflow: 'hidden', ...BG_STYLE[bg] }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
                {layers.map((l, i) => <PvFrame key={l.name} layer={l} z={i} projectName={projectName} />)}
            </div>
        </div>
    );
}

/** 1 つのテロップ。本物のテロップページを開き、showTelop / updateTelop で中身を入れる */
function PvFrame({ layer, z, projectName }: { layer: PvLayer, z: number, projectName: string }) {
    const [url, setUrl] = useState<string | null | undefined>(undefined);
    const [ready, setReady] = useState(false);
    const ref = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        let alive = true;
        // 外部モニターの別ウィンドウからでも開けるよう、完全な URL にする
        telopPageUrl(projectName, layer.name).then(u => { if (alive) setUrl(u ? new URL(u, window.location.href).href : u); });
        return () => { alive = false; };
    }, [projectName, layer.name]);

    const onLoad = async () => {
        const win = ref.current?.contentWindow as any;
        for (let i = 0; i < 200; i++) {
            if (win?.initialized && win.showTelop) { setReady(true); return; }
            await new Promise(r => setTimeout(r, 50));
        }
    };

    const win = () => ref.current?.contentWindow as any;
    // TAKE（seq が変わる）: イン点から出し直す
    useEffect(() => {
        if (!ready) return;
        try {
            const w = win();
            const box = w.document.getElementById(w.containerId || 'player-container');
            if (box) box.classList.remove(...Array.from(box.classList as DOMTokenList));
            w.showTelop(layer.data);
        } catch (e) {
            console.warn('[PV] showTelop failed', layer.name, e);
        }
    }, [ready, layer.seq]);
    // UPDATE（中身だけ変わる）
    useEffect(() => {
        if (!ready) return;
        try { win().updateTelop(layer.data); } catch { /* 次の TAKE で出し直す */ }
    }, [layer.data]);

    if (url === null) {
        return (
            <div style={{ position: 'absolute', left: 40, top: 40 + z * 70, zIndex: z, color: '#ff8a80', fontSize: 40, fontWeight: 'bold', background: 'rgba(0,0,0,0.6)', padding: '8px 16px' }}>
                「{layer.name}」のテロップページが見つかりません
            </div>
        );
    }
    if (!url) return null;
    return (
        <iframe ref={ref} src={url} onLoad={onLoad} title={`PV ${layer.name}`} tabIndex={-1}
            style={{ position: 'absolute', left: 0, top: 0, width: CANVAS_W, height: CANVAS_H, border: 0, zIndex: z, pointerEvents: 'none', background: 'transparent' }} />
    );
}
