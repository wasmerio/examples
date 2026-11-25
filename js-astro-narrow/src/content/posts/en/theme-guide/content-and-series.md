---
title: "Content and Subposts"
description: "Post frontmatter, folder-based subposts, project cards, tags, and locales."
date: 2026-06-27
order: 2
tags: ["Guide", "Content Collections"]
toc: true
---

Content lives under `src/content/<collection>/<locale>/`. Frontmatter is validated at build time by `src/content.config.ts`.

## Post frontmatter

Only `title` and `date` are required:

```yaml
---
title: "My First Note"
description: "Shown in cards and page metadata."
date: 2026-07-10
tags: [Astro, Markdown]
cover: "https://example.com/cover.jpg"
toc: true
draft: false
---
```

| Field | Use |
| --- | --- |
| `date` / `updatedDate` | Publish and revision dates |
| `tags` | Archive filtering; discovered automatically |
| `order` | Subpost order inside a folder |
| `toc` | `true` (default) shows the table of contents in the Dock; `false` hides it |
| `cover` | Cover image on cards and the post page |
| `comments` | Per-post comment switch |
| `math`, `mermaid`, `gallery`, `lightbox` | Feature hints |

## Subposts are folders

A folder whose `index.md` has sibling Markdown files becomes a set of subposts — exactly like this guide:

```text
posts/en/theme-guide/
├── index.md                → /posts/theme-guide/
├── site-and-navigation.md  → /posts/theme-guide/site-and-navigation/
└── …
```

- Subposts are ordered by `order`, falling back to `date`, then filename.
- The post list and home page show only the parent; archives, search, and RSS include every subpost.
- The parent page renders a generated subpost list; previous/next navigation walks them; the Dock's table of contents lists every subpost and nests the current one's headings.
- The context bar adds a subpost bar: one dot per subpost, previous/next controls, and a popover listing the full sequence.
- A folder with only `index.md` plus images stays an ordinary post.

## Projects

Projects are frontmatter-only cards on `/projects/` — the Markdown body is never rendered. A `github` link renders a GitHub icon in the card's top-right corner:

```yaml
---
title: "Astro Narrow"
description: "An Astro-native content theme."
tags: [Astro]
order: 1
links:
  github: https://github.com/example/repo
---
```

## Tags and archives

Tags need no registry — Archives collects them from published posts. Filter URLs are shareable: `/archives/?tag=Astro`.

## Locales

The default locale (`en`) has no URL prefix; every other locale is a folder name and a URL prefix (`zh-cn/` → `/zh-cn/…`). To add a locale, extend `locales` in `src/config/i18n.ts`, `i18n.locales` in `astro.config.mjs`, and the allowed `lang` values in `src/content.config.ts`, then mirror the content folders.
