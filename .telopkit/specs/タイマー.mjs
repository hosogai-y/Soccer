// Pulled from telop "タイマー" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/タイマー.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "タイマー",
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
        "customJs": "// 1. Data Loading (Auto-generated)\nlet projectData = null;\nlet assetCache = {};\n\n// 2. Controller Logic (Customized for TGA-parts Timer)\nwindow._pendingRenderableObject = null;\nwindow._pendingShow = false;\nwindow._currentTimerData = { 時刻: '0:00', 前後半: '前半' };\n\n// ノードIDは TelopEditor の保存や telopkit push で振り直されるため、keyExp / ノード名から毎回引く\nfunction nodeSel(key) {\n    const doc = window.telopDoc;\n    const nodes = doc && doc.nodesById ? Object.values(doc.nodesById) : [];\n    const node = nodes.find(n => n.keyexp === key) || nodes.find(n => n.name === key);\n    return node ? '[data-node-id=\"' + node.id + '\"]' : '[data-node-id=\"__none__\"]';\n}\n\nfunction applyTimerCustom(rendarableObject) {\n    const app = window.telopApp;\n    if (!app || !rendarableObject) return;\n\n    // 1. テキストノードは確実に非表示\n    const t1 = app.querySelector(nodeSel('時刻'));\n    const t2 = app.querySelector(nodeSel('前後半'));\n    if (t1) { t1.style.display = 'none'; t1.setAttribute('visibility', 'hidden'); }\n    if (t2) { t2.style.display = 'none'; t2.setAttribute('visibility', 'hidden'); }\n\n    // 2. 前後半延長画像の切り替え (ID: n1_koxd84ybqjfc)\n    // ※ setAttribute('transform', ...) は絶対に行わず、SVGの元配置 matrix(1, 0, 0, 1, 72, 74) を維持！\n    const halfNode = app.querySelector(nodeSel('前半後半延長'));\n    const halfImg = halfNode ? halfNode.querySelector('image') : null;\n    const halfText = String(rendarableObject['前後半'] || '前半').trim();\n\n    if (halfImg) {\n        let halfSrc = rendarableObject['前半後半延長'] || 'img/HD2D_P01_Moji_1.png';\n        if (!rendarableObject['前半後半延長']) {\n            // 「延長後半」は「後半」も含むため、延長の判定を先に行う\n            if (halfText.includes('延後') || halfText.includes('延長後半') || halfText === 'Ex2') {\n                halfSrc = 'img/HD2D_P01_Moji_4.png';\n            } else if (halfText.includes('延前') || halfText.includes('延長前半') || halfText === 'Ex1') {\n                halfSrc = 'img/HD2D_P01_Moji_3.png';\n            } else if (halfText.includes('後半') || halfText === '2nd') {\n                halfSrc = 'img/HD2D_P01_Moji_2.png';\n            }\n        }\n        halfImg.setAttribute('href', halfSrc);\n        halfImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', halfSrc);\n    }\n\n    // 3. 時刻文字列の解析 (\"0:00\", \"9:59\", \"10:00\", \"45:00\", \"100:00\")\n    const timeStr = String(rendarableObject['時刻'] || '0:00').trim();\n    const parts = timeStr.split(':');\n    const minStr = parts[0] || '0';\n    const secStr = parts[1] || '00';\n    const minVal = parseInt(minStr, 10) || 0;\n\n    // 3桁（100分以上）時のみCSS transformで-22pxシフトし、0〜99分の時は空文字にして完璧に板と合わせる！\n    if (halfNode) {\n        // CSS transform は SVG の配置(transform属性)を上書きして (0,0) に飛ぶため translate を使う\n        halfNode.style.transform = '';\n        halfNode.style.translate = minVal >= 100 ? '-22px 0' : '';\n    }\n\n    // 数字・セミコロン画像ノード取得\n    const min3Node = app.querySelector(nodeSel('分３桁'));\n    const min2Node = app.querySelector(nodeSel('分２桁'));\n    const min1Node = app.querySelector(nodeSel('分１桁'));\n    const colonNode = app.querySelector(nodeSel('セミコロン'));\n    const sec2Node = app.querySelector(nodeSel('秒２桁'));\n    const sec1Node = app.querySelector(nodeSel('秒１桁'));\n\n    const setNodeVisible = (node, visible) => {\n        if (!node) return;\n        if (visible) {\n            // エディタで非表示のノード(分３桁)はプレイヤーが !important で隠しているので外す\n            ['display', 'visibility', 'opacity', 'animation'].forEach(prop => node.style.removeProperty(prop));\n            node.removeAttribute('display');\n            node.classList.remove('is-invisible');\n        } else {\n            node.style.display = 'none';\n        }\n        node.setAttribute('visibility', visible ? 'visible' : 'hidden');\n    };\n\n    const clearNodeImage = (node) => {\n        if (!node) return;\n        const img = node.querySelector('image');\n        if (img) {\n            img.setAttribute('href', '');\n            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '');\n        }\n    };\n\n    const setNodeImage = (node, customPath, fallbackDigit) => {\n        if (!node) return;\n        const img = node.querySelector('image');\n        if (img) {\n            const src = customPath || (fallbackDigit !== undefined ? `img/Time_${fallbackDigit}.png` : '');\n            if (src) {\n                img.setAttribute('href', src);\n                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);\n            } else {\n                img.setAttribute('href', '');\n                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '');\n            }\n        }\n    };\n\n    // 分秒の各桁は毎回届く「時刻」から求める。\n    // 桁ごとの画像キー(分１桁 など)は値が変わった時しか届かないことがあり、\n    // 古い値が残ると HIDE→ON で 0:00 から桁が変わるまで表示がずれるため使わない。\n    const min3Custom = '';\n    const min2Custom = '';\n    const min1Custom = '';\n    const sec2Custom = '';\n    const sec1Custom = '';\n    const colonCustom = rendarableObject['セミコロン'] || 'img/Time_10.png';\n\n    // コロンと秒は常に表示\n    if (colonNode) {\n        setNodeVisible(colonNode, true);\n        const colonImg = colonNode.querySelector('image');\n        if (colonImg) {\n            colonImg.setAttribute('href', colonCustom);\n            colonImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', colonCustom);\n        }\n    }\n    setNodeVisible(sec2Node, true);\n    setNodeImage(sec2Node, sec2Custom, secStr[0] || '0');\n    setNodeVisible(sec1Node, true);\n    setNodeImage(sec1Node, sec1Custom, secStr[1] || '0');\n\n    if (minVal < 10) {\n        // 1桁分: 0:00 〜 9:59 (キックオフ・0:00リセット時は確実に 0:00 表記)\n        setNodeVisible(min3Node, false);\n        clearNodeImage(min3Node);\n        setNodeVisible(min2Node, false);\n        clearNodeImage(min2Node);\n        setNodeVisible(min1Node, true);\n        setNodeImage(min1Node, min1Custom, String(minVal));\n    } else if (minVal < 100) {\n        // 2桁分: 10:00 〜 99:59\n        setNodeVisible(min3Node, false);\n        clearNodeImage(min3Node);\n        setNodeVisible(min2Node, true);\n        setNodeImage(min2Node, min2Custom, String(Math.floor(minVal / 10)));\n        setNodeVisible(min1Node, true);\n        setNodeImage(min1Node, min1Custom, String(minVal % 10));\n    } else {\n        // 3桁分: 100:00 〜\n        setNodeVisible(min3Node, true);\n        const mStr = String(minVal);\n        setNodeImage(min3Node, min3Custom, mStr[0]);\n        setNodeVisible(min2Node, true);\n        setNodeImage(min2Node, min2Custom, mStr[1]);\n        setNodeVisible(min1Node, true);\n        setNodeImage(min1Node, min1Custom, mStr[2]);\n    }\n}\n\n/**\n * テロップを表示する関数\n */\nwindow.showTelop = function (rendarableObject) {\n    if (rendarableObject !== undefined) {\n        // Hub が window.updateTelop を差し替えている場合でも、表示時に描く値を必ず最新にする\n        // (古い _currentTimerData のまま描くと HIDE→ON で 0:00 に戻ってしまう)\n        window._currentTimerData = Object.assign({}, window._currentTimerData, rendarableObject);\n        window.updateTelop(rendarableObject);\n    }\n\n    if (!window.initialized) {\n        window._pendingShow = true;\n        return;\n    }\n\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        if (!divElement.classList.contains(\"in_animation\")) {\n            divElement.classList.remove(...divElement.classList);\n            divElement.style.opacity = \"0\";\n            \n            const triggerShow = () => {\n                requestAnimationFrame(() => {\n                    requestAnimationFrame(() => {\n                        divElement.style.opacity = \"\";\n                        divElement.classList.add(\"in_animation\");\n                        document.body.style.display = \"block\";\n                        if (window._currentTimerData) {\n                            applyTimerCustom(window._currentTimerData);\n                        }\n                    });\n                });\n            };\n\n            if (document.fonts && document.fonts.ready) {\n                document.fonts.ready.then(triggerShow).catch(triggerShow);\n            } else {\n                triggerShow();\n            }\n        }\n    }\n};\n\n/**\n * テロップの内容を更新する関数 (毎秒のカウントアップを高速・低負荷で反映)\n */\nfunction timerUpdateTelop(rendarableObject) {\n    if (!rendarableObject) return;\n    window._currentTimerData = Object.assign({}, window._currentTimerData, rendarableObject);\n\n    const app = window.telopApp;\n    const doc = window.telopDoc;\n\n    if (!app || !doc) {\n        window._pendingRenderableObject = rendarableObject;\n        return;\n    }\n\n    // Direct, zero-flicker SVG attribute update for every tick\n    applyTimerCustom(window._currentTimerData);\n}\n\n// TelopHub は window.updateTelop を自前の汎用処理に差し替え、ON 時は showTelop を引数なしで呼ぶ。\n// そのままだと _currentTimerData が古いまま(0:00・前半)で描かれ、以後は値の変わった桁しか描き直されない。\n// 差し替えられても受け取った値を必ず記録し、汎用処理のあとに分秒・前後半を描き直す。\n(function () {\n    let hubUpdateTelop = null;\n    const wrappedUpdateTelop = function (rendarableObject) {\n        if (rendarableObject) {\n            window._currentTimerData = Object.assign({}, window._currentTimerData, rendarableObject);\n        }\n        const result = hubUpdateTelop.apply(window, arguments);\n        const redraw = () => { if (window.telopApp) applyTimerCustom(window._currentTimerData); };\n        if (result && typeof result.then === 'function') {\n            result.then(redraw, redraw);\n        } else {\n            redraw();\n        }\n        return result;\n    };\n    Object.defineProperty(window, 'updateTelop', {\n        configurable: true,\n        get: function () { return hubUpdateTelop ? wrappedUpdateTelop : timerUpdateTelop; },\n        set: function (fn) { hubUpdateTelop = (fn === wrappedUpdateTelop || fn === timerUpdateTelop) ? null : fn; }\n    });\n})();\n\n/**\n * テロップを非表示にする関数\n */\nwindow.hideTelop = function () {\n    const divElement = document.getElementById(window.containerId || 'player-container');\n    if (divElement) {\n        divElement.classList.remove(...divElement.classList);\n\n        let finished = false;\n        const completeHide = () => {\n            if (finished) return;\n            finished = true;\n            divElement.style.opacity = '0';\n            divElement.classList.remove(\"out_animation\");\n            if (window.animationFinishedCallback) {\n                window.animationFinishedCallback();\n            }\n            divElement.removeEventListener('animationend', onAnimationEnd);\n        };\n\n        const onAnimationEnd = (e) => {\n            if (!divElement.classList.contains(\"out_animation\")) return;\n            completeHide();\n        };\n\n        divElement.addEventListener('animationend', onAnimationEnd);\n        divElement.classList.add(\"out_animation\");\n\n        const animTarget = divElement.querySelector('.anim-target') || divElement;\n        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');\n        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');\n        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);\n        setTimeout(() => {\n            if (!finished && divElement.classList.contains(\"out_animation\")) {\n                completeHide();\n            }\n        }, timeoutMs);\n    }\n};\n\n// 3. Initialization\nwindow.addEventListener('load', async () => {\n    try {\n        if (document.fonts && document.fonts.ready) {\n            await document.fonts.ready;\n        }\n        const dataUrl = './タイマー.telop';\n        const dataResp = await fetch(dataUrl);\n        if (dataResp.ok) {\n            projectData = await dataResp.json();\n        }\n        assetCache = {};\n        if (window.initPlayer) {\n            window.initPlayer('player-container', projectData, assetCache).then(() => {\n                window.initialized = true;\n                if (window._pendingRenderableObject) {\n                    window.updateTelop(window._pendingRenderableObject);\n                    window._pendingRenderableObject = null;\n                } else if (window._currentTimerData) {\n                    applyTimerCustom(window._currentTimerData);\n                } else {\n                    applyTimerCustom({ 時刻: '0:00', 前後半: '前半' });\n                }\n                if (window._pendingShow) {\n                    window.showTelop();\n                    window._pendingShow = false;\n                }\n            });\n        }\n    } catch (e) {\n        console.error(\"[Player] Failed to initialize タイマー:\", e);\n    }\n});\n"
      },
      "children": [
        {
          "type": "rect",
          "name": "Rectangle",
          "w": 182,
          "h": 23,
          "raw": {
            "x": 48,
            "y": 83,
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
            "width": 182,
            "height": 23,
            "style": {
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": [
                    "#000000",
                    "#494949",
                    "#000000"
                  ],
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
                  ],
                  "gradientConfig": {
                    "angle": 90,
                    "units": "objectBoundingBox",
                    "stops": [
                      {
                        "offset": 0,
                        "color": "#000000"
                      },
                      {
                        "offset": 0.35,
                        "color": "#494949"
                      },
                      {
                        "offset": 1,
                        "color": "#000000"
                      }
                    ]
                  }
                }
              ],
              "cornerRadius": 10
            }
          }
        },
        {
          "type": "text",
          "name": "時刻",
          "text": "00:00",
          "w": 52,
          "raw": {
            "x": 158,
            "y": 83,
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
            "text": "00:00",
            "width": 52,
            "padding": 0,
            "align": "right",
            "verticalAlign": "middle",
            "fitMode": "none",
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
            "height": 23,
            "keyexp": "時刻"
          }
        },
        {
          "type": "text",
          "name": "前後半",
          "text": "延長前半",
          "w": 76,
          "raw": {
            "x": 69,
            "y": 83,
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
            "text": "延長前半",
            "width": 76,
            "padding": 0,
            "align": "left",
            "verticalAlign": "middle",
            "fitMode": "none",
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
            "height": 24,
            "keyexp": "前後半"
          }
        },
        {
          "type": "image",
          "name": "タイマー用ザブトン",
          "src": "../../タイマー/img/HD2D_P01_BaseTimer.png",
          "raw": {
            "x": 0,
            "y": 74,
            "rotation": 0,
            "scaleX": 0.8434389551470857,
            "scaleY": 0.9999999999999979,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 464,
            "height": 42
          }
        },
        {
          "type": "image",
          "name": "前半後半延長",
          "src": "../../タイマー/img/HD2D_P01_Moji_1.png",
          "raw": {
            "x": 72,
            "y": 74,
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
            "width": 120,
            "height": 42,
            "keyexp": "前半後半延長"
          }
        },
        {
          "type": "image",
          "name": "分１桁",
          "src": "../../タイマー/img/Time_0.png",
          "raw": {
            "x": 217,
            "y": 79,
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
            "width": 22,
            "height": 32,
            "keyexp": "分１桁"
          }
        },
        {
          "type": "image",
          "name": "分２桁",
          "src": "../../タイマー/img/Time_1.png",
          "raw": {
            "x": 195,
            "y": 79,
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
            "width": 22,
            "height": 32,
            "keyexp": "分２桁"
          }
        },
        {
          "type": "image",
          "name": "秒２桁",
          "src": "../../タイマー/img/Time_2.png",
          "raw": {
            "x": 261,
            "y": 79,
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
            "width": 22,
            "height": 32,
            "keyexp": "秒２桁"
          }
        },
        {
          "type": "image",
          "name": "秒１桁",
          "src": "../../タイマー/img/Time_8.png",
          "raw": {
            "x": 283,
            "y": 79,
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
            "width": 22,
            "height": 32,
            "keyexp": "秒１桁"
          }
        },
        {
          "type": "image",
          "name": "セミコロン",
          "src": "../../タイマー/img/Time_10.png",
          "raw": {
            "x": 243,
            "y": 79,
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
            "width": 11,
            "height": 33,
            "keyexp": "セミコロン"
          }
        },
        {
          "type": "image",
          "name": "分３桁",
          "src": "../../タイマー/img/Time_1.png",
          "raw": {
            "x": 173,
            "y": 79,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": true,
            "blendMode": "normal",
            "effects": [],
            "width": 22,
            "height": 32,
            "keyexp": "分３桁"
          }
        },
        {
          "type": "group",
          "name": "画像保持用",
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
            "effects": []
          },
          "children": [
            {
              "type": "image",
              "name": "Time_0",
              "src": "../../タイマー/img/Time_0.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_1",
              "src": "../../タイマー/img/Time_1.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_2",
              "src": "../../タイマー/img/Time_2.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_3",
              "src": "../../タイマー/img/Time_3.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_4",
              "src": "../../タイマー/img/Time_4.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_5",
              "src": "../../タイマー/img/Time_5.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_6",
              "src": "../../タイマー/img/Time_6.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_7",
              "src": "../../タイマー/img/Time_7.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_8",
              "src": "../../タイマー/img/Time_8.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_9",
              "src": "../../タイマー/img/Time_9.png",
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
                "width": 22,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "Time_10",
              "src": "../../タイマー/img/Time_10.png",
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
                "width": 11,
                "height": 33
              }
            },
            {
              "type": "image",
              "name": "HD2D_P01_Moji_1",
              "src": "../../タイマー/img/HD2D_P01_Moji_1.png",
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
                "width": 120,
                "height": 42
              }
            },
            {
              "type": "image",
              "name": "HD2D_P01_Moji_2",
              "src": "../../タイマー/img/HD2D_P01_Moji_2.png",
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
                "width": 120,
                "height": 42
              }
            },
            {
              "type": "image",
              "name": "HD2D_P01_Moji_3",
              "src": "../../タイマー/img/HD2D_P01_Moji_3.png",
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
                "width": 120,
                "height": 42
              }
            },
            {
              "type": "image",
              "name": "HD2D_P01_Moji_4",
              "src": "../../タイマー/img/HD2D_P01_Moji_4.png",
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
                "width": 120,
                "height": 42
              }
            }
          ]
        }
      ]
    }
  ]
};
