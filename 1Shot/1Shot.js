// 1. Data Loading (Auto-generated)
let projectData = null;
let assetCache = {};

// 2. Controller Logic (Customized for 1Shot)
window._pendingRenderableObject = null;
window._pendingShow = false;
window._current1ShotData = null;

function showNode(node) {
    if (!node) return;
    node.removeAttribute("display");
    node.removeAttribute("visibility");
    node.style.removeProperty("display");
    node.style.removeProperty("visibility");
    node.style.removeProperty("opacity");
    node.classList.remove("is-invisible");

    if (node.querySelectorAll) {
        const hiddenChildren = node.querySelectorAll('[visibility="hidden"], [display="none"], .is-invisible, image');
        hiddenChildren.forEach(child => {
            child.removeAttribute("visibility");
            child.removeAttribute("display");
            child.style.removeProperty("visibility");
            child.style.removeProperty("display");
            child.style.removeProperty("opacity");
            child.classList.remove("is-invisible");
        });
    }
}

function hideNode(node) {
    if (!node) return;
    node.setAttribute("display", "none");
    node.style.setProperty("display", "none", "important");
}

function resolvePhotoUrl(rawSrc) {
    if (!rawSrc) return '';
    let src = String(rawSrc).trim();
    try {
        src = decodeURI(src);
    } catch (e) {}
    return encodeURI(src);
}

function setNodeImage(imgEl, rawSrc, payload) {
    if (!imgEl || !rawSrc) return;
    const clean = String(rawSrc).trim();
    if (!clean) return;

    const school = (payload && (payload['所属'] || payload.school)) ? String(payload['所属'] || payload.school).trim() : '';

    // パス候補のリストアップ
    const candidates = [];

    // 1. /Photo/ または Photo/ で始まる場合
    if (clean.startsWith('/Photo/') || clean.startsWith('Photo/')) {
        const norm = clean.startsWith('/') ? clean : '/' + clean;
        candidates.push('..' + norm); // ../Photo/... (1Shot.htmlから見た相対パス、最優先)
        candidates.push(norm);        // /Photo/... (Webルート)
    } else if (clean.includes('/')) {
        candidates.push(clean);
        if (!clean.startsWith('/')) candidates.push('../' + clean);
    } else {
        // ファイル名のみの場合 (例: "14 菅野桜抜き.png")
        if (school) {
            candidates.push(`../Photo/${school}/${clean}`);
            candidates.push(`/Photo/${school}/${clean}`);
        }
        candidates.push(`../Photo/${clean}`);
        candidates.push(`/Photo/${clean}`);
        candidates.push(`img/${clean}`);
        candidates.push(clean);
    }

    // URIエンコード済みの候補リスト (重複除外)
    const encodedCandidates = candidates.map(c => resolvePhotoUrl(c)).filter((v, i, a) => a.indexOf(v) === i);

    // キャッシュまたは最優先候補を即座にセット
    const cached = window.assetCache && encodedCandidates.find(c => window.assetCache[c]);
    const initialUrl = (cached && window.assetCache[cached]) || encodedCandidates[0] || resolvePhotoUrl(clean);

    imgEl.setAttribute('href', initialUrl);
    imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', initialUrl);
    if (!imgEl.getAttribute('width')) imgEl.setAttribute('width', '205');
    if (!imgEl.getAttribute('height')) imgEl.setAttribute('height', '240');
    imgEl.setAttribute('preserveAspectRatio', 'none');

    // 複数候補を並行プリロードして、最初にロード成功した有効URLを適用
    let resolved = false;
    encodedCandidates.forEach(url => {
        const tester = new Image();
        tester.onload = function () {
            if (!resolved) {
                resolved = true;
                imgEl.setAttribute('href', url);
                imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
            }
        };
        tester.src = url;
    });
}

function setTextToNode(nodeEl, textStr) {
    if (!nodeEl || textStr === undefined || textStr === null) return;
    const str = String(textStr);
    // SVG テキストノード内のすべての text 要素（shadow, stroke, fill）を一括更新
    const allTexts = nodeEl.querySelectorAll ? nodeEl.querySelectorAll('text') : [];
    if (allTexts.length > 0) {
        allTexts.forEach(tEl => {
            const tspans = tEl.querySelectorAll('tspan');
            if (tspans.length > 0) {
                tspans.forEach((ts, idx) => {
                    if (idx === 0) ts.textContent = str;
                    else ts.textContent = '';
                });
            } else {
                tEl.textContent = str;
            }
        });
    } else {
        const tspans = nodeEl.querySelectorAll ? nodeEl.querySelectorAll('tspan') : [];
        if (tspans.length > 0) {
            tspans.forEach((ts, idx) => {
                if (idx === 0) ts.textContent = str;
                else ts.textContent = '';
            });
        } else {
            nodeEl.textContent = str;
        }
    }
}

