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
    anim: { in: [ /* tracks */ ], out: [ /* tracks */ ] },  // optional simple In/Out the dashboard can edit (see below)
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
| `image` | `src` (path relative to the spec), `key, w, h` (give one to keep the aspect ratio), `keepRatio, fit, align, valign` |
| `group` | `children, clip (true or {x,y,w,h,radius}), layout {dir, gap, padding, align, justify}, repeat {count, var}, bg` |

Paint: `fill` (`"#rrggbb[aa]"`; a gradient `{ angle, stops: ["#a", "#b"] or [[0,"#a"],[1,"#b"]], type: "radial", centerX, centerY, radius }`; or `null`),
`stroke { color, width, join }`, `shadow { color, blur, x, y, alpha }`, `fillKey` (a data key whose value replaces the color;
on a gradient it replaces the whole gradient with that one color).
To key one color of a gradient and keep the gradient, write that stop as `{ color: "#a", key: "teamColor", offset? }`.
For several stacked looks, use `layers: [top, ..., bottom]` (for example a thick dark outline under a thin colored one).
`bg` on a group takes the same paint (or `src` + `nineSlice: [t,r,b,l]`) plus `radius`, and sizes itself to the group's children.

- `key` is the data key the dashboard sends. Each telop's sample `<Telop>.json` is generated from the texts.
- `showIf`: `{ key, op, value }` (`op`: `not_empty` | `empty` | `equals` | `not_equals` | `contains` | `gt` | `gte` | `lt` | `lte`;
  the comparisons are numeric) or a JS expression string. Use it for on/off states: lamps on when `count gte n`, a runner when `base1 equals 1`, a ▲/▼ for top/bottom.
- A key that only drives `showIf` / `fillKey` gets no sample value (a gradient stop `key` gets the stop's color). To give it one, add a hidden holder:
  `{ type: "text", key: "ball", text: "2", w: 40, visible: false }`.
- `fit`: `shrink_x` (condensed type, the usual choice for names), `shrink_font`, `scale_to_fit`, `expand_xy`, or `none` (clips to the box).
- Image `fit`: `fill` (default; stretches to `w × h`), `cover` (keeps the ratio and crops; use it for keyed photos whose
  ratio you do not control, with `valign: "top"` for faces), or `contain` (keeps the ratio and fits inside; logos).
  `align` / `valign` pick where cover / contain anchor the image.
- Repeat (rankings, lists): a `layout` group with `repeat: { count }` and exactly one template child.
  `{i}` in keys and texts becomes the row number (`key: "name{i}"` gives `name1` … `nameN`).

## In / Out: `anim` or `css`

- `anim` is for In/Out the user should be able to change later in the TelopHub dashboard (Animation Panel).
  It is written to `<Telop>.anim.json`, and `<Telop>.anim.css` is generated from it.
  A track: `{ target, effect, dir, distance, scale, fade, duration, delay, ease }`.
  - `target`: a node `name` or text `key` in this telop (must be unique); omit it for the whole telop.
  - `effect`: `fade` | `slide` (`dir` = where it comes from / goes to: `left` `right` `up` `down`, `distance` px, default 40)
    | `wipe` (`dir` = the side the reveal starts from) | `pop` / `zoom` (`scale` at the hidden end) |
    `keyframes` (`name` of a `@keyframes` you define in `css`). `slide` / `pop` / `zoom` also fade unless `fade: false`.
  - Seconds for `duration` / `delay`. `ease` is any CSS timing function; each effect has a sensible default.
  - Tracks on the same target run together; stagger them with `delay`. The Out track list is separate.
  ```js
  anim: {
    in:  [ { effect: "fade", duration: 0.2 },
           { target: "plate", effect: "wipe", dir: "left", duration: 0.5 },
           { target: "name", effect: "slide", dir: "up", distance: 24, duration: 0.45, delay: 0.18 } ],
    out: [ { effect: "fade", duration: 0.3 } ],
  },
  ```
- `css` is for rich, hand-tuned motion (loops, multi-step keyframes, per-letter effects). It always wins over `anim`
  on the same element, so don't animate one element both ways.
- Knobs for `css`: declare a CSS variable with a `@param` comment and its default on `:root`, and the dashboard shows
  a slider / color picker for it. Its value goes in `anim.params` (the dashboard writes the same place).
  Types: `number`, `px`, `s`, `deg`, `%` (a range `min..max` and `step N` are optional) and `color` (hex).
  ```css
  /* @param --plate-speed number 0.25..4 step 0.05 Plate speed */
  /* @param --plate-color color Plate color */
  :root { --plate-speed: 1; --plate-color: #152a5c; }
  #player-container.in_animation .kit-plate { animation: kitWipe calc(0.55s / var(--plate-speed)) both; }
  ```
  Use knobs for what an operator might tune per show (speeds, distances, accent colors), not for every number.
- `pull` writes the telop's current `anim` into the spec. A `push` without `anim` keeps what the telop already has.
- Animate.css / Magic presets are only in the dashboard; pick them there.

## Facts about the player (verified; easy to get wrong)

- **Who owns which CSS.** The player's defaults sit in `@layer telop-base`, and the In/Out from `anim` / the TelopHub
  dashboard is generated into `<Telop>.anim.css` (`@layer telop-anim`). Never edit `<Telop>.anim.css` or `<Telop>.anim.json`
  by hand; change `anim` in the spec instead.
  The spec's `css` (and any rule you add to `<Telop>.css`) is unlayered, so it always wins over both, whatever its specificity.
  Leave the `@layer telop-base { ... }` block in `<Telop>.css` alone. Write animation as
  `#player-container.in_animation .x { ... }` and `#player-container.out_animation .x { ... }`.
- The out animation ends when every animation under the container has finished, so staggered exits play in full.
  Infinite animations are not waited for.
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
