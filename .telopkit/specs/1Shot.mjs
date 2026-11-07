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
        "skewX": 0,
        "skewY": 0,
        "opacity": 1,
        "visible": true,
        "locked": false,
        "blendMode": "normal",
        "effects": [],
        "customJs": "\r\n// 1. Data Loading (Auto-generated)\r\nlet projectData = null;\r\nlet assetCache = {};\r\n\r\n// 2. Controller Logic (Editable)\r\n// Customized: スタッフ（監督・コーチ）表示のレイアウト切替\r\n\r\n/**\r\n * スタッフ表示（役職表示 = 1）: 役職（ポジション）を背番号の位置へ移し、チームカラーザブトンを文字数に応じて伸ばす。\r\n * ザブトンは右端（氏名側）を固定して左へ伸ばし、蹴り上げマークの手前までに収める（長い役職は shrink_x で縮む）。\r\n * 選手表示（役職表示 = 0）では projectData の元の配置・色に戻す。\r\n */\r\nconst STAFF_LAYOUT = {\r\n    flagKey: '役職表示',\r\n    zabutonGroup: 'チームカラーザブトン',\r\n    zabutonRects: ['ベースカラー', 'グラデーションマット'],\r\n    roleText: 'ポジション',\r\n    numberText: '背番号',\r\n    leftLimitNode: '蹴り上げマーク', // ザブトンはこのノードの右端より左へは伸ばさない\r\n    padding: 8 // 文字とザブトン端の余白 (px)\r\n};\r\nlet staffLayoutOn = false;\r\n// 元の配置・色。telopDoc のノードは projectData と同じオブジェクトなので、書き換える前に複製しておく\r\nlet staffLayoutOrig = null;\r\n\r\nconst findByName = (d, name) => Object.values(d.nodesById).find(n => n && n.name === name);\r\nconst cloneJson = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));\r\n\r\n/** 全角 1em・半角 0.6em で役職の表示幅を見積もる */\r\nfunction estimateTextWidth(text, fontSize) {\r\n    let em = 0;\r\n    for (const ch of String(text || '')) em += ch.charCodeAt(0) > 0xff ? 1 : 0.6;\r\n    return em * fontSize;\r\n}\r\n\r\n/** 役職・ザブトンの配置を doc に書き込み、変わったノード ID を返す */\r\nfunction applyStaffLayout(d, values) {\r\n    if (!d || !d.nodesById) return [];\r\n    if (!staffLayoutOrig) {\r\n        staffLayoutOrig = {};\r\n        Object.values(d.nodesById).forEach(n => {\r\n            if (n && [STAFF_LAYOUT.roleText, ...STAFF_LAYOUT.zabutonRects].includes(n.name)) {\r\n                staffLayoutOrig[n.id] = cloneJson({ x: n.x, y: n.y, width: n.width, height: n.height, style: n.style });\r\n            }\r\n        });\r\n    }\r\n    const group = findByName(d, STAFF_LAYOUT.zabutonGroup);\r\n    const role = findByName(d, STAFF_LAYOUT.roleText);\r\n    const number = findByName(d, STAFF_LAYOUT.numberText);\r\n    if (!group || !role || !number) return [];\r\n    const rects = (group.children || []).map(id => d.nodesById[id]).filter(n => n && STAFF_LAYOUT.zabutonRects.includes(n.name));\r\n    const o = id => staffLayoutOrig[id];\r\n    const before = JSON.stringify([role.x, role.y, role.width, role.height, role.style, rects.map(r => [r.x, r.width])]);\r\n\r\n    // まず元の配置・色に戻す\r\n    ['x', 'y', 'width', 'height'].forEach(k => { if (o(role.id)) role[k] = o(role.id)[k]; });\r\n    if (o(role.id)) role.style = cloneJson(o(role.id).style);\r\n    rects.forEach(r => { if (o(r.id)) { r.x = o(r.id).x; r.width = o(r.id).width; } });\r\n\r\n    if (staffLayoutOn) {\r\n        const parent = group.parentId ? d.nodesById[group.parentId] : null;\r\n        const scaleX = group.scaleX || 1;\r\n        const baseRect = rects[0];\r\n        const origRect = o(baseRect.id);\r\n        // ザブトンの右端（絶対座標）を固定\r\n        const groupAbsX = (parent ? parent.x : 0) + group.x;\r\n        const rightAbs = groupAbsX + (origRect.x + origRect.width) * scaleX;\r\n        const limit = findByName(d, STAFF_LAYOUT.leftLimitNode);\r\n        const leftLimitAbs = limit ? limit.x + (limit.width || 0) + 4 : rightAbs - 160;\r\n        const fontSize = (role.style && role.style.fontSize) || 36;\r\n        const roleText = values && values[STAFF_LAYOUT.roleText] !== undefined ? values[STAFF_LAYOUT.roleText] : role.text;\r\n        const wanted = estimateTextWidth(roleText, fontSize) + STAFF_LAYOUT.padding * 2;\r\n        const width = Math.max(origRect.width * scaleX, Math.min(wanted, rightAbs - leftLimitAbs));\r\n        const localWidth = width / scaleX;\r\n        rects.forEach(r => {\r\n            const or = o(r.id);\r\n            r.width = localWidth;\r\n            r.x = or.x + or.width - localWidth;\r\n        });\r\n        // 役職をザブトンの上（背番号と同じ高さ・色）へ\r\n        const leftAbs = rightAbs - width;\r\n        role.x = leftAbs + STAFF_LAYOUT.padding;\r\n        role.width = width - STAFF_LAYOUT.padding * 2;\r\n        role.y = number.y + ((number.height || 0) - (role.height || 0)) / 2;\r\n        if (number.style && number.style.appearances) {\r\n            role.style = Object.assign({}, role.style, { appearances: cloneJson(number.style.appearances) });\r\n        }\r\n    }\r\n    const after = JSON.stringify([role.x, role.y, role.width, role.height, role.style, rects.map(r => [r.x, r.width])]);\r\n    return before === after ? [] : [role.id, group.id];\r\n}\r\n\r\n/**\r\n * TelopHub の OnAir / Preview は updateTelop を差し替えるが、更新のたびに 'telopRendered'（detail = 受け取ったデータ）が届く。\r\n * ここで配置を反映し、変わったノードだけ DOM を作り直す（フォーメーション左／右と同じ方式）。\r\n */\r\nwindow.addEventListener('telopRendered', (e) => {\r\n    const values = (e && e.detail) || {};\r\n    if (values[STAFF_LAYOUT.flagKey] !== undefined) staffLayoutOn = String(values[STAFF_LAYOUT.flagKey]) === '1';\r\n    const doc = window.telopDoc;\r\n    const app = window.telopApp;\r\n    if (!doc || !doc.nodesById || !app || !window.createNode) return;\r\n    const changed = applyStaffLayout(doc, values);\r\n    changed.forEach(id => {\r\n        const node = doc.nodesById[id];\r\n        const map = window.nodeElementMap;\r\n        const oldEl = (map && map.get(id) && map.get(id).isConnected) ? map.get(id) : app.querySelector('[data-node-id=\"' + id + '\"]');\r\n        if (!node || !oldEl || !oldEl.parentNode) return;\r\n        try {\r\n            const parent = node.parentId ? doc.nodesById[node.parentId] : null;\r\n            const newEl = window.createNode(id, undefined, !!parent && parent.type === 'telop');\r\n            if (!newEl) return;\r\n            oldEl.parentNode.replaceChild(newEl, oldEl);\r\n            if (map) map.set(id, newEl);\r\n        } catch (err) {\r\n            console.warn('[StaffLayout] re-create failed for ' + node.name, err);\r\n        }\r\n    });\r\n    // 作り直した要素の古い keyExp 登録を外す（次の UPDATE で外れた要素を書き換えないように）\r\n    if (changed.length && window.keyExpMap) {\r\n        window.keyExpMap.forEach((targets, key) => {\r\n            const live = targets.filter(t => !t.element || t.element.isConnected);\r\n            if (live.length !== targets.length) window.keyExpMap.set(key, live);\r\n        });\r\n    }\r\n});\r\n\r\n// --- External Control API ---\r\nwindow._pendingRenderableObject = null;\r\nwindow._pendingShow = false;\r\n\r\n/**\r\n * テロップを表示する関数\r\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\r\n */\r\nwindow.showTelop = function (rendarableObject) {\r\n    if (rendarableObject !== undefined) {\r\n        window.updateTelop(rendarableObject);\r\n    }\r\n\r\n    if (!window.initialized) {\r\n        window._pendingShow = true;\r\n        return;\r\n    }\r\n\r\n    // containerId is exposed by initPlayer\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        if (!divElement.classList.contains(\"in_animation\")) {\r\n            divElement.classList.remove(...divElement.classList);\r\n            divElement.style.opacity = \"0\";\r\n            \r\n            const triggerShow = () => {\r\n                requestAnimationFrame(() => {\r\n                    requestAnimationFrame(() => {\r\n                        divElement.style.opacity = \"\";\r\n                        divElement.classList.add(\"in_animation\");\r\n                        document.body.style.display = \"block\";\r\n                    });\r\n                });\r\n            };\r\n\r\n            if (document.fonts && document.fonts.ready) {\r\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\r\n            } else {\r\n                triggerShow();\r\n            }\r\n        }\r\n    }\r\n};\r\n\r\n/**\r\n * テロップの内容を更新する関数\r\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\r\n */\r\nwindow.updateTelop = function (rendarableObject) {\r\n    console.log(\"updateTelop called\", rendarableObject);\r\n    if (!rendarableObject) return;\r\n\r\n    // Globals exposed by renderer.js\r\n    const app = window.telopApp;\r\n    const doc = window.telopDoc;\r\n    const keyExpMap = window.keyExpMap;\r\n    const createNode = window.createNode;\r\n\r\n    if (!app || !doc || !keyExpMap || !createNode) {\r\n        console.error(\"updateTelop early return: Missing required globals:\", { app: !!app, doc: !!doc, keyExpMap: !!keyExpMap, createNode: !!createNode });\r\n        console.warn(\"Player not fully initialized yet. Caching update...\");\r\n        window._pendingRenderableObject = rendarableObject;\r\n        return;\r\n    }\r\n\r\n    let hasUpdates = false;\r\n\r\n    Object.keys(rendarableObject).forEach(key => {\r\n        const val = rendarableObject[key];\r\n        const targets = keyExpMap.get(key);\r\n        console.log(\"Processing key: \" + key + \", targets found: \" + (targets ? targets.length : 0) + \", val: \" + val);\r\n\r\n        if (targets && Array.isArray(targets) && (val || val === \"\")) {\r\n            targets.forEach((target) => {\r\n                if (target.type === 'text') {\r\n                    // Update Doc\r\n                    const strVal = String(val);\r\n                    if (target.nodeData.text !== strVal) {\r\n                        target.nodeData.text = strVal;\r\n                        const nodeInDoc = doc.nodesById[target.nodeData.id];\r\n                        if (nodeInDoc) {\r\n                            nodeInDoc.text = strVal;\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'image') {\r\n                    // Update Doc (Asset)\r\n                    const node = target.nodeData;\r\n                    if (node.assetId && doc.assets[node.assetId]) {\r\n                        if (doc.assets[node.assetId].src !== String(val)) {\r\n                            // Clone asset to avoid clobbering shared assetId entries\r\n                            var uniqueAssetId = node.assetId + '__keyexp_' + key;\r\n                            doc.assets[uniqueAssetId] = Object.assign({}, doc.assets[node.assetId], { src: String(val) });\r\n                            node.assetId = uniqueAssetId;\r\n                            \r\n                            // Also mutate the node inside the active document to persist the change\r\n                            const nodeInDoc = doc.nodesById[node.id];\r\n                            if (nodeInDoc) {\r\n                                nodeInDoc.assetId = uniqueAssetId;\r\n                            }\r\n                            \r\n                            hasUpdates = true;\r\n                        }\r\n                    }\r\n                } else if (target.type === 'appearance_fill') {\r\n                    const apps = target.nodeData.style?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\r\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\r\n                        console.log(\"Updating appearance_fill for \" + target.nodeData.id + \" to \" + val);\r\n                        app.fill = String(val);\r\n                        if (app.gradientConfig) { delete app.gradientConfig; }\r\n                        if (docApp) {\r\n                            docApp.fill = String(val);\r\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'appearance_stroke') {\r\n                    const apps = target.nodeData.style?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\r\n                    if (app && app.color !== String(val)) {\r\n                        console.log(\"Updating appearance_stroke for \" + target.nodeData.id + \" to \" + val);\r\n                        app.color = String(val);\r\n                        if (docApp) {\r\n                            docApp.color = String(val);\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'bg_appearance_fill') {\r\n                    const apps = target.nodeData.background?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\r\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\r\n                        console.log(\"Updating bg_appearance_fill for \" + target.nodeData.id + \" to \" + val);\r\n                        app.fill = String(val);\r\n                        if (app.gradientConfig) { delete app.gradientConfig; }\r\n                        if (docApp) {\r\n                            docApp.fill = String(val);\r\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'bg_appearance_stroke') {\r\n                    const apps = target.nodeData.background?.appearances || [];\r\n                    const app = apps[target.appearanceIndex];\r\n                    const docNode = doc.nodesById[target.nodeData.id];\r\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\r\n                    if (app && app.color !== String(val)) {\r\n                        console.log(\"Updating bg_appearance_stroke for \" + target.nodeData.id + \" to \" + val);\r\n                        app.color = String(val);\r\n                        if (docApp) {\r\n                            docApp.color = String(val);\r\n                        }\r\n                        hasUpdates = true;\r\n                    }\r\n                } else if (target.type === 'appearance_color_rule' || target.type === 'bg_appearance_color_rule' || target.type === 'visibility_condition' || target.type === 'image_reference_condition') {\r\n                    hasUpdates = true;\r\n                }\r\n            });\r\n        }\r\n    });\r\n\r\n    if (rendarableObject.highliteNum !== undefined || rendarableObject.barNum !== undefined) {\r\n        hasUpdates = true;\r\n    }\r\n\r\n    if (hasUpdates) {\r\n        const evaluatedDoc = resolveDynamicVisibility(doc, rendarableObject);\r\n\r\n        // In-place image reference & visibility condition updates (zero-flicker)\r\n        for (const nodeId in evaluatedDoc.nodesById) {\r\n            const prevNode = doc.nodesById[nodeId];\r\n            const nextNode = evaluatedDoc.nodesById[nodeId];\r\n            if (prevNode && nextNode && nextNode.type === 'image') {\r\n                if (prevNode.assetId !== nextNode.assetId) {\r\n                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||\r\n                                      (projectData.assets && projectData.assets[nextNode.assetId]);\r\n                    if (nextAsset && nextAsset.src) {\r\n                        const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                        const imgEl = nodeEl ? nodeEl.querySelector(\"image\") : null;\r\n                        if (imgEl) {\r\n                            const targetSrc = (assetCache && assetCache[nextAsset.src]) ? assetCache[nextAsset.src] : nextAsset.src;\r\n                            imgEl.setAttribute(\"href\", targetSrc);\r\n                        }\r\n                    }\r\n                    prevNode.assetId = nextNode.assetId;\r\n                }\r\n            }\r\n            if (prevNode && nextNode && prevNode.visible !== nextNode.visible) {\r\n                const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\r\n                if (nodeEl) {\r\n                    nodeEl.style.display = nextNode.visible === false ? 'none' : '';\r\n                }\r\n                prevNode.visible = nextNode.visible;\r\n            }\r\n        }\r\n\r\n        window.telopDoc = evaluatedDoc;\r\n\r\n        keyExpMap.clear();\r\n\r\n        try {\r\n            const oldDefs = app.firstChild;\r\n            if (oldDefs) oldDefs.innerHTML = '';\r\n\r\n            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);\r\n            if (newRootNode) {\r\n                if (app.childNodes.length > 1) {\r\n                    app.replaceChild(newRootNode, app.childNodes[1]);\r\n                } else {\r\n                    app.appendChild(newRootNode);\r\n                }\r\n\r\n                while (app.childNodes.length > 2) {\r\n                    app.removeChild(app.lastChild);\r\n                }\r\n            }\r\n        } catch (e) {\r\n            console.error(\"Error creating new root node in updateTelop:\", e);\r\n        }\r\n\r\n        window.dispatchEvent(new CustomEvent('telopRendered', { detail: rendarableObject }));\r\n    }\r\n};\r\n\r\n/**\r\n * テロップを非表示にする関数\r\n */\r\nwindow.hideTelop = function () {\r\n    const divElement = document.getElementById(window.containerId || 'player-container');\r\n    if (divElement) {\r\n        divElement.classList.remove(...divElement.classList);\r\n\r\n        let finished = false;\r\n        const completeHide = () => {\r\n            if (finished) return;\r\n            finished = true;\r\n            divElement.style.opacity = '0';\r\n            divElement.classList.remove(\"out_animation\");\r\n            if (window.animationFinishedCallback) {\r\n                window.animationFinishedCallback();\r\n            }\r\n            divElement.removeEventListener('animationend', onAnimationEnd);\r\n        };\r\n\r\n        const onAnimationEnd = (e) => {\r\n            if (!divElement.classList.contains(\"out_animation\")) return;\r\n            completeHide();\r\n        };\r\n\r\n        divElement.addEventListener('animationend', onAnimationEnd);\r\n        divElement.classList.add(\"out_animation\");\r\n\r\n        // Safety fallback: if no animation or animationend doesn't fire, complete after duration or max 1s\r\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\r\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\r\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\r\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\r\n        setTimeout(() => {\r\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\r\n                completeHide();\r\n            }\r\n        }, timeoutMs);\r\n    }\r\n};\r\n\r\n\r\n// 3. Initialization\r\nwindow.addEventListener('load', async () => {\r\n    try {\r\n        if (document.fonts && document.fonts.ready) {\r\n            await document.fonts.ready;\r\n        }\r\n        const dataUrl = './1Shot.telop';\r\n        const dataResp = await fetch(dataUrl);\r\n        if (dataResp.ok) {\r\n            projectData = await dataResp.json();\r\n            console.log(\"[Player] Loaded project data from:\", dataUrl);\r\n        }\r\n        assetCache = {};\r\n        if (window.initPlayer) {\r\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\r\n                window.initialized = true;\r\n                if (window._pendingRenderableObject) {\r\n                    window.updateTelop(window._pendingRenderableObject);\r\n                    window._pendingRenderableObject = null;\r\n                }\r\n                if (window._pendingShow) {\r\n                    window.showTelop();\r\n                    window._pendingShow = false;\r\n                }\r\n            });\r\n        }\r\n    } catch (e) {\r\n        console.error(\"[Player] Failed to initialize project data:\", e);\r\n    }\r\n});\r\n"
      },
      "children": [
        {
          "type": "image",
          "name": "1SHOT用ザブトン",
          "src": "../../1Shot/img/HD2D_S01_Base1.png",
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
                    "rotation": 1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 5,
                    "skewY": -2,
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
                    "rotation": 1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 5,
                    "skewY": -2,
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
                    "rotation": 1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 5,
                    "skewY": -2,
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
                    "rotation": 1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 5,
                    "skewY": -2,
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
                    "y": -2,
                    "rotation": 1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": 5,
                    "skewY": -2,
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
          "src": "../../1Shot/img/HD2D_S01_ZabuTeam.png",
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
          "src": "../../1Shot/img/HD2D_S01_ZabuTeam.png",
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
            "fitMode": "shrink_x",
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
                "keyexp": "学年単位"
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
                "keyexp": "",
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "役職表示",
                  "operator": "equals",
                  "value": "0"
                }
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
                "keyexp": "身長",
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "役職表示",
                  "operator": "equals",
                  "value": "0"
                }
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
                "keyexp": "",
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "役職表示",
                  "operator": "equals",
                  "value": "0"
                }
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
                "keyexp": "体重",
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "役職表示",
                  "operator": "equals",
                  "value": "0"
                }
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "蹴り上げマーク",
          "src": "../../1Shot/img/HD2D_S00_MarkHighSchool.png",
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
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 205,
            "height": 240,
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
          "text": "pro2",
          "w": 60,
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
            "visible": false,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "text": "pro2",
            "width": 60,
            "padding": 0,
            "align": "left",
            "verticalAlign": "top",
            "fitMode": "none",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 48,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": false,
                  "color": "#000000",
                  "thickness": 0,
                  "lineJoin": "round",
                  "miterLimit": 10
                }
              ]
            },
            "keyexp": "mode"
          }
        },
        {
          "type": "text",
          "name": "役職表示",
          "text": "0",
          "w": 40,
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
            "visible": false,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "text": "0",
            "width": 40,
            "padding": 0,
            "align": "left",
            "verticalAlign": "top",
            "fitMode": "none",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 48,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": false,
                  "color": "#000000",
                  "thickness": 0,
                  "lineJoin": "round",
                  "miterLimit": 10
                }
              ]
            },
            "keyexp": "役職表示"
          }
        }
      ]
    }
  ]
};
