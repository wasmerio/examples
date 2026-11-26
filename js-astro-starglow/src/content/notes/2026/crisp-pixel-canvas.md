---
title: Keep a scaled canvas crisp
description: Two settings that stop the browser from blurring pixel art.
tags: [pixel-art, canvas]
updated: 2026-09-15
---

Scaling a small canvas up with CSS blurs it by default. Turn that off in CSS and in the 2D context:

```css
canvas {
  image-rendering: pixelated;
}
```

```js
ctx.imageSmoothingEnabled = false;
```

The CSS rule covers the scaling of the whole canvas. The context setting covers sprites drawn with `drawImage` at a different size.
