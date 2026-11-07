// 1. Data Loading (Auto-generated)
let projectData = null;
let assetCache = {};

// 2. Controller Logic (Customized for 1Shotカード)
window._pendingRenderableObject = null;
window._pendingShow = false;
window._currentCardData = null;

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
        candidates.push('..' + norm); // ../Photo/... (1Shotカード.htmlから見た相対パス、最優先)
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

function applyCardCustom(rendarableObject, options = {}) {
    const app = window.telopApp;
    if (!app || !rendarableObject) return;

    // cardOnly: TelopHub の送出ページが中身を反映済みのとき。顔写真・コメントは触らずカードの演出だけ行う
    if (!options.cardOnly) {
    // 1. 顔写真の制御 (keyExp: 顔写真)
    const keyExpTargets = window.keyExpMap ? window.keyExpMap.get('顔写真') : null;
    const targetEl = keyExpTargets && keyExpTargets[0] ? keyExpTargets[0].element : null;
    const faceEl = targetEl;
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

    // 2. モード制御 (pro2 / today / total)
    const pro2Yellow = keyExpElement('プロ2コメント黄色');
    const pro2White = keyExpElement('プロ2コメント');
    const totalGoalEl = null; // TOTALゴール（1Shotカードでは常に非表示）
    const todayGoalEl = null; // TODAYゴール（1Shotカードでは常に非表示）

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
        // pro2
        hideNode(todayGoalEl);
        hideNode(totalGoalEl);

        if (isYellow) {
            // 黄色フラグON: プロ2コメント黄色を表示、プロ2コメント（白）を非表示＆テキストクリア
            showNode(pro2Yellow);
            setTextToNode(pro2Yellow, yellowText);
            hideNode(pro2White);
            setTextToNode(pro2White, '');
        } else {
            // 黄色フラグOFF: プロ2コメント（白）を表示、プロ2コメント黄色を非表示＆テキストクリア
            showNode(pro2White);
            setTextToNode(pro2White, whiteText);
            hideNode(pro2Yellow);
            setTextToNode(pro2Yellow, '');
        }
    }

    }

    // 3. カード制御 & アニメーション（keyExp「カード」のノード。ノード ID は push で振り直されるので使わない）
    const cardEl = keyExpElement('カード');
    if (!cardEl) return;
    const cardImg = cardEl.querySelector('image');
    // 動かすのは中身（content-wrapper）。ノード本体の transform 属性は位置なので、CSS transform で上書きしない
    const mover = cardEl.querySelector('.content-wrapper') || cardImg;
    if (!cardImg || !mover) return;
    ensureCardClip(cardEl);

    stopCardAnimations();

    const cardType = rendarableObject.cardType || (rendarableObject['カード']?.includes('Red') ? 'red' : (rendarableObject['カード']?.includes('Yellow2') ? 'yellow2' : 'yellow1'));
    const setCard = (src) => {
        cardImg.setAttribute('href', src);
        cardImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
    };
    // 止まっているときの位置（アニメーションが終わるとこの位置になる）
    const place = (x) => {
        mover.style.transition = 'none';
        mover.style.transform = `translateX(${x}px)`;
        mover.style.opacity = '1';
    };
    // スライドの演出は送出（TAKE）したときだけ。送出中の UPDATE では最後の状態で出す
    const animate = !!options.fromShow;

    if (cardType === 'yellow2') {
        // --- イエロー2枚 -> 1.2 秒後に座布団の背面へスライドアウト -> レッドが背面からスライドイン ---
        if (!animate) {
            setCard('img/Red_15.png');
            place(0);
            return;
        }
        setCard('img/Yellow2_15.png');
        place(0);
        const out = slideCard(mover, 0, CARD_HIDDEN_X, { delay: 1200, duration: 350, easing: 'ease-in', fill: 'forwards' });
        if (!out) {
            setCard('img/Red_15.png');
            return;
        }
        out.onfinish = () => {
            setCard('img/Red_15.png');
            slideCard(mover, CARD_HIDDEN_X, 0, { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
            out.cancel();
        };
    } else if (cardType === 'red') {
        setCard('img/Red_15.png');
        place(0);
    } else {
        // --- イエロー1枚: 1Shot が出てから 1 秒後、座布団の背面から左へ 1.5 秒でスライドイン ---
        setCard('img/Yellow1_15.png');
        place(0);
        if (animate) {
            slideCard(mover, CARD_HIDDEN_X, 0, { delay: 1000, duration: 1500, easing: 'ease-out', fill: 'backwards' });
        }
    }
}

// カードを座布団の背面に隠すときの右へのずらし量（カード画像の見えている部分が座布団の左端より右に入る量）
const CARD_HIDDEN_X = 110;
/*
 * カードの動きは Web Animations で付ける。TelopHub の送出ページはこのページを content-visibility: hidden の入れ物に入れて
 * 動かすので、requestAnimationFrame が来ないことがある。送出の瞬間に遅延込みでアニメーションを予約しておけば、
 * 描画が始まったところから正しい順番で動く（CSS transition のように途中の状態を見落として最後の位置に飛ばない）
 */
let cardAnimations = [];
function slideCard(el, fromX, toX, options) {
    if (!el.animate) return null;
    const anim = el.animate(
        [{ transform: `translateX(${fromX}px)` }, { transform: `translateX(${toX}px)` }],
        options
    );
    cardAnimations.push(anim);
    return anim;
}
function stopCardAnimations() {
    cardAnimations.forEach(a => { a.onfinish = null; a.cancel(); });
    cardAnimations = [];
}

function keyExpElement(key) {
    const targets = window.keyExpMap ? window.keyExpMap.get(key) : null;
    return targets && targets[0] ? targets[0].element : null;
}

/**
 * 座布団（1SHOT用ザブトン）の左端より右に入ったカードを見えなくするクリップ。
 * 座標はカードノード内（左上 = カードの位置）。座布団の左端は下に行くほど少し右へ傾いているので、それに合わせる。
 * 再描画で defs が作り直されるので、毎回なければ足す
 */
const CARD_CLIP_ID = 'oneshot-card-behind-plate';
function ensureCardClip(cardEl) {
    const svg = cardEl.ownerSVGElement;
    if (!svg) return;
    if (!svg.querySelector('#' + CARD_CLIP_ID)) {
        const ns = 'http://www.w3.org/2000/svg';
        const clip = document.createElementNS(ns, 'clipPath');
        clip.setAttribute('id', CARD_CLIP_ID);
        clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
        const poly = document.createElementNS(ns, 'polygon');
        poly.setAttribute('points', '-2000,-2000 219,-2000 219,66 232,141 232,2000 -2000,2000');
        clip.appendChild(poly);
        const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(ns, 'defs'), svg.firstChild);
        defs.appendChild(clip);
    }
    cardEl.setAttribute('clip-path', `url(#${CARD_CLIP_ID})`);
}

