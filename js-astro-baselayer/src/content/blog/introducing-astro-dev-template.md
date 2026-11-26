---
title: 'Introducing Astro Dev Template'
description: 'A design-token-driven Astro 6 starter for dark-mode dashboards, blogs, and product showcases — powered by Tailwind CSS v4, Svelte 5, and Basecoat UI.'
pubDate: 'May 06 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
featured: true
---

**TL;DR** &mdash; A batteries-included Astro 6 starter that ships static HTML by default, hydrates Svelte 5 islands on demand, and enforces a single source of truth for design tokens via Tailwind v4 and Basecoat UI. Zero runtime JavaScript for content pages, typed Content Collections, Expressive Code, RSS, sitemap, and Cloudflare Pages deploy ready out of the box.

Modern web development often forces a choice between developer experience and runtime performance. Astro 6 eliminates that trade-off by delivering zero-JavaScript-by-default pages with the flexibility to sprinkle interactivity only where it is needed. This template wraps that philosophy into a ready-to-deploy starter, opinionated enough to ship today and flexible enough to grow with your project.

## Why this stack

Astro 6 serves as the foundation. It compiles to static HTML, which means faster first paints, lower hosting costs, and fewer runtime surprises. When you do need reactivity — a filtered project grid, a tabbed interface, or a mobile navigation drawer — you drop in an island of Svelte 5 component logic and hydrate it selectively. The rest of the page stays lean static markup.

Tailwind CSS v4 brings the styling layer. The color palette, spacing scale, typography, and shadow tokens are declared once in `DESIGN.md` and mapped one-to-one into Tailwind's `@theme` block inside `global.css`. That guarantees a single source of truth for every design decision. No arbitrary utility values, no guesswork, no drift between mockups and production.

Basecoat UI closes the gap between raw Tailwind utilities and fully styled components. It is a HTML-first component library — think buttons, cards, badges, inputs, and tabs — designed to layer cleanly on top of Tailwind without pulling in React or Vue. It ships the aesthetic density of a dashboard UI kit while keeping the bundle size minimal.

## What is included

Content Collections give you typed frontmatter for blog posts and portfolio projects. Schema validation runs at build time, so a missing title or malformed date fails early and loudly instead of silently breaking a page.

Expressive Code renders fenced code blocks with automatic syntax highlighting, diff annotations, and line numbers — all zero-config because Astro integrates it out of the box.

RSS feeds, sitemaps, and Open Graph meta tags are generated automatically from your content. Cloudflare Pages deployment is pre-configured via `wrangler.toml`, so pushing to a branch can trigger a production build in under a minute.

## Project structure

The template keeps a flat, predictable layout.

```
├── public/               # Static assets
├── src/
│   ├── assets/           # Images processed by Astro
│   ├── components/       # Astro + Svelte UI components
│   ├── content/          # Markdown / MDX collections
│   ├── layouts/          # Page layouts
│   ├── pages/            # File-based routes
│   └── styles/           # Tailwind theme + Basecoat imports
├── DESIGN.md             # Design system spec
├── astro.config.mjs
└── wrangler.toml
```

Everything lives in `src/` except for truly static files that bypass the build pipeline. Components intended for Storybook live in `src/components/ui/` as Svelte 5 files, while page-level fragments stay as `.astro` files. That split mirrors the Astro philosophy: server-rendered shells with interactive islands injected only where necessary.

## Getting started

```bash
git clone https://github.com/baflow/baselayer.git my-site
cd my-site
npm install
npm run dev
```

The dev server starts at `localhost:4321`. When you are ready to ship, `npm run build` outputs a static `dist/` folder that you can preview locally or upload to Cloudflare Pages, Vercel, or Netlify.

## Customizing the design system

Open `DESIGN.md` first. It defines the neutral palette, primary and secondary greens (`#437652` and `#8DA696`), surface shadows, and type scale. These tokens feed directly into `@theme` inside `src/styles/global.css`. Change a token in one place and the entire UI updates consistently — from badges to hero sections to form inputs.

Fonts are loaded via Astro's built-in font optimization: Inter for body copy and Newsreader for display headings. They are referenced in Tailwind as `font-sans` and `font-serif` respectively.

## Deploying

A `wrangler.toml` is included for Cloudflare Pages. Run `npm run deploy` when your Cloudflare account is authenticated, or connect the repository to a Pages project for automatic deploys on every push.

If you prefer Vercel or Netlify, the one-click deploy badges in the README handle the repository import and build configuration without any manual file editing.

## License

MIT — free for personal and commercial use.
