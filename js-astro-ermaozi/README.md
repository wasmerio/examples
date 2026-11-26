<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [ermaozi](https://github.com/ermaozi/astro-theme-ermaozi) Astro theme by ermaozi, copied from commit `55e7fc77990a662e4581bc80813a447e0e9ee2ad` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-ermaozi.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [ermaozi](https://github.com/ermaozi), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# ermaozi

English | [简体中文](./readme-cn.md)

`ermaozi` is an Astro static theme for blogs, knowledge bases, and product documentation, heavily customized from Plume. It includes bilingual routing, automatic documentation sidebars, Pagefind full-text search, dark mode, categories, tags, archives, SEO, and enhanced Markdown.

> [!WARNING]
> The `0.2` series is still in beta. Features and configuration are not yet fully stable, and future releases may introduce breaking changes. Pin your version during the beta period and review the release notes before upgrading.

Live demo: <https://astro.ermao.net>

Create a new site and automatically install dependencies:

```bash
npm create astro-theme-ermaozi
```

You can also specify a directory or use the equivalent command for your package manager:

```bash
npm create astro-theme-ermaozi my-site
pnpm create astro-theme-ermaozi my-site
yarn create astro-theme-ermaozi my-site
```

The interactive wizard lets you choose Simplified Chinese or English as the root language and decide whether to show the language switcher. For automated setup, append `-- --yes --lang=en-US --multilingual`; the generator adjusts content directories, permalinks, translation relationships, and internal links accordingly.

## Getting Started

Requires Node.js 22.12+ and npm, pnpm, or Yarn.

```bash
# npm
npm install
npm run dev

# pnpm
pnpm install
pnpm dev

# Yarn
yarn install
yarn dev
```

`dev` starts the Astro development server with hot reloading. Development mode does not generate a Pagefind index; run `npm run build && npm run preview` to verify search and the production output. `dev:fast` remains available as a legacy alias.

## Customize Your Site

For your first site, follow the [beginner's quick start](./content/en/docs/guide/getting-started.md). Day-to-day changes only require `site.config.mjs` and `content/`; leaving `theme/` untouched makes future theme updates easier. `defineSiteConfig()` provides editor completion for common settings, and `npm run check` identifies common configuration errors.

1. Update the domain, site name, author, navigation, and optional services in [`site.config.mjs`](./site.config.mjs).
2. Replace [`public/img/logo.svg`](./public/img/logo.svg).
3. Remove the sample posts in `content/` and add your own Markdown files.
4. Run the `validate` script with your chosen package manager.

In the default content structure, Chinese posts go in `content/blog/category/`, and English posts go in `content/en/blog/category/`. Documentation goes in `content/docs/` and `content/en/docs/`; setting `type: doc` automatically generates grouped sidebars and previous/next navigation. Use a stable `permalink` for long-lived pages; English translations point to the Chinese route through `translationOf`.

Minimal frontmatter:

```yaml
---
title: My post
description: What the reader will learn.
permalink: /blog/my-post/
createTime: 2026-08-05
tags: [Astro]
type: post # post, doc, or page
---
```

Documentation pages can use `group`, `order`, and `badge` to control sidebar grouping, sorting, and badges. Without a `permalink`, the theme generates a route from the file path, stripping leading numeric prefixes such as `1.` used to sort files or directories.

## Built-in Features

- Static output with three content types: blog posts, regular pages, and documentation
- Chinese and English content with `hreflang`
- Pagefind full-text search
- Light, dark, and system themes
- Categories, tags, archives, and client-side pagination
- Automatic documentation sidebars, mobile documentation navigation, previous/next links, and Markdown source export
- Shiki syntax highlighting with light and dark themes, code titles, line numbers, line highlighting, and copy buttons
- Footnotes, callouts, task lists, `==highlighting==`, file trees, code trees, steps, windows, table copying, collapsible panels, tabs, and Mermaid
- Build-time PBKDF2 + AES-GCM encryption for full pages or selected content, QR codes, and npm/GitHub status badges
- Click-to-preview images and YouTube, Bilibili, audio, video, and PDF embeds
- Canonical URLs, Open Graph, JSON-LD, sitemaps, robots, and llms.txt
- Optional Giscus comments and a self-hosted interaction API

Comments, view counts, likes, and popular posts are disabled by default. Configure the corresponding features and service URLs in `site.config.mjs` before enabling them; a purely static deployment requires no backend. Static content encryption is not a substitute for server-side access control: do not commit passwords or genuinely confidential content to a public repository. Algolia, Waline, Twikoo, and Artalk still require connections to actual services.

## Commands

```bash
npm run check          # Astro and TypeScript checks
npm run build          # Static build and search index
npm run deploy         # Generate deployable dist/ without uploading it
npm test               # Build output tests
npm run test:visual    # Browser interaction and responsive layout tests
npm run audit          # Route, SEO, privacy, and unsafe markup audit
npm run validate       # Full pre-release checks, excluding browser tests
```

The examples above use npm; pnpm and Yarn use the same script names. Use `pnpm run deploy` to avoid a conflict with pnpm's built-in `deploy` command.

## Static Deployment

The setup wizard can generate configurations for GitHub Pages, GitLab Pages, Netlify, Vercel, or Firebase Hosting, or you can choose Custom. All three package managers produce the same `dist/` output:

```bash
npm install && npm run deploy
pnpm install && pnpm run deploy
yarn install && yarn deploy
```

For Custom hosting, set `dist/` as the static publish directory. Use any of the lines above as your hosting platform's build command and `dist` as its output directory. For sites hosted under a subpath, set `base` in `site.config.mjs`; CI can also override the domain and subpath through `SITE_ORIGIN` and `BASE_PATH`. See [Deploy Your Site](./content/en/docs/guide/deployment.md) for full instructions.

Dependency audit commands vary by package manager: use `npm audit --omit=dev`, `pnpm audit --prod`, or `yarn npm audit --environment production`, respectively.

## Publishing the Site Generator

npm resolves `npm create astro-theme-ermaozi` to the stable release of `create-astro-theme-ermaozi` and runs it. Before publishing, check the template package from the generator directory:

```bash
cd internal/create
npm test
npm pack --dry-run
npm publish --access public
```

The public `npm create astro-theme-ermaozi` command only becomes available after the final step successfully publishes the package to npm; this project never publishes automatically during builds or tests. Stable releases use the npm `latest` tag, and prereleases use `beta`.

Subsequent versions can be published automatically through [`.github/workflows/publish-npm.yml`](./.github/workflows/publish-npm.yml):

1. In the npm settings for `create-astro-theme-ermaozi`, configure a GitHub Actions Trusted Publisher with owner `ermaozi`, repository `astro-theme-ermaozi`, and workflow `publish-npm.yml`, and allow `npm publish`.
2. No `NPM_TOKEN` or GitHub Actions secret is needed; the workflow publishes using short-lived OIDC credentials.
3. Update the generator's `package.json` version to `x.y.z`, pass the full validation checks, then create and publish a GitHub Release tagged `vx.y.z`.

The workflow reinstalls dependencies, runs `pnpm validate`, verifies that the release tag exactly matches the package version, and publishes through npm Trusted Publisher. It stops if the tag does not match or the version already exists.

## Project Structure

The top level contains everyday content, public assets, site configuration, and files required by Astro. Theme implementation and maintenance scripts live in `theme/`, which regular site customization does not require you to edit.

- `content/`: Chinese and English pages and sample posts
- `public/`: Logos, images, and other static files published as-is
- `site.config.mjs`: Site identity, navigation, and optional services
- `theme/components/`: UI components and lightweight client-side interactions, without site-specific configuration
- `theme/lib/`: Shared content, navigation, Markdown, and SEO logic
- `theme/styles/`: Global variables, theme styles, and Plume compatibility styles
- `theme/scripts/audit.mjs`: Standalone project audit

When adding features, reuse shared logic from `theme/lib/` first. Pages assemble data, components handle presentation, and site-specific differences stay in `site.config.mjs` and Markdown. This lets the generator template and regular sites share the same code without maintaining two implementations.

## License and Attribution

`theme/styles/vendor/` includes compatibility styles from VuePress Theme Plume. Their MIT license is preserved in [`theme/styles/vendor/LICENSE`](./theme/styles/vendor/LICENSE).

Project code is licensed under the [MIT License](./LICENSE). See [`theme/licenses/THIRD_PARTY_NOTICES.md`](./theme/licenses/THIRD_PARTY_NOTICES.md) for third-party notices. The code license does not automatically cover articles, images, or third-party materials you add.
