<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Broadsheet](https://github.com/xyovo/broadsheet) Astro theme by xyovo, copied from commit `90b63c337799180289c385cbfc04672ee27b71b7` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-broadsheet.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `SITE_URL`, `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [xyovo](https://github.com/xyovo), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Broadsheet

**English** · [简体中文](README.zh-CN.md)

An editorial, newspaper-style blog template for Astro. The home page reads like a print front page: one lead story, three recent posts, a list of older ones, and an author sidebar with tag navigation.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxyovo%2Fbroadsheet&project-name=my-blog&repository-name=my-blog)

The button above copies this repo into your own GitHub account and deploys it — no configuration required. You can also hit **Use this template** on the repo page and work locally.

![Home page](docs/preview-home.png)

> **Note:** the UI strings and the sample posts ship in Simplified Chinese. Labels live in `src/consts.ts` and the components under `src/components/`; set `SITE.LOCALE` to your locale to change date formatting and sorting.

## Features

- **Two content collections** — posts (`blog`) and projects (`projects`), with frontmatter validated by Zod so a bad field fails the build, not production
- **Markdown and MDX** — `.md` for plain posts, `.mdx` when you need components inline
- **Full-text search** — Pagefind builds the index at build time, no search service, `/` or `Cmd/Ctrl + K` to open
- **Light / dark / system themes** — three-way switch, no flash on first paint
- **Tag archives** — counts and archive pages generated automatically
- **Table of contents** — built from `h2`/`h3`, highlights the current section while scrolling
- **Comments** — Giscus on GitHub Discussions; leave it unconfigured and the section simply doesn't render
- **RSS and sitemap** — `/rss.xml` and `sitemap-index.xml` generated on build
- **No client framework** — static output, page transitions via Astro's built-in ClientRouter
- **Accessible** — thorough ARIA labelling, honours `prefers-reduced-motion`

## Stack

Astro 6 · TypeScript · Tailwind CSS v4 · Pagefind · MDX · Shiki

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321`. The dev server listens on all interfaces, so you can hit it from a phone on the same network to check the mobile layout.

## Configuration checklist

Work through these and the site is yours:

1. **`src/consts.ts`** — site title, description, author details, navigation, stack list. Every piece of branding copy lives here, so you don't have to dig through components.
2. **`.env`** — copy `.env.example`, set `SITE_URL` (your full deployed URL) and the optional Giscus keys. On Vercel you can leave `SITE_URL` empty; the project's production domain is used automatically.
3. **`public/favicon.svg`** — replace with your own icon.
4. **`src/pages/about.astro`** — the about page's prose, cover image and skill groups are meant to be hand-written.
5. **`src/content/`** — delete the sample posts and project, add your own.
6. **`src/styles/global.css`** — where to go for colours (see below).

## Writing posts

A post is a directory with an `index.md`; the directory name is the URL:

```
src/content/blog/
└── my-first-post/     → /blog/my-first-post
    ├── index.md
    └── diagram.png    → reference it as ./diagram.png
```

Post frontmatter:

```yaml
---
title: Post title # required
description: One-line summary # required, used in lists and for SEO
date: 2026-09-01 # required
tags: [Astro, Engineering] # optional
cover: https://example.com/a.jpg # optional, must be an absolute URL
draft: true # optional; skipped from the build, lists and RSS
---
```

Projects take three more fields: `status`, `demoURL` and `repoURL`. `status` is an enum — the shipped values are Chinese (`构思中` / `验证中` / `开发中` / `已发布` / `维护中`); edit the `z.enum([...])` in `src/content.config.ts` to use your own wording. Full constraints live in that same file.

The sample posts double as the documentation: content format, theming, deployment and comments, plus one page that exercises every typographic element.

## Changing colours

`src/styles/global.css` contains two `:root` blocks. **The later one wins** — it's the one commented as the editorial system; the first is an overridden default palette. Edit that later block and the `html.dark` block right after it; always change both so theme switching stays consistent.

The tokens you'll reach for: `--page-bg` (page background), `--surface` (cards and panels), `--text` / `--muted` / `--subtle` (three text levels), `--border` / `--line` (rules and dividers), `--accent` (links and emphasis). The `--astro-code-*` set controls syntax highlighting, also in both themes.

Fonts default to Geist Sans and Geist Mono, bundled locally via `@fontsource` — no CDN request. Swapping them means three edits: the `@fontsource/*` dependencies in `package.json`, the imports at the top of `src/components/Head.astro`, and `--font-sans` / `--font-mono` in the `@theme` block of `global.css`.

## Project layout

```
src/
├── components/     # header, footer, cards, TOC, theme switch
├── content/        # posts and projects (Markdown / MDX)
├── layouts/        # page shell
├── pages/          # routes
├── styles/         # global.css — all styles and theme tokens
├── consts.ts       # site configuration entry point
├── content.config.ts  # collections and field validation
└── types.ts
```

Routes: `/`, `/blog`, `/blog/[id]`, `/projects`, `/projects/[id]`, `/tags`, `/tags/[tag]`, `/about`, `/rss.xml`, `/404`.

## Build and deploy

```bash
pnpm build    # astro check + build, then the search index
pnpm preview  # serve the build output
```

Output lands in `dist/` as plain static files, so any static host works. If a platform asks: build command `pnpm build`, output directory `dist`, Node 24.

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fxyovo%2Fbroadsheet&project-name=my-blog&repository-name=my-blog)

Zero config: Vercel detects Astro, runs `pnpm build` and serves `dist`. The site URL falls back to `VERCEL_PROJECT_PRODUCTION_URL`, so your sitemap and feed carry correct absolute URLs from the very first deploy.

Once you attach a custom domain, add `SITE_URL=https://your-domain` under the project's Environment Variables and redeploy — it takes precedence over the generated domain. Add the four `PUBLIC_GISCUS_*` variables at the same time if you want comments.

### Other platforms

Netlify, Cloudflare Pages and GitHub Pages all work, but you **must set `SITE_URL` yourself** — otherwise the links in RSS and the sitemap point at `localhost`. Deploying under a sub-path (a GitHub Pages project site, say) also needs `base` in `astro.config.mjs`.

The search index is only produced during a build, so **empty search results in dev mode are expected**. To check search, run `pnpm build && pnpm preview`.

## Comments

Generate the four values at [giscus.app](https://giscus.app), then add them to `.env` and to your host's environment variables:

```bash
PUBLIC_GISCUS_REPO=your-name/your-repo
PUBLIC_GISCUS_REPO_ID=R_xxx
PUBLIC_GISCUS_CATEGORY=Announcements
PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx
```

This requires a public repo with Discussions enabled and the Giscus App installed. Miss any one of the four variables and the comment section is skipped; everything else keeps working.

## Licence

MIT
