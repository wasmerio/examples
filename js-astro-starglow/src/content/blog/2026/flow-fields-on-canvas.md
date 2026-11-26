---
title: A flow field in sixty lines of Canvas
description: How I draw flow fields with plain Canvas 2D, a seeded random function and a lot of very short lines.
pubDatetime: 2026-09-22T20:10:00+01:00
tags: [generative-art, canvas, javascript]
---

A flow field is a grid of angles. You drop particles on it and let each one follow the angle under it for a few hundred steps. The lines it leaves behind look like hair, wind or water, depending on the angles.

## Seeded randomness first

I want to reproduce a good output later, so nothing uses `Math.random()` directly. This is mulberry32, small enough to paste into every sketch:

```ts
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

## The field

I skip real noise for a first pass. Two sine waves at different frequencies give a field that is smooth enough:

```js
const angle = (x, y) =>
  Math.sin(x * 0.004) * Math.PI + Math.cos(y * 0.006 + x * 0.001) * 1.5;

function walk(ctx, x, y, steps) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < steps; i++) {
    const a = angle(x, y);
    x += Math.cos(a) * 2;
    y += Math.sin(a) * 2;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
```

Then a loop drops two or three thousand particles at seeded positions and calls `walk` for each one.

> [!TIP]
> Draw with `globalAlpha` around 0.08. Overlapping lines build up density on their own, and the busy areas of the field show up without any extra work.

## What I change between runs

- The step length. Short steps give smooth curves, long ones give a scratchy look I like for plotter output.
- Where the particles start. A circle or a single line of start points looks more composed than random scatter.
- The number of steps. Fewer steps leave gaps, and gaps give the eye somewhere to rest.

Driftfield, my browser playground for this, is linked from the projects page.
