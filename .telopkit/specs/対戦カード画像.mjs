// 対戦カード（タイトルは画像）。大得点の帯（チーム名・チームカラー）をもとに、
// 中央の得点エリアに試合時間（例: 40分ハーフ（延長10分））、帯の上にタイトルを出す。
// キー: 左チーム名 / 右チーム名 / 試合時間（延長なし 1 行）・試合時間1・試合時間2（延長あり 2 行） / タイトル画像（画像の URL） / ColorRectL・L2・ColorEdgeL など（チームカラー）
// 生成元: 大得点の spec（BASE）。push: node .telopkit/telopkit.mjs push .telopkit/specs/対戦カード画像.mjs

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
  }
];

// チーム名の幅を、広げた中央の枠と重ならないように狭める
const NAME_W = 240;
BASE.forEach(n => {
    if (n.name === '左チーム名') { n.raw.x = 556; n.raw.width = NAME_W; }
    if (n.name === '右チーム名') { n.raw.x = 1124; n.raw.width = NAME_W; }
});

// ---- 中央の試合時間の枠（大得点の黒い枠を左右に広げた台形。左右の半分を逆向きに傾けて重ねる）----
const BOX_Y = 953;
const BOX_H = 71;
const HALF_W = 160;               // 片側の幅（中央で 10px 重ねる）
const SLANT = Math.atan(12 / BOX_H) * 180 / Math.PI; // 下に行くほど内側へ（大得点の枠と同じ傾き）
const BORDER = 3;
const boxFill = { angle: 90, stops: [[0, '#2a2a2a'], [0.45, '#0d0d0d'], [1, '#000000']] };
// フチ（左右）を先に描き、その上に塗り（左右）を描く（中央でフチが塗りに重なって線が出ないように）
const halfGroup = (side, part) => ({
    type: 'group', name: `試合時間${part === 'border' ? 'フチ' : '枠'}${side === 'left' ? '左' : '右'}`, x: 960, y: BOX_Y,
    skew: side === 'left' ? [SLANT, 0] : [-SLANT, 0],
    children: [part === 'border'
        ? { type: 'rect', name: 'フチ', x: side === 'left' ? -HALF_W - BORDER : -5, y: -BORDER, w: HALF_W + BORDER + 5, h: BOX_H + BORDER * 2, fill: '#4a4a4a' }
        : { type: 'rect', name: '枠', x: side === 'left' ? -HALF_W : -5, y: 0, w: HALF_W + 5, h: BOX_H, fill: boxFill }]
});
const half = (side) => halfGroup(side, 'border');
const halfFill = (side) => halfGroup(side, 'fill');
// 試合時間: 延長あり = 2 行（試合時間1「前半40分/後半40分」・試合時間2「延長前半10分/延長後半10分」）、
//           延長なし = 1 行（試合時間「前半40分/後半40分」を中央に）
const TIME_X = 960 - 140, TIME_W = 280;
const timeText = (name, key, y, h, size, showIf) => ({
    type: 'text', name, key, text: '', x: TIME_X, y, w: TIME_W, h,
    font: 'Noto Sans JP', size, weight: 'bold', fill: '#ffd400', align: 'center', valign: 'middle', fit: 'shrink_x', showIf
});
const matchTime = [
    timeText('試合時間1行', '試合時間', BOX_Y, BOX_H, 30, { key: '試合時間2', op: 'empty' }),
    timeText('試合時間上段', '試合時間1', BOX_Y + 4, 32, 26, { key: '試合時間2', op: 'not_empty' }),
    timeText('試合時間下段', '試合時間2', BOX_Y + 36, 32, 24, { key: '試合時間2', op: 'not_empty' })
];

// ---- タイトル（帯の上・中央）----
const TITLE_W = 760;
const TITLE_H = 56;
const TITLE_Y = 884;
const titleNodes = [{
    // 画像は枠（${TITLE_W} x 74）に収まるよう縦横比を保って縮める。帯の上に下揃え
    type: 'image', name: 'タイトル画像', key: 'タイトル画像', src: './img/title_sample.png',
    x: 960 - TITLE_W / 2, y: 870, w: TITLE_W, h: 74, fit: 'contain', align: 'center', valign: 'bottom',
    class: 'matchup-title', showIf: { key: 'タイトル画像', op: 'not_empty' }
}];

export default {
    telops: [{
        name: '対戦カード画像',
        css: `
#player-container.in_animation .matchup-title { animation: matchupTitleIn .5s cubic-bezier(.16,1,.3,1) .15s both; }
@keyframes matchupTitleIn { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }
`,
        children: [
            BASE[0], BASE[1],               // 帯（左右のベース画像）
            half('left'), half('right'), halfFill('left'), halfFill('right'), ...matchTime,
            ...BASE.slice(2),               // チーム名・チームカラー
            ...titleNodes
        ]
    }],
    samples: {
        '対戦カード画像': [
            { '左チーム名': '札幌大谷', '右チーム名': '帯広北', '試合時間': '前半40分/後半40分', '試合時間1': '前半40分/後半40分', '試合時間2': '延長前半10分/延長後半10分',
              'タイトル画像': 'img/title_sample.png',
              ColorRectL: '#1f4fa8', ColorRectL2: '#ffffff', ColorEdgeL: '#ffd54f',
              ColorRectR: '#d32f2f', ColorRectR2: '#d32f2f', ColorEdgeR: '' },
            { '左チーム名': '札幌第一高等学校サッカー部', '右チーム名': '旭川実業', '試合時間': '前半45分/後半45分', '試合時間1': '前半45分/後半45分', '試合時間2': '',
              'タイトル画像': '',
              ColorRectL: '#198754', ColorRectL2: '#198754', ColorEdgeL: '',
              ColorRectR: '#0dcaf0', ColorRectR2: '#0dcaf0', ColorEdgeR: '' }
        ]
    }
};