function resolveCommentTexts(data) {
    if (!data) return { isYellow: false, yellowText: '', whiteText: '', isPro2Mode: true };

    const mode = data.mode || (data.todayGoalSelected ? 'today' : (data.totalGoalSelected ? 'total' : 'pro2'));
    const isPro2Mode = mode === 'pro2' && !data.todayGoalSelected && !data.totalGoalSelected;

    // 全角・半角キーの取得
    const valYellow = data['プロ2コメント黄色'] !== undefined ? data['プロ2コメント黄色'] : data['プロ２コメント黄色'];
    const valWhite = data['プロ2コメント'] !== undefined ? data['プロ2コメント'] : data['プロ２コメント'];

    const strYellow = (valYellow !== undefined && valYellow !== null) ? String(valYellow).trim() : '';
    const strWhite = (valWhite !== undefined && valWhite !== null) ? String(valWhite).trim() : '';

    // 黄色フラグON判定:
    // 1. isYellow, useYellowText, pro2IsYellow, yellowFlag, 黄色フラグ のいずれかが明示的に true
    // 2. または「プロ２コメント黄色」「プロ2コメント黄色」に空でない文字列が入っている場合
    const explicitYellow = data.isYellow === true || data.isYellow === 'true' ||
                           data.useYellowText === true || data.useYellowText === 'true' ||
                           data.pro2IsYellow === true || data.pro2IsYellow === 'true' ||
                           data.yellowFlag === true || data.yellowFlag === 'true' ||
                           data['黄色フラグ'] === true || data['黄色フラグ'] === 'true' || data['黄色フラグ'] === 'ON';

    const hasYellowText = strYellow !== '';
    const isYellow = explicitYellow || hasYellowText;

    let yellowText = '';
    let whiteText = '';

    if (isPro2Mode) {
        if (isYellow) {
            // 黄色フラグON: 「プロ２コメント黄色」の値を使用（もし空なら白側から引き継ぐ）
            yellowText = (valYellow !== undefined && valYellow !== null && String(valYellow) !== '')
                ? String(valYellow)
                : ((valWhite !== undefined && valWhite !== null) ? String(valWhite) : '');
            whiteText = '';
        } else {
            // 黄色フラグOFF: 「プロ２コメント」の値を使用（もし空なら黄色側から引き継ぐ）
            whiteText = (valWhite !== undefined && valWhite !== null && String(valWhite) !== '')
                ? String(valWhite)
                : ((valYellow !== undefined && valYellow !== null) ? String(valYellow) : '');
            yellowText = '';
        }
    }

    return {
        isYellow,
        yellowText,
        whiteText,
        isPro2Mode
    };
}

