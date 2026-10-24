// 1. Data Loading (Auto-generated)
let projectData = null;
let assetCache = {};

// 2. Controller Logic (Customized for アディショナルタイム)
window._pendingRenderableObject = null;
window._pendingShow = false;
window._currentLossTimeData = null;

// ノードIDは TelopEditor の保存や telopkit push で振り直されるため、keyExp / ノード名から毎回引く
function nodeSel(key) {
    const doc = window.telopDoc;
    const nodes = doc && doc.nodesById ? Object.values(doc.nodesById) : [];
    const node = nodes.find(n => n.keyexp === key) || nodes.find(n => n.name === key);
    return node ? '[data-node-id="' + node.id + '"]' : '[data-node-id="__none__"]';
}

function applyLossTimeCustom(rendarableObject) {
    const app = window.telopApp;
    if (!app || !rendarableObject) return;

    // テキストノードは確実に非表示
    const textEl = app.querySelector(nodeSel('アディショナルテキスト'));
    if (textEl) textEl.style.display = 'none';

    // アディショナル表示画像ノード (ID: n1_spfa7kl7merx)
    const imgNodeEl = app.querySelector(nodeSel('アディショナル表示'));
    if (!imgNodeEl) return;
    const imgEl = imgNodeEl.querySelector('image');
    if (!imgEl) return;

    // 送出GUIで選択した数値をキーにして、LossSlide_1～9.pngファイルを変更
    let num = rendarableObject['アディショナルタイム'] || rendarableObject.lossTime || rendarableObject['アディショナル表示'] || '1';
    
    // 文字列から数字（1〜9）を抽出
    const match = String(num).match(/[1-9]/);
    const digit = match ? match[0] : '1';
    const targetSrc = `img/LossSlide_${digit}.png`;

    imgEl.setAttribute('href', targetSrc);
}

/**
 * テロップを表示する関数
 */
window.showTelop = function (rendarableObject) {
    if (rendarableObject !== undefined) {
        // Hub が window.updateTelop を差し替えている場合でも、表示時に描く値を必ず選択中の値にする
        // (古い値のまま描くと、どれを選んでも +1 で出てしまう)
        window._currentLossTimeData = Object.assign({}, window._currentLossTimeData, rendarableObject);
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
                        if (window._currentLossTimeData) {
                            applyLossTimeCustom(window._currentLossTimeData);
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
    console.log("アディショナルタイム updateTelop called", rendarableObject);
    if (!rendarableObject) return;
    window._currentLossTimeData = Object.assign({}, window._currentLossTimeData, rendarableObject);

    const app = window.telopApp;
    const doc = window.telopDoc;

    if (!app || !doc) {
        window._pendingRenderableObject = rendarableObject;
        return;
    }

    applyLossTimeCustom(window._currentLossTimeData);
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
        const dataUrl = './アディショナルタイム.telop';
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
                } else if (window._currentLossTimeData) {
                    applyLossTimeCustom(window._currentLossTimeData);
                }
                if (window._pendingShow) {
                    window.showTelop();
                    window._pendingShow = false;
                }
            });
        }
    } catch (e) {
        console.error("[Player] Failed to initialize アディショナルタイム:", e);
    }
});
