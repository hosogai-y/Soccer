
// 1. Data Loading (Auto-generated)
let projectData = null;
let assetCache = {};

// 2. Controller Logic (Editable)
// Customized: スタッフ（監督・コーチ）表示のレイアウト切替

/**
 * スタッフ表示（役職表示 = 1）: 役職（ポジション）を背番号の位置へ移し、チームカラーザブトンを文字数に応じて伸ばす。
 * ザブトンは右端（氏名側）を固定して左へ伸ばし、蹴り上げマークの手前までに収める（長い役職は shrink_x で縮む）。
 * 選手表示（役職表示 = 0）では projectData の元の配置・色に戻す。
 */
const STAFF_LAYOUT = {
    flagKey: '役職表示',
    zabutonGroup: 'チームカラーザブトン',
    zabutonRects: ['ベースカラー', 'グラデーションマット'],
    roleText: 'ポジション',
    numberText: '背番号',
    leftLimitNode: '蹴り上げマーク', // ザブトンはこのノードの右端より左へは伸ばさない
    padding: 8 // 文字とザブトン端の余白 (px)
};
let staffLayoutOn = false;
// 元の配置・色。telopDoc のノードは projectData と同じオブジェクトなので、書き換える前に複製しておく
let staffLayoutOrig = null;

const findByName = (d, name) => Object.values(d.nodesById).find(n => n && n.name === name);
const cloneJson = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

/** 全角 1em・半角 0.6em で役職の表示幅を見積もる */
function estimateTextWidth(text, fontSize) {
    let em = 0;
    for (const ch of String(text || '')) em += ch.charCodeAt(0) > 0xff ? 1 : 0.6;
    return em * fontSize;
}

/** 役職・ザブトンの配置を doc に書き込み、変わったノード ID を返す */
function applyStaffLayout(d, values) {
    if (!d || !d.nodesById) return [];
    if (!staffLayoutOrig) {
        staffLayoutOrig = {};
        Object.values(d.nodesById).forEach(n => {
            if (n && [STAFF_LAYOUT.roleText, ...STAFF_LAYOUT.zabutonRects].includes(n.name)) {
                staffLayoutOrig[n.id] = cloneJson({ x: n.x, y: n.y, width: n.width, height: n.height, style: n.style });
            }
        });
    }
    const group = findByName(d, STAFF_LAYOUT.zabutonGroup);
    const role = findByName(d, STAFF_LAYOUT.roleText);
    const number = findByName(d, STAFF_LAYOUT.numberText);
    if (!group || !role || !number) return [];
    const rects = (group.children || []).map(id => d.nodesById[id]).filter(n => n && STAFF_LAYOUT.zabutonRects.includes(n.name));
    const o = id => staffLayoutOrig[id];
    const before = JSON.stringify([role.x, role.y, role.width, role.height, role.style, rects.map(r => [r.x, r.width])]);

    // まず元の配置・色に戻す
    ['x', 'y', 'width', 'height'].forEach(k => { if (o(role.id)) role[k] = o(role.id)[k]; });
    if (o(role.id)) role.style = cloneJson(o(role.id).style);
    rects.forEach(r => { if (o(r.id)) { r.x = o(r.id).x; r.width = o(r.id).width; } });

    if (staffLayoutOn) {
        const parent = group.parentId ? d.nodesById[group.parentId] : null;
        const scaleX = group.scaleX || 1;
        const baseRect = rects[0];
        const origRect = o(baseRect.id);
        // ザブトンの右端（絶対座標）を固定
        const groupAbsX = (parent ? parent.x : 0) + group.x;
        const rightAbs = groupAbsX + (origRect.x + origRect.width) * scaleX;
        const limit = findByName(d, STAFF_LAYOUT.leftLimitNode);
        const leftLimitAbs = limit ? limit.x + (limit.width || 0) + 4 : rightAbs - 160;
        const fontSize = (role.style && role.style.fontSize) || 36;
        const roleText = values && values[STAFF_LAYOUT.roleText] !== undefined ? values[STAFF_LAYOUT.roleText] : role.text;
        const wanted = estimateTextWidth(roleText, fontSize) + STAFF_LAYOUT.padding * 2;
        const width = Math.max(origRect.width * scaleX, Math.min(wanted, rightAbs - leftLimitAbs));
        const localWidth = width / scaleX;
        rects.forEach(r => {
            const or = o(r.id);
            r.width = localWidth;
            r.x = or.x + or.width - localWidth;
        });
        // 役職をザブトンの上（背番号と同じ高さ・色）へ
        const leftAbs = rightAbs - width;
        role.x = leftAbs + STAFF_LAYOUT.padding;
        role.width = width - STAFF_LAYOUT.padding * 2;
        role.y = number.y + ((number.height || 0) - (role.height || 0)) / 2;
        if (number.style && number.style.appearances) {
            role.style = Object.assign({}, role.style, { appearances: cloneJson(number.style.appearances) });
        }
    }
    const after = JSON.stringify([role.x, role.y, role.width, role.height, role.style, rects.map(r => [r.x, r.width])]);
    return before === after ? [] : [role.id, group.id];
}

