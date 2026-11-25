<div align="center">
  <img src="public/favicon.svg" alt="LogFlow Theme" width="72" />

  # LogFlow Theme

  [简体中文](README.md) | [English](README.en.md)
</div>

> [!NOTE]
> A compact, content-first Astro blog theme for writing, personal sites, and technical documentation.

> [!WARNING]
> This theme is under rapid iteration, and updates may include breaking changes. Fork this repository and pin a specific commit for your own development instead of tracking `main`.

<table>
  <tr>
    <td colspan="2" align="center"><img src="public/screenshots/overview.png" alt="Theme Overview · Dark Home" width="100%" /></td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="public/screenshots/article-dark.png" alt="Article · Dark" width="100%" /></td>
    <td align="center" width="50%"><img src="public/screenshots/friends-dark.png" alt="Friends · Dark" width="100%" /></td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="public/screenshots/home-light.png" alt="Home · Light" width="100%" /></td>
    <td align="center" width="50%">
      <img src="public/screenshots/pixel-hero.gif" alt="Pixel Fluid Animation · Dark" width="100%" />
      <img src="public/screenshots/gh-wall-dark.png" alt="GitHub Activity · Dark" width="100%" />
    </td>
  </tr>
</table>

## Features

- Markdown / MDX, syntax highlighting, one-click code copy, and optional hero images
- Collections, tags, year archives, friend links, and About page
- Dependency-free static post search across titles, descriptions, and tags
- Site-wide pixel fluid animation background: zero-dependency WebGL, follows the light/dark palette, with reduced-motion and no-WebGL fallbacks
- ClientRouter seamless page transitions with link prefetch; the animation persists across pages
- Light / dark theme, responsive mobile nav, and keyboard focus styles
- Card-based layout primitives (Box/Cell) and design tokens built on Tailwind v4, shared by components and pages
- RSS, sitemap, canonical, Open Graph, and Twitter Card
- Optional Giscus comments and GitHub contribution graph
- GitHub Pages auto-deploy via Actions

## Quick Start

```bash
git clone https://github.com/kevynf/logflow-theme.git
cd logflow-theme
npm install
npm run dev
```

The dev server runs at `http://localhost:4321` by default. Requires Node.js `>=22.12.0`.

```bash
npx astro check
npm run build
npm run preview
```

## First-Time Setup

Most site information lives in `src/consts.ts`:

| Config | Purpose | Required |
| --- | --- | --- |
| `SITE_TITLE` | Site title, header, RSS | Yes |
| `SITE_DESCRIPTION` | Default SEO description | Yes |
| `SITE_URL` | Production site URL | Yes (for deploy) |
| `COPYRIGHT_NAME` | Footer copyright name | No |
| `PAGE_COPY` | Page titles and descriptions | No |
| `NAV_LINKS` | Desktop & mobile nav links | No |
| `SOCIAL_LINKS` | Footer social icon links | No |
| `HOME` | Avatar, bio, motto, recent posts limit | No |
| `GH_CONTRIBUTE` | GitHub contribution graph | No |
| `COMMENTS` | Giscus comment system | No |
| `SEARCH` | Search toggle and maximum result count | No |

Friend links live in `src/config/friend-links.ts`. Add entries following the `FriendLink` interface; when `avatar` is omitted, the first letter of the site name is shown instead.

Design tokens (colors, fonts, spacing, widths, radii) live at the top of `src/styles/global.css` as a Tailwind v4 `@theme` block. Tailwind utilities can be used directly in pages and MDX content, and article typography comes from the `prose` container provided by `@tailwindcss/typography`. The site title and body text share the same system sans stack, so no extra font files are needed.

## Writing

Posts go in `src/content/blog/` and support both `.md` and `.mdx`. Minimal frontmatter:

```yaml
---
title: My First Post
description: A one-line summary
pubDate: 2026-07-16
---
```

Full frontmatter:

```yaml
---
title: Frontmatter Best Practices
description: Post summary
pubDate: 2026-07-16
updatedDate: 2026-07-17
collection: Astro
collectionDescription: Astro theme development notes
tags:
  - Astro
  - Theme
heroImage: ./cover.png
---
```

`title`, `description`, and `pubDate` are required; all other fields are optional. No `heroImage` means no broken image or empty social image metadata.

## Search

The search index is generated at build time from post titles, descriptions, and tags in `src/content/blog/` only; post bodies are not included. The browser loads the index the first time search is opened, with no server or third-party search service required.

Open search from the Header icon or with `Ctrl/Command + K` or `/`. Use `↑` and `↓` to select a result and `Enter` to open it. Set `SEARCH.enabled` in `src/consts.ts` to show or hide search, and use `SEARCH.maxResults` to limit the number of displayed results.

## Giscus Comments

After enabling Discussions on your GitHub repository, edit `COMMENTS` in `src/consts.ts` and fill in `repoId` and `categoryId`. Comments are off by default; a configuration hint is shown when fields are incomplete.

## Images & Avatar

- **Avatar:** `HOME.avatar` powers the site avatar and defaults to `public/favicon.svg`; a friend link's `avatar` may be omitted, in which case the first letter of the site name is shown.
- **Post images:** Store images alongside posts and reference them via `heroImage` (optional).
- **Favicon:** Replace `public/favicon.svg` to update both the default avatar and site icon.

## GitHub Pages

This repository's live demo is available at <https://app.kevy.net/logflow-theme/>.

Set the repository's Pages Source to **GitHub Actions**. Pushing to `main` triggers an automatic deploy. The workflow reads `SITE_URL` and `BASE_PATH` from the GitHub Pages configuration, so canonical URLs, sitemaps, and asset paths work with both custom domains and project paths. Forks can still use the default `https://<owner>.github.io/<repository-name>/` address.

## Customization Boundaries

- Site copy & behavior: `src/consts.ts`
- Friend links: `src/config/friend-links.ts`
- Posts & About: `src/content/`
- Colors, fonts, spacing, layout density: Tailwind `@theme` tokens and custom utilities in `src/styles/global.css`
- Page structure: `src/pages/`, `src/layouts/`, `src/components/`

Prefer configuration and content for customizations; only modify components or layouts when the structure truly needs to change.

## License

MIT
