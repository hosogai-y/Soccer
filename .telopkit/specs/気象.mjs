// Pulled from telop "気象" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/気象.mjs
// 屋内施設: 値があるとき（ダッシュボードの「屋内施設」チェック ON）は天候の行（ベース・タイトル・テキスト）を出さない。
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
            "x": 34,
            "y": 1000,
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
            "height": 76
          }
        },
        {
          "type": "image",
          "name": "気温ベース",
          "src": "../../気象/img/T02_Base_Mini.png",
          "raw": {
            "x": 34,
            "y": 956,
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
            "height": 76
          }
        },
        {
          "type": "image",
          "name": "天気ベース",
          "src": "../../気象/img/T02_Base_Mini.png",
          "raw": {
            "x": 34,
            "y": 912,
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
            "height": 76
          },
          "showIf": {
            "key": "屋内施設",
            "op": "empty"
          }
        },
        {
          "type": "text",
          "name": "湿度テキスト",
          "text": "81",
          "w": 63,
          "raw": {
            "x": 168,
            "y": 1005,
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
            "text": "81",
            "width": 63,
            "padding": 0,
            "align": "right",
            "verticalAlign": "middle",
            "fitMode": "none",
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
            "height": 47,
            "keyexp": "湿度テキスト"
          }
        },
        {
          "type": "text",
          "name": "気温テキスト",
          "text": "22.3",
          "w": 73,
          "raw": {
            "x": 168,
            "y": 967,
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
            "text": "22.3",
            "width": 73,
            "padding": 0,
            "align": "center",
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
            "height": 41,
            "keyexp": "気温テキスト"
          }
        },
        {
          "type": "text",
          "name": "天候テキスト",
          "text": "晴れ",
          "w": 73,
          "raw": {
            "x": 185,
            "y": 922,
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
            "text": "晴れ",
            "width": 73,
            "padding": 0,
            "align": "center",
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
            "height": 41,
            "keyexp": "天候テキスト"
          },
          "showIf": {
            "key": "屋内施設",
            "op": "empty"
          }
        },
        {
          "type": "text",
          "name": "湿度タイトル",
          "text": "湿度",
          "w": 63,
          "raw": {
            "x": 63,
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
            "text": "湿度",
            "width": 63,
            "padding": 0,
            "align": "center",
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
            "height": 40,
            "keyexp": ""
          }
        },
        {
          "type": "text",
          "name": "気温タイトル",
          "text": "気温",
          "w": 63,
          "raw": {
            "x": 63,
            "y": 966,
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
            "text": "気温",
            "width": 63,
            "padding": 0,
            "align": "center",
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
            "height": 40,
            "keyexp": ""
          }
        },
        {
          "type": "text",
          "name": "天候タイトル",
          "text": "天候",
          "w": 63,
          "raw": {
            "x": 63,
            "y": 922,
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
            "text": "天候",
            "width": 63,
            "padding": 0,
            "align": "center",
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
            "height": 40,
            "keyexp": ""
          },
          "showIf": {
            "key": "屋内施設",
            "op": "empty"
          }
        },
        {
          "type": "text",
          "name": "湿度単位",
          "text": "%",
          "w": 53,
          "raw": {
            "x": 228,
            "y": 1008,
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
            "text": "%",
            "width": 53,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "none",
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
            "height": 45,
            "keyexp": ""
          }
        },
        {
          "type": "text",
          "name": "気温単位",
          "text": "℃",
          "w": 53,
          "raw": {
            "x": 240,
            "y": 964,
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
            "text": "℃",
            "width": 53,
            "padding": 0,
            "align": "center",
            "verticalAlign": "middle",
            "fitMode": "none",
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
            "height": 45,
            "keyexp": ""
          }
        },
        {
          "type": "text",
          "name": "屋内施設",
          "key": "屋内施設",
          "text": "",
          "w": 40,
          "visible": false
        }
      ]
    }
  ],
  "samples": {
    "気象": [
      { "天候テキスト": "晴れ", "気温テキスト": "22.3", "湿度テキスト": "81", "屋内施設": "" },
      { "天候テキスト": "晴れ", "気温テキスト": "22.3", "湿度テキスト": "81", "屋内施設": "1" }
    ]
  }
};
