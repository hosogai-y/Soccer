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
        "customJs": "\n// 1. Data Loading (Auto-generated)\nlet projectData = null;\nlet assetCache = {};\n\n// 2. Controller Logic (Editable)\n// Customized: スタッフ（監督・コーチ）表示のレイアウト切替\n\n/**\n * スタッフ表示（役職表示 = 1）: 役職（ポジション）を背番号の位置へ移し、チームカラーザブトンを文字数に応じて伸ばす。\n * ザブトンは右端（氏名側）を固定して左へ伸ばし、蹴り上げマークの手前までに収める（長い役職は shrink_x で縮む）。\n * 選手表示（役職表示 = 0）では projectData の元の配置・色に戻す。\n */\nconst STAFF_LAYOUT = {\n    flagKey: '役職表示',\n    zabutonGroup: 'チームカラーザブトン',\n    zabutonRects: ['ベースカラー', 'グラデーションマット'],\n    roleText: 'ポジション',\n    numberText: '背番号',\n    leftLimitNode: '蹴り上げマーク', // ザブトンはこのノードの右端より左へは伸ばさない\n    padding: 8, // 文字とザブトン端の余白 (px)\n    unitText: '年(単位)', // 学年単位（スタッフは「歳」）\n    unitShiftX: 5 // スタッフ表示では年齢の数字と「歳」が重なるので右へずらす (px)\n};\nlet staffLayoutOn = false;\n// 元の配置・色。telopDoc のノードは projectData と同じオブジェクトなので、書き換える前に複製しておく\nlet staffLayoutOrig = null;\n\nconst findByName = (d, name) => Object.values(d.nodesById).find(n => n && n.name === name);\nconst cloneJson = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));\n\n/** 全角 1em・半角 0.6em で役職の表示幅を見積もる */\nfunction estimateTextWidth(text, fontSize) {\n    let em = 0;\n    for (const ch of String(text || '')) em += ch.charCodeAt(0) > 0xff ? 1 : 0.6;\n    return em * fontSize;\n}\n\n/** 役職・ザブトンの配置を doc に書き込み、変わったノード ID を返す */\nfunction applyStaffLayout(d, values) {\n    if (!d || !d.nodesById) return [];\n    if (!staffLayoutOrig) {\n        staffLayoutOrig = {};\n        Object.values(d.nodesById).forEach(n => {\n            if (n && [STAFF_LAYOUT.roleText, STAFF_LAYOUT.unitText, ...STAFF_LAYOUT.zabutonRects].includes(n.name)) {\n                staffLayoutOrig[n.id] = cloneJson({ x: n.x, y: n.y, width: n.width, height: n.height, style: n.style });\n            }\n        });\n    }\n    const group = findByName(d, STAFF_LAYOUT.zabutonGroup);\n    const role = findByName(d, STAFF_LAYOUT.roleText);\n    const number = findByName(d, STAFF_LAYOUT.numberText);\n    const unit = findByName(d, STAFF_LAYOUT.unitText);\n    if (!group || !role || !number) return [];\n    const rects = (group.children || []).map(id => d.nodesById[id]).filter(n => n && STAFF_LAYOUT.zabutonRects.includes(n.name));\n    const o = id => staffLayoutOrig[id];\n    const before = JSON.stringify([role.x, role.y, role.width, role.height, role.style, rects.map(r => [r.x, r.width]), unit && unit.x]);\n\n    // まず元の配置・色に戻す\n    ['x', 'y', 'width', 'height'].forEach(k => { if (o(role.id)) role[k] = o(role.id)[k]; });\n    if (o(role.id)) role.style = cloneJson(o(role.id).style);\n    rects.forEach(r => { if (o(r.id)) { r.x = o(r.id).x; r.width = o(r.id).width; } });\n    if (unit && o(unit.id)) unit.x = o(unit.id).x;\n\n    if (staffLayoutOn) {\n        if (unit && o(unit.id)) unit.x = o(unit.id).x + STAFF_LAYOUT.unitShiftX;\n        const parent = group.parentId ? d.nodesById[group.parentId] : null;\n        const scaleX = group.scaleX || 1;\n        const baseRect = rects[0];\n        const origRect = o(baseRect.id);\n        // ザブトンの右端（絶対座標）を固定\n        const groupAbsX = (parent ? parent.x : 0) + group.x;\n        const rightAbs = groupAbsX + (origRect.x + origRect.width) * scaleX;\n        const limit = findByName(d, STAFF_LAYOUT.leftLimitNode);\n        const leftLimitAbs = limit ? limit.x + (limit.width || 0) + 4 : rightAbs - 160;\n        const fontSize = (role.style && role.style.fontSize) || 36;\n        const roleText = values && values[STAFF_LAYOUT.roleText] !== undefined ? values[STAFF_LAYOUT.roleText] : role.text;\n        const wanted = estimateTextWidth(roleText, fontSize) + STAFF_LAYOUT.padding * 2;\n        const width = Math.max(origRect.width * scaleX, Math.min(wanted, rightAbs - leftLimitAbs));\n        const localWidth = width / scaleX;\n        rects.forEach(r => {\n            const or = o(r.id);\n            r.width = localWidth;\n            r.x = or.x + or.width - localWidth;\n        });\n        // 役職をザブトンの上（背番号と同じ高さ・色）へ\n        const leftAbs = rightAbs - width;\n        role.x = leftAbs + STAFF_LAYOUT.padding;\n        role.width = width - STAFF_LAYOUT.padding * 2;\n        role.y = number.y + ((number.height || 0) - (role.height || 0)) / 2;\n        if (number.style && number.style.appearances) {\n            role.style = Object.assign({}, role.style, { appearances: cloneJson(number.style.appearances) });\n        }\n    }\n    const after = JSON.stringify([role.x, role.y, role.width, role.height, role.style, rects.map(r => [r.x, r.width]), unit && unit.x]);\n    return before === after ? [] : [role.id, group.id, ...(unit ? [unit.id] : [])];\n}\n\n/**\n * TelopHub の OnAir / Preview は updateTelop を差し替えるが、更新のたびに 'telopRendered'（detail = 受け取ったデータ）が届く。\n * ここで配置を反映し、変わったノードだけ DOM を作り直す（フォーメーション左／右と同じ方式）。\n */\nwindow.addEventListener('telopRendered', (e) => {\n    const values = (e && e.detail) || {};\n    if (values[STAFF_LAYOUT.flagKey] !== undefined) staffLayoutOn = String(values[STAFF_LAYOUT.flagKey]) === '1';\n    const doc = window.telopDoc;\n    const app = window.telopApp;\n    if (!doc || !doc.nodesById || !app || !window.createNode) return;\n    const changed = applyStaffLayout(doc, values);\n    changed.forEach(id => {\n        const node = doc.nodesById[id];\n        const map = window.nodeElementMap;\n        const oldEl = (map && map.get(id) && map.get(id).isConnected) ? map.get(id) : app.querySelector('[data-node-id=\"' + id + '\"]');\n        if (!node || !oldEl || !oldEl.parentNode) return;\n        try {\n            const parent = node.parentId ? doc.nodesById[node.parentId] : null;\n            const newEl = window.createNode(id, undefined, !!parent && parent.type === 'telop');\n            if (!newEl) return;\n            oldEl.parentNode.replaceChild(newEl, oldEl);\n            if (map) map.set(id, newEl);\n        } catch (err) {\n            console.warn('[StaffLayout] re-create failed for ' + node.name, err);\n        }\n    });\n    // 作り直した要素の古い keyExp 登録を外す（次の UPDATE で外れた要素を書き換えないように）\n    if (changed.length && window.keyExpMap) {\n        window.keyExpMap.forEach((targets, key) => {\n            const live = targets.filter(t => !t.element || t.element.isConnected);\n            if (live.length !== targets.length) window.keyExpMap.set(key, live);\n        });\n    }\n});\n\n// --- External Control API ---\nwindow._pendingRenderableObject = null;\nwindow._pendingShow = false;\n\n/**\n * テロップを表示する関数\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\n */\nwindow.showTelop = function (rendarableObject) {\n    if (rendarableObject !== undefined) {\n        window.updateTelop(rendarableObject);\n    }\n\n    if (!window.initialized) {\n        window._pendingShow = true;\n        return;\n    }\n\n    // containerId is exposed by initPlayer\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        if (!divElement.classList.contains(\"in_animation\")) {\n            divElement.classList.remove(...divElement.classList);\n            divElement.style.opacity = \"0\";\n            \n            const triggerShow = () => {\n                requestAnimationFrame(() => {\n                    requestAnimationFrame(() => {\n                        divElement.style.opacity = \"\";\n                        divElement.classList.add(\"in_animation\");\n                        document.body.style.display = \"block\";\n                    });\n                });\n            };\n\n            if (document.fonts && document.fonts.ready) {\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\n            } else {\n                triggerShow();\n            }\n        }\n    }\n};\n\n/**\n * テロップの内容を更新する関数\n * @param {Object} rendarableObject - レンダリング可能なオブジェクト。\n */\nwindow.updateTelop = function (rendarableObject) {\n    console.log(\"updateTelop called\", rendarableObject);\n    if (!rendarableObject) return;\n\n    // Globals exposed by renderer.js\n    const app = window.telopApp;\n    const doc = window.telopDoc;\n    const keyExpMap = window.keyExpMap;\n    const createNode = window.createNode;\n\n    if (!app || !doc || !keyExpMap || !createNode) {\n        console.error(\"updateTelop early return: Missing required globals:\", { app: !!app, doc: !!doc, keyExpMap: !!keyExpMap, createNode: !!createNode });\n        console.warn(\"Player not fully initialized yet. Caching update...\");\n        window._pendingRenderableObject = rendarableObject;\n        return;\n    }\n\n    let hasUpdates = false;\n\n    Object.keys(rendarableObject).forEach(key => {\n        const val = rendarableObject[key];\n        const targets = keyExpMap.get(key);\n        console.log(\"Processing key: \" + key + \", targets found: \" + (targets ? targets.length : 0) + \", val: \" + val);\n\n        if (targets && Array.isArray(targets) && (val || val === \"\")) {\n            targets.forEach((target) => {\n                if (target.type === 'text') {\n                    // Update Doc\n                    const strVal = String(val);\n                    if (target.nodeData.text !== strVal) {\n                        target.nodeData.text = strVal;\n                        const nodeInDoc = doc.nodesById[target.nodeData.id];\n                        if (nodeInDoc) {\n                            nodeInDoc.text = strVal;\n                        }\n                        hasUpdates = true;\n                    }\n                } else if (target.type === 'image') {\n                    // Update Doc (Asset)\n                    const node = target.nodeData;\n                    if (node.assetId && doc.assets[node.assetId]) {\n                        if (doc.assets[node.assetId].src !== String(val)) {\n                            // Clone asset to avoid clobbering shared assetId entries\n                            var uniqueAssetId = node.assetId + '__keyexp_' + key;\n                            doc.assets[uniqueAssetId] = Object.assign({}, doc.assets[node.assetId], { src: String(val) });\n                            node.assetId = uniqueAssetId;\n                            \n                            // Also mutate the node inside the active document to persist the change\n                            const nodeInDoc = doc.nodesById[node.id];\n                            if (nodeInDoc) {\n                                nodeInDoc.assetId = uniqueAssetId;\n                            }\n                            \n                            hasUpdates = true;\n                        }\n                    }\n                } else if (target.type === 'appearance_fill') {\n                    const apps = target.nodeData.style?.appearances || [];\n                    const app = apps[target.appearanceIndex];\n                    const docNode = doc.nodesById[target.nodeData.id];\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\n                        console.log(\"Updating appearance_fill for \" + target.nodeData.id + \" to \" + val);\n                        app.fill = String(val);\n                        if (app.gradientConfig) { delete app.gradientConfig; }\n                        if (docApp) {\n                            docApp.fill = String(val);\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\n                        }\n                        hasUpdates = true;\n                    }\n                } else if (target.type === 'appearance_stroke') {\n                    const apps = target.nodeData.style?.appearances || [];\n                    const app = apps[target.appearanceIndex];\n                    const docNode = doc.nodesById[target.nodeData.id];\n                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];\n                    if (app && app.color !== String(val)) {\n                        console.log(\"Updating appearance_stroke for \" + target.nodeData.id + \" to \" + val);\n                        app.color = String(val);\n                        if (docApp) {\n                            docApp.color = String(val);\n                        }\n                        hasUpdates = true;\n                    }\n                } else if (target.type === 'bg_appearance_fill') {\n                    const apps = target.nodeData.background?.appearances || [];\n                    const app = apps[target.appearanceIndex];\n                    const docNode = doc.nodesById[target.nodeData.id];\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\n                    if (app && (app.fill !== String(val) || app.gradientConfig)) {\n                        console.log(\"Updating bg_appearance_fill for \" + target.nodeData.id + \" to \" + val);\n                        app.fill = String(val);\n                        if (app.gradientConfig) { delete app.gradientConfig; }\n                        if (docApp) {\n                            docApp.fill = String(val);\n                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }\n                        }\n                        hasUpdates = true;\n                    }\n                } else if (target.type === 'bg_appearance_stroke') {\n                    const apps = target.nodeData.background?.appearances || [];\n                    const app = apps[target.appearanceIndex];\n                    const docNode = doc.nodesById[target.nodeData.id];\n                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];\n                    if (app && app.color !== String(val)) {\n                        console.log(\"Updating bg_appearance_stroke for \" + target.nodeData.id + \" to \" + val);\n                        app.color = String(val);\n                        if (docApp) {\n                            docApp.color = String(val);\n                        }\n                        hasUpdates = true;\n                    }\n                } else if (target.type === 'appearance_color_rule' || target.type === 'bg_appearance_color_rule' || target.type === 'visibility_condition' || target.type === 'image_reference_condition') {\n                    hasUpdates = true;\n                }\n            });\n        }\n    });\n\n    if (rendarableObject.highliteNum !== undefined || rendarableObject.barNum !== undefined) {\n        hasUpdates = true;\n    }\n\n    if (hasUpdates) {\n        const evaluatedDoc = resolveDynamicVisibility(doc, rendarableObject);\n\n        // In-place image reference & visibility condition updates (zero-flicker)\n        for (const nodeId in evaluatedDoc.nodesById) {\n            const prevNode = doc.nodesById[nodeId];\n            const nextNode = evaluatedDoc.nodesById[nodeId];\n            if (prevNode && nextNode && nextNode.type === 'image') {\n                if (prevNode.assetId !== nextNode.assetId) {\n                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||\n                                      (projectData.assets && projectData.assets[nextNode.assetId]);\n                    if (nextAsset && nextAsset.src) {\n                        const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\n                        const imgEl = nodeEl ? nodeEl.querySelector(\"image\") : null;\n                        if (imgEl) {\n                            const targetSrc = (assetCache && assetCache[nextAsset.src]) ? assetCache[nextAsset.src] : nextAsset.src;\n                            imgEl.setAttribute(\"href\", targetSrc);\n                        }\n                    }\n                    prevNode.assetId = nextNode.assetId;\n                }\n            }\n            if (prevNode && nextNode && prevNode.visible !== nextNode.visible) {\n                const nodeEl = app.querySelector('[data-node-id=\"' + nodeId + '\"]');\n                if (nodeEl) {\n                    nodeEl.style.display = nextNode.visible === false ? 'none' : '';\n                }\n                prevNode.visible = nextNode.visible;\n            }\n        }\n\n        window.telopDoc = evaluatedDoc;\n\n        keyExpMap.clear();\n\n        try {\n            const oldDefs = app.firstChild;\n            if (oldDefs) oldDefs.innerHTML = '';\n\n            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);\n            if (newRootNode) {\n                if (app.childNodes.length > 1) {\n                    app.replaceChild(newRootNode, app.childNodes[1]);\n                } else {\n                    app.appendChild(newRootNode);\n                }\n\n                while (app.childNodes.length > 2) {\n                    app.removeChild(app.lastChild);\n                }\n            }\n        } catch (e) {\n            console.error(\"Error creating new root node in updateTelop:\", e);\n        }\n\n        window.dispatchEvent(new CustomEvent('telopRendered', { detail: rendarableObject }));\n    }\n};\n\n/**\n * テロップを非表示にする関数\n */\nwindow.hideTelop = function () {\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        divElement.classList.remove(...divElement.classList);\n\n        let finished = false;\n        const completeHide = () => {\n            if (finished) return;\n            finished = true;\n            divElement.style.opacity = '0';\n            divElement.classList.remove(\"out_animation\");\n            if (window.animationFinishedCallback) {\n                window.animationFinishedCallback();\n            }\n            divElement.removeEventListener('animationend', onAnimationEnd);\n        };\n\n        const onAnimationEnd = (e) => {\n            if (!divElement.classList.contains(\"out_animation\")) return;\n            completeHide();\n        };\n\n        divElement.addEventListener('animationend', onAnimationEnd);\n        divElement.classList.add(\"out_animation\");\n\n        // Safety fallback: if no animation or animationend doesn't fire, complete after duration or max 1s\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\n        setTimeout(() => {\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\n                completeHide();\n            }\n        }, timeoutMs);\n    }\n};\n\n\n// 3. Initialization\nwindow.addEventListener('load', async () => {\n    try {\n        if (document.fonts && document.fonts.ready) {\n            await document.fonts.ready;\n        }\n        const dataUrl = './1Shot.telop';\n        const dataResp = await fetch(dataUrl);\n        if (dataResp.ok) {\n            projectData = await dataResp.json();\n            console.log(\"[Player] Loaded project data from:\", dataUrl);\n        }\n        assetCache = {};\n        if (window.initPlayer) {\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\n                window.initialized = true;\n                if (window._pendingRenderableObject) {\n                    window.updateTelop(window._pendingRenderableObject);\n                    window._pendingRenderableObject = null;\n                }\n                if (window._pendingShow) {\n                    window.showTelop();\n                    window._pendingShow = false;\n                }\n            });\n        }\n    } catch (e) {\n        console.error(\"[Player] Failed to initialize project data:\", e);\n    }\n});\n"
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
                  "type": "rect",
                  "name": "エッジ左",
                  "w": 4,
                  "h": 54,
                  "raw": {
                    "x": -45,
                    "y": -2,
                    "rotation": 0,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -10,
                    "skewY": 0,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 6,
                    "height": 64,
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
                    "x": 18,
                    "y": -2,
                    "rotation": 0,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -10,
                    "skewY": 0,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 6,
                    "height": 64,
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
                    "x": -39,
                    "y": -2,
                    "rotation": 0,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -10,
                    "skewY": 0,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 57,
                    "height": 64,
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
                    "x": -10.5,
                    "y": -2,
                    "rotation": 0,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -10,
                    "skewY": 0,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 28.5,
                    "height": 64,
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
                    "x": -39,
                    "y": -2,
                    "rotation": 0,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -10,
                    "skewY": 0,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 57,
                    "height": 64,
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
