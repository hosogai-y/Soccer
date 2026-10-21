
(function () {
    // ==========================================
    // Standalone SVG Renderer Logic (Unified Core)
    // ==========================================

    const SVG_NS = "http://www.w3.org/2000/svg";

    function createSVGElement(tagName) {
        return document.createElementNS(SVG_NS, tagName);
    }

    // Inject shared logic core (stripped of exports for standalone use)
    /**
 * Shared SVG rendering core.
 * This file is imported as ESM in the Editor and injected as a raw string in the Player.
 */
function setAttributes(el, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
        if (value === undefined)
            return;
        const sVal = String(value);
        if (sVal === "NaN" || sVal.includes("undefined")) {
            return;
        }
        if (key === "xml:space") {
            el.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", sVal);
        }
        else {
            el.setAttribute(key, sVal);
        }
    });
}
function parseHex8(hex) {
    if (Array.isArray(hex))
        hex = hex[0] || "#ffffff";
    if (!hex || typeof hex !== 'string' || !hex.startsWith("#") || hex === "undefined") {
        return { color: (hex && hex !== "undefined") ? hex : '#ffffff', alpha: 1 };
    }
    const h = hex.replace("#", "");
    if (h.length === 8) {
        return { color: "#" + h.substring(0, 6), alpha: parseInt(h.substring(6, 8), 16) / 255 };
    }
    return { color: hex, alpha: 1 };
}
function applyCommonProps(el, node) {
    const px = Number(node.pivotX ?? 0);
    const py = Number(node.pivotY ?? 0);
    const x = Number(node.x ?? 0);
    const y = Number(node.y ?? 0);
    const rotation = Number(node.rotation ?? 0);
    const skewX = Number(node.skewX ?? 0) || 0;
    const skewY = Number(node.skewY ?? 0) || 0;
    const scaleX = node.scaleX !== undefined ? Number(node.scaleX) : 1;
    const scaleY = node.scaleY !== undefined ? Number(node.scaleY) : 1;
    const opacity = node.opacity !== undefined ? Number(node.opacity) : 1;
    const visibility = node.visible === false ? "hidden" : "inherit";
    const sX = isFinite(scaleX) ? scaleX : 1;
    const sY = isFinite(scaleY) ? scaleY : 1;
    const skX = isFinite(skewX) ? skewX : 0;
    const skY = isFinite(skewY) ? skewY : 0;
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const tX = Math.tan((skX * Math.PI) / 180);
    const tY = Math.tan((skY * Math.PI) / 180);
    // Konva's order: T * R * Sk * Sc * Toffset
    // Matrix: [a c e]
    //         [b d f]
    // 1. Toffset: [1 0 -px]
    //             [0 1 -py]
    // 2. Sc: [sX 0 0]
    //        [0 sY 0]
    // 3. Sk: [1 tX 0]
    //        [tY 1 0]
    // 4. R: [cos -sin 0]
    //       [sin  cos 0]
    // 5. T: [1 0 x]
    //       [0 1 y]
    // Combined Sk * Sc * Toffset:
    // [sX   tX*sY   -sX*px - tX*sY*py]
    // [tY*sX  sY    -tY*sX*px - sY*py]
    const m11 = sX;
    const m12 = tX * sY;
    const m21 = tY * sX;
    const m22 = sY;
    const m13 = -sX * px - tX * sY * py;
    const m23 = -tY * sX * px - sY * py;
    // Now apply R:
    // [cos -sin] * [m11 m12 m13]
    // [sin  cos]   [m21 m22 m23]
    const r11 = cos * m11 - sin * m21;
    const r12 = cos * m12 - sin * m22;
    const r13 = cos * m13 - sin * m23;
    const r21 = sin * m11 + cos * m21;
    const r22 = sin * m12 + cos * m22;
    const r23 = sin * m13 + cos * m23;
    // Finally apply T:
    const a = r11;
    const b = r21;
    const c = r12;
    const d = r22;
    const e = r13 + x;
    const f = r23 + y;
    const transform = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
    setAttributes(el, {
        transform,
        opacity,
        visibility,
        "data-node-id": node.id
    });
    if (node.visible === false) {
        el.setAttribute("display", "none");
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("animation", "none", "important");
        el.classList.add("is-invisible");
    }
    else {
        el.removeAttribute("display");
        el.style.removeProperty("display");
        el.style.removeProperty("visibility");
        el.style.removeProperty("opacity");
        el.style.removeProperty("animation");
        el.classList.remove("is-invisible");
    }
}
function setupTextBase(text, node, measuredW, measuredH) {
    const fontSize = Number(node.style?.fontSize || 24);
    const targetWidth = Number(node.width || 0);
    const align = (targetWidth > 0 && (node.align === 'right' || node.align === 'center')) ? node.align : 'left';
    let textAnchor = 'start';
    if (align === 'right')
        textAnchor = 'end';
    else if (align === 'center')
        textAnchor = 'middle';
    const attrs = {
        "font-family": node.style?.fontFamily || "sans-serif",
        "font-size": fontSize,
        "font-weight": (node.style?.fontWeight === 'bold' || node.style?.fontWeight === '700' || node.style?.fontWeight === 700) ? 'bold' : 'normal',
        "font-style": (node.style?.fontStyle === 'italic') ? 'italic' : 'normal',
        "text-anchor": textAnchor,
        "dominant-baseline": "hanging",
        "alignment-baseline": "hanging",
        "text-rendering": "geometricPrecision",
        "xml:space": "preserve",
        "style": "white-space: pre;",
        x: 0,
        y: 0
    };
    if (node.style?.letterSpacing !== undefined) {
        attrs["letter-spacing"] = `${node.style.letterSpacing}px`;
    }
    setAttributes(text, attrs);
    text.textContent = node.text || "";
}
/**
 * Draws the content of an appearance layer (shadow, stroke, or fill)
 */
