// Pulled from telop "アディショナルタイム" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/アディショナルタイム.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "アディショナルタイム",
      "raw": {
        "skewX": 0,
        "skewY": 0,
        "x": 2,
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
        "customJs": "// 1. Data Loading (Auto-generated)\nlet projectData = null;\nlet assetCache = {};\n\n// 2. Controller Logic (Customized for アディショナルタイム)\nwindow._pendingRenderableObject = null;\nwindow._pendingShow = false;\nwindow._currentLossTimeData = null;\n\n// ノードIDは TelopEditor の保存や telopkit push で振り直されるため、keyExp / ノード名から毎回引く\nfunction nodeSel(key) {\n    const doc = window.telopDoc;\n    const nodes = doc && doc.nodesById ? Object.values(doc.nodesById) : [];\n    const node = nodes.find(n => n.keyexp === key) || nodes.find(n => n.name === key);\n    return node ? '[data-node-id=\"' + node.id + '\"]' : '[data-node-id=\"__none__\"]';\n}\n\nfunction applyLossTimeCustom(rendarableObject) {\n    const app = window.telopApp;\n    if (!app || !rendarableObject) return;\n\n    // テキストノードは確実に非表示\n    const textEl = app.querySelector(nodeSel('アディショナルテキスト'));\n    if (textEl) textEl.style.display = 'none';\n\n    // アディショナル表示画像ノード (ID: n1_spfa7kl7merx)\n    const imgNodeEl = app.querySelector(nodeSel('アディショナル表示'));\n    if (!imgNodeEl) return;\n    const imgEl = imgNodeEl.querySelector('image');\n    if (!imgEl) return;\n\n    // 送出GUIで選択した数値をキーにして、LossSlide_1～9.pngファイルを変更\n    let num = rendarableObject['アディショナルタイム'] || rendarableObject.lossTime || rendarableObject['アディショナル表示'] || '1';\n    \n    // 文字列から数字（1〜9）を抽出\n    const match = String(num).match(/[1-9]/);\n    const digit = match ? match[0] : '1';\n    const targetSrc = `img/LossSlide_${digit}.png`;\n\n    imgEl.setAttribute('href', targetSrc);\n}\n\n/**\n * テロップを表示する関数\n */\nwindow.showTelop = function (rendarableObject) {\n    if (rendarableObject !== undefined) {\n        // Hub が window.updateTelop を差し替えている場合でも、表示時に描く値を必ず選択中の値にする\n        // (古い値のまま描くと、どれを選んでも +1 で出てしまう)\n        window._currentLossTimeData = Object.assign({}, window._currentLossTimeData, rendarableObject);\n        window.updateTelop(rendarableObject);\n    }\n\n    if (!window.initialized) {\n        window._pendingShow = true;\n        return;\n    }\n\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        if (!divElement.classList.contains(\"in_animation\")) {\n            divElement.classList.remove(...divElement.classList);\n            divElement.style.opacity = \"0\";\n            \n            const triggerShow = () => {\n                requestAnimationFrame(() => {\n                    requestAnimationFrame(() => {\n                        divElement.style.opacity = \"\";\n                        divElement.classList.add(\"in_animation\");\n                        document.body.style.display = \"block\";\n                        if (window._currentLossTimeData) {\n                            applyLossTimeCustom(window._currentLossTimeData);\n                        }\n                    });\n                });\n            };\n\n            if (document.fonts && document.fonts.ready) {\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\n            } else {\n                triggerShow();\n            }\n        }\n    }\n};\n\n/**\n * テロップの内容を更新する関数\n */\nwindow.updateTelop = function (rendarableObject) {\n    console.log(\"アディショナルタイム updateTelop called\", rendarableObject);\n    if (!rendarableObject) return;\n    window._currentLossTimeData = Object.assign({}, window._currentLossTimeData, rendarableObject);\n\n    const app = window.telopApp;\n    const doc = window.telopDoc;\n\n    if (!app || !doc) {\n        window._pendingRenderableObject = rendarableObject;\n        return;\n    }\n\n    applyLossTimeCustom(window._currentLossTimeData);\n};\n\n/**\n * テロップを非表示にする関数\n */\nwindow.hideTelop = function () {\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        divElement.classList.remove(...divElement.classList);\n\n        let finished = false;\n        const completeHide = () => {\n            if (finished) return;\n            finished = true;\n            divElement.style.opacity = '0';\n            divElement.classList.remove(\"out_animation\");\n            if (window.animationFinishedCallback) {\n                window.animationFinishedCallback();\n            }\n            divElement.removeEventListener('animationend', onAnimationEnd);\n        };\n\n        const onAnimationEnd = (e) => {\n            if (!divElement.classList.contains(\"out_animation\")) return;\n            completeHide();\n        };\n\n        divElement.addEventListener('animationend', onAnimationEnd);\n        divElement.classList.add(\"out_animation\");\n\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\n        setTimeout(() => {\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\n                completeHide();\n            }\n        }, timeoutMs);\n    }\n};\n\n// 3. Initialization\nwindow.addEventListener('load', async () => {\n    try {\n        if (document.fonts && document.fonts.ready) {\n            await document.fonts.ready;\n        }\n        const dataUrl = './アディショナルタイム.telop';\n        const dataResp = await fetch(dataUrl);\n        if (dataResp.ok) {\n            projectData = await dataResp.json();\n        }\n        assetCache = {};\n        if (window.initPlayer) {\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\n                window.initialized = true;\n                if (window._pendingRenderableObject) {\n                    window.updateTelop(window._pendingRenderableObject);\n                    window._pendingRenderableObject = null;\n                } else if (window._currentLossTimeData) {\n                    applyLossTimeCustom(window._currentLossTimeData);\n                }\n                if (window._pendingShow) {\n                    window.showTelop();\n                    window._pendingShow = false;\n                }\n            });\n        }\n    } catch (e) {\n        console.error(\"[Player] Failed to initialize アディショナルタイム:\", e);\n    }\n});\n"
      },
      "children": [
        {
          "type": "rect",
          "name": "Rectangle",
          "w": 45,
          "h": 23,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 232,
            "y": 84,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 45,
            "height": 23,
            "style": {
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ff0000",
                  "strokeEnabled": false,
                  "color": "#000000",
                  "thickness": 2,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "effects": [
                    {
                      "id": "b5c8b01f-7afb-49b8-b096-c6c610c797ec",
                      "type": "alpha-gradient",
                      "enabled": true,
                      "params": {
                        "type": 1,
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#ffffff80"
                          },
                          {
                            "offset": 0.5,
                            "color": "#ffffff"
                          },
                          {
                            "offset": 1,
                            "color": "#ffffff87"
                          }
                        ],
                        "angle": 0,
                        "units": "objectBoundingBox"
                      }
                    }
                  ]
                }
              ],
              "cornerRadius": 10
            },
            "visible": false,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "text",
          "name": "アディショナルタイム",
          "text": "+00",
          "w": 39,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 235,
            "y": 84,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 39,
            "height": 23,
            "text": "+00",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 17,
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
                }
              ],
              "letterSpacing": 0,
              "lineHeight": 1.2
            },
            "align": "center",
            "verticalAlign": "middle",
            "visible": false,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "fitMode": "none",
            "keyexp": "アディショナルテキスト"
          }
        },
        {
          "type": "image",
          "name": "アディショナル表示",
          "src": "../../アディショナルタイム/img/LossSlide_5.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 318,
            "y": 74,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 240,
            "height": 42,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "アディショナル表示"
          }
        }
      ]
    }
  ]
};
