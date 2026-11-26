<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Wellness](https://github.com/Domenico-Tenace-Open-Labs/astro-wellness) Astro theme by Domenico-Tenace-Open-Labs, copied from commit `5d7b7915928e9d8c50831bf112e96f9b0111d07c` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-wellness.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [Domenico-Tenace-Open-Labs](https://github.com/Domenico-Tenace-Open-Labs), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Wellness — Gym Template

A modern, dark, energetic **gym template** built with [Astro](https://astro.build)
and [Bulma](https://bulma.io). It ships with a full set of pages, an SEO-ready
head, a Markdown blog, and clean, typed sample content — ready to adopt for your
own gym, studio, or training brand.

## Features

- **Pages**: Home (hero, stats, services, testimonials), About, Services (with
  pricing plans), Blog, Contact, plus a custom 404 page
- **SPA page transitions**: `<ClientRouter />` gives client-side navigation
  with a soft fade — and respects `prefers-reduced-motion`
- **Dark / light mode**: Bulma's built-in themes, switched from the navbar,
  persisted in `localStorage`, and honoring the OS `prefers-color-scheme` on
  first visit (applied before first paint, re-applied after SPA navigation)
- **Blog via Content Collections**: typed frontmatter schema, listing page,
  individual posts, and an auto-generated **RSS feed**
- **SEO**: per-page title/description, canonical URLs, Open Graph, JSON-LD
  structured data (`HealthClub` on the home page, `BlogPosting` on posts),
  sitemap, and `robots.txt`
- **Accessible**: semantic markup, skip-to-content link, keyboard-navigable
  mobile menu, visible focus states, `prefers-reduced-motion` support,
  `aria` where needed
- **Responsive & fast**: mobile-first Bulma layout imported module-by-module
  (no unused Bulma components), zero client-side framework, tiny delegated
  scripts, and Inter loaded non-blocking — everything renders fast
- **Strict TypeScript**: every component has typed props, content schema is validated

## Requirements

- Node.js **>= 22.22.0** (Astro 7 minimum)
- pnpm 10+

This project uses **pnpm** exclusively. Do not use npm or yarn.

```sh
pnpm install
```

## Live demo

A live demo is the second thing reviewers look at on astro.build. Deploy the
built `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub
Pages) and link it here. `public/_headers` ships Netlify-compatible security
headers out of the box.

## Commands

| Command          | Action                                       |
| :--------------- | :------------------------------------------- |
| `pnpm dev`       | Start the dev server at `localhost:4321`     |
| `pnpm build`     | Build the production site to `./dist/`        |
| `pnpm check`     | Type-check the project (Astro + TypeScript)   |
| `pnpm preview`   | Preview the production build locally         |

Run the dev server in the background with `pnpm astro dev --background`
(manage it with `astro dev stop | status | logs`).

## Pages

| Route        | Description                                             |
| :----------- | :------------------------------------------------------ |
| `/`          | Home: hero, stats, featured services, testimonials, latest articles, CTA |
| `/about`     | About: story, values, and coaches                       |
| `/services`  | Services grid + three membership plans                  |
| `/blog`      | Blog listing (newest first)                             |
| `/blog/[slug]` | Individual post with reading time and tags             |
| `/contact`   | Contact details and a form                              |
| `/rss.xml`   | Auto-generated RSS feed for blog posts                  |
| `/404`       | Custom not-found page (returned by any static host)     |

## Project structure

```text
/
├── public/                 # Static files served as-is (favicons, og-image, robots.txt, _headers)
├── src/
│   ├── assets/styles/      # Bulma customisation + project styles (main.scss)
│   ├── components/         # Reusable components (NavBar, PageHero, cards, CTA…)
│   ├── content/
│   │   ├── blog/           # Markdown blog posts (add new posts here)
│   │   └── content.config.ts  # Blog schema (Content Collections)
│   ├── data/               # Site metadata, services, team, pricing, testimonials
│   ├── layouts/            # BaseLayout with SEO-ready document head + ClientRouter
│   ├── pages/              # Routes: index, about, services, blog, contact, 404, rss
│   └── utils/              # Date, reading-time and phone helpers
├── astro.config.mjs
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE                # MIT
├── SECURITY.md
└── package.json
```

## Styling

Bulma is loaded through `src/assets/styles/main.scss`, where the design tokens
(primary colour, background, text, input colours) are passed to Bulma with Sass
`@use`. Project-specific classes are prefixed with `aw-` and live in the same
file, separate from Bulma component rules. Bulma's own utility and layout
classes are used wherever possible.

The template uses a **dark theme with an orange accent**, plus an adaptive light
theme. All tokens live in two places:

1. The Bulma `@use` block at the top of `main.scss` (component-level variables)
2. The `:root` / `[data-theme='light']` custom properties (`--aw-*`) used by the
   `aw-` classes — the light theme flips every token automatically

Change the accent or background in both places to re-theme the whole site. On
first visit the theme follows the OS `prefers-color-scheme`; the navbar toggle
persists the choice in `localStorage`. This is handled by the inline head script
in `src/layouts/BaseLayout.astro` and re-applied on `astro:page-load` so it
survives SPA navigation.

## Customisation guide

1. **Site identity** — edit `src/data/site.ts`: name, tagline, description,
   email, phone, address, and `url` (keep it in sync with `astro.config.mjs`).
2. **Navigation** — add or remove entries in `navItems` in `src/data/site.ts`.
3. **Services / team / pricing / testimonials** — edit the matching files in
   `src/data/`.
4. **Blog** — add `.md` files under `src/content/blog/` with frontmatter
   `title`, `description`, `pubDate`, and optional `tags`/`updatedDate`.
   The listing and RSS feed update automatically.
5. **Logo & favicons** — replace `public/favicon.svg` (and `.ico`) with your own
   mark; the navbar uses a small inline SVG dumbbell in `NavBar.astro`.
   `og-image.png` is the social share image (1200×630; `og-image.svg` is its
   editable source). Swap in real photos anytime — they are not required for
   the layout to look complete.
6. **Contact form** — the site is fully static, so the form validates in the
   browser and opens the visitor's email client with the message pre-filled,
   addressed to `site.email`. Replace it with a form endpoint (e.g. Formspree,
   Netlify Forms, or your own API) for a real backend.
7. **SEO before deploy** — set `site` in `astro.config.mjs` to your real domain,
   update the `Sitemap` URL in `public/robots.txt`, and regenerate/overwrite
   `og-image.png` with your own branding.

## Deploying

`pnpm build` produces a static site in `dist/` that can be hosted on any static
host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.). `public/_headers`
applies Netlify-compatible security headers (CSP, HSTS, X-Frame-Options…);
other hosts may ignore it — set equivalent headers there.

## Publishing to astro.build/themes

The template is ready for the [Astro template gallery](https://astro.build/themes/).
Before submitting:

1. Create a **repository from this template** on GitHub and push the code.
2. Set repo **topics**: `astro`, `bulma`, `template`, `typescript`, plus any
   niche tags (e.g. `gym`, `hacktoberfest`).
3. Deploy the demo (Netlify, Vercel, …) and add the **live demo link** to the
   [Live demo](#live-demo) section above.
4. Keep the `LICENSE` (MIT) and point `repo` metadata in `package.json` at the
   new repository.
5. Submit the repo through the astro.build themes form.
