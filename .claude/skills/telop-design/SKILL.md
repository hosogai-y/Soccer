---
name: telop-design
description: Make or change broadcast telops (lower thirds, scoreboards, rankings, captions, BSO ...) in this TelopHub project so they open in TelopEditor. Use whenever the user asks to make, design, restyle or fix a telop / テロップ / CG, or needs a telop's data keys for the dashboard.
---

# Telops with telopkit

`.telopkit/telopkit.mjs` builds telops through TelopEditor's own commands and exporter, so its output always opens in the editor.
Never hand-write `project.json`, `.telop` files or the player HTML.

## Workflow

1. `node .telopkit/telopkit.mjs inspect`: see which telops and keys exist.
2. New telop: write `.telopkit/specs/<Name>.mjs` (format below). To change an existing one, first run
   `node .telopkit/telopkit.mjs pull <Telop>`. That writes `.telopkit/specs/<Telop>.mjs` with every node's full editor props in `raw`.
   Edit those props, or replace nodes with the short-hand.
3. `node .telopkit/telopkit.mjs push .telopkit/specs/<Name>.mjs --frames 0.1,0.3 --guides`.
   It writes the telop into the project, backing up any old folder to `.telopkit/backup/`. It then renders it with the real player
   and loads the whole project with TelopEditor's loader.
   Output: `ok`, `opensInEditor`, `added`, `replaced`, `shots` (PNG paths), `errors`.
4. **Look at every final PNG** (and the frames when motion matters). Check the long and empty `samples` too.
   Fix the spec and push again until it looks right.
5. Tell the user what changed, what you checked, and that they should reopen the project in TelopEditor (or reload TelopHub).
   If the editor was open with unsaved work, its next save would overwrite the push, so mention it before you push.

`preview [--telop NAME]` re-renders without changing anything. Other flags: `--scale 1` (full size for detail),
`--bg checker|black|white|gray|#hex`. Fonts load from TelopHub (`.telopkit/hub.json`), so keep TelopHub running while you preview.

## Spec

```js
export default {
  telops: [{
    name: "GoalLowerThird",            // folder name = the name the dashboard uses in useTelop()
    css: `...`,                        // optional animation CSS (see below)
    children: [ /* nodes */ ],
  }],
  samples: { GoalLowerThird: [ { name: "Very long name ...", team: "" } ] }, // extra preview data sets
};
```

The spec is plain JS: use constants, loops and helper functions for shared colors and repeated parts.
`title` / `canvas` are taken from the project.

Common node props: `name, x, y, rotation, scale (n | [sx,sy]), pivot [px,py], skew, opacity, visible,
class (DOM class for CSS), domId, showIf, ignoreInLayout, blend, effects, raw`.
`raw` is merged into the node last. Strings `"@asset:<path>"` inside it become image assets.

| type | props |
|---|---|
| `text` | `text, key, w (required), h, font, size, weight ("normal"/"bold"/700), italic, align, valign, fit, letterSpacing, lineHeight, padding` + paint |
| `rect` | `w, h, radius` + paint |
| `image` | `src` (path relative to the spec), `key, w, h` (give one to keep the aspect ratio), `keepRatio` |
| `group` | `children, clip (true or {x,y,w,h,radius}), layout {dir, gap, padding, align, justify}, repeat {count, var}, bg` |

Paint: `fill` (`"#rrggbb[aa]"`; a gradient `{ angle, stops: ["#a", "#b"] or [[0,"#a"],[1,"#b"]], type: "radial", centerX, centerY, radius }`; or `null`),
`stroke { color, width, join }`, `shadow { color, blur, x, y, alpha }`, `fillKey` (a data key whose value replaces the color).
For several stacked looks, use `layers: [top, ..., bottom]` (for example a thick dark outline under a thin colored one).
`bg` on a group takes the same paint (or `src` + `nineSlice: [t,r,b,l]`) plus `radius`, and sizes itself to the group's children.

- `key` is the data key the dashboard sends. Each telop's sample `<Telop>.json` is generated from the texts.
- `showIf`: `{ key, op, value }` (`op`: `not_empty` | `empty` | `equals` | `not_equals` | `contains` | `gt` | `gte` | `lt` | `lte`;
  the comparisons are numeric) or a JS expression string. Use it for on/off states: lamps on when `count gte n`, a runner when `base1 equals 1`, a ▲/▼ for top/bottom.
- A key that only drives `showIf` / `fillKey` gets no sample value. To give it one, add a hidden holder:
  `{ type: "text", key: "ball", text: "2", w: 40, visible: false }`.
- `fit`: `shrink_x` (condensed type, the usual choice for names), `shrink_font`, `scale_to_fit`, `expand_xy`, or `none` (clips to the box).
- Repeat (rankings, lists): a `layout` group with `repeat: { count }` and exactly one template child.
  `{i}` in keys and texts becomes the row number (`key: "name{i}"` gives `name1` … `nameN`).

## Facts about the player (verified; easy to get wrong)

- **Animation selectors must start with `#player-container.in_animation`.** Direct telop children carry the default
  `#player-container.in_animation .anim-target { animation: fadeIn 0s }`, and a plain `.in_animation .x` loses to it.
  For the out animation, use `#player-container.out_animation .x`.
- **Animate `translate`, `scale`, `rotate` and `opacity`, never `transform`.** A node's position is its SVG transform attribute,
  and CSS `transform` replaces it, so the node jumps to 0,0. The individual properties stack on top of the position.
- A `clip` group is a fixed frame whose content moves. Put a `class` on the clipped group and slide it with `translate` for a wipe.
  Children of a clipped group are clipped too, which gives reveals.
- Use `animation: … both` with delays for staggers.
- Font weight: only normal and bold (700) render. 300/500/900 fall back to normal (telopkit warns about it).
- Colors must be hex: `#rgb`, `#rrggbb` or `#rrggbbaa`. Names like `white` don't parse.
- One appearance draws shadow, then stroke, then fill. The stroke is drawn at twice `width`, so `width` px of it shows outside the glyph.
- Fonts: Noto Sans JP, Noto Serif JP, BIZ UDPGothic, BIZ UDPMincho, Zen Kaku Gothic New, Zen Old Mincho, M PLUS 1p, M PLUS Rounded 1c.
  Custom fonts in TelopHub's font manager are also available by their file name (without the extension).

## Making it look good

- Keep everything inside the 90% action-safe guide (cyan) and text inside the 80% title-safe guide (yellow); check with `--guides`.
  Score bugs may sit between the two guides.
- Build depth with layers: a base plate with a gradient, a thin highlight line (`#ffffff30`, 1–2px), and an accent bar or tag in one strong color.
  A soft drop shadow (blur 16–30, alpha .4–.6) lifts the plate off busy video. Glows (a shadow in the fill color, y 0) suit lamps and active states.
- Contrast first: white or very light text on a dark plate, or a dark `stroke` when there is no plate.
  At 1080p, secondary text should be at least about 24px and names 40px or more.
- Use one or two font families, and build the hierarchy from size and weight rather than more colors.
  Latin captions look good in caps with `letterSpacing` 2–4.
- Give every name and number box a fixed `w` and `fit: "shrink_x"`. Test the longest real value and an empty one in `samples`.
- Motion: 0.3–0.6s ease-out (`cubic-bezier(.16,1,.3,1)`): the plate first, then the content staggered 60–120ms apart.
  Keep overshoot (`cubic-bezier(.34,1.56,.64,1)`) for small tags.