function apply1ShotCustom(rendarableObject) {
    const app = window.telopApp;
    if (!app || !rendarableObject) return;

    // 1. 顔写真の制御 (keyExp: 顔写真 / ID: n1_gjjlfmor48gv)
    const keyExpTargets = window.keyExpMap ? window.keyExpMap.get('顔写真') : null;
    const targetEl = keyExpTargets && keyExpTargets[0] ? keyExpTargets[0].element : null;
    const faceEl = app.querySelector('[data-node-id="n1_gjjlfmor48gv"]') || targetEl;
    if (faceEl) {
        const photoSrc = rendarableObject['顔写真'] || rendarableObject.photo;
        const isPhotoVisible = rendarableObject['顔写真_visible'] !== false &&
                               rendarableObject.showPhoto !== false &&
                               photoSrc && String(photoSrc).trim() !== '';
        
        if (isPhotoVisible) {
            showNode(faceEl);
            const img = faceEl.querySelector('image');
            if (img) {
                showNode(img);
                setNodeImage(img, photoSrc, rendarableObject);
            }
        } else {
            hideNode(faceEl);
        }
    }

    // 2. モード制御: 'pro2' | 'today' | 'total' (デフォルト: 'pro2')
    const pro2Yellow = app.querySelector('[data-node-id="n1_6h3z6328z8je"]'); // プロ2コメント黄色
    const pro2White = app.querySelector('[data-node-id="n1_cwkjx9kkwdwl"]');  // プロ2コメント (白)
    const totalGoalEl = app.querySelector('[data-node-id="n1_0a2qvfdqvk2t"]'); // TOTALゴール
    const todayGoalEl = app.querySelector('[data-node-id="n1_4ptynqs7dzse"]'); // TODAYゴール

    const { isYellow, yellowText, whiteText, isPro2Mode } = resolveCommentTexts(rendarableObject);
    const mode = rendarableObject.mode || (rendarableObject.todayGoalSelected ? 'today' : (rendarableObject.totalGoalSelected ? 'total' : 'pro2'));

    if (mode === 'today') {
        hideNode(pro2Yellow);
        setTextToNode(pro2Yellow, '');
        hideNode(pro2White);
        setTextToNode(pro2White, '');
        hideNode(totalGoalEl);
        showNode(todayGoalEl);
    } else if (mode === 'total') {
        hideNode(pro2Yellow);
        setTextToNode(pro2Yellow, '');
        hideNode(pro2White);
        setTextToNode(pro2White, '');
        hideNode(todayGoalEl);
        showNode(totalGoalEl);
    } else {
        // pro2 モード
        hideNode(todayGoalEl);
        hideNode(totalGoalEl);

        if (isYellow) {
            // 黄色文字フラグON: プロ2コメント黄色を表示、プロ2コメント（白）を非表示＆テキストクリア
            showNode(pro2Yellow);
            setTextToNode(pro2Yellow, yellowText);
            hideNode(pro2White);
            setTextToNode(pro2White, '');
        } else {
            // 黄色文字フラグOFF: プロ2コメント（白）を表示、プロ2コメント黄色を非表示＆テキストクリア
            showNode(pro2White);
            setTextToNode(pro2White, whiteText);
            hideNode(pro2Yellow);
            setTextToNode(pro2Yellow, '');
        }
    }
}

/**
 * テロップを表示する関数
 */
