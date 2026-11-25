---
title: 'Enhancement switches: defaults and per-entry overrides'
slug: 'enhancement-overrides'
date: 2026-09-03
description: 'Choose enhancements for each entry and override global defaults.'
categories: ['writing']
tags: ['markdown']
---

Math, diagrams, image lightboxes, callouts, outlines and share covers support global settings and per-entry overrides.

## Global defaults

Set defaults in `article` in `blog.config.ts`. Outlines use `toc.enabled`, and automatic share covers use `shareCover.enabled`.

## Per-entry overrides

Add the fields you want to adjust to an article or standalone page’s frontmatter:

```yaml
math: true
mermaid: false
lightbox: true
callouts: true
toc: true
shareCover: false
```

`true` enables a feature, `false` disables it, and omitted fields inherit global settings. Include only the fields you want to change.

## Available switches

| Field        | Feature                      |
| ------------ | ---------------------------- |
| `math`       | KaTeX math                   |
| `mermaid`    | Mermaid diagrams             |
| `lightbox`   | PhotoSwipe image lightbox    |
| `callouts`   | Callouts                     |
| `toc`        | Article outline              |
| `shareCover` | Automatic Satori share cover |

Disabling math, diagram or callout enhancements displays the corresponding source or a plain quotation. Disabling automatic share covers uses the configured article cover for sharing previews.

Try the features in [Article enhancements](../article-enhancements/). Title and author display settings are covered in [Article display](../display-options/).
