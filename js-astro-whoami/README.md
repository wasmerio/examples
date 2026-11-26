<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Whoami](https://github.com/asivura/astro-whoami) Astro theme by asivura, copied from commit `d523f9ac99b7f3db5465cf1bf7b188914b5531b8` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-whoami.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [asivura](https://github.com/asivura), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro-whoami

A minimal, text-forward, AI-agent-friendly personal website template built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

[Live Demo](https://astro-whoami.sivura.com) | [Use This Template](https://github.com/asivura/astro-whoami/generate)

Inspired by [leerob.com](https://leerob.com) and [danielmiessler.com](https://danielmiessler.com).

## Features

- **Minimal, text-forward design** with serif typography and generous whitespace
- **Two themes**: light and dark with system preference detection
- **AI-agent friendly**: semantic HTML, JSON-LD structured data on every page, RSS feed, sitemap
- **Blog** with markdown content collections and typed frontmatter
- **Projects** page with tech stack tags
- **About** page for your bio and experience
- **100 Lighthouse score** target across all categories
- **Zero JavaScript frameworks** shipped to the browser (pure Astro components)

## Quick Start

```bash
# Create a new project from the template
npm create astro@latest -- --template asivura/astro-whoami

# Or clone directly
git clone https://github.com/asivura/astro-whoami.git my-site
cd my-site
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to see your site.

## Customization

Edit `src/site.config.ts` to personalize the template. This is the only file you need to change to make the site yours:

```typescript
export const siteConfig = {
  name: "Your Name",
  title: "Your Name",
  description: "Your tagline.",
  url: "https://yourdomain.com",

  author: {
    name: "Your Name",
    email: "you@example.com",
    avatar: "/images/avatar.jpg",
  },

  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://x.com/yourusername",
  },

  // ... see file for all options
}
```

## Adding Content

### Blog Posts

Create a markdown file in `src/data/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description."
pubDate: 2025-01-15
tags: ["topic"]
---

Your content here.
```

### Projects

Create a markdown file in `src/data/projects/`:

```markdown
---
title: "Project Name"
description: "What the project does."
techStack: ["Astro", "TypeScript"]
url: "https://project-url.com"
repo: "https://github.com/you/project"
sortOrder: 1
status: "active"
period: "2025 - Present"
---
```

## Theme System

The template supports two themes: **light** (default) and **dark**. Users can toggle between them with the button in the navigation bar.

To customize theme colors, edit the CSS custom properties in `src/styles/global.css`.

## AI-Agent Friendliness

This template is designed to be machine-readable:

- **Semantic HTML5**: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`, `<time>`
- **JSON-LD structured data**: `WebSite`, `Person`, `BlogPosting`, `ProfilePage` schemas
- **Open Graph and Twitter Card** meta tags
- **RSS feed** at `/rss.xml`
- **Sitemap** auto-generated at `/sitemap-index.xml`
- **Permissive robots.txt** that welcomes crawlers
- **Clean URLs**: `/blog/slug`, `/projects`, `/about`
- **ISO-8601 dates** in `<time>` elements

## Deployment

### Cloudflare Pages (Recommended)

See the full [Deploy to Cloudflare](docs/deploy-cloudflare.md) guide for detailed instructions including custom domains.

1. Push your repo to GitHub
2. Go to [Cloudflare dashboard](https://dash.cloudflare.com) > Workers & Pages > Create
3. Connect your repository
4. Set build command: `npm run build`
5. Set build output directory: `dist`

### Vercel

```bash
npx vercel
```

### Netlify

```bash
npx netlify deploy --build
```

## Commands

| Command                | Action                               |
| :--------------------- | :----------------------------------- |
| `npm install`          | Install dependencies                 |
| `npm run dev`          | Start dev server at `localhost:4321` |
| `npm run build`        | Build production site to `./dist/`   |
| `npm run preview`      | Preview production build locally     |
| `npm run lint`         | Lint with ESLint                     |
| `npm run format`       | Format with Prettier                 |
| `npm run format:check` | Check formatting                     |
| `npm run check`        | Type check with Astro                |
| `npm run lint:md`      | Lint markdown files                  |

## Project Structure

```text
astro-whoami/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── site.config.ts          # Edit this to personalize
│   ├── content.config.ts       # Content collection schemas
│   ├── styles/global.css       # Theme variables and typography
│   ├── layouts/                # Base, Page, and Post layouts
│   ├── components/             # Nav, Footer, ThemeToggle, etc.
│   ├── pages/                  # Routes (index, blog, projects, about)
│   └── data/                   # Markdown content (blog, projects)
├── astro.config.ts
├── package.json
└── tailwind.css
```

## Documentation

- [Deploy to Cloudflare](docs/deploy-cloudflare.md) - step-by-step guide to publish your site on Cloudflare Pages
- [Why Astro for Personal Websites](docs/why-astro.md) - justification for choosing Astro over Next.js, Hugo, and others
- [Competitive Analysis](docs/competitive-analysis.md) - how astro-whoami compares to other popular Astro templates

## License

MIT
