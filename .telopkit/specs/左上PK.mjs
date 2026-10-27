// Pulled from telop "左上PK" by telopkit, then given data keys (keyexp), the 6th-kick show/hide (showIf 6回目表示)
// and a 0-0 / blank initial state. Images live in ./assets.
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "左上PK",
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
          "name": "6回目得点",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 526,
            "y": 71,
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
              "type": "image",
              "name": "6回ベース",
              "src": "../../左上PK/img/HD2D_P09_PKBase_06.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -490,
                "y": -44,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 638,
                "height": 163,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "text",
              "name": "イニング_6",
              "text": "6",
              "w": 35,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 15,
                "y": -43,
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
                  "fontSize": 30,
                  "fontWeight": 300,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 1,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "shadowEnabled": false,
                      "shadowColor": "#000000",
                      "shadowBlur": 0,
                      "shadowAlpha": 1,
                      "shadowOffsetX": 4,
                      "shadowOffsetY": 4,
                      "isMask": false,
                      "maskMode": "clipping"
                    }
                  ],
                  "letterSpacing": 8,
                  "lineHeight": 1.2
                },
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "",
                "fitMode": "shrink_font"
              }
            },
            {
              "type": "image",
              "name": "先攻6",
              "src": "assets/HD2D_P09_Parts3.png",
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
                "width": 57,
                "height": 38,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻6"
              }
            },
            {
              "type": "image",
              "name": "後攻6",
              "src": "assets/HD2D_P09_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 43,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 57,
                "height": 38,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻6"
              }
            },
            {
              "type": "text",
              "name": "先攻合計得点_6",
              "text": "0",
              "w": 54,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 70,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 54,
                "height": 44,
                "text": "0",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
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
                "keyexp": "先攻合計得点",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "後攻合計得点_6",
              "text": "0",
              "w": 54,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 70,
                "y": 44,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 54,
                "height": 44,
                "text": "0",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
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
                "keyexp": "後攻合計得点",
                "fitMode": "none"
              }
            }
          ],
          "showIf": {
            "key": "6回目表示",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "5回目ベース",
          "raw": {
            "x": 36,
            "y": 27,
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
              "name": "5回ベース",
              "src": "../../左上PK/img/HD2D_P09_PKBase.png",
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
                "width": 581,
                "height": 163,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "text",
              "name": "後攻合計得点",
              "text": "0",
              "w": 54,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 503,
                "y": 88,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 54,
                "height": 44,
                "text": "0",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
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
                "keyexp": "後攻合計得点",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "先攻合計得点",
              "text": "0",
              "w": 54,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 503,
                "y": 44,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 54,
                "height": 44,
                "text": "0",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
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
                "keyexp": "先攻合計得点",
                "fitMode": "none"
              }
            }
          ],
          "showIf": {
            "key": "6回目表示",
            "op": "empty"
          }
        },
        {
          "type": "group",
          "name": "1回目得点",
          "raw": {
            "x": 240,
            "y": 114,
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
              "name": "後攻1",
              "src": "assets/HD2D_P09_Parts3.png",
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
                "width": 57,
                "height": 38,
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
              "src": "assets/HD2D_P09_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -43,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 57,
                "height": 38,
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
          "name": "2回目得点",
          "raw": {
            "x": 298,
            "y": 114,
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
              "name": "後攻2",
              "src": "assets/HD2D_P09_Parts3.png",
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
                "width": 57,
                "height": 38,
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
              "src": "assets/HD2D_P09_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -1,
                "y": -43,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 57,
                "height": 38,
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
          "name": "3回目得点",
          "raw": {
            "x": 355,
            "y": 114,
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
              "name": "後攻3",
              "src": "assets/HD2D_P09_Parts3.png",
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
                "width": 57,
                "height": 38,
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
              "src": "assets/HD2D_P09_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -43,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 57,
                "height": 38,
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
          "name": "4回目得点",
          "raw": {
            "x": 412,
            "y": 114,
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
              "name": "後攻4",
              "src": "assets/HD2D_P09_Parts3.png",
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
                "width": 57,
                "height": 38,
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
              "src": "assets/HD2D_P09_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": -43,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 57,
                "height": 38,
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
          "name": "5回目得点",
          "raw": {
            "x": 469,
            "y": 71,
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
              "name": "先攻5",
              "src": "assets/HD2D_P09_Parts3.png",
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
                "width": 57,
                "height": 38,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "先攻5"
              }
            },
            {
              "type": "image",
              "name": "後攻5",
              "src": "assets/HD2D_P09_Parts3.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 43,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 57,
                "height": 38,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "後攻5"
              }
            }
          ]
        },
        {
          "type": "text",
          "name": "イニング_5",
          "text": "5",
          "w": 35,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 482,
            "y": 28,
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
              "fontSize": 30,
              "fontWeight": 300,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 1,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4,
                  "isMask": false,
                  "maskMode": "clipping"
                }
              ],
              "letterSpacing": 8,
              "lineHeight": 1.2
            },
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "イニング_4",
          "text": "4",
          "w": 35,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 427,
            "y": 28,
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
              "fontSize": 30,
              "fontWeight": 300,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 1,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4,
                  "isMask": false,
                  "maskMode": "clipping"
                }
              ],
              "letterSpacing": 8,
              "lineHeight": 1.2
            },
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "イニング_3",
          "text": "3",
          "w": 35,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 370,
            "y": 28,
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
              "fontSize": 30,
              "fontWeight": 300,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 1,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4,
                  "isMask": false,
                  "maskMode": "clipping"
                }
              ],
              "letterSpacing": 8,
              "lineHeight": 1.2
            },
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "イニング_2",
          "text": "2",
          "w": 35,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 312,
            "y": 28,
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
              "fontSize": 30,
              "fontWeight": 300,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 1,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4,
                  "isMask": false,
                  "maskMode": "clipping"
                }
              ],
              "letterSpacing": 8,
              "lineHeight": 1.2
            },
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "イニング_1",
          "text": "１",
          "w": 35,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 255,
            "y": 28,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 35,
            "height": 35,
            "text": "１",
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
                  "thickness": 1,
                  "lineJoin": "miter",
                  "miterLimit": 10,
                  "shadowEnabled": false,
                  "shadowColor": "#000000",
                  "shadowBlur": 0,
                  "shadowAlpha": 1,
                  "shadowOffsetX": 4,
                  "shadowOffsetY": 4,
                  "isMask": false,
                  "maskMode": "clipping"
                }
              ],
              "letterSpacing": 8,
              "lineHeight": 1.2
            },
            "align": "center",
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "後攻学校名",
          "text": "",
          "w": 172,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 59,
            "y": 116,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 172,
            "height": 38,
            "text": "",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 35,
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
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "後攻学校名",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "先攻学校名",
          "text": "",
          "w": 172,
          "raw": {
            "x": 59,
            "y": 72,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "width": 172,
            "height": 38,
            "text": "",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 35,
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
            "verticalAlign": "middle",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "先攻学校名",
            "fitMode": "shrink_font"
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
          "src": "assets/HD2D_P09_Parts1.png",
          "w": 10,
          "h": 10,
          "visible": false
        },
        {
          "type": "image",
          "name": "×画像",
          "src": "assets/HD2D_P09_Parts2.png",
          "w": 10,
          "h": 10,
          "visible": false
        }
      ]
    }
  ],
  "samples": {
    "左上PK": [
      {
        "先攻学校名": "北海道室蘭大谷",
        "後攻学校名": "札幌創成",
        "6回目表示": "",
        "先攻合計得点": "3",
        "後攻合計得点": "2",
        "先攻1": "img/HD2D_P09_Parts1.png",
        "後攻1": "img/HD2D_P09_Parts1.png",
        "先攻2": "img/HD2D_P09_Parts1.png",
        "後攻2": "img/HD2D_P09_Parts2.png",
        "先攻3": "img/HD2D_P09_Parts2.png",
        "後攻3": "img/HD2D_P09_Parts1.png",
        "先攻4": "img/HD2D_P09_Parts1.png",
        "後攻4": "img/HD2D_P09_Parts2.png",
        "先攻5": "img/HD2D_P09_Parts1.png",
        "後攻5": "img/HD2D_P09_Parts3.png",
        "先攻6": "img/HD2D_P09_Parts3.png",
        "後攻6": "img/HD2D_P09_Parts3.png"
      },
      {
        "先攻学校名": "北海道室蘭大谷",
        "後攻学校名": "札幌創成",
        "6回目表示": "1",
        "先攻合計得点": "5",
        "後攻合計得点": "4",
        "先攻1": "img/HD2D_P09_Parts1.png",
        "後攻1": "img/HD2D_P09_Parts1.png",
        "先攻2": "img/HD2D_P09_Parts1.png",
        "後攻2": "img/HD2D_P09_Parts2.png",
        "先攻3": "img/HD2D_P09_Parts2.png",
        "後攻3": "img/HD2D_P09_Parts1.png",
        "先攻4": "img/HD2D_P09_Parts1.png",
        "後攻4": "img/HD2D_P09_Parts2.png",
        "先攻5": "img/HD2D_P09_Parts1.png",
        "後攻5": "img/HD2D_P09_Parts3.png",
        "先攻6": "img/HD2D_P09_Parts2.png",
        "後攻6": "img/HD2D_P09_Parts2.png"
      }
    ]
  }
};
