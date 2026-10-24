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
        "effects": []
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
          "key": "役職表示",
          "text": "0",
          "w": 40,
          "visible": false
        }
      ]
    }
  ]
};
