# Lapse for Next.js

Next.js 16 (App Router, React 19), exported as a static site. Node 20.9 or later.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static site in out/
npm start         # serve out/
```

## Where things are

| What | File |
| --- | --- |
| Blog posts | `src/content/blog/*.md` (the file name is the URL), read by `src/lib/blog-loader.ts` |
| Page copy | `src/content/pages/*.json`, one file per page |
| Menu, closing call to action, footer | `src/content/site.json` |
| Plans and prices | `src/content/plans.json` |
| Colours, type scale, all styles | `src/styles/site.css` (tokens at the top) |
| Fonts | Fontsource packages, imported in `src/app/layout.tsx` |
| Images | `public/assets/` |
| Pages | `src/app/` |
| Sections | `src/components/sections/` |
| Menu, footer | `src/components/Nav.tsx`, `src/components/Footer.tsx` |
| Head tags and page shell | `src/layouts/Base.tsx` |
| Sitemap, robots.txt | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Motion | `src/scripts/fx/*.js`, mounted by `data-fx="<name>"` from `src/app/Scripts.tsx` |

Components are server components that render plain markup. Behaviour is plain DOM JavaScript loaded once on the client, so the pages are complete before any script runs.

In a blog post, a blockquote whose first line is bold becomes a callout, an ordered list becomes numbered steps, and `<figure class="figure">` draws a bar chart (see `what-2-4-million-support-messages-look-like.md`). Posts are rendered with [satteri](https://github.com/bruits/satteri), the Markdown renderer Astro uses, with the same options.

Set your domain in `NEXT_PUBLIC_SITE_URL` (used for canonical URLs, social images, the sitemap and `robots.txt`).

## Environment variables

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your domain, e.g. `https://example.com`. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | URL the contact form posts to. Unset, the form only shows its states. |
| `NEXT_PUBLIC_VERCEL_ANALYTICS=true` | Loads Vercel Web Analytics and Speed Insights. |
| `NEXT_PUBLIC_GA_ID=G-XXXX` | Loads Google Analytics. |

## Deploy

Any static host. On Vercel, import the folder; it detects Next.js. Elsewhere, upload `out/`. URLs end in a slash (`/about/`), as in the Astro build.
