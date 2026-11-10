// Pulled from telop "大得点得点者" by telopkit. Every node keeps its full editor props in `raw`.
// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push .telopkit/specs/_pulled_大得点得点者.mjs
export default {
  "title": "soccer",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "telops": [
    {
      "name": "大得点得点者",
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
        "customCss": "body { margin: 0; padding: 0; background: transparent; overflow: hidden; }\nsvg { width: 100%; height: 100%; display: block; }\n#player-container { opacity: 0; width: 1920px; height: 1080px; }\n.in_animation, #player-container.in_animation { opacity: 1; }\n.out_animation, #player-container.out_animation { opacity: 1; }\n#player-container.in_animation .anim-target, .in_animation:not(#player-container) { animation: fadeIn 0s forwards; opacity: 1; }\n#player-container.out_animation .anim-target, .out_animation:not(#player-container) { animation: fadeOut 0s forwards; }\n#player-container.in_animation:not(:has(.anim-target)) { animation: fadeIn 0s forwards; opacity: 1; }\n#player-container.out_animation:not(:has(.anim-target)) { animation: fadeOut 0s forwards; }\n/* Invisible node guard: never display or animate invisible nodes */\nsvg [visibility=\"hidden\"],\n.is-invisible,\n.is-invisible * {\n    display: none !important;\n    visibility: hidden !important;\n    opacity: 0 !important;\n    animation: none !important;\n    transform: none !important;\n    pointer-events: none !important;\n}\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }\n\n/* telop css */\n#player-container.in_animation .scorer-row { animation: scorerRowIn .45s cubic-bezier(.16,1,.3,1) both; }\n@keyframes scorerRowIn { from { opacity: 0; translate: 0 12px; } to { opacity: 1; translate: 0 0; } }\n"
      },
      "children": [
        {
          "type": "image",
          "name": "大得点チーム名ベース左",
          "src": "../../大得点得点者/img/HD2D_A00_BaseL_M122.png",
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
          "src": "../../大得点得点者/img/HD2D_A00_BaseR_M121.png",
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
        },
        {
          "type": "group",
          "name": "左得点者行1",
          "raw": {
            "x": 440,
            "y": 788,
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
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "左得点者1",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 0,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": -4,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 4,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 8,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 16,
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
                "text": "",
                "keyexp": "左得点者1",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 176,
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
                "text": "",
                "keyexp": "左得点時間1",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "右得点者行1",
          "raw": {
            "x": 980,
            "y": 788,
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
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "右得点者1",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 180,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 488,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
              "raw": {
                "x": 492,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 496,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 500,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 334,
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
                "text": "",
                "keyexp": "右得点者1",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 10,
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
                "text": "",
                "keyexp": "右得点時間1",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "左得点者行2",
          "raw": {
            "x": 440,
            "y": 828,
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
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "左得点者2",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 0,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": -4,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 4,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 8,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 16,
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
                "text": "",
                "keyexp": "左得点者2",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 176,
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
                "text": "",
                "keyexp": "左得点時間2",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "右得点者行2",
          "raw": {
            "x": 980,
            "y": 828,
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
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "右得点者2",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 180,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 488,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
              "raw": {
                "x": 492,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 496,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 500,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 334,
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
                "text": "",
                "keyexp": "右得点者2",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 10,
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
                "text": "",
                "keyexp": "右得点時間2",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "左得点者行3",
          "raw": {
            "x": 440,
            "y": 868,
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
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "左得点者3",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 0,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": -4,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 4,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 8,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 16,
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
                "text": "",
                "keyexp": "左得点者3",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 176,
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
                "text": "",
                "keyexp": "左得点時間3",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "右得点者行3",
          "raw": {
            "x": 980,
            "y": 868,
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
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "右得点者3",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 180,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 488,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
              "raw": {
                "x": 492,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 496,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 500,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 334,
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
                "text": "",
                "keyexp": "右得点者3",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 10,
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
                "text": "",
                "keyexp": "右得点時間3",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "左得点者行4",
          "raw": {
            "x": 440,
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
            "effects": [],
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "左得点者4",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 0,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": -4,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 4,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectL2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 8,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeL",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeL"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 16,
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
                "text": "",
                "keyexp": "左得点者4",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 176,
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
                "text": "",
                "keyexp": "左得点時間4",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "left",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "name": "右得点者行4",
          "raw": {
            "x": 980,
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
            "effects": [],
            "domClass": "scorer-row",
            "visibilityCondition": {
              "enabled": true,
              "targetKeyexp": "右得点者4",
              "operator": "not_empty"
            }
          },
          "children": [
            {
              "type": "rect",
              "name": "得点者ベース",
              "w": 500,
              "h": 36,
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
                "width": 500,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#0b0d14e6",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "gradientConfig": {
                        "type": "linear",
                        "angle": 180,
                        "units": "objectBoundingBox",
                        "stops": [
                          {
                            "offset": 0,
                            "color": "#0b0d14e6"
                          },
                          {
                            "offset": 1,
                            "color": "#0b0d1473"
                          }
                        ]
                      },
                      "shadowEnabled": true,
                      "shadowColor": "#000000",
                      "shadowBlur": 16,
                      "shadowOffsetX": 0,
                      "shadowOffsetY": 4,
                      "shadowAlpha": 0.45
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "ハイライト",
              "w": 500,
              "h": 1,
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
                "width": 500,
                "height": 1,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff30",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ左",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 488,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "チームカラー",
              "w": 8,
              "h": 36,
              "raw": {
                "x": 492,
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
                "width": 8,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "カラー2",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 496,
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
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#bd39fb",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorRectR2"
                    }
                  ]
                }
              }
            },
            {
              "type": "rect",
              "name": "エッジ右",
              "w": 4,
              "h": 36,
              "raw": {
                "x": 500,
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
                "visibilityCondition": {
                  "enabled": true,
                  "targetKeyexp": "ColorEdgeR",
                  "operator": "not_empty"
                },
                "width": 4,
                "height": 36,
                "style": {
                  "cornerRadius": 0,
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffffff",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10,
                      "fillKeyexp": "ColorEdgeR"
                    }
                  ]
                }
              }
            },
            {
              "type": "text",
              "name": "得点者",
              "text": "",
              "w": 150,
              "raw": {
                "x": 334,
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
                "text": "",
                "keyexp": "右得点者4",
                "width": 150,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 25,
                  "fontWeight": "bold",
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
                }
              }
            },
            {
              "type": "text",
              "name": "得点時間",
              "text": "",
              "w": 314,
              "raw": {
                "x": 10,
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
                "text": "",
                "keyexp": "右得点時間4",
                "width": 314,
                "height": 36,
                "padding": 0,
                "align": "right",
                "verticalAlign": "middle",
                "fitMode": "shrink_x",
                "style": {
                  "fontFamily": "Noto Sans JP",
                  "fontSize": 23,
                  "fontWeight": "bold",
                  "appearances": [
                    {
                      "enabled": true,
                      "fillEnabled": true,
                      "fill": "#ffd54f",
                      "strokeEnabled": false,
                      "color": "#000000",
                      "thickness": 0,
                      "lineJoin": "round",
                      "miterLimit": 10
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
