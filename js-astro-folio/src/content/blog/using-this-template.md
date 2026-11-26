---
title: Using this template
description: How to make this Astro portfolio template your own in about fifteen minutes.
date: 2026-06-22
tags:
  - Guide
---

Welcome. This is a portfolio template built with Astro. Everything personal lives in one config file and a couple of content folders, cleanly separated from the components, so you can make it yours without touching the layout code. This post is your walkthrough. It should take about fifteen minutes.

## 1. Run it locally

You need [Node](https://nodejs.org) 22 or newer and [pnpm](https://pnpm.io). Run `corepack enable` once if you do not have pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321`. Edits hot-reload as you save.

## 2. Your details and copy

Open **`site.config.ts`**. It is the single source of truth: your name, title, contact details, social links, navigation, the two brand colours, and all the page copy (home, about, skills, contact). Replace every value, then scroll down to the `content` object and rewrite the words in your own voice.

## 3. Your work

Each project is one markdown file in **`src/content/projects/`**. Delete the three examples and add your own. The filename becomes the URL, so `acme.md` lives at `/work/acme`. The frontmatter is validated, so a typo fails the build instead of shipping something broken:

```md
---
title: Acme Dashboard
oneLiner: A real-time dashboard for logistics teams.   # shown on cards
summary: A one or two sentence intro for the project page.
role: Lead engineer
period: 2024 – present
order: 1                 # lower sorts first
tags: [TypeScript, React, PostgreSQL]
featured: true           # surfaces it on the home page
links:
  - label: Live
    url: https://example.com
---

Write the case study here in normal markdown.
```

## 4. Posts

Blog posts work the same way: markdown files in **`src/content/blog/`**. This post is one of them. Keep it, edit it, or delete it and write your own.

## 5. Photo, CV and contact form

- Replace **`src/assets/portrait.jpeg`** with a square photo (around 800x800). Keep the filename and there is no code to change; it is optimised automatically.
- Replace **`public/cv.pdf`** with your own CV, keeping the filename.
- For the contact form, create a free form at [Formspree](https://formspree.io), copy the id from the endpoint (`https://formspree.io/f/xxxxxxxx`), and paste it into `formspreeId` in `site.config.ts`. While it is empty, the contact page shows an email button instead, so the site still works.

## 6. Re-theme

The look is driven by two colours. The quick swap is in `site.config.ts`:

```ts
brand: {
  primary: "#34492e", // surfaces, headings
  accent: "#d8aa2f",  // your name, links, highlights
}
```

The full palette and the light and dark variants live in `src/styles/global.css`, under Tailwind v4's `@theme` block. Change the values there to re-brand properly, and keep `site.config.ts` in sync for the browser theme colour.

## 7. Deploy

The site builds to static files, so it hosts anywhere. On [Cloudflare Pages](https://pages.cloudflare.com), set the build command to `pnpm build`, the output directory to `dist`, and `NODE_VERSION` to `22`. Set your real domain in `astro.config.mjs` (`site:`) first, so the canonical links and sitemap are correct. The same build also deploys to Vercel, Netlify or GitHub Pages.

That is everything. The components are small and readable, so have a look around if you want to go further. Good luck with your portfolio.
