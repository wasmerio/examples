---
layout: ../../layouts/post.astro
title: Processing Images with Vercel Edge Functions
description: Running an image processing pipeline on Vercel Edge with WebAssembly, supporting format conversion, resize, crop, filters, and watermarks.
dateFormatted: Dec 17th, 2023
---

In an earlier post on [processing images with Cloudflare Workers](/post/cloudflare-worker-image), I ran into the strict 10 ms CPU execution limit on Cloudflare's free plan, which frequently timed out on larger photos. I had some free time today, so I ported the Wasm pipeline over to **Vercel Edge Functions** to see how it performs.

Vercel offers native Image Optimization, but caps free accounts at 1,000 source images per month and only handles resizing. Running our own WebAssembly pipeline on Vercel Edge unlocks resizing, cropping, watermarking, and color filters with much higher transformation headroom. Keep in mind that Vercel's free plan includes 100GB of monthly bandwidth, so putting a CDN in front in production is a good idea.

Supported features:

1. Ingests PNG, JPG, BMP, ICO, and TIFF inputs.
2. Encodes JPG, PNG, and WebP outputs (WebP is default).
3. Supports pipeline chaining for multiple consecutive actions.
4. Domain whitelist to prevent open-proxy abuse.
5. Graceful fallback: returns the original image on processing failures (errors are not cached).

## Demo

### Format Conversion

#### WebP

![webp](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=webp)

#### JPG

![jpg](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=jpg)

#### PNG

![png](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=png)

### Resizing

![resize](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2)

### Rotation

![rotate](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=rotate!90)

### Cropping

![crop](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=crop!0,0,1000,1000)

### Filters

![filter](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=filter%21obsidian)

### Image Watermark

![watermark](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=watermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,20,20)

### Text Watermark

![draw_text](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=draw_text!miantiao.me,20,20)

### Pipelining

#### Resize + Rotate + Text Watermark

![resize & rotate & draw_text](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Crotate!180%7Cdraw_text!miantiao.me,10,10)

#### Resize + Image Watermark

![resize & watermark](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Cwatermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,10,10)

Any operation supported by Photon works. Check the image URL parameters against the [Photon documentation](https://docs.rs/photon-rs/latest/photon_rs/) to experiment with custom parameters.

## Repository

The project is open source on GitHub:

[![ccbikai/vercel-edge-image - GitHub](https://github.html.zone/ccbikai/vercel-edge-image)](https://github.com/ccbikai/vercel-edge-image)

---

[![Buy Me A Coffee](https://static.miantiao.me/share/0WmsVP/CcmGr8.png)](https://www.buymeacoffee.com/miantiao)
