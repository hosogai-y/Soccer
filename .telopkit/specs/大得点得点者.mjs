// 大得点 + 得点者履歴（最大 4 行・新しいゴールが上）。大得点のノードはそのまま（BASE）で、得点者の行を上に足す。
// ダッシュボード（src/utils/scorers.ts）が 左得点者N / 左得点時間N / 右得点者N / 右得点時間N（N = 1〜4、1 が一番上）を送る。
// 行は下詰め（得点者が 2 人なら 3・4 行目を使う）で、名前が空の行は出さない。
// push: node .telopkit/telopkit.mjs push .telopkit/specs/大得点得点者.mjs

const BASE = [
  {
    "type": "image",
    "name": "大得点チーム名ベース左",
    "src": "../../大得点/img/HD2D_A00_BaseL_M122.png",
    "raw": {
      "x": 397,
      "y": 947,
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
      "width": 563,
      "height": 106,
      "keyexp": ""
    }
  },
  {
    "type": "image",
    "name": "大得点チーム名ベース右",
    "src": "../../大得点/img/HD2D_A00_BaseR_M121.png",
    "raw": {
      "x": 960,
      "y": 947,
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
      "width": 563,
      "height": 106,
      "keyexp": ""
    }
  },
  {
    "type": "text",
    "name": "左チーム得点",
    "text": "11",
    "w": 67,
    "raw": {
      "x": 893,
      "y": 972,
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
      "text": "11",
      "width": 67,
      "padding": 0,
      "align": "center",
      "verticalAlign": "middle",
      "fitMode": "none",
      "style": {
        "fontFamily": "Noto Sans JP",
        "fontSize": 40,
        "fontWeight": 700,
        "appearances": [
          {
            "enabled": true,
            "fillEnabled": true,
            "fill": "#fddd10",
            "strokeEnabled": false,
            "color": "#ffffff",
            "thickness": 2,
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
        "letterSpacing": 0,
        "lineHeight": 1.2
      },
      "height": 42,
      "keyexp": "左チーム得点"
    }
  },
  {
    "type": "text",
    "name": "右チーム得点",
    "text": "11",
    "w": 67,
    "raw": {
      "x": 960,
      "y": 970,
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
      "text": "11",
      "width": 67,
      "padding": 0,
      "align": "center",
      "verticalAlign": "middle",
      "fitMode": "none",
      "style": {
        "fontFamily": "Noto Sans JP",
        "fontSize": 40,
        "fontWeight": 700,
        "appearances": [
          {
            "enabled": true,
            "fillEnabled": true,
            "fill": "#fddd10",
            "strokeEnabled": true,
            "color": "#000000",
            "thickness": 2,
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
        "letterSpacing": 0,
        "lineHeight": 1.2
      },
      "height": 46,
      "keyexp": "右チーム得点"
    }
  },
  {
    "type": "text",
    "name": "ハイフン",
    "text": "-",
    "w": 42,
    "raw": {
      "x": 939,
      "y": 974,
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
      "text": "-",
      "width": 42,
      "padding": 0,
      "align": "center",
      "verticalAlign": "middle",
      "fitMode": "none",
      "style": {
        "fontFamily": "Noto Sans JP",
        "fontSize": 40,
        "fontWeight": 700,
        "appearances": [
          {
            "enabled": true,
            "fillEnabled": true,
            "fill": "#fddd10",
            "strokeEnabled": false,
            "color": "#000000",
            "thickness": 2,
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
        "letterSpacing": 0,
        "lineHeight": 1.2
      },
      "height": 36
    }
  },
  {
    "type": "text",
    "name": "左チーム名",
    "text": "札幌大谷",
    "w": 290,
    "raw": {
      "x": 568,
      "y": 968,
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
      "width": 290,
      "padding": 0,
      "align": "center",
      "verticalAlign": "middle",
      "fitMode": "shrink_x",
      "style": {
        "fontFamily": "Noto Sans JP",
        "fontSize": 40,
        "fontWeight": 700,
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
      "height": 53,
      "keyexp": "左チーム名"
    }
  },
  {
    "type": "text",
    "name": "右チーム名",
    "text": "札幌大谷",
    "w": 290,
    "raw": {
      "x": 1067,
      "y": 968,
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
      "width": 290,
      "padding": 0,
      "align": "center",
      "verticalAlign": "middle",
      "fitMode": "shrink_x",
      "style": {
        "fontFamily": "Noto Sans JP",
        "fontSize": 40,
        "fontWeight": 700,
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
      "height": 53,
      "keyexp": "右チーム名"
    }
  },
  {
    "type": "group",
    "name": "LeftTeamColorRect",
    "raw": {
      "x": 507,
      "y": 955,
      "rotation": 0,
      "scaleX": 0.5747582219948462,
      "scaleY": 1.5542581353781675,
      "pivotX": 0,
      "pivotY": 0,
      "skewX": 12.409689987270337,
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
        "h": 45,
        "raw": {
          "x": -4,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 4,
          "height": 45,
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
                "fillKeyexp": "ColorEdgeL"
              }
            ],
            "cornerRadius": 0
          },
          "visibilityCondition": {
            "enabled": true,
            "targetKeyexp": "ColorEdgeL",
            "operator": "not_empty"
          }
        }
      },
      {
        "type": "rect",
        "name": "エッジ右",
        "w": 4,
        "h": 45,
        "raw": {
          "x": 37,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 4,
          "height": 45,
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
                "fillKeyexp": "ColorEdgeL"
              }
            ],
            "cornerRadius": 0
          },
          "visibilityCondition": {
            "enabled": true,
            "targetKeyexp": "ColorEdgeL",
            "operator": "not_empty"
          }
        }
      },
      {
        "type": "rect",
        "name": "Rectangle",
        "w": 37,
        "h": 45,
        "raw": {
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 37,
          "height": 45,
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
                "fillKeyexp": "ColorRectL"
              }
            ],
            "cornerRadius": 0
          },
          "domId": "LeftTeamColorLargePoint"
        }
      },
      {
        "type": "rect",
        "name": "カラー2",
        "w": 18.5,
        "h": 45,
        "raw": {
          "x": 18.5,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 18.5,
          "height": 45,
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
                "fillKeyexp": "ColorRectL2"
              }
            ],
            "cornerRadius": 0
          }
        }
      },
      {
        "type": "rect",
        "name": "Rectangle",
        "w": 37,
        "h": 45,
        "raw": {
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 37,
          "height": 45,
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
                      "offset": 0.95,
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
    "type": "group",
    "name": "RightTeamColorRect",
    "raw": {
      "x": 1391,
      "y": 955,
      "rotation": 0,
      "scaleX": 0.5747582219948462,
      "scaleY": 1.5542581353781675,
      "pivotX": 0,
      "pivotY": 0,
      "skewX": -12,
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
        "h": 45,
        "raw": {
          "x": -4,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 4,
          "height": 45,
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
                "fillKeyexp": "ColorEdgeR"
              }
            ],
            "cornerRadius": 0
          },
          "visibilityCondition": {
            "enabled": true,
            "targetKeyexp": "ColorEdgeR",
            "operator": "not_empty"
          }
        }
      },
      {
        "type": "rect",
        "name": "エッジ右",
        "w": 4,
        "h": 45,
        "raw": {
          "x": 37,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 4,
          "height": 45,
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
                "fillKeyexp": "ColorEdgeR"
              }
            ],
            "cornerRadius": 0
          },
          "visibilityCondition": {
            "enabled": true,
            "targetKeyexp": "ColorEdgeR",
            "operator": "not_empty"
          }
        }
      },
      {
        "type": "rect",
        "name": "Rectangle",
        "w": 37,
        "h": 45,
        "raw": {
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 37,
          "height": 45,
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
                "fillKeyexp": "ColorRectR"
              }
            ],
            "cornerRadius": 0
          },
          "domId": "RightTeamColorLargePoint"
        }
      },
      {
        "type": "rect",
        "name": "カラー2",
        "w": 18.5,
        "h": 45,
        "raw": {
          "x": 18.5,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 18.5,
          "height": 45,
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
                "fillKeyexp": "ColorRectR2"
              }
            ],
            "cornerRadius": 0
          }
        }
      },
      {
        "type": "rect",
        "name": "Rectangle",
        "w": 37,
        "h": 45,
        "raw": {
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "skewX": 0,
          "skewY": 0,
          "opacity": 1,
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "width": 37,
          "height": 45,
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
                      "offset": 0.95,
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
    "name": "LeftTeamColor",
    "text": "#bd39fb",
    "w": 52,
    "raw": {
      "x": 893,
      "y": 927,
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
      "width": 52,
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
      "height": 20,
      "keyexp": "LeftTeamColor"
    }
  },
  {
    "type": "text",
    "name": "RigtTeamColor",
    "text": "#bd39fb",
    "w": 52,
    "raw": {
      "x": 981,
      "y": 927,
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
      "width": 52,
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
      "height": 20,
      "keyexp": "RigtTeamColor"
    }
  }
];

