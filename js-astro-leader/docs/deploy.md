# Deploy

`pnpm build` writes a static site to `dist/`. There is no server, no adapter and no
runtime: any static host will serve it.

Two things to do before the first deploy.

1. **Set `site.url`** in `src/config.ts` to the address the site will actually have.
   Canonical links, the sitemap and the feed are absolute, and they are all wrong until you
   do. `SITE_URL` in the build environment overrides it, which is useful for preview
   deployments:

   ```sh
   SITE_URL=https://staging.example.com pnpm build
   ```

2. **Run the gate:** `pnpm check && pnpm build`. A build that fails on a host usually fails
   locally first.

## Your own repository

`pnpm create astro@latest my-workshop -- --template ondelva/astro-theme-leader` gives you
the theme with no git history, ready to commit as your own. To take a later release, add
the theme as a second remote and merge its tag:

```sh
git remote add theme https://github.com/ondelva/astro-theme-leader.git
git fetch theme --tags
git merge v1.1.0 --allow-unrelated-histories   # first time only
```

Your content lives in `src/content/` and your changes in `src/config.ts` and
`src/styles/theme.css`, so the conflicts are usually few and always in files you have
edited. Read `CHANGELOG.md` first.

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

## Netlify

Import the repository and set:

- Build command: `pnpm build`
- Publish directory: `dist`
- Environment variable: `NODE_VERSION` = `22`

## Anywhere else

Upload `dist/`. It is plain files. A `404.html` is generated, so point the host's not-found
handler at it if that is not automatic.

## Continuous integration

`.github/workflows/ci.yml` runs on push and pull request: `pnpm check`, `pnpm lint`,
`pnpm check:contrast`, `pnpm build`, `pnpm check:sitemap`, Lighthouse CI against the thresholds in
`lighthouserc.cjs`, and an internal link check over `dist/`. It needs no secrets. Delete the
file if you would rather not run it.

## The integrations, once you are live

Each of these is off until you fill in `src/config.ts`, and each is a plain form post or a
single script — nothing is loaded while the settings are empty.

| What         | What to fill in                                                                           |
| ------------ | ----------------------------------------------------------------------------------------- |
| Analytics    | `analytics.provider` and `analytics.id`. `host` only for self-hosted Plausible or Umami   |
| Contact form | `contact.endpoint` from Formspree or Basin. Empty, `/contact` prints your address instead |

Submit the contact form once on the deployed site. It posts to somebody else's server, and
the only way to know the endpoint is right is to watch a message arrive.

## After deploying

- **Share cards** are `public/og-default.png` for every page. Paste a URL into a card
  validator once to see what a link to your site looks like.
- **`/robots.txt`** is generated from `site.url` and points at the sitemap. It allows
  everything; edit `src/pages/robots.txt.ts` to narrow it.
- **The legal pages** (`src/pages/privacy.astro`, `terms.astro`) are placeholders. Replace
  them.
