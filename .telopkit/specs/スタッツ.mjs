// Pulled from telop "スタッツ" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/スタッツ.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "スタッツ",
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
          "name": "４項目ベース",
          "src": "../../スタッツ/img/Stats_Base_4.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 141,
            "y": 853,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 420,
            "height": 200,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "右側チームザブトン",
          "src": "../../スタッツ/img/P02_Base_R_003.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 350,
            "y": 797,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 303,
            "height": 90,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "image",
          "name": "左側チームザブトン",
          "src": "../../スタッツ/img/P02_Base_L_004.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 48,
            "y": 797,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 303,
            "height": 90,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "group",
          "name": "LeftTeamColorRect",
          "raw": {
            "skewX": 10.203973721731684,
            "skewY": 0,
            "x": 105,
            "y": 804,
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
              "type": "rect",
              "name": "Rectangle",
              "w": 19,
              "h": 55,
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
                "width": 19,
                "height": 55,
                "style": {
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#1f4fa8",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "isMask": false,
                      "maskMode": "subtract",
                      "fillKeyexp": "ColorRectL"
                    }
                  ],
                  "cornerRadius": 0
                },
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "rect",
              "name": "Rectangle",
              "w": 19,
              "h": 55,
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
                "width": 19,
                "height": 55,
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
                            "offset": 0.51,
                            "color": "#ffffff29"
                          },
                          {
                            "offset": 0.5,
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
          "type": "group",
          "name": "RightTeamColorRect",
          "raw": {
            "skewX": -10.203973721731684,
            "skewY": 0,
            "x": 577,
            "y": 804,
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
              "type": "rect",
              "name": "Rectangle",
              "w": 19,
              "h": 55,
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
                "width": 19,
                "height": 55,
                "style": {
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#1f4fa8",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 2,
                      "lineJoin": "miter",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR"
                    }
                  ],
                  "cornerRadius": 0
                },
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "rect",
              "name": "Rectangle",
              "w": 19,
              "h": 55,
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
                "width": 19,
                "height": 55,
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
          "type": "group",
          "name": "カード",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 211,
            "y": 1012,
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
              "type": "text",
              "name": "カード(文字)",
              "text": "カード",
              "w": 99,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 89,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 99,
                "height": 29,
                "text": "カード",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "カード(文字)",
                "fitMode": "none"
              }
            },
            {
              "type": "image",
              "name": "左側レットカード",
              "src": "../../スタッツ/img/RedCard.png",
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
                "width": 28,
                "height": 36,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "image",
              "name": "左側イエローカード",
              "src": "../../スタッツ/img/YellowCard.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -30,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 28,
                "height": 36,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "image",
              "name": "右側イエローカード",
              "src": "../../スタッツ/img/YellowCard.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 277,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 28,
                "height": 36,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "image",
              "name": "右側レットカード",
              "src": "../../スタッツ/img/RedCard.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 246,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 28,
                "height": 36,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "text",
              "name": "右側レッド数値",
              "text": "3",
              "w": 24,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 248,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 24,
                "height": 29,
                "text": "3",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#4f4f4f",
                      "thickness": 1,
                      "lineJoin": "round",
                      "miterLimit": 1,
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
                      "thickness": 1,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "enabled": false,
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "右側レッド数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "右側イエロー数値",
              "text": "3",
              "w": 24,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 279,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 24,
                "height": 29,
                "text": "3",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#4f4f4f",
                      "thickness": 1,
                      "lineJoin": "round",
                      "miterLimit": 1,
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
                      "color": "#ffffff",
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "右側イエロー数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "左側イエロー数値",
              "text": "3",
              "w": 24,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -28,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 24,
                "height": 29,
                "text": "3",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#4f4f4f",
                      "thickness": 1,
                      "lineJoin": "round",
                      "miterLimit": 1,
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
                      "color": "#ffffff",
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "左側イエロー数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "左側レッド数値",
              "text": "3",
              "w": 24,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 2,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 24,
                "height": 29,
                "text": "3",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
                  "fontWeight": "normal",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": true,
                      "color": "#4f4f4f",
                      "thickness": 1,
                      "lineJoin": "round",
                      "miterLimit": 1,
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
                      "thickness": 1,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "enabled": false,
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "左側レッド数値",
                "fitMode": "none"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "CK",
          "raw": {
            "x": 469,
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
            "effects": []
          },
          "children": [
            {
              "type": "text",
              "name": "右側CK数値",
              "text": "12",
              "w": 32,
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
                "width": 32,
                "height": 29,
                "text": "12",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "右側CK数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "左側CK数値",
              "text": "12",
              "w": 32,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -274,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 32,
                "height": 29,
                "text": "12",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "左側CK数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "CK(文字)",
              "text": "CK",
              "w": 99,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -169,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 99,
                "height": 29,
                "text": "CK",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "fill": "#000000",
                      "strokeEnabled": true,
                      "color": "#000000",
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "CK(文字)",
                "fitMode": "none"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "FK",
          "raw": {
            "x": 470,
            "y": 914,
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
              "name": "右側FK数値",
              "text": "41",
              "w": 31,
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
                "width": 31,
                "height": 29,
                "text": "41",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "右側FK数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "左側FK数値",
              "text": "41",
              "w": 31,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -274,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 31,
                "height": 29,
                "text": "41",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "左側FK数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "FK(文字)",
              "text": "FK",
              "w": 99,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -170,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 99,
                "height": 29,
                "text": "FK",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "FK(文字)",
                "fitMode": "none"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "シュート",
          "raw": {
            "x": 467,
            "y": 866,
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
              "name": "右側シュート数値",
              "text": "20",
              "w": 36,
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
                "width": 36,
                "height": 29,
                "text": "20",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "右側シュート数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "左側シュート数値",
              "text": "20",
              "w": 36,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -274,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 36,
                "height": 29,
                "text": "20",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "左側シュート数値",
                "fitMode": "none"
              }
            },
            {
              "type": "text",
              "name": "シュート(文字)",
              "text": "シュート",
              "w": 99,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": -167,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 99,
                "height": 29,
                "text": "シュート",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 24,
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
                      "thickness": 1,
                      "lineJoin": "round",
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
                "align": "center",
                "verticalAlign": "top",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "シュート(文字)",
                "fitMode": "none"
              }
            }
          ]
        },
        {
          "type": "image",
          "name": "バー",
          "src": "../../スタッツ/img/得点中棒.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 346,
            "y": 831,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 10,
            "height": 6,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        },
        {
          "type": "text",
          "name": "Right得点数値",
          "text": "0",
          "w": 39,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 358,
            "y": 812,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 39,
            "height": 40,
            "text": "0",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 38,
              "fontWeight": 300,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#f0cd00",
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
                  "effects": []
                },
                {
                  "fillEnabled": false,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 1,
                  "lineJoin": "round",
                  "miterLimit": 6,
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
            "align": "center",
            "verticalAlign": "top",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "Right得点数値",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "右側チーム名",
          "text": "帯広北",
          "w": 170,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 400,
            "y": 816,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 170,
            "height": 31,
            "text": "帯広北",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 30,
              "fontWeight": 300,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#000000",
                  "strokeEnabled": false,
                  "color": "#000000",
                  "thickness": 1,
                  "lineJoin": "round",
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
            "align": "center",
            "verticalAlign": "top",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "右側チーム名",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "Left得点数値",
          "text": "0",
          "w": 39,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 303,
            "y": 812,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 39,
            "height": 40,
            "text": "0",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 38,
              "fontWeight": 300,
              "appearances": [
                {
                  "enabled": true,
                  "fillEnabled": true,
                  "fill": "#f0cd00",
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
                  "effects": []
                },
                {
                  "fillEnabled": false,
                  "fill": "#ffffff",
                  "strokeEnabled": true,
                  "color": "#000000",
                  "thickness": 1,
                  "lineJoin": "round",
                  "miterLimit": 6,
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
            "align": "center",
            "verticalAlign": "top",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "Left得点数値",
            "fitMode": "shrink_font"
          }
        },
        {
          "type": "text",
          "name": "左側チーム名",
          "text": "北海",
          "w": 170,
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 126,
            "y": 816,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 170,
            "height": 31,
            "text": "北海",
            "style": {
              "fontFamily": "Noto Sans JP",
              "fontSize": 30,
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
              "letterSpacing": 3,
              "lineHeight": 1.2
            },
            "align": "center",
            "verticalAlign": "top",
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": [],
            "keyexp": "左側チーム名",
            "fitMode": "shrink_font"
          }
        }
      ]
    }
  ]
};
