// Pulled from telop "選手交代2枚" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/選手交代2枚.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "選手交代2枚",
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
        "positionBaseAssets": [
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseOUT_GK.png",
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseOUT_DF.png",
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseOUT_MF.png",
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseOUT_FW.png",
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseIN_GK.png",
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseIN_DF.png",
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseIN_MF.png",
          "@asset:../../選手交代2枚/img/HD2D_S04_BaseIN_FW.png"
        ]
      },
      "children": [
        {
          "type": "group",
          "name": "OUT2",
          "raw": {
            "x": 314,
            "y": 908,
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
              "name": "OUTベース2",
              "src": "../../選手交代2枚/img/HD2D_S04_BaseOUT_GK.png",
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
                "width": 602,
                "height": 98,
                "keyexp": "OUTポジション2"
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "x": 207,
                "y": 11,
                "rotation": 0,
                "scaleX": 1.2312344648066182,
                "scaleY": 1.1749999999999874,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": -12.556492647850591,
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
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "x": -27,
                    "y": -3,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 51,
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
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "x": -27,
                    "y": -3,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 51,
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
              "name": "OUT選手名2",
              "text": "花井　耀",
              "w": 260,
              "raw": {
                "x": 242,
                "y": 18,
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
                "text": "花井　耀",
                "width": 260,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
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
                "keyexp": "OUT選手名2"
              }
            },
            {
              "type": "text",
              "name": "OUT背番号2",
              "text": "13",
              "w": 42,
              "raw": {
                "x": 174,
                "y": 17,
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
                "width": 42,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 44,
                "keyexp": "OUT背番号2"
              }
            },
            {
              "type": "text",
              "name": "OUT学年2",
              "text": "（3年）",
              "w": 70,
              "raw": {
                "x": 504,
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
                "text": "（3年）",
                "width": 70,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
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
                "height": 36,
                "keyexp": "OUT学年2"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "OUT1",
          "raw": {
            "x": 314,
            "y": 977,
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
              "name": "OUTベース1",
              "src": "../../選手交代2枚/img/HD2D_S04_BaseOUT_DF.png",
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
                "width": 602,
                "height": 98,
                "keyexp": "OUTポジション1"
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "x": 207,
                "y": 12,
                "rotation": 0,
                "scaleX": 1.2312344648066182,
                "scaleY": 1.1749999999999874,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": -12.556492647850591,
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
                  "w": 45,
                  "h": 52,
                  "raw": {
                    "x": -27,
                    "y": -4,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 52,
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
                  "w": 45,
                  "h": 52,
                  "raw": {
                    "x": -27,
                    "y": -4,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 52,
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
              "name": "OUT背番号1",
              "text": "8",
              "w": 42,
              "raw": {
                "x": 174,
                "y": 18,
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
                "width": 42,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 44,
                "keyexp": "OUT背番号1"
              }
            },
            {
              "type": "text",
              "name": "OUT選手名1",
              "text": "工藤　大河",
              "w": 260,
              "raw": {
                "x": 242,
                "y": 19,
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
                "text": "工藤　大河",
                "width": 260,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
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
                "keyexp": "OUT選手名1"
              }
            },
            {
              "type": "text",
              "name": "OUT学年1",
              "text": "（3年）",
              "w": 70,
              "raw": {
                "x": 504,
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
                "text": "（3年）",
                "width": 70,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
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
                "height": 36,
                "keyexp": "OUT学年1"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "IN1",
          "raw": {
            "x": 1001,
            "y": 977,
            "rotation": 0,
            "scaleX": 0.9834150318345855,
            "scaleY": 0.9999999999999998,
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
              "name": "INベース1",
              "src": "../../選手交代2枚/img/HD2D_S04_BaseIN_MF.png",
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
                "width": 602,
                "height": 98,
                "keyexp": "INポジション1"
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "x": 207,
                "y": 11,
                "rotation": 0,
                "scaleX": 1.2519988254701775,
                "scaleY": 1.1749999999999876,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": -12.7613741187012,
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
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "x": -27,
                    "y": -3,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 51,
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
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "x": -27,
                    "y": -3,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 51,
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
              "name": "IN選手名1",
              "text": "伊東　涼哉",
              "w": 260,
              "raw": {
                "x": 240,
                "y": 19,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "伊東　涼哉",
                "width": 260,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
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
                "height": 44,
                "keyexp": "IN選手名1"
              }
            },
            {
              "type": "text",
              "name": "IN背番号1",
              "text": "22",
              "w": 42,
              "raw": {
                "x": 174,
                "y": 18,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "22",
                "width": 42,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 44,
                "keyexp": "IN背番号1"
              }
            },
            {
              "type": "text",
              "name": "IN学年1",
              "text": "（3年）",
              "w": 70,
              "raw": {
                "x": 503,
                "y": 22,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "（3年）",
                "width": 70,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
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
                "height": 36,
                "keyexp": "IN学年1"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "IN2",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1001,
            "y": 908,
            "rotation": 0,
            "scaleX": 0.9834150318345855,
            "scaleY": 0.9999999999999998,
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
              "name": "INベース2",
              "src": "../../選手交代2枚/img/HD2D_S04_BaseIN_DF.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -3,
                "y": 0,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 602,
                "height": 98,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "INポジション2"
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "x": 207,
                "y": 8,
                "rotation": 0,
                "scaleX": 1.2519988254701775,
                "scaleY": 1.1749999999999876,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": -12.7613741187012,
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
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "x": -27,
                    "y": -1,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 51,
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
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "x": -27,
                    "y": -1,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -1,
                    "skewY": 1,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 45,
                    "height": 51,
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
              "name": "IN選手名2",
              "text": "松下　侑生",
              "w": 260,
              "raw": {
                "x": 240,
                "y": 20,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "松下　侑生",
                "width": 260,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 40,
                  "fontWeight": 300,
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
                "keyexp": "IN選手名2"
              }
            },
            {
              "type": "text",
              "name": "IN背番号2",
              "text": "8",
              "w": 42,
              "raw": {
                "x": 174,
                "y": 19,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
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
                "width": 42,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
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
                  "letterSpacing": 0,
                  "lineHeight": 1.2
                },
                "height": 44,
                "keyexp": "IN背番号2"
              }
            },
            {
              "type": "text",
              "name": "IN学年2",
              "text": "（3年）",
              "w": 70,
              "raw": {
                "x": 503,
                "y": 23,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": 0,
                "skewY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "text": "（3年）",
                "width": 70,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "none",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
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
                "height": 36,
                "keyexp": "IN学年2"
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "矢印1",
          "src": "../../選手交代2枚/img/HD2D_F01_new_YajirushiL.png",
          "raw": {
            "x": 916,
            "y": 988,
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
            "width": 121,
            "height": 57
          }
        },
        {
          "type": "image",
          "name": "矢印2",
          "src": "../../選手交代2枚/img/HD2D_F01_new_YajirushiL.png",
          "raw": {
            "x": 916,
            "y": 918,
            "rotation": 0,
            "scaleX": 0.9954007452565284,
            "scaleY": 0.9999999999999923,
            "pivotX": 0,
            "pivotY": 0,
            "skewX": 0,
            "skewY": 0,
            "opacity": 1,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "width": 121,
            "height": 57
          }
        },
        {
          "type": "image",
          "name": "高校名ベース",
          "src": "../../選手交代2枚/img/HD2D_S04_Base_001.png",
          "raw": {
            "x": 314,
            "y": 859,
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
            "width": 585,
            "height": 86
          }
        },
        {
          "type": "group",
          "name": "チームカラーザブトン",
          "raw": {
            "skewX": -12.556492647850591,
            "skewY": 0,
            "x": 1080,
            "y": 1140,
            "rotation": 0,
            "scaleX": 1.2312344648066182,
            "scaleY": 1.1749999999999874,
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
              "type": "rect",
              "name": "ベースカラー",
              "w": 17,
              "h": 34,
              "raw": {
                "skewX": -1,
                "skewY": 1,
                "x": -586,
                "y": -228,
                "rotation": -1,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 17,
                "height": 34,
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
              "w": 17,
              "h": 34,
              "raw": {
                "skewX": -1,
                "skewY": 1,
                "x": -586,
                "y": -228,
                "rotation": -1,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "width": 17,
                "height": 34,
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
          "type": "image",
          "name": "蹴り上げマーク",
          "src": "../../選手交代2枚/img/MarkHighSchool.png",
          "raw": {
            "x": 349,
            "y": 871,
            "rotation": 0,
            "scaleX": 0.6713816692633001,
            "scaleY": 0.6713816692633006,
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
          "type": "text",
          "name": "高校名テキスト",
          "text": "とわの森三愛",
          "w": 300,
          "raw": {
            "x": 452,
            "y": 871,
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
            "text": "とわの森三愛",
            "width": 300,
            "padding": 0,
            "align": "left",
            "verticalAlign": "top",
            "fitMode": "shrink_font",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 33,
              "fontWeight": 300,
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
            "height": 37,
            "keyexp": "高校名テキスト"
          }
        }
      ]
    }
  ]
};
