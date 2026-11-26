# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Chrome strings (day/night, menu) live in `ui`, with English fallbacks so a site that has not added the keys still renders.
- A note with no body uses `ui.noBody`. A site that has not added the key falls back to `ui.emptyStream`.

### Removed

- `@tailwindcss/vite` and `tailwindcss`. The stylesheet never used Tailwind utilities; the `@import "tailwindcss"` preflight is replaced by the theme's own reset.
- `social`. The footer never rendered it.
- `ui.noBodyZh`. Theme defaults are English; a site sets `ui.noBody` itself.

## [0.1.0] - 2026-10-11

### Added

- Astro blog theme: home stream, notes, archive, kinds, tags, pagination, RSS, sitemap, 404.
- One config file (`lone.config.ts`) and a `lone` integration so another repo can depend on this theme.
- Light and dark. Mincho titles, gothic body, self-hosted Latin fonts.
- Photo galleries, a contents list, and older/newer links on a note.
- GitHub Actions: `astro check` then `build` on `main`.

[Unreleased]: https://github.com/iClew/lone/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/iClew/lone/releases/tag/v0.1.0
