<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Aonote](https://github.com/runsli/astro-theme-aonote) Astro theme by runsli, copied from commit `0257be940cb7da0765b41767d5dec02ef136a572` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-aonote.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: vercel.json.
- **Environment variables:** None.
- **Credit:** theme by [runsli](https://github.com/runsli), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# astro-theme-aonote

English | [中文](README.zh-CN.md)

[![Live Demo](https://img.shields.io/badge/demo-live-0ea5e9)](https://astro-theme-aonote.vercel.app)
[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white)](https://astro.build)

**Static blog theme for [Astro](https://astro.build) 6** — GFM, MathML math, Shiki code blocks, archive, tags, and RSS/Atom.

| | |
| --- | --- |
| **Live demo** | https://astro-theme-aonote.vercel.app |
| **Upstream** | https://github.com/runsli/Aonote |

## Screenshots

| Homepage — recent posts, tag cloud, dark/light | Post page — TOC, MathML, syntax-highlighted code |
| --- | --- |
| ![Homepage showing post list, tags, and theme toggle](docs/screenshots/home.png) | ![Post with table of contents sidebar, math equations, and code blocks](docs/screenshots/post.png) |

## Features

- GFM: tables, task lists, footnotes, definition lists, admonitions
- Math as **MathML** (temml), no KaTeX runtime CSS
- Shiki code blocks with Aonote-style metadata (title, line highlight, diff)
- Archive, tags, RSS + Atom, sitemap
- Light / dark theme, zh-CN / en UI strings
- Subpath-aware links when deployed under a repo path

## Quick start

### Use as Astro template (recommended)

```bash
npm create astro@latest my-blog -- --template runsli/astro-theme-aonote
cd my-blog
npm install
npm run dev
```

### Clone this repo

```bash
git clone https://github.com/runsli/astro-theme-aonote.git
cd astro-theme-aonote
npm install
npm run dev
```

Open http://localhost:4321 and edit:

1. `src/site.config.ts` — title, `baseUrl`, language, copyright
2. `src/content/posts/` — your Markdown posts
3. `src/content/pages/about.md` — about page

**Node:** ≥ 22.12.0 (Astro 6). Node 22 LTS is recommended.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frunsli%2Fastro-theme-aonote)

1. Import the repo on [Vercel](https://vercel.com/new) or [Netlify](https://app.netlify.com/start) (or use the button above).
2. **Build:** `npm run build` · **Output:** `dist` (framework preset: Astro).
3. After deploy, set `baseUrl` in `src/site.config.ts` to your production URL.

`vercel.json` is included (CSP headers). For Netlify: same build command and publish directory.

To fork via GitHub: enable **Template repository** under repo Settings, then **Use this template** or `npm create astro@latest -- --template runsli/astro-theme-aonote`.

## Customize

| What | Where |
| --- | --- |
| Site title, URL, locale | `src/site.config.ts` |
| UI strings | `src/i18n.ts` |
| Global layout / nav | `src/layouts/BaseLayout.astro` |
| Theme CSS | `src/styles/aonote.css` |
| Markdown pipeline | `src/integrations/aonote-markdown.ts` |
| Feed limits | `src/utils/feed.ts` |
| `robots.txt` / sitemap URL | `src/pages/robots.txt.ts` (uses `site.config.ts`) |

## Project layout

```text
src/
├── site.config.ts
├── content/
│   ├── posts/          # Blog articles
│   └── pages/          # about, 404
├── layouts/
├── components/
├── pages/              # Routes
├── integrations/       # Markdown / Shiki
└── styles/aonote.css
```

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview build |
| `npm run check` | `astro check` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE). Original Aonote design and styles © [runsli](https://github.com/runsli).