const ROWS = 4;
const ROW_H = 36;
const ROW_GAP = 4;
const BOTTOM = 944;              // 4 行目の下端（大得点の帯のすぐ上）
const ROW_W = 500;
const LEFT_X = 440;              // 左チームの行の左端
const RIGHT_X = 1920 - LEFT_X - ROW_W; // 右チームの行の左端（左右対称）
const NAME_W = 150;              // 選手名の幅（6 文字まではそのまま、7 文字以降は長体）
const NAME_SIZE = 25;
const TIME_W = 314;
const TIME_SIZE = 23;
const FONT = 'Noto Sans JP';
const rowY = n => BOTTOM - (ROWS - n + 1) * ROW_H - (ROWS - n) * ROW_GAP;

const plate = (dir) => ({
    type: 'rect', name: '得点者ベース', x: 0, y: 0, w: ROW_W, h: ROW_H,
    fill: { angle: dir === 'left' ? 0 : 180, stops: [[0, '#0b0d14e6'], [1, '#0b0d1473']] },
    shadow: { color: '#000000', blur: 16, x: 0, y: 4, alpha: 0.45 }
});
const highlight = { type: 'rect', name: 'ハイライト', x: 0, y: 0, w: ROW_W, h: 1, fill: '#ffffff30' };

// 行のチームカラー帯（幅 BAR_W）: カラー1 → カラー2（右半分）＋ 左右のエッジ（4px・空なら非表示）。キーは大得点と同じ
const BAR_W = 8;
const EDGE_W = 4;
const edgeStrip = (name, x, s) => ({
    type: 'rect', name, x, y: 0, w: EDGE_W, h: ROW_H, fill: '#ffffff', fillKey: `ColorEdge${s}`,
    showIf: { key: `ColorEdge${s}`, op: 'not_empty' }
});
const colorBar = (x, s) => [
    edgeStrip('エッジ左', x - EDGE_W, s),
    { type: 'rect', name: 'チームカラー', x, y: 0, w: BAR_W, h: ROW_H, fill: '#bd39fb', fillKey: `ColorRect${s}` },
    { type: 'rect', name: 'カラー2', x: x + BAR_W / 2, y: 0, w: BAR_W / 2, h: ROW_H, fill: '#bd39fb', fillKey: `ColorRect${s}2` },
    edgeStrip('エッジ右', x + BAR_W, s)
];

