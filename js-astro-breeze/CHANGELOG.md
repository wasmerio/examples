# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

## 1.1.0 - 2026-04-05

### Added

- Support configuring Artalk comments with `PUBLIC_ARTALK_SERVER` and `PUBLIC_ARTALK_ENABLED`.
- Add `ToolLogo.astro` so tools can render custom logos with optional light/dark variants.
- Extend the friends page with sorted links, a self card, and an optional comment area for link exchanges.

### Changed

- Refresh the Artalk component with theme-aware styling and a more robust client-side setup flow.
- Move shared page enter animation styles into global CSS so they apply consistently across pages.

### Fixed

- Disable element-level transitions during Astro page swaps to reduce visible flicker on navigation.
