---
title: Deploy
description: Publish the site to GitHub Pages with the included workflow, or to Vercel and Netlify with one click.
---

The site is static output in `dist/`. Any static host works. The key goes in as an environment variable at build time. This key is designed to be public: it ends up in the built HTML like an analytics ID and can only spend your account's allowance, so a build-time variable is enough.

## GitHub Pages

The template ships with `.github/workflows/deploy.yml`.

1. In the repository settings, under **Pages**, set the source to **GitHub Actions**.
2. Under **Secrets and variables → Actions**, add a secret named `ONETAG_KEY` with your key.
3. Push to `main`. The workflow builds the site and publishes it.

The workflow sets `BASE_PATH` to `/<repository-name>` so links and the search index work under a project page URL. For a user or organization page (`you.github.io`), delete that line.

## Vercel

Click the button in the README, or import the repository in Vercel. Framework preset: **Astro**. Add `PUBLIC_ONETAG_KEY` under **Environment Variables**.

## Netlify

Click the button in the README, or create a new site from the repository. Build command `npm run build`, publish directory `dist`. Add `PUBLIC_ONETAG_KEY` under **Site configuration → Environment variables**.

## Anywhere else

```bash
PUBLIC_ONETAG_KEY=ot_your_key npm run build
```

Upload `dist/` to the host. If the site is served from a sub-path, set `BASE_PATH=/that-path` for the build too.
