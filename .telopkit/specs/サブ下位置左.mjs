// サブ下位置左: KeyExp 学校名 / 選手名n・背番号n・学年n・ポジションn (n = 1..9, ポジションn は画像パス)
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
            "skewX": 0,
            "skewY": 0,
            "x": -9,
            "y": 924,
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
              "name": "チームベース",
              "src": "../../サブ下位置左/img/HD2D_F09_SubMember_TeamZabu_001.png",
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
                "width": 588,
                "height": 89,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": []
              }
            },
            {
              "type": "text",
              "name": "学校名",
              "text": "札幌大谷",
              "w": 220,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 130,
                "y": 0,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 220,
                "height": 46,
                "text": "札幌大谷",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学校名"
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "サブ1",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 49,
            "y": 976,
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
              "name": "ポジション1",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseGK_FIX.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
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
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年1"
              }
            },
            {
              "type": "text",
              "name": "選手名1",
              "text": "山田 侑人",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "山田 侑人",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名1"
              }
            },
            {
              "type": "text",
              "name": "背番号1",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号1"
              }
            }
          ],
          "showIf": {
            "key": "選手名1",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ2",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 320,
            "y": 976,
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
              "name": "ポジション2",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseDF_FIX.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション2"
              }
            },
            {
              "type": "text",
              "name": "学年2",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年2"
              }
            },
            {
              "type": "text",
              "name": "選手名2",
              "text": "西島 都生",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "西島 都生",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名2"
              }
            },
            {
              "type": "text",
              "name": "背番号2",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号2"
              }
            }
          ],
          "showIf": {
            "key": "選手名2",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ3",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 585,
            "y": 976,
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
              "name": "ポジション3",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseDF_FIX.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション3"
              }
            },
            {
              "type": "text",
              "name": "学年3",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年3"
              }
            },
            {
              "type": "text",
              "name": "選手名3",
              "text": "川井　駿",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "川井　駿",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名3"
              }
            },
            {
              "type": "text",
              "name": "背番号3",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号3"
              }
            }
          ],
          "showIf": {
            "key": "選手名3",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ4",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 846,
            "y": 976,
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
              "name": "ポジション4",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseDF_FIX.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション4"
              }
            },
            {
              "type": "text",
              "name": "学年4",
              "text": "(3年)",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年4"
              }
            },
            {
              "type": "text",
              "name": "選手名4",
              "text": "山﨑　遥翔",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "山﨑　遥翔",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名4"
              }
            },
            {
              "type": "text",
              "name": "背番号4",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号4"
              }
            }
          ],
          "showIf": {
            "key": "選手名4",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ5",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1112,
            "y": 976,
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
              "name": "ポジション5",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseMF_FIX.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション5"
              }
            },
            {
              "type": "text",
              "name": "学年5",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年5"
              }
            },
            {
              "type": "text",
              "name": "選手名5",
              "text": "高山　大樹",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "高山　大樹",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名5"
              }
            },
            {
              "type": "text",
              "name": "背番号5",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号5"
              }
            }
          ],
          "showIf": {
            "key": "選手名5",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ6",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 1375,
            "y": 976,
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
              "name": "ポジション6",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseMF_FIX.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション6"
              }
            },
            {
              "type": "text",
              "name": "学年6",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年6"
              }
            },
            {
              "type": "text",
              "name": "選手名6",
              "text": "吉田　北斗",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "吉田　北斗",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名6"
              }
            },
            {
              "type": "text",
              "name": "背番号6",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号6"
              }
            }
          ],
          "showIf": {
            "key": "選手名6",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ7",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 49,
            "y": 1016,
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
              "name": "ポジション7",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseMF_FIX.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション7"
              }
            },
            {
              "type": "text",
              "name": "学年7",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年7"
              }
            },
            {
              "type": "text",
              "name": "選手名7",
              "text": "岡本　大地",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "岡本　大地",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名7"
              }
            },
            {
              "type": "text",
              "name": "背番号7",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号7"
              }
            }
          ],
          "showIf": {
            "key": "選手名7",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ8",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 321,
            "y": 1016,
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
              "name": "ポジション8",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseFW.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション8"
              }
            },
            {
              "type": "text",
              "name": "学年8",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年8"
              }
            },
            {
              "type": "text",
              "name": "選手名8",
              "text": "佐野　宏太",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "佐野　宏太",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名8"
              }
            },
            {
              "type": "text",
              "name": "背番号8",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号8"
              }
            }
          ],
          "showIf": {
            "key": "選手名8",
            "op": "not_empty"
          }
        },
        {
          "type": "group",
          "name": "サブ9",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 585,
            "y": 1016,
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
              "name": "ポジション9",
              "src": "../../サブ下位置左/img/HD2D_F01_new_BaseFW.png",
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 0,
                "y": 0,
                "rotation": 0,
                "scaleX": 0.8,
                "scaleY": 0.8,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 318,
                "height": 46,
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "keyexp": "ポジション9"
              }
            },
            {
              "type": "text",
              "name": "学年9",
              "text": "(3年)",
              "w": 40,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 186,
                "y": 7,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 40,
                "height": 25,
                "text": "(3年)",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "学年9"
              }
            },
            {
              "type": "text",
              "name": "選手名9",
              "text": "佐野　宏太",
              "w": 120,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 66,
                "y": 5,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 120,
                "height": 30,
                "text": "佐野　宏太",
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
                "align": "left",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "選手名9"
              }
            },
            {
              "type": "text",
              "name": "背番号9",
              "text": "41",
              "w": 30,
              "raw": {
                "skewX": 0,
                "skewY": 0,
                "x": 33,
                "y": 4,
                "rotation": 0,
                "scaleX": 1,
                "scaleY": 1,
                "pivotX": 0,
                "pivotY": 0,
                "opacity": 1,
                "width": 30,
                "height": 30,
                "text": "41",
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
                "align": "center",
                "verticalAlign": "middle",
                "visible": true,
                "locked": false,
                "blendMode": "normal",
                "effects": [],
                "fitMode": "shrink_font",
                "keyexp": "背番号9"
              }
            }
          ],
          "showIf": {
            "key": "選手名9",
            "op": "not_empty"
          }
        },
        {
          "type": "image",
          "name": "蹴り上げマーク",
          "src": "../../サブ下位置左/img/HD2D_S00_MarkHighSchool.png",
          "raw": {
            "skewX": 0,
            "skewY": 0,
            "x": 44,
            "y": 925,
            "rotation": 0,
            "scaleX": 1,
            "scaleY": 1,
            "pivotX": 0,
            "pivotY": 0,
            "opacity": 1,
            "width": 55,
            "height": 40,
            "visible": true,
            "locked": false,
            "blendMode": "normal",
            "effects": []
          }
        }
      ]
    }
  ],
  "samples": {
    "サブ下位置左": [
      {
        "学校名": "帯広北",
        "選手名1": "控え　選手1",
        "背番号1": "12",
        "学年1": "(2年)",
        "ポジション1": "img/HD2D_F01_new_BaseGK_FIX.png",
        "選手名2": "控え　選手2",
        "背番号2": "13",
        "学年2": "(3年)",
        "ポジション2": "img/HD2D_F01_new_BaseDF_FIX.png",
        "選手名3": "アブーバクル　月舘汰壱",
        "背番号3": "14",
        "学年3": "(1年)",
        "ポジション3": "img/HD2D_F01_new_BaseDF_FIX.png",
        "選手名4": "控え　選手4",
        "背番号4": "15",
        "学年4": "(2年)",
        "ポジション4": "img/HD2D_F01_new_BaseMF_FIX.png",
        "選手名5": "控え　選手5",
        "背番号5": "16",
        "学年5": "(3年)",
        "ポジション5": "img/HD2D_F01_new_BaseMF_FIX.png",
        "選手名6": "控え　選手6",
        "背番号6": "17",
        "学年6": "(1年)",
        "ポジション6": "img/HD2D_F01_new_BaseFW.png",
        "選手名7": "",
        "背番号7": "",
        "学年7": "",
        "ポジション7": "",
        "選手名8": "",
        "背番号8": "",
        "学年8": "",
        "ポジション8": "",
        "選手名9": "",
        "背番号9": "",
        "学年9": "",
        "ポジション9": ""
      }
    ]
  }
};
