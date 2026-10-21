<!-- telophub:ai-kit:start — written by TelopHub; this block is replaced when TelopHub updates. Put your own notes outside it. -->
# TelopHub project "soccer"

This folder is a TelopHub project. TelopEditor (hosted inside TelopHub) loads its telops from here and saves them back here.
TelopHub only reads this folder, so you can change telops by editing files here.

## Telops: use telopkit

`node .telopkit/telopkit.mjs <command>` creates and edits telops with TelopEditor's own code.
It previews them with the real player and checks that the project still opens in TelopEditor. Plain Node is enough; nothing to install.

- `inspect`: lists the telops, their node trees and data keys. **Start here.**
- New telop: write `.telopkit/specs/<Name>.mjs`, then run `push .telopkit/specs/<Name>.mjs`.
- Change an existing telop: run `pull <Telop>` to get a lossless spec in `.telopkit/specs/<Telop>.mjs`, edit it, then `push` it.
- `push` replaces only the telops in the spec and backs up the old folder to `.telopkit/backup/`.
- It prints PNG paths. **Look at them before you report.**

How to write specs, the player's pitfalls, and design guidance are in the `telop-design` skill (`.claude/skills/telop-design/SKILL.md`).

Rules:
- Don't hand-edit `project.json`, `*.telop`, `viewer/`, or a telop's generated `.html` / `.js`.
  TelopEditor rewrites them; go through telopkit.
- If TelopEditor is open on this project, its next save overwrites what you pushed.
  Ask the user to save and close the editor before you push, and to reopen it (or reload TelopHub) afterwards to see the result.

## Dashboard (when `package.json` and `src/` exist)

The dashboard is a React + Vite app that controls the telops through `@sdk/TelopHubSDK` (API: `sdk/README.md`).
- `useTelop('<TelopName>')` takes the telop folder name. Its data keys are exactly the keys `inspect` lists.
  `node .telopkit/telopkit.mjs inspect --json` returns them in machine-readable form, and `<Telop>/<Telop>.json` holds sample values.
- Build the controls around those keys: text inputs for names, +/- buttons for scores and counts, toggles for flags.
  Wire the TAKE / UPDATE / HIDE buttons to `show()`, `update()` and `hide()`.
- Run `npm install`, then `npm run dev` while working. `npm run build` writes `.hub/dashboard_dist`,
  which TelopHub serves behind the project's 🎨 button.
- When you add or rename a telop key, update the dashboard in the same change.

TelopHub refreshes `.telopkit/telopkit*` and `.claude/skills/telop-design/`. Your specs in `.telopkit/specs/` are left alone.
<!-- telophub:ai-kit:end -->
