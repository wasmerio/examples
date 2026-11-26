---
title: Picking a sixteen colour palette
description: How I chose the palette for my pixel art and shader work, and a small GLSL function that snaps any colour to it.
pubDatetime: 2026-11-17T20:00:00+01:00
tags: [pixel-art, shaders, glsl]
---

I use the same sixteen colours for pixel art, jam games and most shader sketches. Using the same palette everywhere makes my work look like it belongs together, and it saves a decision every time I start something new.

## How I picked them

I started with ramps instead of single colours. A ramp is three to five shades of one hue, from dark to light. With four ramps of four colours I can shade almost anything.

| Ramp  | Dark      | Mid dark  | Mid light | Light     |
| :---- | :-------- | :-------- | :-------- | :-------- |
| Night | `#120f1f` | `#2b2347` | `#4b3f78` | `#8f87ad` |
| Ember | `#3a1424` | `#8c2f4a` | `#e05d6f` | `#ffb07a` |
| Moss  | `#0f2a2a` | `#1f5c4f` | `#15c2a5` | `#b8f0d0` |
| Glow  | `#3d1d4f` | `#a0408f` | `#f78ed6` | `#fbe3f4` |

The darkest shade of each ramp leans blue or purple and the lightest leans warm. That hue shift is the most useful pixel art trick I know: shadows look cool and highlights look lit.

## Snapping colours in a shader

For shader sketches I render in full colour and snap each pixel to the nearest palette entry at the end:

```glsl
uniform vec3 u_palette[16];

vec3 snapToPalette(vec3 c) {
  vec3 best = u_palette[0];
  float bestDist = 1e9;
  for (int i = 0; i < 16; i++) {
    vec3 d = c - u_palette[i];
    float dist = dot(d, d);
    if (dist < bestDist) {
      bestDist = dist;
      best = u_palette[i];
    }
  }
  return best;
}
```

Combined with the Bayer threshold from my dithering post, this gives a shader output that looks hand placed.

## Loading the palette

The palette lives in one text file, one hex value per line. A short script turns it into the uniform array:

```ts
const palette = (await (await fetch("/palette.txt")).text())
  .trim()
  .split("\n")
  .flatMap(hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255));

gl.uniform3fv(gl.getUniformLocation(program, "u_palette"), palette);
```

Distance in plain RGB is not how eyes see colour, but with only sixteen entries far apart from each other it is good enough.
