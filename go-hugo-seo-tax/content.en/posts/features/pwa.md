---
title: "Progressive Web App"
date: 2026-01-16
summary: "Enable the optional service worker for offline-friendly caching."
categories: ["Features"]
tags: ["PWA", "Service Worker", "cache"]
---


## Enable the Service Worker

```yaml
params:
  serviceWorker: "precache"
```

SeoTax registers a service worker and precaches generated assets
when this option is enabled.

## Deployment Notes

Test caching on a deployed HTTPS site.
When you change assets or service-worker behavior,
use a new build and verify updates in the browser's Application panel.

