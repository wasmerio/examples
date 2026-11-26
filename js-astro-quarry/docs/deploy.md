# Deploy

Quarry builds to a static site in `dist/`. There is no server runtime, no database and no
environment variable you have to set at runtime.

## Before you deploy

Set `site.url` in `src/config.ts` to your production URL. Canonical links, the feed, the sitemap
and `robots.txt` all print absolute URLs from it, and the default is `https://example.com`.

## Requirements

- Node.js 22.12 or newer (`.nvmrc` says `22`).
- pnpm. `package.json` pins the exact version in `packageManager`; pnpm 10+ and Corepack switch to
  it on their own. To install that version yourself:

```sh
npm i -g "$(node -p "require('./package.json').packageManager.split('+')[0]")"
```

`engines` sets a floor, not a ceiling, so a host picks the newest major it offers: Vercel prints a
warning and builds on Node 24. That is fine for this theme. Pin the major in your host's settings
if you would rather not move with them.

## Build

```sh
pnpm install
pnpm build
```

Output goes to `dist/`: HTML, the two webfont families, the stylesheet, the sitemap and
`robots.txt`. Nothing else, and no client-side JavaScript.

`pnpm preview` serves `dist/` locally, which is the closest thing to what the host will serve.

`SITE_URL` overrides `site.url` at build time, which is what a staging deploy wants:

```sh
SITE_URL=https://staging.example.com pnpm build
```

## Your own repository

The Deploy buttons in the README fork this repository into your account for you. If you started
from `pnpm create astro`, or from a clone, push your own copy first.

Keep the theme repository as `upstream` so you can pull later releases:

```sh
git remote rename origin upstream
git remote add origin https://github.com/<you>/<your-site>.git
git push -u origin main
```

If the copy has no history yet:

```sh
git init -b main
git add -A
git commit -m "Start from Quarry"
git remote add origin https://github.com/<you>/<your-site>.git
git push -u origin main
```

## Cloudflare Workers / Pages

Connect the repository, framework preset **Astro**. Build command `pnpm build`, output directory
`dist`. Nothing else to set.

## Vercel

Import the repository. Astro is detected: build `pnpm build`, output `dist`. A new project is
private by default and answers with an SSO redirect until you attach a domain or make it public in
the project settings.

## Netlify

Import the repository. Build `pnpm build`, publish `dist`. Netlify reads `pnpm-workspace.yaml` and
offers a monorepo build command; the default works as it stands. A new site is private until you
attach a domain, the same way.

## GitHub Pages

Works, with one thing to watch: a project site is served from `/<repo>/`, so set
`base: '/<repo>/'` in `astro.config.mjs` as well as `site.url`. A custom domain or a
`<user>.github.io` repository needs neither. Build with the same two commands in an action and
publish `dist`.

## CI

`.github/workflows/ci.yml` runs on every push and pull request: `pnpm check`, `pnpm lint`,
`pnpm check:contrast`, `pnpm build`, then Lighthouse and a link check over the built site.

The Lighthouse thresholds and the pages it visits are in `lighthouserc.cjs` — mobile, 95 or better
on all four categories. The page list filters itself against `dist/`, so deleting a demo page drops
it from the run instead of failing it with a 404; add your own pages to that list as you write
them. The link check walks internal links only; external ones are somebody else's uptime.
