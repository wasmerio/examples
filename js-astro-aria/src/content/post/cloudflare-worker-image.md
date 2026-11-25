---
layout: ../../layouts/post.astro
title: Processing Images with Cloudflare Workers and WebAssembly
description: Building a serverless image processing service on Cloudflare Workers with WebAssembly, supporting resize, crop, rotate, filters, and watermarks.
dateFormatted: Nov 18, 2023
---

## Background

I previously set up a free 10GB cloud storage bucket pairing [Backblaze B2](https://www.backblaze.com/cloud-storage) with Cloudflare. I use it for daily file sharing and as an image host for my blog, uploaded via uPic. However, as an image bed for writing, it lacked dynamic resizing and cropping. I use Alibaba Cloud OSS image processing daily at work and got spoiled by on-the-fly transformations, so I wanted something similar for my personal setup.

> **Update**: The free tier of Cloudflare Workers has a strict 10 ms CPU execution limit, which frequently triggered resource limit errors on larger images. The latest iteration uses Cloudflare Containers to process images reliably. I also adapted the project for Vercel Edge—see [Processing Images with Vercel Edge](/post/vercel-edge-image).

## Options Considered

I weighed two existing approaches:

1. **Proxying [Vercel Image Optimization](https://vercel.com/docs/image-optimization) through Cloudflare**: Request hops look like Cloudflare -> Vercel -> Cloudflare -> Backblaze. Latency and reliability were subpar, and the 1,000 free monthly transformations felt too restrictive.
2. **Using the public [wsrv.nl](https://images.weserv.nl/) service**: Traffic hops through Cloudflare -> wsrv.nl -> Cloudflare -> Backblaze. It also means routing through a domain outside my control; keeping it on a custom domain would require an extra Worker proxy layer.

Neither felt right. Then, while working on an email worker, I noticed Cloudflare Workers supported [WebAssembly (Wasm)](https://developers.cloudflare.com/workers/runtime-apis/webassembly/), which gave me the idea of running an image pipeline directly in WebAssembly at the edge.

My initial thought was to port [sharp](https://sharp.pixelplumbing.com/), my usual choice in Node.js. But sharp relies on native multi-threading, which Cloudflare Workers cannot run.

Digging around Rust crates, [Photon](https://silvia-odwyer.github.io/photon/) stood out, and there was already a working community [demo](https://github.com/techwithdeo/cloudflare-workers/tree/main/photon-library). It proved that Photon could compile to Wasm and run on Workers. However, that sample had two drawbacks:

1. It bundled a frozen Photon snapshot that was painful to keep up to date.
2. It only emitted PNGs, meaning resized JPEGs often ended up larger than the original files.

## The Solution

Searching further into Photon and Workers, I drew inspiration from [DenoFlare](https://denoflare.dev/examples/transform-images-wasm) and [jSquash](https://github.com/jamsinclair/jSquash). The final architecture combines official Photon (patched via `patch-package`), jSquash WebAssembly encoders, and a Cloudflare Worker router. *(I wanted to support AVIF and JPEG XL as well, but hit the 1MB script size limit on free Workers and had to leave them out).*

Supported features:

1. Ingests PNG, JPG, BMP, ICO, and TIFF inputs.
2. Encodes JPG, PNG, and WebP outputs (WebP is the default).
3. Supports pipeline chaining for multiple consecutive actions.
4. Edge caching on Cloudflare.
5. Domain whitelist to prevent open-relay abuse.
6. Graceful degradation: falls back to serving the original image on errors (errors are not cached).

## Demo

### Format Conversion

#### WebP

![webp](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=webp)

#### JPG

![jpg](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=jpg)

#### PNG

![png](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=png)

### Resizing

![resize](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2)

### Rotation

![rotate](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=rotate!90)

### Cropping

![crop](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=crop!0,0,1000,1000)

### Filters

![filter](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=filter%21obsidian)

### Image Watermark

![watermark](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=watermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,20,20)

### Text Watermark

![draw_text](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=draw_text!miantiao.me,20,20)

### Pipelining

#### Resize + Rotate + Text Watermark

![resize & rotate & draw_text](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Crotate!180%7Cdraw_text!miantiao.me,10,10)

#### Resize + Image Watermark

![resize & watermark](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Cwatermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,10,10)

In theory, any operation supported by Photon works. Check the image URL parameters against the [Photon documentation](https://docs.rs/photon-rs/latest/photon_rs/) to test out different combinations.

## Repository

The project is open source on GitHub:

[![ccbikai/cloudflare-worker-image - GitHub](https://github.html.zone/ccbikai/cloudflare-worker-image)](https://github.com/ccbikai/cloudflare-worker-image)

---

[![Buy Me A Coffee](https://static.miantiao.me/share/0WmsVP/CcmGr8.png)](https://www.buymeacoffee.com/miantiao)
