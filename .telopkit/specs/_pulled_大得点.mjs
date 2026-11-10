// Pulled from telop "大得点" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/大得点.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "大得点",
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
        "customJs": "\r\n// 1. Data Loading (Auto-generated)\r\nlet projectData = null;\r\nlet assetCache = {};\r\n\r\n// 2. Controller Logic (Customized: TAKE 時に下からせり上がる)\r\n\r\n/*\r\n * TAKE（showTelop）のたびに、グラフィックを下から 0.5 秒でせり上げて今の位置に収める。\r\n * 今の位置の下端より下は見せない（下端の線から押し出されて出てくるように見える）。\r\n * TelopHub の送出ページはこのページを content-visibility: hidden の入れ物に入れ、updateTelop を差し替えて\r\n * showTelop() をデータなしで呼ぶことがある。requestAnimationFrame を待たず、showTelop の中で Web Animations を予約する。\r\n * 範囲はテロップの配置（チーム名ベース左右: y 947〜1053）から決めた固定値。\r\n * 動かすのは SVG（window.telopApp）、下端で切るのは入れ物（#player-container）。同じ要素に付けると切る線も一緒に動くため分ける。\r\n */\r\nconst RISE = { top: 940, bottom: 1060, canvasHeight: 1080, duration: 500, easing: 'ease-out' };\r\nlet riseAnimations = [];\r\nfunction startRiseIn() {\r\n    const box = document.getElementById(window.containerId || 'player-container');\r\n    const svg = window.telopApp;\r\n    if (!box || !svg || !box.animate || !svg.animate) return;\r\n    stopRise();\r\n    const pct = y => (y / RISE.canvasHeight * 100).toFixed(3) + '%';\r\n    const timing = { duration: RISE.duration, easing: RISE.easing, fill: 'backwards' };\r\n    // グラフィックの高さぶん下から、今の位置まで\r\n    riseAnimations.push(svg.animate(\r\n        [{ transform: `translateY(${pct(RISE.bottom - RISE.top)})` }, { transform: 'translateY(0)' }],\r\n        timing\r\n    ));\r\n    // 動いている間は、今の位置の下端より下を切る\r\n    const clip = `inset(0 0 ${pct(RISE.canvasHeight - RISE.bottom)} 0)`;\r\n    riseAnimations.push(box.animate([{ clipPath: clip }, { clipPath: clip }], { ...timing, easing: 'linear' }));\r\n}\r\nfunction stopRise() {\r\n    riseAnimations.forEach(a => a.cancel());\r\n    riseAnimations = [];\r\n}\r\n\r\n// --- External Control API ---\r\nwindow._pendingRenderableObject = null;\r\nwindow._pendingShow = false;\r\n\r\n/**\r\n * テロップを表示する関数\r\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\r\n */\r\nwindow.showTelop = function (rendarableObject) {\r\n    if (rendarableObject !== undefined) {\r\n        window.updateTelop(rendarableObject);\r\n    }\r\n\r\n    if (!window.initialized) {\r\n        window._pendingShow = true;\r\n        return;\r\n    }\r\n\r\n    // containerId is exposed by initPlayer\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        if (!divElement.classList.contains(\"in_animation\")) {\r\n            divElement.classList.remove(...divElement.classList);\r\n            divElement.style.opacity = \"0\";\r\n            \r\n            const triggerShow = () => {\r\n                requestAnimationFrame(() => {\r\n                    requestAnimationFrame(() => {\r\n                        divElement.style.opacity = \"\";\r\n                        divElement.classList.add(\"in_animation\");\r\n                        document.body.style.display = \"block\";\r\n                    });\r\n                });\r\n            };\r\n\r\n            if (document.fonts && document.fonts.ready) {\r\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\r\n            } else {\r\n                triggerShow();\r\n            }\r\n        }\r\n    }\r\n\r\n    startRiseIn();\r\n};\r\n\r\n/**\r\n * テロップの内容を更新する関数\r\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\r\n */\r\nwindow.updateTelop = function (rendarableObject) {\r\n    console.log(\"updateTelop called\", rendarableObject);\r\n    if (!rendarableObject) return;\r\n\r\n    // Globals exposed by renderer.js\r\n    const app = window.telopApp;\r\n    const doc = window.telopDoc;\r\n    const keyExpMap = window.keyExpMap;\r\n    const createNode = window.createNode;\r\n\r\n    if (!app || !doc || !keyExpMap || !createNode) {\r\n        console.error(\"updateTelop early return: Missing required globals:\", { app: !!app, doc: !!doc, keyExpMap: !!keyExpMap, createNode: !!createNode });\r\n        console.warn(\"Player not fully initialized yet. Caching update...\");\r\n        window._pendingRenderableObject = rendarableObject;\r\n        return;\r\n    }\r\n\r\n    let hasUpdates = false;\r\n\r\n    Object.keys(rendarableObject).forEach(key => {\r\n        const val = rendarableObject[key];\r\n        const targets = keyExpMap.get(key);\r\n        console.log(\"Processing key: \" + key + \", targets found: \" + (targets ? targets.length : 0) + \", val: \" + val);\r\n\r\n        if (targets && Array.isArray(targets) && (val || val === \"\")) {\r\n            targets.forEach((target) => {\r\n                if (target.type === 'text') {\r\n                    // Update Doc\r\n                    const strVal = String(val);\r\n                    if (target.nodeData.text !== strVal) {\r\n                        target.nodeData.text = strVal;\r\n                        const nodeInDoc = doc.nodesById[target.nodeData.id];\r\n                        if (nodeInDoc) {\r\n                            nodeInDoc.text = strVal;\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'image') {\r\n                    // Update Doc (Asset)\r\n                    const node = target.nodeData;\r\n                    if (node.assetId && doc.assets[node.assetId]) {\r\n                        if (doc.assets[node.assetId].src !== String(val)) {\r\n                            // Clone asset to avoid clobbering shared assetId entries\r\n                            var uniqueAssetId = node.assetId + '__keyexp_' + key;\r\n                            doc.assets[uniqueAssetId] = Object.assign({}, doc.assets[node.assetId], { src: String(val) });\r\n                            node.assetId = uniqueAssetId;\r\n                            \r\n                            // Also mutate the node inside the active document to persist the change\r\n                            const nodeInDoc = doc.nodesById[node.id];\r\n                            if (nodeInDoc) {\r\n                                nodeInDoc.assetId = uniqueAssetId;\r\n                            }\r\n                            \r\n                            hasUpdates = true;\r\n                        }\r\n                    }\r\n                } else if (target.type === 'appearance_fill') {\r\n                    const apps = target.nodeData.style?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\r\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\r\n                        console.log(\"Updating appearance_fill for \" + target.nodeData.id + \" to \" + val);\r\n                        app.fill = String(val);\r\n                        if (app.gradientConfig) { delete app.gradientConfig; }\r\n                        if (docApp) {\r\n                            docApp.fill = String(val);\r\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'appearance_stroke') {\r\n                    const apps = target.nodeData.style?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\r\n                    if (app && app.color !== String(val)) {\r\n                        console.log(\"Updating appearance_stroke for \" + target.nodeData.id + \" to \" + val);\r\n                        app.color = String(val);\r\n                        if (docApp) {\r\n                            docApp.color = String(val);\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'bg_appearance_fill') {\r\n                    const apps = target.nodeData.background?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\r\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\r\n                        console.log(\"Updating bg_appearance_fill for \" + target.nodeData.id + \" to \" + val);\r\n                        app.fill = String(val);\r\n                        if (app.gradientConfig) { delete app.gradientConfig; }\r\n                        if (docApp) {\r\n                            docApp.fill = String(val);\r\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'bg_appearance_stroke') {\r\n                    const apps = target.nodeData.background?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\r\n                    if (app && app.color !== String(val)) {\r\n                        console.log(\"Updating bg_appearance_stroke for \" + target.nodeData.id + \" to \" + val);\r\n                        app.color = String(val);\r\n                        if (docApp) {\r\n                            docApp.color = String(val);\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'appearance_color_rule' || target.type === 'bg_appearance_color_rule' || target.type === 'visibility_condition' || target.type === 'image_reference_condition') {\r\n                    hasUpdates = true;\r\n                }\r\n            });\r\n        }\r\n    });\r\n\r\n    if (rendarableObject.highliteNum !== undefined || rendarableObject.barNum !== undefined) {\r\n        hasUpdates = true;\r\n    }\r\n\r\n    if (hasUpdates) {\r\n        const evaluatedDoc = resolveDynamicVisibility(doc, rendarableObject);\r\n\r\n        // In-place image reference & visibility condition updates (zero-flicker)\r\n        for (const nodeId in evaluatedDoc.nodesById) {\r\n            const prevNode = doc.nodesById[nodeId];\r\n            const nextNode = evaluatedDoc.nodesById[nodeId];\r\n            if (prevNode && nextNode && nextNode.type === 'image') {\r\n                if (prevNode.assetId !== nextNode.assetId) {\r\n                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||\r\n                                      (projectData.assets && projectData.assets[nextNode.assetId]);\r\n                    if (nextAsset && nextAsset.src) {\r\n                        const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                        const imgEl = nodeEl ? nodeEl.querySelector(\"image\") : null;\r\n                        if (imgEl) {\r\n                            const targetSrc = (assetCache && assetCache[nextAsset.src]) ? assetCache[nextAsset.src] : nextAsset.src;\r\n                            imgEl.setAttribute(\"href\", targetSrc);\r\n                        }\r\n                    }\r\n                    prevNode.assetId = nextNode.assetId;\r\n                }\r\n            }\r\n            if (prevNode && nextNode && prevNode.visible !== nextNode.visible) {\r\n                const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                if (nodeEl) {\r\n                    nodeEl.style.display = nextNode.visible === false ? 'none' : '';\r\n                }\r\n                prevNode.visible = nextNode.visible;\r\n            }\r\n        }\r\n\r\n        window.telopDoc = evaluatedDoc;\r\n\r\n        keyExpMap.clear();\r\n\r\n        try {\r\n            const oldDefs = app.firstChild;\r\n            if (oldDefs) oldDefs.innerHTML = '';\r\n\r\n            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);\r\n            if (newRootNode) {\r\n                if (app.childNodes.length > 1) {\r\n                    app.replaceChild(newRootNode, app.childNodes[1]);\r\n                } else {\r\n                    app.appendChild(newRootNode);\r\n                }\r\n\r\n                while (app.childNodes.length > 2) {\r\n                    app.removeChild(app.lastChild);\r\n                }\r\n            }\r\n        } catch (e) {\r\n            console.error(\"Error creating new root node in updateTelop:\", e);\r\n        }\r\n\r\n        window.dispatchEvent(new CustomEvent('telopRendered'));\r\n    }\r\n};\r\n\r\n/**\r\n * テロップを非表示にする関数\r\n */\r\nwindow.hideTelop = function () {\r\n    stopRise();\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        divElement.classList.remove(...divElement.classList);\r\n\r\n        let finished = false;\r\n        const completeHide = () => {\r\n            if (finished) return;\r\n            finished = true;\r\n            divElement.style.opacity = '0';\r\n            divElement.classList.remove(\"out_animation\");\r\n            if (window.animationFinishedCallback) {\r\n                window.animationFinishedCallback();\r\n            }\r\n            divElement.removeEventListener('animationend', onAnimationEnd);\r\n        };\r\n\r\n        const onAnimationEnd = (e) => {\r\n            if (!divElement.classList.contains(\"out_animation\")) return;\r\n            completeHide();\r\n        };\r\n\r\n        divElement.addEventListener('animationend', onAnimationEnd);\r\n        divElement.classList.add(\"out_animation\");\r\n\r\n        // Safety fallback: if no animation or animationend doesn't fire, complete after duration or max 1s\r\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\r\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\r\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\r\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\r\n        setTimeout(() => {\r\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\r\n                completeHide();\r\n            }\r\n        }, timeoutMs);\r\n    }\r\n};\r\n\r\n\r\n// 3. Initialization\r\nwindow.addEventListener('load', async () => {\r\n    try {\r\n        if (document.fonts && document.fonts.ready) {\r\n            await document.fonts.ready;\r\n        }\r\n        const dataUrl = './大得点.telop';\r\n        const dataResp = await fetch(dataUrl);\r\n        if (dataResp.ok) {\r\n            projectData = await dataResp.json();\r\n            console.log(\"[Player] Loaded project data from:\", dataUrl);\r\n        }\r\n        assetCache = {};\r\n        if (window.initPlayer) {\r\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\r\n                window.initialized = true;\r\n                if (window._pendingRenderableObject) {\r\n                    window.updateTelop(window._pendingRenderableObject);\r\n                    window._pendingRenderableObject = null;\r\n                }\r\n                if (window._pendingShow) {\r\n                    window.showTelop();\r\n                    window._pendingShow = false;\r\n                }\r\n            });\r\n        }\r\n    } catch (e) {\r\n        console.error(\"[Player] Failed to initialize project data:\", e);\r\n    }\r\n});\r\n"
      },
      "children": [
        {
          "type": "image",
          "name": "大得点チーム名ベース左",
          "src": "../../大得点/img/HD2D_A00_BaseL_M122.png",
          "raw": {
            "x": 397,
            "y": 947,
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
            "width": 563,
            "height": 106,
            "keyexp": ""
          }
        },
        {
          "type": "image",
          "name": "大得点チーム名ベース右",
          "src": "../../大得点/img/HD2D_A00_BaseR_M121.png",
          "raw": {
            "x": 960,
            "y": 947,
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
            "width": 563,
            "height": 106,
            "keyexp": ""
          }
        },
        {
          "type": "text",
          "name": "左チーム得点",
          "text": "11",
          "w": 67,
          "raw": {
            "x": 893,
            "y": 972,
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
            "text": "11",
            "width": 67,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "none",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": 700,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#fddd10",
                  "strokeEnabled": false,
                  "color": "#ffffff",
                  "thickness": 2,
                  "lineJoin": "round",
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
            "keyexp": "左チーム得点"
          }
        },
        {
          "type": "text",
          "name": "右チーム得点",
          "text": "11",
          "w": 67,
          "raw": {
            "x": 960,
            "y": 970,
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
            "text": "11",
            "width": 67,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "none",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": 700,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#fddd10",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "round",
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
            "keyexp": "右チーム得点"
          }
        },
        {
          "type": "text",
          "name": "ハイフン",
          "text": "-",
          "w": 42,
          "raw": {
            "x": 939,
            "y": 974,
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
            "text": "-",
            "width": 42,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "none",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": 700,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#fddd10",
                  "strokeEnabled": false,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "round",
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
            "height": 36
          }
        },
        {
          "type": "text",
          "name": "左チーム名",
          "text": "札幌大谷",
          "w": 290,
          "raw": {
            "x": 568,
            "y": 968,
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
            "width": 290,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "shrink_x",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": 700,
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
            "keyexp": "左チーム名"
          }
        },
        {
          "type": "text",
          "name": "右チーム名",
          "text": "札幌大谷",
          "w": 290,
          "raw": {
            "x": 1067,
            "y": 968,
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
            "width": 290,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "shrink_x",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": 700,
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
            "keyexp": "右チーム名"
          }
        },
        {
          "type": "group",
          "name": "LeftTeamColorRect",
          "raw": {
            "x": 507,
            "y": 955,
            "rotation": 0,
            "scaleX": 0.5747582219948462,
            "scaleY": 1.5542581353781675,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 12.409689987270337,
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
              "h": 45,
              "raw": {
                "x": -4,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 4,
                "height": 45,
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
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ],
                  "cornerRadius": 0
                },
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 45,
              "raw": {
                "x": 37,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 4,
                "height": 45,
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
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ],
                  "cornerRadius": 0
                },
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                }
              }
            },
            {
              "type": "rect",
              "name": "Rectangle",
              "w": 37,
              "h": 45,
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 37,
                "height": 45,
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
                      "fillKeyexp": "ColorRectL"
                    }
                  ],
                  "cornerRadius": 0
                },
                "domId": "LeftTeamColorLargePoint"
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 18.5,
              "h": 45,
              "raw": {
                "x": 18.5,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 18.5,
                "height": 45,
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
                      "fillKeyexp": "ColorRectL2"
                    }
                  ],
                  "cornerRadius": 0
                }
              }
            },
            {
              "type": "rect",
              "name": "Rectangle",
              "w": 37,
              "h": 45,
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 37,
                "height": 45,
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
                            "offset": 0.51,
                            "color": "#ffffff29"
                          },
                          {
                            "offset": 0.5,
                            "color": "#00000075"
                          },
                          {
                            "offset": 0.95,
                            "color": "#0000001a"
                          },
                          {
                            "offset": 0.95,
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
          "type": "group",
          "name": "RightTeamColorRect",
          "raw": {
            "x": 1391,
            "y": 955,
            "rotation": 0,
            "scaleX": 0.5747582219948462,
            "scaleY": 1.5542581353781675,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": -12,
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
              "h": 45,
              "raw": {
                "x": -4,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 4,
                "height": 45,
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
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ],
                  "cornerRadius": 0
                },
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 45,
              "raw": {
                "x": 37,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 4,
                "height": 45,
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
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ],
                  "cornerRadius": 0
                },
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                }
              }
            },
            {
              "type": "rect",
              "name": "Rectangle",
              "w": 37,
              "h": 45,
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 37,
                "height": 45,
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
                      "fillKeyexp": "ColorRectR"
                    }
                  ],
                  "cornerRadius": 0
                },
                "domId": "RightTeamColorLargePoint"
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 18.5,
              "h": 45,
              "raw": {
                "x": 18.5,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 18.5,
                "height": 45,
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
                      "fillKeyexp": "ColorRectR2"
                    }
                  ],
                  "cornerRadius": 0
                }
              }
            },
            {
              "type": "rect",
              "name": "Rectangle",
              "w": 37,
              "h": 45,
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 0.9999999999999999,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 37,
                "height": 45,
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
                            "offset": 0.51,
                            "color": "#ffffff29"
                          },
                          {
                            "offset": 0.5,
                            "color": "#00000075"
                          },
                          {
                            "offset": 0.95,
                            "color": "#0000001a"
                          },
                          {
                            "offset": 0.95,
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
          "name": "LeftTeamColor",
          "text": "#bd39fb",
          "w": 52,
          "raw": {
            "x": 893,
            "y": 927,
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
            "width": 52,
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
            "height": 20,
            "keyexp": "LeftTeamColor"
          }
        },
        {
          "type": "text",
          "name": "RigtTeamColor",
          "text": "#bd39fb",
          "w": 52,
          "raw": {
            "x": 981,
            "y": 927,
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
            "width": 52,
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
            "height": 20,
            "keyexp": "RigtTeamColor"
          }
        }
      ]
    }
  ]
};
