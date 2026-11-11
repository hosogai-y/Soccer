// 大得点 4 種（大得点 / 大得点得点者 / 大得点PK / 大得点得点者PK）をまとめて作る spec。
// 元の見た目は pull したファイル（_pulled_大得点.mjs / _pulled_大得点得点者.mjs）をそのまま使い、
// 得点の上にステータス（前半終了・後半終了・延長前半終了・延長後半終了・試合終了）を足す。
//   ・ステータス: キー「ステータス」。空なら出さない（ダッシュボードがタイマーの前後半と得点から自動で選ぶ。手動でも変更可）
//   ・PK 戦: PK 結果「4 PK 5」はステータスの上（ステータスが空なら得点のすぐ上）
//   ・得点者の行: 黒ベースの右側の余白を詰め、中央のステータス・PK 結果と重ならない幅にする
//     （PK 結果込みでも行はずらさない）
// ダッシュボード（src/utils/scorers.ts）が 左得点者N / 左得点時間N / 右得点者N / 右得点時間N（N = 1〜4、1 が一番上）を送る。
// 行は下詰め（得点者が 2 人なら 3・4 行目を使う）で、名前が空の行は出さない。
//
// 元のテロップ（大得点の帯）を TelopEditor で直したときは、pull し直してからこのファイルを push する:
//   node .telopkit/telopkit.mjs pull 大得点 --out .telopkit/specs/_pulled_大得点.mjs
//   node .telopkit/telopkit.mjs pull 大得点得点者 --out .telopkit/specs/_pulled_大得点得点者.mjs
//   node .telopkit/telopkit.mjs push .telopkit/specs/大得点.mjs
import bigScore from './_pulled_大得点.mjs';
import scorerSource from './_pulled_大得点得点者.mjs';

const clone = v => JSON.parse(JSON.stringify(v));
const FONT = 'Noto Sans JP';
const SCORE_YELLOW = '#fddd10';

// ---- 大得点の帯（pull した大得点のノード。追加したノードは除く） ----
const ADDED = /^(ステータス|PK結果|PK結果下|[左右]得点者行\d)$/;
const BASE = bigScore.telops[0].children.filter(c => !ADDED.test(c.name));

// ---- 中央の箱（ステータス・PK 結果）: 黒の座布団 ----
const CENTER_X = 960;
const STATUS = { w: 176, h: 40, y: 904 };          // 得点（帯）のすぐ上
const PK = { w: 128, h: 40, gap: 4 };
const PK_Y_ABOVE_STATUS = STATUS.y - PK.gap - PK.h; // ステータスの上
const PK_Y_NO_STATUS = STATUS.y;                    // ステータスなし（空）のとき

const plateRect = (name, w, h) => ({
    type: 'rect', name, w, h,
    fill: { angle: 90, stops: ['#1c1c1c', '#050505'] },
    stroke: { color: '#4a4a4a', width: 1 },
    shadow: { color: '#000000', blur: 12, x: 0, y: 3, alpha: 0.5 }
});
const hairline = w => ({ type: 'rect', name: 'ハイライト', w, h: 1, fill: '#ffffff30' });

const statusBox = cls => ({
    type: 'group', name: 'ステータス', x: CENTER_X - STATUS.w / 2, y: STATUS.y, ...(cls ? { class: cls } : {}),
    showIf: { key: 'ステータス', op: 'not_empty' },
    children: [
        plateRect('ステータスベース', STATUS.w, STATUS.h),
        hairline(STATUS.w),
        { type: 'text', name: 'ステータス文字', key: 'ステータス', text: '試合終了', x: 8, y: 0, w: STATUS.w - 16, h: STATUS.h,
          font: FONT, size: 26, weight: 700, align: 'center', valign: 'middle', fit: 'shrink_x', fill: '#ffffff' }
    ]
});

const digit = (name, key, x) => ({
    type: 'text', name, key, text: '4', x, y: 0, w: 40, h: PK.h,
    font: FONT, size: 32, weight: 700, align: 'center', valign: 'middle', fit: 'shrink_x', fill: SCORE_YELLOW
});
// name: PK結果（ステータスの上）/ PK結果下（ステータスが空のとき、得点のすぐ上）
const pkBox = (name, y, showIf, cls) => ({
    type: 'group', name, x: CENTER_X - PK.w / 2, y, showIf, ...(cls ? { class: cls } : {}),
    children: [
        plateRect('PKベース', PK.w, PK.h),
        hairline(PK.w),
        digit('左PK得点', '左PK得点', 4),
        { type: 'text', name: 'PK文字', text: 'PK', x: 44, y: 0, w: 40, h: PK.h, font: FONT, size: 22, weight: 700, align: 'center', valign: 'middle', fill: SCORE_YELLOW },
        digit('右PK得点', '右PK得点', 84)
    ]
});
const pkBoxes = cls => [
    pkBox('PK結果', PK_Y_ABOVE_STATUS, { key: 'ステータス', op: 'not_empty' }, cls),
    pkBox('PK結果下', PK_Y_NO_STATUS, { key: 'ステータス', op: 'empty' }, cls)
];

