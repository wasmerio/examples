---
title: Moving my noise function to Rust and WebAssembly
description: Value noise in Rust, compiled to WASM, called from a Canvas sketch, and the one place where it was slower than plain JavaScript.
pubDatetime: 2026-10-20T19:00:00+01:00
tags: [rust, wasm, generative-art]
---

My flow field sketches call a noise function a few million times per frame. I wanted to see how much faster that gets in Rust. The answer was "a lot, once I stopped crossing the boundary".

## The Rust side

This is plain value noise on a hashed grid with smoothstep blending:

```rust
use wasm_bindgen::prelude::*;

fn hash(x: i32, y: i32, seed: u32) -> f32 {
    let mut h = (x as u32).wrapping_mul(374_761_393)
        ^ (y as u32).wrapping_mul(668_265_263)
        ^ seed;
    h = (h ^ (h >> 13)).wrapping_mul(1_274_126_177);
    (h & 0xffff) as f32 / 65_535.0
}

fn noise(x: f32, y: f32, seed: u32) -> f32 {
    let (x0, y0) = (x.floor() as i32, y.floor() as i32);
    let (fx, fy) = (x - x0 as f32, y - y0 as f32);
    let (sx, sy) = (fx * fx * (3.0 - 2.0 * fx), fy * fy * (3.0 - 2.0 * fy));
    let top = hash(x0, y0, seed) + sx * (hash(x0 + 1, y0, seed) - hash(x0, y0, seed));
    let bottom = hash(x0, y0 + 1, seed) + sx * (hash(x0 + 1, y0 + 1, seed) - hash(x0, y0 + 1, seed));
    top + sy * (bottom - top)
}

#[wasm_bindgen]
pub fn fill_field(out: &mut [f32], width: usize, scale: f32, seed: u32) {
    for (i, v) in out.iter_mut().enumerate() {
        let (x, y) = ((i % width) as f32, (i / width) as f32);
        *v = noise(x * scale, y * scale, seed);
    }
}
```

## Building it

```bash
cargo install wasm-pack
wasm-pack build --target web --release
ls -lh pkg/*.wasm
```

The `.wasm` file came out at 14 KB, which is smaller than the sketch's JavaScript.

> [!IMPORTANT]
> Fill a whole buffer in one call. My first version exported `noise(x, y)` and called it per pixel from JavaScript. The call overhead made it slower than the JavaScript version it replaced.

## Numbers

On my laptop, filling a 1024 by 1024 field:

| Version               |  Time |
| :-------------------- | ----: |
| JavaScript, per pixel | 61 ms |
| WASM, per pixel call  | 74 ms |
| WASM, whole buffer    |  9 ms |

> [!CAUTION]
> The `out` slice is a view into WASM memory. If the module grows its memory, an old `Float32Array` view on the JavaScript side goes stale and reads zeros. Create the view again after every call that might allocate.
