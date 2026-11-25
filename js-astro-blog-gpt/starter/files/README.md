# BlogGPT Starter Template

Welcome to the official starter template for [BlogGPT](https://github.com/Raincarnator/astro-theme-BlogGPT) — a clean, ChatGPT-inspired blog theme built with [Astro](https://astro.build/).

- **Live Demo**: [https://demo.bloggpt.reincarnatey.net](https://demo.bloggpt.reincarnatey.net)
- **Full Documentation**: [https://bloggpt.reincarnatey.net/en/](https://bloggpt.reincarnatey.net/en/)

**English** · [简体中文](README.zh-CN.md)

[Use this template](https://github.com/__STARTER_REPOSITORY__/generate)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F__STARTER_REPOSITORY__)
&nbsp;
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/__STARTER_REPOSITORY__)

The template link creates your own GitHub repository. The deploy buttons also configure a static deployment; later commits to your repository trigger new builds. Upstream starter synchronization does not overwrite repositories created from this template.

## Quick Start

### 1. Requirements

- **Node.js** `24.x`
- **pnpm** the version pinned in `package.json`

### 2. Install & Run Locally

```bash
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:4321` in your browser to preview your blog.

### 3. Create Content

Use the built-in CLI generator to scaffold posts, pages, categories, or tags:

```bash
# Create a standard Markdown post
pnpm new post my-post --title "Hello World"

# Create a folder-based post bundle (for storing images/attachments alongside the post)
pnpm new post travel-notes --use bundle --title "Travel Notes"
```

New posts start as drafts. Set `draft: false` and a publication date no later than the build time when you are ready to publish. You can edit or remove the included `content/posts/hello-world.md` and `content/pages/about.md`. The initial friends page links only to the official BlogGPT documentation site.

## Project Structure

- `blog.config.ts` — Main site configuration (title, author profile, theme appearance, navigation, and features).
- `friends.config.ts` — Blogroll / friends link groups.
- `content/` — All Markdown/MDX content (`posts/`, `pages/`, `categories/`, `tags/`).
- `archetypes/` — Templates used by `pnpm new`.
- `custom/` — Optional hooks for custom `<head>` tags (`head.html`), styles (`styles.css`), and client scripts (`client.ts`).
- `public/` — Static assets served at the root URL (`favicon.svg`, avatars, global files).

## Build & Deployment

```bash
# Build static files into dist/
pnpm build

# Preview the production build locally (including Pagefind search)
pnpm preview
```

You can deploy the generated `dist/` folder to **Vercel**, **Netlify**, **Cloudflare Pages**, **GitHub Pages**, or any static hosting service. The starter reads `SITE_URL` first, then the Vercel production domain or Netlify site URL, and uses `https://example.com/` for local builds. For a custom domain, set `SITE_URL` and rebuild, or replace `site.baseUrl` in `blog.config.ts` with a fixed URL. See the [Deployment Guide](https://bloggpt.reincarnatey.net/en/guide/deployment) for details.

Theme code: [Apache-2.0](LICENSE). See [third-party notices](THIRD_PARTY_NOTICES.md).