// ---- 得点者の行 ----
const ROWS = 4;
const ROW_H = 36;
const ROW_GAP = 4;
const BOTTOM = 944;              // 4 行目の下端（大得点の帯のすぐ上）
const LEFT_X = 440;              // 左チームの行の左端
const CENTER_GAP = 8;            // 行の端と中央の箱（ステータス）のすき間
const ROW_W = CENTER_X - STATUS.w / 2 - CENTER_GAP - LEFT_X; // 424（以前は 500）
const RIGHT_X = 1920 - LEFT_X - ROW_W; // 右チームの行の左端（左右対称）
const NAME_W = 150;              // 選手名の幅（6 文字まではそのまま、7 文字以降は長体）
const NAME_SIZE = 25;
const TIME_W = ROW_W - 16 - NAME_W - 10 - 10; // 得点時間（右に 10px の余白）
const TIME_SIZE = 23;
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
    type: 'group', name: `左得点者行${n}`, x: LEFT_X, y: rowY(n), class: 'scorer-row',
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
    type: 'group', name: `右得点者行${n}`, x: RIGHT_X, y: rowY(n), class: 'scorer-row',
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

// 得点者の行・ステータス・PK 結果は、下から少し上がって出てくる（帯は大得点と同じくそのまま）
const SCORER_CSS = `
#player-container.in_animation .scorer-row { animation: scorerRowIn .45s cubic-bezier(.16,1,.3,1) both; }
@keyframes scorerRowIn { from { opacity: 0; translate: 0 12px; } to { opacity: 1; translate: 0 0; } }
`;

/** 元のテロップを複製して名前・子ノードを変える（読み込むデータファイル名も新しい名前に） */
function derive(source, name, children, css) {
    const t = clone(source.telops[0]);
    const old = t.name;
    t.name = name;
    if (t.raw?.customJs) t.raw.customJs = t.raw.customJs.split(`'./${old}.telop'`).join(`'./${name}.telop'`);
    if (css !== undefined) {
        if (t.raw) delete t.raw.customCss;
        t.css = css;
    }
    t.children = clone(children);
    return t;
}

const telops = [
    derive(bigScore, '大得点', [...BASE, statusBox()]),
    derive(scorerSource, '大得点得点者', [...BASE, ...rows, statusBox('scorer-row')], SCORER_CSS),
    derive(bigScore, '大得点PK', [...BASE, statusBox(), ...pkBoxes()]),
    derive(scorerSource, '大得点得点者PK', [...BASE, ...rows, statusBox('scorer-row'), ...pkBoxes('scorer-row')], SCORER_CSS)
];

// ---- プレビュー用のデータ ----
const emptyRows = {};
for (let n = 1; n <= ROWS; n++) Object.assign(emptyRows, { [`左得点者${n}`]: '', [`左得点時間${n}`]: '', [`右得点者${n}`]: '', [`右得点時間${n}`]: '' });
// 左: 2 色（青・白）+ 黄色エッジ / 右: 1 色（赤）エッジなし
const base = { '左チーム名': '札幌大谷', '右チーム名': '帯広北',
    ColorRectL: '#1f4fa8', ColorRectL2: '#ffffff', ColorEdgeL: '#ffd54f',
    ColorRectR: '#d32f2f', ColorRectR2: '#d32f2f', ColorEdgeR: '',
    LeftTeamColor: '#1f4fa8', RigtTeamColor: '#d32f2f' };
const manyScorers = {
    '左得点者1': '山田 侑人', '左得点時間1': '後半45+2分(P)',
    '左得点者2': 'ムハンマドアブーバクル', '左得点時間2': '後半5分',
    '左得点者3': '西島 都生', '左得点時間3': '前半12分 後半30分',
    '左得点者4': '川井 駿', '左得点時間4': '前半3分',
    '右得点者3': '佐野宏太郎丸', '右得点時間3': '延長前半2分(P)',
    '右得点者4': '岡本 大地', '右得点時間4': '前半40+1分'
};

export default {
    telops,
    samples: {
        '大得点': [
            { ...base, '左チーム得点': '1', '右チーム得点': '0', 'ステータス': '前半終了' },
            { ...base, '左チーム得点': '2', '右チーム得点': '2', 'ステータス': '延長後半終了' },
            { ...base, '左チーム得点': '0', '右チーム得点': '0', 'ステータス': '' }
        ],
        '大得点得点者': [
            { ...base, ...emptyRows, ...manyScorers, '左チーム得点': '5', '右チーム得点': '2', 'ステータス': '試合終了' },
            { ...base, ...emptyRows, '左チーム得点': '0', '右チーム得点': '0', 'ステータス': '前半終了' }
        ],
        '大得点PK': [
            { ...base, '左チーム得点': '1', '右チーム得点': '1', '左PK得点': '4', '右PK得点': '5', 'ステータス': '試合終了' },
            { ...base, '左チーム得点': '1', '右チーム得点': '1', '左PK得点': '4', '右PK得点': '5', 'ステータス': '' }
        ],
        '大得点得点者PK': [
            { ...base, ...emptyRows, ...manyScorers, '左チーム得点': '5', '右チーム得点': '5', '左PK得点': '4', '右PK得点': '5', 'ステータス': '試合終了' }
        ]
    }
};
