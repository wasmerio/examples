---
title: Every setting in site.config.yaml
description: One YAML file controls the name, navigation, colours and the top banner. Here is what each key does.
date: 2026-11-11
cover: /og/posts/en/site-config.png
coverAlt: Cover card for this article
tags: [configuration]
categories: ['Setup']
---

Everything visitors see as _structure_ comes from `site.config.yaml` in the project root. You do not need to open a component to rename the site or add a menu item.

## site

- `name` / `nameZh` — the brand in the navigation and the browser tab.
- `tagline` / `taglineZh` — the large sentence on the home page.
- `description` / `descriptionZh` — meta description and the paragraph under the headline.
- `url` — your domain, used for canonical links, the sitemap and RSS.
- `author` / `authorZh` — the name printed on every article.
- `email` — optional. Shows in the footer only if set.
- `defaultLanguage` — `en` or `zh`. English lives at `/`, Chinese at `/zh/`.
- `showLanguageSwitcher` — set to `false` and the language links disappear everywhere, including the 404 page hint.

## nav

A plain list. Each item needs `label` and `href`; `labelZh` is optional and, when a page has no Chinese version, leaving it out keeps that link off the `/zh/` navigation instead of pointing it at a 404.

```yaml
nav:
  - label: Posts
    labelZh: 文章
    href: /posts/
```

## social

Shown in the footer. Relative links like `/rss.xml` are automatically prefixed for the Chinese site; absolute ones are left alone.

## promoBanner

Covered in its own post — see _Turn the banner off in one line_.

## theme

- `accent` — links, underlines, the active menu item. Any CSS colour works.
- `defaultMode` — `auto`, `light` or `dark`. `auto` follows the operating system.
- `radius` — corner radius for cards and images.

## footer

`note` / `noteZh` is the small line in the footer. Replace it with your own or leave it blank.

One rule: YAML is whitespace-sensitive. Indent with spaces, never tabs, and keep the quotes around values that contain `:` or `#`.
