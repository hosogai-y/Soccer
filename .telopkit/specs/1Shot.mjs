// 1Shot（pull した _pulled_1Shot.mjs をもとに作る）。
// 追加: 同じ選手のまま下段の項目（プロ2コメント / Today'sゴール / Totalゴール、コメントの切替）を変えたとき、
//   下段のベースを上へプッシュしてベース（白い名前の帯）の裏に収め、切り替えた下段を下へプッシュして出す（合計 800ms）。
//   ・下段 = ザブトン画像の下の黒い帯（画像の 71px から下）＋ コメント・ゴール数。白い帯の下端でクリップして裏に隠す
//   ・ザブトン画像は 2 枚に分ける（上段: 白い帯まで / 下段: 黒い帯と影）。見た目は元と同じ
//   ・送出中（in_animation）の UPDATE で、氏名・背番号・所属・顔写真が前回と同じときだけ動く。別の選手・新たな TAKE はカット
// TelopEditor で 1Shot を直したときは、pull し直してからこのファイルを push する:
//   node .telopkit/telopkit.mjs pull 1Shot --out .telopkit/specs/_pulled_1Shot.mjs
//   node .telopkit/telopkit.mjs push .telopkit/specs/1Shot.mjs
import source from './_pulled_1Shot.mjs';

const clone = v => JSON.parse(JSON.stringify(v));

const BASE_NAME = '1SHOT用ザブトン';
const LOWER_NODES = ['プロ2コメント黄色', 'プロ2コメント', 'TOTALゴール', 'TODAYゴール'];
const BASE_X = 1286, BASE_Y = 929, BASE_W = 602;
const SPLIT = 71;                 // ザブトン画像の白い帯の下端（画像内の y）。ここから下が下段の黒い帯
const SPLIT_Y = BASE_Y + SPLIT;   // 1000
const SWAP_MS = 800;              // エフェクト全体の時間（上へ収める 400ms + 下へ出す 400ms）

const t = clone(source.telops[0]);

// pull し直したファイルに今回の構造が入っていても、元の並びに戻してから作り直す
let children = [];
for (const c of t.children) {
    if (c.name === '下段クリップ') {
        const lower = (c.children || []).find(n => n.name === '下段');
        for (const n of (lower?.children || [])) if (n.name !== `${BASE_NAME}下段`) children.push(n);
    } else if (c.name === '上段クリップ') {
        children.unshift(...(c.children || []));
    } else {
        children.push(c);
    }
}
const base = children.find(c => c.name === BASE_NAME);
if (!base) throw new Error(`${BASE_NAME} がありません`);
const lowerNodes = LOWER_NODES.map(name => {
    const n = children.find(c => c.name === name);
    if (!n) throw new Error(`${name} がありません`);
    return n;
});
const rest = children.filter(c => c !== base && !LOWER_NODES.includes(c.name));

const baseLower = clone(base);
baseLower.name = `${BASE_NAME}下段`;

t.children = [
    // 下段（上へ動くと白い帯の下端で切れて、ベースの裏に隠れる）
    {
        type: 'group', name: '下段クリップ', x: 0, y: 0,
        clip: { x: BASE_X, y: SPLIT_Y, w: BASE_W, h: 1080 - SPLIT_Y },
        children: [
            { type: 'group', name: '下段', x: 0, y: 0, class: 'oneshot-lower', children: [baseLower, ...lowerNodes] }
        ]
    },
    // 上段（白い帯まで）
    {
        type: 'group', name: '上段クリップ', x: 0, y: 0,
        clip: { x: BASE_X, y: BASE_Y - 20, w: BASE_W, h: SPLIT_Y - (BASE_Y - 20) },
        children: [base]
    },
    ...rest
];

