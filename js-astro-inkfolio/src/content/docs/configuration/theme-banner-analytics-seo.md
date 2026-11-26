---
title: Theme, banner, analytics and SEO
order: 3
description: Accent colour, dark mode, the dismissible banner, three analytics providers and the shared metadata.
---

## theme

```yaml
theme:
  accent: '#ff6b01'
  defaultMode: auto
  radius: 12px
```

`accent` feeds `--accent` and `--u` (links, underlines, active nav). `defaultMode` is `auto | light | dark`; visitors can override it and their choice is remembered. Dark mode may need its own accent — add an override in `src/styles/global.css`:

```css
:root[data-theme='dark'] {
  --accent: #ff7b1a;
  --u: #ff7b1a;
}
```

## promoBanner

```yaml
promoBanner:
  enabled: true
  dismissible: true
  text: This site's SEO runs on ZensInk
  link: https://zens.ink
  linkText: Take a look
```

`enabled: false` removes the banner from the HTML entirely — no hidden element left behind. With `dismissible: true` a visitor's decision is stored in `localStorage` under `inkfolio-promo-dismissed`.

## analytics

All three are off by default. A script is only injected when `enabled: true` **and** an id is present:

```yaml
analytics:
  umami:
    enabled: true
    scriptUrl: https://analytics.your-domain.com/script.js
    websiteId: 1a2b3c4d-...
  googleAnalytics:
    enabled: false
    measurementId: G-XXXXXXXXXX
  clarity:
    enabled: false
    projectId: abcdefghij
```

> [!WARNING]
> GA4 and Clarity set cookies. The theme ships no cookie banner — if you enable them for EU visitors, add a consent tool yourself and load the tag through it.

## seo

```yaml
seo:
  titleTemplate: '{title} — Inkfolio'
  defaultDescription: One sentence about the site.
  ogImage: /og-default.png
  twitterHandle: yourname
  structuredData: true
  robots: index,follow
```

- `titleTemplate` — `{title}` is replaced; set it to `"{title}"` to drop the suffix.
- `ogImage` — 1200×630, used by every page that has no own image.
- `structuredData` — WebSite + BlogPosting JSON-LD with real dates from frontmatter.
- `robots` — the site-wide default; disabled features (like a switched-off MCP page) override it to `noindex`.
