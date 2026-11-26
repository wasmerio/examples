# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Dark / light mode with a navbar toggle; preference persisted in
  `localStorage` and inferred from `prefers-color-scheme` on first visit.
- Client-side page navigation with fade transitions via Astro
  `<ClientRouter />` (scripts use document-level event delegation so burger and
  theme toggle survive SPA transitions).
- Gym template pages: Home (hero, stats, services, testimonials), About,
  Services with pricing plans, Blog, Contact, custom 404.
- Blog section backed by Astro Content Collections with three starter
  Markdown posts and an auto-generated RSS feed.
- SEO: canonical URLs, Open Graph (`website`/`article`), JSON-LD
  (`HealthClub` on the home page, `BlogPosting` on posts), sitemap, `robots.txt`.
- `prefers-reduced-motion` support for all animations and transitions.
- Accessibility: skip-to-content link, `aria-current` on the active nav item,
  visible `:focus-visible` styles, form labels with `required`/`autocomplete`,
  semantic landmarks and heading order.
- Performance: Bulma imported module-by-module (CSS reduced from ~690 KB to
  ~415 KB raw / ~44 KB gzip) instead of the full barrel.
- Home page "Latest articles" section showing the three most recent blog posts.
- Full article typography for blog posts (paragraphs, lists, headings,
  blockquote, code) and whole-card clickable blog cards (stretched link).

### Changed

- Contact details replaced with clearly fictitious placeholders
  (`hello@example.com`, `123 Example Street · Example City, EX`).

- Reworked the site from a wellness-adjacent starter into a bold dark theme
  with an adaptive light theme and a gym-focused, orange-accented palette.
- Inter loaded from Google Fonts with a non-blocking async pattern
  (preconnect + preload + `media="print" onload`).
- Navbar burger rendered as a native `<button>` with correct `aria-expanded`
  state; theme toggle and menu use event delegation.
- Contact form replaced the old light-theme styling; still fully static
  (composes a `mailto:` to `site.email`).

### Fixed

- Theme resetting to light after client-side navigation — re-applied on
  `astro:page-load`.
- Theme toggle and burger listeners being lost after SPA navigation.
- `has-text-white` usages that would be invisible in light mode.

### Security

- Security response headers via `public/_headers` (CSP, HSTS,
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- Expanded `.gitignore` coverage for environment files (`.env.*`).