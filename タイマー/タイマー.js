// 1. Data Loading (Auto-generated)
let projectData = null;
let assetCache = {};

// 2. Controller Logic (Customized for TGA-parts Timer)
window._pendingRenderableObject = null;
window._pendingShow = false;
window._currentTimerData = { 時刻: '0:00', 前後半: '前半' };

function applyTimerCustom(rendarableObject) {
    const app = window.telopApp;
    if (!app || !rendarableObject) return;

    // 1. テキストノードは確実に非表示
    const t1 = app.querySelector('[data-node-id="n1_5pc2hjabc5xl"]');
    const t2 = app.querySelector('[data-node-id="n1_66hw2eamp9rh"]');
    if (t1) { t1.style.display = 'none'; t1.setAttribute('visibility', 'hidden'); }
    if (t2) { t2.style.display = 'none'; t2.setAttribute('visibility', 'hidden'); }

    // 2. 前後半延長画像の切り替え (ID: n1_koxd84ybqjfc)
    // ※ setAttribute('transform', ...) は絶対に行わず、SVGの元配置 matrix(1, 0, 0, 1, 72, 74) を維持！
    const halfNode = app.querySelector('[data-node-id="n1_koxd84ybqjfc"]');
    const halfImg = halfNode ? halfNode.querySelector('image') : null;
    const halfText = String(rendarableObject['前後半'] || '前半').trim();

    if (halfImg) {
        let halfSrc = rendarableObject['前半後半延長'] || 'img/HD2D_P01_Moji_1.png';
        if (!rendarableObject['前半後半延長']) {
            if (halfText.includes('後半') || halfText === '2nd') {
                halfSrc = 'img/HD2D_P01_Moji_2.png';
            } else if (halfText.includes('延前') || halfText.includes('延長前半') || halfText === 'Ex1') {
                halfSrc = 'img/HD2D_P01_Moji_3.png';
            } else if (halfText.includes('延後') || halfText.includes('延長後半') || halfText === 'Ex2') {
                halfSrc = 'img/HD2D_P01_Moji_4.png';
            }
        }
        halfImg.setAttribute('href', halfSrc);
        halfImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', halfSrc);
    }

    // 3. 時刻文字列の解析 ("0:00", "9:59", "10:00", "45:00", "100:00")
    const timeStr = String(rendarableObject['時刻'] || '0:00').trim();
    const parts = timeStr.split(':');
    const minStr = parts[0] || '0';
    const secStr = parts[1] || '00';
    const minVal = parseInt(minStr, 10) || 0;

    // 3桁（100分以上）時のみCSS transformで-22pxシフトし、0〜99分の時は空文字にして完璧に板と合わせる！
    if (halfNode) {
        halfNode.style.transform = minVal >= 100 ? 'translateX(-22px)' : '';
    }

    // 数字・セミコロン画像ノード取得
    const min3Node = app.querySelector('[data-node-id="n1_min3_digit"]');
    const min2Node = app.querySelector('[data-node-id="n1_yaim7su84jo4"]');
    const min1Node = app.querySelector('[data-node-id="n1_qu5aasrymrmr"]');
    const colonNode = app.querySelector('[data-node-id="n1_akuhmwzx6qav"]');
    const sec2Node = app.querySelector('[data-node-id="n1_in96ttdhj5gp"]');
    const sec1Node = app.querySelector('[data-node-id="n1_o9cc95zefec6"]');

    const setNodeVisible = (node, visible) => {
        if (!node) return;
        node.style.display = visible ? '' : 'none';
        node.setAttribute('visibility', visible ? 'visible' : 'hidden');
    };

    const clearNodeImage = (node) => {
        if (!node) return;
        const img = node.querySelector('image');
        if (img) {
            img.setAttribute('href', '');
            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '');
        }
    };

    const setNodeImage = (node, customPath, fallbackDigit) => {
        if (!node) return;
        const img = node.querySelector('image');
        if (img) {
            const src = customPath || (fallbackDigit !== undefined ? `img/Time_${fallbackDigit}.png` : '');
            if (src) {
                img.setAttribute('href', src);
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
            } else {
                img.setAttribute('href', '');
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '');
            }
        }
    };

    // keyExp からの画像指定を取得 (全角・半角両対応)
    const min3Custom = rendarableObject['分３桁'] || rendarableObject['分3桁'];
    const min2Custom = rendarableObject['分２桁'] || rendarableObject['分2桁'];
    const min1Custom = rendarableObject['分１桁'] || rendarableObject['分1桁'];
    const sec2Custom = rendarableObject['秒２桁'] || rendarableObject['秒2桁'];
    const sec1Custom = rendarableObject['秒１桁'] || rendarableObject['秒1桁'];
    const colonCustom = rendarableObject['セミコロン'] || 'img/Time_10.png';

    // コロンと秒は常に表示
    if (colonNode) {
        setNodeVisible(colonNode, true);
        const colonImg = colonNode.querySelector('image');
        if (colonImg) {
            colonImg.setAttribute('href', colonCustom);
            colonImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', colonCustom);
        }
    }
    setNodeVisible(sec2Node, true);
    setNodeImage(sec2Node, sec2Custom, secStr[0] || '0');
    setNodeVisible(sec1Node, true);
    setNodeImage(sec1Node, sec1Custom, secStr[1] || '0');

    if (minVal < 10) {
        // 1桁分: 0:00 〜 9:59 (キックオフ・0:00リセット時は確実に 0:00 表記)
        setNodeVisible(min3Node, false);
        clearNodeImage(min3Node);
        setNodeVisible(min2Node, false);
        clearNodeImage(min2Node);
        setNodeVisible(min1Node, true);
        setNodeImage(min1Node, min1Custom, String(minVal));
    } else if (minVal < 100) {
        // 2桁分: 10:00 〜 99:59
        setNodeVisible(min3Node, false);
        clearNodeImage(min3Node);
        setNodeVisible(min2Node, true);
        setNodeImage(min2Node, min2Custom, String(Math.floor(minVal / 10)));
        setNodeVisible(min1Node, true);
        setNodeImage(min1Node, min1Custom, String(minVal % 10));
    } else {
        // 3桁分: 100:00 〜
        setNodeVisible(min3Node, true);
        const mStr = String(minVal);
        setNodeImage(min3Node, min3Custom, mStr[0]);
        setNodeVisible(min2Node, true);
        setNodeImage(min2Node, min2Custom, mStr[1]);
        setNodeVisible(min1Node, true);
        setNodeImage(min1Node, min1Custom, mStr[2]);
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
                        if (window._currentTimerData) {
                            applyTimerCustom(window._currentTimerData);
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
 * テロップの内容を更新する関数 (毎秒のカウントアップを高速・低負荷で反映)
 */
window.updateTelop = function (rendarableObject) {
    if (!rendarableObject) return;
    window._currentTimerData = Object.assign({}, window._currentTimerData, rendarableObject);

    const app = window.telopApp;
    const doc = window.telopDoc;

    if (!app || !doc) {
        window._pendingRenderableObject = rendarableObject;
        return;
    }

    // Direct, zero-flicker SVG attribute update for every tick
    applyTimerCustom(window._currentTimerData);
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
        const dataUrl = './タイマー.telop';
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
                } else if (window._currentTimerData) {
                    applyTimerCustom(window._currentTimerData);
                } else {
                    applyTimerCustom({ 時刻: '0:00', 前後半: '前半' });
                }
                if (window._pendingShow) {
                    window.showTelop();
                    window._pendingShow = false;
                }
            });
        }
    } catch (e) {
        console.error("[Player] Failed to initialize タイマー:", e);
    }
});
