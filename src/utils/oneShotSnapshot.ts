/**
 * 1Shot テロップを画面に出さずに描いて PNG にする（Player Registry の「1SHOT確認用 PNG」）。
 *
 * 1Shot テロップのページを見えない iframe で開き、updateTelop でデータを流し込んだあと、
 * 描かれた SVG を複製して画像（顔写真・ベース画像）とフォントを data URL で埋め込み、canvas に描いて切り出す。
 * iframe はダッシュボードと同じオリジンで開く必要がある（TelopHub から開いたダッシュボード、または npm run dev）。
 */

const TELOP_NAME = '1Shot';
const CANVAS_W = 1920;
const CANVAS_H = 1080;

/** 切り出す範囲: 顔写真（左上 1097,810）から 1Shot の座布団（右端 1888・下端 1079）まで */
export const ONE_SHOT_CROP = { x: 1088, y: 800, w: 808, h: 280 };

export type OneShotSnapshotter = {
    renderAll: (payloads: Record<string, any>[], onProgress?: (done: number, total: number) => void) => Promise<(Blob | null)[]>;
    close: () => void;
};

/** プロジェクトのテロップページの URL 候補（TelopHub 配信: /Telops/<project>/、開発サーバー: /） */
function telopPageCandidates(projectName: string): string[] {
    const file = `${encodeURIComponent(TELOP_NAME)}/${encodeURIComponent(TELOP_NAME)}.html`;
    return [`/${projectName.split('/').map(encodeURIComponent).join('/')}/${file}`, `/${file}`];
}

