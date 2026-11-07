// Pulled from telop "1Shotカード" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/1Shotカード.mjs
// 参照_*: ダッシュボード／カスタム JS が img/Yellow1_15・Yellow2_15・Red_15.png を使うので、push で消えないよう非表示で参照しておく。
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "1Shotカード",
      "raw": {
        "x": 0,
        "y": 0,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "pivotX": 0,
        "pivotY": 0,
        "skewX": 0,
        "skewY": 0,
        "opacity": 1,
        "visible": true,
        "locked": false,
        "blendMode": "normal",
        "effects": [],
        "customJs": "// 1. Data Loading (Auto-generated)\r\nlet projectData = null;\r\nlet assetCache = {};\r\n\r\n// 2. Controller Logic (Customized for 1Shotカード)\r\nwindow._pendingRenderableObject = null;\r\nwindow._pendingShow = false;\r\nwindow._currentCardData = null;\r\n\r\nfunction showNode(node) {\r\n    if (!node) return;\r\n    node.removeAttribute(\"display\");\r\n    node.removeAttribute(\"visibility\");\r\n    node.style.removeProperty(\"display\");\r\n    node.style.removeProperty(\"visibility\");\r\n    node.style.removeProperty(\"opacity\");\r\n    node.classList.remove(\"is-invisible\");\r\n\r\n    if (node.querySelectorAll) {\r\n        const hiddenChildren = node.querySelectorAll('[visibility=\"hidden\"], [display=\"none\"], .is-invisible, image');\r\n        hiddenChildren.forEach(child => {\r\n            child.removeAttribute(\"visibility\");\r\n            child.removeAttribute(\"display\");\r\n            child.style.removeProperty(\"visibility\");\r\n            child.style.removeProperty(\"display\");\r\n            child.style.removeProperty(\"opacity\");\r\n            child.classList.remove(\"is-invisible\");\r\n        });\r\n    }\r\n}\r\n\r\nfunction hideNode(node) {\r\n    if (!node) return;\r\n    node.setAttribute(\"display\", \"none\");\r\n    node.style.setProperty(\"display\", \"none\", \"important\");\r\n}\r\n\r\nfunction resolvePhotoUrl(rawSrc) {\r\n    if (!rawSrc) return '';\r\n    let src = String(rawSrc).trim();\r\n    try {\r\n        src = decodeURI(src);\r\n    } catch (e) {}\r\n    return encodeURI(src);\r\n}\r\n\r\nfunction setNodeImage(imgEl, rawSrc, payload) {\r\n    if (!imgEl || !rawSrc) return;\r\n    const clean = String(rawSrc).trim();\r\n    if (!clean) return;\r\n\r\n    const school = (payload && (payload['所属'] || payload.school)) ? String(payload['所属'] || payload.school).trim() : '';\r\n\r\n    // パス候補のリストアップ\r\n    const candidates = [];\r\n\r\n    // 1. /Photo/ または Photo/ で始まる場合\r\n    if (clean.startsWith('/Photo/') || clean.startsWith('Photo/')) {\r\n        const norm = clean.startsWith('/') ? clean : '/' + clean;\r\n        candidates.push('..' + norm); // ../Photo/... (1Shotカード.htmlから見た相対パス、最優先)\r\n        candidates.push(norm);        // /Photo/... (Webルート)\r\n    } else if (clean.includes('/')) {\r\n        candidates.push(clean);\r\n        if (!clean.startsWith('/')) candidates.push('../' + clean);\r\n    } else {\r\n        // ファイル名のみの場合 (例: \"14 菅野桜抜き.png\")\r\n        if (school) {\r\n            candidates.push(`../Photo/${school}/${clean}`);\r\n            candidates.push(`/Photo/${school}/${clean}`);\r\n        }\r\n        candidates.push(`../Photo/${clean}`);\r\n        candidates.push(`/Photo/${clean}`);\r\n        candidates.push(`img/${clean}`);\r\n        candidates.push(clean);\r\n    }\r\n\r\n    // URIエンコード済みの候補リスト (重複除外)\r\n    const encodedCandidates = candidates.map(c => resolvePhotoUrl(c)).filter((v, i, a) => a.indexOf(v) === i);\r\n\r\n    // キャッシュまたは最優先候補を即座にセット\r\n    const cached = window.assetCache && encodedCandidates.find(c => window.assetCache[c]);\r\n    const initialUrl = (cached && window.assetCache[cached]) || encodedCandidates[0] || resolvePhotoUrl(clean);\r\n\r\n    imgEl.setAttribute('href', initialUrl);\r\n    imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', initialUrl);\r\n    if (!imgEl.getAttribute('width')) imgEl.setAttribute('width', '205');\r\n    if (!imgEl.getAttribute('height')) imgEl.setAttribute('height', '240');\r\n    imgEl.setAttribute('preserveAspectRatio', 'none');\r\n\r\n    // 複数候補を並行プリロードして、最初にロード成功した有効URLを適用\r\n    let resolved = false;\r\n    encodedCandidates.forEach(url => {\r\n        const tester = new Image();\r\n        tester.onload = function () {\r\n            if (!resolved) {\r\n                resolved = true;\r\n                imgEl.setAttribute('href', url);\r\n                imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);\r\n            }\r\n        };\r\n        tester.src = url;\r\n    });\r\n}\r\n\r\nfunction setTextToNode(nodeEl, textStr) {\r\n    if (!nodeEl || textStr === undefined || textStr === null) return;\r\n    const str = String(textStr);\r\n    // SVG テキストノード内のすべての text 要素（shadow, stroke, fill）を一括更新\r\n    const allTexts = nodeEl.querySelectorAll ? nodeEl.querySelectorAll('text') : [];\r\n    if (allTexts.length > 0) {\r\n        allTexts.forEach(tEl => {\r\n            const tspans = tEl.querySelectorAll('tspan');\r\n            if (tspans.length > 0) {\r\n                tspans.forEach((ts, idx) => {\r\n                    if (idx === 0) ts.textContent = str;\r\n                    else ts.textContent = '';\r\n                });\r\n            } else {\r\n                tEl.textContent = str;\r\n            }\r\n        });\r\n    } else {\r\n        const tspans = nodeEl.querySelectorAll ? nodeEl.querySelectorAll('tspan') : [];\r\n        if (tspans.length > 0) {\r\n            tspans.forEach((ts, idx) => {\r\n                if (idx === 0) ts.textContent = str;\r\n                else ts.textContent = '';\r\n            });\r\n        } else {\r\n            nodeEl.textContent = str;\r\n        }\r\n    }\r\n}\r\n\r\nfunction resolveCommentTexts(data) {\r\n    if (!data) return { isYellow: false, yellowText: '', whiteText: '', isPro2Mode: true };\r\n\r\n    const mode = data.mode || (data.todayGoalSelected ? 'today' : (data.totalGoalSelected ? 'total' : 'pro2'));\r\n    const isPro2Mode = mode === 'pro2' && !data.todayGoalSelected && !data.totalGoalSelected;\r\n\r\n    // 全角・半角キーの取得\r\n    const valYellow = data['プロ2コメント黄色'] !== undefined ? data['プロ2コメント黄色'] : data['プロ２コメント黄色'];\r\n    const valWhite = data['プロ2コメント'] !== undefined ? data['プロ2コメント'] : data['プロ２コメント'];\r\n\r\n    const strYellow = (valYellow !== undefined && valYellow !== null) ? String(valYellow).trim() : '';\r\n    const strWhite = (valWhite !== undefined && valWhite !== null) ? String(valWhite).trim() : '';\r\n\r\n    // 黄色フラグON判定:\r\n    // 1. isYellow, useYellowText, pro2IsYellow, yellowFlag, 黄色フラグ のいずれかが明示的に true\r\n    // 2. または「プロ２コメント黄色」「プロ2コメント黄色」に空でない文字列が入っている場合\r\n    const explicitYellow = data.isYellow === true || data.isYellow === 'true' ||\r\n                           data.useYellowText === true || data.useYellowText === 'true' ||\r\n                           data.pro2IsYellow === true || data.pro2IsYellow === 'true' ||\r\n                           data.yellowFlag === true || data.yellowFlag === 'true' ||\r\n                           data['黄色フラグ'] === true || data['黄色フラグ'] === 'true' || data['黄色フラグ'] === 'ON';\r\n\r\n    const hasYellowText = strYellow !== '';\r\n    const isYellow = explicitYellow || hasYellowText;\r\n\r\n    let yellowText = '';\r\n    let whiteText = '';\r\n\r\n    if (isPro2Mode) {\r\n        if (isYellow) {\r\n            // 黄色フラグON: 「プロ２コメント黄色」の値を使用（もし空なら白側から引き継ぐ）\r\n            yellowText = (valYellow !== undefined && valYellow !== null && String(valYellow) !== '')\r\n                ? String(valYellow)\r\n                : ((valWhite !== undefined && valWhite !== null) ? String(valWhite) : '');\r\n            whiteText = '';\r\n        } else {\r\n            // 黄色フラグOFF: 「プロ２コメント」の値を使用（もし空なら黄色側から引き継ぐ）\r\n            whiteText = (valWhite !== undefined && valWhite !== null && String(valWhite) !== '')\r\n                ? String(valWhite)\r\n                : ((valYellow !== undefined && valYellow !== null) ? String(valYellow) : '');\r\n            yellowText = '';\r\n        }\r\n    }\r\n\r\n    return {\r\n        isYellow,\r\n        yellowText,\r\n        whiteText,\r\n        isPro2Mode\r\n    };\r\n}\r\n\r\nfunction applyCardCustom(rendarableObject, options = {}) {\r\n    const app = window.telopApp;\r\n    if (!app || !rendarableObject) return;\r\n\r\n    // cardOnly: TelopHub の送出ページが中身を反映済みのとき。顔写真・コメントは触らずカードの演出だけ行う\r\n    if (!options.cardOnly) {\r\n    // 1. 顔写真の制御 (keyExp: 顔写真)\r\n    const keyExpTargets = window.keyExpMap ? window.keyExpMap.get('顔写真') : null;\r\n    const targetEl = keyExpTargets && keyExpTargets[0] ? keyExpTargets[0].element : null;\r\n    const faceEl = targetEl;\r\n    if (faceEl) {\r\n        const photoSrc = rendarableObject['顔写真'] || rendarableObject.photo;\r\n        const isPhotoVisible = rendarableObject['顔写真_visible'] !== false &&\r\n                               rendarableObject.showPhoto !== false &&\r\n                               photoSrc && String(photoSrc).trim() !== '';\r\n        \r\n        if (isPhotoVisible) {\r\n            showNode(faceEl);\r\n            const img = faceEl.querySelector('image');\r\n            if (img) {\r\n                showNode(img);\r\n                setNodeImage(img, photoSrc, rendarableObject);\r\n            }\r\n        } else {\r\n            hideNode(faceEl);\r\n        }\r\n    }\r\n\r\n    // 2. モード制御 (pro2 / today / total)\r\n    const pro2Yellow = keyExpElement('プロ2コメント黄色');\r\n    const pro2White = keyExpElement('プロ2コメント');\r\n    const totalGoalEl = null; // TOTALゴール（1Shotカードでは常に非表示）\r\n    const todayGoalEl = null; // TODAYゴール（1Shotカードでは常に非表示）\r\n\r\n    const { isYellow, yellowText, whiteText, isPro2Mode } = resolveCommentTexts(rendarableObject);\r\n    const mode = rendarableObject.mode || (rendarableObject.todayGoalSelected ? 'today' : (rendarableObject.totalGoalSelected ? 'total' : 'pro2'));\r\n\r\n    if (mode === 'today') {\r\n        hideNode(pro2Yellow);\r\n        setTextToNode(pro2Yellow, '');\r\n        hideNode(pro2White);\r\n        setTextToNode(pro2White, '');\r\n        hideNode(totalGoalEl);\r\n        showNode(todayGoalEl);\r\n    } else if (mode === 'total') {\r\n        hideNode(pro2Yellow);\r\n        setTextToNode(pro2Yellow, '');\r\n        hideNode(pro2White);\r\n        setTextToNode(pro2White, '');\r\n        hideNode(todayGoalEl);\r\n        showNode(totalGoalEl);\r\n    } else {\r\n        // pro2\r\n        hideNode(todayGoalEl);\r\n        hideNode(totalGoalEl);\r\n\r\n        if (isYellow) {\r\n            // 黄色フラグON: プロ2コメント黄色を表示、プロ2コメント（白）を非表示＆テキストクリア\r\n            showNode(pro2Yellow);\r\n            setTextToNode(pro2Yellow, yellowText);\r\n            hideNode(pro2White);\r\n            setTextToNode(pro2White, '');\r\n        } else {\r\n            // 黄色フラグOFF: プロ2コメント（白）を表示、プロ2コメント黄色を非表示＆テキストクリア\r\n            showNode(pro2White);\r\n            setTextToNode(pro2White, whiteText);\r\n            hideNode(pro2Yellow);\r\n            setTextToNode(pro2Yellow, '');\r\n        }\r\n    }\r\n\r\n    }\r\n\r\n    // 3. カード制御 & アニメーション（keyExp「カード」のノード。ノード ID は push で振り直されるので使わない）\r\n    const cardEl = keyExpElement('カード');\r\n    if (!cardEl) return;\r\n    const cardImg = cardEl.querySelector('image');\r\n    // 動かすのは中身（content-wrapper）。ノード本体の transform 属性は位置なので、CSS transform で上書きしない\r\n    const mover = cardEl.querySelector('.content-wrapper') || cardImg;\r\n    if (!cardImg || !mover) return;\r\n    ensureCardClip(cardEl);\r\n\r\n    stopCardAnimations();\r\n\r\n    const cardType = rendarableObject.cardType || (rendarableObject['カード']?.includes('Red') ? 'red' : (rendarableObject['カード']?.includes('Yellow2') ? 'yellow2' : 'yellow1'));\r\n    const setCard = (src) => {\r\n        cardImg.setAttribute('href', src);\r\n        cardImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);\r\n    };\r\n    // 止まっているときの位置（アニメーションが終わるとこの位置になる）\r\n    const place = (x) => {\r\n        mover.style.transition = 'none';\r\n        mover.style.transform = `translateX(${x}px)`;\r\n        mover.style.opacity = '1';\r\n    };\r\n    // スライドの演出は送出（TAKE）したときだけ。送出中の UPDATE では最後の状態で出す\r\n    const animate = !!options.fromShow;\r\n\r\n    if (cardType === 'yellow2') {\r\n        // --- イエロー2枚 -> 1.2 秒後に座布団の背面へスライドアウト -> レッドが背面からスライドイン ---\r\n        if (!animate) {\r\n            setCard('img/Red_15.png');\r\n            place(0);\r\n            return;\r\n        }\r\n        setCard('img/Yellow2_15.png');\r\n        place(0);\r\n        const out = slideCard(mover, 0, CARD_HIDDEN_X, { delay: 1200, duration: 350, easing: 'ease-in', fill: 'forwards' });\r\n        if (!out) {\r\n            setCard('img/Red_15.png');\r\n            return;\r\n        }\r\n        out.onfinish = () => {\r\n            setCard('img/Red_15.png');\r\n            slideCard(mover, CARD_HIDDEN_X, 0, { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });\r\n            out.cancel();\r\n        };\r\n    } else if (cardType === 'red') {\r\n        setCard('img/Red_15.png');\r\n        place(0);\r\n    } else {\r\n        // --- イエロー1枚: 1Shot が出てから 1 秒後、座布団の背面から左へ 1.5 秒でスライドイン ---\r\n        setCard('img/Yellow1_15.png');\r\n        place(0);\r\n        if (animate) {\r\n            slideCard(mover, CARD_HIDDEN_X, 0, { delay: 1000, duration: 1500, easing: 'ease-out', fill: 'backwards' });\r\n        }\r\n    }\r\n}\r\n\r\n// カードを座布団の背面に隠すときの右へのずらし量（カード画像の見えている部分が座布団の左端より右に入る量）\r\nconst CARD_HIDDEN_X = 110;\r\n/*\r\n * カードの動きは Web Animations で付ける。TelopHub の送出ページはこのページを content-visibility: hidden の入れ物に入れて\r\n * 動かすので、requestAnimationFrame が来ないことがある。送出の瞬間に遅延込みでアニメーションを予約しておけば、\r\n * 描画が始まったところから正しい順番で動く（CSS transition のように途中の状態を見落として最後の位置に飛ばない）\r\n */\r\nlet cardAnimations = [];\r\nfunction slideCard(el, fromX, toX, options) {\r\n    if (!el.animate) return null;\r\n    const anim = el.animate(\r\n        [{ transform: `translateX(${fromX}px)` }, { transform: `translateX(${toX}px)` }],\r\n        options\r\n    );\r\n    cardAnimations.push(anim);\r\n    return anim;\r\n}\r\nfunction stopCardAnimations() {\r\n    cardAnimations.forEach(a => { a.onfinish = null; a.cancel(); });\r\n    cardAnimations = [];\r\n}\r\n\r\nfunction keyExpElement(key) {\r\n    const targets = window.keyExpMap ? window.keyExpMap.get(key) : null;\r\n    return targets && targets[0] ? targets[0].element : null;\r\n}\r\n\r\n/**\r\n * 座布団（1SHOT用ザブトン）の左端より右に入ったカードを見えなくするクリップ。\r\n * 座標はカードノード内（左上 = カードの位置）。座布団の左端は下に行くほど少し右へ傾いているので、それに合わせる。\r\n * 再描画で defs が作り直されるので、毎回なければ足す\r\n */\r\nconst CARD_CLIP_ID = 'oneshot-card-behind-plate';\r\nfunction ensureCardClip(cardEl) {\r\n    const svg = cardEl.ownerSVGElement;\r\n    if (!svg) return;\r\n    if (!svg.querySelector('#' + CARD_CLIP_ID)) {\r\n        const ns = 'http://www.w3.org/2000/svg';\r\n        const clip = document.createElementNS(ns, 'clipPath');\r\n        clip.setAttribute('id', CARD_CLIP_ID);\r\n        clip.setAttribute('clipPathUnits', 'userSpaceOnUse');\r\n        const poly = document.createElementNS(ns, 'polygon');\r\n        poly.setAttribute('points', '-2000,-2000 219,-2000 219,66 232,141 232,2000 -2000,2000');\r\n        clip.appendChild(poly);\r\n        const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(ns, 'defs'), svg.firstChild);\r\n        defs.appendChild(clip);\r\n    }\r\n    cardEl.setAttribute('clip-path', `url(#${CARD_CLIP_ID})`);\r\n}\r\n\r\n/**\r\n * テロップを表示する関数\r\n */\r\nwindow.showTelop = function (rendarableObject) {\r\n    if (rendarableObject !== undefined) {\r\n        // TelopHub の送出ページは updateTelop を自前の処理に差し替えるので、カードの種類はここで覚えておく\r\n        window._currentCardData = Object.assign({}, window._currentCardData, rendarableObject);\r\n        window.updateTelop(rendarableObject);\r\n    }\r\n\r\n    if (!window.initialized) {\r\n        window._pendingShow = true;\r\n        return;\r\n    }\r\n\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        if (!divElement.classList.contains(\"in_animation\")) {\r\n            divElement.classList.remove(...divElement.classList);\r\n            divElement.style.opacity = \"0\";\r\n            \r\n            const triggerShow = () => {\r\n                requestAnimationFrame(() => {\r\n                    requestAnimationFrame(() => {\r\n                        divElement.style.opacity = \"\";\r\n                        divElement.classList.add(\"in_animation\");\r\n                        document.body.style.display = \"block\";\r\n                    });\r\n                });\r\n            };\r\n\r\n            if (document.fonts && document.fonts.ready) {\r\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\r\n            } else {\r\n                triggerShow();\r\n            }\r\n        }\r\n    }\r\n\r\n    // カードの演出は送出の瞬間に予約する（描画のタイミングを待たない。送出ページがページを使い回して表示中のまま呼んだときも最初から）\r\n    if (rendarableObject !== undefined) {\r\n        applyCardCustom(window._currentCardData, { fromShow: true });\r\n    } else {\r\n        // TelopHub の送出ページは自前の updateTelop で中身を反映してから showTelop() をデータなしで呼ぶ。\r\n        // カードの種類は今表示しているカード画像から決める\r\n        const cardType = cardTypeOnScreen();\r\n        if (cardType) {\r\n            window._currentCardData = Object.assign({}, window._currentCardData, { cardType });\r\n            applyCardCustom({ cardType }, { fromShow: true, cardOnly: true });\r\n        }\r\n    }\r\n};\r\n\r\nfunction cardTypeOnScreen() {\r\n    const cardEl = keyExpElement('カード');\r\n    const img = cardEl && cardEl.querySelector('image');\r\n    const href = img ? decodeURIComponent(img.getAttribute('href') || img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '') : '';\r\n    if (/Red/i.test(href)) return 'red';\r\n    if (/Yellow2/i.test(href)) return 'yellow2';\r\n    if (/Yellow1/i.test(href)) return 'yellow1';\r\n    return null;\r\n}\r\n\r\n/**\r\n * テロップの内容を更新する関数\r\n */\r\nwindow.updateTelop = function (rendarableObject) {\r\n    console.log(\"1Shotカード updateTelop called\", rendarableObject);\r\n    if (!rendarableObject) return;\r\n\r\n    // 全角・半角の相互同期補完\r\n    const normalizedData = Object.assign({}, rendarableObject);\r\n    if (normalizedData['プロ２コメント黄色'] !== undefined && normalizedData['プロ2コメント黄色'] === undefined) {\r\n        normalizedData['プロ2コメント黄色'] = normalizedData['プロ２コメント黄色'];\r\n    }\r\n    if (normalizedData['プロ2コメント黄色'] !== undefined && normalizedData['プロ２コメント黄色'] === undefined) {\r\n        normalizedData['プロ２コメント黄色'] = normalizedData['プロ2コメント黄色'];\r\n    }\r\n    if (normalizedData['プロ２コメント'] !== undefined && normalizedData['プロ2コメント'] === undefined) {\r\n        normalizedData['プロ2コメント'] = normalizedData['プロ２コメント'];\r\n    }\r\n    if (normalizedData['プロ2コメント'] !== undefined && normalizedData['プロ２コメント'] === undefined) {\r\n        normalizedData['プロ２コメント'] = normalizedData['プロ2コメント'];\r\n    }\r\n\r\n    const { isYellow, yellowText, whiteText, isPro2Mode } = resolveCommentTexts(normalizedData);\r\n    normalizedData.isYellow = isYellow;\r\n    if (isPro2Mode) {\r\n        normalizedData['プロ2コメント黄色'] = yellowText;\r\n        normalizedData['プロ２コメント黄色'] = yellowText;\r\n        normalizedData['プロ2コメント'] = whiteText;\r\n        normalizedData['プロ２コメント'] = whiteText;\r\n    }\r\n\r\n    window._currentCardData = Object.assign({}, window._currentCardData, normalizedData);\r\n\r\n    const app = window.telopApp;\r\n    const doc = window.telopDoc;\r\n    const keyExpMap = window.keyExpMap;\r\n    const createNode = window.createNode;\r\n\r\n    if (!app || !doc || !keyExpMap || !createNode) {\r\n        window._pendingRenderableObject = normalizedData;\r\n        return;\r\n    }\r\n\r\n    let hasUpdates = false;\r\n\r\n    Object.keys(normalizedData).forEach(key => {\r\n        const val = normalizedData[key];\r\n        // 全角・半角の両方で keyExpMap をチェック\r\n        const altKey = key.replace(/２/g, '2').replace(/2/g, '２');\r\n        const targets = keyExpMap.get(key) || keyExpMap.get(altKey);\r\n\r\n        if (targets && Array.isArray(targets) && (val || val === \"\")) {\r\n            targets.forEach((target) => {\r\n                if (target.type === 'text') {\r\n                    const strVal = String(val);\r\n                    if (target.nodeData.text !== strVal) {\r\n                        target.nodeData.text = strVal;\r\n                        const nodeInDoc = doc.nodesById[target.nodeData.id];\r\n                        if (nodeInDoc) nodeInDoc.text = strVal;\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'image') {\r\n                    const node = target.nodeData;\r\n                    const baseAsset = (doc.assets && doc.assets[node.assetId]) ||\r\n                                      (projectData && projectData.assets && projectData.assets[node.assetId]) ||\r\n                                      { id: node.assetId, kind: 'image', src: '' };\r\n                    if (!doc.assets) doc.assets = {};\r\n                    const newSrc = String(val);\r\n                    if (baseAsset.src !== newSrc) {\r\n                        var uniqueAssetId = (node.assetId || 'asset_' + node.id).replace(/__keyexp_.*$/, '') + '__keyexp_' + key;\r\n                        doc.assets[uniqueAssetId] = Object.assign({}, baseAsset, { src: newSrc });\r\n                        node.assetId = uniqueAssetId;\r\n                        const nodeInDoc = doc.nodesById[node.id];\r\n                        if (nodeInDoc) {\r\n                            nodeInDoc.assetId = uniqueAssetId;\r\n                            if (key === '顔写真') {\r\n                                const isPhotoVisible = normalizedData['顔写真_visible'] !== false &&\r\n                                                       normalizedData.showPhoto !== false &&\r\n                                                       newSrc && newSrc.trim() !== '';\r\n                                nodeInDoc.visible = isPhotoVisible;\r\n                            }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'appearance_fill') {\r\n                    const apps = target.nodeData.style?.appearances || [];\r\n                    const appStyle = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\r\n                    if (appStyle && (appStyle.fill !== String(val) || appStyle.gradientConfig)) {\r\n                        appStyle.fill = String(val);\r\n                        if (appStyle.gradientConfig) { delete appStyle.gradientConfig; }\r\n                        if (docApp) {\r\n                            docApp.fill = String(val);\r\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                }\r\n            });\r\n        }\r\n    });\r\n\r\n    if (doc.nodesById) {\r\n        if (doc.nodesById['n1_ps2jlxo2g71t']) { // プロ2コメント黄色\r\n            doc.nodesById['n1_ps2jlxo2g71t'].visible = true;\r\n            if (doc.nodesById['n1_ps2jlxo2g71t'].text !== yellowText) {\r\n                doc.nodesById['n1_ps2jlxo2g71t'].text = yellowText;\r\n                hasUpdates = true;\r\n            }\r\n        }\r\n        if (doc.nodesById['n1_xxqucbuht4t7']) { // プロ2コメント (白)\r\n            doc.nodesById['n1_xxqucbuht4t7'].visible = true;\r\n            if (doc.nodesById['n1_xxqucbuht4t7'].text !== whiteText) {\r\n                doc.nodesById['n1_xxqucbuht4t7'].text = whiteText;\r\n                hasUpdates = true;\r\n            }\r\n        }\r\n    }\r\n\r\n    if (hasUpdates) {\r\n        const evaluatedDoc = resolveDynamicVisibility(doc, normalizedData);\r\n\r\n        if (evaluatedDoc.nodesById) {\r\n            if (evaluatedDoc.nodesById['n1_ps2jlxo2g71t']) {\r\n                evaluatedDoc.nodesById['n1_ps2jlxo2g71t'].visible = true;\r\n                evaluatedDoc.nodesById['n1_ps2jlxo2g71t'].text = yellowText;\r\n            }\r\n            if (evaluatedDoc.nodesById['n1_xxqucbuht4t7']) {\r\n                evaluatedDoc.nodesById['n1_xxqucbuht4t7'].visible = true;\r\n                evaluatedDoc.nodesById['n1_xxqucbuht4t7'].text = whiteText;\r\n            }\r\n        }\r\n\r\n        for (const nodeId in evaluatedDoc.nodesById) {\r\n            const prevNode = doc.nodesById[nodeId];\r\n            const nextNode = evaluatedDoc.nodesById[nodeId];\r\n            if (prevNode && nextNode && nextNode.type === 'image') {\r\n                if (prevNode.assetId !== nextNode.assetId) {\r\n                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||\r\n                                      (projectData.assets && projectData.assets[nextNode.assetId]);\r\n                    if (nextAsset && nextAsset.src) {\r\n                        const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                        const imgEl = nodeEl ? nodeEl.querySelector(\"image\") : null;\r\n                        if (imgEl) {\r\n                            setNodeImage(imgEl, nextAsset.src, normalizedData);\r\n                        }\r\n                    }\r\n                    prevNode.assetId = nextNode.assetId;\r\n                }\r\n            }\r\n            if (prevNode && nextNode && prevNode.visible !== nextNode.visible) {\r\n                const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                if (nodeEl) {\r\n                    nodeEl.style.display = nextNode.visible === false ? 'none' : '';\r\n                }\r\n                prevNode.visible = nextNode.visible;\r\n            }\r\n        }\r\n\r\n        window.telopDoc = evaluatedDoc;\r\n        keyExpMap.clear();\r\n\r\n        try {\r\n            const oldDefs = app.firstChild;\r\n            if (oldDefs) oldDefs.innerHTML = '';\r\n\r\n            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);\r\n            if (newRootNode) {\r\n                if (app.childNodes.length > 1) {\r\n                    app.replaceChild(newRootNode, app.childNodes[1]);\r\n                } else {\r\n                    app.appendChild(newRootNode);\r\n                }\r\n\r\n                while (app.childNodes.length > 2) {\r\n                    app.removeChild(app.lastChild);\r\n                }\r\n            }\r\n        } catch (e) {\r\n            console.error(\"Error creating new root node in 1Shotカード:\", e);\r\n        }\r\n\r\n        window.dispatchEvent(new CustomEvent('telopRendered'));\r\n    }\r\n\r\n    applyCardCustom(window._currentCardData);\r\n};\r\n\r\n/**\r\n * テロップを非表示にする関数\r\n */\r\nwindow.hideTelop = function () {\r\n    stopCardAnimations();\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        divElement.classList.remove(...divElement.classList);\r\n\r\n        let finished = false;\r\n        const completeHide = () => {\r\n            if (finished) return;\r\n            finished = true;\r\n            divElement.style.opacity = '0';\r\n            divElement.classList.remove(\"out_animation\");\r\n            if (window.animationFinishedCallback) {\r\n                window.animationFinishedCallback();\r\n            }\r\n            divElement.removeEventListener('animationend', onAnimationEnd);\r\n        };\r\n\r\n        const onAnimationEnd = (e) => {\r\n            if (!divElement.classList.contains(\"out_animation\")) return;\r\n            completeHide();\r\n        };\r\n\r\n        divElement.addEventListener('animationend', onAnimationEnd);\r\n        divElement.classList.add(\"out_animation\");\r\n\r\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\r\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\r\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\r\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\r\n        setTimeout(() => {\r\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\r\n                completeHide();\r\n            }\r\n        }, timeoutMs);\r\n    }\r\n};\r\n\r\n// 3. Initialization\r\nwindow.addEventListener('load', async () => {\r\n    try {\r\n        if (document.fonts && document.fonts.ready) {\r\n            await document.fonts.ready;\r\n        }\r\n        const dataUrl = './1Shotカード.telop';\r\n        const dataResp = await fetch(dataUrl);\r\n        if (dataResp.ok) {\r\n            projectData = await dataResp.json();\r\n        }\r\n        assetCache = {};\r\n        if (window.initPlayer) {\r\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\r\n                window.initialized = true;\r\n                if (window._pendingRenderableObject) {\r\n                    window.updateTelop(window._pendingRenderableObject);\r\n                    window._pendingRenderableObject = null;\r\n                } else if (window._currentCardData) {\r\n                    applyCardCustom(window._currentCardData);\r\n                } else {\r\n                    applyCardCustom({ cardType: 'yellow1' });\r\n                }\r\n                if (window._pendingShow) {\r\n                    window.showTelop();\r\n                    window._pendingShow = false;\r\n                }\r\n            });\r\n        }\r\n    } catch (e) {\r\n        console.error(\"[Player] Failed to initialize 1Shotカード:\", e);\r\n    }\r\n});\r\n"
      },
      "children": [
        {
          "type": "image",
          "name": "1SHOT用ザブトン",
          "src": "../../1Shotカード/img/HD2D_S01_Base1.png",
          "raw": {
            "x": 1286,
            "y": 929,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 602,
            "height": 150
          }
        },
        {
          "type": "group",
          "name": "チームカラー変更",
          "raw": {
            "x": 1336,
            "y": 957,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          },
          "children": [
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "x": 162,
                "y": -19,
                "rotation": 0,
                "scaleX": 1.4321911399652143,
                "scaleY": 1.1749999999999878,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": -14.524950658846302,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              },
              "children": [
                {
                  "type": "rect",
                  "name": "エッジ左",
                  "w": 4,
                  "h": 54,
                  "raw": {
                    "x": -32,
                    "y": -2,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 3,
                    "skewY": 3,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 4,
                    "height": 54,
                    "style": {
                      "appearances": [
                        {
                          "enabled": true,
                          "fillEnabled": true,
                          "fill": "#ffffff",
                          "strokeEnabled": false,
                          "color": "#000000",
                          "thickness": 2,
                          "lineJoin": "miter",
                          "miterLimit": 10,
                          "fillKeyexp": "ColorEdge"
                        }
                      ],
                      "cornerRadius": 0
                    },
                    "visibilityCondition": {
                      "enabled": true,
                      "targetKeyexp": "ColorEdge",
                      "operator": "not_empty"
                    }
                  }
                },
                {
                  "type": "rect",
                  "name": "エッジ右",
                  "w": 4,
                  "h": 54,
                  "raw": {
                    "x": 12,
                    "y": -2,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 3,
                    "skewY": 3,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 4,
                    "height": 54,
                    "style": {
                      "appearances": [
                        {
                          "enabled": true,
                          "fillEnabled": true,
                          "fill": "#ffffff",
                          "strokeEnabled": false,
                          "color": "#000000",
                          "thickness": 2,
                          "lineJoin": "miter",
                          "miterLimit": 10,
                          "fillKeyexp": "ColorEdge"
                        }
                      ],
                      "cornerRadius": 0
                    },
                    "visibilityCondition": {
                      "enabled": true,
                      "targetKeyexp": "ColorEdge",
                      "operator": "not_empty"
                    }
                  }
                },
                {
                  "type": "rect",
                  "name": "ベースカラー",
                  "w": 40,
                  "h": 54,
                  "raw": {
                    "x": -28,
                    "y": -2,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 3,
                    "skewY": 3,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 40,
                    "height": 54,
                    "style": {
                      "appearances": [
                        {
                          "enabled": true,
                          "fillEnabled": true,
                          "fill": "#bd39fb",
                          "strokeEnabled": false,
                          "color": "#000000",
                          "thickness": 2,
                          "lineJoin": "miter",
                          "miterLimit": 10,
                          "fillKeyexp": "ColorRect"
                        }
                      ],
                      "cornerRadius": 0
                    },
                    "domId": "TeamColor"
                  }
                },
                {
                  "type": "rect",
                  "name": "カラー2",
                  "w": 20,
                  "h": 54,
                  "raw": {
                    "x": -8,
                    "y": -2,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 3,
                    "skewY": 3,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 20,
                    "height": 54,
                    "style": {
                      "appearances": [
                        {
                          "enabled": true,
                          "fillEnabled": true,
                          "fill": "#bd39fb",
                          "strokeEnabled": false,
                          "color": "#000000",
                          "thickness": 2,
                          "lineJoin": "miter",
                          "miterLimit": 10,
                          "fillKeyexp": "ColorRect2"
                        }
                      ],
                      "cornerRadius": 0
                    }
                  }
                },
                {
                  "type": "rect",
                  "name": "グラデーションマット",
                  "w": 40,
                  "h": 54,
                  "raw": {
                    "x": -28,
                    "y": -1,
                    "rotation": -3,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 3,
                    "skewY": 2,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 40,
                    "height": 54,
                    "style": {
                      "appearances": [
                        {
                          "enabled": true,
                          "fillEnabled": true,
                          "fill": [
                            "#00000073",
                            "#00000078",
                            "#ffffff29",
                            "#00000075",
                            "#0000001a",
                            "#000000a1"
                          ],
                          "strokeEnabled": false,
                          "color": "#000000",
                          "thickness": 2,
                          "lineJoin": "miter",
                          "miterLimit": 10,
                          "gradientConfig": {
                            "type": "linear",
                            "angle": 90,
                            "units": "objectBoundingBox",
                            "stops": [
                              {
                                "offset": 0.05,
                                "color": "#00000073"
                              },
                              {
                                "offset": 0.05,
                                "color": "#00000078"
                              },
                              {
                                "offset": 0.5,
                                "color": "#ffffff29"
                              },
                              {
                                "offset": 0.51,
                                "color": "#00000075"
                              },
                              {
                                "offset": 0.95,
                                "color": "#0000001a"
                              },
                              {
                                "offset": 1,
                                "color": "#000000a1"
                              }
                            ]
                          }
                        }
                      ],
                      "cornerRadius": 0
                    }
                  }
                }
              ]
            },
            {
              "type": "text",
              "name": "TeamColor",
              "text": "#bd39fb",
              "w": 66,
              "raw": {
                "x": 149,
                "y": 22,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "#bd39fb",
                "width": 66,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 10,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": false,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 24,
                "keyexp": "TeamColor"
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "左側上板",
          "src": "../../1Shotカード/img/HD2D_S01_ZabuTeam.png",
          "raw": {
            "x": 1286,
            "y": 887,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 602,
            "height": 60
          }
        },
        {
          "type": "image",
          "name": "反転した上板",
          "src": "../../1Shotカード/img/HD2D_S01_ZabuTeam.png",
          "raw": {
            "x": 1888,
            "y": 886,
            "rotation": -180,
            "scaleX": 0.8454901534429948,
            "scaleY": -0.9999999999999898,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": -1.4014958968929839e-12,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 602,
            "height": 60
          }
        },
        {
          "type": "text",
          "name": "プロ2コメント黄色",
          "text": "右サイドの快速ドリブラー",
          "w": 470,
          "raw": {
            "x": 1359,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "text": "右サイドの快速ドリブラー",
            "width": 470,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "shrink_x",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 30,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#fff100",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4
                }
              ],
              "letterSpacing": 0,
              "lineHeight": 1.2
            },
            "height": 33,
            "keyexp": "プロ2コメント黄色"
          }
        },
        {
          "type": "text",
          "name": "プロ2コメント",
          "text": "右サイドの快速ドリブラー",
          "w": 470,
          "raw": {
            "x": 1359,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "text": "右サイドの快速ドリブラー",
            "width": 470,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "shrink_x",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 30,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4
                }
              ],
              "letterSpacing": 0,
              "lineHeight": 1.2
            },
            "height": 33,
            "keyexp": "プロ2コメント"
          }
        },
        {
          "type": "group",
          "name": "TOTALゴール",
          "raw": {
            "x": 1614,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": false,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          },
          "children": [
            {
              "type": "text",
              "name": "Total数値",
              "text": "8",
              "w": 38,
              "raw": {
                "x": -17,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "8",
                "width": 38,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 32,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 33,
                "keyexp": "Total数値"
              }
            },
            {
              "type": "text",
              "name": "ゴール(文字)",
              "text": "ゴール",
              "w": 96,
              "raw": {
                "x": 25,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "ゴール",
                "width": 96,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 33,
                "keyexp": "ゴール(文字)"
              }
            },
            {
              "type": "text",
              "name": "今大会通算(文字)",
              "text": "今大会通算",
              "w": 197,
              "raw": {
                "x": -178,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "今大会通算",
                "width": 197,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 33,
                "keyexp": "今大会通算(文字)"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "TODAYゴール",
          "raw": {
            "x": 1477,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": false,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          },
          "children": [
            {
              "type": "text",
              "name": "Today's(文字)",
              "text": "Today's Goal ",
              "w": 197,
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "Today's Goal ",
                "width": 197,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 33,
                "keyexp": "Today's(文字)"
              }
            },
            {
              "type": "text",
              "name": "Today's数値",
              "text": "４",
              "w": 38,
              "raw": {
                "x": 178,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "４",
                "width": 38,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 33,
                "keyexp": "Today's数値"
              }
            }
          ]
        },
        {
          "type": "text",
          "name": "背番号",
          "text": "13",
          "w": 47,
          "raw": {
            "x": 1456,
            "y": 939,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "text": "13",
            "width": 47,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "none",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 33,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": false,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4
                },
                {
                  "fillEnabled": false,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "enabled": true,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 0,
                  "shadowOffsetY": 0
                }
              ],
              "letterSpacing": 0,
              "lineHeight": 1.2
            },
            "height": 65,
            "keyexp": "背番号"
          }
        },
        {
          "type": "text",
          "name": "ポジション",
          "text": "FW",
          "w": 60,
          "raw": {
            "x": 1381,
            "y": 944,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "text": "FW",
            "width": 60,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "none",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 36,
              "fontWeight": 400,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#000000",
                  "strokeEnabled": false,
                  "color": "#ececec",
                  "thickness": 2,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4
                }
              ],
              "letterSpacing": 0,
              "lineHeight": 1.2
            },
            "height": 49,
            "keyexp": "ポジション"
          }
        },
        {
          "type": "text",
          "name": "氏名",
          "text": "月舘汰壱アブーバクル",
          "w": 260,
          "raw": {
            "x": 1524,
            "y": 950,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "text": "月舘汰壱アブーバクル",
            "width": 260,
            "padding": 0,
            "align": "left",
            "verticalAlign": "middle",
            "fitMode": "shrink_x",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#000000",
                  "strokeEnabled": false,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4
                }
              ],
              "lineHeight": 1.2,
              "letterSpacing": 0
            },
            "height": 42,
            "keyexp": "氏名"
          }
        },
        {
          "type": "group",
          "name": "上段コメント情報",
          "raw": {
            "x": 1322,
            "y": 900,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          },
          "children": [
            {
              "type": "text",
              "name": "所属",
              "text": "札幌大谷",
              "w": 165,
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "札幌大谷",
                "width": 165,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 32,
                "keyexp": "所属"
              }
            },
            {
              "type": "text",
              "name": "学年",
              "text": "3",
              "w": 37,
              "raw": {
                "x": 184,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "3",
                "width": 37,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 33,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 42,
                "keyexp": "学年"
              }
            },
            {
              "type": "text",
              "name": "年(単位)",
              "text": "年",
              "w": 33,
              "raw": {
                "x": 216,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "年",
                "width": 33,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 29,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 42,
                "keyexp": ""
              }
            },
            {
              "type": "text",
              "name": "cm(単位)",
              "text": "cm",
              "w": 44,
              "raw": {
                "x": 320,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "cm",
                "width": 44,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 42,
                "keyexp": ""
              }
            },
            {
              "type": "text",
              "name": "身長",
              "text": "169",
              "w": 61,
              "raw": {
                "x": 263,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "169",
                "width": 61,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 33,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 42,
                "keyexp": "身長"
              }
            },
            {
              "type": "text",
              "name": "kg(単位)",
              "text": "kg",
              "w": 37,
              "raw": {
                "x": 423,
                "y": -6,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "kg",
                "width": 37,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 28,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 48,
                "keyexp": ""
              }
            },
            {
              "type": "text",
              "name": "体重",
              "text": "69",
              "w": 43,
              "raw": {
                "x": 381,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "69",
                "width": 43,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 33,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4
                    }
                  ],
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 42,
                "keyexp": "体重"
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "蹴り上げマーク",
          "src": "../../1Shotカード/img/HD2D_S00_MarkHighSchool.png",
          "raw": {
            "x": 1304,
            "y": 939,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 84,
            "height": 57
          }
        },
        {
          "type": "image",
          "name": "顔写真",
          "src": "../../1Shotカード/img/17 小林　龍之介抜き.png",
          "raw": {
            "x": 1097.3127164191292,
            "y": 810.1972035133927,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 205,
            "height": 240,
            "keyexp": "顔写真"
          }
        },
        {
          "type": "image",
          "name": "カード",
          "src": "../../1Shotカード/img/Yellow2_15.png",
          "raw": {
            "x": 1084,
            "y": 903.9332236160225,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 230,
            "height": 150,
            "keyexp": "カード"
          }
        },
        {
          "type": "image",
          "name": "参照_Yellow1_15",
          "src": "../../1Shotカード/img/Yellow1_15.png",
          "w": 10,
          "h": 10,
          "visible": false
        },
        {
          "type": "image",
          "name": "参照_Yellow2_15",
          "src": "../../1Shotカード/img/Yellow2_15.png",
          "w": 10,
          "h": 10,
          "visible": false
        },
        {
          "type": "image",
          "name": "参照_Red_15",
          "src": "../../1Shotカード/img/Red_15.png",
          "w": 10,
          "h": 10,
          "visible": false
        }
      ]
    }
  ]
};