/**
 * テロップを表示する関数
 */
window.showTelop = function (rendarableObject) {
    if (rendarableObject !== undefined) {
        // TelopHub の送出ページは updateTelop を自前の処理に差し替えるので、カードの種類はここで覚えておく
        window._currentCardData = Object.assign({}, window._currentCardData, rendarableObject);
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

    // カードの演出は送出の瞬間に予約する（描画のタイミングを待たない。送出ページがページを使い回して表示中のまま呼んだときも最初から）
    if (rendarableObject !== undefined) {
        applyCardCustom(window._currentCardData, { fromShow: true });
    } else {
        // TelopHub の送出ページは自前の updateTelop で中身を反映してから showTelop() をデータなしで呼ぶ。
        // カードの種類は今表示しているカード画像から決める
        const cardType = cardTypeOnScreen();
        if (cardType) {
            window._currentCardData = Object.assign({}, window._currentCardData, { cardType });
            applyCardCustom({ cardType }, { fromShow: true, cardOnly: true });
        }
    }
};

function cardTypeOnScreen() {
    const cardEl = keyExpElement('カード');
    const img = cardEl && cardEl.querySelector('image');
    const href = img ? decodeURIComponent(img.getAttribute('href') || img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '') : '';
    if (/Red/i.test(href)) return 'red';
    if (/Yellow2/i.test(href)) return 'yellow2';
    if (/Yellow1/i.test(href)) return 'yellow1';
    return null;
}

/**
 * テロップの内容を更新する関数
 */
window.updateTelop = function (rendarableObject) {
    console.log("1Shotカード updateTelop called", rendarableObject);
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

    window._currentCardData = Object.assign({}, window._currentCardData, normalizedData);

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
        if (doc.nodesById['n1_ps2jlxo2g71t']) { // プロ2コメント黄色
            doc.nodesById['n1_ps2jlxo2g71t'].visible = true;
            if (doc.nodesById['n1_ps2jlxo2g71t'].text !== yellowText) {
                doc.nodesById['n1_ps2jlxo2g71t'].text = yellowText;
                hasUpdates = true;
            }
        }
        if (doc.nodesById['n1_xxqucbuht4t7']) { // プロ2コメント (白)
            doc.nodesById['n1_xxqucbuht4t7'].visible = true;
            if (doc.nodesById['n1_xxqucbuht4t7'].text !== whiteText) {
                doc.nodesById['n1_xxqucbuht4t7'].text = whiteText;
                hasUpdates = true;
            }
        }
    }

    if (hasUpdates) {
        const evaluatedDoc = resolveDynamicVisibility(doc, normalizedData);

        if (evaluatedDoc.nodesById) {
            if (evaluatedDoc.nodesById['n1_ps2jlxo2g71t']) {
                evaluatedDoc.nodesById['n1_ps2jlxo2g71t'].visible = true;
                evaluatedDoc.nodesById['n1_ps2jlxo2g71t'].text = yellowText;
            }
            if (evaluatedDoc.nodesById['n1_xxqucbuht4t7']) {
                evaluatedDoc.nodesById['n1_xxqucbuht4t7'].visible = true;
                evaluatedDoc.nodesById['n1_xxqucbuht4t7'].text = whiteText;
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
            console.error("Error creating new root node in 1Shotカード:", e);
        }

        window.dispatchEvent(new CustomEvent('telopRendered'));
    }

    applyCardCustom(window._currentCardData);
};

/**
 * テロップを非表示にする関数
 */
window.hideTelop = function () {
    stopCardAnimations();
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
        const dataUrl = './1Shotカード.telop';
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
                } else if (window._currentCardData) {
                    applyCardCustom(window._currentCardData);
                } else {
                    applyCardCustom({ cardType: 'yellow1' });
                }
                if (window._pendingShow) {
                    window.showTelop();
                    window._pendingShow = false;
                }
            });
        }
    } catch (e) {
        console.error("[Player] Failed to initialize 1Shotカード:", e);
    }
});