const leftRow = n => ({
    type: 'group', name: `左得点者行${n}`, x: LEFT_X, y: rowY(n),
    showIf: { key: `左得点者${n}`, op: 'not_empty' },
    children: [
        plate('left'),
        highlight,
        ...colorBar(0, 'L'),
        { type: 'text', name: '得点者', key: `左得点者${n}`, text: '', x: 16, y: 0, w: NAME_W, h: ROW_H,
          font: FONT, size: NAME_SIZE, weight: 'bold', fill: '#ffffff', align: 'left', valign: 'middle', fit: 'shrink_x' },
        { type: 'text', name: '得点時間', key: `左得点時間${n}`, text: '', x: 16 + NAME_W + 10, y: 0, w: TIME_W, h: ROW_H,
          font: FONT, size: TIME_SIZE, weight: 'bold', fill: '#ffd54f', align: 'left', valign: 'middle', fit: 'shrink_x' }
    ]
});

const rightRow = n => ({
    type: 'group', name: `右得点者行${n}`, x: RIGHT_X, y: rowY(n),
    showIf: { key: `右得点者${n}`, op: 'not_empty' },
    children: [
        plate('right'),
        highlight,
        ...colorBar(ROW_W - BAR_W, 'R'),
        { type: 'text', name: '得点者', key: `右得点者${n}`, text: '', x: ROW_W - 16 - NAME_W, y: 0, w: NAME_W, h: ROW_H,
          font: FONT, size: NAME_SIZE, weight: 'bold', fill: '#ffffff', align: 'right', valign: 'middle', fit: 'shrink_x' },
        { type: 'text', name: '得点時間', key: `右得点時間${n}`, text: '', x: ROW_W - 16 - NAME_W - 10 - TIME_W, y: 0, w: TIME_W, h: ROW_H,
          font: FONT, size: TIME_SIZE, weight: 'bold', fill: '#ffd54f', align: 'right', valign: 'middle', fit: 'shrink_x' }
    ]
});

