<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Folio](https://github.com/rhyswdev/folio) Astro theme by rhyswdev, copied from commit `e6555dead322f13f01a1329c53d4d2daacc906f8` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-folio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [rhyswdev](https://github.com/rhyswdev), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# folio

A fast, content-driven portfolio template built with **Astro 7 + TypeScript + Tailwind v4**.
Near-zero client JavaScript, fully static, and everything personal lives in **one config
file and a folder of markdown**, so making it your own does not mean touching the components.

[**Use this template**](https://github.com/rhyswdev/folio/generate) to create your own repo,
or `pnpm dlx degit rhyswdev/folio my-portfolio`.

---

## First five minutes

1. Click **Use this template** above (or `degit`), then `cd` into your new project.
2. `pnpm install`
3. Edit **`site.config.ts`** — your name, title, contact, socials, navigation, brand colours, and all the page copy (`home`, `about`, `skills`, `contact`).
4. Replace the example work in **`src/content/projects/`** with your own markdown files.
5. Swap **`src/assets/portrait.jpeg`** (your photo) and **`public/cv.pdf`** (your CV).
6. Create a free [Formspree](https://formspree.io) form and paste the id into `site.config.ts`.
7. `pnpm dev` to preview, then deploy.

The included **"Using this template"** blog post (`/blog` on the running site) walks through
each step, re-theming, and deployment in detail.

## Commands

| Command          | Action                                  |
| :--------------- | :-------------------------------------- |
| `pnpm dev`       | Dev server at `localhost:4321`          |
| `pnpm build`     | Build the static site to `./dist/`      |
| `pnpm preview`   | Preview the production build            |
| `pnpm check`     | Type-check with `astro check`           |
| `pnpm format`    | Format with Prettier                    |

## What's where

| You edit                          | You usually leave alone   |
| :-------------------------------- | :------------------------ |
| `site.config.ts`                  | `src/components/`        |
| `src/content/projects/*.md`       | `src/layouts/`          |
| `src/content/blog/*.md`           | `src/content.config.ts` |
| `src/assets/portrait.jpeg`        | `astro.config.mjs`      |
| `public/cv.pdf`, `favicon`        |                          |
| `src/styles/global.css` (to re-theme deeply) | |

## Tech

Astro 7 · TypeScript (strict) · Tailwind CSS v4 · MDX · Content Collections · pnpm.
Self-hosted fonts (Inter, Fraunces, IBM Plex Mono). Static output, no runtime, no adapter.

## Re-theming

The whole look is driven by two brand colours. Quick swap in `site.config.ts`
(`brand.primary`, `brand.accent`); the full palette and dark-mode variants live in
`src/styles/global.css` under Tailwind v4's `@theme` block.

## Deploy

Built for **Cloudflare Pages** (build command `pnpm build`, output directory `dist`,
`NODE_VERSION=22`). The same static build also works on Vercel, Netlify and GitHub Pages.
Set your production URL in `astro.config.mjs` (`site:`) before going live.

## Licence

MIT (see `LICENSE`). Use it for anything, no attribution required (a link back is always
appreciated). The example content is placeholder text — replace it with your own.
