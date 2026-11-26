<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Argon](https://github.com/zsancc/astro-argon) Astro theme by zsancc, copied from commit `02b4a245762105d73fa093855ea5303ce43e0591` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-argon.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [zsancc](https://github.com/zsancc), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

﻿# Astro-Argon Blog Template (Astro + Argon Style)

A Fuwari-based Astro blog template, refactored for Argon-style UI and simpler maintenance.

- Astro `6.0.0-beta.14`
- Tailwind CSS `4.2.1`
- daisyUI `5.5.19`
- Pagefind search

## Languages

- [中文](docs/README.zh-CN.md)
- [English](docs/README.en.md)

Site language supports only `zh_CN` and `en`.

## Requirements

- Node.js `>= 24`
- pnpm `>= 10` (recommended `10.30.1`)

## Quick Start

```bash
corepack enable
corepack use pnpm@10.30.1
pnpm install
pnpm dev
```

Visit `http://localhost:4321`.

## Template Usage

1. Use this template (or fork it) on GitHub.
2. Clone your own repo.
3. Edit `src/config.ts` (all site config is centralized there).
4. Run and verify locally.
5. Deploy to Vercel / Cloudflare Pages / self-hosted server.

## Configuration (Single Source)

All configurable values are in `src/config.ts`:

- `globalConfig`: `siteUrl`, repo name/url, RSS fallback, Astro base/trailingSlash
- `siteConfig`: title, subtitle, language, theme set, banner, TOC, favicon
- `navBarConfig`: top navigation links
- `profileConfig`: sidebar profile name/bio/avatar/social links
- `licenseConfig`: post license block switch/content
- `expressiveCodeConfig`: code block theme

No CMS config files are required.

## Deployment

Static output is in `dist/`.

### Vercel

- Build command: `pnpm build`
- Output directory: `dist`
- Cache headers: `vercel.json`

### Cloudflare Pages

- Build command: `pnpm build`
- Output directory: `dist`
- Cache headers: `public/_headers`

### Self-Hosted (Nginx)

1. Run `pnpm build`.
2. Upload `dist/` to server.
3. Apply `deploy/nginx/astro-static-cache.conf` cache rules.

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start local dev server |
| `pnpm build` | Build `dist/` and generate Pagefind index |
| `pnpm preview` | Preview production build |
| `pnpm check` | Run Astro type/content checks |
| `pnpm type-check` | Run TypeScript check (`tsc`) |
| `pnpm new-post <slug>` | Create a new post scaffold |

## License

MIT