/**
 * TelopHub の OnAir / Preview は updateTelop を差し替えるが、更新のたびに 'telopRendered'（detail = 受け取ったデータ）が届く。
 * ここで配置を反映し、変わったノードだけ DOM を作り直す（フォーメーション左／右と同じ方式）。
 */
window.addEventListener('telopRendered', (e) => {
    const values = (e && e.detail) || {};
    if (values[STAFF_LAYOUT.flagKey] !== undefined) staffLayoutOn = String(values[STAFF_LAYOUT.flagKey]) === '1';
    const doc = window.telopDoc;
    const app = window.telopApp;
    if (!doc || !doc.nodesById || !app || !window.createNode) return;
    const changed = applyStaffLayout(doc, values);
    changed.forEach(id => {
        const node = doc.nodesById[id];
        const map = window.nodeElementMap;
        const oldEl = (map && map.get(id) && map.get(id).isConnected) ? map.get(id) : app.querySelector('[data-node-id="' + id + '"]');
        if (!node || !oldEl || !oldEl.parentNode) return;
        try {
            const parent = node.parentId ? doc.nodesById[node.parentId] : null;
            const newEl = window.createNode(id, undefined, !!parent && parent.type === 'telop');
            if (!newEl) return;
            oldEl.parentNode.replaceChild(newEl, oldEl);
            if (map) map.set(id, newEl);
        } catch (err) {
            console.warn('[StaffLayout] re-create failed for ' + node.name, err);
        }
    });
    // 作り直した要素の古い keyExp 登録を外す（次の UPDATE で外れた要素を書き換えないように）
    if (changed.length && window.keyExpMap) {
        window.keyExpMap.forEach((targets, key) => {
            const live = targets.filter(t => !t.element || t.element.isConnected);
            if (live.length !== targets.length) window.keyExpMap.set(key, live);
        });
    }
});

// --- External Control API ---
window._pendingRenderableObject = null;
window._pendingShow = false;

/**
 * テロップを表示する関数
 * @param {Object} rendarableObject - レンダリング可能なオブジェクト。
 */
window.showTelop = function (rendarableObject) {
    if (rendarableObject !== undefined) {
        window.updateTelop(rendarableObject);
    }

    if (!window.initialized) {
        window._pendingShow = true;
        return;
    }

    // containerId is exposed by initPlayer
    const divElement = document.getElementById(window.containerId || 'player-container');
    if (divElement) {
        if (!divElement.classList.contains("in_animation")) {
            divElement.classList.remove(...divElement.classList);
            divElement.style.opacity = "0";
            
            const triggerShow = () => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        divElement.style.opacity = "";
                        divElement.classList.add("in_animation");
                        document.body.style.display = "block";
                    });
                });
            };

            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(triggerShow).catch(triggerShow);
            } else {
                triggerShow();
            }
        }
    }
};

/**
 * テロップの内容を更新する関数
 * @param {Object} rendarableObject - レンダリング可能なオブジェクト。
 */