async function findTelopPage(projectName: string): Promise<string> {
    for (const url of telopPageCandidates(projectName)) {
        try {
            const res = await fetch(url, { method: 'GET', cache: 'no-store' });
            const text = res.ok ? await res.text() : '';
            if (text.includes('player-container')) return url;
        } catch { /* 次の候補 */ }
    }
    throw new Error('1Shot テロップのページが見つかりません（TelopHub から開いたダッシュボードで実行してください）。');
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

export async function openOneShotSnapshotter(projectName: string): Promise<OneShotSnapshotter> {
    const url = await findTelopPage(projectName);
    const frame = document.createElement('iframe');
    // 描画させるため display:none にはせず、画面外に置く
    frame.style.cssText = `position:fixed;left:-${CANVAS_W * 3}px;top:0;width:${CANVAS_W}px;height:${CANVAS_H}px;border:0;pointer-events:none;`;
    frame.setAttribute('aria-hidden', 'true');
    frame.src = url;
    document.body.appendChild(frame);
    await new Promise<void>((resolve, reject) => {
        frame.onload = () => resolve();
        frame.onerror = () => reject(new Error('1Shot テロップのページを開けませんでした。'));
    });

    const win = frame.contentWindow as any;
    for (let i = 0; i < 200 && !(win && win.initialized && win.telopApp && win.updateTelop); i++) await sleep(50);
    if (!win || !win.initialized || !win.telopApp) {
        frame.remove();
        throw new Error('1Shot テロップの準備ができませんでした。');
    }

    const dataUrlCache = new Map<string, Promise<string>>();
    const toDataUrl = (absUrl: string) => {
        if (!dataUrlCache.has(absUrl)) {
            dataUrlCache.set(absUrl, fetch(absUrl).then(r => {
                if (!r.ok) throw new Error(String(r.status));
                return r.blob();
            }).then(blobToDataUrl).catch(() => ''));
        }
        return dataUrlCache.get(absUrl)!;
    };

    // テロップページが読み込んだ @font-face（fonts.css）を data URL にして SVG に埋め込む。使っている太さだけ
    let fontCssPromise: Promise<string> | null = null;
    const fontCss = (usedWeights: Set<string>) => {
        if (!fontCssPromise) {
            fontCssPromise = (async () => {
                const rules: string[] = [];
                for (const sheet of Array.from(win.document.styleSheets) as CSSStyleSheet[]) {
                    let cssRules: CSSRuleList;
                    try { cssRules = sheet.cssRules; } catch { continue; }
                    for (const rule of Array.from(cssRules) as any[]) {
                        if (!rule.style || rule.type !== 5) continue; // 5: CSSRule.FONT_FACE_RULE（iframe 側のクラスなので instanceof は使えない）
                        const weight = String(rule.style.getPropertyValue('font-weight') || '400').trim();
                        const norm = weight === 'normal' ? '400' : weight === 'bold' ? '700' : weight;
                        if (!usedWeights.has(norm)) continue;
                        const src = rule.style.getPropertyValue('src') || '';
                        const m = src.match(/url\(["']?([^"')]+)["']?\)/);
                        if (!m) continue;
                        const abs = new URL(m[1], sheet.href || win.location.href).href;
                        const data = await toDataUrl(abs);
                        if (!data) continue;
                        const family = rule.style.getPropertyValue('font-family');
                        rules.push(`@font-face{font-family:${family};font-weight:${norm};font-style:normal;src:url(${data});}`);
                    }
                }
                return rules.join('\n');
            })();
        }
        return fontCssPromise;
    };

    const usedWeights = new Set<string>(['400']);

    // 1 人分: データを流し込み、描かれた SVG を複製して画像を埋め込む（フォントはまとめて描くときに 1 回だけ埋め込む）
    const capture = async (payload: Record<string, any>, index: number) => {
        win.updateTelop(payload);
        if (win.document.fonts?.ready) await win.document.fonts.ready;
        // 顔写真などの差し替え（1Shot.js が候補 URL を読み込んで href を入れ替える）を待つ
        await sleep(250);

        const app: SVGSVGElement = win.telopApp;
        const clone = app.cloneNode(true) as SVGSVGElement;

        // 非表示のノード（showIf・mode 切り替え）は CSS で隠れているので、複製からは取り除く
        const walk = (orig: Element, copy: Element) => {
            const origKids = Array.from(orig.children);
            const copyKids = Array.from(copy.children);
            origKids.forEach((o, i) => {
                const c = copyKids[i];
                if (!c) return;
                const cs = win.getComputedStyle(o);
                if (cs.display === 'none' || cs.visibility === 'hidden') {
                    c.remove();
                    return;
                }
                if (o.tagName.toLowerCase() === 'text') {
                    const w = cs.fontWeight === 'normal' ? '400' : cs.fontWeight === 'bold' ? '700' : String(cs.fontWeight);
                    usedWeights.add(w);
                    // 計算済みのフォント指定をそのまま書いておく（クラスや継承に頼らない）
                    (c as SVGElement).style.fontFamily = cs.fontFamily;
                    (c as SVGElement).style.fontWeight = w;
                }
                walk(o, c);
            });
        };
        walk(app, clone);

        // 画像を data URL に
        const images = Array.from(clone.querySelectorAll('image'));
        await Promise.all(images.map(async img => {
            const href = img.getAttribute('href') || img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
            if (!href || href.startsWith('data:')) return;
            const data = await toDataUrl(new URL(href, win.location.href).href);
            if (data) {
                img.setAttribute('href', data);
                img.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
            } else {
                img.remove();
            }
        }));

        // 何人分も 1 つの SVG に並べるので、グラデーション・クリップなどの id が重ならないよう人ごとに付け替える
        const prefix = `s${index}_`;
        const idSet = new Set(Array.from(clone.querySelectorAll('[id]')).map(el => el.id).filter(Boolean));
        if (idSet.size > 0) {
            clone.querySelectorAll('[id]').forEach(el => { if (el.id) el.id = prefix + el.id; });
            const refRe = /url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g;
            [clone, ...Array.from(clone.querySelectorAll('*'))].forEach(el => {
                Array.from(el.attributes).forEach(attr => {
                    let v = attr.value;
                    if (v.includes('url(')) v = v.replace(refRe, (m, id) => (idSet.has(id) ? `url(#${prefix}${id})` : m));
                    if ((attr.name === 'href' || attr.name === 'xlink:href') && v.startsWith('#') && idSet.has(v.slice(1))) v = `#${prefix}${v.slice(1)}`;
                    if (v !== attr.value) el.setAttribute(attr.name, v);
                });
            });
        }

        // 外側の SVG の中で、切り出す範囲だけが見えるように置く
        clone.removeAttribute('style');
        clone.removeAttribute('class');
        clone.setAttribute('x', '0');
        clone.setAttribute('y', String(index * ONE_SHOT_CROP.h));
        clone.setAttribute('width', String(ONE_SHOT_CROP.w));
        clone.setAttribute('height', String(ONE_SHOT_CROP.h));
        clone.setAttribute('viewBox', `${ONE_SHOT_CROP.x} ${ONE_SHOT_CROP.y} ${ONE_SHOT_CROP.w} ${ONE_SHOT_CROP.h}`);
        clone.setAttribute('overflow', 'hidden');
        return clone;
    };

    /**
     * 全員分を PNG にする。フォントの埋め込み（数 MB）を 1 回の読み込みで済ませるため、
     * 何人分かを縦に並べた 1 枚の SVG にして描き、1 人ずつ切り分ける
     */
    const renderAll = async (payloads: Record<string, any>[], onProgress?: (done: number, total: number) => void): Promise<(Blob | null)[]> => {
        const BATCH = 40; // 1 チーム分（選手＋スタッフ）がだいたい 1 回で収まる数
        const svgNs = 'http://www.w3.org/2000/svg';
        const results: (Blob | null)[] = [];
        for (let start = 0; start < payloads.length; start += BATCH) {
            const batch = payloads.slice(start, start + BATCH);
            const outer = document.createElementNS(svgNs, 'svg');
            outer.setAttribute('xmlns', svgNs);
            outer.setAttribute('width', String(ONE_SHOT_CROP.w));
            outer.setAttribute('height', String(ONE_SHOT_CROP.h * batch.length));
            const captured: boolean[] = [];
            for (let i = 0; i < batch.length; i++) {
                try {
                    outer.appendChild(await capture(batch[i], i));
                    captured.push(true);
                } catch {
                    captured.push(false);
                }
                onProgress?.(start + i + 1, payloads.length);
            }
            const style = document.createElementNS(svgNs, 'style');
            style.textContent = await fontCss(usedWeights);
            outer.insertBefore(style, outer.firstChild);

            const svgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(outer)], { type: 'image/svg+xml' }));
            try {
                const img = new Image();
                img.src = svgUrl;
                await img.decode();
                for (let i = 0; i < batch.length; i++) {
                    if (!captured[i]) { results.push(null); continue; }
                    const canvas = document.createElement('canvas');
                    canvas.width = ONE_SHOT_CROP.w;
                    canvas.height = ONE_SHOT_CROP.h;
                    canvas.getContext('2d')!.drawImage(img, 0, i * ONE_SHOT_CROP.h, ONE_SHOT_CROP.w, ONE_SHOT_CROP.h, 0, 0, ONE_SHOT_CROP.w, ONE_SHOT_CROP.h);
                    results.push(await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png')));
                }
            } finally {
                URL.revokeObjectURL(svgUrl);
            }
        }
        return results;
    };

    return { renderAll, close: () => frame.remove() };
}
