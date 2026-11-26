# Deploy

Gazette builds to a static site in `dist/`. There is no server runtime, no database and no
environment variable you have to set at runtime.

## Before you deploy

Set `site.url` in `src/config.ts` to your production URL. Canonical links, the feed, the sitemap
and `robots.txt` all print absolute URLs from it.

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

Output goes to `dist/`. `pnpm preview` serves it locally, which is the closest thing to what your
host will serve.

`SITE_URL` overrides `site.url` at build time, which is useful for a staging deploy:
`SITE_URL=https://staging.example.com pnpm build`.

## One-click deploy

Each button clones this repository into your own GitHub account, builds it and puts it online. You
confirm a name; there is nothing else to set. The host reads `package.json`, sees Astro and the
pinned pnpm, and takes `dist/`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ondelva/astro-theme-gazette)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ondelva/astro-theme-gazette)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ondelva/astro-theme-gazette)

Then do one thing: set the build environment variable `SITE_URL` to the address you were given (or
your own domain) and redeploy. Canonical links, the feed, the sitemap and `robots.txt` are absolute,
and the default in `src/config.ts` is `https://example.com`. Editing `site.url` in your new
repository instead works the same way.

GitHub Pages has no button of its own — see below.

## Your own repository

Hosts build from a Git repository you own. A button above makes one for you. The other two routes:

**Fork this repository.** The fork keeps the link back here, so you can pull later releases.

**Start from the CLI.** `pnpm create astro@latest my-magazine -- --template ondelva/astro-theme-gazette`
copies the files with no Git history of this repository, so make your own:

```sh
git init -b main
git add -A
git commit -m "Start from Gazette"
git remote add origin https://github.com/<you>/<your-site>.git
git push -u origin main
```

Then connect that repository to a host. The defaults are right; you only confirm the build
settings.

## Cloudflare Workers / Pages

Build command `pnpm build`, output directory `dist`.

## Vercel

Framework preset Astro, build command `pnpm build`, output directory `dist`.

A new project is private: the build succeeds, and the deployment URL answers with a login screen
(Deployment Protection, a 302 to Vercel's SSO). Attach your domain, or turn protection off under
Settings -> Deployment Protection, before you send the link to anyone.

## Netlify

Build command `pnpm build`, publish directory `dist`.

Two things a first deploy does on its own. `pnpm-workspace.yaml` makes Netlify read the project as
a monorepo and propose `pnpm --filter <name>... run build`; leave it, it builds correctly. And a
new site is private by default, so the `.netlify.app` URL answers 401 until you attach a domain or
make the site public.

## GitHub Pages

Works, with one thing to watch: a project site is served from `/<repo>/`, so set `base: '/<repo>/'`
in `astro.config.mjs` as well as `site.url`. A custom domain or a `<user>.github.io` repository
needs neither.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and on every pull request: install,
`pnpm check`, `pnpm lint`, `pnpm check:contrast`, `pnpm build`, a Lighthouse run against the built
site, and an internal link check. The Lighthouse pages and thresholds are in `lighthouserc.json`.

You do not need it to deploy, but it is the list of things worth verifying before you ship, and it
is what the theme itself is held to.
