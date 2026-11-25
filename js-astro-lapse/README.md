<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Lapse: AI SaaS Template](https://github.com/agnilem/lapse-astro) Astro theme by agnilem, copied from commit `e50827826eee085387457332e64f4493162de96d` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-lapse.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 2 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [agnilem](https://github.com/agnilem), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<p align="center">
  <a href="https://startfrom.co/?utm_source=github&utm_medium=readme&utm_campaign=lapse"><img alt="Lapse: A dark, motion-led AI and SaaS template for Astro and Next.js. Free and MIT licensed, by Startfrom." src="./.github/assets/cover.jpg" width="100%"></a>
</p>

<p align="center">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-111111?style=flat-square"></a>
  <img alt="Astro 7" src="https://img.shields.io/badge/Astro-7-111111?style=flat-square">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-111111?style=flat-square">
  <img alt="Static output" src="https://img.shields.io/badge/output-static-111111?style=flat-square">
</p>

<p align="center">
  <a href="https://lapse.startfrom.co"><b>Astro demo</b></a>
  &nbsp;·&nbsp;
  <a href="https://lapse-next.startfrom.co"><b>Next.js demo</b></a>
  &nbsp;·&nbsp;
  <a href="https://startfrom.co/?utm_source=github&utm_medium=readme&utm_campaign=lapse"><b>Startfrom</b></a>
  &nbsp;·&nbsp;
  <a href="https://buy.polar.sh/polar_cl_C7mCmNfCQK9xTynrq5u0t4I4CpMoRc5tN5UCB3mx56l?utm_source=github&utm_medium=readme&utm_campaign=lapse"><b>All Astro Themes</b></a>
</p>

# Lapse, an Astro theme for AI and SaaS products

A dark, motion-led, nine-page site for an AI product: scroll-pinned sections that explain what the product changes and how it works, a pricing page with a plan comparison, a Markdown blog, and a contact form. Static output, no UI framework: every interaction is a small vanilla JavaScript module.

Two builds of the same site, Astro and Next.js: the Astro project is this folder, and a Next.js 16 version lives in [`next/`](next/). They are visually identical, checked element by element on every page at desktop, tablet and phone widths.

## Features

- Hero with a product screenshot and three stat cards
- "What changes": a pinned section whose four cards slide sideways as you scroll, each with a small UI panel
- "How it works": a pinned stage where four step cards fly in and out, with the step number lighting up
- Pricing with a monthly and annual toggle, a sticky comparison table (tabs on tablet and phone) and an FAQ
- Testimonials on an endless vertical ticker over an animated WebGL line field
- A closing call to action whose image is rebuilt from 45,000 particles the cursor can push and fling
- About page with a logo ticker, a pinned "rules" row and a team switcher with spring motion
- Blog with category tabs, a hover accordion of recent posts, and Markdown articles with callouts, numbered steps and figures
- Contact form with sending, sent and error states
- A WebGL shard field on the 404: the stream parts around the cursor, clicks send shockwave rings, press and hold gathers the shards into a cloud
- Honours `prefers-reduced-motion`; every page reads correctly with JavaScript off
- Figtree, Fragment Mono and Climate Crisis, self-hosted through Fontsource

## Getting started

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serves dist/
```

## Next.js version

`next/` is the same site as a Next.js 16 app (App Router, React 19, static export): server components that render the same markup, the same behaviour modules, the same content files. See [`next/README.md`](next/README.md).

```sh
cd next
npm install
npm run dev      # http://localhost:3000
npm run build    # outputs to out/
```

`next/` is generated from this Astro source by `tools/astro-to-next.mjs` and `tools/collect-css.mjs`, so the two never drift. Use either one on its own; you do not need both.

## Pages

| Route | What it is |
| --- | --- |
| `/` | hero, what changes, how it works, pricing, testimonials, FAQ, latest posts |
| `/about` | story, logos, rules, team |
| `/pricing` | plans, comparison table, FAQ |
| `/blog` | featured post, category tabs, post grid |
| `/blog/[slug]` | one page per file in `src/content/blog/` |
| `/contact` | contact form and next steps |
| `/terms`, `/privacy` | legal pages |
| `/404` | not found |

The closing call to action and footer appear on every page except the 404.

## Editing content

- `src/content/site.json`: navigation, closing call to action and footer.
- `src/content/pages/*.json`: the copy for each page, one file per page.
- `src/content/plans.json`: plans, prices (monthly and annual) and features, shared by the home and pricing pages.
- `src/content/blog/*.md`: one file per post; the filename is the URL. The frontmatter holds the card fields (title, category, date, read time, excerpt, cover, author). The body is Markdown: a blockquote whose first line is bold becomes a callout, an ordered list becomes numbered steps, and `<figure class="figure">` draws a bar chart. The schema in `src/content.config.ts` fails the build on a typo.
- Images live in `public/assets/`.
- Colours and the type scale are custom properties in `src/styles/tokens.css` and `src/styles/global.css`. Each component keeps its own styles.

## Project structure

```
src/
  components/        Nav, Footer (CTA + footer), StoreBadge
    sections/        one component per page section
    blog/            post meta and badges
    ui/              Button, Icon, ContactSubmit
  content/           site.json, plans.json, pages/, blog/
  icons/             SVG icons
  layouts/Base.astro head, nav, footer, scripts
  lib/               blog helpers, links
  pages/             routes
  scripts/entry.js   loads each effect on demand from data-fx="name"
  scripts/fx/        one module per behaviour
  styles/            tokens.css, global.css
next/                the Next.js version of the same site
```

## Environment variables

All optional and off by default. See `.env.example`.

| Variable | Effect |
| --- | --- |
| `PUBLIC_FORM_ENDPOINT` | URL the contact form posts to (Formspree, Basin, your own API). Unset, the form only shows its states. |
| `PUBLIC_VERCEL_ANALYTICS` | `true` loads Vercel Web Analytics and Speed Insights |
| `PUBLIC_STORE_BADGE` | `true` shows the fixed store badge in the corner |

## Deploy

Any static host works: build with `npm run build` and publish `dist/`. On Vercel or Netlify, import the repository and keep the defaults. Set `site` in `astro.config.mjs` to your domain so canonical URLs and social images point at it.

## Licence

MIT, see `LICENSE`. Every effect is original code with no runtime dependencies.

Fonts: Figtree, Fragment Mono and Climate Crisis, SIL Open Font License 1.1.