window.showTelop = function (rendarableObject) {
    if (rendarableObject !== undefined) {
        window.updateTelop(rendarableObject);
    }

    if (!window.initialized) {
        window._pendingShow = true;
        return;
    }

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
                        if (window._current1ShotData) {
                            apply1ShotCustom(window._current1ShotData);
                        }
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
 */
window.updateTelop = function (rendarableObject) {
    if (!rendarableObject) return;

    // 全角・半角の相互同期補完
    const normalizedData = Object.assign({}, rendarableObject);
    if (normalizedData['プロ２コメント黄色'] !== undefined && normalizedData['プロ2コメント黄色'] === undefined) {
        normalizedData['プロ2コメント黄色'] = normalizedData['プロ２コメント黄色'];
    }
    if (normalizedData['プロ2コメント黄色'] !== undefined && normalizedData['プロ２コメント黄色'] === undefined) {
        normalizedData['プロ２コメント黄色'] = normalizedData['プロ2コメント黄色'];
    }
    if (normalizedData['プロ２コメント'] !== undefined && normalizedData['プロ2コメント'] === undefined) {
        normalizedData['プロ2コメント'] = normalizedData['プロ２コメント'];
    }
    if (normalizedData['プロ2コメント'] !== undefined && normalizedData['プロ２コメント'] === undefined) {
        normalizedData['プロ２コメント'] = normalizedData['プロ2コメント'];
    }

    const { isYellow, yellowText, whiteText, isPro2Mode } = resolveCommentTexts(normalizedData);
    normalizedData.isYellow = isYellow;
    if (isPro2Mode) {
        normalizedData['プロ2コメント黄色'] = yellowText;
        normalizedData['プロ２コメント黄色'] = yellowText;
        normalizedData['プロ2コメント'] = whiteText;
        normalizedData['プロ２コメント'] = whiteText;
    }

    window._current1ShotData = Object.assign({}, window._current1ShotData, normalizedData);

    const app = window.telopApp;
    const doc = window.telopDoc;
    const keyExpMap = window.keyExpMap;
    const createNode = window.createNode;

    if (!app || !doc || !keyExpMap || !createNode) {
        window._pendingRenderableObject = normalizedData;
        return;
    }

    let hasUpdates = false;

    Object.keys(normalizedData).forEach(key => {
        const val = normalizedData[key];
        // 全角・半角の両方で keyExpMap をチェック
        const altKey = key.replace(/２/g, '2').replace(/2/g, '２');
        const targets = keyExpMap.get(key) || keyExpMap.get(altKey);

        if (targets && Array.isArray(targets) && (val || val === "")) {
            targets.forEach((target) => {
                if (target.type === 'text') {
                    const strVal = String(val);
                    if (target.nodeData.text !== strVal) {
                        target.nodeData.text = strVal;
                        const nodeInDoc = doc.nodesById[target.nodeData.id];
                        if (nodeInDoc) nodeInDoc.text = strVal;
                        hasUpdates = true;
                    }
                } else if (target.type === 'image') {
                    const node = target.nodeData;
                    const baseAsset = (doc.assets && doc.assets[node.assetId]) ||
                                      (projectData && projectData.assets && projectData.assets[node.assetId]) ||
                                      { id: node.assetId, kind: 'image', src: '' };
                    if (!doc.assets) doc.assets = {};
                    const newSrc = String(val);
                    if (baseAsset.src !== newSrc) {
                        var uniqueAssetId = (node.assetId || 'asset_' + node.id).replace(/__keyexp_.*$/, '') + '__keyexp_' + key;
                        doc.assets[uniqueAssetId] = Object.assign({}, baseAsset, { src: newSrc });
                        node.assetId = uniqueAssetId;
                        const nodeInDoc = doc.nodesById[node.id];
                        if (nodeInDoc) {
                            nodeInDoc.assetId = uniqueAssetId;
                            if (key === '顔写真') {
                                const isPhotoVisible = normalizedData['顔写真_visible'] !== false &&
                                                       normalizedData.showPhoto !== false &&
                                                       newSrc && newSrc.trim() !== '';
                                nodeInDoc.visible = isPhotoVisible;
                            }
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'appearance_fill') {
                    const apps = target.nodeData.style?.appearances || [];
                    const appStyle = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];
                    if (appStyle && (appStyle.fill !== String(val) || appStyle.gradientConfig)) {
                        appStyle.fill = String(val);
                        if (appStyle.gradientConfig) { delete appStyle.gradientConfig; }
                        if (docApp) {
                            docApp.fill = String(val);
                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }
                        }
                        hasUpdates = true;
                    }
                }
            });
        }
    });

    if (doc.nodesById) {
        if (doc.nodesById['n1_6h3z6328z8je']) { // プロ2コメント黄色
            doc.nodesById['n1_6h3z6328z8je'].visible = true;
            if (doc.nodesById['n1_6h3z6328z8je'].text !== yellowText) {
                doc.nodesById['n1_6h3z6328z8je'].text = yellowText;
                hasUpdates = true;
            }
        }
        if (doc.nodesById['n1_cwkjx9kkwdwl']) { // プロ2コメント (白)
            doc.nodesById['n1_cwkjx9kkwdwl'].visible = true;
            if (doc.nodesById['n1_cwkjx9kkwdwl'].text !== whiteText) {
                doc.nodesById['n1_cwkjx9kkwdwl'].text = whiteText;
                hasUpdates = true;
            }
        }
    }

    if (hasUpdates) {
        const evaluatedDoc = resolveDynamicVisibility(doc, normalizedData);

        if (evaluatedDoc.nodesById) {
            if (evaluatedDoc.nodesById['n1_6h3z6328z8je']) {
                evaluatedDoc.nodesById['n1_6h3z6328z8je'].visible = true;
                evaluatedDoc.nodesById['n1_6h3z6328z8je'].text = yellowText;
            }
            if (evaluatedDoc.nodesById['n1_cwkjx9kkwdwl']) {
                evaluatedDoc.nodesById['n1_cwkjx9kkwdwl'].visible = true;
                evaluatedDoc.nodesById['n1_cwkjx9kkwdwl'].text = whiteText;
            }
        }

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
                            setNodeImage(imgEl, nextAsset.src, normalizedData);
                        }
                    }
                    prevNode.assetId = nextNode.assetId;
                }
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
            console.error("Error updating 1Shot node:", e);
        }

        window.dispatchEvent(new CustomEvent('telopRendered'));
    }

    apply1ShotCustom(window._current1ShotData);
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
        }
        assetCache = {};
        if (window.initPlayer) {
            window.initPlayer('player-container', projectData, assetCache).then(() => {
                window.initialized = true;
                if (window._pendingRenderableObject) {
                    window.updateTelop(window._pendingRenderableObject);
                    window._pendingRenderableObject = null;
                } else if (window._current1ShotData) {
                    apply1ShotCustom(window._current1ShotData);
                } else {
                    apply1ShotCustom({ mode: 'pro2' });
                }
                if (window._pendingShow) {
                    window.showTelop();
                    window._pendingShow = false;
                }
            });
        }
    } catch (e) {
        console.error("[Player] Failed to initialize 1Shot:", e);
    }
});
