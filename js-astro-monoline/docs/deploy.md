# Deploy

Monoline builds to a static site in `dist/`. There is no server runtime, no database and no environment variable you have to set at runtime.

## Before you deploy

- Set `site.url` in `src/config.ts` to your production URL. Canonical links, the feed, the sitemap, `robots.txt` and the social cards print absolute URLs from it, and the default is `https://example.com`.
- Replace the demo notes in `src/content/notes/` with yours, or set them to `draft: true`. Rewrite `src/pages/about.md`.
- Replace `public/og-default.png`, the social card every page shares (1200×630).

## Requirements

- Node.js 22.12 or newer (`.nvmrc` says `22`).
- pnpm. `package.json` pins the exact version in `packageManager`; pnpm 10+ and Corepack switch to it on their own. To install that version yourself:

```sh
npm i -g "$(node -p "require('./package.json').packageManager.split('+')[0]")"
```

## Build

```sh
pnpm install
pnpm build
```

`pnpm build` writes `dist/`. `pnpm preview` serves it locally.

`SITE_URL` overrides `site.url` at build time, which is what a staging deploy wants:

```sh
SITE_URL=https://staging.example.com pnpm build
```

## Your own repository

Hosts build from a Git repository you own. The Deploy buttons in the README create one for you; otherwise push your own copy first.

If you cloned the theme, keep it as `upstream` so you can pull later releases:

```sh
git remote rename origin upstream
git remote add origin https://github.com/<you>/<your-site>.git
git push -u origin main
```

If you started from a zip:

```sh
git init -b main
git add -A
git commit -m "Start from Monoline"
git remote add origin https://github.com/<you>/<your-site>.git
git push -u origin main
```

Drafts (`draft: true`) are left out of the built site but stay in the repository. Keep the repository private if a draft must not be seen.

## Cloudflare Workers / Pages

Connect the repository, framework preset **Astro**. Build command `pnpm build`, output directory `dist`. Nothing else to set.

## Vercel

Import the repository. Astro is detected: build `pnpm build`, output `dist`. A new project is private by default and answers with an SSO redirect until you attach a domain or make it public in the project settings.

## Netlify

Import the repository. Build `pnpm build`, publish `dist`. Netlify reads `pnpm-workspace.yaml` and offers a monorepo build command; the default works as it stands.

## GitHub Pages

A project site is served from `/<repo>/`, so set `base: '/<repo>/'` in `astro.config.mjs` as well as `site.url`; a custom domain needs neither. Build with the same commands in an action and publish `dist`.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every pull request: `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm check:contrast`, `pnpm build`, then Lighthouse and a link check over the built site.

The Lighthouse thresholds and pages are in `lighthouserc.cjs`: mobile, 95 or better on all four categories. The page list filters itself against `dist/`, so deleting a demo note drops it from the run instead of failing it; add your own pages as you write them. The link check walks internal links only.

`pnpm test` checks the source gutter plugin, the word counts and the dates. If you edit `src/lib/monoline-plugin.ts`, it is the quickest way to know every block still gets its marker.
