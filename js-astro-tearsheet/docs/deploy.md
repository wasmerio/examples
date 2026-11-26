# Deploy

Tearsheet builds to a static site in `dist/`. There is no server runtime, no database and no
environment variable you have to set at runtime.

## Before you deploy

- Set `site.url` in `src/config.ts` to your production URL. Canonical links, the feed, the
  sitemap and `robots.txt` print absolute URLs from it, and the default is `https://example.com`.
- Set up the subscribe forms (`newsletter.username`, see [customization.md](customization.md#subscribe-forms))
  and send a test address through them.
- Replace the demo issues in `src/content/issues/` with yours, or set them to `draft: true`.

## Requirements

- Node.js 22.12 or newer (`.nvmrc` says `22`).
- pnpm. `package.json` pins the exact version in `packageManager`; pnpm 10+ and Corepack switch to
  it on their own. To install that version yourself:

```sh
npm i -g "$(node -p "require('./package.json').packageManager.split('+')[0]")"
```

## Build

```sh
pnpm install
pnpm build
pnpm check:cut
```

`pnpm build` writes `dist/`. `pnpm check:cut` then searches every built file for the members
part of every issue, and exits 1 if it finds any. `pnpm preview` serves `dist/` locally.

`SITE_URL` overrides `site.url` at build time, which is what a staging deploy wants:

```sh
SITE_URL=https://staging.example.com pnpm build
```

For a preview you share before the newsletter exists, add `DEMO_FORMS=1` so the forms subscribe
nobody (see [customization.md](customization.md#demo-builds-demo_forms1)).

**Never upload the `dist/` of a failed build.** When a build fails partway, Astro can leave its
intermediate files in `dist/.prerender/`, and those hold the full text of every issue, members part
included. A successful build removes them. Let your host build from the repository, as below,
rather than uploading a folder by hand.

## Your own repository

The Deploy buttons in the README copy this repository into your account for you. If you started
from `pnpm create astro`, or from a clone, push your own copy first.

**Make that repository private before your first members issue.** The members part of every issue
is cut from the site, but it is still in `src/content/issues/`. A public repository publishes it.
GitHub: Settings → General → Danger Zone → Change visibility.

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
git commit -m "Start from Tearsheet"
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
offers a monorepo build command; the default works as it stands.

## GitHub Pages

Works from a private repository on a paid GitHub plan; on a free plan Pages needs a public
repository, which publishes your members text, so use one of the hosts above. A project site is served from `/<repo>/`,
so set `base: '/<repo>/'` in `astro.config.mjs` as well as `site.url`; a custom domain needs
neither. Build with the same commands in an action and publish `dist`.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every pull request: `pnpm check`,
`pnpm lint`, `pnpm check:contrast`, `pnpm test`, `pnpm build`, `pnpm check:cut`, then Lighthouse
and a link check over the built site.

The Lighthouse thresholds and pages are in `lighthouserc.cjs`: mobile, 95 or better on all four
categories. The page list filters itself against `dist/`, so deleting a demo issue drops it from
the run instead of failing it; add your own pages as you write them. The link check walks
internal links only.

Make `check:cut` part of your host's build if the host builds without CI in front of it:
`pnpm build && pnpm check:cut` as the build command fails the deploy on a leak.
