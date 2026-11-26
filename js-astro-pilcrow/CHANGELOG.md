# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.4.1] - 2026-10-17

### Added

- Demo builds get a What's new page (this changelog, with links to the demo pages that show each
  feature), linked from the demo bar. Buyer builds are unchanged.

## [1.4.0] - 2026-10-17

### Added

- Math in posts and pages: `$…$` inline and `$$…$$` display, rendered with KaTeX at build time
  (no client-side JS). Chemical equations work through mhchem (`\ce{…}`). The KaTeX stylesheet
  and fonts load only on pages that contain math.
  If an existing post has two dollar amounts in one paragraph (`$20 and $30`), the text between
  them now renders as a formula: escape them as `\$20`. See it in the demo:
  [A Typography Sampler](https://pilcrow-free.ondelva.com/blog/typography-sampler/#math-set-as-math).

## [1.3.1] - 2026-10-14

### Fixed

- With analytics set to GA4, `gtag()` is now on `window`, so your own events can call it (it was a function local to the snippet).
- A wide table in a post scrolls inside a wrapper (`.table-scroll`) instead of having its own display changed, so screen readers still announce it as a table.

## [1.3.0] - 2026-09-23

### Added

- Hungarian UI strings, `src/i18n/hu.ts`. Set `site.locale: 'hu'` to use them.
- Latin Extended font subsets for Newsreader, Inter, and JetBrains Mono. Characters such as `ő`,
  `ű`, `ł`, `ř`, and `ş` now render in the theme fonts instead of falling back to a system font.
  Each subset is its own `@font-face` with a `unicode-range`, so a page only downloads it when it
  uses one of those characters: an English site loads exactly what it did before.

### Fixed

- Adding a language no longer needs a registration step. Every `src/i18n/<locale>.ts` is picked
  up automatically; before, a new file was silently ignored until it was also imported in
  `src/i18n/t.ts`.

## [1.2.3] - 2026-09-23

### Fixed

- `CLAUDE.md`, which is a symlink to `AGENTS.md`, is no longer written into the release
  snapshot. An unzip that ignores the symlink bit — Windows Explorer, 7-Zip — left a broken
  file where the guide should be.

## [1.2.2] - 2026-09-22

### Changed

- The author name is spelled in lowercase — `ondelva` — in `LICENSE`, the footer credit, and
  `docs/customization.md`. Only the spelling changed.

## [1.2.1] - 2026-09-21

### Added

- The footer carries one line crediting the theme, linking to its repository. Delete it if you
  would rather not have it — `docs/customization.md` says where. The Pro edition ships without it.

### Fixed

- The Lighthouse config listed only demo pages, so deleting one failed CI with a 404 that reads
  like a performance problem. `lighthouserc.cjs` now filters the list down to the pages that are
  actually there; restore a page and it is measured again.

## [1.2.0] - 2026-09-21

### Added

- Section components can be embedded in the body of a post or page. Wrap one in
  `<div class="not-prose breakout">` and it keeps the width and look it has on the home page; the
  prose around it stays at the reading measure. `breakout` is a new `@utility` in `global.css`, and
  no section component had to change.

### Fixed

- `.not-prose` now opts a block out of every `.prose` rule. Quotes, tables, list spacing, link
  underlines, and image rounding still leaked through, which restyled a section component embedded
  in a post.

## [1.1.2] - 2026-09-21

### Fixed

- The Lighthouse gate measures each URL three times instead of once. The first URL in the list
  absorbs the runner's cold start, so a page could fail the 95 threshold with the site unchanged.

## [1.1.1] - 2026-09-21

### Fixed

- CI uploads the Lighthouse report when the performance gate fails. `.lighthouseci` is a dotted
  directory, and `upload-artifact` skips hidden files by default, so the report that explains a
  failure was never actually attached.

## [1.1.0] - 2026-09-21

### Added

- Umami as an analytics provider, next to Plausible and GA4. `analytics.host` points a self-hosted
  Plausible or Umami at your own origin; leave it empty for the hosted service. The default is
  still `provider: null`, and a build with nothing set loads no third-party script.
- Deploy buttons for Vercel and Netlify in the README, beside the Cloudflare one.

## [1.0.4] - 2026-09-19

### Fixed

- No more `[astro-icon] Failed to load icons from "src/icons"` warning on every build. `src/icons/` now ships empty, ready for your own SVG icons.

## [1.0.3] - 2026-09-19

### Fixed

- `pnpm install` works with pnpm 9 and older pnpm 10 releases. The project now pins pnpm 10.34.5 instead of pnpm 12, which older pnpm could not read or switch to.

### Changed

- README and `docs/deploy.md` list the required Node.js and pnpm versions.

## [1.0.2] - 2026-09-19

### Changed

- README links to the Pro demo.

## [1.0.1] - 2026-09-17

### Changed

- README links to the Pro checkout page.

## [1.0.0] - 2026-09-17

### Added

- Rubricated drop cap on posts (`blog.dropCap`), serif italic section labels in a hanging left column.
- Blog with tags, pagination, RSS, sitemap, and JSON-LD.
- Home sections: Hero, Recent posts, Features, Newsletter, CTA.
- Pages: About, Contact (Web3Forms), Privacy, Terms, 404.
- Dark mode, self-hosted fonts (Newsreader, Inter, JetBrains Mono), UI strings in English and Korean.
- User docs: `docs/customization.md`, `docs/content.md`, `docs/deploy.md`, and `AGENTS.md`.
