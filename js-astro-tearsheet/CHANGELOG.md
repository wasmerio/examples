# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-10-14

### Added

- Every word the theme prints is in `ui` in `src/config.ts`, ready to translate, including the `/subscribe` pitch. Dates and numbers follow `site.locale` (they were always English).

## [1.0.2] - 2026-10-14

### Fixed

- With analytics set to GA4, `gtag()` is now on `window`, so your own events can call it (it was a function local to the snippet).
- A wide table in a post scrolls inside a wrapper (`.table-scroll`) instead of having its own display changed, so screen readers still announce it as a table.
- Chinese and Japanese are counted by character for the reading time; a sentence without spaces used to count as one word.

## [1.0.1] - 2026-10-13

### Fixed

- A caption is now only a paragraph set wholly in emphasis right after a picture. A paragraph
  there that merely contains one emphasised word stays body text. Captions get class `caption`
  from `src/lib/caption-plugin.ts`.

## [1.0.0] - 2026-10-12

First release. The demo is live at https://tearsheet-free.ondelva.com, with screenshots in
`docs/screenshots/` and the link to Pro.

## [0.9.1] - 2026-10-12

### Fixed

- The archive page shifted when the heading face loaded on systems without Arial (Linux,
  Android), failing the Lighthouse performance gate in CI. Weight 500 is now preloaded.

## [0.9.0] - 2026-10-12

First snapshot. The theme is complete; the live demo and the screenshots follow in 1.0.0.

### Added

- The newsletter set: home with the latest issue, issue pages, the archive by year, topic pages,
  subscribe with a plans table, a thank-you page, about, privacy, terms, 404.
- The Cut: everything after `<!-- cut -->` (`{/* cut */}` in MDX) is removed from the build, and
  the free part ends with a rule, a words-read meter and the subscribe form. `pnpm check:cut`
  searches the built site for any members text.
- Pictures in issues: resized to a `srcset` at build time, captions in plain Markdown, and a
  picture after the cut removed with the text and checked by `pnpm check:cut`.
- Start here (a reading list by issue id), Sponsor and Corrections pages, linked from the
  footer; twenty demo issues across two years, one of them showing every element.
- Issue numbers and ISO week labels computed from the date, starting at `newsletter.firstIssue`.
- A free/members meter on every archive row.
- Subscribe forms for Buttondown, and `DEMO_FORMS=1` for preview builds that subscribe nobody.
- Dark mode, analytics (Plausible, GA4, Umami) behind a switch.
- The feed, the sitemap, `robots.txt`.
- `docs/customization.md`, `docs/content.md`, `docs/deploy.md`, and `AGENTS.md`.
