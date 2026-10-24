// Pulled from telop "1Shot" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/1Shot.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "1Shot",
      "raw": {
        "x": 0,
        "y": 0,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "pivotX": 0,
        "pivotY": 0,
        "opacity": 1,
        "visible": true,
        "locked": false,
        "blendMode": "normal",
        "effects": [],
        "customJs": "// 1. Data Loading (Auto-generated)\nlet projectData = null;\nlet assetCache = {};\n\n// 2. Controller Logic (Customized for 1Shot)\nwindow._pendingRenderableObject = null;\nwindow._pendingShow = false;\nwindow._current1ShotData = null;\n\nfunction showNode(node) {\n    if (!node) return;\n    node.removeAttribute(\"display\");\n    node.removeAttribute(\"visibility\");\n    node.style.removeProperty(\"display\");\n    node.style.removeProperty(\"visibility\");\n    node.style.removeProperty(\"opacity\");\n    node.classList.remove(\"is-invisible\");\n\n    if (node.querySelectorAll) {\n        const hiddenChildren = node.querySelectorAll('[visibility=\"hidden\"], [display=\"none\"], .is-invisible, image');\n        hiddenChildren.forEach(child => {\n            child.removeAttribute(\"visibility\");\n            child.removeAttribute(\"display\");\n            child.style.removeProperty(\"visibility\");\n            child.style.removeProperty(\"display\");\n            child.style.removeProperty(\"opacity\");\n            child.classList.remove(\"is-invisible\");\n        });\n    }\n}\n\nfunction hideNode(node) {\n    if (!node) return;\n    node.setAttribute(\"display\", \"none\");\n    node.style.setProperty(\"display\", \"none\", \"important\");\n}\n\nfunction resolvePhotoUrl(rawSrc) {\n    if (!rawSrc) return '';\n    let src = String(rawSrc).trim();\n    try {\n        src = decodeURI(src);\n    } catch (e) {}\n    return encodeURI(src);\n}\n\nfunction setNodeImage(imgEl, rawSrc, payload) {\n    if (!imgEl || !rawSrc) return;\n    const clean = String(rawSrc).trim();\n    if (!clean) return;\n\n    const school = (payload && (payload['所属'] || payload.school)) ? String(payload['所属'] || payload.school).trim() : '';\n\n    // パス候補のリストアップ\n    const candidates = [];\n\n    // 1. /Photo/ または Photo/ で始まる場合\n    if (clean.startsWith('/Photo/') || clean.startsWith('Photo/')) {\n        const norm = clean.startsWith('/') ? clean : '/' + clean;\n        candidates.push('..' + norm); // ../Photo/... (1Shot.htmlから見た相対パス、最優先)\n        candidates.push(norm);        // /Photo/... (Webルート)\n    } else if (clean.includes('/')) {\n        candidates.push(clean);\n        if (!clean.startsWith('/')) candidates.push('../' + clean);\n    } else {\n        // ファイル名のみの場合 (例: \"14 菅野桜抜き.png\")\n        if (school) {\n            candidates.push(`../Photo/${school}/${clean}`);\n            candidates.push(`/Photo/${school}/${clean}`);\n        }\n        candidates.push(`../Photo/${clean}`);\n        candidates.push(`/Photo/${clean}`);\n        candidates.push(`img/${clean}`);\n        candidates.push(clean);\n    }\n\n    // URIエンコード済みの候補リスト (重複除外)\n    const encodedCandidates = candidates.map(c => resolvePhotoUrl(c)).filter((v, i, a) => a.indexOf(v) === i);\n\n    // キャッシュまたは最優先候補を即座にセット\n    const cached = window.assetCache && encodedCandidates.find(c => window.assetCache[c]);\n    const initialUrl = (cached && window.assetCache[cached]) || encodedCandidates[0] || resolvePhotoUrl(clean);\n\n    imgEl.setAttribute('href', initialUrl);\n    imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', initialUrl);\n    if (!imgEl.getAttribute('width')) imgEl.setAttribute('width', '205');\n    if (!imgEl.getAttribute('height')) imgEl.setAttribute('height', '240');\n    imgEl.setAttribute('preserveAspectRatio', 'none');\n\n    // 複数候補を並行プリロードして、最初にロード成功した有効URLを適用\n    let resolved = false;\n    encodedCandidates.forEach(url => {\n        const tester = new Image();\n        tester.onload = function () {\n            if (!resolved) {\n                resolved = true;\n                imgEl.setAttribute('href', url);\n                imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);\n            }\n        };\n        tester.src = url;\n    });\n}\n\nfunction setTextToNode(nodeEl, textStr) {\n    if (!nodeEl || textStr === undefined || textStr === null) return;\n    const str = String(textStr);\n    // SVG テキストノード内のすべての text 要素（shadow, stroke, fill）を一括更新\n    const allTexts = nodeEl.querySelectorAll ? nodeEl.querySelectorAll('text') : [];\n    if (allTexts.length > 0) {\n        allTexts.forEach(tEl => {\n            const tspans = tEl.querySelectorAll('tspan');\n            if (tspans.length > 0) {\n                tspans.forEach((ts, idx) => {\n                    if (idx === 0) ts.textContent = str;\n                    else ts.textContent = '';\n                });\n            } else {\n                tEl.textContent = str;\n            }\n        });\n    } else {\n        const tspans = nodeEl.querySelectorAll ? nodeEl.querySelectorAll('tspan') : [];\n        if (tspans.length > 0) {\n            tspans.forEach((ts, idx) => {\n                if (idx === 0) ts.textContent = str;\n                else ts.textContent = '';\n            });\n        } else {\n            nodeEl.textContent = str;\n        }\n    }\n}\n\nfunction resolveCommentTexts(data) {\n    if (!data) return { isYellow: false, yellowText: '', whiteText: '', isPro2Mode: true };\n\n    const mode = data.mode || (data.todayGoalSelected ? 'today' : (data.totalGoalSelected ? 'total' : 'pro2'));\n    const isPro2Mode = mode === 'pro2' && !data.todayGoalSelected && !data.totalGoalSelected;\n\n    // 全角・半角キーの取得\n    const valYellow = data['プロ2コメント黄色'] !== undefined ? data['プロ2コメント黄色'] : data['プロ２コメント黄色'];\n    const valWhite = data['プロ2コメント'] !== undefined ? data['プロ2コメント'] : data['プロ２コメント'];\n\n    const strYellow = (valYellow !== undefined && valYellow !== null) ? String(valYellow).trim() : '';\n    const strWhite = (valWhite !== undefined && valWhite !== null) ? String(valWhite).trim() : '';\n\n    // 黄色フラグON判定:\n    // 1. isYellow, useYellowText, pro2IsYellow, yellowFlag, 黄色フラグ のいずれかが明示的に true\n    // 2. または「プロ２コメント黄色」「プロ2コメント黄色」に空でない文字列が入っている場合\n    const explicitYellow = data.isYellow === true || data.isYellow === 'true' ||\n                           data.useYellowText === true || data.useYellowText === 'true' ||\n                           data.pro2IsYellow === true || data.pro2IsYellow === 'true' ||\n                           data.yellowFlag === true || data.yellowFlag === 'true' ||\n                           data['黄色フラグ'] === true || data['黄色フラグ'] === 'true' || data['黄色フラグ'] === 'ON';\n\n    const hasYellowText = strYellow !== '';\n    const isYellow = explicitYellow || hasYellowText;\n\n    let yellowText = '';\n    let whiteText = '';\n\n    if (isPro2Mode) {\n        if (isYellow) {\n            // 黄色フラグON: 「プロ２コメント黄色」の値を使用（もし空なら白側から引き継ぐ）\n            yellowText = (valYellow !== undefined && valYellow !== null && String(valYellow) !== '')\n                ? String(valYellow)\n                : ((valWhite !== undefined && valWhite !== null) ? String(valWhite) : '');\n            whiteText = '';\n        } else {\n            // 黄色フラグOFF: 「プロ２コメント」の値を使用（もし空なら黄色側から引き継ぐ）\n            whiteText = (valWhite !== undefined && valWhite !== null && String(valWhite) !== '')\n                ? String(valWhite)\n                : ((valYellow !== undefined && valYellow !== null) ? String(valYellow) : '');\n            yellowText = '';\n        }\n    }\n\n    return {\n        isYellow,\n        yellowText,\n        whiteText,\n        isPro2Mode\n    };\n}\n\nfunction apply1ShotCustom(rendarableObject) {\n    const app = window.telopApp;\n    if (!app || !rendarableObject) return;\n\n    // 1. 顔写真の制御 (keyExp: 顔写真 / ID: n1_gjjlfmor48gv)\n    const keyExpTargets = window.keyExpMap ? window.keyExpMap.get('顔写真') : null;\n    const targetEl = keyExpTargets && keyExpTargets[0] ? keyExpTargets[0].element : null;\n    const faceEl = app.querySelector('[data-node-id=\"n1_gjjlfmor48gv\"]') || targetEl;\n    if (faceEl) {\n        const photoSrc = rendarableObject['顔写真'] || rendarableObject.photo;\n        const isPhotoVisible = rendarableObject['顔写真_visible'] !== false &&\n                               rendarableObject.showPhoto !== false &&\n                               photoSrc && String(photoSrc).trim() !== '';\n        \n        if (isPhotoVisible) {\n            showNode(faceEl);\n            const img = faceEl.querySelector('image');\n            if (img) {\n                showNode(img);\n                setNodeImage(img, photoSrc, rendarableObject);\n            }\n        } else {\n            hideNode(faceEl);\n        }\n    }\n\n    // 2. モード制御: 'pro2' | 'today' | 'total' (デフォルト: 'pro2')\n    const pro2Yellow = app.querySelector('[data-node-id=\"n1_6h3z6328z8je\"]'); // プロ2コメント黄色\n    const pro2White = app.querySelector('[data-node-id=\"n1_cwkjx9kkwdwl\"]');  // プロ2コメント (白)\n    const totalGoalEl = app.querySelector('[data-node-id=\"n1_0a2qvfdqvk2t\"]'); // TOTALゴール\n    const todayGoalEl = app.querySelector('[data-node-id=\"n1_4ptynqs7dzse\"]'); // TODAYゴール\n\n    const { isYellow, yellowText, whiteText, isPro2Mode } = resolveCommentTexts(rendarableObject);\n    const mode = rendarableObject.mode || (rendarableObject.todayGoalSelected ? 'today' : (rendarableObject.totalGoalSelected ? 'total' : 'pro2'));\n\n    if (mode === 'today') {\n        hideNode(pro2Yellow);\n        setTextToNode(pro2Yellow, '');\n        hideNode(pro2White);\n        setTextToNode(pro2White, '');\n        hideNode(totalGoalEl);\n        showNode(todayGoalEl);\n    } else if (mode === 'total') {\n        hideNode(pro2Yellow);\n        setTextToNode(pro2Yellow, '');\n        hideNode(pro2White);\n        setTextToNode(pro2White, '');\n        hideNode(todayGoalEl);\n        showNode(totalGoalEl);\n    } else {\n        // pro2 モード\n        hideNode(todayGoalEl);\n        hideNode(totalGoalEl);\n\n        if (isYellow) {\n            // 黄色文字フラグON: プロ2コメント黄色を表示、プロ2コメント（白）を非表示＆テキストクリア\n            showNode(pro2Yellow);\n            setTextToNode(pro2Yellow, yellowText);\n            hideNode(pro2White);\n            setTextToNode(pro2White, '');\n        } else {\n            // 黄色文字フラグOFF: プロ2コメント（白）を表示、プロ2コメント黄色を非表示＆テキストクリア\n            showNode(pro2White);\n            setTextToNode(pro2White, whiteText);\n            hideNode(pro2Yellow);\n            setTextToNode(pro2Yellow, '');\n        }\n    }\n}\n\n/**\n * テロップを表示する関数\n */\nwindow.showTelop = function (rendarableObject) {\n    if (rendarableObject !== undefined) {\n        window.updateTelop(rendarableObject);\n    }\n\n    if (!window.initialized) {\n        window._pendingShow = true;\n        return;\n    }\n\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        if (!divElement.classList.contains(\"in_animation\")) {\n            divElement.classList.remove(...divElement.classList);\n            divElement.style.opacity = \"0\";\n            \n            const triggerShow = () => {\n                requestAnimationFrame(() => {\n                    requestAnimationFrame(() => {\n                        divElement.style.opacity = \"\";\n                        divElement.classList.add(\"in_animation\");\n                        document.body.style.display = \"block\";\n                        if (window._current1ShotData) {\n                            apply1ShotCustom(window._current1ShotData);\n                        }\n                    });\n                });\n            };\n\n            if (document.fonts && document.fonts.ready) {\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\n            } else {\n                triggerShow();\n            }\n        }\n    }\n};\n\n/**\n * テロップの内容を更新する関数\n */\nwindow.updateTelop = function (rendarableObject) {\n    if (!rendarableObject) return;\n\n    // 全角・半角の相互同期補完\n    const normalizedData = Object.assign({}, rendarableObject);\n    if (normalizedData['プロ２コメント黄色'] !== undefined && normalizedData['プロ2コメント黄色'] === undefined) {\n        normalizedData['プロ2コメント黄色'] = normalizedData['プロ２コメント黄色'];\n    }\n    if (normalizedData['プロ2コメント黄色'] !== undefined && normalizedData['プロ２コメント黄色'] === undefined) {\n        normalizedData['プロ２コメント黄色'] = normalizedData['プロ2コメント黄色'];\n    }\n    if (normalizedData['プロ２コメント'] !== undefined && normalizedData['プロ2コメント'] === undefined) {\n        normalizedData['プロ2コメント'] = normalizedData['プロ２コメント'];\n    }\n    if (normalizedData['プロ2コメント'] !== undefined && normalizedData['プロ２コメント'] === undefined) {\n        normalizedData['プロ２コメント'] = normalizedData['プロ2コメント'];\n    }\n\n    const { isYellow, yellowText, whiteText, isPro2Mode } = resolveCommentTexts(normalizedData);\n    normalizedData.isYellow = isYellow;\n    if (isPro2Mode) {\n        normalizedData['プロ2コメント黄色'] = yellowText;\n        normalizedData['プロ２コメント黄色'] = yellowText;\n        normalizedData['プロ2コメント'] = whiteText;\n        normalizedData['プロ２コメント'] = whiteText;\n    }\n\n    window._current1ShotData = Object.assign({}, window._current1ShotData, normalizedData);\n\n    const app = window.telopApp;\n    const doc = window.telopDoc;\n    const keyExpMap = window.keyExpMap;\n    const createNode = window.createNode;\n\n    if (!app || !doc || !keyExpMap || !createNode) {\n        window._pendingRenderableObject = normalizedData;\n        return;\n    }\n\n    let hasUpdates = false;\n\n    Object.keys(normalizedData).forEach(key => {\n        const val = normalizedData[key];\n        // 全角・半角の両方で keyExpMap をチェック\n        const altKey = key.replace(/２/g, '2').replace(/2/g, '２');\n        const targets = keyExpMap.get(key) || keyExpMap.get(altKey);\n\n        if (targets && Array.isArray(targets) && (val || val === \"\")) {\n            targets.forEach((target) => {\n                if (target.type === 'text') {\n                    const strVal = String(val);\n                    if (target.nodeData.text !== strVal) {\n                        target.nodeData.text = strVal;\n                        const nodeInDoc = doc.nodesById[target.nodeData.id];\n                        if (nodeInDoc) nodeInDoc.text = strVal;\n                        hasUpdates = true;\n                    }\n                } else if (target.type === 'image') {\n                    const node = target.nodeData;\n                    const baseAsset = (doc.assets && doc.assets[node.assetId]) ||\n                                      (projectData && projectData.assets && projectData.assets[node.assetId]) ||\n                                      { id: node.assetId, kind: 'image', src: '' };\n                    if (!doc.assets) doc.assets = {};\n                    const newSrc = String(val);\n                    if (baseAsset.src !== newSrc) {\n                        var uniqueAssetId = (node.assetId || 'asset_' + node.id).replace(/__keyexp_.*$/, '') + '__keyexp_' + key;\n                        doc.assets[uniqueAssetId] = Object.assign({}, baseAsset, { src: newSrc });\n                        node.assetId = uniqueAssetId;\n                        const nodeInDoc = doc.nodesById[node.id];\n                        if (nodeInDoc) {\n                            nodeInDoc.assetId = uniqueAssetId;\n                            if (key === '顔写真') {\n                                const isPhotoVisible = normalizedData['顔写真_visible'] !== false &&\n                                                       normalizedData.showPhoto !== false &&\n                                                       newSrc && newSrc.trim() !== '';\n                                nodeInDoc.visible = isPhotoVisible;\n                            }\n                        }\n                        hasUpdates = true;\n                    }\n                } else if (target.type === 'appearance_fill') {\n                    const apps = target.nodeData.style?.appearances || [];\n                    const appStyle = apps[target.appearanceIndex];\n                    const docNode = doc.nodesById[target.nodeData.id];\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\n                    if (appStyle && (appStyle.fill !== String(val) || appStyle.gradientConfig)) {\n                        appStyle.fill = String(val);\n                        if (appStyle.gradientConfig) { delete appStyle.gradientConfig; }\n                        if (docApp) {\n                            docApp.fill = String(val);\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\n                        }\n                        hasUpdates = true;\n                    }\n                }\n            });\n        }\n    });\n\n    if (doc.nodesById) {\n        if (doc.nodesById['n1_6h3z6328z8je']) { // プロ2コメント黄色\n            doc.nodesById['n1_6h3z6328z8je'].visible = true;\n            if (doc.nodesById['n1_6h3z6328z8je'].text !== yellowText) {\n                doc.nodesById['n1_6h3z6328z8je'].text = yellowText;\n                hasUpdates = true;\n            }\n        }\n        if (doc.nodesById['n1_cwkjx9kkwdwl']) { // プロ2コメント (白)\n            doc.nodesById['n1_cwkjx9kkwdwl'].visible = true;\n            if (doc.nodesById['n1_cwkjx9kkwdwl'].text !== whiteText) {\n                doc.nodesById['n1_cwkjx9kkwdwl'].text = whiteText;\n                hasUpdates = true;\n            }\n        }\n    }\n\n    if (hasUpdates) {\n        const evaluatedDoc = resolveDynamicVisibility(doc, normalizedData);\n\n        if (evaluatedDoc.nodesById) {\n            if (evaluatedDoc.nodesById['n1_6h3z6328z8je']) {\n                evaluatedDoc.nodesById['n1_6h3z6328z8je'].visible = true;\n                evaluatedDoc.nodesById['n1_6h3z6328z8je'].text = yellowText;\n            }\n            if (evaluatedDoc.nodesById['n1_cwkjx9kkwdwl']) {\n                evaluatedDoc.nodesById['n1_cwkjx9kkwdwl'].visible = true;\n                evaluatedDoc.nodesById['n1_cwkjx9kkwdwl'].text = whiteText;\n            }\n        }\n\n        for (const nodeId in evaluatedDoc.nodesById) {\n            const prevNode = doc.nodesById[nodeId];\n            const nextNode = evaluatedDoc.nodesById[nodeId];\n            if (prevNode && nextNode && nextNode.type === 'image') {\n                if (prevNode.assetId !== nextNode.assetId) {\n                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||\n                                      (projectData.assets && projectData.assets[nextNode.assetId]);\n                    if (nextAsset && nextAsset.src) {\n                        const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\n                        const imgEl = nodeEl ? nodeEl.querySelector(\"image\") : null;\n                        if (imgEl) {\n                            setNodeImage(imgEl, nextAsset.src, normalizedData);\n                        }\n                    }\n                    prevNode.assetId = nextNode.assetId;\n                }\n            }\n        }\n\n        window.telopDoc = evaluatedDoc;\n        keyExpMap.clear();\n\n        try {\n            const oldDefs = app.firstChild;\n            if (oldDefs) oldDefs.innerHTML = '';\n\n            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);\n            if (newRootNode) {\n                if (app.childNodes.length > 1) {\n                    app.replaceChild(newRootNode, app.childNodes[1]);\n                } else {\n                    app.appendChild(newRootNode);\n                }\n\n                while (app.childNodes.length > 2) {\n                    app.removeChild(app.lastChild);\n                }\n            }\n        } catch (e) {\n            console.error(\"Error updating 1Shot node:\", e);\n        }\n\n        window.dispatchEvent(new CustomEvent('telopRendered'));\n    }\n\n    apply1ShotCustom(window._current1ShotData);\n};\n\n/**\n * テロップを非表示にする関数\n */\nwindow.hideTelop = function () {\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        divElement.classList.remove(...divElement.classList);\n\n        let finished = false;\n        const completeHide = () => {\n            if (finished) return;\n            finished = true;\n            divElement.style.opacity = '0';\n            divElement.classList.remove(\"out_animation\");\n            if (window.animationFinishedCallback) {\n                window.animationFinishedCallback();\n            }\n            divElement.removeEventListener('animationend', onAnimationEnd);\n        };\n\n        const onAnimationEnd = (e) => {\n            if (!divElement.classList.contains(\"out_animation\")) return;\n            completeHide();\n        };\n\n        divElement.addEventListener('animationend', onAnimationEnd);\n        divElement.classList.add(\"out_animation\");\n\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\n        setTimeout(() => {\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\n                completeHide();\n            }\n        }, timeoutMs);\n    }\n};\n\n// 3. Initialization\nwindow.addEventListener('load', async () => {\n    try {\n        if (document.fonts && document.fonts.ready) {\n            await document.fonts.ready;\n        }\n        const dataUrl = './1Shot.telop';\n        const dataResp = await fetch(dataUrl);\n        if (dataResp.ok) {\n            projectData = await dataResp.json();\n        }\n        assetCache = {};\n        if (window.initPlayer) {\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\n                window.initialized = true;\n                if (window._pendingRenderableObject) {\n                    window.updateTelop(window._pendingRenderableObject);\n                    window._pendingRenderableObject = null;\n                } else if (window._current1ShotData) {\n                    apply1ShotCustom(window._current1ShotData);\n                } else {\n                    apply1ShotCustom({ mode: 'pro2' });\n                }\n                if (window._pendingShow) {\n                    window.showTelop();\n                    window._pendingShow = false;\n                }\n            });\n        }\n    } catch (e) {\n        console.error(\"[Player] Failed to initialize 1Shot:\", e);\n    }\n});\n"
      },
      "children": [
        {
          "type": "image",
          "name": "1SHOT用ザブトン",
          "src": "../../1Shot/img/HD2D_S01_Base1.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1286,
            "y": 929,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 602,
            "height": 150,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "group",
          "name": "チームカラー変更",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1336,
            "y": 957,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
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
                "skewX": -14.524950658846302,
                "skewY": 0,
                "x": 162,
                "y": -19,
                "rotation": 0,
                "scaleX": 1.4321911399652143,
                "scaleY": 1.1749999999999878,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              },
              "children": [
                {
                  "type": "rect",
                  "name": "ベースカラー",
                  "w": 40,
                  "h": 54,
                  "raw": {
                    "skewX": 5,
                    "skewY": -2,
                    "x": -28,
                    "y": -2,
                    "rotation": 1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "opacity": 1,
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
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "domId": "TeamColor"
                  }
                },
                {
                  "type": "rect",
                  "name": "グラデーションマット",
                  "w": 40,
                  "h": 54,
                  "raw": {
                    "skewX": 5,
                    "skewY": -2,
                    "x": -28,
                    "y": -2,
                    "rotation": 1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "opacity": 1,
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
                    },
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": []
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
                "skewX": 0,
                "skewY": 0,
                "x": 149,
                "y": 22,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 66,
                "height": 24,
                "text": "#bd39fb",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": "TeamColor"
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "左側上板",
          "src": "../../1Shot/img/HD2D_S01_ZabuTeam.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1286,
            "y": 887,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 602,
            "height": 60,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "反転した上板",
          "src": "../../1Shot/img/HD2D_S01_ZabuTeam.png",
          "raw": {
            "skewX": -1.4014958968929839e-12,
            "skewY": 0,
            "x": 1888,
            "y": 886,
            "rotation": -180,
            "scaleX": 0.8454901534429948,
            "scaleY": -0.9999999999999898,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 602,
            "height": 60,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "text",
          "name": "プロ2コメント黄色",
          "text": "右サイドの快速ドリブラー",
          "w": 470,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1359,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 470,
            "height": 33,
            "text": "右サイドの快速ドリブラー",
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
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "fitMode": "shrink_x",
            "keyexp": "プロ2コメント黄色",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "mode",
              "operator": "equals",
              "value": "pro2"
            }
          }
        },
        {
          "type": "text",
          "name": "プロ2コメント",
          "text": "右サイドの快速ドリブラー",
          "w": 470,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1359,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 470,
            "height": 33,
            "text": "右サイドの快速ドリブラー",
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
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "fitMode": "shrink_x",
            "keyexp": "プロ2コメント",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "mode",
              "operator": "equals",
              "value": "pro2"
            }
          }
        },
        {
          "type": "group",
          "name": "TOTALゴール",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1614,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "TOTALゴールグループ",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "mode",
              "operator": "equals",
              "value": "total"
            }
          },
          "children": [
            {
              "type": "text",
              "name": "Total数値",
              "text": "8",
              "w": 38,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -17,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 38,
                "height": 33,
                "text": "8",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": "Total数値"
              }
            },
            {
              "type": "text",
              "name": "ゴール(文字)",
              "text": "ゴール",
              "w": 96,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 25,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 96,
                "height": 33,
                "text": "ゴール",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_x",
                "keyexp": "ゴール(文字)"
              }
            },
            {
              "type": "text",
              "name": "今大会通算(文字)",
              "text": "今大会通算",
              "w": 197,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -178,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 197,
                "height": 33,
                "text": "今大会通算",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_x",
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
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "TODAYゴールグループ",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "mode",
              "operator": "equals",
              "value": "today"
            }
          },
          "children": [
            {
              "type": "text",
              "name": "Today's(文字)",
              "text": "Today's Goal ",
              "w": 197,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 197,
                "height": 33,
                "text": "Today's Goal ",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_x",
                "keyexp": "Today's(文字)"
              }
            },
            {
              "type": "text",
              "name": "Today's数値",
              "text": "４",
              "w": 38,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 178,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 38,
                "height": 33,
                "text": "４",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
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
            "skewX": 0,
            "skewY": 0,
            "x": 1456,
            "y": 939,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 47,
            "height": 65,
            "text": "13",
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
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "fitMode": "none",
            "keyexp": "背番号"
          }
        },
        {
          "type": "text",
          "name": "ポジション",
          "text": "FW",
          "w": 60,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1381,
            "y": 944,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 60,
            "height": 49,
            "text": "FW",
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
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "fitMode": "none",
            "keyexp": "ポジション"
          }
        },
        {
          "type": "text",
          "name": "氏名",
          "text": "月舘汰壱アブーバクル",
          "w": 260,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1524,
            "y": 950,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 260,
            "height": 42,
            "text": "月舘汰壱アブーバクル",
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
            "align": "left",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "fitMode": "shrink_x",
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
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 165,
                "height": 32,
                "text": "札幌大谷",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_x",
                "keyexp": "所属"
              }
            },
            {
              "type": "text",
              "name": "学年",
              "text": "3",
              "w": 37,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 184,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 37,
                "height": 42,
                "text": "3",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": "学年"
              }
            },
            {
              "type": "text",
              "name": "年(単位)",
              "text": "年",
              "w": 33,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 216,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 33,
                "height": 42,
                "text": "年",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": ""
              }
            },
            {
              "type": "text",
              "name": "cm(単位)",
              "text": "cm",
              "w": 44,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 320,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 44,
                "height": 42,
                "text": "cm",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": ""
              }
            },
            {
              "type": "text",
              "name": "身長",
              "text": "169",
              "w": 61,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 263,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 61,
                "height": 42,
                "text": "169",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": "身長"
              }
            },
            {
              "type": "text",
              "name": "kg(単位)",
              "text": "kg",
              "w": 37,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 423,
                "y": -6,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 37,
                "height": 48,
                "text": "kg",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": ""
              }
            },
            {
              "type": "text",
              "name": "体重",
              "text": "69",
              "w": 43,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 381,
                "y": -3,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 43,
                "height": 42,
                "text": "69",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "none",
                "keyexp": "体重"
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "蹴り上げマーク",
          "src": "../../1Shot/img/HD2D_S00_MarkHighSchool.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1304,
            "y": 939,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 84,
            "height": 57,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "顔写真",
          "src": "../../1Shot/img/17 小林　龍之介抜き.png",
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
            "width": 205,
            "height": 240,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "顔写真",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "顔写真",
              "operator": "not_empty"
            }
          }
        },
        {
          "type": "text",
          "name": "mode",
          "key": "mode",
          "text": "pro2",
          "w": 60,
          "visible": false
        }
      ]
    }
  ]
};
