# Deploy

`pnpm build` writes a static site to `dist/`. There is no server, no adapter and no
runtime: any static host will serve it.

Two things to do before the first deploy.

1. **Set `site.url`** in `src/config.ts` to the address the site will actually have.
   Canonical links, the sitemap, the feed and the preview images are absolute, and they
   are all wrong until you do. `SITE_URL` in the build environment overrides it, which is
   useful for preview deployments:

   ```sh
   SITE_URL=https://staging.example.com pnpm build
   ```

2. **Run the gate:** `pnpm check && pnpm build`. A build that fails on a host usually
   fails locally first.

## Your own repository

The Deploy buttons in the README clone this repository into your account for you. If you
started from `pnpm create astro`, push your own copy first:

```sh
git init -b main
git add -A
git commit -m "Start from Vitrine"
git remote add origin https://github.com/<you>/my-archive.git
git push -u origin main
```

To take later releases, keep the theme as a second remote:

```sh
git remote add theme https://github.com/ondelva/astro-theme-vitrine.git
git fetch theme --tags
git merge v1.1.0 --allow-unrelated-histories   # first time only
```

Your content lives in `src/content/` and your changes in `src/config.ts` and
`src/styles/theme.css`, so the conflicts are few and always in files you have edited.
Read `CHANGELOG.md` first.

## Cloudflare Pages

Create a project, connect the repository, and set:

- Framework preset: **Astro**
- Build command: `pnpm build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION` = `22`

Cloudflare reads `packageManager` in `package.json` and uses the right pnpm.

## Vercel

Import the repository; Vercel detects Astro and fills in `pnpm build` and `dist`. Nothing
else is needed. Set `SITE_URL` as an environment variable if you want preview deployments
to have correct canonical URLs.

A new project is private: the build succeeds, and the deployment URL answers with a login
screen (Deployment Protection, a 302 to Vercel's SSO). The production alias is public, but
attach your domain, or turn protection off under Settings → Deployment Protection, before
you send a deployment link to anyone.

## Netlify

Import the repository and set:

- Build command: `pnpm build`
- Publish directory: `dist`
- Environment variable: `NODE_VERSION` = `22`

Two things a first deploy does on its own. `pnpm-workspace.yaml` makes Netlify read the
project as a monorepo and propose `pnpm --filter astro-theme-vitrine... run build`; leave
it, it builds correctly. And a new site is private by default, so the `.netlify.app` URL
answers 401 until you attach a domain or make the site public under Project configuration →
General → Visitor access.

## Anywhere else

Upload `dist/`. It is plain files. A `404.html` is generated, so point the host's not-found
handler at it if that is not automatic.

## Continuous integration

`.github/workflows/ci.yml` runs on push and pull request: `pnpm check`, `pnpm lint`,
`pnpm check:contrast`, `pnpm build`, Lighthouse CI against the thresholds in
`lighthouserc.cjs`, and an internal link check over `dist/`. It needs no secrets. Delete
the file if you would rather not run it.

## After deploying

- **`/robots.txt`** is generated from `site.url` and points at the sitemap. It allows
  everything; edit `src/pages/robots.txt.ts` to narrow it.
- **Analytics** are off until you set `analytics.provider` and `analytics.id` in
  `src/config.ts`.
- **The legal pages** (`privacy.mdx`, `terms.mdx`) are placeholders. Replace them.