// ---- customJs: 下段の切替エフェクト ----
const MARK_START = '// ==== 1Shot 下段切替エフェクト (telopkit spec 1Shot.mjs) ====';
const MARK_END = '// ==== /1Shot 下段切替エフェクト ====';
const LOWER_SWAP_JS = `${MARK_START}
/**
 * 同じ選手のまま下段（プロ2コメント / Today'sゴール / Totalゴール）を切り替えたとき、
 * 前の下段を上へプッシュしてベースの裏に収め、新しい下段を下へプッシュして出す。
 * UPDATE で DOM が作り直されても動くよう、表示のたびに下段の DOM を複製して取っておき、次の切替でそれを上へ送る。
 */
const LOWER_SWAP = {
    group: '下段',
    playerKeys: ['氏名', '背番号', '所属', '顔写真'],
    lowerKeys: ['mode', 'プロ2コメント', 'プロ2コメント黄色', "Today's数値", 'Total数値', "Today's(文字)", '今大会通算(文字)', 'ゴール(文字)'],
    distance: ${1080 - SPLIT_Y},
    duration: ${SWAP_MS},
    easeIn: 'cubic-bezier(.55,0,.75,.2)',
    easeOut: 'cubic-bezier(.16,1,.3,1)'
};
let lowerSwapValues = null;
let lowerSwapSnapshot = null;
let lowerSwapAnims = [];

function lowerSwapElement() {
    const d = window.telopDoc;
    const app = window.telopApp;
    if (!d || !d.nodesById || !app) return null;
    const node = Object.values(d.nodesById).find(n => n && n.name === LOWER_SWAP.group);
    return node ? app.querySelector('[data-node-id="' + node.id + '"]') : null;
}

function lowerSwapStop() {
    lowerSwapAnims.forEach(a => { try { a.cancel(); } catch (_) {} });
    lowerSwapAnims = [];
    document.querySelectorAll('.oneshot-lower-old').forEach(n => n.remove());
}

function lowerSwapPlay(el, oldEl) {
    lowerSwapStop();
    // 複製には data-node-id を残さない（更新処理が複製のほうを書き換えないように）
    oldEl.removeAttribute('data-node-id');
    oldEl.querySelectorAll('[data-node-id]').forEach(n => n.removeAttribute('data-node-id'));
    oldEl.classList.add('oneshot-lower-old');
    el.parentNode.insertBefore(oldEl, el);
    const half = LOWER_SWAP.duration / 2;
    const hidden = 'translate(0px, -' + LOWER_SWAP.distance + 'px)';
    const shown = 'translate(0px, 0px)';
    // 下段は位置 (0,0) のグループなので、CSS transform で動かしても配置は変わらない
    const out = oldEl.animate([{ transform: shown }, { transform: hidden }], { duration: half, easing: LOWER_SWAP.easeIn, fill: 'forwards' });
    const inn = el.animate([
        { transform: hidden, offset: 0 },
        { transform: hidden, offset: 0.5, easing: LOWER_SWAP.easeOut },
        { transform: shown, offset: 1 }
    ], { duration: LOWER_SWAP.duration, fill: 'backwards' });
    out.onfinish = () => oldEl.remove();
    lowerSwapAnims = [out, inn];
}

window.addEventListener('telopRendered', (e) => {
    const detail = (e && e.detail) || {};
    const prev = lowerSwapValues;
    const next = Object.assign({}, prev || {}, detail);
    lowerSwapValues = next;
    const el = lowerSwapElement();
    const oldEl = lowerSwapSnapshot;
    lowerSwapSnapshot = el ? el.cloneNode(true) : null;
    const container = document.getElementById(window.containerId || 'player-container');
    const onAir = !!container && container.classList.contains('in_animation');
    if (!prev || !onAir || !el || !oldEl || !el.parentNode) { lowerSwapStop(); return; }
    const same = k => String(prev[k] == null ? '' : prev[k]) === String(next[k] == null ? '' : next[k]);
    if (!LOWER_SWAP.playerKeys.every(same)) { lowerSwapStop(); return; }
    if (LOWER_SWAP.lowerKeys.every(same)) return;
    lowerSwapPlay(el, oldEl);
});
${MARK_END}
`;

if (t.raw?.customJs) {
    let js = t.raw.customJs;
    const s = js.indexOf(MARK_START);
    const e = js.indexOf(MARK_END);
    if (s >= 0 && e > s) js = js.slice(0, s) + js.slice(e + MARK_END.length + 1);
    const anchor = '// --- External Control API ---';
    if (!js.includes(anchor)) throw new Error('customJs に External Control API が見つかりません');
    t.raw.customJs = js.replace(anchor, LOWER_SWAP_JS + '\n' + anchor);
}

export default {
    telops: [t],
    samples: {
        '1Shot': [
            { mode: 'today', "Today's数値": '2' },
            { mode: 'total', 'Total数値': '8' }
        ]
    }
};
