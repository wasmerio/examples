---
title: Static site performance checklist
description: Check loading, images, scripts, layout stability, and accessibility with a short list.
permalink: /en/blog/web-performance-basics/
lang: en-US
translationOf: /blog/web-performance-basics/
createTime: 2026-08-02
updateTime: 2026-08-05
tags: [Performance, Web, Accessibility]
cover: /img/logo.svg
coverStyle:
  layout: right
  ratio: 4/3
  width: 200
---

# Static site performance checklist

Static output is a strong baseline, but images, fonts, and third-party scripts can still slow a page down.

<!-- more -->

## Loading path

1. Give above-the-fold images accurate dimensions.
2. Lazy-load images below the fold.
3. Load diagrams, comments, and other large scripts only on pages that need them.
4. Cache versioned assets for a long time while keeping HTML updateable.

## Interaction and accessibility

- Menus, tabs, and dialogs work with a keyboard.
- Controls have readable names and visible focus states.
- Dark mode does not flash during the first render.
- Motion respects `prefers-reduced-motion`.

## Verify the result

Build checks, browser regressions, and deployed verification answer different questions. Run automation first, then verify cache headers and optional services on the target host.
