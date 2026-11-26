# Changelog

All notable changes to this theme are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-07-16

### Added

- Initial public release.
- Single-file site configuration (`src/config/site.ts`): all copy, contact
  details, opening hours, services, reviews, FAQ, legal info and UI strings.
- Role-based design tokens (`src/styles/tokens.css`) with a warm "artisan"
  default palette and an alternative "alpine" palette, both WCAG AA.
- "Dark sandwich" visual structure: dramatic dark hero with warm glows,
  grain texture, trust badges and a mountain-ridge divider; dark CTA banner
  and footer; light content sections in between.
- Nine modular sections: Hero, Services, About, Gallery, Reviews, CTA banner,
  FAQ, Practical info, Contact.
- Aggregate review score computed at build time from the configured reviews.
- Pure-CSS scroll-reveal animations (scroll-driven animations, zero JS,
  graceful fallback) and 200ms micro-interactions throughout.
- Local SEO built in: JSON-LD `LocalBusiness` + `FAQPage`, canonical URLs,
  Open Graph, Twitter cards, sitemap, robots.txt.
- GDPR-friendly by default: no cookies, no third-party requests, no web
  fonts CDN; privacy policy and legal notice pages included.
- Contact form with configurable endpoint and honeypot anti-spam field,
  falling back to a mailto button when no endpoint is set.
- Inline SVG icon set (no emoji, no icon font) and SVG review stars.
- Accessibility: skip link, focus-visible outlines, `prefers-reduced-motion`
  support, semantic markup throughout.
- French demo content and French legal pages in `examples/french-bakery/`.
