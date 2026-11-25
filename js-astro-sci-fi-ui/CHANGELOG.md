# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
when version tags are published.

## [Unreleased]

### Added

- Open-source hygiene: `LICENSE` (MIT), `CONTRIBUTING.md`, and this changelog.
- Documentation under `docs/` (architecture, components, tokens/settings, third-party notes).
- Optional appearance presets (default, high-contrast, light) in settings and design tokens.
- `PUBLIC_FEATURE_INTEL_ML` and `PUBLIC_FEATURE_MAP` environment flags to disable heavy demo islands.
- Improved accessibility: focus-visible on primary nav, live regions for charts and intel mock UI, intel overlay motion aligned with `data-sf-animations`.

### Changed

- Require Node.js ≥ 22.23.4 so installs pick up the October 21, 2026 security releases (including CVE-2026-111497).
- Removed unused default Astro stub layout in favor of `ScifiLayout.astro` only.
