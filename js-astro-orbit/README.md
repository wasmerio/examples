<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Orbit](https://github.com/jagarkarlo/astro-orbit) Astro theme by jagarkarlo, copied from commit `bf6659e1d371243637f3ace9d9b08b548d544633` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-orbit.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [jagarkarlo](https://github.com/jagarkarlo), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Orbit

<p align="center">
  <img src="https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white" alt="Astro">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-3FB950?style=for-the-badge" alt="License">
</p>

A minimalist Astro portfolio template with an interactive orbital relay hero:
a planet limb anchored to the viewport, ground stations on the horizon,
satellites that link to a station only while above it, real constellations, and
a radiant meteor shower.

Static, zero client framework, one config file.

**[Live demo](https://jagarkarlo.github.io/astro-orbit/)**

> **Use this template** — click the green button on GitHub, or
> `gh repo create my-portfolio --template jagarkarlo/astro-orbit`.

## What you get

- Home, about, work, blog, search, contact and 404 pages
- **Project detail pages** at `/work/<slug>/` rendered from Markdown
- **A blog collection** at `/blog/` with per-post pages, drafts and optional
  LinkedIn cross-links
- **Client-side search** over projects and posts, no framework, no service
- **RSS feed** at `/rss.xml`
- **A command console** on `Ctrl+K` / `Cmd+K`
- Sitemap, robots policy, Open Graph tags and Schema.org person metadata
- Light and dark themes with no flash on navigation
- GitHub Pages deployment workflow

## Why this template

Most portfolio templates give you either a clean layout or a showy background.
This one is built so the background is genuinely interesting *and* stays out of
the way of the content:

- **The hero scene is driven by geometry, not randomness.** A ground station
  links a satellite only while that satellite is above its local horizon
  (`Δmax = acos(R / (R + altitude))`), so links visibly rise and set. Inner
  orbital shells move faster than outer ones.
- **The horizon is anchored to viewport height**, not derived from the sphere
  radius. The planet reads correctly on a 13-inch laptop and a 32:9 ultrawide.
- **A clarity falloff fades the network behind your copy**, so the scene never
  competes with your name.
- **Everything honours `prefers-reduced-motion`** by rendering a single static
  frame with no animation loop.

## Stack

- [Astro 5](https://astro.build) — static output, no client framework
- [Tailwind CSS 4](https://tailwindcss.com) via the Vite plugin
- TypeScript, type-checked on every build with `astro check`
- Canvas 2D for the hero scene, ~7 kB of script (3 kB gzipped)

## Quick start

```bash
npm ci
npm run dev
```

Then work through these four steps:

1. **Edit `src/config.ts`** — name, role, tagline, `url`, `base`, socials, nav.
2. **Replace `src/data/profile.ts`** — experience, education, recognition.
3. **Add projects** to `src/content/projects/` as Markdown.
4. **Drop in your portrait** at `public/images/` and point `SITE.portrait` at it.

## Commands

| Command | Action |
| --- | --- |
| `npm ci` | Install dependencies |
| `npm run dev` | Start the dev server on `localhost:4321` |
| `npm run build` | Type-check and build to `./dist/` |
| `npm run preview` | Preview the production build |

## Configuration

Everything site-specific lives in [`src/config.ts`](src/config.ts):

| Export | Purpose |
| --- | --- |
| `SITE` | Name, initials, role, description, tagline, location, deployment `url` and `base`, theme colours, default theme, portrait path |
| `NAV` | Header and footer navigation |
| `SOCIALS` | Social links; the first is shown in the header, all appear in the footer and on the contact page |
| `withBase()` | Prefixes a root-relative path with the deployment base |

`astro.config.ts` reads `site` and `base` from `SITE`, so subpath and root
deployments differ by one line.

### Deploying to a domain root

```ts
url: "https://example.com",
base: "/",
```

### Deploying to GitHub Pages under a repo name

```ts
url: "https://your-username.github.io",
base: "/your-repo-name",
```

The included workflow at `.github/workflows/deploy.yml` builds and publishes to
GitHub Pages on every push to `main`. Enable Pages with "GitHub Actions" as the
source.

## Adding a project

```markdown
---
title: Project name
order: 3
category: Cloud delivery
summary: One sentence on what it is.
outcome: One sentence on what it demonstrates.
stack: [Terraform, Kubernetes]
repo: https://github.com/you/repo
featured: false
draft: false
---

Optional longer description.
```

Validated at build time by the Zod schema in
[`src/content.config.ts`](src/content.config.ts). `featured: true` promotes it
to the home page; `draft: true` hides it everywhere.

The Markdown body becomes the project's detail page at `/work/<slug>/`, so this
is where a case study goes: the problem, what you built, and the evidence.

## Adding a post

Create a Markdown file in `src/content/blog/`:

```markdown
---
title: Post title
description: One line, used in listings, search and RSS.
date: 2026-01-01
updated: 2026-02-01
tags: [Kubernetes, Observability]
linkedin: https://www.linkedin.com/posts/your-post-url
draft: false
---

Your post.
```

Posts are ordered newest first. `draft: true` keeps a post out of the index, the
sitemap, the search index and the feed. Setting `linkedin` adds a "Read the
original on LinkedIn" link at the end of the post — useful when you publish
there first and mirror it here.

## Adding a CV

Drop a PDF into `public/` and point `SITE.cv` at it:

```ts
cv: "/CV.pdf",
```

A download button then appears on the about page. While `cv` is an empty string
the button stays hidden, so there is no broken link in a fresh clone.

## Search

`src/pages/search.json.ts` emits a static JSON index at build time covering both
collections. `src/pages/search.astro` fetches it once and filters in the
browser with a custom element — no search service, no client framework, and it
works on a static host. For a few hundred entries this is faster than anything
you would pay for.

## Customising the hero scene

All of it lives in [`src/components/OrbitalField.astro`](src/components/OrbitalField.astro).

| What | Where |
| --- | --- |
| Horizon height | `horizonY` — fraction of viewport height |
| Planet size | `radius` |
| Satellite count and orbit speed | `SATELLITE_COUNT`, the `satellites` array |
| Ground station names | `STATION_LABELS` |
| Constellations | `CONSTELLATIONS` — normalised star coordinates and link pairs |
| Meteor frequency | `METEOR_COUNT`, the `meteors` array |
| Text protection | the `clarity()` function |

Colours come from the CSS custom properties in `src/styles/global.css`
(`--theme-accent`, `--theme-foreground`, `--theme-canvas`, `--theme-surface`),
so retheming the site retheme the scene automatically.

## Accessibility

- Skip-to-content link, semantic landmarks, visible focus rings
- Canvas scenes are `aria-hidden` — they carry no information
- `prefers-reduced-motion` disables all animation loops and pointer tracking
- The command console is keyboard-driven with an `aria-live` output log

## License

MIT — see [LICENSE](LICENSE). Attribution is appreciated but not required.
