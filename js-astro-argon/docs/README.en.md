# Astro-Argon Blog Documentation (English)

This project is a Fuwari-based Astro blog template with Argon-style refactor and centralized configuration in `src/config.ts`.

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

Open: `http://localhost:4321`

## Template Workflow

1. Use this template (or fork it) on GitHub.
2. Clone your own repo.
3. Edit `src/config.ts` (single source of config).
4. Verify locally.
5. Deploy to Vercel / Cloudflare Pages / self-hosted server.

## Configuration (All In config.ts)

File: `src/config.ts`

- `globalConfig`: site URL, repo text/url, RSS fallback, Astro base/trailingSlash
- `siteConfig`: title, subtitle, language, themes, banner, TOC, favicon
- `navBarConfig`: top navigation links
- `profileConfig`: avatar, profile name, bio, social links
- `licenseConfig`: post license block switch/content
- `expressiveCodeConfig`: code theme

No CMS backend files are required.

## Deployment

Output directory: `dist/`

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
2. Upload `dist/` to your server.
3. Apply cache rules from `deploy/nginx/astro-static-cache.conf`.

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start local development server |
| `pnpm build` | Build production output and generate Pagefind index |
| `pnpm preview` | Preview production output locally |
| `pnpm check` | Run Astro checks |
| `pnpm type-check` | Run TypeScript checks |
| `pnpm new-post <slug>` | Create a new post scaffold |

## Theme Token Guide

- Chinese: `docs/THEME_TOKENS.zh-CN.md`
- English: `docs/THEME_TOKENS.en.md`
