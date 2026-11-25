<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Minrock](https://github.com/rnt-rez/minrock) Astro theme by rnt-rez, copied from commit `6f70ecd684d1ba941616b51729caa1333fc48aec` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-minrock.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `SITE_URL`, `PUBLIC_SCATTERLEAF_BROKER`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [rnt-rez](https://github.com/rnt-rez), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 🪨 Minrock — Minimalist Theme for Astro & Obsidian

> **"Raw ideas from your personal vault, finely polished into an ultra-fast static blog."**  
> *"Minrock is the solid bedrock where knowledge rests; ScatterLeaf is the gentle breeze where ideas and conversations drift."*

[![Astro](https://img.shields.io/badge/Astro-7.x-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Version: v0.2.2](https://img.shields.io/badge/Version-v0.2.2-brightgreen.svg?style=flat-square)](https://github.com/rnt-rez/minrock/releases)
[![Demo](https://img.shields.io/badge/Demo-minrock.vercel.app-blue?style=flat-square&logo=vercel&logoColor=white)](https://minrock.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Obsidian](https://img.shields.io/badge/Obsidian-Ready-7C3AED?style=flat-square&logo=obsidian&logoColor=white)](https://obsidian.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/rnt-rez/minrock/pulls)
[![Translations](https://img.shields.io/badge/Portugu%C3%AAs-README.pt--BR.md-green?style=flat-square)](README.pt-BR.md)

**Minrock** is an opinionated, typography-first static blog theme for [Astro 7](https://astro.build), crafted specifically for technical writers, software engineers, and developers who take notes in [Obsidian](https://obsidian.md). Built on the principle of **digital sovereignty**, it empowers thinkers and builders to claim a space to truly call their own on the open web—free from corporate walled gardens, algorithmic feeds, and hosting costs.

> *"The project exists to foster and democratize access and personal positioning on the open web, guaranteeing a sovereign space to call your own: free from interference, without steep hurdles, and at zero cost."*  
> — **Renato Rezende**, Creator of Minrock

[🌐 View Live Demo](https://minrock.vercel.app) • [🇧🇷 Leia esta documentação em Português](README.pt-BR.md)

---

## ✨ Key Features

* **💎 Pure Static Site Generation (SSG):** Pre-rendered HTML for maximum delivery speed and zero runtime server overhead.
* **🌐 Digital Sovereignty & Personal Positioning:** Total ownership of your content in open Markdown, hosted wherever you choose at zero financial cost.
* **✍️ Typography-First Architecture:** Tailored vertical rhythm, optimal line heights, and elegant type hierarchy designed for deep reading.
* **🎨 4 Calibrated Color Themes:**
  * ☀️ **Clean White:** Crisp, modern editorial look.
  * 📜 **Warm Paper (Cream):** Eye-friendly soft palette for extended reading sessions.
  * ⚓ **Slate Navy:** Deep, focused dark mode inspired by Linear and Vercel.
  * 🌌 **Midnight:** Pure OLED black with subtle reactive neon card accents.
* **🗃️ Obsidian Vault CMS Friendly:** Native Markdown page bundles support with effortless copy-pasting of local images.
* **🍃 ScatterLeaf Ready:** Native, iframe-free comments powered by GitHub Discussions via `<scatter-leaf>` with Cloudflare Edge Broker and Chameleon auto-theming.
* **💻 Code Blocks with Style:** Syntax highlighting with dual dark/light parity, line numbers, and clean copy triggers.
* **♿ Universal Accessibility:** Built with WCAG 2.1/2.2 AA standards, visible keyboard focus rings (`:focus-visible`), and zero layout shifts.

---

## 🚀 Quick Start

Initialize your blog in seconds using the official Astro CLI:

```bash
npx create-astro@latest --template rnt-rez/minrock
```

Or clone the repository locally:

```bash
git clone https://github.com/rnt-rez/minrock.git my-blog
cd my-blog
npm install
npm run dev
```

Visit `http://localhost:4321` in your browser to view your live blog.

> [!NOTE]
> `npm install` also sets up a [Husky](https://typicode.github.io/husky/) pre-commit hook that runs `npm run check`. Fix failures before committing.

---

## 📂 Project Structure

```text
minrock/
├── src/
│   ├── config/
│   │   └── site.ts            # Site title, author bio, social links, and navigation
│   ├── content/
│   │   └── blog/              # Your Markdown articles (Obsidian Vault compatible)
│   ├── components/            # Header, Footer, ThemeSelector, ArticleCard
│   ├── layouts/               # BaseLayout, PostLayout
│   ├── pages/                 # index, blog, about, 404
│   └── styles/                # Global CSS tokens and 4 color palettes
├── astro.config.mjs           # Astro 7 configuration
├── package.json
└── tsconfig.json
```

---

## 🛠️ Configuration & Content

### 1. Site Metadata & Feature Flags (`src/config/site.ts`)
Easily customize your blog settings and toggle components in a single configuration file:

```typescript
export const siteConfig = {
  title: 'Minrock',
  description: 'Minimalist, typography-first Astro 7 theme for technical writers.',
  author: 'Renato Rezende',
  siteUrl: 'https://minrock.vercel.app', // Or via env: SITE_URL=https://yourdomain.com
  defaultTheme: 'cream', // Default theme: 'white' | 'cream' | 'slate' | 'midnight'
  // Granular Feature Flags — "Complete by default, minimalist on demand"
  // Toggle any flag to false to completely eliminate markup, styles, and scripts during SSG build.
  features: {
    search: true,          // Lunr full-text search modal & shortcuts (Ctrl/Cmd+K)
    tableOfContents: true, // Sticky sidebar TOC in posts (auto-centers to 780px when disabled)
    readingTime: true,     // "X min read" badge in post headers
    audioPlayer: true,     // Accessible text-to-speech audio reader in posts and projects
    tags: true,            // Tag badges in headers, article cards, and tag clouds
    socialShare: true,     // Notion-style share modal and trigger bar in blog posts
    themeSwitcher: true,   // Palette dropdown switcher in header
    backToTop: true,       // Floating smooth-scroll back-to-top button
    imageZoom: true,       // Medium-style smooth image zoom modal
    comments: true         // Interactive blog comments powered by ScatterLeaf
  },
  comments: {
    enabled: true,
    provider: 'scatterleaf',
    repo: 'rnt-rez/minrock',
    category: 'General',
    theme: 'auto',        // Chameleon mode: dynamic contrast detection
    lang: 'auto',
    clientId: 'Iv23liZHApvnx6e6wtMJ',
    broker: '',           // Leave empty ('') for zero-setup mode, or provide your Cloudflare Worker URL
    features: {
      images: true        // Toggle image insertion modal in comment composer
    }
  }
};
```

### 2. Granular Feature Flags ("Complete by Default, Minimalist on Demand")

Minrock is built to impress out of the box with a complete suite of modern features, while giving purist technical writers the freedom to strip down the experience to an ultra-minimalist, Obsidian-like reading environment.

Because flags are evaluated at Astro build time (**Pure SSG**), turning any feature to `false` guarantees **zero bundle overhead**: no HTML markup, CSS rules, or client-side JavaScript for that component will be included in the final static output.

* **Adaptive TOC Layout:** When `tableOfContents` is set to `false`, the article grid automatically adapts from a split sidebar layout to a centered, single-column reading column (`max-width: 780px; margin: 0 auto;`).

### 3. Publishing from Obsidian
Drop your Obsidian Markdown notes directly into `src/content/blog/` using the frontmatter format:

```markdown
---
title: "Building Resilient Systems"
description: "A deep dive into distributed systems architecture."
pubDate: 2026-09-15
tags: ["engineering", "architecture", "devops"]
---

Your content goes here...
```

### 4. Comments System (Modular & Optional)

Minrock respects your digital sovereignty: comments are 100% optional, zero-bloat, and cleanly encapsulated inside [`src/components/Comments.astro`](src/components/Comments.astro).

> [!NOTE]
> **🍃 Zero-Setup Showcase Mode (Default):**  
> Out of the box, Minrock runs in **Showcase Mode**. It renders a realistic, interactive playground in browser memory with sound TTS, language translation, code blocks, and reactions. Visitors can fully experience the comments interface **safely in memory without posting spam or creating discussions in your GitHub repository**.

| Mode | Configuration in `site.ts` | What Readers Experience |
| :--- | :--- | :--- |
| **1. Showcase / Demo (Default)** | `broker: ''` | **Interactive Sandbox:** Full simulated comments in browser memory. Zero external setup, zero risk of spam. |
| **2. Live Production** | `broker: 'https://...'` | **Live Sync:** Real-time reader discussions backed by GitHub Discussions via Cloudflare Edge Broker. |
| **3. Completely Disabled** | `comments.enabled = false` | **Zero Overhead:** Astro completely eliminates all comment HTML, CSS, and scripts at build time (0 KB JS). |

#### 🚀 How to Enable Live Discussions (When You Are Ready)

To connect your own real-time GitHub Discussions:
1. **Enable GitHub Discussions** on your public GitHub repository under `Settings > Features > Discussions`.
2. **Set your repository** in [`src/config/site.ts`](src/config/site.ts):
   ```ts
   comments: {
     repo: 'your-username/your-repo',
     // ...
   }
   ```
3. **Connect your Broker:** Deploy the lightweight Cloudflare Worker from [ScatterLeaf](https://github.com/rnt-rez/scatterleaf) and provide your broker URL via the `PUBLIC_SCATTERLEAF_BROKER` environment variable (e.g. in your Vercel or Cloudflare Pages project settings).

#### 🕊️ Total Freedom & Alternative Solutions
Prefer a different provider (Giscus, Cusdis, Utterances) or a custom guestbook? Open [`src/components/Comments.astro`](src/components/Comments.astro) and replace the component slot. Zero vendor lock-in.

### 5. Deployment & Production URL (`SITE_URL`)

Your production URL drives the sitemap, RSS feed, canonical tags, `llms.txt`, and structured data. Set it with the `SITE_URL` environment variable rather than editing the code:

* **On your host:** Add `SITE_URL=https://yourdomain.com` in your Vercel, Cloudflare Pages, or Netlify project settings (Environment Variables), then redeploy.
* **Locally:** Copy [`.env.example`](.env.example) to `.env` and set `SITE_URL`.

If `SITE_URL` is not set, Minrock falls back to the demo URL (`https://minrock.vercel.app`), so remember to set it before going live.

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local dev server at `http://localhost:4321` |
| `npm run check` | Runs Astro and TypeScript static type diagnostics |
| `npm run build` | Compiles production-ready static pages into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run qa` | Baseline verification suite (`astro check && astro build`) |
| `npm run audit:google` | Google Search audit (SERP Snippets, Schema.org and Discovery) |
| `npm run audit:wcag` | Structural WCAG 2.1/2.2 AA accessibility and semantic audit |
| `npm run audit:security` | DevSecOps Sentinel security and credential scanner |

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are warmly welcome! Feel free to open an issue or submit a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <em>Crafted with precision by the <a href="https://github.com/rnt-rez/minrock">Minrock Project</a>. Engineered for the open web.</em>
</p>
