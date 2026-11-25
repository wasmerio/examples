---
title: 'Publishing and migration: bring content online'
slug: 'migration'
date: 2025-08-02
description: 'Set production addresses and publication states, organize existing content, then build and deploy.'
categories: ['guide']
tags: ['astro', 'migration']
---

Set the site address, check publication states, then build and deploy to publish online. When migrating a blog, start by organizing articles and attachments in `content/`.

## Configure addresses

Set `site.baseUrl` to the complete production address, such as `https://example.org/`. Use `https://example.org/blog/` for subdirectory deployment.

`site.localePrefixPolicy` selects the language prefix policy, and `posts.pathPrefix` adds article path segments such as `[year]/`. When migrating, retain article identifiers with `slug` and configure redirects from old addresses to new ones at the host.

## Dates and publication states

| Setting                  | Publication behavior                                                   |
| ------------------------ | ---------------------------------------------------------------------- |
| Publication date reached | Published and included in lists, search and feeds                      |
| `draft: true`            | Saved as a draft for development preview                               |
| Future date              | Published when rebuilt after the date is reached                       |
| `hidden: true`           | Direct address remains available; omitted from lists, search and feeds |

`date` sets publication time, and `updated` sets the last update. Common date aliases are also supported for migration. See [Frontmatter](https://bloggpt.reincarnatey.net/en/content/frontmatter).

## Organize existing content

Place Markdown / MDX files in `content/posts/`, with images and attachments managed in bundles. Convert the previous system’s shortcodes and template tags to Markdown, HTML or MDX. Categories and tags link through slugs. See [Content organization](../content-bundle/) for the file layout.

## Build and preview

```sh title="Terminal"
pnpm build
pnpm preview
```

The build checks types and generates pages, attachments, share covers and Pagefind search indexes. Preview articles, images, links, language switching and search results.

## RSS and Sitemap

Each language has its own RSS feed, available at `/zh/rss.xml` and `/en/rss.xml` under the default policy. The Sitemap entry point is `/sitemap-index.xml`, listing final URLs for public pages.

## Deploy and update

For automatic blog builds and deployments, connect a Git repository to Vercel (recommended):

1. Push the theme source to your own Git repository and import it into Vercel.
2. Select `Astro` for Framework Preset and keep Root Directory at the repository root.
3. Set Install Command to `pnpm install --frozen-lockfile`, Build Command to `pnpm build` and Output Directory to `dist`. Select Node.js `24.x` and add `ENABLE_EXPERIMENTAL_COREPACK=1` to the Production and Preview environment variables.
4. Set `site.baseUrl` to the production domain, commit the configuration and deploy. Later pushes to the production branch automatically rebuild and update the site; use other branches for previews.

`pnpm build` generates bundled attachments, share covers and Pagefind search indexes. Trigger another build when a scheduled article reaches its publication date. Other static hosts can also publish the complete `dist/` directory with directory indexes and a 404 page.

See [Build and deploy](https://bloggpt.reincarnatey.net/en/guide/deployment) for the full steps.
