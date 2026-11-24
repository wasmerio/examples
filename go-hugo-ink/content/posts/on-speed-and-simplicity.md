---
title: "On Speed and Simplicity"
date: 2026-02-14
tags: ["performance", "design", "web"]
description: "Why less is more when it comes to the web."
series: "Getting Started"
---


The best websites are the ones that get out of your way. They load instantly, present content clearly, and respect your time.

Speed is not just a technical metric — it's a form of respect for your readers. Every kilobyte matters.

## Measuring what matters

```bash
curl -s -o /dev/null -w "Total: %{size_download} bytes\n" https://yoursite.com/
```

The target: under 100KB for a first page load.

