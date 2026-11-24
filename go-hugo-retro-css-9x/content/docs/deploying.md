---
title: "Deploying"
description: "Building the site, and what the theme needs from your host."
weight: 60
---


## Build

```bash
hugo --minify --gc
```

The theme has no Node step and no Sass step. The framework's CSS and JavaScript
are vendored into the theme and served through Hugo Pipes, which means the
standard Hugo binary is enough — you do not need the extended build.

## What ships

One concatenated, fingerprinted stylesheet with a Subresource Integrity hash,
one deferred script, and a search index built as a page resource. Nothing is
fetched from a CDN at runtime, so the site works offline and behind a strict
content security policy.

## GitHub Pages

```yaml
- uses: actions/checkout@v4
  with: { submodules: recursive }
- uses: peaceiris/actions-hugo@v3
  with: { hugo-version: "0.161.1" }
- run: hugo --minify --gc --baseURL "${{ steps.pages.outputs.base_url }}/"
```

