// Pulled from telop "フォーメーション左" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/フォーメーション左.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "フォーメーション左",
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
        "customJs": "\r\n// 1. Data Loading (Auto-generated)\r\nlet projectData = null;\r\nlet assetCache = {};\r\n\r\n// 2. Controller Logic (Editable)\r\n\r\n/**\r\n * PSn_X / PSn_Y (プレート画像の左上, 1920x1080 座標) を受け取ったら、グループ \"PSn\" をその位置へ動かす。\r\n * ダッシュボードの Lineups タブ「陣形フォーメーション」で調整した配置を反映するためのもの。\r\n */\r\nfunction applyPlatePositions(values, docs) {\r\n    Object.keys(values).forEach(key => {\r\n        const m = /^(PS\\d+)_X$/.exec(key);\r\n        if (!m) return;\r\n        const x = parseFloat(values[key]);\r\n        const y = parseFloat(values[m[1] + '_Y']);\r\n        if (!isFinite(x) || !isFinite(y)) return;\r\n        docs.forEach(d => {\r\n            if (!d || !d.nodesById) return;\r\n            const group = Object.values(d.nodesById).find(n => n.type === 'group' && n.name === m[1]);\r\n            if (!group) return;\r\n            const plate = (group.children || []).map(id => d.nodesById[id]).find(n => n && n.type === 'image');\r\n            group.x = x - (plate ? plate.x || 0 : 0);\r\n            group.y = y - (plate ? plate.y || 0 : 0);\r\n        });\r\n    });\r\n}\r\n\r\n\r\n/**\r\n * TelopHub の OnAir / Preview は updateTelop を独自実装に差し替えるため、上の updateTelop は呼ばれない。\r\n * 差し替え後も更新のたびに 'telopRendered'（detail = 受け取ったデータ）が届くので、ここで PSn グループを\r\n * 指定位置へ動かし、位置が変わったグループだけ DOM を作り直す。\r\n */\r\nwindow.addEventListener('telopRendered', (e) => {\r\n    const values = e && e.detail;\r\n    const doc = window.telopDoc;\r\n    const app = window.telopApp;\r\n    if (!values || !doc || !doc.nodesById || !app || !window.createNode) return;\r\n    const before = {};\r\n    Object.values(doc.nodesById).forEach(n => {\r\n        if (n.type === 'group' && /^PS[0-9]+$/.test(n.name)) before[n.id] = n.x + ',' + n.y;\r\n    });\r\n    applyPlatePositions(values, [doc]);\r\n    Object.keys(before).forEach(id => {\r\n        const node = doc.nodesById[id];\r\n        if (before[id] === node.x + ',' + node.y) return;\r\n        const map = window.nodeElementMap;\r\n        const oldEl = (map && map.get(id) && map.get(id).isConnected) ? map.get(id) : app.querySelector('[data-node-id=\"' + id + '\"]');\r\n        if (!oldEl || !oldEl.parentNode) return;\r\n        try {\r\n            const parent = node.parentId ? doc.nodesById[node.parentId] : null;\r\n            const newEl = window.createNode(id, undefined, !!parent && parent.type === 'telop');\r\n            if (!newEl) return;\r\n            oldEl.parentNode.replaceChild(newEl, oldEl);\r\n            if (map) map.set(id, newEl);\r\n        } catch (err) {\r\n            console.warn('[PlatePositions] re-create failed for ' + node.name, err);\r\n        }\r\n    });\r\n    // 作り直した要素の古い keyExp 登録を外す（次の UPDATE で外れた要素を書き換えないように）\r\n    if (window.keyExpMap) {\r\n        window.keyExpMap.forEach((targets, key) => {\r\n            const live = targets.filter(t => !t.element || t.element.isConnected);\r\n            if (live.length !== targets.length) window.keyExpMap.set(key, live);\r\n        });\r\n    }\r\n});\r\n// --- External Control API ---\r\nwindow._pendingRenderableObject = null;\r\nwindow._pendingShow = false;\r\n\r\n/*\r\n * TAKE（showTelop）のたびに、0.5 秒でプッシュイン＋フェードインする\r\n * （左から PUSH.distance px ずれた位置・透明の状態から、元の位置・不透明へ）。\r\n * TelopHub の送出ページはこのページを content-visibility: hidden の入れ物に入れ、updateTelop を差し替えて\r\n * showTelop() をデータなしで呼ぶことがある。requestAnimationFrame を待たず、showTelop の中で Web Animations を予約する。\r\n */\r\nconst PUSH = { direction: 'ltr', duration: 500, easing: 'ease-out', distance: 120 };\r\nlet pushAnimation = null;\r\nfunction startPushFadeIn() {\r\n    const box = document.getElementById(window.containerId || 'player-container');\r\n    if (!box || !box.animate) return;\r\n    stopPush();\r\n    const dx = PUSH.direction === 'ltr' ? -PUSH.distance : PUSH.distance;\r\n    pushAnimation = box.animate(\r\n        [{ transform: `translateX(${dx}px)`, opacity: 0 },\r\n         { transform: 'translateX(0px)', opacity: 1 }],\r\n        { duration: PUSH.duration, easing: PUSH.easing, fill: 'backwards' }\r\n    );\r\n    pushAnimation.onfinish = () => { pushAnimation = null; };\r\n}\r\nfunction stopPush() {\r\n    if (pushAnimation) {\r\n        pushAnimation.onfinish = null;\r\n        pushAnimation.cancel();\r\n        pushAnimation = null;\r\n    }\r\n}\r\n\r\n/**\r\n * テロップを表示する関数\r\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\r\n */\r\nwindow.showTelop = function (rendarableObject) {\r\n    if (rendarableObject !== undefined) {\r\n        window.updateTelop(rendarableObject);\r\n    }\r\n\r\n    if (!window.initialized) {\r\n        window._pendingShow = true;\r\n        return;\r\n    }\r\n\r\n    // containerId is exposed by initPlayer\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        if (!divElement.classList.contains(\"in_animation\")) {\r\n            divElement.classList.remove(...divElement.classList);\r\n            divElement.style.opacity = \"0\";\r\n            \r\n            const triggerShow = () => {\r\n                requestAnimationFrame(() => {\r\n                    requestAnimationFrame(() => {\r\n                        divElement.style.opacity = \"\";\r\n                        divElement.classList.add(\"in_animation\");\r\n                        document.body.style.display = \"block\";\r\n                    });\r\n                });\r\n            };\r\n\r\n            if (document.fonts && document.fonts.ready) {\r\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\r\n            } else {\r\n                triggerShow();\r\n            }\r\n        }\r\n    }\r\n\r\n    startPushFadeIn();\r\n};\r\n\r\n/**\r\n * テロップの内容を更新する関数\r\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\r\n */\r\nwindow.updateTelop = function (rendarableObject) {\r\n    console.log(\"updateTelop called\", rendarableObject);\r\n    if (!rendarableObject) return;\r\n\r\n    // Globals exposed by renderer.js\r\n    const app = window.telopApp;\r\n    const doc = window.telopDoc;\r\n    const keyExpMap = window.keyExpMap;\r\n    const createNode = window.createNode;\r\n\r\n    if (!app || !doc || !keyExpMap || !createNode) {\r\n        console.error(\"updateTelop early return: Missing required globals:\", { app: !!app, doc: !!doc, keyExpMap: !!keyExpMap, createNode: !!createNode });\r\n        console.warn(\"Player not fully initialized yet. Caching update...\");\r\n        window._pendingRenderableObject = rendarableObject;\r\n        return;\r\n    }\r\n\r\n    let hasUpdates = false;\r\n\r\n    Object.keys(rendarableObject).forEach(key => {\r\n        const val = rendarableObject[key];\r\n        const targets = keyExpMap.get(key);\r\n        console.log(\"Processing key: \" + key + \", targets found: \" + (targets ? targets.length : 0) + \", val: \" + val);\r\n\r\n        if (targets && Array.isArray(targets) && (val || val === \"\")) {\r\n            targets.forEach((target) => {\r\n                if (target.type === 'text') {\r\n                    // Update Doc\r\n                    const strVal = String(val);\r\n                    if (target.nodeData.text !== strVal) {\r\n                        target.nodeData.text = strVal;\r\n                        const nodeInDoc = doc.nodesById[target.nodeData.id];\r\n                        if (nodeInDoc) {\r\n                            nodeInDoc.text = strVal;\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'image') {\r\n                    // Update Doc (Asset)\r\n                    const node = target.nodeData;\r\n                    if (node.assetId && doc.assets[node.assetId]) {\r\n                        if (doc.assets[node.assetId].src !== String(val)) {\r\n                            // Clone asset to avoid clobbering shared assetId entries\r\n                            var uniqueAssetId = node.assetId + '__keyexp_' + key;\r\n                            doc.assets[uniqueAssetId] = Object.assign({}, doc.assets[node.assetId], { src: String(val) });\r\n                            node.assetId = uniqueAssetId;\r\n                            \r\n                            // Also mutate the node inside the active document to persist the change\r\n                            const nodeInDoc = doc.nodesById[node.id];\r\n                            if (nodeInDoc) {\r\n                                nodeInDoc.assetId = uniqueAssetId;\r\n                            }\r\n                            \r\n                            hasUpdates = true;\r\n                        }\r\n                    }\r\n                } else if (target.type === 'appearance_fill') {\r\n                    const apps = target.nodeData.style?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\r\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\r\n                        console.log(\"Updating appearance_fill for \" + target.nodeData.id + \" to \" + val);\r\n                        app.fill = String(val);\r\n                        if (app.gradientConfig) { delete app.gradientConfig; }\r\n                        if (docApp) {\r\n                            docApp.fill = String(val);\r\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'appearance_stroke') {\r\n                    const apps = target.nodeData.style?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\r\n                    if (app && app.color !== String(val)) {\r\n                        console.log(\"Updating appearance_stroke for \" + target.nodeData.id + \" to \" + val);\r\n                        app.color = String(val);\r\n                        if (docApp) {\r\n                            docApp.color = String(val);\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'bg_appearance_fill') {\r\n                    const apps = target.nodeData.background?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\r\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\r\n                        console.log(\"Updating bg_appearance_fill for \" + target.nodeData.id + \" to \" + val);\r\n                        app.fill = String(val);\r\n                        if (app.gradientConfig) { delete app.gradientConfig; }\r\n                        if (docApp) {\r\n                            docApp.fill = String(val);\r\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'bg_appearance_stroke') {\r\n                    const apps = target.nodeData.background?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\r\n                    if (app && app.color !== String(val)) {\r\n                        console.log(\"Updating bg_appearance_stroke for \" + target.nodeData.id + \" to \" + val);\r\n                        app.color = String(val);\r\n                        if (docApp) {\r\n                            docApp.color = String(val);\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'appearance_color_rule' || target.type === 'bg_appearance_color_rule' || target.type === 'visibility_condition' || target.type === 'image_reference_condition') {\r\n                    hasUpdates = true;\r\n                }\r\n            });\r\n        }\r\n    });\r\n\r\n    if (rendarableObject.highliteNum !== undefined || rendarableObject.barNum !== undefined) {\r\n        hasUpdates = true;\r\n    }\r\n\r\n    if (Object.keys(rendarableObject).some(k => /^PS\\d+_[XY]$/.test(k))) {\r\n        hasUpdates = true;\r\n    }\r\n\r\n    if (hasUpdates) {\r\n        const evaluatedDoc = resolveDynamicVisibility(doc, rendarableObject);\r\n        applyPlatePositions(rendarableObject, [doc, evaluatedDoc]);\r\n\r\n        // In-place image reference & visibility condition updates (zero-flicker)\r\n        for (const nodeId in evaluatedDoc.nodesById) {\r\n            const prevNode = doc.nodesById[nodeId];\r\n            const nextNode = evaluatedDoc.nodesById[nodeId];\r\n            if (prevNode && nextNode && nextNode.type === 'image') {\r\n                if (prevNode.assetId !== nextNode.assetId) {\r\n                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||\r\n                                      (projectData.assets && projectData.assets[nextNode.assetId]);\r\n                    if (nextAsset && nextAsset.src) {\r\n                        const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                        const imgEl = nodeEl ? nodeEl.querySelector(\"image\") : null;\r\n                        if (imgEl) {\r\n                            const targetSrc = (assetCache && assetCache[nextAsset.src]) ? assetCache[nextAsset.src] : nextAsset.src;\r\n                            imgEl.setAttribute(\"href\", targetSrc);\r\n                        }\r\n                    }\r\n                    prevNode.assetId = nextNode.assetId;\r\n                }\r\n            }\r\n            if (prevNode && nextNode && prevNode.visible !== nextNode.visible) {\r\n                const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                if (nodeEl) {\r\n                    nodeEl.style.display = nextNode.visible === false ? 'none' : '';\r\n                }\r\n                prevNode.visible = nextNode.visible;\r\n            }\r\n        }\r\n\r\n        window.telopDoc = evaluatedDoc;\r\n\r\n        keyExpMap.clear();\r\n\r\n        try {\r\n            const oldDefs = app.firstChild;\r\n            if (oldDefs) oldDefs.innerHTML = '';\r\n\r\n            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);\r\n            if (newRootNode) {\r\n                if (app.childNodes.length > 1) {\r\n                    app.replaceChild(newRootNode, app.childNodes[1]);\r\n                } else {\r\n                    app.appendChild(newRootNode);\r\n                }\r\n\r\n                while (app.childNodes.length > 2) {\r\n                    app.removeChild(app.lastChild);\r\n                }\r\n            }\r\n        } catch (e) {\r\n            console.error(\"Error creating new root node in updateTelop:\", e);\r\n        }\r\n\r\n        window.dispatchEvent(new CustomEvent('telopRendered'));\r\n    }\r\n};\r\n\r\n/**\r\n * テロップを非表示にする関数\r\n */\r\nwindow.hideTelop = function () {\r\n    stopPush();\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        divElement.classList.remove(...divElement.classList);\r\n\r\n        let finished = false;\r\n        const completeHide = () => {\r\n            if (finished) return;\r\n            finished = true;\r\n            divElement.style.opacity = '0';\r\n            divElement.classList.remove(\"out_animation\");\r\n            if (window.animationFinishedCallback) {\r\n                window.animationFinishedCallback();\r\n            }\r\n            divElement.removeEventListener('animationend', onAnimationEnd);\r\n        };\r\n\r\n        const onAnimationEnd = (e) => {\r\n            if (!divElement.classList.contains(\"out_animation\")) return;\r\n            completeHide();\r\n        };\r\n\r\n        divElement.addEventListener('animationend', onAnimationEnd);\r\n        divElement.classList.add(\"out_animation\");\r\n\r\n        // Safety fallback: if no animation or animationend doesn't fire, complete after duration or max 1s\r\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\r\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\r\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\r\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\r\n        setTimeout(() => {\r\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\r\n                completeHide();\r\n            }\r\n        }, timeoutMs);\r\n    }\r\n};\r\n\r\n\r\n// 3. Initialization\r\nwindow.addEventListener('load', async () => {\r\n    try {\r\n        if (document.fonts && document.fonts.ready) {\r\n            await document.fonts.ready;\r\n        }\r\n        const dataUrl = './フォーメーション左.telop';\r\n        const dataResp = await fetch(dataUrl);\r\n        if (dataResp.ok) {\r\n            projectData = await dataResp.json();\r\n            console.log(\"[Player] Loaded project data from:\", dataUrl);\r\n        }\r\n        assetCache = {};\r\n        if (window.initPlayer) {\r\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\r\n                window.initialized = true;\r\n                if (window._pendingRenderableObject) {\r\n                    window.updateTelop(window._pendingRenderableObject);\r\n                    window._pendingRenderableObject = null;\r\n                }\r\n                if (window._pendingShow) {\r\n                    window.showTelop();\r\n                    window._pendingShow = false;\r\n                }\r\n            });\r\n        }\r\n    } catch (e) {\r\n        console.error(\"[Player] Failed to initialize project data:\", e);\r\n    }\r\n});\r\n"
      },
      "children": [
        {
          "type": "group",
          "name": "チーム情報",
          "raw": {
            "x": 48,
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
            "effects": []
          },
          "children": [
            {
              "type": "image",
              "name": "チームベース",
              "src": "../../フォーメーション左/img/HD2D_F07_TeamZabuL_002.png",
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
                "width": 480,
                "height": 89
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "x": 473,
                "y": -20,
                "rotation": 0,
                "scaleX": 1.2312344648066182,
                "scaleY": 1.1749999999999874,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": -12.556492647850591,
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
                  "h": 38,
                  "raw": {
                    "x": -248,
                    "y": 16,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 4,
                    "height": 38,
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
                  "h": 38,
                  "raw": {
                    "x": -226,
                    "y": 16,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 4,
                    "height": 38,
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
                  "w": 18,
                  "h": 38,
                  "raw": {
                    "x": -244,
                    "y": 16,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 18,
                    "height": 38,
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
                  "w": 9,
                  "h": 38,
                  "raw": {
                    "x": -235,
                    "y": 16,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 9,
                    "height": 38,
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
                  "w": 18,
                  "h": 38,
                  "raw": {
                    "x": -244,
                    "y": 16,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 18,
                    "height": 38,
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
              "name": "学校名",
              "text": "駒沢大学高等学校",
              "w": 195,
              "raw": {
                "x": 190,
                "y": -4,
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
                "text": "駒沢大学高等学校",
                "width": 195,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 35,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 53,
                "keyexp": "学校名"
              }
            },
            {
              "type": "image",
              "name": "矢印",
              "src": "../../フォーメーション左/img/HD2D_F01_new_YajirushiL_1.png",
              "raw": {
                "x": 404,
                "y": -8,
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
                "width": 121,
                "height": 57
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS1",
          "raw": {
            "x": 302,
            "y": 863,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS1_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS1base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseGK.png",
              "raw": {
                "x": -253,
                "y": 1,
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
                "width": 318,
                "height": 46,
                "keyexp": "PS1_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 15,
                "y": 3,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS1_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "1",
              "w": 40,
              "raw": {
                "x": -213,
                "y": 3,
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
                "text": "1",
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS1_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name",
              "text": "浅田　卓人",
              "w": 170,
              "raw": {
                "x": -170,
                "y": 3,
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
                "text": "浅田　卓人",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS1_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS2",
          "raw": {
            "x": 635,
            "y": 773,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS2_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS2base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseDF.png",
              "raw": {
                "x": -248,
                "y": -2,
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
                "width": 318,
                "height": 46,
                "keyexp": "PS2_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 20,
                "y": 1,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS2_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "7",
              "w": 40,
              "raw": {
                "x": -208,
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
                "text": "7",
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS2_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name1",
              "text": "日高　献盛",
              "w": 170,
              "raw": {
                "x": -166,
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
                "text": "日高　献盛",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS2_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS3",
          "raw": {
            "x": 635,
            "y": 828,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS3_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS3base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseDF.png",
              "raw": {
                "x": -248,
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
                "width": 318,
                "height": 46,
                "keyexp": "PS3_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(2年)",
              "w": 40,
              "raw": {
                "x": 21,
                "y": -1,
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
                "text": "(2年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS3_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "14",
              "w": 40,
              "raw": {
                "x": -208,
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
                "text": "14",
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS3_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name2",
              "text": "日高　隼登",
              "w": 170,
              "raw": {
                "x": -166,
                "y": -1,
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
                "text": "日高　隼登",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS3_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS4",
          "raw": {
            "x": 635,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS4_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS4base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseDF.png",
              "raw": {
                "x": -248,
                "y": -2,
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
                "width": 318,
                "height": 46,
                "keyexp": "PS4_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 22,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS4_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "3",
              "w": 40,
              "raw": {
                "x": -208,
                "y": 1,
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
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS4_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name3",
              "text": "原田　駿也",
              "w": 170,
              "raw": {
                "x": -166,
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
                "text": "原田　駿也",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS4_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS5",
          "raw": {
            "x": 635,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS5_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS5base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseDF.png",
              "raw": {
                "x": -249,
                "y": -2,
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
                "width": 318,
                "height": 46,
                "keyexp": "PS5_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 22,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 46,
                "keyexp": "PS5_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "2",
              "w": 40,
              "raw": {
                "x": -209,
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
                "text": "2",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 46,
                "keyexp": "PS5_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name4",
              "text": "柏田　崇走",
              "w": 170,
              "raw": {
                "x": -167,
                "y": -1,
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
                "text": "柏田　崇走",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 48,
                "keyexp": "PS5_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS6",
          "raw": {
            "x": 999,
            "y": 828,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS6_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS6base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseMF.png",
              "raw": {
                "x": -250,
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
                "width": 319,
                "height": 47,
                "keyexp": "PS6_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 20,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS6_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "5",
              "w": 40,
              "raw": {
                "x": -208,
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
                "text": "5",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS6_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name",
              "text": "矢野　大樹",
              "w": 170,
              "raw": {
                "x": -167,
                "y": -1,
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
                "text": "矢野　大樹",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS6_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS7",
          "raw": {
            "x": 999,
            "y": 890,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS7_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS7base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseMF.png",
              "raw": {
                "x": -250,
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
                "width": 319,
                "height": 47,
                "keyexp": "PS7_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 21,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS7_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "6",
              "w": 40,
              "raw": {
                "x": -208,
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
                "text": "6",
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS7_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name",
              "text": "東　　聖二",
              "w": 170,
              "raw": {
                "x": -167,
                "y": -1,
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
                "text": "東　　聖二",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS7_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS8",
          "raw": {
            "x": 1349,
            "y": 779,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS8_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS8base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseMF.png",
              "raw": {
                "x": -252,
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
                "width": 319,
                "height": 47,
                "keyexp": "PS8_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(2年)",
              "w": 40,
              "raw": {
                "x": 18,
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
                "text": "(2年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS8_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "8",
              "w": 40,
              "raw": {
                "x": -210,
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
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS8_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name",
              "text": "小原　裕哉",
              "w": 170,
              "raw": {
                "x": -169,
                "y": -2,
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
                "text": "小原　裕哉",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS8_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS9",
          "raw": {
            "x": 1349,
            "y": 859,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS9_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS9base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseMF.png",
              "raw": {
                "x": -252,
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
                "width": 319,
                "height": 47,
                "keyexp": "PS9_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(2年)",
              "w": 40,
              "raw": {
                "x": 18,
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
                "text": "(2年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS9_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "9",
              "w": 40,
              "raw": {
                "x": -210,
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
                "text": "9",
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS9_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name",
              "text": "川崎　皓章",
              "w": 170,
              "raw": {
                "x": -168,
                "y": -2,
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
                "text": "川崎　皓章",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS9_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS10",
          "raw": {
            "x": 1349,
            "y": 932,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS10_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS10base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseMF.png",
              "raw": {
                "x": -252,
                "y": -2,
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
                "width": 319,
                "height": 47,
                "keyexp": "PS10_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 18,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS10_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "13",
              "w": 40,
              "raw": {
                "x": -210,
                "y": 1,
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
                "width": 40,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS10_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name",
              "text": "中濱　健太",
              "w": 170,
              "raw": {
                "x": -169,
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
                "text": "中濱　健太",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS10_氏名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "PS11",
          "raw": {
            "x": 1723,
            "y": 861,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "PS11_氏名",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "PS11base",
              "src": "../../フォーメーション左/img/HD2D_F01_new_BaseFW.png",
              "raw": {
                "x": -251,
                "y": -4,
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
                "width": 318,
                "height": 46,
                "keyexp": "PS11_ポジション"
              }
            },
            {
              "type": "text",
              "name": "GakuNen",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 19,
                "y": -2,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS11_学年"
              }
            },
            {
              "type": "text",
              "name": "Number",
              "text": "4",
              "w": 40,
              "raw": {
                "x": -204,
                "y": -1,
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
                "text": "4",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 45,
                "keyexp": "PS11_背番号"
              }
            },
            {
              "type": "text",
              "name": "Name",
              "text": "澤中　拓也",
              "w": 170,
              "raw": {
                "x": -163,
                "y": -2,
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
                "text": "澤中　拓也",
                "width": 170,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 47,
                "keyexp": "PS11_氏名"
              }
            }
          ]
        }
      ]
    }
  ]
};
