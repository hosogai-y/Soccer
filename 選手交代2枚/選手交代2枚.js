
// 1. Data Loading (Auto-generated)
let projectData = null;
let assetCache = {};

// 2. Controller Logic (Editable)
// @telop-editor-default-template: If you modify this file, remove this line to prevent TelopEditor from overwriting your changes.

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

        window.dispatchEvent(new CustomEvent('telopRendered'));
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
        const dataUrl = './選手交代2枚.telop';
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
