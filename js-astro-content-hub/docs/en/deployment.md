---
title: "Deployment"
description: "Point the astro-content-hub template at GitHub Pages and/or Cloudflare Pages."
order: 4
---

The hub is a static Astro 7 site that deploys for free to **GitHub Pages** and
**Cloudflare Pages**. This page covers how to point the template at your own
infrastructure.

## Before you deploy

1. **Set your site URL.** In `astro.config.mjs`, set `site` to your deployed
   origin - for example `https://your-name.github.io/astro-content-hub` (a
   GitHub Pages project site) or `https://your-domain.com` (a custom domain).
   It drives canonical, Open Graph, and `hreflang` absolute URLs. The
   template ships with the awareride project URL as a sample.
2. **Set the site name.** In `src/lib/i18n.ts`, set `siteName` (default
   `'Astro Content Hub'`) to your project's name. It appears in `<title>`, the
   nav, and the footer.
3. **Match your deploy target to your URL.** The template builds
   **root-absolute** links and asset paths (`/posts`, `/_astro/...`,
   `/favicon.ico`), so it works out of the box at a **site root**:
   - **Cloudflare Pages** (`<project>.pages.dev`) or a **custom domain** on
     GitHub Pages - no extra path config. For a GitHub Pages custom domain,
     add a `public/CNAME` file containing your domain (the template ships
     none by default).
   - **GitHub Pages project path** (`https://<owner>.github.io/<repo>/`) is a
     **sub-path** deploy: set `base: '/<repo>/'` in `astro.config.mjs` and
     prefix every root-absolute link and asset with `import.meta.env.BASE_URL`.
     (The template uses root-absolute paths by default, so a root or
     custom-domain deploy is the simplest path.)
4. **Replace sample content.** Delete the sample posts and docs under
   `src/content/` and add your own (see
   [Authoring](./authoring.md)).

## The deploy workflow

`.github/workflows/deploy.yml` is committed as **template config only** — it is
not wired to any live target. It is triggered **manually** via the Actions tab
(`workflow_dispatch`); it does **not** run automatically on push to `main`.

The workflow has three jobs:

1. **build** — checks out, runs `npm ci`, builds with `npm run build`, and
   uploads `dist/` as a Pages artifact.
2. **deploy-gh-pages** — deploys the artifact to GitHub Pages (requires Pages
   enabled on the repo).
3. **deploy-cf-pages** — deploys `dist/` to Cloudflare Pages via `wrangler`.

## Enable GitHub Pages

- In the repo **Settings → Pages**, set the source to "GitHub Actions".
- Run the workflow from the Actions tab ("Run workflow").
- The live URL is `https://<owner>.github.io/<repo>/` unless you've set a
  custom domain via `public/CNAME`. The project path is a sub-path deploy -
  see step 3 above: it needs `base: '/<repo>/'` and base-aware links. A
  custom domain (with `public/CNAME`) deploys at the root and needs no
  `base`.

## Enable Cloudflare Pages

1. Create the API token + account ID secrets in the repo
   (**Settings → Secrets and variables → Actions**):
   `CLOUDFLARE_API_TOKEN` (with Pages deploy permission) and
   `CLOUDFLARE_ACCOUNT_ID`.
2. Set a repository variable `CF_PROJECT` to your Cloudflare Pages project name
   (**Settings -> Secrets and variables -> Actions -> Variables**). The
   `deploy-cf-pages` job is gated on it: leave it unset to deploy to GitHub
   Pages only.
3. Run the workflow. The `wrangler pages project create` step is idempotent
   (`|| true`), so re-runs are safe.

## Node version

The workflow uses **Node 22** (`setup-node@v4`, `node-version: 22`), matching
the project's supported runtime. Use `npm`, not `pnpm`/`yarn`.

## Verification

```bash
npm run build   # must pass with 0 errors (astro check + build)
```

After a manual run, spot-check the deployed `dist/`:

```bash
ls dist/
ls dist/vite/docs/   # sample product docs
ls dist/zh-Hans/     # localized routes
```
