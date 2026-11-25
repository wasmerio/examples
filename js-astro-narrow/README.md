<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [astro-narrow](https://github.com/tom2almighty/astro-narrow) Astro theme by tom2almighty, copied from commit `1476ab1341ac5f854df5caf71c65d74fb5764ac4` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-narrow.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [tom2almighty](https://github.com/tom2almighty), GPL-3.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Narrow

A content-focused Astro theme: one narrow reading column, a sitewide palette readers can tune themselves, and type that scales smoothly with the screen. Migrated from Hugo Narrow, keeping its overall design ideas.

[English](README.md) · [简体中文](README.zh-CN.md) · [Hugo Narrow](https://github.com/tom2almighty/hugo-narrow)

## Features

- One-pick recoloring: choose a theme color and the whole site follows — shades, borders, links, dark mode included
- Readers tune the look themselves: theme color, color scheme, frosted glass, film grain, and page width, remembered across visits
- One adaptive dock for every screen: a right-side capsule on wide landscape displays and a bottom capsule elsewhere, carrying menu, search, comments, appearance, and back-to-top; a sticky context bar folds the breadcrumb into a title capsule while scrolling
- Type and spacing scale smoothly with the screen, comfortable from phones to large monitors
- Put a few posts in one folder to publish subposts: they order themselves, the Dock's table of contents lists the whole set, and previous/next links stay inside it
- Paginated post list, tag archives, full-text search, RSS, and sitemap out of the box
- Multiple languages (English default, Simplified Chinese example included)
- Markdown extras: math, Mermaid diagrams, tabs, alerts, image galleries with a lightbox
- Project cards from a few lines of frontmatter, with a GitHub icon in the corner

## Quick Start

```sh
pnpm install
pnpm dev
pnpm build
pnpm astro check
```

## Main Config Files

| File                    | Purpose                           | Common options                                                                       |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `src/config/site.ts`    | Site, author, and global features | `contentWidth`, `nav`, `home`, `list.pageSize`, `ui.toc`, `comments`, `analytics` |
| `src/config/i18n.ts`    | Locales and display names         | `defaultLocale`, `locales`, `localeMeta`                                             |
| `src/config/theme.ts`   | Default theme, schemes, presets   | `defaultTheme`, `defaultScheme`, `schemes`, `seedPresets`, `seedColor`, `seedLimits` |
| `src/content.config.ts` | Available frontmatter fields      | Update when adding or changing content fields                                        |
| `src/styles/tokens.css` | Design tokens                     | Paper/ink axioms, theme seeds, mix recipe, Utopia type/space scales, `--radius`      |

When adding a locale, also update `i18n.locales` in `astro.config.mjs` and the allowed `lang` values in `src/content.config.ts`.

## Navigation

`nav` fills the Dock's menu panel. Items are registered route ids (`posts`, `projects`, `archives`) or inline links; inline links accept internal paths and external URLs, and external URLs open in a new tab with an arrow marker.

```ts
nav: [
  "posts",
  "projects",
  "archives",
  { label: "GitHub", href: "https://github.com/", icon: "simple-icons:github" },
  { label: { en: "About", "zh-cn": "关于" }, href: "/about/" },
],
```

`label` is a plain string or a per-locale record; `icon` is optional.

The footer is copyright-only — there is no footer navigation.

## Home Sections and Pagination

```ts
home: {
  recentPosts: { enabled: true, limit: 3 },
},
list: {
  pageSize: 10,
},
```

`/posts/` paginates with `pageSize`; page two and later live at `/posts/page/<n>/`.

## Content Taxonomy

Posts use `tags` only:

```yaml
---
title: Writing with Astro Narrow
date: 2026-07-10
tags: [Astro, Markdown]
---
```

Archives discovers tags from published posts. Filter URLs can be shared directly:

```text
/archives/?tag=Astro
```

## Subposts

Subposts are a folder inside the posts collection. The folder's `index.md` is the parent post; every sibling Markdown file is a subpost:

```text
src/content/posts/en/astro-guide/
├── index.md        → /posts/astro-guide/
├── setup.md        → /posts/astro-guide/setup/
└── deploy.md       → /posts/astro-guide/deploy/
```

- Subposts are ordered by the `order` frontmatter number, falling back to `date`, then filename.
- The post list and home page show only the parent; archives, search, and RSS include every subpost.
- The parent page renders a generated subpost list; previous/next navigation runs between subposts.
- The table of contents (in the Dock) lists every subpost and nests the current subpost's headings below it.
- The context bar shows a subpost bar with one dot per subpost; its popover lists all of them.
- A folder containing only `index.md` plus assets stays an ordinary post.

## Table of Contents

The table of contents lives in the Dock: one panel, opened from the Dock's list button. Beside the article the panel opens to the left of the side capsule and can be pinned open (`ui.toc.defaultPin`, or `ASTRO_TOC_PIN` at build time); above the bottom capsule it opens upward and the pin control is hidden. Each entry opts out with `toc: false` frontmatter.

## Projects

Projects are frontmatter-only link cards rendered in a three-column grid — no detail pages. A `github` link renders a GitHub icon in the card's top-right corner.

```yaml
---
title: 'Astro Narrow'
description: 'An Astro-native content theme.'
tags: [Astro]
order: 1
links:
  github: https://github.com/example/repo
---
```

## Theming

Changing colors requires no color theory:

- **Readers**: the Dock's display settings offer preset swatches plus hue, chroma, and lightness sliders — pick any color (bright reds, deep blues, the whole hue circle) and the whole site recolors instantly and remembers the choice. The scheme buttons next to them (Plain / Tinted / Vivid / Soft) decide how boldly the color is used: whether the paper takes a wash, how saturated and strong hovers and accents appear.
- **Site owners**: the default theme, default scheme, and swatch presets live in `src/config/theme.ts`. For a brand color, declare its recipe channels in `src/styles/tokens.css`: `[data-theme='brand'] { --seed-recipe-l: …; --seed-recipe-c: …; --seed-recipe-h: …; }` and add a matching swatch preset. For your own scheme, copy the template block at the end of tokens.css, adjust a few percentages, and register it in `theme.ts` — the Dock button appears automatically.

The principle in one sentence: the entire palette is derived from paper, ink, and a single theme color through one shared `color-mix()` recipe, so every color, every scheme, and both light and dark mode stay in tune automatically.

Typography and spacing come from vendored [Utopia](https://utopia.fyi) `clamp()` scales (`--step-*`, `--space-*`), exposed as Tailwind utilities (`text-step-1`, `p-fl-m`, …). Article styles live in `src/styles/prose.css`.

## Markdown Tabs

Tabs use `remark-directive` syntax. The outer container uses four colons because it contains nested directives.

````md
::::tabs
:::tab{title="pnpm"}

```sh
pnpm install
```

:::

:::tab{title="npm"}

```sh
npm install
```

:::
::::
````

## GitHub Pages

The example workflow is in `.github/workflows/deploy.yml`. Before the first deployment, open repository **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**. Without this setting, `actions/deploy-pages` can fail with `HttpError: Not Found`.

The workflow sets `ASTRO_SITE` and `ASTRO_BASE` automatically for both user pages and project pages.

## License

This project is licensed under the [GNU General Public License Version 3](LICENSE).
