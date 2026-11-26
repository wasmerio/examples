---
title: Lists, links and icons
order: 2
description: Projects, the tool shelf and the friends list are YAML files. Icons are filenames.
---

Three pages are data-driven. Editing them never touches an Astro file.

## Projects

`src/data/projects.yaml` — used by `/projects/` and the home page:

```yaml
- title: Pocket Ledger
  tag: Side project
  status: active
  desc: A tiny double-entry bookkeeping app.
  descZh: 一个极简复式记账工具。
  url: https://example.com/pocket-ledger
```

`status: archived` adds a badge; everything else is printed as-is.

## Tool shelf

`src/data/tools.yaml` — grouped by category, each category an `id` anchor:

```yaml
- id: sites
  en: Sites
  zh: 站点
  note: { en: Worth opening first., zh: 先去的几个地方。 }
  links:
    - name: Astro
      url: https://astro.build
      icon: astro
      note: { en: The framework., zh: 这个框架。 }
```

### Icons

`icon` is a filename in `public/icons/`, without `.svg`. Drop a new SVG in that folder and reference it — no code change:

```
public/icons/astro.svg   →   icon: astro
```

> [!TIP]
> A name with no matching file falls back to the first letter, so a typo is visible but never breaks the page.

Shipped: `jask`, `astro`, `fontawesome`, `github`.

## Friends

`src/data/friends.yaml` — one entry per site:

```yaml
- name: jask.dev
  url: https://jask.dev
  author: Jask
  avatar: /avatar.jpg
  desc: { en: Build logs., zh: 构建日志。 }
```

`avatar` is optional; omit it and the first letter is shown in a circle.
