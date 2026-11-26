<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Butterfly](https://github.com/nova1751/astro-butterfly) Astro theme by nova1751, copied from commit `022aefc0fbd22790ccb609ec3a57b56bdb1e05cd` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-butterfly.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [nova1751](https://github.com/nova1751), Apache-2.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<div align="center">

# Astro Butterfly

A blog theme for [Astro](https://astro.build) with the look of [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly). It builds to plain static HTML, keeps JavaScript to what each page needs, and includes tooling for moving an existing Hexo Butterfly blog over.

**[Live demo](https://nova1751.github.io/astro-butterfly/)** · [简体中文](./README.zh-CN.md) · [Configuration](./docs/configuration.md) · [Writing](./docs/writing.md) · [Migrating from Hexo](./docs/migrate-from-hexo.md)

![Astro 7](https://img.shields.io/badge/Astro-7-ff5d01?logo=astro&logoColor=white)
![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)

![Light and dark home page](./.github/assets/preview.png)

</div>

## Features

**The Butterfly look, rebuilt**
- Home cards, author card, announcement, category, tag-cloud and archive widgets, site stats, a sticky table of contents, and the floating rightside buttons.
- Light and dark modes. The dark mode follows the system by default, and a manual choice is remembered for two days, as in Butterfly. Reading mode and a one-column layout are also available.
- Mac-style code blocks rendered at build time by [Expressive Code](https://expressive-code.com/): titles, line highlights, inserted and deleted lines, a copy button, folding, and an expand bar for long blocks.
- Butterfly and tag-plugins-plus tag plugins, written in standard Markdown syntax: notes, tips, folding blocks, tabs, coloured text, checkboxes, spoilers, speech-bubble notes and site cards.

**Built-in features, with nothing to sign up for**
- Full-text site search through [Pagefind](https://pagefind.app/), indexed at build time with no external service.
- Atom feed, `sitemap.xml` and `sitemap.txt`, `robots.txt`, a web app manifest, Open Graph tags and canonical URLs.
- KaTeX maths, image lightbox, image captions taken from alt text, reading time and word count, and a notice on outdated posts.
- "Last updated" dates follow git, so you never edit them by hand. Bulk reformatting commits can be excluded through `.git-blame-ignore-revs`.
- [Mermaid](https://mermaid.js.org/) diagrams in fenced code blocks, following the light or dark theme.
- A Simplified ⇄ Traditional Chinese switch, a top progress bar that appears only on slow loads, and Butterfly's typing sparks.

**Optional services**, each switched on by filling in a key
- [Twikoo](https://twikoo.js.org/) comments and a recent-comments widget.
- An aside clock with weather for the visitor's location ([QWeather](https://dev.qweather.com/), worldwide).
- A floating [APlayer](https://aplayer.js.org/) music player fed by a Meting API.
- [Busuanzi](https://busuanzi.ibruce.info/) visitor counters.

**Small and robust in the browser**
- About 19 KB of gzipped JavaScript runs on first load: client-side navigation, prefetching and the theme behaviour.
- Everything else loads only when it's used. Twikoo loads as the comments come into view, PhotoSwipe on the first image click, Pagefind when search opens, APlayer when music is configured, Mermaid as a diagram comes near, and the conversion table on the first switch to Traditional Chinese.
- Pages stay readable without JavaScript, and a slow or failing third-party service never breaks the page.
- Keyboard and screen reader support: tabs use arrow keys, focus states are visible, and the theme respects `prefers-reduced-motion`.

## Performance

![Lighthouse scores of the demo site](./.github/assets/lighthouse.png)

| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home · Mobile | 97 (95–98) | 96 | 100 | 100 | 1.4 s | 2.3 s | 0 ms | 0 |
| Post · Mobile | 96 (94–96) | 91 | 100 | 100 | 1.5 s | 2.4 s | 80 ms | 0 |
| Home · Desktop | 100 (100–100) | 96 | 100 | 100 | 0.4 s | 0.6 s | 0 ms | 0 |
| Post · Desktop | 99 (99–99) | 91 | 100 | 100 | 0.5 s | 0.7 s | 0 ms | 0 |

Measured on 2026-11-08 against the [demo site](https://nova1751.github.io/astro-butterfly/); the post is [Markdown 写作](https://nova1751.github.io/astro-butterfly/posts/2b3c4d5e/). Lighthouse 12.6.1 CLI on one local machine with default simulated throttling, 3 runs per case. The table and image show the run with the median performance score, with the range of the 3 runs in brackets. Scores vary with hardware and network, and your own content, fonts and third-party scripts will change them.

## Quick start

You need Node.js 22.12 or later and [pnpm](https://pnpm.io/).

```bash
pnpm create astro@latest my-blog --template nova1751/astro-butterfly
cd my-blog
pnpm dev            # http://localhost:4321
```

Or click **Use this template** on GitHub to get a copy that already deploys to GitHub Pages.

Then:

1. Edit `src/config.ts`: site URL, title, author, avatar, menu and social links. Every option is commented; see [docs/configuration.md](./docs/configuration.md).
2. Replace the example posts in `src/content/posts/` with your own. `pnpm new "Title" category` creates a post with the front matter already filled in.
3. Replace the images in `public/img/`.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server with hot reload. Search is unavailable here because the index is built by `pnpm build`. |
| `pnpm build` | Build the site to `dist/` and generate the search index. |
| `pnpm preview` | Serve `dist/` locally. |
| `pnpm new "Title" [dir]` | Create a post with a unique `abbrlink`. |
| `pnpm check` | Run the TypeScript and Astro checks. |
| `pnpm test` / `pnpm test:e2e` | Run the unit tests / browser tests (Playwright, against the build). |
| `pnpm migrate:tags [paths]` | Convert Hexo `{% tag %}` syntax. See [migrating](./docs/migrate-from-hexo.md). |

## Project structure

```text
├── public/                 static files copied as-is (images, fonts)
├── scripts/                new-post, Hexo tag migration, LED font builder
├── src/
│   ├── config.ts           ← site configuration
│   ├── content/
│   │   ├── posts/          ← your posts (any folder layout)
│   │   └── pages/          ← standalone pages: about/, link/, comments/ …
│   ├── content.config.ts   front-matter schema (Hexo-compatible)
│   ├── pages/              routes: home, posts, archives, tags, categories, feed, sitemap
│   ├── plugins/            remark/rehype: alerts, directives, headings, captions
│   ├── lib/                post queries, dates, word count, Hexo-compatible slugs
│   └── theme/              layout, components, client scripts, styles
└── tests/                  unit (Vitest) and browser (Playwright) tests
```

Most changes only need `src/config.ts` and `src/content/`. To restyle the theme, start with the colour tokens at the top of `src/theme/styles/global.css`.

## Writing

Posts are Markdown files with Hexo-style front matter:

```yaml
---
title: Hello
date: 2024-06-01 10:00:00
abbrlink: 1a2b3c4d        # the URL becomes /posts/1a2b3c4d/
tags: [Astro]
categories: [Notes]
cover: /img/covers/1.svg
---
```

Beyond standard GitHub-flavoured Markdown, you can use GitHub alerts (`> [!TIP]`), maths (`$…$`, `$$…$$`), and directives for the Butterfly tag plugins:

```md
:::note{.blue .flat icon="fas fa-bullhorn"}
A note with a custom icon
:::

:::details[Click to expand]{.green}
Folded content
:::

:span[red text]{.red}  :spoiler[hidden]  :tooltip[word]{tip="explanation"}
```

The full syntax, with rendered examples, is in [docs/writing.md](./docs/writing.md) and in the example posts.

## Deploying

The output is a static `dist/` folder, so any static host works.

| Host | Settings |
| --- | --- |
| Vercel / Netlify / Cloudflare Pages | Import the repository. Build command `pnpm build`, output directory `dist`. |
| GitHub Pages | Already set up: in Settings → Pages, set Source to **GitHub Actions**. Every push to `main` then runs `.github/workflows/pages.yml`, which works out the URL and sub-path (`https://<you>.github.io/<repo>/`) by itself. |
| Your own server | Run `pnpm build` and serve `dist/`. Send `404.html` for unknown paths. |

Set `site.url` in `src/config.ts` to your real domain first. The feed, sitemap and canonical links all use it. To serve the site from a sub-path on another host, set `site.base` (for example `'/blog'`). Every theme link, the search index, the feed and root-relative links in your Markdown follow it.

## Migrating from Hexo Butterfly

Most of a Hexo blog carries over unchanged: front matter and date formats, `/posts/:abbrlink/` permalinks, heading anchors (generated with Hexo's slug rules, so old `#links` still work) and the `/atom.xml` feed. One command rewrites the tag plugins:

```bash
pnpm migrate:tags src/content/posts      # {% note %}, {% tabs %}, {% folding %} … → Markdown
pnpm migrate:tags --check src/content    # list anything left over
```

[docs/migrate-from-hexo.md](./docs/migrate-from-hexo.md) walks through the whole move, including service-worker cleanup and keeping your feed subscribers.

## Credits

This theme adapts the design and assets of [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly) by Jerry Chen, and of [hexo-butterfly-tag-plugins-plus](https://github.com/Akilarlxh/hexo-butterfly-tag-plugins-plus) and [hexo-butterfly-envelope](https://github.com/Akilarlxh/hexo-butterfly-envelop) by Akilar. All three are Apache-2.0. It is not affiliated with them. See [NOTICE](./NOTICE) for the full list, including a note about the LED clock font.

## License

[Apache-2.0](./LICENSE)

### Build-time resource optimization

The dev/check/build commands cut site-specific WenKai font subsets. Pages preload a small subset of common UI characters. The browser requests the rest of the shell font only when its characters appear, and discovers the article body subsets after first paint. Comments, search input, weather city names and traditional Chinese can use the original font chunks as an on-demand fallback (`src/theme/scripts/fallback-font.ts`). Run `pnpm build:font` after adding new characters during development. Git ignores generated files, and CI caches fonts and processed images.

Images stored next to a post or in `src/assets/` are encoded during the build, and a missing file fails it; `public/` paths and full URLs are served as they are. The global player initializes on first open; player and lightbox styles load on demand.

Resource optimization is optional: damaged font caches are regenerated, and font failures fall back to the original font.
