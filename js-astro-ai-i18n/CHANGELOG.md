# Changelog

## Unreleased

- A fallback page (a locale URL serving the English original) now carries
  `<meta name="robots" content="noindex, follow">` next to its canonical on the
  English page. Before, it relied on the canonical alone.
- New build test (`test/fallback.test.mjs`): fallback pages must be noindex,
  translated pages must not. `npm test` now builds first.
