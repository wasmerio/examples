<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Inkline](https://github.com/kokitree/Inkline) Astro theme by kokitree, copied from commit `d49b472d00cd08b3a95158cf9ede3abf931bacc8` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-inkline.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
- **Environment variables:** None.
- **Credit:** theme by [kokitree](https://github.com/kokitree), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Inkline

A minimal, writer-first blog theme for [Astro](https://astro.build). One column, no configuration to start, and almost no JavaScript.

## Features

- Markdown and MDX posts with validated front matter
- Featured post on the home page, archive by year, tags
- **The inkline**: a thin accent line along the top of every post that draws itself as you scroll (CSS only, no JavaScript)
- **Reading mode**: text size, width and typeface, remembered per device
- Light and dark themes, with no flash on load
- Search with [Pagefind](https://pagefind.app) (works on the built site)
- Table of contents, copy button on code, previous/next links
- Social preview images (1200×630) generated for every post at build time
- RSS, sitemap, `robots.txt`, canonical URLs, Open Graph tags, JSON-LD
- Skip link, visible focus states, semantic landmarks, reduced-motion support
- Plain CSS with design tokens, no CSS framework, [Newsreader](https://fontsource.org/fonts/newsreader) served from your own site (no external requests)

## Deploy to Cloudflare

Inkline is a static site, so it runs on Cloudflare Workers (static assets), which is what **Workers & Pages → Create** sets up for new projects. Everything Cloudflare needs is in `wrangler.jsonc`: it installs dependencies, builds the site, and publishes the `dist` folder.

**Check first:** the top level of your repository must contain `package.json`, `wrangler.jsonc`, `astro.config.ts` and `src/`, not inside another folder.

### Option 1: Connect your GitHub repository

1. Push the project to GitHub. In the project folder:

   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
   git push -u origin main
   ```

   Use git or GitHub Desktop rather than dragging files into GitHub's web uploader: hidden files such as `.gitignore` and `.node-version` are easy to miss that way.

2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository**, and choose your repo.
3. Set the project name to `inkline` (or change `name` in `wrangler.jsonc` to match what you chose). Leave **Build command** empty and keep the **Deploy command** as `npx wrangler deploy`.
4. Save and deploy. Every push to `main` redeploys.
5. When it finishes, copy your `*.workers.dev` address into `url` in `src/config.ts` (or set a `SITE_URL` build variable), then push again. RSS, the sitemap and social images use that address.

### Option 2: Deploy from your computer

The quickest way to check everything works, with no GitHub involved:

```sh
npm install
npx wrangler login
npm run deploy
```

### Option 3: Deploy button (public repositories)

```md
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR-NAME/YOUR-REPO)
```

### Custom domain

Open your Worker in the dashboard, then **Settings → Domains & Routes → Add**. Update `url` in `src/config.ts` to match.

### Troubleshooting

| What the log says | Cause | Fix |
| --- | --- | --- |
| `Could not read package.json`, `No dependencies detected`, or `Could not detect a directory containing static files` | Cloudflare cloned your repo, but the project files aren't at its top level | Move them to the top level, or set **Root directory** to the subfolder in **Settings → Build** |
| `Node.js v… is not supported by Astro` | The build image's Node is too old | Add a build variable `NODE_VERSION` set to `24` |
| A name mismatch between the Worker and the config | The Worker's name in the dashboard differs from `name` in `wrangler.jsonc` | Make them the same |
| Links, RSS or social images point to `example.com` | `url` is still the placeholder | Set `url` in `src/config.ts` or the `SITE_URL` variable |

## Get started

Requires Node 22.23.4 or newer.

```sh
npm install
npm run dev
```

1. Edit `src/config.ts`: set `title` and `url`.
2. Add Markdown files to `src/content/posts/`.
3. Run `npm run build` to publish. Search only works after a build (`npm run preview` to try it).

## Where things live

| You want to change | Edit |
| --- | --- |
| Site name, nav, features | `src/config.ts` |
| Colors, fonts, widths | the tokens at the top of `src/styles/global.css` |
| Social image design | `src/utils/og.ts` |
| The About page | `src/pages/about.astro` |
| Post fields | `src/content.config.ts` |
| Favicon | `public/favicon.svg` |

To pull in future updates, keep your changes to those files, `src/content/`, and `public/`.

## Post front matter

```yaml
---
title: "Required"
description: "Required"
pubDate: 2026-10-20     # required
updatedDate: 2026-10-25 # optional
tags: ["one", "two"]    # optional
featured: true          # optional: pins to the home page
draft: true             # optional: hidden from production builds
---
```

## Social preview images

Every post gets an image at `/og/<post>.png`, and the site gets `/og/default.png`. They are drawn at build time with [Satori](https://github.com/vercel/satori) from the post title, description and date. Turn them off with `features.ogImages: false` in `src/config.ts`. The bundled font covers Latin text; for other scripts, add a font that covers them in `src/utils/og.ts`.

## Roadmap ideas

- Optional view transitions
- Series and i18n

## License

MIT