const rows = [];
for (let n = 1; n <= ROWS; n++) rows.push(leftRow(n), rightRow(n));

const empty = {};
for (let n = 1; n <= ROWS; n++) Object.assign(empty, { [`左得点者${n}`]: '', [`左得点時間${n}`]: '', [`右得点者${n}`]: '', [`右得点時間${n}`]: '' });
// 左: 2 色（青・白）+ 黄色エッジ / 右: 1 色（赤）エッジなし
const base = { '左チーム名': '札幌大谷', '右チーム名': '帯広北',
    ColorRectL: '#1f4fa8', ColorRectL2: '#ffffff', ColorEdgeL: '#ffd54f',
    ColorRectR: '#d32f2f', ColorRectR2: '#d32f2f', ColorEdgeR: '',
    LeftTeamColor: '#1f4fa8', RigtTeamColor: '#d32f2f' };

export default {
    telops: [{
        name: '大得点得点者',
        // 得点者の行はフェードで出す（帯は大得点と同じくそのまま）
        css: `
#player-container.in_animation .scorer-row { animation: scorerRowIn .45s cubic-bezier(.16,1,.3,1) both; }
@keyframes scorerRowIn { from { opacity: 0; translate: 0 12px; } to { opacity: 1; translate: 0 0; } }
`,
        children: [...BASE, ...rows.map(r => ({ ...r, class: 'scorer-row' }))]
    }],
    samples: {
        '大得点得点者': [
            // 左 4 人・右 2 人（下詰め）。長い名前・同じ選手の複数得点・アディショナル・PK
            { ...base, ...empty, '左チーム得点': '5', '右チーム得点': '2',
              '左得点者1': '山田 侑人', '左得点時間1': '後半45+2分(P)',
              '左得点者2': 'ムハンマドアブーバクル', '左得点時間2': '後半5分',
              '左得点者3': '西島 都生', '左得点時間3': '前半12分 後半30分',
              '左得点者4': '川井 駿', '左得点時間4': '前半3分',
              '右得点者3': '佐野宏太郎丸', '右得点時間3': '延長前半2分(P)',
              '右得点者4': '岡本 大地', '右得点時間4': '前半40+1分' },
            // 得点者なし
            { ...base, ...empty, '左チーム得点': '0', '右チーム得点': '0' }
        ]
    }
};
