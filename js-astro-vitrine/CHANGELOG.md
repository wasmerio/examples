# Changelog

All notable changes to this theme are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the theme follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-14

### Added

- Every word the theme prints is in `ui` in `src/config.ts`, ready to translate: headings, labels, counts, the contact form.

## [1.0.4] - 2026-10-14

### Fixed

- With analytics set to GA4, `gtag()` is now on `window`, so your own events can call it (it was a function local to the snippet).
- A wide table in a post scrolls inside a wrapper (`.table-scroll`) instead of having its own display changed, so screen readers still announce it as a table.

## [1.0.3] — 2026-09-23

### Fixed

- A draft object no longer ships its photograph. `draft: true` keeps the entry off the
  pages, but the file was still read and its image still built into `dist/`, unlinked and
  downloadable. Objects under `src/content/objects/_drafts/` are outside the loader's
  pattern, so nothing of them is built at all; the sample draft has moved there.

### Changed

- Two of the sample notes are the length a catalogue entry really runs to, so the entry
  page is shown holding more than a caption's worth of prose.
- `docs/customization.md` says why there is no `/about` page and what to write if you want
  one; `docs/content.md` documents `_drafts/` and what `cover` is for.

## [1.0.2] — 2026-09-23

### Changed

- `docs/deploy.md` says what Vercel and Netlify do on a first deploy on their own: a new
  Vercel project protects its deployment URL behind SSO, and a new Netlify site is private
  and reads the project as a monorepo because of `pnpm-workspace.yaml`.
- The CI workflow is simpler: it runs the gates on every push and pull request, and nothing
  else. The weekly Lighthouse schedule and the path filter it used to carry were ours, not
  yours, and they spent your Actions minutes.

## [1.0.1] — 2026-09-23

### Fixed

- A comment in the CI workflow was not in English.

## [1.0.0] — 2026-09-23

First release. The theme is unchanged since 0.9.0; what is new is everything around it —
the live demo at [vitrine-free.ondelva.com](https://vitrine-free.ondelva.com), the
screenshots in the README, and the link to Vitrine Pro.

## [0.9.0] — 2026-09-22

First snapshot of the free edition, cut from Vitrine Pro. The live demo and the
screenshots follow in 1.0.0.

### Added

- The plate grid: a 1px rule grid with objects set inside the cells, a caption above
  each cell and a cartellino (the museum wall label) below. Switch it off with
  `features.plate` for a plain spaced grid.
- Pages: home, catalogue with pagination, object entry, collections list and
  collection page, colophon, contact, privacy, terms, 404.
- Content collections for objects and collections, typed with zod in
  `src/content.config.ts`, 23 sample objects and 5 sample collections.
- Light and dark mode through `light-dark()` tokens and a three-state switcher
  (system, light, dark). Every token pair is checked against WCAG AA by
  `pnpm check:contrast`.
- RSS feed, sitemap, robots.txt, canonical URLs, Open Graph, Twitter cards and JSON-LD.
  An object page shares its own plate; every other page falls back to
  `public/og-default.jpg`.
- An analytics slot: Plausible, GA4 or Umami, off until `analytics.provider` is set.
- `AGENTS.md` for Claude Code, Cursor and other agents, with `CLAUDE.md` pointing at it.
- CI: `astro check`, ESLint, the contrast gate, a build, Lighthouse CI and an internal
  link check.
