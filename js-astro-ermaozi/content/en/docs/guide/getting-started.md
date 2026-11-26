---
title: Beginner quick start
description: Build a blog in ten minutes with configuration and Markdown, without editing theme source code.
permalink: /en/docs/guide/getting-started/
translationOf: /docs/guide/getting-started/
type: doc
group: Guide
order: 5
badge: Start
createTime: 2026-08-07
tags: [Getting started, Configuration, Astro]
---

# Beginner quick start

Day-to-day blogging only touches two places: `site.config.mjs` controls the site and `content/` contains your writing. Leave `theme/` alone so future theme updates stay manageable.

## 1. Install the prerequisites

Install [Node.js 22.12 or newer](https://nodejs.org/) and a text editor. Windows, macOS, and Linux are supported.

## 2. Create and open the site

Use one package manager already installed on your computer:

```sh
npm create astro-theme-ermaozi my-blog
pnpm create astro-theme-ermaozi my-blog
yarn create astro-theme-ermaozi my-blog
```

Choose Simplified Chinese or English as the root language. When multilingual mode is enabled, the other language is placed under `/en/` or `/zh/`; content, permalinks, translation links, and internal links are adjusted automatically.

Enter the project and start the fast preview:

```sh
cd my-blog
npm run dev
```

Use `pnpm dev` or `yarn dev` for the other package managers. The terminal prints a local URL, normally `http://localhost:4321/`, and refreshes after configuration or Markdown changes.

## 3. Change only these six settings

Open `site.config.mjs`. `defineSiteConfig()` gives editors completion for supported fields, and `npm run check` reports common mistakes with a file and line number.

1. `origin`: the final origin, for example `https://blog.example.com`.
2. `logo`: the logo URL, for example `/img/logo.svg`.
3. `profile`: avatar, biography, location, and card position.
4. `locales.en-US.siteName`: the site name.
5. `locales.en-US.description`: the site description.
6. `social`: GitHub and other profile links; use `social: []` when none are needed.

Keep every other default for now. See [site configuration](/en/docs/guide/configuration/) for navigation, search, pagination, appearance, comments, and enhanced Markdown.

### Build an English-only site

Choose English as the default language during creation. If the generated Chinese examples are not needed, remove the complete `'zh-CN': { ... }` locale block and `content/zh/`; no English files or routes need to be moved manually. Back up the project before deleting files.

## 4. Publish the first post

Create `content/en/blog/hello.md`:

```md
---
title: My first post
description: An introduction to my new blog.
permalink: /en/blog/hello/
createTime: 2026-08-07
tags: [Notes]
type: post
---

# My first post

Start writing here.
```

Save and refresh the browser. Folders become categories. Put images in `public/img/` and reference them as `![Description](/img/photo.webp)`.

## 5. Adjust navigation

Each locale owns a `navbar` array; the old `navigation` name remains supported. A minimal navbar looks like this:

```js
navbar: [
  { text: 'Blog', link: '/en/blog/', icon: 'home' },
  { text: 'About', link: '/en/about/', icon: 'info' },
]
```

Navigation also supports dropdowns, Iconify icons, and badges. Copying an existing entry and changing its text and link is the safest starting point.

## 6. Validate before publishing

```sh
npm run validate
```

A successful run creates `dist/`. Use the provider configuration selected during creation or publish `dist/` with any static host; see [deployment](/en/docs/guide/deployment/).

## Common problems

- **Search misses a changed post during development**: the development server does not build the Pagefind index; run `npm run build && npm run preview` for a production check.
- **A route is duplicated or broken**: every `permalink` must be unique and start and end with `/`.
- **An image is missing**: place it under `public/` and omit `public` from the URL.
- **The page is blank after editing config**: run `npm run check` and fix the reported comma, quote, or bracket.
- **No comments or statistics are needed**: leave their `features` switches set to `false`; a static blog needs no backend.

Continue with [content features](/en/docs/guide/content/). Developers who need deeper customization can read [public API and styling](/en/docs/guide/api/).
