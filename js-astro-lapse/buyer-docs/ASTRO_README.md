# Lapse for Astro

A static Astro 7 site. Node 22.12 or later.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
```

## Where things are

| What | File |
| --- | --- |
| Blog posts | `src/content/blog/*.md` (the file name is the URL; schema in `src/content.config.ts`) |
| Page copy | `src/content/pages/*.json`, one file per page |
| Menu, closing call to action, footer | `src/content/site.json` |
| Plans and prices | `src/content/plans.json` |
| Colours, type scale | `src/styles/tokens.css`, text styles in `src/styles/global.css` |
| Fonts | Fontsource packages, imported in `src/layouts/Base.astro` |
| Images | `public/assets/` |
| Pages | `src/pages/` |
| Sections | `src/components/sections/` |
| Menu, footer | `src/components/Nav.astro`, `src/components/Footer.astro` |
| Head tags and page shell | `src/layouts/Base.astro` |
| Motion | `src/scripts/fx/*.js`, mounted by `data-fx="<name>"` |

In a blog post, a blockquote whose first line is bold becomes a callout, an ordered list becomes numbered steps, and `<figure class="figure">` draws a bar chart (see `what-2-4-million-support-messages-look-like.md`).

Set your domain as `site` in `astro.config.mjs`: canonical URLs, social images, the sitemap and `robots.txt` are built from it.

## Environment variables

All optional, all off by default.

| Variable | Effect |
| --- | --- |
| `PUBLIC_FORM_ENDPOINT` | URL the contact form posts to. Unset, the form only shows its states. |
| `PUBLIC_VERCEL_ANALYTICS=true` | Loads Vercel Web Analytics and Speed Insights. |
| `PUBLIC_GA_ID=G-XXXX` | Loads Google Analytics. |

## Deploy

Any static host. On Vercel or Netlify, import the folder: the build command is `npm run build` and the output is `dist/`.
