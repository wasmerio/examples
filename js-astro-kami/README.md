<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Kami](https://github.com/automann/astro-kami) Astro theme by automann, copied from commit `0da8e4f1cb53819d3154ed9c48da1cf943913cbf` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-kami.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
- **Environment variables:** None.
- **Credit:** theme by [automann](https://github.com/automann), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Kami

An internationalised Astro blog template with editorial typography, light and dark themes, Markdown/MDX, RSS, OG
images, and optional Giscus comments and analytics.

**Live demo:** [GitHub Pages](https://automann.github.io/astro-kami)

## Features

- Astro 7 static output with content collections (posts and pages, both validated by Zod)
- English at the unprefixed root and Simplified Chinese under `/zh/`, with locale-aware navigation, dates, archives,
  tags, Showcase, RSS, sitemap entries, and `hreflang` metadata
- MDX support — embed Astro/JSX components, imports, and JS expressions inside posts
- Light and dark themes that follow the system preference and persist the reader's choice
- Bundled variable Newsreader and Inter fonts, plus Unicode-range
  [Maple Mono CN](https://github.com/subframe7536/maple-font) for code and Chinese glyph coverage
- Language-specific typography tokens so English and Chinese can share layout structure without sharing every
  typesetting decision
- Code blocks via [astro-expressive-code](https://expressive-code.com): themes, copy button, terminal frames, line
  highlighting
- Math via KaTeX (`$inline$` and `$$display$$`)
- Custom containers (`:::note`, `:::tip`, `:::important`, `:::caution`, `:::warning`)
- Paginated post archives (20 posts per page) and per-locale tag indexes
- A localized Showcase with priority-based ordering, three featured projects on the home page, and a complete listing
- Per-post OG images generated at build time (Satori + resvg)
- Per-locale RSS feeds, an internationalized sitemap, robots.txt, and a web manifest
- A Pagefind full-text index generated after each production build
- Optional [Giscus](https://giscus.app) comments with custom matched themes
- Optional GA4 and Goatcounter analytics, both loaded via [Partytown](https://partytown.qwik.dev/) so they run on a
  worker thread
- Optional [webmentions](https://webmention.io), fetched at build and cached locally
- Static HTML with no client-side framework or internationalization runtime

## Quick start

Click **Use this template** on GitHub, or clone directly:

```sh
git clone https://github.com/automann/astro-kami.git
cd astro-kami
pnpm install
pnpm dev
```

Open http://localhost:4321.

## Commands

| Command        | What it does                                                      |
| -------------- | ----------------------------------------------------------------- |
| `pnpm dev`     | Start the development server with HMR                             |
| `pnpm check`   | Run Astro and TypeScript diagnostics                              |
| `pnpm build`   | Type-check, build, compress assets, and generate Pagefind indexes |
| `pnpm test`    | Build with a project base path and run the integration tests      |
| `pnpm preview` | Preview the production build locally                              |
| `pnpm lint`    | Lint with Biome; warnings fail the command                        |
| `pnpm format`  | Format with Biome and Prettier                                    |

## Configuration

Most site-wide personalisation happens in the following files.

- **`src/site.config.ts`** holds the site title and description, author profile, menu, sorting preference, comments,
  analytics, webmentions, and Expressive Code options. Optional profile links such as `email`, `github`, `twitter`,
  `linkedin`, and `mastodon` are only rendered when configured. Optional employment, education, and avatar fields feed
  the About page and structured data.
- **`src/i18n/config.ts`** defines locales, URL prefixes, locale metadata, and interface strings.
- **`src/data/showcase.ts`** contains localized project descriptions, badges, and priorities. Higher priorities appear
  first; the home page displays the top three entries.

**`astro.config.ts`** is where you set `site` to your final domain (used for canonical URLs, sitemap, RSS, and OG image
URLs). The base path is handled automatically — see [Deploying](#deploying); you normally don't touch it.

Replace or add these assets in `public/`:

- `icon.png` (512×512). Drives the favicon and the auto-generated `apple-touch-icon`, `icon-192`, and `icon-512` PWA
  manifest icons.
- `social-card.png` (1200×630). Fallback OG image, used when a post doesn't have its own. The default is a placeholder
  you can swap.
- `avatar.png` (optional; add it yourself). Referenced from `siteConfig.profile.avatar`, used in the About page's
  structured data and any avatar slot you add. Remove the configured path when no avatar is available.

### Per-post OG images

Every post gets its own 1200×630 OG image generated at build time by [Satori](https://github.com/vercel/satori). English
cards use Newsreader and Maple Mono; Chinese cards load the complete Maple Mono CN Regular font during the build so
their titles, descriptions, and metadata render without missing glyphs. Long titles, descriptions, and tag lists are
bounded to remain inside the fixed card layout. The complete CN font is not copied into the deployed site.
The card model and markup live in `src/components/og/article-card.ts`; the route in
`src/pages/og-image/[...slug].png.ts` supplies article data and build-time font profiles. Tweak the component once and
every post's card updates on the next build. To skip the generated image and point a post at your own, set
`ogImage: "/path/to/image.png"` in the post's frontmatter.

## Writing posts

Posts live in `src/content/post/` as `.md` or `.mdx` files. The filename becomes the public slug, excluding a locale
directory such as `zh/`.

English is the unprefixed default locale. Put Simplified Chinese posts in `src/content/post/zh/`; they are published
under `/zh/posts/`, while default-locale posts remain under `/posts/`. Locale routing and interface strings live in
`src/i18n/config.ts`.

```yaml
---
title: "Your post title"
publishDate: 2026-01-12
description: "One-sentence summary used in cards, social previews, and meta tags."
tags: [tag-one, tag-two]
# updatedDate: 2026-02-01     # optional, shown as "Updated …"
# draft: true                  # excludes the post from production builds
# coverImage:
#   src: ./_assets/cover.png
#   alt: "Description for screen readers"
---
```

About pages are Markdown documents at `src/content/page/about.md` and `src/content/page/zh/about.md`. Showcase entries
are typed objects in `src/data/showcase.ts`; empty the array and the Showcase tab is hidden automatically.

## Project layout

```
src/
  site.config.ts          # site, profile, menu, integrations, code-block theme
  content.config.ts       # collection schemas (post, page)
  content/
    post/*.{md,mdx}       # default-locale blog posts
    post/zh/              # Simplified Chinese blog posts
    page/about.md         # default-locale About page
    page/zh/about.md      # Simplified Chinese About page
  data/
    post.ts               # post queries, locale filtering, sorting, and tags
    showcase.ts           # localized Showcase entries and priority helpers
  i18n/config.ts          # locales, paths, locale metadata, and interface strings
  components/
    blog/                 # post lists, sharing, and webmentions
    layout/               # header and footer
    og/                   # locale-aware article social-card model and markup
    pages/                # shared locale-aware page implementations
    showcase/             # Showcase presentation components
  layouts/                # Base.astro and BlogPost.astro
  pages/                  # default-locale and /zh/ route adapters, OG images, RSS
  plugins/                # Markdown/HTML processing plugins
  styles/
    fonts/                # locale-specific browser font loading
    global.css            # colour, surface, layout, and shared component styles
    typography/           # matching en.css and zh.css typography-token adapters
tests/                    # built-output i18n/SEO and typography-contract tests
public/                   # static assets and Giscus theme styles
```

## Theming

Shared colour, surface, and layout tokens live in `src/styles/global.css`. Locale-specific font loading lives under
`src/styles/fonts/`; font-family and type values live in `src/styles/typography/en.css` and
`src/styles/typography/zh.css`, which both implement the same token interface. Light
and dark palettes are selected through `[data-theme="light"]` and `[data-theme="dark"]` on `<html>`. A small inline
script applies the saved or system theme before rendering to avoid a flash, and the header control persists changes in
`localStorage`.

Code-block themes are configured separately in `expressiveCodeOptions` in `site.config.ts` (defaults: `min-light` and
`min-dark`).

## Deploying

Output is a static `dist/` directory that deploys anywhere serving files: Cloudflare Pages, Netlify, Vercel, GitHub
Pages, S3 + CloudFront. Build command: `pnpm build`. Output directory: `dist`.

### Base path

Defaults to root (`/`) — no config needed for local dev, Netlify, Vercel, Cloudflare Pages, a custom domain, or a
GitHub Pages **user** site. The whole site (links, assets, feeds, OG/canonical, manifest, Markdown links) is base-aware.

For a GitHub Pages **project** site (served from `/repo/`), the bundled `.github/workflows/deploy.yml` detects the
subpath and configures it automatically; the only manual step is **Settings → Pages → Source: GitHub Actions**. For a
subpath on any other host, build with `BASE_PATH=/sub pnpm build`.

### Asset caching

Astro emits content-hashed CSS, JavaScript, and font filenames that are safe to cache for a long time. GitHub Pages,
however, controls its own response headers and currently serves these assets with a short cache lifetime that the
site cannot override. This is fine for the bundled demo, but production sites prioritising repeat-visit performance
should use a host or CDN that supports a policy such as `Cache-Control: public, max-age=31536000, immutable` for
paths ending in `/_astro/*` (including project subpaths such as `/astro-kami/_astro/*`), while keeping HTML on a
shorter lifetime.

## Roadmap

The next development priorities are:

1. **Partial done** — Maple Mono stylesheets are isolated by locale and required weight. Further changes to the
   Chinese splitting strategy are deferred because reducing request count also increases content-dependent glyph
   transfer, making the expected real-world benefit too small and unstable to justify the added complexity.
2. Add a first-class `translationKey` to the post schema, enabling article-level language switching and accurate
   `hreflang` relationships between translations.
3. Split `BlogPost.astro` into smaller, focused modules as a longer-term maintainability improvement; this should not
   block the current visual-system work.

## Credits

Originally forked from [astro-sienna](https://github.com/anjay-goel/astro-sienna)
by [Anjay Goel](https://github.com/anjay-goel), then heavily revamped into its current form.

## License

[MIT](./LICENSE).
