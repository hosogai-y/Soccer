// Pulled from telop "PK" by telopkit, then given data keys (keyexp), the 6th-kick show/hide (showIf 6回目表示)
// and a 0-0 / blank initial state. Images live in ./assets.
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "PK",
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
          "type": "group",
          "name": "6回目バージョン",
          "raw": {
            "x": 437,
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
            "effects": []
          },
          "children": [
            {
              "type": "image",
              "name": "PK用ベース",
              "src": "../../PK/img/HD2D_P07_PKBase_06.png",
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
                "width": 928,
                "height": 220,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "text",
              "name": "後攻学校名",
              "text": "",
              "w": 280,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 46,
                "y": 126,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 280,
                "height": 43,
                "text": "",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd41b",
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
                  "letterSpacing": 8,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻学校名",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "text",
              "name": "先攻学校名",
              "text": "",
              "w": 280,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 46,
                "y": 67,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 280,
                "height": 43,
                "text": "",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd41b",
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
                  "letterSpacing": 15,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻学校名",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "text",
              "name": "後攻得点",
              "text": "0",
              "w": 55,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 827,
                "y": 124,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 55,
                "height": 45,
                "text": "0",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 45,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd41b",
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
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻得点",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "text",
              "name": "先攻得点",
              "text": "0",
              "w": 55,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 827,
                "y": 67,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 55,
                "height": 45,
                "text": "0",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 45,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd41b",
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
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻得点",
                "fitMode": "shrink_x"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "1回目",
          "raw": {
            "x": 787,
            "y": 983,
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
              "name": "イニング",
              "text": "1",
              "w": 35,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 27,
                "y": -108,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 35,
                "height": 35,
                "text": "1",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#ffffff",
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
                  "letterSpacing": 15,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "image",
              "name": "後攻1",
              "src": "assets/HD2D_P07_Parts3.png",
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
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻1"
              }
            },
            {
              "type": "image",
              "name": "先攻1",
              "src": "assets/HD2D_P07_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -57,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻1"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "2回目",
          "raw": {
            "x": 863,
            "y": 983,
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
              "name": "イニング",
              "text": "2",
              "w": 35,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 29,
                "y": -108,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 35,
                "height": 35,
                "text": "2",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#ffffff",
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
                  "letterSpacing": 15,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "image",
              "name": "後攻2",
              "src": "assets/HD2D_P07_Parts3.png",
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
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻2"
              }
            },
            {
              "type": "image",
              "name": "先攻2",
              "src": "assets/HD2D_P07_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -57,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻2"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "3回目",
          "raw": {
            "x": 939,
            "y": 983,
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
              "name": "イニング",
              "text": "3",
              "w": 35,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 27,
                "y": -108,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 35,
                "height": 35,
                "text": "3",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#ffffff",
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
                  "letterSpacing": 15,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "image",
              "name": "後攻3",
              "src": "assets/HD2D_P07_Parts3.png",
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
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻3"
              }
            },
            {
              "type": "image",
              "name": "先攻3",
              "src": "assets/HD2D_P07_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -57,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻3"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "4回目",
          "raw": {
            "x": 1015,
            "y": 983,
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
              "name": "イニング",
              "text": "4",
              "w": 35,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 26,
                "y": -108,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 35,
                "height": 35,
                "text": "4",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#ffffff",
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
                  "letterSpacing": 15,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "image",
              "name": "後攻4",
              "src": "assets/HD2D_P07_Parts3.png",
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
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻4"
              }
            },
            {
              "type": "image",
              "name": "先攻4",
              "src": "assets/HD2D_P07_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -57,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻4"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "5回目",
          "raw": {
            "x": 1091,
            "y": 983,
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
              "name": "イニング",
              "text": "5",
              "w": 35,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 26,
                "y": -108,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 35,
                "height": 35,
                "text": "5",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#ffffff",
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
                  "letterSpacing": 15,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "image",
              "name": "後攻5",
              "src": "assets/HD2D_P07_Parts3.png",
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
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻5"
              }
            },
            {
              "type": "image",
              "name": "先攻5",
              "src": "assets/HD2D_P07_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -57,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻5"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "6回目",
          "raw": {
            "x": 1167,
            "y": 983,
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
              "name": "イニング",
              "text": "6",
              "w": 35,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 27,
                "y": -108,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 35,
                "height": 35,
                "text": "6",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#ffffff",
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
                  "letterSpacing": 15,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "",
                "fitMode": "shrink_x"
              }
            },
            {
              "type": "image",
              "name": "後攻6",
              "src": "assets/HD2D_P07_Parts3.png",
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
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻6"
              }
            },
            {
              "type": "image",
              "name": "先攻6",
              "src": "assets/HD2D_P07_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -57,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 76,
                "height": 50,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻6"
              }
            }
          ],
          "showIf": {
            "key": "6回目表示",
            "op": "not_empty"
          }
        },
        {
          "type": "text",
          "name": "6回目表示",
          "key": "6回目表示",
          "text": "",
          "w": 40,
          "visible": false
        },
        {
          "type": "image",
          "name": "○画像",
          "src": "assets/HD2D_P07_Parts1.png",
          "w": 10,
          "h": 10,
          "visible": false
        },
        {
          "type": "image",
          "name": "×画像",
          "src": "assets/HD2D_P07_Parts2.png",
          "w": 10,
          "h": 10,
          "visible": false
        }
      ]
    }
  ],
  "samples": {
    "PK": [
      {
        "先攻学校名": "北海道室蘭大谷",
        "後攻学校名": "札幌創成",
        "6回目表示": "",
        "先攻得点": "3",
        "後攻得点": "2",
        "先攻1": "img/HD2D_P07_Parts1.png",
        "後攻1": "img/HD2D_P07_Parts1.png",
        "先攻2": "img/HD2D_P07_Parts1.png",
        "後攻2": "img/HD2D_P07_Parts2.png",
        "先攻3": "img/HD2D_P07_Parts2.png",
        "後攻3": "img/HD2D_P07_Parts1.png",
        "先攻4": "img/HD2D_P07_Parts1.png",
        "後攻4": "img/HD2D_P07_Parts2.png",
        "先攻5": "img/HD2D_P07_Parts1.png",
        "後攻5": "img/HD2D_P07_Parts3.png",
        "先攻6": "img/HD2D_P07_Parts3.png",
        "後攻6": "img/HD2D_P07_Parts3.png"
      },
      {
        "先攻学校名": "北海道室蘭大谷",
        "後攻学校名": "札幌創成",
        "6回目表示": "1",
        "先攻得点": "5",
        "後攻得点": "4",
        "先攻1": "img/HD2D_P07_Parts1.png",
        "後攻1": "img/HD2D_P07_Parts1.png",
        "先攻2": "img/HD2D_P07_Parts1.png",
        "後攻2": "img/HD2D_P07_Parts2.png",
        "先攻3": "img/HD2D_P07_Parts2.png",
        "後攻3": "img/HD2D_P07_Parts1.png",
        "先攻4": "img/HD2D_P07_Parts1.png",
        "後攻4": "img/HD2D_P07_Parts2.png",
        "先攻5": "img/HD2D_P07_Parts1.png",
        "後攻5": "img/HD2D_P07_Parts3.png",
        "先攻6": "img/HD2D_P07_Parts2.png",
        "後攻6": "img/HD2D_P07_Parts2.png"
      }
    ]
  }
};
