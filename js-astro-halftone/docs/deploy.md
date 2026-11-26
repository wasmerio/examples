# Deploy

Halftone builds to a static site in `dist/`. There is no server runtime, no database and no
environment variable you have to set at runtime.

## Before you deploy

Set `site.url` in `src/config.ts` to your production URL. Canonical links, the feed, the sitemap,
`robots.txt` and every share card URL are printed absolute from it.

The demo content in `src/content/` is fiction, written to show the theme running. Replace it before
you publish; the pictures in `src/assets/sample/` are drawn placeholders, not photographs.

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

Builds need `sharp`, which ships a prebuilt binary for every platform the four hosts below run. No
system package is required.

## Build

```sh
pnpm install
pnpm build
```

Output goes to `dist/`: Astro builds the pages and re-encodes every photograph, including the
1200×630 JPEG share card each article is given from its own picture.

`pnpm preview` serves `dist/` locally, which is the honest check before you ship.

`SITE_URL` overrides `site.url` at build time, which is what a staging deploy wants:
`SITE_URL=https://staging.example.com pnpm build`.

If a build prints `fetch failed` while fetching webfonts, the failure is cached as a zero-byte
file. Clear it and rebuild:

```sh
rm -rf .astro node_modules/.astro dist && pnpm build
find dist -name '*.woff2' -size -1k    # should print nothing
```

## Your own repository

Hosts build from a Git repository you own. `pnpm create astro --template ondelva/astro-theme-halftone`
gives you the files with no Git history, so start one:

```sh
git init -b main
git add -A
git commit -m "Start from Halftone"
git remote add origin https://github.com/<you>/<your-magazine>.git
git push -u origin main
```

Then connect that repository to a host. The defaults are right; you only confirm the build
settings. The deploy buttons in the README do the same thing in one step: the host clones this
theme into your account first, and you edit from there.

Whichever host you use, `SITE_URL` can be set as a build environment variable there. That is the
easiest way to give a preview deploy its own address while `site.url` stays at your production URL.

## Cloudflare Workers / Pages

Build command `pnpm build`, output directory `dist`.

## Vercel

Framework preset Astro, build command `pnpm build`, output directory `dist`.

A new project is private: the build succeeds, and the deployment URL answers with a login screen
(Deployment Protection, a 302 to Vercel's SSO). Attach your domain, or turn protection off under
Settings → Deployment Protection, before you send the link to anyone.

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
site, and an internal link check. The Lighthouse pages and thresholds are in `lighthouserc.cjs`,
which filters the list down to the pages that actually exist — delete a demo page and the gate
keeps working.

You do not need CI to deploy, but it is the list of things worth verifying before you ship, and it
is what the theme itself is held to.
