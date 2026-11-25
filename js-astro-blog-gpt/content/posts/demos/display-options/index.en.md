---
title: 'Article display: keep only what you need'
slug: 'display-options'
date: 2026-08-26
description: 'Choose titles, authors, dates, reading time, tags and sharing for each entry.'
categories: ['writing']
tags: ['design']
updated: '2026-10-16'
---

Choose which details appear on an article page, such as its title, author and dates. Global settings live in `article.display`; per-entry settings use `display` in frontmatter.

## Choose the details to show

| Field         | Displayed content                 |
| ------------- | --------------------------------- |
| `title`       | Title, description and categories |
| `author`      | Author                            |
| `published`   | Publication date                  |
| `readingTime` | Estimated reading time            |
| `updated`     | Last update                       |
| `tags`        | Tags at the bottom                |
| `share`       | Share button and panel            |
| `navigation`  | Previous and next articles        |

All settings are enabled by default. When `updated` is provided and differs from the publication date, the last update appears at the bottom of the article.

## Adjust one article

For example, hide only the author and reading time for an article:

```yaml
display:
  author: false
  readingTime: false
```

Other fields inherit global settings. Either `true` or `false` in an entry overrides the global default.

## Standalone pages

Standalone pages such as [About BlogGPT](../../about/) also support titles, authors, dates, reading time, updates and sharing. Choose the details that suit each page.

See [Enhancement switches](../enhancement-overrides/) for content enhancements and [Publishing and migration](../migration/) for publication states.
