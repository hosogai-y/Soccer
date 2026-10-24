// Pulled from telop "選手交代1枚" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/選手交代1枚.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "選手交代1枚",
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
          "name": "OUT",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 314,
            "y": 977,
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
              "name": "OUTベース",
              "src": "../../選手交代1枚/img/HD2D_S04_BaseOUT_MF.png",
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
                "width": 602,
                "height": 98,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "skewX": -12.556492647850591,
                "skewY": 0,
                "x": 207,
                "y": 12,
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
                  "w": 45,
                  "h": 52,
                  "raw": {
                    "skewX": -1,
                    "skewY": 1,
                    "x": -27,
                    "y": -4,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "opacity": 1,
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
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "domId": "TeamColor"
                  }
                },
                {
                  "type": "rect",
                  "name": "グラデーションマット",
                  "w": 45,
                  "h": 52,
                  "raw": {
                    "skewX": -1,
                    "skewY": 1,
                    "x": -27,
                    "y": -4,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "opacity": 1,
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
                    },
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": []
                  }
                }
              ]
            },
            {
              "type": "text",
              "name": "OUT背番号",
              "text": "8",
              "w": 42,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 174,
                "y": 18,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 42,
                "height": 44,
                "text": "8",
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
              "name": "OUT選手名",
              "text": "工藤　大河",
              "w": 260,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 242,
                "y": 19,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 260,
                "height": 40,
                "text": "工藤　大河",
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
                "align": "left",
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
              "name": "OUT学年",
              "text": "（3年）",
              "w": 65,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 506,
                "y": 23,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 65,
                "height": 33,
                "text": "（3年）",
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
                  "lineHeight": 1.2,
                  "letterSpacing": 0
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
        },
        {
          "type": "group",
          "name": "IN",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1000,
            "y": 976,
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
              "name": "INベース",
              "src": "../../選手交代1枚/img/HD2D_S04_BaseIN_DF.png",
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
                "width": 602,
                "height": 98,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "skewX": -12.7613741187012,
                "skewY": 0,
                "x": 208,
                "y": 12,
                "rotation": 0,
                "scaleX": 1.2519988254701775,
                "scaleY": 1.1749999999999876,
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
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "skewX": -1,
                    "skewY": 1,
                    "x": -28,
                    "y": -4,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "opacity": 1,
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
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "domId": "TeamColor"
                  }
                },
                {
                  "type": "rect",
                  "name": "グラデーションマット",
                  "w": 45,
                  "h": 51,
                  "raw": {
                    "skewX": -1,
                    "skewY": 1,
                    "x": -28,
                    "y": -4,
                    "rotation": -1,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "opacity": 1,
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
                    },
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": []
                  }
                }
              ]
            },
            {
              "type": "text",
              "name": "IN選手名",
              "text": "松下　侑生",
              "w": 260,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 241,
                "y": 21,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 260,
                "height": 40,
                "text": "松下　侑生",
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
                "align": "left",
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
              "name": "IN背番号",
              "text": "3",
              "w": 42,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 175,
                "y": 18,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 42,
                "height": 44,
                "text": "3",
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
              "name": "IN学年",
              "text": "（3年）",
              "w": 67,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 504,
                "y": 22,
                "rotation": 0,
                "scaleX": 1.0168646681497993,
                "scaleY": 1.0000000000000002,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 67,
                "height": 36,
                "text": "（3年）",
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
                  "lineHeight": 1.2,
                  "letterSpacing": 0
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
        },
        {
          "type": "image",
          "name": "矢印",
          "src": "../../選手交代1枚/img/HD2D_F01_new_YajirushiL.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 915,
            "y": 987,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1.0071130391576795,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 121,
            "height": 57,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "高校名ベース",
          "src": "../../選手交代1枚/img/HD2D_S04_Base_001.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 315,
            "y": 926,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 578,
            "height": 86,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "蹴り上げマーク",
          "src": "../../選手交代1枚/img/HD2D_S00_MarkHighSchool.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 349,
            "y": 939,
            "rotation": 0,
            "scaleX": 0.6730898873912113,
            "scaleY": 0.6730898873912124,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 84,
            "height": 57,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "text",
          "name": "高校名テキスト",
          "text": "とわの森三愛",
          "w": 300,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 452,
            "y": 938,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 300,
            "height": 40,
            "text": "とわの森三愛",
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
            "align": "left",
            "verticalAlign": "top",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "",
            "fitMode": "shrink_font"
          }
        }
      ]
    }
  ]
};
