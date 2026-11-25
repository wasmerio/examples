---
title: "Deployment"
date: 2026-08-24
description: "Set your domain, build, and put it online."
summary: "The one setting that actually matters before you publish, plus what the build produces."
categories: ["Setup"]
tags: ["deployment", "baseURL", "build"]
series: ["Ship It"]
---


## Set your domain first

```toml
baseURL = "https://yourdomain.com/"
```

This is the one setting that genuinely matters. It feeds canonical URLs, the
sitemap, Open Graph tags and the RSS feed. Leave a placeholder there and you
are telling search engines your site is a duplicate of a domain you do not own.

Keep the trailing slash.

## Build

```bash
hugo
```

Output lands in `public/`. There is no build step beyond this — no npm, no
asset pipeline, no post-processing. The folder is a plain static site.

To check it locally the way a host will serve it:

```bash
hugo && cd public && python3 -m http.server 8000
```

## Hosting

Anywhere that serves files. Netlify, Cloudflare Pages, GitHub Pages, S3, or a
directory on a web server you already have.

The usual settings:

| | |
|---|---|
| Build command | `hugo` |
| Publish directory | `public` |
