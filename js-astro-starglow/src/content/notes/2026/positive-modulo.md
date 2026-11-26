---
title: A modulo that stays positive
description: JavaScript's remainder operator keeps the sign of the left side, which breaks wrapping grids.
tags: [javascript, generative-art]
updated: 2026-10-14
---

`-1 % 16` is `-1` in JavaScript, not `15`. For a grid that wraps at the edges I use this instead:

```js
const mod = (a, n) => ((a % n) + n) % n;
```

GLSL's `mod()` already behaves this way, so the same sketch ported to a shader does not need it.
