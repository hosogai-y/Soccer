// 大得点 / 大得点得点者 に PK 戦の結果（「4 PK 5」）を足した 2 つのテロップ。
// 元のテロップ（pull した _pulled_大得点.mjs / _pulled_大得点得点者.mjs）を複製し、得点の上に PK 結果の帯を置く。
// 大得点得点者PK は、PK 結果の帯のぶん得点者の行を上へずらす（PK 結果は大得点と得点者の間）。
// 元のテロップを直したら pull し直してから、このファイルを push する。
//   node .telopkit/telopkit.mjs push .telopkit/specs/大得点PK.mjs
import bigScore from './_pulled_大得点.mjs';
import scorers from './_pulled_大得点得点者.mjs';

const clone = v => JSON.parse(JSON.stringify(v));

// 大得点の得点部分と同じ色（黒の座布団に黄色の数字）
const SCORE_YELLOW = '#fddd10';
const PK_BOX = { x: 896, y: 904, w: 128, h: 40 };
const PK_GAP = 4; // PK 結果の帯と得点者の最下行のすき間
const ROW_SHIFT = PK_BOX.h + PK_GAP; // 得点者の行を上へずらす量

const digit = (name, key, x) => ({
    type: 'text', name, key, text: '4', x, y: 0, w: 40, h: PK_BOX.h,
    font: 'Noto Sans JP', size: 32, weight: 700, align: 'center', valign: 'middle', fit: 'shrink_x', fill: SCORE_YELLOW
});

const pkResult = cls => ({
    type: 'group', name: 'PK結果', x: PK_BOX.x, y: PK_BOX.y, ...(cls ? { class: cls } : {}),
    children: [
        {
            type: 'rect', name: 'PKベース', w: PK_BOX.w, h: PK_BOX.h,
            fill: { angle: 90, stops: ['#1c1c1c', '#050505'] },
            stroke: { color: '#4a4a4a', width: 1 },
            shadow: { color: '#000000', blur: 12, x: 0, y: 3, alpha: 0.5 }
        },
        { type: 'rect', name: 'ハイライト', w: PK_BOX.w, h: 1, fill: '#ffffff30' },
        digit('左PK得点', '左PK得点', 4),
        { type: 'text', name: 'PK文字', text: 'PK', x: 44, y: 0, w: 40, h: PK_BOX.h, font: 'Noto Sans JP', size: 22, weight: 700, align: 'center', valign: 'middle', fill: SCORE_YELLOW },
        digit('右PK得点', '右PK得点', 84)
    ]
});

/** 元のテロップを複製して名前を変える（読み込むデータファイル名も新しい名前に） */
function derive(source, name) {
    const t = clone(source.telops[0]);
    const old = t.name;
    t.name = name;
    if (t.raw?.customJs) t.raw.customJs = t.raw.customJs.split(`'./${old}.telop'`).join(`'./${name}.telop'`);
    return t;
}

const bigPk = derive(bigScore, '大得点PK');
bigPk.children.push(pkResult());

const scorersPk = derive(scorers, '大得点得点者PK');
for (const c of scorersPk.children) {
    if (/^[左右]得点者行\d$/.test(c.name)) c.raw.y -= ROW_SHIFT;
}
// 得点者の行と同じく、下から少し上がって出てくる
scorersPk.children.push(pkResult('scorer-row'));

const scorerSample = {
    左チーム得点: '1', 右チーム得点: '1', 左チーム名: '札幌創成', 右チーム名: '帯広北',
    左PK得点: '4', 右PK得点: '5',
    左得点者1: '浅田 卓人', 左得点時間1: '前半39分',
    右得点者1: '山本 大', 右得点時間1: '後半12分 後半40+2分(P)',
    右得点者2: '中村 光', 右得点時間2: '前半5分'
};

export default {
    telops: [bigPk, scorersPk],
    samples: {
        大得点PK: [{ 左チーム得点: '1', 右チーム得点: '1', 左チーム名: '札幌創成', 右チーム名: '帯広北', 左PK得点: '4', 右PK得点: '5' }],
        大得点得点者PK: [scorerSample]
    }
};