window.updateTelop = function (rendarableObject) {
    console.log("updateTelop called", rendarableObject);
    if (!rendarableObject) return;

    // Globals exposed by renderer.js
    const app = window.telopApp;
    const doc = window.telopDoc;
    const keyExpMap = window.keyExpMap;
    const createNode = window.createNode;

    if (!app || !doc || !keyExpMap || !createNode) {
        console.error("updateTelop early return: Missing required globals:", { app: !!app, doc: !!doc, keyExpMap: !!keyExpMap, createNode: !!createNode });
        console.warn("Player not fully initialized yet. Caching update...");
        window._pendingRenderableObject = rendarableObject;
        return;
    }

    let hasUpdates = false;

    Object.keys(rendarableObject).forEach(key => {
        const val = rendarableObject[key];
        const targets = keyExpMap.get(key);
        console.log("Processing key: " + key + ", targets found: " + (targets ? targets.length : 0) + ", val: " + val);

        if (targets && Array.isArray(targets) && (val || val === "")) {
            targets.forEach((target) => {
                if (target.type === 'text') {
                    // Update Doc
                    const strVal = String(val);
                    if (target.nodeData.text !== strVal) {
                        target.nodeData.text = strVal;
                        const nodeInDoc = doc.nodesById[target.nodeData.id];
                        if (nodeInDoc) {
                            nodeInDoc.text = strVal;
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'image') {
                    // Update Doc (Asset)
                    const node = target.nodeData;
                    if (node.assetId && doc.assets[node.assetId]) {
                        if (doc.assets[node.assetId].src !== String(val)) {
                            // Clone asset to avoid clobbering shared assetId entries
                            var uniqueAssetId = node.assetId + '__keyexp_' + key;
                            doc.assets[uniqueAssetId] = Object.assign({}, doc.assets[node.assetId], { src: String(val) });
                            node.assetId = uniqueAssetId;
                            
                            // Also mutate the node inside the active document to persist the change
                            const nodeInDoc = doc.nodesById[node.id];
                            if (nodeInDoc) {
                                nodeInDoc.assetId = uniqueAssetId;
                            }
                            
                            hasUpdates = true;
                        }
                    }
                } else if (target.type === 'appearance_fill') {
                    const apps = target.nodeData.style?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];
                    if (app && (app.fill !== String(val) || app.gradientConfig)) {
                        console.log("Updating appearance_fill for " + target.nodeData.id + " to " + val);
                        app.fill = String(val);
                        if (app.gradientConfig) { delete app.gradientConfig; }
                        if (docApp) {
                            docApp.fill = String(val);
                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'appearance_stroke') {
                    const apps = target.nodeData.style?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];
                    if (app && app.color !== String(val)) {
                        console.log("Updating appearance_stroke for " + target.nodeData.id + " to " + val);
                        app.color = String(val);
                        if (docApp) {
                            docApp.color = String(val);
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'bg_appearance_fill') {
                    const apps = target.nodeData.background?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];
                    if (app && (app.fill !== String(val) || app.gradientConfig)) {
                        console.log("Updating bg_appearance_fill for " + target.nodeData.id + " to " + val);
                        app.fill = String(val);
                        if (app.gradientConfig) { delete app.gradientConfig; }
                        if (docApp) {
                            docApp.fill = String(val);
                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'bg_appearance_stroke') {
                    const apps = target.nodeData.background?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];
                    if (app && app.color !== String(val)) {
                        console.log("Updating bg_appearance_stroke for " + target.nodeData.id + " to " + val);
                        app.color = String(val);
                        if (docApp) {
                            docApp.color = String(val);
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'appearance_color_rule' || target.type === 'bg_appearance_color_rule' || target.type === 'visibility_condition' || target.type === 'image_reference_condition') {
                    hasUpdates = true;
                }
            });
        }
    });

    if (rendarableObject.highliteNum !== undefined || rendarableObject.barNum !== undefined) {
        hasUpdates = true;
    }

    if (hasUpdates) {
        const evaluatedDoc = resolveDynamicVisibility(doc, rendarableObject);

        // In-place image reference & visibility condition updates (zero-flicker)
        for (const nodeId in evaluatedDoc.nodesById) {
            const prevNode = doc.nodesById[nodeId];
            const nextNode = evaluatedDoc.nodesById[nodeId];
            if (prevNode && nextNode && nextNode.type === 'image') {
                if (prevNode.assetId !== nextNode.assetId) {
                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||
                                      (projectData.assets && projectData.assets[nextNode.assetId]);
                    if (nextAsset && nextAsset.src) {
                        const nodeEl = app.querySelector('[data-node-id="' + nodeId + '"]');
                        const imgEl = nodeEl ? nodeEl.querySelector("image") : null;
                        if (imgEl) {
                            const targetSrc = (assetCache && assetCache[nextAsset.src]) ? assetCache[nextAsset.src] : nextAsset.src;
                            imgEl.setAttribute("href", targetSrc);
                        }
                    }
                    prevNode.assetId = nextNode.assetId;
                }
            }
            if (prevNode && nextNode && prevNode.visible !== nextNode.visible) {
                const nodeEl = app.querySelector('[data-node-id="' + nodeId + '"]');
                if (nodeEl) {
                    nodeEl.style.display = nextNode.visible === false ? 'none' : '';
                }
                prevNode.visible = nextNode.visible;
            }
        }

        window.telopDoc = evaluatedDoc;

        keyExpMap.clear();

        try {
            const oldDefs = app.firstChild;
            if (oldDefs) oldDefs.innerHTML = '';

            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);
            if (newRootNode) {
                if (app.childNodes.length > 1) {
                    app.replaceChild(newRootNode, app.childNodes[1]);
                } else {
                    app.appendChild(newRootNode);
                }

                while (app.childNodes.length > 2) {
                    app.removeChild(app.lastChild);
                }
            }
        } catch (e) {
            console.error("Error creating new root node in updateTelop:", e);
        }

        window.dispatchEvent(new CustomEvent('telopRendered', { detail: rendarableObject }));
    }
};

/**
 * テロップを非表示にする関数
 */
window.hideTelop = function () {
    const divElement = document.getElementById(window.containerId || 'player-container');
    if (divElement) {
        divElement.classList.remove(...divElement.classList);

        let finished = false;
        const completeHide = () => {
            if (finished) return;
            finished = true;
            divElement.style.opacity = '0';
            divElement.classList.remove("out_animation");
            if (window.animationFinishedCallback) {
                window.animationFinishedCallback();
            }
            divElement.removeEventListener('animationend', onAnimationEnd);
        };

        const onAnimationEnd = (e) => {
            if (!divElement.classList.contains("out_animation")) return;
            completeHide();
        };

        divElement.addEventListener('animationend', onAnimationEnd);
        divElement.classList.add("out_animation");

        // Safety fallback: if no animation or animationend doesn't fire, complete after duration or max 1s
        const animTarget = divElement.querySelector('.anim-target') || divElement;
        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');
        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');
        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);
        setTimeout(() => {
            if (!finished && divElement.classList.contains("out_animation")) {
                completeHide();
            }
        }, timeoutMs);
    }
};


// 3. Initialization
window.addEventListener('load', async () => {
    try {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        const dataUrl = './1Shot.telop';
        const dataResp = await fetch(dataUrl);
        if (dataResp.ok) {
            projectData = await dataResp.json();
            console.log("[Player] Loaded project data from:", dataUrl);
        }
        assetCache = {};
        if (window.initPlayer) {
            window.initPlayer('player-container', projectData, assetCache).then(() => {
                window.initialized = true;
                if (window._pendingRenderableObject) {
                    window.updateTelop(window._pendingRenderableObject);
                    window._pendingRenderableObject = null;
                }
                if (window._pendingShow) {
                    window.showTelop();
                    window._pendingShow = false;
                }
            });
        }
    } catch (e) {
        console.error("[Player] Failed to initialize project data:", e);
    }
});
