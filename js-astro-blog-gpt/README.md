<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [BlogGPT](https://github.com/Raincarnator/astro-theme-BlogGPT) Astro theme by Raincarnator, copied from commit `ff218fa9569a852eec1a5a460ef4725b4585a89e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-blog-gpt.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [Raincarnator](https://github.com/Raincarnator), Apache-2.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# BlogGPT

**A modern [Astro](https://astro.build/) blog theme inspired by ChatGPT's clean, focused interface.**

Write in Markdown or MDX, organize your posts with a collapsible sidebar, and help readers find anything in seconds with built-in full-text search.

**English** · [简体中文](README.zh-CN.md)

[Live Demo](https://demo.bloggpt.reincarnatey.net) · [Documentation](https://bloggpt.reincarnatey.net/en/) · [GitHub Repository](https://github.com/Raincarnator/astro-theme-BlogGPT)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRaincarnator%2Fastro-theme-BlogGPT-starter)
&nbsp;
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Raincarnator/astro-theme-BlogGPT-starter)

Get up and running in minutes with the [BlogGPT Starter Template](https://github.com/Raincarnator/astro-theme-BlogGPT-starter), which comes pre-configured with a sample post, an About page, and sensible defaults. You can also [create a repository from the GitHub template](https://github.com/Raincarnator/astro-theme-BlogGPT-starter/generate) and connect your hosting provider later. The main theme repository includes the full demo content and documentation workspace.

> **New here?** Start with the [Getting Started Guide](https://bloggpt.reincarnatey.net/en/guide/getting-started), then explore the [Documentation](https://bloggpt.reincarnatey.net/en/) to customize your blog.

![BlogGPT Home: Search & Resizable Sidebar](.github/assets/readme/home.webp)

## Key Features

| Category                  | Highlights                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Reading Experience**    | Responsive ChatGPT-style layout, resizable sidebar, light/dark/system themes, collapsible table of contents, keyboard shortcuts, and smooth client-side navigation |
| **Content Management**    | Posts, standalone pages, categories, and tags; custom slugs, folder-based content bundles for local attachments, and CLI scaffolding templates (archetypes)        |
| **Rich Markdown**         | Full Markdown & MDX support with Expressive Code syntax highlighting, KaTeX math formulas, Mermaid diagrams, callout blocks, and image lightbox                    |
| **Content Discovery**     | Pinned/featured posts, chronological archives, pagination with page jump, category cover styles, tag cloud, and grouped blogroll (friends links)                   |
| **Instant Search**        | Static full-text search powered by Pagefind with article, title/description, body, and whole-site scopes, keyword highlighting, and `/` commands                   |
| **Multi-Language (i18n)** | Built-in English and Simplified Chinese UI, localized URL routing, filename-based translation linking, and customizable UI text                                    |
| **Stats & Sharing**       | Estimated reading time, word count, site-wide writing statistics & activity heatmap, customizable share snippets, and dynamic Open Graph cover generation          |
| **SEO & Extensibility**   | Open Graph tags, Twitter Cards, RSS feeds, Sitemap, and extension hooks (`custom/head.html`, `custom/styles.css`, `custom/client.ts`)                              |

## Interface Preview

### Article Page · Light

![Article page in light mode](.github/assets/readme/article-light.webp)

<details>
<summary>View six more interface previews</summary>

### Article List

![Article list with covers, tags, and pagination](.github/assets/readme/posts.webp)

### Article Page · Dark

![Article page in dark mode](.github/assets/readme/article-dark.webp)

### Categories

![Category covers and tag cloud](.github/assets/readme/categories.webp)

### Archives

![Articles grouped by publication year](.github/assets/readme/archives.webp)

### Friends

![Grouped friend links and resources](.github/assets/readme/friends.webp)

### Statistics

![Writing statistics, publishing heatmap, and article-length chart](.github/assets/readme/statistics.webp)

</details>

## Quick Start

Follow the [Getting Started Guide](https://bloggpt.reincarnatey.net/en/guide/getting-started) to scaffold a new project, install dependencies, and start the local development server.

## License

Theme code is released under [Apache-2.0](LICENSE). Documentation is licensed under [MIT](apps/docs/LICENSE). See [third-party notices](THIRD_PARTY_NOTICES.md) for bundled assets and dependencies.
