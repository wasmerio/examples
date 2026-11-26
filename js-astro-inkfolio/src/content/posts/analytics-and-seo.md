---
title: Add analytics — Umami, GA4 or Clarity — from the config file
description: Three supported providers, all off by default, each enabled with two values. No tag manager, no cookie banner included.
date: 2026-11-15
cover: /og/posts/en/analytics-and-seo.png
coverAlt: Add analytics — Umami, GA4 or Clarity — from the config file
tags: [analytics, configuration]
categories: ['Setup']
---

Inkfolio ships with no tracking at all. When you want numbers, open `site.config.yaml` and fill in the provider you use. The scripts are injected only when `enabled: true` **and** the id is present, so an unfinished config never ships a broken request.

## Umami (self-hosted or cloud)

```yaml
analytics:
  umami:
    enabled: true
    scriptUrl: https://analytics.your-domain.com/script.js
    websiteId: 1a2b3c4d-...
```

Umami sets no cookies, which is why it is the default recommendation here. Self-hosting it on a small VPS costs less than most paid tiers and keeps the data yours.

## Google Analytics 4

```yaml
analytics:
  googleAnalytics:
    enabled: true
    measurementId: G-XXXXXXXXXX
```

GA4 needs a consent decision in the EU. The theme does not ship a cookie banner, because a banner nobody configures is worse than none — if you enable GA4 for EU visitors, add a consent tool yourself and load the tag through it.

## Microsoft Clarity

```yaml
analytics:
  clarity:
    enabled: true
    projectId: abcdefghij
```

Clarity records session replays and heatmaps. It is useful for finding the one page where people give up. It is also the most privacy-sensitive of the three: disclose it, and think twice before turning it on for a site with a contact form.

## SEO settings

The same file controls the metadata every page shares:

```yaml
seo:
  titleTemplate: '{title} — Your Site'
  defaultDescription: One sentence about the site.
  ogImage: /og-default.png
  twitterHandle: yourname
  structuredData: true
```

`titleTemplate` is how page titles get their suffix; set it to `"{title}"` to drop it. `ogImage` is a 1200×630 image used by every page that does not define its own. `structuredData` toggles the JSON-LD block — WebSite on ordinary pages, BlogPosting on articles, with real dates from the frontmatter.

Per-page titles and descriptions come from the Markdown frontmatter; nothing in this section overrides them.
