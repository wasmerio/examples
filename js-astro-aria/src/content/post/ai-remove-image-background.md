---
layout: ../../layouts/post.astro
title: Removing Image Backgrounds Locally in the Browser with AI
description: Run the RMBG-1.4 model client-side using WebGPU and Transformers.js to strip image backgrounds with zero server uploads.
dateFormatted: Jul 14, 2024
---

I have been exploring AI in the browser lately, and came across a neat Transformers.js demo that inspired me to package it into a standalone tool.

By running Transformers.js inside a Web Worker and tapping into WebGPU to drive the RMBG-1.4 model, you can remove image backgrounds entirely client-side. No files are uploaded to any server, so there are zero privacy worries. On my M1 Pro Mac, it processes a 4K image in around 500 ms.

Try the tool here: [https://html.zone/background-remover](https://html.zone/background-remover)

[![AI background remover](https://og-image.html.zone/https://html.zone/background-remover)](https://html.zone/background-remover)

---

If you want to build this yourself, check out the upstream implementation in the Transformers.js repo: [xenova/transformers.js/examples/remove-background-client](https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client)

> **Note**: To use the WebGPU backend, you need Transformers.js v3.
