# Deploy

Pilcrow builds to a static site in `dist/`. There is no server runtime to configure.

## Before you deploy

Set `site.url` in `src/config.ts` to your production URL. It is used for canonical links, RSS, and the sitemap.

## Requirements

- Node.js 22.12 or newer.
- pnpm 9 or newer. `package.json` pins the exact version in the `packageManager` field; pnpm 10+ and Corepack switch to it on their own. To install that exact version yourself:

```sh
npm i -g "$(node -p "require('./package.json').packageManager.split('+')[0]")"
```

## Build

```sh
pnpm install
pnpm build
```

Output goes to `dist/`.

## Cloudflare Pages

Build command: `pnpm build`. Output directory: `dist`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ondelva/astro-theme-pilcrow)

## Vercel

Framework preset: Astro. Build command: `pnpm build`. Output directory: `dist`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ondelva/astro-theme-pilcrow)

## Netlify

Build command: `pnpm build`. Publish directory: `dist`.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ondelva/astro-theme-pilcrow)

## CI

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests: install, `pnpm check`, `pnpm lint`, `pnpm build`, a Lighthouse run, and an internal link check against `dist`. Use it as a reference for what a deploy pipeline should verify before shipping.
