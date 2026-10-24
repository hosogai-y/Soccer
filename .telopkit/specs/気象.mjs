// Pulled from telop "気象" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/気象.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "気象",
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
        "effects": []
      },
      "children": [
        {
          "type": "image",
          "name": "湿度ベース",
          "src": "../../気象/img/T02_Base_Mini.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 34,
            "y": 1000,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 318,
            "height": 76,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "気温ベース",
          "src": "../../気象/img/T02_Base_Mini.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 34,
            "y": 956,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 318,
            "height": 76,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "天気ベース",
          "src": "../../気象/img/T02_Base_Mini.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 34,
            "y": 912,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 318,
            "height": 76,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "text",
          "name": "湿度テキスト",
          "text": "81",
          "w": 63,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 168,
            "y": 1005,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 63,
            "height": 47,
            "text": "81",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 37,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#e6960b",
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
            "align": "right",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "湿度テキスト",
            "fitMode": "none"
          }
        },
        {
          "type": "text",
          "name": "気温テキスト",
          "text": "22.3",
          "w": 73,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 168,
            "y": 967,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 73,
            "height": 41,
            "text": "22.3",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#e6960b",
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
                  "shadowOffsetY": 4,
                  "isMask": false,
                  "maskMode": "subtract"
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
            "keyexp": "気温テキスト",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "天候テキスト",
          "text": "晴れ",
          "w": 73,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 185,
            "y": 922,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 73,
            "height": 41,
            "text": "晴れ",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 40,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#e6960b",
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
                  "shadowOffsetY": 4,
                  "isMask": false,
                  "maskMode": "subtract"
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
            "keyexp": "天候テキスト",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "湿度タイトル",
          "text": "湿度",
          "w": 63,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 63,
            "y": 1009,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 63,
            "height": 40,
            "text": "湿度",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 27,
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
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "none"
          }
        },
        {
          "type": "text",
          "name": "気温タイトル",
          "text": "気温",
          "w": 63,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 63,
            "y": 966,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 63,
            "height": 40,
            "text": "気温",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 27,
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
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "none"
          }
        },
        {
          "type": "text",
          "name": "天候タイトル",
          "text": "天候",
          "w": 63,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 63,
            "y": 922,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 63,
            "height": 40,
            "text": "天候",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 27,
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
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "none"
          }
        },
        {
          "type": "text",
          "name": "湿度単位",
          "text": "%",
          "w": 53,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 228,
            "y": 1008,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 53,
            "height": 45,
            "text": "%",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 30,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#e6960b",
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
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "none"
          }
        },
        {
          "type": "text",
          "name": "気温単位",
          "text": "℃",
          "w": 53,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 240,
            "y": 964,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 53,
            "height": 45,
            "text": "℃",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 32,
              "fontWeight": "normal",
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#e6960b",
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
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "none"
          }
        }
      ]
    }
  ]
};
