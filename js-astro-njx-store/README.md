<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [astro-njx-store](https://github.com/njbSaab/astro-njx-store) Astro theme by njbSaab, copied from commit `d6958acac6b44b9f61da76326809fdcaff73156a` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-njx-store.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 3 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** The theme's example env file lists `COMMERCE_PROVIDER`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [njbSaab](https://github.com/njbSaab), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# njx-store — free ecommerce theme for Astro

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/njbSaab/astro-njx-store) [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/njbSaab/astro-njx-store)

> Part of **[njX Astro Themes](https://njxui.dev/themes)** — ecommerce storefronts & landing pages by one author, free today, Pro versions on the way.

A complete, ready-to-ship online store built with **Astro 5 + Tailwind CSS v4**, wired for
**Shopify** out of the box and deployable to **Cloudflare Pages** (or any static host) in minutes.

**Live demo → [astro-njx-store.pages.dev](https://astro-njx-store.pages.dev)**
Everything in the demo — cart, checkout, search, favorites, dark mode — is this theme running on mock data.

![njx-store home page](submit-assets/home.png)

## What is this?

njx-store is a **static storefront**: Astro renders every page to plain HTML at build time,
so the site is fast by default and hosting is essentially free. Product data comes from a
pluggable provider — start with the bundled JSON catalog, then flip one environment variable
and the same pages build from your **real Shopify store**, with Shopify's hosted checkout
handling payments.

Use it when you want a fast custom storefront without running a server, paying for a
heavyweight theme, or building cart logic from scratch.

## Features

- 🛍 **Full store flow** — home, collections with client-side filters & sorting, product pages
  with variants, gallery + lightbox, related products
- 🛒 **Working cart** — persistent (localStorage), quick-add from product cards, quantity
  controls, line remove, clear all; hands off to Shopify's hosted checkout
- 🔌 **Two data providers, one switch** — `COMMERCE_PROVIDER=mock` (bundled JSON, no accounts
  needed) or `shopify` (live products over the Storefront API)
- 🔎 **Instant search** — inline index, opens with `/`, zero network requests
- ❤️ **Favorites** — heart any product, badge counter, dedicated `/favorites` page
- 🌗 **Light & dark theme** — one click, no flash on reload
- 📄 **18 pages total** — about, contacts, FAQ, account (sign in / create account UI),
  privacy, terms, honest 404
- 📱 **Responsive** — floating card header/footer, drawer cart & menu on mobile
- 📝 **All copy in two constants files** — rebrand every text on the site without touching markup
- ⚡️ **Zero client framework** — a few small vanilla scripts; no React/Vue/hydration cost

| Light | Dark |
| --- | --- |
| ![Light theme](submit-assets/collection.png) | ![Dark theme](submit-assets/dark.png) |

## Quick start

```bash
git clone https://github.com/njbSaab/astro-njx-store.git my-store
cd my-store
npm install
cp .env.example .env        # defaults to the mock catalog
npm run dev                 # http://localhost:4321
```

That's it — the store runs on the bundled demo catalog (`src/data/mock-catalog.json`).
Edit that file to see your own products immediately.

## Connect your Shopify store

1. In Shopify admin: **Settings → Apps and sales channels → Develop apps → Create an app.**
2. Give it the *Storefront API* scopes (unauthenticated read products/collections/checkouts).
3. Install the app and copy the **Storefront API access token** (this token is public-safe).
4. Update `.env`:

```bash
COMMERCE_PROVIDER=shopify
PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxx
```

5. `npm run build` — the same pages now build from your live catalog, and the cart button
   creates a real Shopify cart and redirects to your hosted checkout.

The provider interface lives in `src/lib/commerce/` — adding WooCommerce, Medusa or your own
API means implementing one small TypeScript interface.

## Deploy

Any static host works. For Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist --project-name my-store
```

Set the same env vars in your host's dashboard for CI builds. The whole store fits
comfortably in Cloudflare's free tier.

## Make it yours

- **All copy in two files** — every piece of text on the site lives in
  `src/constants/components.ts` (header, footer, drawers, cart, search) and
  `src/constants/pages.ts` (home, about, FAQ, product page, …). Rebrand the whole store —
  name, links, announcements, FAQ answers, legal pages — without touching a single component.
- **Brand & colors** — design tokens in `src/styles/global.css` (`@theme` block, dark
  overrides in `.dark`). Swap the two logo files in `public/logo/`.
- **Catalog** — `src/data/mock-catalog.json` + photos in `public/products/`, or connect Shopify.
- **Layout & sections** — plain `.astro` files: header/footer/drawers in
  `src/layouts/Layout.astro`, one file per page in `src/pages/`.

## Project structure

```
src/
├── constants/
│   ├── components.ts           # all copy for the shell: header, footer, cart, search…
│   └── pages.ts                # all copy per page: home, about, FAQ, legal…
├── data/mock-catalog.json      # demo products & collections
├── layouts/Layout.astro        # header, footer, cart/nav drawers, search
├── components/ProductCard.astro
├── lib/
│   ├── commerce/               # provider interface + mock & shopify implementations
│   ├── cart.ts                 # persistent cart (nanostores)
│   └── favorites.ts            # persistent favorites
└── pages/                      # index, collections/, products/, about, faq, …
```

## Lite vs Pro

This is **njx-store Lite** — free, MIT-licensed, complete and production-usable.
**Pro** (extended sections, more page templates and priority support) is on the way —
[watch the repo](https://github.com/njbSaab/astro-njx-store) to get notified.

## Credits

Made by [njX](https://njxui.dev) — also the author of [njx-ui](https://njxui.dev), a
classless-friendly CSS library for landings. Product photos: [Unsplash](https://unsplash.com).

If this theme saves you time, a ⭐️ on GitHub genuinely helps it reach more people.
