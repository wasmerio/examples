---
title: Deploy the site
description: Deploy ermaozi to GitHub Pages, GitLab Pages, Netlify, Vercel, Firebase, or another static host.
permalink: /en/docs/guide/deployment/
translationOf: /docs/guide/deployment/
type: doc
group: Guide
order: 20
createTime: 2026-08-07
tags: [Deployment, GitHub Pages, Netlify, Vercel]
---

# Deploy the site

ermaozi builds a static site by default. The build command is `npm run build` and the publish directory is `dist`; pnpm and Yarn use the same script name.

## Generate deployment configuration

Run the initializer and choose a platform under “Deployment”:

```sh
npm create astro-theme-ermaozi
```

The initializer writes the smallest configuration for the package manager that invoked it:

| Choice | Generated files | Result |
| --- | --- | --- |
| GitHub Pages | `.github/workflows/deploy.yml` | GitHub Actions builds and publishes pushes to `main` |
| GitLab Pages | `.gitlab-ci.yml` | The default-branch pipeline publishes `dist` |
| Netlify | `netlify.toml` | A repository import reads the build command and output directory |
| Vercel | `vercel.json` | A repository import deploys the Astro static site |
| Firebase Hosting | `firebase.json`, `.firebaserc` | Run `firebase deploy` after a local build |
| Custom | No provider file | Publish `dist` to any static host |

No access tokens are written to these files. The GitHub Pages workflow uses OIDC permissions; other providers use their own repository authorization.

## Origin and base path

Check `site.config.mjs` before publishing:

```js
origin: 'https://blog.example.com',
base: '/',
```

- `origin` is the production origin, including the protocol and excluding a path. It is used for canonical URLs, the sitemap, and social cards.
- `base` is the deployment subpath. A custom domain normally uses `/`; use `/project/` for `https://example.com/project/`.
- CI can override these values with `SITE_ORIGIN` and `BASE_PATH`. The generated GitHub Pages and GitLab Pages configurations already derive the default Pages URL.

Internal links, images, search, Markdown source files, the sitemap, and SEO URLs all use the same base path.

## GitHub Pages

1. Push the repository to GitHub with `main` as the default branch.
2. Under **Settings → Pages → Build and deployment**, set Source to **GitHub Actions**.
3. Push a commit or manually run the `Deploy to GitHub Pages` workflow.

The workflow distinguishes user sites from project sites. For a custom domain, change `SITE_ORIGIN` in the workflow to the real origin and set `BASE_PATH` to `/`.

## GitLab Pages

Push the repository to GitLab. The default-branch pipeline reads `CI_PAGES_URL`, builds the site, and publishes it with `pages.publish: dist`. Find the resulting URL under **Deploy → Pages**.

## Netlify and Vercel

Import the repository in the provider dashboard. The generated configuration publishes `dist`; a static site does not need an Astro server adapter. Update `origin` when attaching a custom domain.

## Firebase Hosting

Install and sign in to the Firebase CLI, then build and deploy:

```sh
npm install --global firebase-tools
firebase login
npm run build
firebase deploy
```

The initializer writes the Firebase project ID to `.firebaserc`. Update `projects.default` if the project changes.

## Other static hosts

Use these generic settings:

```text
Build command: npm run build
Publish directory: dist
Node.js: 22.12 or newer
```

Run `npm run build && npm run preview` for a local production check. `preview` is an acceptance server, not a production server.
