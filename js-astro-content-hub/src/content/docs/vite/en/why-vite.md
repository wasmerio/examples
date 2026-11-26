---
title: "Why Vite"
description: "The problems Vite solves compared to traditional bundler-based tooling."
order: 2
---

Traditional bundlers process the entire application before the browser can load a
single page. As the project grows, startup and hot-reload get slower.

Vite takes a different approach:

- **Dev server on native ESM** — files are transformed and served on demand; the
  browser requests only what the page imports.
- **Pre-bundling with esbuild** — dependencies written in CommonJS or large modules
  are pre-bundled for speed.
- **Rollup for production** — a mature, tree-shaking bundler produces optimized output.

The result is a dev server that stays fast regardless of app size, and a build step
that benefits from Rollup's ecosystem.
