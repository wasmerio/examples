# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Dark / light mode with a toggle in the navbar; preference persisted in `localStorage` and inferred from `prefers-color-scheme` on first visit.
- Client-side page navigation with fade transitions via Astro `<ClientRouter />`.
- Blog section backed by Astro Content Collections with six starter Markdown posts.
- Shared `Card` component used across Home and About pages.
- Accessibility improvements: skip-to-content link, `aria-current` on the active nav item, visible `:focus-visible` styles, `prefers-reduced-motion` support, form labels with `required`/`autocomplete` attributes, semantic list markup for card grids.
- CI pipeline (GitHub Actions) that installs dependencies, runs `pnpm audit`, and builds the site on every push and pull request.
- `SECURITY.md` vulnerability disclosure policy.

### Changed

- Reworked the site visual identity into a bold dark theme with an adaptive light theme and a communication-agency-focused palette.
- Extracted inline styles into reusable utility classes (`.u-constrained`, `.u-prose`, `.u-label-overline`, `.icon-lg`, etc.).
- Navbar burger switched from an anchor to a native `<button>` with correct `aria-expanded` state.

### Fixed

- Theme resetting to light after client-side navigation — the theme is now re-applied on `astro:page-load`.
- Theme toggle and burger listeners being lost after SPA navigation.
- Invalid HSL alpha syntax in global stylesheet.

### Security

- Security response headers via `public/_headers` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- Expanded `.gitignore` coverage for environment files (`.env.*`).