function drawAppearanceContent(target, app, node, appIdx, isRect, measuredW, measuredH, registerDef, createSVGElement) {
    const rawW = measuredW !== undefined ? measuredW : (isRect ? node.width : undefined);
    const rawH = measuredH !== undefined ? measuredH : (isRect ? node.height : undefined);
    // Fallback to node top-level width/height if not passed
    const w = Number(rawW ?? (node.width || (isRect ? 100 : 0)));
    const h = Number(rawH ?? (node.height || (isRect ? 100 : 0)));
    const safeW = isFinite(w) ? w : 100;
    const safeH = isFinite(h) ? h : 100;
    const fillColors = Array.isArray(app.fill) ? app.fill : [app.fill];
    const firstFillColor = parseHex8(String(fillColors[0] || "#ffffff"));
    // Punching is used for Stroke and Shadow to avoid them bleeding behind semi-transparent fill.
    const mainNeedsPunch = app.strokeEnabled && (!app.fillEnabled || firstFillColor.alpha < 1);
    const shadowNeedsPunch = app.shadowEnabled && !app.fillEnabled;
    const createMask = (id) => {
        const mask = createSVGElement("mask");
        mask.setAttribute("id", id);
        setAttributes(mask, { maskUnits: "userSpaceOnUse", maskContentUnits: "userSpaceOnUse" });
        const whiteBg = createSVGElement("rect");
        setAttributes(whiteBg, { x: -5000, y: -5000, width: 10000, height: 10000, fill: "white" });
        mask.appendChild(whiteBg);
        const punchShape = createSVGElement(isRect ? "rect" : "text");
        if (!isRect) {
            setupTextBase(punchShape, node, measuredW, measuredH);
        }
        else {
            const cr = Number(node.style?.cornerRadius ?? node.background?.cornerRadius ?? 0);
            setAttributes(punchShape, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: cr,
                ry: cr,
            });
        }
        punchShape.setAttribute("fill", "black");
        mask.appendChild(punchShape);
        registerDef(mask);
    };
    let mainMaskId = mainNeedsPunch ? `mask-main-${node.id}-${appIdx}` : null;
    if (mainMaskId)
        createMask(mainMaskId);
    let shadowMaskId = shadowNeedsPunch ? `mask-shadow-${node.id}-${appIdx}` : null;
    if (shadowMaskId)
        createMask(shadowMaskId);
    // 1. Shadow
    if (app.shadowEnabled) {
        const shadowEl = createSVGElement(isRect ? "rect" : "text");
        if (!isRect)
            setupTextBase(shadowEl, node, measuredW, measuredH);
        const { color: sc, alpha: sa } = parseHex8(String(app.shadowColor || "#000000"));
        const blur = Number(app.shadowBlur || 0);
        const dx = Number(app.shadowOffsetX || 0);
        const dy = Number(app.shadowOffsetY || 0);
        const filterId = `shadow-blur-${node.id}-${appIdx}`;
        const filter = createSVGElement("filter");
        filter.setAttribute("id", filterId);
        setAttributes(filter, { x: "-50%", y: "-50%", width: "200%", height: "200%" });
        const feGaussianBlur = createSVGElement("feGaussianBlur");
        setAttributes(feGaussianBlur, { stdDeviation: (blur / 2) });
        filter.appendChild(feGaussianBlur);
        registerDef(filter);
        if (isRect) {
            setAttributes(shadowEl, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: Number(node.style?.cornerRadius || 0),
                ry: Number(node.style?.cornerRadius || 0),
            });
        }
        shadowEl.setAttribute("transform", `translate(${dx}, ${dy})`);
        shadowEl.setAttribute("filter", `url(#${filterId})`);
        const shadowAlpha = app.shadowAlpha ?? sa;
        setAttributes(shadowEl, { fill: sc, "fill-opacity": shadowAlpha });
        if (app.strokeEnabled) {
            setAttributes(shadowEl, {
                stroke: sc, "stroke-opacity": shadowAlpha,
                "stroke-width": (Number(app.thickness || 0)) * 2,
                "stroke-linejoin": app.lineJoin || "miter",
                "stroke-miterlimit": app.miterLimit !== undefined ? app.miterLimit : 10
            });
        }
        if (shadowMaskId)
            shadowEl.setAttribute("mask", `url(#${shadowMaskId})`);
        target.appendChild(shadowEl);
    }
    // 2. Stroke
    if (app.strokeEnabled) {
        const strokeEl = createSVGElement(isRect ? "rect" : "text");
        if (!isRect)
            setupTextBase(strokeEl, node, measuredW, measuredH);
        else {
            const cr = Number(node.style?.cornerRadius ?? node.background?.cornerRadius ?? 0);
            setAttributes(strokeEl, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: cr,
                ry: cr,
            });
        }
        const { color, alpha } = parseHex8(app.color || "#000000");
        setAttributes(strokeEl, {
            fill: "none", stroke: color, "stroke-opacity": alpha,
            "stroke-width": (Number(app.thickness || 0)) * 2,
            "stroke-linejoin": app.lineJoin || "miter",
            "stroke-miterlimit": app.miterLimit !== undefined ? app.miterLimit : 10
        });
        if (mainMaskId)
            strokeEl.setAttribute("mask", `url(#${mainMaskId})`);
        target.appendChild(strokeEl);
    }
    // 3. Fill
    if (app.fillEnabled) {
        const fillEl = createSVGElement(isRect ? "rect" : "text");
        if (!isRect)
            setupTextBase(fillEl, node, measuredW, measuredH);
        else {
            const cr = Number(node.style?.cornerRadius ?? node.background?.cornerRadius ?? 0);
            setAttributes(fillEl, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: cr,
                ry: cr,
            });
        }
        const gradientConfig = app.gradientConfig || node.style?.gradientConfig;
        if (gradientConfig && Array.isArray(gradientConfig.stops) && gradientConfig.stops.length > 0) {
            const gradId = `fill-grad-${node.id}-${appIdx}`;
            const type = gradientConfig.type || "linear";
            const units = gradientConfig.units || "objectBoundingBox";
            if (type === "radial") {
                const grad = createSVGElement("radialGradient");
                grad.setAttribute("id", gradId);
                const cx = gradientConfig.centerX ?? 0.5;
                const cy = gradientConfig.centerY ?? 0.5;
                const r = gradientConfig.radius ?? 0.5;
                setAttributes(grad, {
                    gradientUnits: units,
                    cx: units === "objectBoundingBox" ? `${cx * 100}%` : cx * safeW,
                    cy: units === "objectBoundingBox" ? `${cy * 100}%` : cy * safeH,
                    r: units === "objectBoundingBox" ? `${r * 100}%` : r * Math.max(safeW, safeH),
                    fx: units === "objectBoundingBox" ? `${cx * 100}%` : cx * safeW,
                    fy: units === "objectBoundingBox" ? `${cy * 100}%` : cy * safeH,
                });
                gradientConfig.stops.forEach((s) => {
                    const stop = createSVGElement("stop");
                    const { color, alpha } = parseHex8(s.color || "#000000");
                    setAttributes(stop, { offset: `${(Number(s.offset || 0)) * 100}%`, "stop-color": color, "stop-opacity": alpha });
                    grad.appendChild(stop);
                });
                registerDef(grad);
                fillEl.setAttribute("fill", `url(#${gradId})`);
            }
            else {
                const grad = createSVGElement("linearGradient");
                grad.setAttribute("id", gradId);
                const angle = Number(gradientConfig.angle ?? 90);
                const rad = (angle * Math.PI) / 180;
                const x1 = 0.5 - 0.5 * Math.cos(rad), y1 = 0.5 - 0.5 * Math.sin(rad);
                const x2 = 0.5 + 0.5 * Math.cos(rad), y2 = 0.5 + 0.5 * Math.sin(rad);
                setAttributes(grad, {
                    gradientUnits: units,
                    x1: units === "objectBoundingBox" ? `${x1 * 100}%` : x1 * safeW,
                    y1: units === "objectBoundingBox" ? `${y1 * 100}%` : y1 * safeH,
                    x2: units === "objectBoundingBox" ? `${x2 * 100}%` : x2 * safeW,
                    y2: units === "objectBoundingBox" ? `${y2 * 100}%` : y2 * safeH
                });
                gradientConfig.stops.forEach((s) => {
                    const stop = createSVGElement("stop");
                    const { color, alpha } = parseHex8(s.color || "#000000");
                    setAttributes(stop, { offset: `${(Number(s.offset || 0)) * 100}%`, "stop-color": color, "stop-opacity": alpha });
                    grad.appendChild(stop);
                });
                registerDef(grad);
                fillEl.setAttribute("fill", `url(#${gradId})`);
            }
        }
        else {
            const { color, alpha } = parseHex8(String(fillColors[0] || "#ffffff"));
            setAttributes(fillEl, { fill: color, "fill-opacity": alpha });
        }
        target.appendChild(fillEl);
    }
    // Note: Alpha Gradient and other effects are applied to appearance layers and nodes via applyEffects()
}
const FilterFactory = {
    createFilter(effects, id, registerDef, createSVGElement) {
        const enabled = (effects || []).filter(e => e && e.enabled && e.type !== "alpha-gradient");
        if (enabled.length === 0)
            return null;
        const filter = createSVGElement("filter");
        setAttributes(filter, { id, x: "-50%", y: "-50%", width: "200%", height: "200%", filterUnits: "userSpaceOnUse" });
        let currentIn = "SourceGraphic";
        const hasPulse = enabled.some(e => e.type === "glow" && e.params?.pulseEnabled);
        if (hasPulse) {
            const style = createSVGElement("style");
            style.textContent = `
                @keyframes glow-pulse-opacity { 0%, 100% { flood-opacity: var(--pulse-min, 0); } 50% { flood-opacity: var(--pulse-max, 1); } }
                .animate-glow-pulse { animation: glow-pulse-opacity var(--pulse-period, 1s) ease-in-out var(--pulse-delay, 0s) var(--pulse-count, infinite) both; }
            `;
            filter.appendChild(style);
        }
        enabled.forEach((eff, idx) => {
            const res = `eff-${idx}`;
            if (eff.type === 'blur') {
                const blur = createSVGElement("feGaussianBlur");
                setAttributes(blur, { in: currentIn, stdDeviation: eff.params?.strength || 4, result: res });
                filter.appendChild(blur);
                currentIn = res;
            }
            else if (eff.type === 'glow') {
                const dist = eff.params?.blur || 10;
                const { color, alpha } = parseHex8(eff.params?.color || "#ffffff");
                const outerStr = eff.params?.outerStrength ?? 2;
                const innerStr = eff.params?.innerStrength ?? 0;
                const knockout = !!eff.params?.knockout;
                const outerRes = `${res}-outer`;
                const innerRes = `${res}-inner`;
                if (outerStr > 0 || dist > 0) {
                    const dilate = createSVGElement("feMorphology");
                    setAttributes(dilate, { in: "SourceAlpha", operator: "dilate", radius: 1, result: `${res}-dil` });
                    filter.appendChild(dilate);
                    const bl = createSVGElement("feGaussianBlur");
                    setAttributes(bl, { in: `${res}-dil`, stdDeviation: dist, result: `${res}-bl` });
                    filter.appendChild(bl);
                    const trans = createSVGElement("feComponentTransfer");
                    setAttributes(trans, { result: `${res}-int` });
                    const funcA = createSVGElement("feFuncA");
                    setAttributes(funcA, { type: "linear", slope: outerStr });
                    trans.appendChild(funcA);
                    filter.appendChild(trans);
                    const flood = createSVGElement("feFlood");
                    setAttributes(flood, { "flood-color": color, "flood-opacity": eff.params?.pulseEnabled ? (eff.params?.pulseMin ?? 0) : alpha, result: `${res}-fl` });
                    if (eff.params?.pulseEnabled) {
                        flood.classList.add("animate-glow-pulse");
                        flood.style.setProperty("--pulse-period", `${eff.params.pulsePeriod || 1}s`);
                        flood.style.setProperty("--pulse-min", `${eff.params.pulseMin ?? 0}`);
                        flood.style.setProperty("--pulse-max", `${eff.params.pulseMax ?? alpha}`);
                        flood.style.setProperty("--pulse-count", (eff.params.pulseCount || 0) === 0 ? "infinite" : `${eff.params.pulseCount}`);
                        flood.style.setProperty("--pulse-delay", `${eff.params.pulseDelay || 0}s`);
                    }
                    filter.appendChild(flood);
                    const comp = createSVGElement("feComposite");
                    setAttributes(comp, { in: `${res}-fl`, in2: `${res}-int`, operator: "in", result: outerRes });
                    filter.appendChild(comp);
                }
                if (innerStr > 0 || dist > 0) {
                    const bl = createSVGElement("feGaussianBlur");
                    setAttributes(bl, { in: "SourceAlpha", stdDeviation: dist, result: `${res}-in-bl` });
                    filter.appendChild(bl);
                    const trans = createSVGElement("feComponentTransfer");
                    setAttributes(trans, { result: `${res}-int` });
                    const funcA1 = createSVGElement("feFuncA");
                    setAttributes(funcA1, { type: "gamma", amplitude: innerStr, exponent: 1.5, offset: 0 });
                    trans.appendChild(funcA1);
                    filter.appendChild(trans);
                    const comp1 = createSVGElement("feComposite");
                    setAttributes(comp1, { in: `${res}-int`, in2: "SourceAlpha", operator: "in", result: `${res}-in-mask` });
                    filter.appendChild(comp1);
                    const flood = createSVGElement("feFlood");
                    setAttributes(flood, { "flood-color": color, "flood-opacity": eff.params?.pulseEnabled ? (eff.params?.pulseMin ?? 0) : alpha, result: `${res}-in-fl` });
                    if (eff.params?.pulseEnabled) {
                        flood.classList.add("animate-glow-pulse");
                        flood.style.setProperty("--pulse-period", `${eff.params.pulsePeriod || 1}s`);
                        flood.style.setProperty("--pulse-min", `${eff.params.pulseMin ?? 0}`);
                        flood.style.setProperty("--pulse-max", `${eff.params.pulseMax ?? alpha}`);
                        flood.style.setProperty("--pulse-count", (eff.params.pulseCount || 0) === 0 ? "infinite" : `${eff.params.pulseCount}`);
                        flood.style.setProperty("--pulse-delay", `${eff.params.pulseDelay || 0}s`);
                    }
                    filter.appendChild(flood);
                    const comp2 = createSVGElement("feComposite");
                    setAttributes(comp2, { in: `${res}-in-fl`, in2: `${res}-in-mask`, operator: "in", result: innerRes });
                    filter.appendChild(comp2);
                }
                if (knockout) {
                    const outerPunchedName = `${res}-outer-punched`;
                    if (outerStr > 0 || dist > 0) {
                        const punch = createSVGElement("feComposite");
                        setAttributes(punch, { in: outerRes, in2: "SourceAlpha", operator: "out", result: outerPunchedName });
                        filter.appendChild(punch);
                    }
                    const merge = createSVGElement("feMerge");
                    if (outerStr > 0 || dist > 0) {
                        const nO = createSVGElement("feMergeNode");
                        setAttributes(nO, { in: outerPunchedName });
                        merge.appendChild(nO);
                    }
                    if (innerStr > 0 || dist > 0) {
                        const nI = createSVGElement("feMergeNode");
                        setAttributes(nI, { in: innerRes });
                        merge.appendChild(nI);
                    }
                    setAttributes(merge, { result: res });
                    filter.appendChild(merge);
                }
                else {
                    const merge = createSVGElement("feMerge");
                    if (outerStr > 0 || dist > 0) {
                        const nO = createSVGElement("feMergeNode");
                        setAttributes(nO, { in: outerRes });
                        merge.appendChild(nO);
                    }
                    const nS = createSVGElement("feMergeNode");
                    setAttributes(nS, { in: currentIn });
                    merge.appendChild(nS);
                    if (innerStr > 0 || dist > 0) {
                        const nI = createSVGElement("feMergeNode");
                        setAttributes(nI, { in: innerRes });
                        merge.appendChild(nI);
                    }
                    setAttributes(merge, { result: res });
                    filter.appendChild(merge);
                }
                currentIn = res;
            }
            else if (eff.type === 'outline') {
                const thick = eff.params?.thickness || 2;
                const { color, alpha } = parseHex8(eff.params?.color || "#010101");
                const dil = createSVGElement("feMorphology");
                setAttributes(dil, { in: "SourceAlpha", operator: "dilate", radius: thick, result: `${res}-dil` });
                filter.appendChild(dil);
                const fl = createSVGElement("feFlood");
                setAttributes(fl, { "flood-color": color, "flood-opacity": alpha, result: `${res}-fl` });
                filter.appendChild(fl);
                const cp = createSVGElement("feComposite");
                setAttributes(cp, { in: `${res}-fl`, in2: `${res}-dil`, operator: "in", result: `${res}-out` });
                filter.appendChild(cp);
                const merge = createSVGElement("feMerge");
                const n1 = createSVGElement("feMergeNode");
                setAttributes(n1, { in: `${res}-out` });
                merge.appendChild(n1);
                const n2 = createSVGElement("feMergeNode");
                setAttributes(n2, { in: currentIn });
                merge.appendChild(n2);
                setAttributes(merge, { result: res });
                filter.appendChild(merge);
                currentIn = res;
            }
        });
        const primitiveCount = filter.querySelectorAll("feGaussianBlur, feMorphology, feFlood, feComposite, feMerge, feComponentTransfer").length;
        if (primitiveCount === 0)
            return null;
        registerDef(filter);
        return `url(#${id})`;
    }
};
function createAlphaGradientMask(maskId, effect, node, registerDef, createSVGElement) {
    const mask = createSVGElement("mask");
    setAttributes(mask, { id: maskId, maskUnits: "objectBoundingBox", maskContentUnits: "objectBoundingBox" });
    const gradId = `grad-mask-${maskId}`;
    const params = effect.params || {};
    const type = params.type || "linear";
    if (type === "radial") {
        const grad = createSVGElement("radialGradient");
        grad.setAttribute("id", gradId);
        const cx = params.centerX ?? 0.5;
        const cy = params.centerY ?? 0.5;
        const r = params.radius ?? 0.5;
        setAttributes(grad, {
            gradientUnits: "objectBoundingBox",
            cx: cx, cy: cy, r: r,
            fx: cx, fy: cy
        });
        const stops = params.stops || [];
        stops.forEach((s) => {
            const stop = createSVGElement("stop");
            const { alpha } = parseHex8(s.color || "#ffffff");
            setAttributes(stop, { offset: `${(Number(s.offset || 0)) * 100}%`, "stop-color": "white", "stop-opacity": alpha });
            grad.appendChild(stop);
        });
        registerDef(grad);
    }
    else {
        const grad = createSVGElement("linearGradient");
        grad.setAttribute("id", gradId);
        const angle = Number(params.angle ?? 90);
        const r = (angle * Math.PI) / 180;
        const x1 = 0.5 - 0.5 * Math.cos(r), y1 = 0.5 - 0.5 * Math.sin(r);
        const x2 = 0.5 + 0.5 * Math.cos(r), y2 = 0.5 + 0.5 * Math.sin(r);
        setAttributes(grad, {
            gradientUnits: params.units ?? "objectBoundingBox",
            x1: x1, y1: y1, x2: x2, y2: y2
        });
        const stops = params.stops || [{ offset: 0, color: "#ffffffff" }, { offset: 1, color: "#ffffff00" }];
        stops.forEach((s) => {
            const stop = createSVGElement("stop");
            const { alpha } = parseHex8(s.color || "#ffffff");
            setAttributes(stop, { offset: `${(Number(s.offset || 0)) * 100}%`, "stop-color": "white", "stop-opacity": alpha });
            grad.appendChild(stop);
        });
        registerDef(grad);
    }
    const rect = createSVGElement("rect");
    setAttributes(rect, { x: "0", y: "0", width: "1", height: "1", fill: `url(#${gradId})` });
    mask.appendChild(rect);
    registerDef(mask);
}
function applyEffects(target, effects, nodeId, suffix, registerDef, createSVGElement) {
    if (!effects || !effects.some(e => e && e.enabled))
        return target;
    const enabledEffects = effects.filter(e => e && e.enabled);
    let currentTarget = target;
    const filterable = enabledEffects.filter(e => e.type !== 'alpha-gradient');
    if (filterable.length > 0) {
        const filterId = `filter-${nodeId}-${suffix}`;
        const fUrl = FilterFactory.createFilter(filterable, filterId, registerDef, createSVGElement);
        if (fUrl) {
            currentTarget.setAttribute("filter", fUrl);
        }
    }
    const gradients = enabledEffects.filter(e => e.type === 'alpha-gradient');
    gradients.forEach((eff, idx) => {
        if (currentTarget.getAttribute("mask")) {
            const wrapper = createSVGElement("g");
            if (currentTarget.parentElement) {
                currentTarget.parentElement.replaceChild(wrapper, currentTarget);
                wrapper.appendChild(currentTarget);
            }
            else {
                wrapper.appendChild(currentTarget);
            }
            currentTarget = wrapper;
        }
        const maskId = `mask-grad-${nodeId}-${suffix}-${idx}`;
        createAlphaGradientMask(maskId, eff, { id: nodeId }, registerDef, createSVGElement);
        currentTarget.setAttribute("mask", `url(#${maskId})`);
    });
    return currentTarget;
}
function createAppearanceMask(maskId, app, node, appIdx, isRect, measuredW, measuredH, registerDef, createSVGElement) {
    const mask = createSVGElement("mask");
    mask.setAttribute("id", maskId);
    setAttributes(mask, { maskUnits: "userSpaceOnUse", maskContentUnits: "userSpaceOnUse" });
    const bg = createSVGElement("rect");
    setAttributes(bg, { x: -5000, y: -5000, width: 10000, height: 10000 });
    bg.setAttribute("fill", app.maskMode === 'clipping' ? "black" : "white");
    mask.appendChild(bg);
    const shapeGroup = createSVGElement("g");
    const maskColor = app.maskMode === 'clipping' ? "white" : "black";
    const maskApp = { ...app, fill: maskColor, color: maskColor, shadowEnabled: false };
    drawAppearanceContent(shapeGroup, maskApp, node, appIdx, isRect, measuredW, measuredH, registerDef, createSVGElement);
    mask.appendChild(shapeGroup);
    return mask;
}


    // Inject layout utilities (for AutoLayout support in player)
    class SimpleTransform {
    m;
    constructor() {
        this.m = [1, 0, 0, 1, 0, 0];
    }
    translate(x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    }
    rotate(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const m11 = this.m[0] * c + this.m[2] * s;
        const m12 = this.m[1] * c + this.m[3] * s;
        const m21 = this.m[0] * -s + this.m[2] * c;
        const m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    scale(sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    }
    point(p) {
        return {
            x: p.x * this.m[0] + p.y * this.m[2] + this.m[4],
            y: p.x * this.m[1] + p.y * this.m[3] + this.m[5]
        };
    }
}
function getPaddingValues(padding) {
    if (typeof padding === "number") {
        return { top: padding, right: padding, bottom: padding, left: padding };
    }
    if (padding && typeof padding === "object") {
        return {
            top: padding.top || 0,
            right: padding.right || 0,
            bottom: padding.bottom || 0,
            left: padding.left || 0
        };
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
}
// Children that take part in a group's bounds / AutoLayout flow.
// ignoreInLayout children are still rendered (at their own position) but don't affect the size.
function isLayoutChild(child) {
    return !!child && child.visible !== false && child.ignoreInLayout !== true;
}
// Computes the visual bounds of a node (recursive for groups without autolayout)
function calculateNodeBounds(nodeId, doc) {
    const node = doc.nodesById[nodeId];
    if (!node)
        return { x: 0, y: 0, width: 0, height: 0 };
    if (node.type === "group" && !node.clip) {
        const group = node;
        if (group.autoLayout?.enabled) {
            const layout = calculateAutoLayout(group, doc);
            return layout.bounds;
        }
        // Recursive union for unclipped group
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const children = group.children || [];
        const visibleChildren = children.filter(childId => isLayoutChild(doc.nodesById[childId]));
        if (visibleChildren.length === 0)
            return { x: 0, y: 0, width: 0, height: 0 };
        visibleChildren.forEach((childId) => {
            const childBounds = calculateNodeBounds(childId, doc);
            const child = doc.nodesById[childId];
            if (!child)
                return;
            // Transform child bounds to Group space
            const m = new SimpleTransform();
            const rot = Number(child.rotation || 0);
            const sx = child.scaleX !== undefined ? Number(child.scaleX) : 1;
            const sy = child.scaleY !== undefined ? Number(child.scaleY) : 1;
            const px = Number(child.pivotX || 0);
            const py = Number(child.pivotY || 0);
            m.translate(Number(child.x || 0), Number(child.y || 0));
            m.rotate(rot * Math.PI / 180);
            m.scale(sx, sy);
            m.translate(-px, -py);
            const points = [
                { x: childBounds.x, y: childBounds.y },
                { x: childBounds.x + childBounds.width, y: childBounds.y },
                { x: childBounds.x + childBounds.width, y: childBounds.y + childBounds.height },
                { x: childBounds.x, y: childBounds.y + childBounds.height }
            ];
            points.forEach(p => {
                const tp = m.point(p);
                minX = Math.min(minX, tp.x);
                minY = Math.min(minY, tp.y);
                maxX = Math.max(maxX, tp.x);
                maxY = Math.max(maxY, tp.y);
            });
        });
        if (minX === Infinity)
            return { x: 0, y: 0, width: 0, height: 0 };
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
    else {
        if (node.type === "group" && node.clipRect) {
            const clip = node.clipRect;
            return {
                x: clip.x || 0,
                y: clip.y || 0,
                width: clip.width || 0,
                height: clip.height || 0
            };
        }
        return {
            x: 0,
            y: 0,
            width: node.width || 0,
            height: node.height || 0
        };
    }
}
function calculateAutoLayout(group, doc) {
    if (!group.autoLayout || !group.autoLayout.enabled) {
        return { childrenPositions: {}, bounds: { x: 0, y: 0, width: 0, height: 0 } };
    }
    const direction = group.autoLayout.direction || "horizontal";
    const gap = group.autoLayout.gap || 0;
    const padding = group.autoLayout.padding || 0;
    const alignItems = group.autoLayout.alignItems || "start";
    const justifyContent = group.autoLayout.justifyContent || "start";
    const pad = getPaddingValues(padding);
    const childrenPositions = {};
    const children = group.children || [];
    // Filter visible children
    const visibleChildren = children.filter(childId => isLayoutChild(doc.nodesById[childId]));
    let currentX = pad.left;
    let currentY = pad.top;
    let maxChildWidth = 0;
    let maxChildHeight = 0;
    let totalContentWidth = 0;
    let totalContentHeight = 0;
    const childSizes = visibleChildren.map(childId => {
        const bounds = calculateNodeBounds(childId, doc);
        const child = doc.nodesById[childId];
        // We consider the scale and rotation? AutoLayout usually ignores rotation or treats the bounding box as the size.
        // Let's use the local visual bounds size. We can apply child scale to the bounds.
        // Actually calculateNodeBounds already returns the unscaled local bounds (e.g. width/height for text/rect, or inner union for group).
        // Wait, for text, node.width is logical. It is scaled by scaleX.
        // In Konva/Figma, AutoLayout uses the unscaled bounds or the scaled bounding box? Figma uses scaled bounding box.
        const m = new SimpleTransform();
        if (child) {
            const rot = Number(child.rotation || 0);
            const sx = child.scaleX !== undefined ? Number(child.scaleX) : 1;
            const sy = child.scaleY !== undefined ? Number(child.scaleY) : 1;
            m.rotate(rot * Math.PI / 180);
            m.scale(sx, sy);
        }
        const points = [
            { x: bounds.x, y: bounds.y },
            { x: bounds.x + bounds.width, y: bounds.y },
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
            { x: bounds.x, y: bounds.y + bounds.height }
        ];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        points.forEach(p => {
            const tp = m.point(p);
            minX = Math.min(minX, tp.x);
            minY = Math.min(minY, tp.y);
            maxX = Math.max(maxX, tp.x);
            maxY = Math.max(maxY, tp.y);
        });
        const scaledWidth = maxX - minX;
        const scaledHeight = maxY - minY;
        return { id: childId, bounds, scaledWidth, scaledHeight, child };
    });
    childSizes.forEach(info => {
        maxChildWidth = Math.max(maxChildWidth, info.scaledWidth);
        maxChildHeight = Math.max(maxChildHeight, info.scaledHeight);
        totalContentWidth += info.scaledWidth;
        totalContentHeight += info.scaledHeight;
    });
    totalContentWidth += gap * Math.max(0, visibleChildren.length - 1);
    totalContentHeight += gap * Math.max(0, visibleChildren.length - 1);
    const groupWidth = direction === "horizontal"
        ? totalContentWidth + pad.left + pad.right
        : (direction === "vertical" ? maxChildWidth + pad.left + pad.right : 0);
    const groupHeight = direction === "vertical"
        ? totalContentHeight + pad.top + pad.bottom
        : (direction === "horizontal" ? maxChildHeight + pad.top + pad.bottom : 0);
    // Now place children
    visibleChildren.forEach((childId, index) => {
        const info = childSizes[index];
        let x = 0;
        let y = 0;
        if (direction === "horizontal") {
            x = currentX;
            if (alignItems === "center") {
                y = pad.top + (maxChildHeight - info.scaledHeight) / 2;
            }
            else if (alignItems === "end") {
                y = pad.top + (maxChildHeight - info.scaledHeight);
            }
            else {
                y = pad.top;
            }
            currentX += info.scaledWidth + gap;
        }
        else if (direction === "vertical") {
            y = currentY;
            if (alignItems === "center") {
                x = pad.left + (maxChildWidth - info.scaledWidth) / 2;
            }
            else if (alignItems === "end") {
                x = pad.left + (maxChildWidth - info.scaledWidth);
            }
            else {
                x = pad.left;
            }
            currentY += info.scaledHeight + gap;
        }
        // Compensate for child's own local bounds origin and pivot
        // so that the child's bounding box top-left lands exactly at (x, y)
        const cx = info.child?.scaleX !== undefined ? Number(info.child.scaleX) : 1;
        const cy = info.child?.scaleY !== undefined ? Number(info.child.scaleY) : 1;
        const px = Number(info.child?.pivotX || 0);
        const py = Number(info.child?.pivotY || 0);
        const pivotOffsetX = info.child ? px * cx : 0;
        const pivotOffsetY = info.child ? py * cy : 0;
        childrenPositions[childId] = {
            x: x - (info.bounds.x * cx) + pivotOffsetX,
            y: y - (info.bounds.y * cy) + pivotOffsetY
        };
    });
    let offsetX = 0;
    let offsetY = 0;
    if (direction === "horizontal") {
        if (justifyContent === "end") {
            offsetX = groupWidth;
        }
        else if (justifyContent === "center") {
            offsetX = groupWidth / 2;
        }
    }
    else if (direction === "vertical") {
        if (justifyContent === "end") {
            offsetY = groupHeight;
        }
        else if (justifyContent === "center") {
            offsetY = groupHeight / 2;
        }
    }
    if (offsetX !== 0 || offsetY !== 0) {
        visibleChildren.forEach((childId) => {
            childrenPositions[childId].x -= offsetX;
            childrenPositions[childId].y -= offsetY;
        });
    }
    return {
        childrenPositions,
        bounds: { x: -offsetX, y: -offsetY, width: groupWidth, height: groupHeight }
    };
}

const expressionCache = new Map();
function getValueByPath(obj, path) {
    if (!obj || !path)
        return undefined;
    if (path in obj)
        return obj[path];
    const parts = path.split('.');
    let curr = obj;
    for (const part of parts) {
        if (curr === null || curr === undefined)
            return undefined;
        curr = curr[part];
    }
    return curr;
}
// Stable-reference cache for resolveDynamicVisibility.
// Prevents unnecessary Konva/SVG full rebuilds when doc reference hasn't changed
// (e.g. during zoom/pan operations that trigger render() via React re-renders).
let _rdv_lastInputDoc = null;
let _rdv_lastOutputDoc = null;
let _rdv_lastKeyexpSummary = "";
function evaluateConditionLogic(condition, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node) {
    if (condition.useExpression && condition.expression) {
        try {
            const context = {
                ...(globalKeyexpMap || {}),
                ...(telopId && telopToKeyexpMap[telopId] ? telopToKeyexpMap[telopId] : {}),
                ...(externalKeyValues || {}),
                ...(node && node.type === 'text' && node.text !== undefined ? { [node.keyexp || node.name || 'self']: node.text } : {})
            };
            const customFunctions = {
                isEmpty: (val) => val === null || val === undefined || val === '',
                contains: (str, search) => String(str).includes(String(search))
            };
            let fn = expressionCache.get(condition.expression);
            if (!fn) {
                fn = new Function('context', 'customFunctions', `
                    with (customFunctions) {
                        with (context) {
                            return !!(${condition.expression});
                        }
                    }
                `);
                expressionCache.set(condition.expression, fn);
            }
            return !!fn(context, customFunctions);
        }
        catch (e) {
            console.warn("Expression evaluation error", e);
            return false;
        }
    }
    else {
        const targetKeyexp = (condition.targetKeyexp || "").trim();
        let textValue = undefined;
        // 1. External key values
        if (externalKeyValues) {
            if (targetKeyexp) {
                const externalVal = getValueByPath(externalKeyValues, targetKeyexp);
                if (externalVal !== undefined && externalVal !== null) {
                    textValue = String(externalVal).trim();
                }
            }
            else if (node && node.keyexp) {
                const externalVal = getValueByPath(externalKeyValues, node.keyexp);
                if (externalVal !== undefined && externalVal !== null) {
                    textValue = String(externalVal).trim();
                }
            }
        }
        // 2. Self node context resolution (priority over remote map when rule targets this node)
        // If targetKeyexp is empty, or matches node.keyexp, node.name, "this", "self"
        if (textValue === undefined && node) {
            const isSelf = !targetKeyexp
                || targetKeyexp === node.keyexp
                || targetKeyexp === node.name
                || targetKeyexp.toLowerCase() === "this"
                || targetKeyexp.toLowerCase() === "self";
            if (isSelf) {
                if (node.type === "text" && node.text !== undefined && node.text !== null && String(node.text).trim() !== "") {
                    textValue = String(node.text).trim();
                }
                else if (node.keyexp) {
                    textValue = String(node.keyexp).trim();
                }
            }
        }
        // 3. Telop scope text node mappings
        if (textValue === undefined && telopId && telopToKeyexpMap[telopId] && targetKeyexp) {
            if (telopToKeyexpMap[telopId][targetKeyexp] !== undefined) {
                textValue = String(telopToKeyexpMap[telopId][targetKeyexp] ?? "").trim();
            }
        }
        // 4. Global text node mappings
        if (textValue === undefined && globalKeyexpMap && targetKeyexp) {
            if (globalKeyexpMap[targetKeyexp] !== undefined) {
                textValue = String(globalKeyexpMap[targetKeyexp] ?? "").trim();
            }
        }
        const resolvedText = textValue ?? "";
        const compVal = String(condition.value ?? "").trim();
        const matchVal = (v) => {
            switch (condition.operator) {
                case "empty":
                    return !v || v === "";
                case "not_empty":
                    return !!v && v !== "";
                case "equals":
                    return v === compVal;
                case "not_equals":
                    return v !== compVal;
                case "contains":
                    if (!compVal)
                        return true;
                    return v.includes(compVal) || v.toLowerCase().includes(compVal.toLowerCase());
                case "not_contains":
                    if (!compVal)
                        return true;
                    return !v.includes(compVal) && !v.toLowerCase().includes(compVal.toLowerCase());
                case "gt":
                case "gte":
                case "lt":
                case "lte": {
                    const numVal = parseFloat(v);
                    const compValNum = parseFloat(compVal);
                    if (isNaN(numVal) || isNaN(compValNum)) {
                        return false;
                    }
                    else if (condition.operator === "gt") {
                        return numVal > compValNum;
                    }
                    else if (condition.operator === "gte") {
                        return numVal >= compValNum;
                    }
                    else if (condition.operator === "lt") {
                        return numVal < compValNum;
                    }
                    else if (condition.operator === "lte") {
                        return numVal <= compValNum;
                    }
                    return false;
                }
                default:
                    return true;
            }
        };
        return matchVal(resolvedText);
    }
}
function resolveConditionalColor(defaultColor, rules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node) {
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
        return defaultColor;
    }
    for (const rule of rules) {
        if (rule.enabled !== false && evaluateConditionLogic(rule, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node)) {
            if (rule.color !== undefined && rule.color !== "") {
                return rule.color;
            }
        }
    }
    return defaultColor;
}
function evaluateAppearanceColorRules(app, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node) {
    if (!app)
        return app;
    let currentApp = app;
    // 1. Per-property color rules (fillColorRules, strokeColorRules, shadowColorRules)
    if (Array.isArray(app.fillColorRules) && app.fillColorRules.length > 0) {
        const newFill = resolveConditionalColor(currentApp.fill, app.fillColorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
        if (newFill !== currentApp.fill) {
            currentApp = { ...currentApp, fill: newFill };
        }
    }
    if (Array.isArray(app.strokeColorRules) && app.strokeColorRules.length > 0) {
        const newStroke = resolveConditionalColor(currentApp.color, app.strokeColorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
        if (newStroke !== currentApp.color) {
            currentApp = { ...currentApp, color: newStroke };
        }
    }
    if (Array.isArray(app.shadowColorRules) && app.shadowColorRules.length > 0) {
        const newShadow = resolveConditionalColor(currentApp.shadowColor, app.shadowColorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
        if (newShadow !== currentApp.shadowColor) {
            currentApp = { ...currentApp, shadowColor: newShadow };
        }
    }
    // 2. Gradient stops per-stop color rules
    if (currentApp.gradientConfig?.stops && Array.isArray(currentApp.gradientConfig.stops)) {
        let stopsChanged = false;
        const newStops = currentApp.gradientConfig.stops.map((stop) => {
            if (Array.isArray(stop.colorRules) && stop.colorRules.length > 0) {
                const newC = resolveConditionalColor(stop.color, stop.colorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
                if (newC !== stop.color) {
                    stopsChanged = true;
                    return { ...stop, color: newC };
                }
            }
            return stop;
        });
        if (stopsChanged) {
            currentApp = {
                ...currentApp,
                gradientConfig: { ...currentApp.gradientConfig, stops: newStops },
                fill: newStops.map((s) => s.color)
            };
        }
    }
    // 3. Top-level colorRules (legacy / composite support)
    if (Array.isArray(app.colorRules) && app.colorRules.length > 0) {
        for (const rule of app.colorRules) {
            if (rule.enabled !== false && evaluateConditionLogic(rule, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node)) {
                let fill = currentApp.fill;
                let color = currentApp.color;
                let shadowColor = currentApp.shadowColor;
                let hasChange = false;
                if ((rule.overrideFill || rule.fill !== undefined) && rule.fill !== undefined && rule.fill !== "") {
                    fill = rule.fill;
                    hasChange = true;
                }
                if ((rule.overrideStrokeColor || rule.color !== undefined) && rule.color !== undefined && rule.color !== "") {
                    color = rule.color;
                    hasChange = true;
                }
                if ((rule.overrideShadowColor || rule.shadowColor !== undefined) && rule.shadowColor !== undefined && rule.shadowColor !== "") {
                    shadowColor = rule.shadowColor;
                    hasChange = true;
                }
                if (hasChange) {
                    currentApp = { ...currentApp, fill, color, shadowColor };
                }
                break;
            }
        }
    }
    return currentApp;
}
function resolveDynamicVisibility(doc, externalKeyValues) {
    // 0. Immediate short-circuit: If externalKeyValues is not passed and doc reference has not changed,
    // nothing inside has changed (vital for 60fps pan/zoom performance in editor).
    if (!externalKeyValues && doc === _rdv_lastInputDoc && _rdv_lastOutputDoc !== null) {
        return _rdv_lastOutputDoc;
    }
    let currentKeyexpSummary = "";
    const telopToKeyexpMap = {};
    const globalKeyexpMap = {};
    const telopIdCache = new Map();
    // Helper to find the parent Telop node's ID with memoization
    const getTelopId = (nodeId) => {
        if (telopIdCache.has(nodeId)) {
            return telopIdCache.get(nodeId);
        }
        let curr = doc.nodesById[nodeId];
        while (curr) {
            if (curr.type === "telop") {
                telopIdCache.set(nodeId, curr.id);
                return curr.id;
            }
            if (!curr.parentId)
                break;
            curr = doc.nodesById[curr.parentId];
        }
        telopIdCache.set(nodeId, null);
        return null;
    };
    // 1st pass: Collect keyexp -> text content mappings for each telop and globally
    for (const node of Object.values(doc.nodesById)) {
        if (node.type === "text") {
            const textVal = node.text || "";
            const keyexpVal = (node.keyexp || "").trim();
            currentKeyexpSummary += node.id + ":" + keyexpVal + ":" + textVal + ";";
            if (keyexpVal) {
                if (!globalKeyexpMap[keyexpVal] || node.name === keyexpVal) {
                    globalKeyexpMap[keyexpVal] = textVal;
                }
            }
            if (node.name && !globalKeyexpMap[node.name]) {
                globalKeyexpMap[node.name] = textVal;
            }
            const telopId = getTelopId(node.id);
            if (telopId) {
                if (!telopToKeyexpMap[telopId]) {
                    telopToKeyexpMap[telopId] = {};
                }
                if (keyexpVal) {
                    if (!telopToKeyexpMap[telopId][keyexpVal] || node.name === keyexpVal) {
                        telopToKeyexpMap[telopId][keyexpVal] = textVal;
                    }
                }
                if (node.name && telopToKeyexpMap[telopId][node.name] === undefined) {
                    telopToKeyexpMap[telopId][node.name] = textVal;
                }
            }
        }
    }
    // 2nd pass: Resolve visibility, image reference, and color condition rules
    const visibilityOverrides = {};
    const assetOverrides = {};
    const appearanceOverrides = {};
    let hasAnyChange = false;
    for (const node of Object.values(doc.nodesById)) {
        const telopId = getTelopId(node.id);
        // 1. Visibility Condition
        // Preserve original tree visibility state
        const originalVisible = node._originalVisible !== undefined
            ? node._originalVisible
            : (node.visible !== false);
        if (node.visibilityCondition && node.visibilityCondition.enabled) {
            const conditionResult = evaluateConditionLogic(node.visibilityCondition, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
            // User requirement:
            // - If tree is hidden (originalVisible === false), condition CANNOT force it visible (must stay false)
            // - If tree is visible (originalVisible === true), follow condition result
            const targetVisible = originalVisible ? conditionResult : false;
            if (targetVisible !== node.visible || node._originalVisible !== originalVisible) {
                visibilityOverrides[node.id] = {
                    visible: targetVisible,
                    _originalVisible: originalVisible
                };
                hasAnyChange = true;
            }
        }
        else if (node._originalVisible !== undefined && node.visible !== node._originalVisible) {
            // Restore original tree visibility if condition was disabled
            visibilityOverrides[node.id] = {
                visible: node._originalVisible,
                _originalVisible: undefined
            };
            hasAnyChange = true;
        }
        // 2. Image Reference Condition (Only active when node's own keyexp is not set)
        if (node.type === "image") {
            const imgNode = node;
            const hasOwnKeyexp = !!imgNode.keyexp && String(imgNode.keyexp).trim() !== "";
            const refCond = imgNode.imageReferenceCondition;
            // Preserve original assetId if not already stored
            const originalAssetId = imgNode._originalAssetId || imgNode.assetId;
            if (!hasOwnKeyexp && refCond && refCond.enabled) {
                let matchedAssetId = null;
                // Priority 1: Value mappings for targetKeyexp
                if (refCond.targetKeyexp && Array.isArray(refCond.mappings) && refCond.mappings.length > 0) {
                    for (const m of refCond.mappings) {
                        if (m.assetId) {
                            const isMatch = evaluateConditionLogic({
                                enabled: true,
                                targetKeyexp: refCond.targetKeyexp,
                                operator: m.operator || "equals",
                                value: m.value
                            }, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap);
                            if (isMatch) {
                                matchedAssetId = m.assetId;
                                break;
                            }
                        }
                    }
                }
                // Priority 2: Multi-rule evaluation if rules exist
                if (!matchedAssetId && Array.isArray(refCond.rules) && refCond.rules.length > 0) {
                    for (const rule of refCond.rules) {
                        if (rule.enabled !== false && evaluateConditionLogic(rule, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap)) {
                            if (rule.assetId) {
                                matchedAssetId = rule.assetId;
                                break;
                            }
                        }
                    }
                }
                // Priority 3: Single-condition evaluation if no rule matched
                if (!matchedAssetId && evaluateConditionLogic(refCond, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap)) {
                    if (refCond.assetId) {
                        matchedAssetId = refCond.assetId;
                    }
                }
                const targetAssetId = matchedAssetId || originalAssetId;
                if (targetAssetId && targetAssetId !== imgNode.assetId) {
                    assetOverrides[node.id] = {
                        assetId: targetAssetId,
                        _originalAssetId: (targetAssetId !== originalAssetId) ? originalAssetId : undefined
                    };
                    hasAnyChange = true;
                }
            }
            else if (imgNode._originalAssetId && imgNode.assetId !== originalAssetId) {
                // If condition was disabled or keyexp was specified, restore original asset
                assetOverrides[node.id] = {
                    assetId: originalAssetId,
                    _originalAssetId: undefined
                };
                hasAnyChange = true;
            }
        }
        // 3. Appearance Color Condition Rules
        const nodeAny = node;
        const origStyleApps = nodeAny._originalStyleAppearances || (nodeAny.style?.appearances ? JSON.parse(JSON.stringify(nodeAny.style.appearances)) : undefined);
        const origBgApps = nodeAny._originalBgAppearances || (nodeAny.background?.appearances ? JSON.parse(JSON.stringify(nodeAny.background.appearances)) : undefined);
        if (origStyleApps && Array.isArray(origStyleApps)) {
            let styleAppChanged = false;
            const newApps = origStyleApps.map((app) => {
                const evalApp = evaluateAppearanceColorRules(app, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
                if (evalApp !== app)
                    styleAppChanged = true;
                return evalApp;
            });
            const currentStyleAppsStr = JSON.stringify(nodeAny.style?.appearances);
            const newAppsStr = JSON.stringify(newApps);
            const origStyleAppsStr = JSON.stringify(origStyleApps);
            if (styleAppChanged) {
                if (currentStyleAppsStr !== newAppsStr || !nodeAny._originalStyleAppearances) {
                    appearanceOverrides[node.id] = {
                        ...(appearanceOverrides[node.id] || {}),
                        style: { ...nodeAny.style, appearances: newApps },
                        _originalStyleAppearances: origStyleApps
                    };
                    hasAnyChange = true;
                }
            }
            else if (nodeAny._originalStyleAppearances && currentStyleAppsStr !== origStyleAppsStr) {
                appearanceOverrides[node.id] = {
                    ...(appearanceOverrides[node.id] || {}),
                    style: { ...nodeAny.style, appearances: origStyleApps },
                    _originalStyleAppearances: undefined
                };
                hasAnyChange = true;
            }
        }
        if (origBgApps && Array.isArray(origBgApps)) {
            let bgAppChanged = false;
            const newBgApps = origBgApps.map((app) => {
                const evalApp = evaluateAppearanceColorRules(app, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
                if (evalApp !== app)
                    bgAppChanged = true;
                return evalApp;
            });
            const currentBgAppsStr = JSON.stringify(nodeAny.background?.appearances);
            const newBgAppsStr = JSON.stringify(newBgApps);
            const origBgAppsStr = JSON.stringify(origBgApps);
            if (bgAppChanged) {
                if (currentBgAppsStr !== newBgAppsStr || !nodeAny._originalBgAppearances) {
                    appearanceOverrides[node.id] = {
                        ...(appearanceOverrides[node.id] || {}),
                        background: { ...nodeAny.background, appearances: newBgApps },
                        _originalBgAppearances: origBgApps
                    };
                    hasAnyChange = true;
                }
            }
            else if (nodeAny._originalBgAppearances && currentBgAppsStr !== origBgAppsStr) {
                appearanceOverrides[node.id] = {
                    ...(appearanceOverrides[node.id] || {}),
                    background: { ...nodeAny.background, appearances: origBgApps },
                    _originalBgAppearances: undefined
                };
                hasAnyChange = true;
            }
        }
    }
    if (!hasAnyChange) {
        if (!externalKeyValues) {
            _rdv_lastInputDoc = doc;
            _rdv_lastOutputDoc = doc;
            _rdv_lastKeyexpSummary = currentKeyexpSummary;
        }
        return doc;
    }
    const updatedNodes = { ...doc.nodesById };
    Object.entries(visibilityOverrides).forEach(([id, visData]) => {
        updatedNodes[id] = {
            ...updatedNodes[id],
            visible: visData.visible,
            ...(visData._originalVisible !== undefined ? { _originalVisible: visData._originalVisible } : {})
        };
        if (visData._originalVisible === undefined && updatedNodes[id]._originalVisible !== undefined) {
            delete updatedNodes[id]._originalVisible;
        }
    });
    Object.entries(assetOverrides).forEach(([id, assetData]) => {
        updatedNodes[id] = {
            ...updatedNodes[id],
            assetId: assetData.assetId,
            ...(assetData._originalAssetId ? { _originalAssetId: assetData._originalAssetId } : {})
        };
        if (assetData._originalAssetId === undefined && updatedNodes[id]._originalAssetId) {
            delete updatedNodes[id]._originalAssetId;
        }
    });
    Object.entries(appearanceOverrides).forEach(([id, appData]) => {
        updatedNodes[id] = {
            ...updatedNodes[id],
            ...(appData.style ? { style: appData.style } : {}),
            ...(appData.background ? { background: appData.background } : {}),
            ...(appData._originalStyleAppearances ? { _originalStyleAppearances: appData._originalStyleAppearances } : {}),
            ...(appData._originalBgAppearances ? { _originalBgAppearances: appData._originalBgAppearances } : {})
        };
        if (appData._originalStyleAppearances === undefined && updatedNodes[id]._originalStyleAppearances) {
            delete updatedNodes[id]._originalStyleAppearances;
        }
        if (appData._originalBgAppearances === undefined && updatedNodes[id]._originalBgAppearances) {
            delete updatedNodes[id]._originalBgAppearances;
        }
    });
    const result = {
        ...doc,
        nodesById: updatedNodes
    };
    if (!externalKeyValues) {
        _rdv_lastInputDoc = doc;
        _rdv_lastOutputDoc = result;
        _rdv_lastKeyexpSummary = currentKeyexpSummary;
    }
    return result;
}

/**
 * Repeat expansion for AutoLayout groups.
 *
 * A group with `autoLayout.enabled && repeat.enabled` holds exactly one child (the template).
 * At render / export time the template subtree is deep-copied `repeat.count` times:
 * - node ids become `{originalId}~{i}` (1-based, deterministic)
 * - every string value containing `{i}` gets the row number, except `id` / `parentId` / `children` / `assetId`
 *
 * The saved doc always keeps the template form; only the rendered doc is expanded.
 * This file is dependency-free (type imports only) because scripts/sync-logic.cjs embeds it into the player.
 */
const REPEAT_ID_SEPARATOR = "~";
const REPEAT_INDEX_TOKEN = "{i}";
const NON_SUBSTITUTED_KEYS = new Set(["id", "parentId", "children", "assetId"]);
const REPEAT_ID_SUFFIX = /~\d+$/;
function isRepeatGroup(node) {
    return !!node && node.type === "group" && !!node.autoLayout?.enabled && !!node.repeat?.enabled;
}
/** `n1_card~12` -> `n1_card`. Ids without a repeat suffix are returned unchanged. */
function toTemplateNodeId(nodeId) {
    return nodeId.replace(REPEAT_ID_SUFFIX, "");
}
/** Row number encoded in an expanded id, or null for template / ordinary ids. */
function getRepeatRowIndex(nodeId) {
    const m = REPEAT_ID_SUFFIX.exec(nodeId);
    return m ? Number(m[0].slice(REPEAT_ID_SEPARATOR.length)) : null;
}
/** Nearest repeat group above the node (the node is then part of a repeat template), or null. */
function findRepeatAncestor(doc, nodeId) {
    let parentId = doc.nodesById[nodeId]?.parentId;
    while (parentId) {
        const parent = doc.nodesById[parentId];
        if (!parent)
            return null;
        if (isRepeatGroup(parent))
            return parent;
        parentId = parent.parentId;
    }
    return null;
}
function collectSubtree(doc, rootId, out) {
    const node = doc.nodesById[rootId];
    if (!node)
        return;
    out.push(rootId);
    if (Array.isArray(node.children)) {
        node.children.forEach((childId) => collectSubtree(doc, childId, out));
    }
}
function analyzeRepeatGroup(doc, group) {
    const warnings = [];
    const rawCount = Math.floor(Number(group.repeat?.count));
    const count = isFinite(rawCount) && rawCount > 0 ? rawCount : 0;
    const children = Array.isArray(group.children) ? group.children : [];
    if (children.length === 0) {
        return { templateId: null, count, expandable: false, warnings: ["Repeat group has no child (template)"] };
    }
    if (children.length > 1) {
        warnings.push(`Repeat group has ${children.length} children. Only the first one is used as the template`);
    }
    const templateId = children[0];
    if (findRepeatAncestor(doc, group.id)) {
        warnings.push("Nested repeat is not supported (not expanded)");
        return { templateId, count, expandable: false, warnings };
    }
    const subtree = [];
    collectSubtree(doc, templateId, subtree);
    if (subtree.some(id => isRepeatGroup(doc.nodesById[id]))) {
        warnings.push("The template contains a repeat group. Nested repeat is not supported (not expanded)");
        return { templateId, count, expandable: false, warnings };
    }
    return { templateId, count, expandable: true, warnings };
}
function substituteRowIndex(value, rowText) {
    if (typeof value === "string") {
        return value.includes(REPEAT_INDEX_TOKEN) ? value.split(REPEAT_INDEX_TOKEN).join(rowText) : value;
    }
    if (Array.isArray(value)) {
        return value.map(v => substituteRowIndex(v, rowText));
    }
    if (value && typeof value === "object") {
        const out = {};
        for (const key of Object.keys(value)) {
            out[key] = NON_SUBSTITUTED_KEYS.has(key) ? value[key] : substituteRowIndex(value[key], rowText);
        }
        return out;
    }
    return value;
}
/**
 * Returns a new doc with every repeat group expanded. The input doc is never mutated,
 * and it is returned as-is when it contains no repeat group.
 */
function expandRepeats(doc, options = {}) {
    if (!doc || !doc.nodesById)
        return doc;
    const groups = Object.values(doc.nodesById).filter(isRepeatGroup);
    if (groups.length === 0)
        return doc;
    const warn = options.onWarning || ((groupId, message) => {
        console.warn(`[repeat] ${groupId}: ${message}`);
    });
    const nodesById = { ...doc.nodesById };
    for (const group of groups) {
        const info = analyzeRepeatGroup(doc, group);
        info.warnings.forEach(message => warn(group.id, message));
        if (!info.expandable || !info.templateId)
            continue;
        const rows = options.maxCount !== undefined ? Math.min(info.count, Math.max(0, options.maxCount)) : info.count;
        const subtree = [];
        collectSubtree(doc, info.templateId, subtree);
        // The template itself is replaced by its copies (unless row 1 keeps its ids, which overwrites it below)
        subtree.forEach(id => { delete nodesById[id]; });
        const expandedChildren = [];
        for (let i = 1; i <= rows; i++) {
            const keepIds = options.keepFirstRowIds === true && i === 1;
            const idFor = (id) => keepIds ? id : `${id}${REPEAT_ID_SEPARATOR}${i}`;
            const rowText = String(i);
            for (const id of subtree) {
                const source = doc.nodesById[id];
                const copy = substituteRowIndex(source, rowText);
                copy.id = idFor(id);
                copy.parentId = id === info.templateId ? group.id : idFor(source.parentId);
                if (Array.isArray(source.children)) {
                    copy.children = source.children.map(idFor);
                }
                nodesById[copy.id] = copy;
            }
            expandedChildren.push(idFor(info.templateId));
        }
        nodesById[group.id] = { ...group, children: expandedChildren };
    }
    return { ...doc, nodesById };
}


    // Text Measurement Utility (Standalone Canvas-based)
    const TextMeasurer = {
        canvas: document.createElement('canvas'),
        measure(text, style) {
            const ctx = this.canvas.getContext('2d');
            const fontSize = style.fontSize || 24;
            ctx.font = `${style.fontStyle || 'normal'} ${style.fontWeight || 'normal'} ${fontSize}px "${style.fontFamily || 'Arial'}"`;
            const metrics = ctx.measureText(text);
            let width = metrics.width;
            if (style.letterSpacing && text.length > 0) {
                width += style.letterSpacing * (text.length - 1);
            }
            return { width, height: fontSize * 1.25 };
        }
    };

    // 9-slice SVG Image Generator for background
    function createNineSliceImage(src, width, height, ns, assetWidth, assetHeight) {
        const group = createSVGElement("g");
        
        const t = ns.top || 0;
        const b = ns.bottom || 0;
        const l = ns.left || 0;
        const r = ns.right || 0;
        
        const iw = assetWidth || 100;
        const ih = assetHeight || 100;
        
        const mw = Math.max(0, width - l - r);
        const mh = Math.max(0, height - t - b);
        
        const imw = Math.max(0, iw - l - r);
        const imh = Math.max(0, ih - t - b);

        const drawSlice = (sx, sy, sw, sh, dx, dy, dw, dh) => {
            if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0) return;
            const svg = createSVGElement("svg");
            setAttributes(svg, { x: dx, y: dy, width: dw, height: dh, viewBox: `${sx} ${sy} ${sw} ${sh}`, preserveAspectRatio: "none" });
            const image = createSVGElement("image");
            setAttributes(image, { x: 0, y: 0, width: iw, height: ih, href: src, preserveAspectRatio: "none" });
            svg.appendChild(image);
            group.appendChild(svg);
        };

        // Top Row
        drawSlice(0, 0, l, t, 0, 0, l, t);
        drawSlice(l, 0, imw, t, l, 0, mw, t);
        drawSlice(iw - r, 0, r, t, width - r, 0, r, t);
        
        // Middle Row
        drawSlice(0, t, l, imh, 0, t, l, mh);
        drawSlice(l, t, imw, imh, l, t, mw, mh);
        drawSlice(iw - r, t, r, imh, width - r, t, r, mh);
        
        // Bottom Row
        drawSlice(0, ih - b, l, b, 0, height - b, l, b);
        drawSlice(l, ih - b, imw, b, l, height - b, mw, b);
        drawSlice(iw - r, ih - b, r, b, width - r, height - b, r, b);

        return group;
    }

    // Initialization Logic
    window.resolveDynamicVisibility = resolveDynamicVisibility;
    window.initPlayer = async function (containerId, projectData, assetCache) {
        window.containerId = containerId;
        
        // Fallback for asset mapping (backwards compatibility for custom JS)
        if (!projectData.assets && window.assetMapping) {
            projectData.assets = window.assetMapping;
        }

        // Repeat groups are expanded into ordinary nodes here; everything after works on the expanded doc
        projectData = expandRepeats(projectData);

        window.telopDoc = projectData;
        window.assetCache = assetCache;
        window.keyExpMap = new Map();

        const container = document.getElementById(containerId);
        const svg = createSVGElement("svg");
        const defs = createSVGElement("defs");
        svg.appendChild(defs);
        window.telopApp = svg; // SVG root

        const width = projectData.meta.width || 1920;
        const height = projectData.meta.height || 1080;
        setAttributes(svg, { width, height, viewBox: `0 0 ${width} ${height}`, visibility: "visible" });
        svg.style.display = "block";
        if (container) {
            container.innerHTML = '';
            container.appendChild(svg);
        }

        const registerDef = (def) => defs.appendChild(def);

        window.createNode = function (nodeId, autoLayoutOverride, isTelopChild) {
            // resolveDynamicVisibility の結果が反映された doc を使う
            // initPlayer/updateTelop は createNode 呼び出し前に window.telopDoc = evaluatedDoc にセットする
            const activeDoc = window.telopDoc || projectData;
            const node = activeDoc.nodesById[nodeId];
            if (!node) return null;

            const root = createSVGElement("g");
            const content = createSVGElement("g");
            content.classList.add("content-wrapper");

            root.setAttribute("data-node-id", node.id);

            // Check recursive visibility to prevent invisible nodes or descendants from animating/showing
            let isEffectivelyVisible = true;
            let checkNode = node;
            while (checkNode) {
                if (checkNode.visible === false) {
                    isEffectivelyVisible = false;
                    break;
                }
                checkNode = checkNode.parentId ? activeDoc.nodesById[checkNode.parentId] : null;
            }

            // Animation targeting:
            // When an element is a direct child of a telop:
            // If it has clipRect, the frame (root) stays static at fixed position, and its content (.content-wrapper) animates.
            // If it does not have clipRect, the element (root) animates.
            // IMPORTANT: Invisible nodes MUST NOT receive anim-target to prevent animation from forcing them visible!
            const shouldBeAnimTarget = isTelopChild && isEffectivelyVisible;

            if (node.clipRect) {
                root.classList.add("has-clip-rect");
                if (shouldBeAnimTarget) {
                    content.classList.add("anim-target");
                }
                if (node.domId) content.setAttribute("id", node.domId);
                if (node.domClass) {
                    const classes = node.domClass.trim().split(/s+/).filter(Boolean);
                    if (classes.length) content.classList.add(...classes);
                }
            } else {
                if (shouldBeAnimTarget) {
                    root.classList.add("anim-target");
                }
                if (node.domId) root.setAttribute("id", node.domId);
                if (node.domClass) {
                    const classes = node.domClass.trim().split(/s+/).filter(Boolean);
                    if (classes.length) root.classList.add(...classes);
                }
            }

            if (!isEffectivelyVisible) {
                root.classList.add("is-invisible");
                content.classList.add("is-invisible");
                root.setAttribute("display", "none");
                root.setAttribute("visibility", "hidden");
                root.style.setProperty("display", "none", "important");
                root.style.setProperty("visibility", "hidden", "important");
                root.style.setProperty("opacity", "0", "important");
                root.style.setProperty("animation", "none", "important");
                root.style.setProperty("pointer-events", "none", "important");
            }
            
            // If parent group applied an AutoLayout override, clone node and override positions
            let nodeToRender = node;
            if (autoLayoutOverride) {
                nodeToRender = { 
                    ...node, 
                    x: autoLayoutOverride.x, 
                    y: autoLayoutOverride.y 
                };
            }

            root.appendChild(content);

            if (node.clipRect) {
                const clip = node.clipRect;
                const cpId = `clip-${node.id}`;
                const cp = createSVGElement("clipPath");
                setAttributes(cp, { id: cpId, clipPathUnits: "userSpaceOnUse" });
                const cr = createSVGElement("rect"); setAttributes(cr, { 
                    x: clip.x || 0, 
                    y: clip.y || 0, 
                    width: clip.width || 0, 
                    height: clip.height || 0, 
                    rx: clip.cornerRadius || 0, 
                    ry: clip.cornerRadius || 0 
                });
                cp.appendChild(cr); registerDef(cp);
                root.setAttribute("clip-path", `url(#${cpId})`);
            }

            // Shared Logic: applyCommonProps handles pivot, transform, visibility, opacity
            applyCommonProps(root, nodeToRender);

            if (node.type === 'text') {
                const wrapper = createSVGElement("g");
                content.appendChild(wrapper);

                const fitMode = node.fitMode || "none";
                const targetWidth = node.width || 0;
                const targetHeight = node.height || 0;
                const pad = node.padding || 0;
                const availW = Math.max(0, (targetWidth || 0) - pad * 2);
                const availH = Math.max(0, (targetHeight || 0) - pad * 2);

                const { width: contentW, height: contentH } = TextMeasurer.measure(node.text || "", node.style || {});

                let sx = 1, sy = 1;
                if (fitMode === 'shrink_x' && contentW > availW && availW > 0) sx = availW / contentW;
                else if (fitMode === 'shrink_font' && contentW > availW && availW > 0) { sx = sy = availW / contentW; }
                else if (fitMode === 'expand_xy' && availW > 0 && availH > 0) { sx = availW / (contentW || 1); sy = availH / (contentH || 1); }
                else if (fitMode === 'scale_to_fit' && availW > 0 && availH > 0) { const s = Math.min(availW / (contentW || 1), availH / (contentH || 1)); sx = sy = s; }

                const effW = contentW * sx;
                const effH = contentH * sy;
                const align = node.align || 'left';
                const vAlign = node.verticalAlign || 'top';
                const effectivePadX = (targetWidth > 0) ? Math.min(pad, targetWidth / 2) : pad;
                const effectivePadY = (targetHeight > 0) ? Math.min(pad, targetHeight / 2) : pad;

                let tx = effectivePadX, ty = effectivePadY;
                if (targetWidth > 0) {
                    if (align === 'center') tx = targetWidth / 2;
                    else if (align === 'right') tx = targetWidth - effectivePadX;
                }
                if (targetHeight > 0) {
                    if (vAlign === 'middle') ty = targetHeight / 2 - effH / 2;
                    else if (vAlign === 'bottom') ty = targetHeight - effectivePadY - effH;
                }

                wrapper.setAttribute("transform", `translate(${tx}, ${ty}) scale(${sx}, ${sy})`);

                const apps = (node.style?.appearances || []).filter(a => a.enabled);
                
                if (apps.length === 0) {
                    const text = createSVGElement("text");
                    setupTextBase(text, node, contentW, contentH);
                    setAttributes(text, { fill: parseHex8(node.style?.fill).color });
                    wrapper.appendChild(text);
                } else {
                    [...apps].reverse().forEach((a, k) => {
                        const appIdx = apps.length - 1 - k;
                        if (a.isMask) {
                            const maskId = `mask-app-text-${node.id}-${appIdx}`;
                            const maskEl = createAppearanceMask(maskId, a, node, appIdx, false, contentW, contentH, registerDef, createSVGElement);
                            registerDef(maskEl);
                            const subWrapper = createSVGElement("g");
                            subWrapper.setAttribute("mask", `url(#${maskId})`);
                            while (wrapper.firstChild) {
                                subWrapper.appendChild(wrapper.firstChild);
                            }
                            wrapper.appendChild(subWrapper);
                        } else {
                            let g = createSVGElement("g");
                            g.classList.add("appearance-layer");
                            g = applyEffects(g, a.effects, node.id, `app-${appIdx}`, registerDef, createSVGElement);
                            drawAppearanceContent(g, a, node, appIdx, false, contentW, contentH, registerDef, createSVGElement);
                            wrapper.appendChild(g);
                        }
                    });
                }

                if (fitMode === 'none' && (node.width || node.height)) {
                    const cpId = `clip-t-${node.id}`;
                    const cp = createSVGElement("clipPath"); cp.setAttribute("id", cpId);
                    const cr = createSVGElement("rect"); setAttributes(cr, { width: node.width || 5000, height: node.height || 5000 });
                    cp.appendChild(cr); registerDef(cp);
                    content.setAttribute("clip-path", `url(#${cpId})`);
                }
            } else if (node.type === 'rect') {
                const w = node.width || 100, h = node.height || 100;
                let apps = (node.style?.appearances || []).filter(a => a.enabled);
                if (apps.length === 0) {
                    const style = node.style || {};
                    apps = [{
                        enabled: true,
                        fillEnabled: true,
                        fill: style.fill || "#000000",
                        gradientConfig: style.gradientConfig,
                        strokeEnabled: !!(style.stroke && style.stroke !== "none"),
                        color: style.stroke || "#000000",
                        thickness: style.strokeThickness || 0,
                        lineJoin: "miter",
                        miterLimit: 10
                    }];
                }
                
                [...apps].reverse().forEach((a, i) => {
                    const appIdx = apps.length - 1 - i;
                    if (a.isMask) {
                        const maskId = `mask-app-rect-${node.id}-${appIdx}`;
                        const maskEl = createAppearanceMask(maskId, a, node, appIdx, true, undefined, undefined, registerDef, createSVGElement);
                        registerDef(maskEl);
                        const subWrapper = createSVGElement("g");
                        subWrapper.setAttribute("mask", `url(#${maskId})`);
                        while (content.firstChild) {
                            subWrapper.appendChild(content.firstChild);
                        }
                        content.appendChild(subWrapper);
                    } else {
                        let g = createSVGElement("g");
                        g.classList.add("appearance-layer");
                        g = applyEffects(g, a.effects, node.id, `app-${appIdx}`, registerDef, createSVGElement);
                        drawAppearanceContent(g, a, node, appIdx, true, undefined, undefined, registerDef, createSVGElement);
                        content.appendChild(g);
                    }
                });
            } else if (node.type === 'image') {
                const img = createSVGElement("image");
                const asset = (activeDoc.assets && activeDoc.assets[node.assetId]) || (projectData.assets ? projectData.assets[node.assetId] : null);
                const src = asset ? asset.src : null;
                setAttributes(img, { 
                    width: node.width || 100, 
                    height: node.height || 100, 
                    href: (src && assetCache[src]) ? assetCache[src] : (src || ""), 
                    preserveAspectRatio: "none" 
                });
                content.appendChild(img);
            } else if (node.type === 'group' || node.type === 'telop' || node.type === 'plane') {
                if (node.type === 'group' && node.background && node.background.enabled) {
                    const children = node.children || [];
                    const visibleChildren = children.filter(cid => {
                        const child = activeDoc.nodesById[cid];
                        return child && child.visible !== false;
                    });
                    if (children.length === 0 || visibleChildren.length > 0) {
                        const bounds = calculateNodeBounds(node.id, activeDoc, TextMeasurer);
                        const bgContainer = createSVGElement("g");
                        bgContainer.setAttribute("class", "group-background");

                        const bgW = bounds.width;
                        const bgH = bounds.height;
                        bgContainer.setAttribute("transform", `translate(${bounds.x}, ${bounds.y})`);

                        const activeAppearances = (node.background.appearances || []).filter(a => a.enabled);
                        if (activeAppearances.length > 0) {
                            [...activeAppearances].reverse().forEach((app, idx) => {
                                const appIdx = activeAppearances.length - 1 - idx;
                                if (app.isMask) {
                                    const maskId = `mask-app-bg-${node.id}-${appIdx}`;
                                    const maskEl = createAppearanceMask(maskId, app, node, appIdx, true, bgW, bgH, registerDef, createSVGElement);
                                    registerDef(maskEl);
                                    const subWrapper = createSVGElement("g");
                                    subWrapper.setAttribute("mask", `url(#${maskId})`);
                                    while (bgContainer.firstChild) {
                                        subWrapper.appendChild(bgContainer.firstChild);
                                    }
                                    bgContainer.appendChild(subWrapper);
                                } else {
                                    let layer = createSVGElement("g");
                                    layer.setAttribute("class", "appearance-layer");
                                    layer = applyEffects(layer, app.effects, node.id, `bg-${appIdx}`, registerDef, createSVGElement);
                                    drawAppearanceContent(layer, app, node, appIdx, true, bgW, bgH, registerDef, createSVGElement);
                                    bgContainer.appendChild(layer);
                                }
                            });
                        }

                        if (node.background.assetId) {
                            const asset = projectData.assets ? projectData.assets[node.background.assetId] : null;
                            const src = asset ? asset.src : null;
                            const resolvedHref = (src && assetCache[src]) ? assetCache[src] : (src || "");
                            if (resolvedHref) {
                                if (node.background.nineSlice) {
                                    const ns = node.background.nineSlice;
                                    const iw = asset ? asset.width : 100;
                                    const ih = asset ? asset.height : 100;
                                    const nsGroup = createNineSliceImage(resolvedHref, bgW, bgH, ns, iw, ih);
                                    bgContainer.appendChild(nsGroup);
                                } else {
                                    const image = createSVGElement("image");
                                    setAttributes(image, {
                                        x: 0, y: 0, width: bgW, height: bgH,
                                        href: resolvedHref,
                                        preserveAspectRatio: "none"
                                    });
                                    bgContainer.appendChild(image);
                                }
                            }
                        }
                        const insertTarget = content;
                        if (insertTarget && insertTarget.parentNode === root) {
                            root.insertBefore(bgContainer, insertTarget);
                        } else {
                            root.appendChild(bgContainer);
                        }
                    }
                }
            }

            const finalRoot = applyEffects(root, node.effects, node.id, "node", registerDef, createSVGElement);

            let autoLayoutPositions = null;
            // AutoLayoutグループは transform 専用のラッパー <g> で包み、外部JS（スクロール等）の transform はラッパーにかける。
            // グループ自身の配置（x/y・AutoLayout の位置）は中の要素に残るので、JS の transform と取り合わない。
            // data-node-id と domId はラッパーに付けるため、Hub の差し替えや JS の querySelector はラッパーを対象にする。
            let outerEl = finalRoot;
            if (node.type === 'group' && node.autoLayout && node.autoLayout.enabled) {
                const layout = calculateAutoLayout(node, activeDoc, TextMeasurer);
                autoLayoutPositions = layout.childrenPositions;

                const transformHost = createSVGElement("g");
                transformHost.classList.add("autolayout-transform-host");
                transformHost.setAttribute("data-node-id", node.id);
                root.removeAttribute("data-node-id");
                if (!node.clipRect && node.domId) {
                    root.removeAttribute("id");
                    transformHost.setAttribute("id", node.domId);
                }

                // 再生成時は、古いラッパーに外部JSが付けた transform を引き継ぐ（ラッパーの transform はレンダラーが書かないので、丸ごとコピーしてよい）
                if (typeof document !== 'undefined') {
                    const existingEl = document.querySelector(`[data-node-id="${node.id}"]`);
                    if (existingEl && existingEl.classList.contains("autolayout-transform-host")) {
                        const existingTransformStyle = existingEl.style.transform;
                        if (existingTransformStyle) {
                            transformHost.style.transform = existingTransformStyle;
                            transformHost.style.transformBox = existingEl.style.transformBox || 'fill-box';
                            transformHost.style.transformOrigin = existingEl.style.transformOrigin || '0 0';
                        }
                        const existingTransformAttr = existingEl.getAttribute('transform');
                        if (existingTransformAttr) {
                            transformHost.setAttribute('transform', existingTransformAttr);
                        }
                    }
                }

                transformHost.appendChild(finalRoot);
                outerEl = transformHost;
            }

            if (node.children) {
                const targetWrapper = (node.type === 'group')
                    ? (root.querySelector(".content-wrapper") || root)
                    : finalRoot;
                const childrenAreTelopChildren = (node.type === 'telop');
                node.children.forEach(cid => {
                    const override = autoLayoutPositions ? autoLayoutPositions[cid] : null;
                    const c = window.createNode(cid, override, childrenAreTelopChildren);
                    if (c) targetWrapper.appendChild(c);
                });
            }

            const registerKeyExp = (key, targetObj) => {
                if (!window.keyExpMap.has(key)) {
                    window.keyExpMap.set(key, []);
                }
                window.keyExpMap.get(key).push(targetObj);
            };

            if (!window.nodeElementMap) window.nodeElementMap = new Map();
            window.nodeElementMap.set(node.id, outerEl);

            if (node.keyexp) registerKeyExp(node.keyexp, { type: node.type, nodeData: node, element: outerEl });
            if (node.visibilityCondition && node.visibilityCondition.targetKeyexp) {
                registerKeyExp(node.visibilityCondition.targetKeyexp, { type: 'visibility_condition', nodeData: node, element: outerEl });
            }
            if (node.imageReferenceCondition && node.imageReferenceCondition.targetKeyexp) {
                registerKeyExp(node.imageReferenceCondition.targetKeyexp, { type: 'image_reference_condition', nodeData: node, element: outerEl });
            }
            
            const registerAppKeyExps = (apps, isBg) => {
                (apps || []).forEach((app, idx) => {
                    if (app.fillKeyexp) {
                        registerKeyExp(app.fillKeyexp, { type: isBg ? 'bg_appearance_fill' : 'appearance_fill', nodeData: node, appearanceIndex: idx, element: outerEl });
                    }
                    if (app.strokeKeyexp) {
                        registerKeyExp(app.strokeKeyexp, { type: isBg ? 'bg_appearance_stroke' : 'appearance_stroke', nodeData: node, appearanceIndex: idx, element: outerEl });
                    }
                    const registerRuleList = (ruleList) => {
                        if (!Array.isArray(ruleList)) return;
                        ruleList.forEach((rule) => {
                            if (rule && rule.targetKeyexp) {
                                registerKeyExp(rule.targetKeyexp, { type: isBg ? 'bg_appearance_color_rule' : 'appearance_color_rule', nodeData: node, appearanceIndex: idx, element: outerEl });
                            }
                        });
                    };
                    registerRuleList(app.fillColorRules);
                    registerRuleList(app.strokeColorRules);
                    registerRuleList(app.shadowColorRules);
                    registerRuleList(app.colorRules);
                    if (app.gradientConfig?.stops && Array.isArray(app.gradientConfig.stops)) {
                        app.gradientConfig.stops.forEach((s) => registerRuleList(s.colorRules));
                    }
                });
            };
            registerAppKeyExps(node.style?.appearances, false);
            registerAppKeyExps(node.background?.appearances, true);

            return outerEl;
        };

        const evaluatedDoc = resolveDynamicVisibility(projectData);
        window.telopDoc = evaluatedDoc;
        try {
            const rootNode = window.createNode(projectData.rootId);
            if (rootNode) svg.appendChild(rootNode);
        } catch (e) {
            console.error("Error creating initial root node in initPlayer", e);
        }
        
        window.dispatchEvent(new CustomEvent('telopRendered'));
    };
})();
