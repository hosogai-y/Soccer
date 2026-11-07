// Pulled from telop "サブ下位置左" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/サブ下位置左.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "サブ下位置左",
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
          "name": "チーム情報",
          "raw": {
            "x": -9,
            "y": 924,
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
              "name": "チームベース",
              "src": "../../サブ下位置左/img/HD2D_F09_SubMember_TeamZabu_001.png",
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
                "width": 588,
                "height": 89
              }
            },
            {
              "type": "group",
              "name": "チームカラーザブトン",
              "raw": {
                "x": 121,
                "y": -22,
                "rotation": 0,
                "scaleX": 0.6079390732479742,
                "scaleY": 1.1749999999999838,
                "pivotX": 0,
                "pivotY": 0,
                "skewX": -6.275922439779979,
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
                  "h": 35,
                  "raw": {
                    "x": -25,
                    "y": 18,
                    "rotation": -4,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -5,
                    "skewY": 4,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 4,
                    "height": 35,
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
                      "cornerRadius": 5
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
                  "h": 35,
                  "raw": {
                    "x": 18,
                    "y": 18,
                    "rotation": -4,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -5,
                    "skewY": 4,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 4,
                    "height": 35,
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
                      "cornerRadius": 5
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
                  "w": 39,
                  "h": 35,
                  "raw": {
                    "x": -21,
                    "y": 18,
                    "rotation": -4,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -5,
                    "skewY": 4,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 39,
                    "height": 35,
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
                      "cornerRadius": 5
                    },
                    "domId": "TeamColor"
                  }
                },
                {
                  "type": "rect",
                  "name": "カラー2",
                  "w": 19.5,
                  "h": 35,
                  "raw": {
                    "x": -1.5,
                    "y": 18,
                    "rotation": -4,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -5,
                    "skewY": 4,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 19.5,
                    "height": 35,
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
                      "cornerRadius": 5
                    }
                  }
                },
                {
                  "type": "rect",
                  "name": "グラデーションマット",
                  "w": 39,
                  "h": 35,
                  "raw": {
                    "x": -21,
                    "y": 18,
                    "rotation": -4,
                    "scaleX": 1,
                    "scaleY": 1,
                    "pivotX": 0,
                    "pivotY": 0,
                    "skewX": -5,
                    "skewY": 4,
                    "opacity": 1,
                    "visible": true,
                    "locked": false,
                    "blendMode": "normal",
                    "effects": [],
                    "width": 39,
                    "height": 35,
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
                      "cornerRadius": 5
                    }
                  }
                }
              ]
            },
            {
              "type": "text",
              "name": "学校名",
              "text": "札幌大谷",
              "w": 220,
              "raw": {
                "x": 130,
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
                "width": 220,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 30,
                  "fontWeight": 400,
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
                  "letterSpacing": 3,
                  "lineHeight": 1.2
                },
                "height": 46,
                "keyexp": "学校名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ1",
          "raw": {
            "x": 49,
            "y": 976,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名1",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション1",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseGK_FIX.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keepRatio": true,
                "keyexp": "ポジション1"
              }
            },
            {
              "type": "text",
              "name": "学年1",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年1"
              }
            },
            {
              "type": "text",
              "name": "選手名1",
              "text": "山田 侑人",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "山田 侑人",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名1"
              }
            },
            {
              "type": "text",
              "name": "背番号1",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号1"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ2",
          "raw": {
            "x": 320,
            "y": 976,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名2",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション2",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseDF_FIX.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション2"
              }
            },
            {
              "type": "text",
              "name": "学年2",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年2"
              }
            },
            {
              "type": "text",
              "name": "選手名2",
              "text": "西島 都生",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "西島 都生",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名2"
              }
            },
            {
              "type": "text",
              "name": "背番号2",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号2"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ3",
          "raw": {
            "x": 585,
            "y": 976,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名3",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション3",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseDF_FIX.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション3"
              }
            },
            {
              "type": "text",
              "name": "学年3",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年3"
              }
            },
            {
              "type": "text",
              "name": "選手名3",
              "text": "川井　駿",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "川井　駿",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名3"
              }
            },
            {
              "type": "text",
              "name": "背番号3",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号3"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ4",
          "raw": {
            "x": 846,
            "y": 976,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名4",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション4",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseDF_FIX.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション4"
              }
            },
            {
              "type": "text",
              "name": "学年4",
              "text": "(3年)",
              "w": 30,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                  "lineHeight": 1.2,
                  "letterSpacing": 0
                },
                "height": 30,
                "keyexp": "学年4"
              }
            },
            {
              "type": "text",
              "name": "選手名4",
              "text": "山﨑　遥翔",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "山﨑　遥翔",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名4"
              }
            },
            {
              "type": "text",
              "name": "背番号4",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号4"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ5",
          "raw": {
            "x": 1112,
            "y": 976,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名5",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション5",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseMF_FIX.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション5"
              }
            },
            {
              "type": "text",
              "name": "学年5",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年5"
              }
            },
            {
              "type": "text",
              "name": "選手名5",
              "text": "高山　大樹",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "高山　大樹",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名5"
              }
            },
            {
              "type": "text",
              "name": "背番号5",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                  "lineHeight": 1.2,
                  "letterSpacing": 0
                },
                "height": 30,
                "keyexp": "背番号5"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ6",
          "raw": {
            "x": 1375,
            "y": 976,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名6",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション6",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseMF_FIX.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション6"
              }
            },
            {
              "type": "text",
              "name": "学年6",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年6"
              }
            },
            {
              "type": "text",
              "name": "選手名6",
              "text": "吉田　北斗",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "吉田　北斗",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名6"
              }
            },
            {
              "type": "text",
              "name": "背番号6",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号6"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ7",
          "raw": {
            "x": 49,
            "y": 1016,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名7",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション7",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseMF_FIX.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション7"
              }
            },
            {
              "type": "text",
              "name": "学年7",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年7"
              }
            },
            {
              "type": "text",
              "name": "選手名7",
              "text": "岡本　大地",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "岡本　大地",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名7"
              }
            },
            {
              "type": "text",
              "name": "背番号7",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号7"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ8",
          "raw": {
            "x": 321,
            "y": 1016,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名8",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション8",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseFW.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション8"
              }
            },
            {
              "type": "text",
              "name": "学年8",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年8"
              }
            },
            {
              "type": "text",
              "name": "選手名8",
              "text": "佐野　宏太",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "佐野　宏太",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名8"
              }
            },
            {
              "type": "text",
              "name": "背番号8",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号8"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ9",
          "raw": {
            "x": 585,
            "y": 1016,
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
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "選手名9",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "image",
              "name": "ポジション9",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseFW.png",
              "raw": {
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
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
                "height": 46,
                "keyexp": "ポジション9"
              }
            },
            {
              "type": "text",
              "name": "学年9",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "x": 186,
                "y": 7,
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
                "text": "(3年)",
                "width": 40,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 17,
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
                "height": 25,
                "keyexp": "学年9"
              }
            },
            {
              "type": "text",
              "name": "選手名9",
              "text": "佐野　宏太",
              "w": 120,
              "raw": {
                "x": 66,
                "y": 5,
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
                "text": "佐野　宏太",
                "width": 120,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 27,
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
                "height": 30,
                "keyexp": "選手名9"
              }
            },
            {
              "type": "text",
              "name": "背番号9",
              "text": "41",
              "w": 30,
              "raw": {
                "x": 33,
                "y": 4,
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
                "text": "41",
                "width": 30,
                "padding": 0,
                "align": "center",
                "verticalAlign": "middle",
                "fitMode": "shrink_font",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 20,
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
                "height": 30,
                "keyexp": "背番号9"
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "蹴り上げマーク",
          "src": "../../サブ下位置左/img/HD2D_S00_MarkHighSchool.png",
          "raw": {
            "x": 44,
            "y": 925,
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
            "width": 55,
            "height": 40
          }
        }
      ]
    }
  ]
};
