<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [free small business starter](https://github.com/alancuenca/small-business-starter) Astro theme by alancuenca, copied from commit `be9caba443875dc8e5beeaacd8e90d9d92e1d117` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-small-business-starter.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
- **Environment variables:** None.
- **Credit:** theme by [alancuenca](https://github.com/alancuenca), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Small Business Starter

A fast, mobile-first website template for trade and service businesses — handymen, electricians, plumbers, landscapers, and more. Built with [Astro 6](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com). Ready to deploy on [Netlify](https://netlify.com) in minutes.

---

## What's included

- Full homepage with Hero, Trust Bar, Services, About, Reviews, Gallery, and CTA sections
- Inner pages: About, Services, Contact (with Netlify Forms), Reviews, Blog
- SEO-ready: `<title>`, meta descriptions, canonical URLs, Open Graph, JSON-LD structured data, sitemap, robots.txt
- Mobile-first responsive layout with a hamburger drawer nav and sticky desktop header
- Astro View Transitions for smooth page navigation
- Google Fonts (Oswald + Inter) optimized via Astro's built-in font API
- Tailwind v4 design token system — swap the entire brand with two file edits

---

## Quick start

```bash
# 1. Install dependencies (uses pnpm)
pnpm install

# 2. Start the dev server
pnpm run dev
# → http://localhost:4321

# 3. Build for production
pnpm run build

# 4. Preview the production build locally
pnpm run preview
```

> **Note:** This project uses `pnpm`. Do not use `npm install` or `yarn` — they will create a conflicting lockfile.

---

## Customising for a client — start here

All placeholder content lives in exactly **two files**. You do not need to touch any component or page files to swap out a client's information.

### Step 1 — Business data: `src/data/client.ts`

Open this file and replace every placeholder value with the real business information.

```ts
export const client = {
  name: 'Your Business Name',         // Used in the header, footer, and SEO
  email: 'hello@yourbusiness.com',
  phoneForTel: '303-555-0100',        // Format: digits and hyphens only (used in tel: links)
  phoneFormatted: '(303) 555-0100',   // Format: however you want it displayed
  license: 'Lic# 123456',            // Contractor license number — leave empty '' to hide
  address: {
    lineOne: '123 Main Street',
    lineTwo: 'Suite 100',             // Leave empty '' if no suite/unit
    city: 'Denver',
    state: 'CO',
    zip: '80206',
    country: 'US',
    mapLink: 'https://maps.app.goo.gl/your-link', // Google Maps link to the business
  },
  socials: {
    facebook:  'https://facebook.com/yourbusiness',   // Leave empty '' to hide the icon
    instagram: 'https://instagram.com/yourbusiness',  // Leave empty '' to hide the icon
    google:    'https://g.page/yourbusiness',          // Google Business Profile link
  },
  domain: 'https://www.yourdomain.com',
};
```

This data flows automatically into the header, footer, contact page, and all SEO tags. You never need to search-and-replace a phone number across multiple files.

---

### Step 2 — Visual identity: `src/config/brand.ts`

This controls the site name, tagline, colors, and fonts.

```ts
export const brand = {
  name: 'Your Business Name',
  tagline: 'Professional service you can trust.',
  description: 'A short sentence used as the default SEO meta description.',
  url: 'https://www.yourdomain.com',  // Must match client.domain

  fonts: {
    body: 'Inter',      // Google Fonts name for body text
    display: 'Oswald',  // Google Fonts name for headings
  },

  colors: {
    primary:    '#1B3A6B',  // Main brand color (nav, buttons, headings)
    primaryFg:  '#ffffff',  // Text color on top of primary backgrounds
    accent:     '#F97316',  // CTA buttons, highlights
    // ... see file for full list
  },
};
```

> **After changing colors** you must also update the matching hex values in `src/styles/theme.css` inside the `@theme { }` block. The variable names there correspond 1-to-1 with the keys in `brand.colors`.
>
> **After changing fonts** you must also update `astro.config.mjs` — find the `fonts:` array and change the `name` field to match your new Google Font name.

---

## Project structure

```
small-business-starter/
├── public/                     # Static files served as-is (favicon, og-image.png)
├── src/
│   ├── components/             # Reusable UI sections
│   │   ├── Header.astro        # Sticky nav with mobile hamburger drawer
│   │   ├── Footer.astro        # Dark footer with columns and social links
│   │   ├── Hero.astro          # Homepage hero with dual CTA
│   │   ├── TrustBar.astro      # Trust signals strip (years, reviews, guarantee)
│   │   ├── Services.astro      # Services grid
│   │   ├── About.astro         # About section with benefits list
│   │   ├── Reviews.astro       # Customer testimonials grid
│   │   ├── Gallery.astro       # Project photo grid with skeleton loading
│   │   ├── CTA.astro           # Full-bleed call-to-action section
│   │   └── Banner.astro        # Inner-page hero with auto breadcrumbs
│   ├── config/
│   │   └── brand.ts            # ✏️  Visual identity (colors, fonts, tagline)
│   ├── content/
│   │   └── blog/               # ✏️  Markdown blog posts (.md files)
│   ├── data/
│   │   └── client.ts           # ✏️  Business info (phone, address, socials)
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Master HTML shell (SEO, fonts, skip link)
│   │   └── PostLayout.astro    # Blog post layout
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── reviews.astro
│   │   ├── contact/
│   │   │   ├── index.astro     # Contact form (Netlify Forms-ready)
│   │   │   └── success.astro   # Confirmation page after form submit
│   │   └── blog/
│   │       ├── index.astro     # Blog listing
│   │       └── [...slug].astro # Individual post pages (auto-generated)
│   └── styles/
│       ├── global.css          # Base styles, dark mode, reduced motion
│       └── theme.css           # Tailwind v4 @theme design tokens
├── astro.config.mjs            # Astro config (fonts, integrations, site URL)
├── netlify.toml                # Netlify build + security headers config
└── package.json
```

Files marked ✏️ are the ones you will edit most often.

---

## Replacing placeholder images

The theme ships with placeholder photos from Unsplash so it looks great immediately. To replace them with a client's real photos, edit **one file**: `src/config/images.ts`.

### Folder structure

```
src/assets/images/
  hero/        ← one image for the homepage Hero section
  about/       ← one image for the About section
  gallery/     ← all project photos (add as many as you like)
```

Images in `src/assets/` are processed by Astro at build time — they are automatically converted to modern formats (WebP/AVIF), resized, and given proper `srcset` attributes. This is significantly better than using external URLs.

### Hero and About images

1. Drop your image file into the matching folder (`hero/` or `about/`)
2. Open `src/config/images.ts` and find the section for that image
3. Uncomment the `import` line and update the filename:

```ts
// Before (placeholder is used):
// import heroImage from '../assets/images/hero/hero.jpg';
export const heroImage: ImageMetadata | undefined = undefined;

// After (your local image is used):
import heroImage from '../assets/images/hero/hero.jpg';
export const heroImage = heroImage;
```

### Gallery images — drop and done

The gallery uses automatic file discovery. You do not need to edit any code:

1. Delete the placeholder `.gitkeep` file from `src/assets/images/gallery/`
2. Drop your project photos into `src/assets/images/gallery/`
3. Run `pnpm run build` — your images appear automatically

**The filename becomes the caption.** Name your files descriptively:

```
kitchen-remodel.jpg       → "Kitchen Remodel"
deck-installation.jpg     → "Deck Installation"
bathroom-tile-work.jpg    → "Bathroom Tile Work"
```

Recommended image specs:

| Section | Min size | Aspect ratio |
|---|---|---|
| Hero | 1600 × 1200 px | 4:3 landscape |
| About | 900 × 700 px | 4:3 landscape |
| Gallery | 800 × 600 px each | 4:3 landscape |

Supported formats: `.jpg` `.jpeg` `.png` `.webp` `.avif`

---

## Writing blog posts

Blog posts live in `src/content/blog/` as Markdown files. Create a new `.md` file and add the required frontmatter at the top:

```md
---
title: "5 Signs You Need a New Roof"
description: "A short summary shown on the blog listing and in search results."
author: "Jane Smith"
date: 2026-04-01
tags: ["roofing", "maintenance"]
draft: false
---

Your post content goes here. Standard Markdown is supported.
```

The filename becomes the URL slug. Keep it lowercase with hyphens:
- `how-to-prepare-for-a-plumbing-inspection.md` → `/blog/how-to-prepare-for-a-plumbing-inspection`

Set `draft: true` to write a post without publishing it.

---

## Deploying to Netlify

1. Push the project to a GitHub repository
2. In Netlify, click **Add new site → Import an existing project** and connect the repo
3. Netlify will auto-detect the build settings from `netlify.toml` — no manual config needed
4. Set your live domain in two places after deploying:
   - `src/data/client.ts` → `domain`
   - `src/config/brand.ts` → `url`
   - `astro.config.mjs` → `site`

The `netlify.toml` file already includes security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.) and immutable caching for hashed assets.

---

## Tech stack

| Tool | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 6 | Framework & static site generator |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [Netlify](https://netlify.com) | — | Hosting, forms, CDN |
| [pnpm](https://pnpm.io) | 9+ | Package manager |

---

## Commands reference

| Command | What it does |
|---|---|
| `pnpm install` | Install all dependencies |
| `pnpm run dev` | Start dev server at `localhost:4321` |
| `pnpm run build` | Build the production site to `./dist/` |
| `pnpm run preview` | Preview the production build locally |
| `pnpm run astro check` | Type-check all `.astro` files |

---

## License

This project is open source under the [MIT License](./LICENSE.md).
