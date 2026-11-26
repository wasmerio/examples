<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [small business starter version 2](https://github.com/alancuenca/small-business-starter-v2) Astro theme by alancuenca, copied from commit `6d3b959d10be00b5c009bc6d3902dc02f5927033` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-small-business-starter-v2.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
- **Environment variables:** None.
- **Credit:** theme by [alancuenca](https://github.com/alancuenca), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Small Business Starter

demonstration: https://small-business-starter-v2.netlify.app/

A minimal, fast, and fully customisable website template for small businesses — built with **Astro 7** and **Tailwind CSS v4**.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321` to see your site.

---

## Polishing Checklist

Work through each step below to turn the starter template into a finished, client-ready site.

### Step 1 — Business Information

Open **`src/data/siteData.ts`** — this single file powers the entire site.

| Field | What to update |
|---|---|
| `name` | Your business name |
| `tagline` | Short headline shown in the hero and footer |
| `description` | SEO meta description for search results |
| `license` | License / contractor number (empty string hides it) |
| `email` | Business email (contact page + footer) |
| `phoneForTel` / `phoneFormatted` | Click-to-call phone number |
| `address` | Full address + Google Maps link |
| `hours` | Business hours (contact page sidebar) |
| `emergencyService` | Emergency tagline (empty string hides it) |
| `socials` | Facebook, Instagram, Google links (empty string hides a link) |
| `nav` | Header navigation items — add, remove, or reorder |
| `services` | Service cards (title + description) |
| `reviews` | Customer testimonials (quote, name, location, rating) |
| `about.story` | About page story paragraphs |
| `about.team` | Team member cards (name, role, photo URL) |
| `trustItems` | Homepage trust bar ("Licensed", "15+ Years", etc.) |
| `footerNav` | Footer navigation columns and links |

### Step 2 — Colors & Design Tokens

Open **`src/styles/theme.css`** — this is the single source of truth for colors, border radius, type scale, and spacing. Edit the `@theme` block directly:

| Variable | Controls |
|---|---|
| `--color-primary` | Main brand color (header, buttons, links) |
| `--color-accent` | Accent / highlight color (CTAs, badges) |
| `--color-background` / `--color-surface` | Page and card backgrounds |
| `--color-text` / `--color-text-muted` | Body and secondary text |
| `--color-dark` / `--color-dark-surface` | Footer and dark sections |
| `--radius-*` | Border radius scale (cards, buttons, inputs) |

Tailwind v4 auto-generates utility classes from these variables (`bg-primary`, `text-accent`, `rounded-md`, etc.). No other file needs to be updated when changing colors.

### Step 3 — Site Identity & Fonts

Edit **`src/config/brand.ts`** for your business name, tagline, description, URL, and font names.

To swap fonts, update the font `name` in all three places:

1. **`src/config/brand.ts`** → `fonts.body` and `fonts.display`
2. **`astro.config.mjs`** → `fonts` array (provider, name, weights)
3. **`src/styles/theme.css`** → `@theme inline` fallback stacks

Change the `name` values in all three files to any [Google Fonts](https://fonts.google.com) family.

### Step 4 — Images

Drop your own photos into the folders under `src/assets/images/`:

| Folder | What it's for | Recommendation |
|---|---|---|
| `hero/` | Homepage hero background | Landscape, ≥ 1600 × 1200 px |
| `about/` | About section / page photo | Portrait or square, ≥ 900 × 700 px |
| `gallery/` | Project showcase photos | Landscape 4:3, ≥ 800 × 600 px each |

Then open **`src/config/images.ts`**:
- Uncomment the `import` line for hero and about images and update the filename
- Gallery images are auto-discovered — just drop files into `gallery/` and they appear automatically (the filename becomes the alt text: `kitchen-remodel.jpg` → "Kitchen Remodel")

Placeholder Unsplash URLs are used until you add local files. **Swap them before going live** — remote images are not optimised by Astro.

### Step 5 — Favicon & Open Graph Image

| File | Purpose |
|---|---|
| `public/favicon.svg` | Replace with your logo or brand mark |
| `public/og-image.png` | Social sharing preview image — shown when your site is shared on Facebook, Twitter/X, LinkedIn, iMessage, Slack, etc. |

**Favicon requirements:**

A placeholder `favicon.svg` is included in public folder. Replace it with your own before going live.

- **Size:** exactly **16 × 16 px** (the universally supported favicon size)
- **Format:** SVG
- **File name:** must be `favicon.svg` (or update the default in `BaseLayout.astro`)

**OG image requirements:**

A placeholder `og-image.png` is included in public folder. Replace it with your own before going live.

- **Size:** exactly **1200 × 630 px** (the universally supported OG ratio)
- **Format:** PNG or JPG (PNG for logos/text, JPG for photos)
- **File name:** must be `og-image.png` (or update the default in `BaseLayout.astro`)
- **Content tips:** include your business name, a short tagline, and your logo. Keep key content centered — some platforms crop the edges
- **File size:** aim for under 300 kB; large images may not load in previews
- **Test it:** after deploying, paste your URL into [opengraph.xyz](https://www.opengraph.xyz) or the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to verify the preview looks correct

### Step 6 — Privacy Policy & Terms of Service

Edit the data files in `src/data/`:

- **`src/data/privacy.ts`** — Privacy Policy sections and effective date
- **`src/data/terms.ts`** — Terms of Service sections and effective date

Each file exports an object with the same shape:

```typescript
{
  effectiveDate: 'September 1, 2026',
  sections: [
    {
      heading: 'Section Title',
      content: ['Paragraph one.', 'Paragraph two.'],
    },
  ],
}
```

Add, remove, or reorder sections as needed. The pages at `/privacy` and `/terms` render them automatically.

### Step 7 — Blog Posts

Add or edit Markdown files in `src/content/blog/`. Each post needs frontmatter:

```markdown
---
title: Your Post Title
description: A short description for SEO.
author: Team
date: 2026-03-01
tags: [guides]
draft: false
---

Your post content here.
```

The filename becomes the URL slug. Remove the three starter posts or update them with your own content.

### Step 8 — Site URL & Domain

Update your production domain in **two places**:

1. **`astro.config.mjs`** → `site: 'https://www.yourdomain.com'`
2. **`src/data/siteData.ts`** → `url: 'https://www.yourdomain.com'`

This ensures sitemaps, canonical URLs, Open Graph tags, and JSON-LD structured data all point to the correct domain.

### Step 9 — Deploy to Netlify

1. Push your repo to GitHub
2. Connect it in [Netlify](https://app.netlify.com)
3. Build settings are auto-detected from `netlify.toml`
4. The contact form uses Netlify Forms — no extra configuration needed

---

## Pages

| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` |
| `/services` | `src/pages/services.astro` |
| `/reviews` | `src/pages/reviews.astro` |
| `/contact` | `src/pages/contact/index.astro` |
| `/blog` | `src/pages/blog/index.astro` |
| `/blog/[slug]` | `src/pages/blog/[...slug].astro` |
| `/privacy` | `src/pages/privacy.astro` |
| `/terms` | `src/pages/terms.astro` |

## Editable Data Files

| File | What to edit |
|---|---|
| `src/data/siteData.ts` | Business info, services, reviews, team, hours, navigation |
| `src/data/privacy.ts` | Privacy Policy content |
| `src/data/terms.ts` | Terms of Service content |
| `src/styles/theme.css` | Colors, radius, type scale, spacing |
| `src/config/brand.ts` | Site identity and font names |
| `src/config/images.ts` | Hero, about, and gallery image imports |

## Commands

| Command | Action |
|---|---|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run Playwright tests |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 7 |
| Styling | Tailwind CSS v4 |
| Typography | @tailwindcss/typography |
| SEO | @astrojs/sitemap, astro-robots-txt |
| Testing | Playwright |
| Hosting | Netlify (static) |

## License

[MIT](LICENSE) — free to use, modify, and distribute.
