# 1. Self-host fonts via Fontsource instead of CDN

Status: Superseded by ADR 004
Status Date: 2026-04-20
Driver: Alexander Holbreich
Contributors: —

## Context

The starter ships with an empty `src/styles/fonts.css` placeholder. A
professional starter should demonstrate a real font setup. The options are:

- Google Fonts CDN — simple but sends user IPs to Google on every page load
  (GDPR concern, especially relevant for German-language sites)
- Astro 6 font API (`fontProviders` in `astro.config.mjs`) — first-class,
  privacy-respecting, but only available from Astro 6.0.0 onward
- Fontsource npm packages — self-hosted `@font-face` declarations bundled
  into the site at build time; no runtime network requests

The project is pinned to Astro 5.x.

## Decision

Use `@fontsource-variable/inter` (Inter Variable weight axis). The package
is imported in `src/styles/fonts.css` and applied as the base `font-family`
on `body`. No external requests are made at runtime.

### Consequences

- Font files are bundled into `dist/` at build time, adding ~150 KB to the
  build output (acceptable for a starter; tree-shaken in production via
  `subset` options if needed).
- No GDPR consent required for font loading.
- `fonts.css` documents the Astro 6 font API as the intended future upgrade
  path so developers know where to look when upgrading.

## Options considered

### Option 1: Google Fonts `<link>` in Layout.astro

Zero npm overhead, but ships user IPs to Google. Not acceptable for a
GDPR-conscious template targeting European deployments.

### Option 2: Astro 6 font API (`fontProviders`)

Ideal — type-safe, provider-agnostic, self-hosted by default. Not available
in Astro 5. Will replace this decision when the project upgrades to Astro 6.

### Option 3: Fontsource npm package (chosen)

Privacy-safe, works in Astro 5, swappable by changing one `@import` line.

## Advices

When upgrading to Astro 6, migrate fonts.css to the `fonts` option in
`astro.config.mjs` and remove the Fontsource package:

```js
import { defineConfig, fontProviders } from "astro/config";
export default defineConfig({
  fonts: [{ provider: fontProviders.google(), name: "Inter", cssVariable: "--font-inter" }]
});
```
