# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.2.1] - 2026-10-17

### Added

- Demo builds get a What's new page (this changelog, with links to the demo pages that show each
  feature), linked from the demo bar. Buyer builds are unchanged.

## [1.2.0] - 2026-10-17

### Added

- Math in posts: `$…$` inline and `$$…$$` display, rendered with KaTeX at build time (no client
  JavaScript). Chemical equations work through mhchem (`\ce{…}`). The KaTeX stylesheet and fonts
  load only on pages that contain math, and a wide formula scrolls in a box the keyboard can reach.
  If an existing post has two dollar amounts in one paragraph (`$20 and $30`), the text between
  them now renders as a formula: escape them as `\$20`.
  See it in the demo: [How the index stays small](https://quarry-free.ondelva.com/blog/how-the-index-stays-small/).

## [1.1.0] - 2026-10-14

### Added

- Every word the theme prints around your content is in `ui` in `src/config.ts`, ready to translate: navigation labels, the blog chrome, the contact form, the 404 page and the price units.

## [1.0.2] - 2026-10-14

### Fixed

- With analytics set to GA4, `gtag()` is now on `window`, so your own events can call it (it was a function local to the snippet).
- Chinese and Japanese are counted by character for the reading time; a sentence without spaces used to count as one word.

## [1.0.1] - 2026-09-22

The fixes from Quarry Pro 1.0.1 that apply to this edition.

### Fixed

- `CLAUDE.md` is no longer part of the published snapshot. It is a symlink to `AGENTS.md`, and an
  archive keeps it as one: an unzip that ignores the symlink bit — Windows Explorer, 7-Zip — left
  a nine-byte file where the guide should be. `AGENTS.md` is unchanged and is what the README names.
- The theme switch no longer carries `aria-pressed`. It cycles system, light and dark, and a
  two-state attribute reported "not pressed" for two of the three.
- The CI comment named `lighthouserc.json`; the file is `lighthouserc.cjs`.

### Changed

- The questions on the home page use the theme's own disclosure marker, `+` and `−`, rather than
  the browser's triangle.
- `docs/customization.md` now covers putting a real screenshot where the product drawing is: keep
  the frame, set `loading="eager"` because the shot is a candidate for the largest contentful
  paint, and swap a light/dark pair with the theme's own switch. `<picture>` with
  `prefers-color-scheme` follows the operating system and not `data-theme`, which is the wrong
  answer here.

## [1.0.0] - 2026-09-22

First release. The demo is live at https://quarry-free.ondelva.com and the screenshots are in
`docs/screenshots/`.

### Added

- A live demo, and the Pro demo at https://quarry.ondelva.com.
- A purchase link for Quarry Pro in the README: $49 for one person, $129 for a team of up to ten.

## [0.9.0] - 2026-09-22

First snapshot of the free edition, cut from Quarry Pro. The live demo and the screenshots
follow in 1.0.0.

### Added

- The marketing set: home, pricing, about, contact, the legal pages, 404.
- The marginal index: a numbered label that stays in the left margin while its section scrolls.
  Pure CSS — the number is a counter, so it is never typed.
- One measure (38rem) from the hero to the last post, and one accent colour on the numbers, the
  current position and the focus ring.
- The writing set: list, post, tags, feed, reading time.
- Pricing from one JSON file, three plans, no client JavaScript.
- Syntax colouring built from the theme's own tokens, so `pnpm check:contrast` can measure it.
- Dark mode, analytics (Plausible, GA4, Umami) behind a switch, `robots.txt`, the sitemap.
- `docs/customization.md`, `docs/content.md`, `docs/deploy.md`, and `AGENTS.md`.
