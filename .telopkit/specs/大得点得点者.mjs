// 大得点 + 得点者履歴（最大 4 行・新しいゴールが上）。大得点のノードはそのまま（BASE）で、得点者の行を上に足す。
// ダッシュボード（src/utils/scorers.ts）が 左得点者N / 左得点時間N / 右得点者N / 右得点時間N（N = 1〜4、1 が一番上）を送る。
// 行は下詰め（得点者が 2 人なら 3・4 行目を使う）で、名前が空の行は出さない。
// push: node .telopkit/telopkit.mjs push .telopkit/specs/大得点得点者.mjs

const BASE = [
  {
    "type": "image",
    "name": "大得点チーム名ベース左",
    "src": "../../大得点/img/チーム名ベース左/HD2D_A00_BaseL_M122.png",
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 397,
      "y": 947,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 563,
      "height": 106,
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "keyexp": ""
    }
  },
  {
    "type": "image",
    "name": "大得点チーム名ベース右",
    "src": "../../大得点/img/チーム名ベース右/HD2D_A00_BaseR_M121.png",
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 960,
      "y": 947,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 563,
      "height": 106,
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "keyexp": ""
    }
  },
  {
    "type": "text",
    "name": "左チーム得点",
    "text": "11",
    "w": 67,
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 893,
      "y": 972,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 67,
      "height": 42,
      "text": "11",
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
      "align": "center",
      "verticalAlign": "middle",
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "fitMode": "none",
      "keyexp": "左チーム得点"
    }
  },
  {
    "type": "text",
    "name": "右チーム得点",
    "text": "11",
    "w": 67,
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 960,
      "y": 970,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 67,
      "height": 46,
      "text": "11",
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
      "align": "center",
      "verticalAlign": "middle",
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "fitMode": "none",
      "keyexp": "右チーム得点"
    }
  },
  {
    "type": "text",
    "name": "ハイフン",
    "text": "-",
    "w": 42,
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 939,
      "y": 974,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 42,
      "height": 36,
      "text": "-",
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
      "align": "center",
      "verticalAlign": "middle",
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "fitMode": "none"
    }
  },
  {
    "type": "text",
    "name": "左チーム名",
    "text": "札幌大谷",
    "w": 290,
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 568,
      "y": 968,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 290,
      "height": 53,
      "text": "札幌大谷",
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
      "align": "center",
      "verticalAlign": "middle",
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "fitMode": "shrink_x",
      "keyexp": "左チーム名"
    }
  },
  {
    "type": "text",
    "name": "右チーム名",
    "text": "札幌大谷",
    "w": 290,
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 1067,
      "y": 968,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 290,
      "height": 53,
      "text": "札幌大谷",
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
      "align": "center",
      "verticalAlign": "middle",
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "fitMode": "shrink_x",
      "keyexp": "右チーム名"
    }
  },
  {
    "type": "group",
    "name": "LeftTeamColorRect",
    "raw": {
      "skewX": 12.409689987270337,
      "skewY": 0,
      "x": 507,
      "y": 955,
      "rotation": 0,
      "scaleX": 0.5747582219948462,
      "scaleY": 1.5542581353781675,
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
        "w": 37,
        "h": 45,
        "raw": {
          "skewX": 0,
          "skewY": 0,
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "opacity": 1,
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
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "domId": "LeftTeamColorLargePoint"
        }
      },
      {
        "type": "rect",
        "name": "Rectangle",
        "w": 37,
        "h": 45,
        "raw": {
          "skewX": 0,
          "skewY": 0,
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "opacity": 1,
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
      "skewX": -12,
      "skewY": 0,
      "x": 1391,
      "y": 955,
      "rotation": 0,
      "scaleX": 0.5747582219948462,
      "scaleY": 1.5542581353781675,
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
        "w": 37,
        "h": 45,
        "raw": {
          "skewX": 0,
          "skewY": 0,
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "opacity": 1,
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
          "visible": true,
          "locked": false,
          "blendMode": "normal",
          "effects": [],
          "domId": "RightTeamColorLargePoint"
        }
      },
      {
        "type": "rect",
        "name": "Rectangle",
        "w": 37,
        "h": 45,
        "raw": {
          "skewX": 0,
          "skewY": 0,
          "x": 0,
          "y": 0,
          "rotation": 0,
          "scaleX": 1,
          "scaleY": 0.9999999999999999,
          "pivotX": 0,
          "pivotY": 0,
          "opacity": 1,
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
    "name": "LeftTeamColor",
    "text": "#bd39fb",
    "w": 52,
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 893,
      "y": 927,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 52,
      "height": 20,
      "text": "#bd39fb",
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
      "align": "left",
      "verticalAlign": "middle",
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "fitMode": "none",
      "keyexp": "LeftTeamColor"
    }
  },
  {
    "type": "text",
    "name": "RigtTeamColor",
    "text": "#bd39fb",
    "w": 52,
    "raw": {
      "skewX": 0,
      "skewY": 0,
      "x": 981,
      "y": 927,
      "rotation": 0,
      "scaleX": 1,
      "scaleY": 1,
      "pivotX": 0,
      "pivotY": 0,
      "opacity": 1,
      "width": 52,
      "height": 20,
      "text": "#bd39fb",
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
      "align": "left",
      "verticalAlign": "middle",
      "visible": true,
      "locked": false,
      "blendMode": "normal",
      "effects": [],
      "fitMode": "none",
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

const leftRow = n => ({
    type: 'group', name: `左得点者行${n}`, x: LEFT_X, y: rowY(n),
    showIf: { key: `左得点者${n}`, op: 'not_empty' },
    children: [
        plate('left'),
        highlight,
        { type: 'rect', name: 'チームカラー', x: 0, y: 0, w: 6, h: ROW_H, fill: '#bd39fb', fillKey: 'ColorRectL' },
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
        { type: 'rect', name: 'チームカラー', x: ROW_W - 6, y: 0, w: 6, h: ROW_H, fill: '#bd39fb', fillKey: 'ColorRectR' },
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
const base = { '左チーム名': '札幌大谷', '右チーム名': '帯広北', ColorRectL: '#1f4fa8', ColorRectR: '#d32f2f', LeftTeamColor: '#1f4fa8', RigtTeamColor: '#d32f2f' };

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
