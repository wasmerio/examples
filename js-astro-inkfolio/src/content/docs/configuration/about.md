---
title: The About page
order: 10
description: "Write your About page in site.config.yaml — Markdown included — so the template never needs touching."
---

Everything on `/about/` comes from the `about:` block. The template holds no copy of its own.

## Shape

```yaml
about:
  intro:
    en: |
      **Bold**, *italic*, `code` and [links](https://example.com) work.
    zh: |
      **加粗**、*斜体*、`代码`、[链接](https://example.com)都能用。
  expertise:
    - icon: search
      title: { en: SEO engineering, zh: SEO 工程 }
      text: { en: What you do, zh: 你做什么 }
  stack:
    - { icon: globe, label: Astro, note: { en: site framework, zh: 站点框架 } }
  journey:
    - icon: tag
      version: v1.0.0
      when: 2026-11
      what: { en: What changed, zh: 改了什么 }
```

## Two rules

**Language.** Any string is either plain (`icon: tag`, `when: 2026-11`) or keyed by language: `{ en: ..., zh: ..., zh-hant: ... }`. Missing keys fall back to `zh`, then `en`.

**Markdown.** `intro` renders blocks — blank lines split paragraphs, `-` or `1.` start lists. `expertise[].text` and `journey[].what` render inline, so they stay on one line. Both go through a small renderer inside the theme: no Markdown dependency, and no raw HTML survives, because config text is escaped before formatting.

## Icons

`icon:` takes a Font Awesome name (`search`, `bot`, `box`, `globe`, `tag`, `code`, `flask`). If you switched to an Iconfont project, the same names resolve through your symbol set — see [Replacing the icons](/docs/configuration/icons/).

## Removing a block

An empty list removes a section; `/about/` renders the intro, whatever sections have items, and the back link. Nothing else hides behind a flag.
