<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Lemma Blog](https://github.com/jczhang02/lemma-blog) Astro theme by jczhang02, copied from commit `c98da8f49bd385ccda1489ee2e69a828f42c3b21` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-lemma-blog.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with bun, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [jczhang02](https://github.com/jczhang02), NOASSERTION. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<div align="center">
  <h1>Lemma</h1>
  <p><b>A quiet Astro theme for math-heavy writing: real LaTeX, numbered theorems, citations, sidenotes and link previews, in Chinese and English.</b></p>
  <p>The theme behind <a href="https://chengrui.dev">chengrui.dev</a>, and the source of that blog.</p>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-b5532f?style=flat-square" alt="License"></a>
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-7-191917?style=flat-square&logo=astro" alt="Astro 7"></a>
  <a href="https://www.mathjax.org"><img src="https://img.shields.io/badge/MathJax-4-191917?style=flat-square" alt="MathJax 4"></a>
  <a href="https://chengrui.dev"><img src="https://img.shields.io/badge/live-chengrui.dev-6b6a64?style=flat-square" alt="Live site"></a>
</div>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/img/hero-dark.webp">
    <img src="docs/img/hero-light.webp" alt="A post in the Lemma theme on desktop and phone" width="1000">
  </picture>
</p>

> 💡 This repository is a working personal blog and a theme at the same time. To use the theme, fork it, change the settings in [Make it yours](#make-it-yours), and replace the posts. The sample post `src/content/posts/hello-math/` (a draft) uses every feature.

## Features

- **Real LaTeX, rendered at build time**: MathJax 4 turns formulas into SVG, so pages ship no math JavaScript. AMS environments, `physics`, `mathtools`, `mhchem`, `cases`, blackboard and script alphabets; site-wide and per-post macros; build warnings for any TeX error or undefined macro.
- **Paper structure**: numbered sections, theorem-like environments numbered per section, proofs with ∎, `\label` / `\ref` / `\eqref` with forward references, numbered figures and tables with captions where print puts them, booktabs tables.
- **Citations from BibTeX**: `\cite{key}` becomes a numbered link and an AMS-style reference list; entries come from plain BibTeX files.
- **Read in place**: footnotes become sidenotes in the margin on wide screens; citations, cross-references and notes open a preview card on hover, focus or tap; a click on a figure widens it to the window, in the flow of the text.
- **Diagrams**: `tikzcd` and `tikz` code blocks are compiled by LaTeX into inline SVG that follows the text color.
- **Bilingual**: Chinese at `/`, English at `/en/`, translations linked both ways, careful CJK typesetting (mixed-script spacing, justified Chinese).
- **Comfortable to read**: a tick-mark table of contents with section cards, light and dark themes with no flash, reading time, copy buttons, edge fades on wide content, 44px tap targets, WCAG AA contrast.
- **Search**: a search panel (`/` or Cmd/Ctrl+K) over a [Pagefind](https://pagefind.app) index of the posts, built with the site; Chinese is split into words. No server, nothing loaded until the panel is first opened.
- **About page**: a CV-like profile from one folder: name, links and bio in Markdown, sections of dated entries and publications in YAML; prints as a clean CV.
- **Static and private**: no trackers, no third-party scripts; deploys as static files.

## Quick Start

Needs [Bun](https://bun.sh) 1.2+: the `new`, `media:push` and `deploy` scripts run with it. `dev`, `build` and `preview` also run with npm on Node 22.12+. TikZ diagrams also need TeX Live (`latex`, `dvisvgm`, `tikz-cd`).

```bash
git clone https://github.com/jczhang02/lemma-blog.git && cd lemma-blog
bun install
bun run dev              # http://localhost:4321, drafts included
```

Search in `bun run dev` uses the index of the last `bun run build`, which has no drafts.

```bash
bun run new my-post      # src/content/posts/my-post/zh.md, a draft; --en for en.md
bun run build            # static site in dist/, drafts left out
bun run check            # type-check the TypeScript and .astro files
bun run deploy           # build and upload to Cloudflare (see Deploying)
bun run media:push       # upload videos over 25 MiB to R2
```

## Make it yours

Every setting lives in one file, [`lemma.config.mjs`](lemma.config.mjs); the rest is theme. A running dev server picks up edits to it, re-rendering every post.

```js
export default {
  site: {
    url: 'https://chengrui.dev',
    title: 'Chengrui Zhang',
    description: { zh: '方程, 模型, 以及其他.', en: 'Equations, models, and other things.' },
    intro: { curve: 'monge-ampere', formula: '\\det D^2 u = f' }, // the home page; null for none / the tagline
    avatar: 'src/assets/avatar.jpg',
    links: { email: 'jczhang@live.it', github: 'jczhang02' },
    // ...
  },
  theme: {
    colors: { light: { bg: '#faf9f5', accent: '#b5532f', /* ... */ }, dark: { /* ... */ } },
    fonts: { stacks: { /* sans, serif, kai, mono */ }, imports: ['@fontsource-variable/inter', /* ... */], cjkImports: [/* ... */] },
    layout: { measure: '46rem', textBase: '1.125rem', leading: 1.75 },
  },
  math: { macros: { R: '\\mathbb{R}', /* ... */ }, packages: ['ams', 'physics', /* ... */] },
  // also: locales, code, bibliography, theorems, reading, media, deploy
};
```

| Section | What it sets |
| --- | --- |
| `site` | URL (canonical links, Open Graph, sitemap, RSS), name, author (also as BibTeX `Last, First`), tagline per language, home intro (curve mark and formula, also drawn as the link preview image `/og.png`), avatar, footer links, icons |
| `locales` | default language and the language list (pages exist for `zh` and `en`) |
| `theme` | light and dark colors, font stacks and the font packages to load (the CJK ones go in a stylesheet of their own), text width and size; [`DESIGN.md`](DESIGN.md) describes the system |
| `code` | Shiki themes; token colors are raised to 4.5:1 against the code background |
| `math` | site-wide TeX macros and the MathJax packages loaded up front |
| `bibliography` | BibTeX files and the CSL style of the reference list |
| `theorems` | names of theorem-like environments, figures and tables, per language |
| `reading` | reading speeds behind "约 8 分钟 / 8 min read" |
| `media` | size limit for bundled videos and the R2 bucket for larger ones |
| `deploy` | Cloudflare Worker name, account ID and domain, IndexNow key |

A few things are files by nature: the avatar image under `src/assets/`, the icons in `public/`, the posts in `src/content/posts/`, and the BibTeX files.

**Bibliography.** Cited entries live in `src/bibliography.bib`, an ordinary BibTeX file you edit by hand. `bibliography.files` can list more files (a key in several is taken from the first); any tool that writes BibTeX, such as a reference manager's export, can fill one of them.

## Writing

A post is a folder: `src/content/posts/<slug>/zh.md` and/or `en.md`, with its images and videos next to it.

```markdown
---
title: Neural operators for Burgers' equation
description: "Required. One or two sentences: the abstract and the meta description. Quote it if it contains a colon."
date: 2026-10-10
tags: [PDE, operator learning]
draft: true
ai: true   # written by AI: the meta line shows an AI badge
macros:
  Lap: '\Delta'
---

## Setting \label{sec:setting}

$$
\begin{equation}
  u_t + u u_x = \nu u_{xx} \label{eq:burgers}
\end{equation}
$$

:::theorem[Existence]{#thm:exist}
For smooth initial data, \eqref{eq:burgers} has a unique smooth solution.
:::

:::proof
See \cite{evans2010}.
:::

As Theorem \ref{thm:exist} shows in Section \ref{sec:setting}, ...[^1]

[^1]: Footnotes become sidenotes on wide screens.
```

| Element | Syntax |
| --- | --- |
| Math | `$...$`, `$$...$$`, any AMS environment; `\label`, `\eqref` |
| Sections | `## Title \label{sec:x}`; h2/h3 are numbered (`numbering: false` turns it off) |
| Theorems | `:::theorem[Name]{#thm:x}` … `:::` — also `lemma`, `proposition`, `corollary`, `definition`, `example`, `remark`, `proof` |
| References | `\ref{thm:x}`, `\ref{fig:x}`, `\ref{sec:x}`, `\eqref{eq:x}`, written in prose |
| Citations | `\cite{key}`, `\cite{a,b}`, `\cite[Thm.~3]{key}` |
| Figures, tables | `:::figure{#fig:x .invert-dark}` / `:::table{#tab:x}` around an image or table and a caption paragraph |
| Diagrams | a ` ```tikzcd ` or ` ```tikz ` code block (cached in `tikz-cache/`, commit it) |
| Video | `![caption](./clip.mp4)` |
| Footnotes | `text[^1]` and `[^1]: note` |

Write `.md`, not `.mdx`: MDX reads `{`, `}` and `<` as JSX and breaks TeX. The build prints `[mathjax]`, `[cite]`, `[theorems]`, `[tikz]` and `[media]` warnings with the file name; drafts are checked too. For the about page they give the file name only, never its TeX, labels or keys. A longer cheat sheet, in Chinese, is in [`WRITING.md`](WRITING.md).

## About page

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/about-dark.webp">
  <img src="docs/img/about-light.webp" alt="The About page of the sample profile: name, contact buttons, bio, a GitHub activity heatmap, a now block and facts" width="800">
</picture>

`/about/` and `/en/about/` are built from `src/content/about/`, a folder that holds content only:

| File | What it holds |
| --- | --- |
| `zh.md`, `en.md` | frontmatter: `title`, `name`, `tagline`, `links`, `self`, `sections` (publications and the blocks below included); the body is the bio. Without a file, that language has no about page and no About link. The `links` under the name are buttons that show an email address, a GitHub user name or the label, each with an icon; with an about page, the footer drops its Email and GitHub links. |
| any other file | linked by a relative `href`, `pdf` or `url` (`cv.pdf`, `cv.pdf#page=2`), published at `/about/cv.pdf`. Files nobody links to are not published, and neither are `zh.md` and `en.md`. |

```yaml
links:
  - { label: CV, href: cv.pdf }
self: ['Zhang, Chengrui', '张三']   # bold in author lists; default site.authorBibtex
sections:
  - heading: Education
    items:
      - { when: 2023 – now, title: PhD in Mathematics, subtitle: Example University, href: 'https://…' }
  - heading: Selected publications
    selectedOnly: true              # no list: the selected papers of the sections below
  - heading: Publications
    publications:
      - title: A Paper Title
        authors: [Some Coauthor, Chengrui Zhang]
        venue: Journal of Examples
        year: 2026
        selected: true
        arxiv: '2601.00001'           # an id (quoted) or a URL; doi likewise
        doi: 10.0000/example
        links: [{ label: Code, href: 'https://…' }]
        bibtex: |
          @article{zhang2026paper, ... }
```

| Field | |
| --- | --- |
| item | `when`, `title`, `subtitle`, `note`, `href`, `links`; only `title` is required |
| paper | `title` (required), `authors` (as printed), `venue`, `year`, `note`, `selected`, `url` (the title's link), `pdf`, `arxiv`, `doi`, `links`, `bibtex` |
| section | `heading` with `items`, or with `publications` and an optional `selectedOnly`; or a block named by `kind:` (below) |
| `kind: now` | `text` (required), `updated`, `place`, `timezone` (an IANA name; the page shows the local time there) |
| `kind: facts` | `facts`: a list of `label`, `value`, optional `href` |
| `kind: activity` | `github`: a user name, by default `site.links.github`; a year of contributions as a heatmap, always right after the bio |
| `kind: stack` | `groups`: a list of `label` and `tags` |
| `kind: projects` | `projects`: a list of `title` (required), `note`, `href`, `repo`, `stars`, `when`, `links`; without `stars`, a GitHub `repo`'s stars are fetched; 0 stars show the GitHub icon alone |
| `kind: posts` | `limit` (default 3): the latest posts in the page's language |

Every block takes an optional `heading`. Activity blocks come right after the bio, wherever they are written; the other blocks appear in the order written, and the links stay under the name. The activity block reads the public calendar at `github.com/<user>`, and projects their stars from the GitHub API, when the site is built, so they are as fresh as the last deploy; the dev server reuses copies up to 6 hours old, cached in `node_modules/.cache/lemma/`. A calendar more than two days old says "as of" its date, whether the build used an old copy or the page was built days ago (the browser checks). Without network a build uses the last copy; with no copy at all, a build fails rather than drop the activity block (the dev server leaves it out with an `[about]` warning), and a project shows no stars. A day's count shows on hover, on touch (a finger slides from day to day), or with the arrow keys once the grid has focus.

A section is a list of items when it has `items`, of papers otherwise. A misspelt key or a value of the wrong type (`year: '2025'`, an unquoted arXiv id) fails the build with an error that names the field, such as `sections.3.publications.2.year`. A top-level `tagline:`, `links:`, `self:` or `sections:` left empty counts as not given.

Papers are sorted newest first, the year shown once per year; the link row reads PDF · arXiv · DOI, then the extra links, and a BibTeX copy button when `bibtex` is given. A selectedOnly section without its own list takes the selected papers of the file's other publications sections.

The template marks its placeholders with `ABOUT_TEMPLATE`. A production build leaves out a file whose body or field values still hold the marker, with a warning; that language's page goes live once the marker is gone from both (YAML comments do not count).

`src/about.sample/` is a fictitious profile with the same layout, for working on the page without the real one: `bun run dev:sample` (port 4399) or `LEMMA_ABOUT=sample bun run build`. `bun run deploy` refuses to run while `LEMMA_ABOUT` is set, or while `NODE_ENV` is set to anything but `production` (drafts and the marker check depend on a production build).

Coding agents keep out of the real folder unless its author asks: [`AGENTS.md`](AGENTS.md) says so, `.ignore` keeps it out of `rg` and `fd`, and `.gitattributes` keeps its text out of `git diff`.

## Features in detail

### Sidenotes

From 1200px wide, footnotes sit in the right margin, each on the baseline of its reference; notes that would overlap stack downward, and the text shifts left when the margin is short. Narrower screens keep the notes at the end of the post, and the reference opens a preview card instead.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/sidenotes-dark.webp">
  <img src="docs/img/sidenotes-light.webp" alt="Theorems with sidenotes in the margin" width="1000">
</picture>

### Link previews

Citations, `\ref`, `\eqref` and notes show their target in a card: the reference entry, the full theorem statement, a figure with its caption, the equation, or a section's opening. Hover (after 200ms) or keyboard focus opens it on desktop; on touch screens the first tap opens it and the second follows the link.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/preview-dark.webp">
  <img src="docs/img/preview-light.webp" alt="A preview card showing a theorem" width="900">
</picture>

### Figure zoom

A click (or Enter) on a figure's image widens the figure past the text column to the window, and the text below moves down to make room; a second click or Escape puts it back. Raster images stop at their own pixels and vector ones at three times their size, so nothing is blown up; on phones the image takes twice the column and scrolls sideways. It applies to figures with a single image, and only where the image would grow.

### Table of contents

A column of ticks in the left margin, one per section, the current one long and dark. Each tick shows its section's title and first lines on hover or focus.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/toc-dark.webp">
  <img src="docs/img/toc-light.webp" alt="TOC ticks with a section card" width="480">
</picture>

### Search

The search button in the header, `/` or Cmd/Ctrl+K opens a panel that searches the published posts of the page's language and links each result to its best-matching section. After `bun run build`, `plugins/search.mjs` runs Pagefind (the extended build, which splits Chinese into words) over the post pages in `dist/` and writes the index to `dist/pagefind/`, one per language. Only the article is indexed: title, abstract, keywords, text and notes. The meta line, the reference list and the "cite this post" block are left out, and formulas are not searchable: inline ones show as "…" in excerpts, display ones not at all. The panel loads Pagefind's script from `/pagefind/` on first open; the dev server serves the index of the last build there.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/search-dark.webp">
  <img src="docs/img/search-light.webp" alt="The search panel with a result and its highlighted excerpt" width="900">
</picture>

### Diagrams and code

TikZ diagrams use the same fonts and size as the formulas around them and switch color with the theme. Code is highlighted at build time, with a copy button.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/diagram-dark.webp">
  <img src="docs/img/diagram-light.webp" alt="A tikz-cd pullback diagram with a numbered caption" width="900">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/img/code-dark.webp">
  <img src="docs/img/code-light.webp" alt="A code block with a copy button" width="800">
</picture>

<details>
<summary><strong>Deploying</strong></summary>

`bun run deploy` writes the wrangler config from `lemma.config.mjs` (`deploy`: Worker name, account ID, domain) to `.wrangler/deploy.jsonc`, builds the site, and uploads `dist/` as Cloudflare Workers static assets (no Worker code, so requests are free and unlimited). It signs in with the `cf` CLI login (`cf auth login`) when `cf` is installed, and otherwise with wrangler's own (`bunx wrangler login`). Extra arguments go to wrangler, for example `bun run deploy --dry-run`. With `deploy.indexNow` set, the site serves the key at `/<key>.txt`, and after the upload the script sends IndexNow (Bing and the other search engines that take it) the pages that are new or have a new `lastmod` in the sitemap, compared with the live sitemap before the deploy; a failed submission is only a warning. Google does not take IndexNow; it reads the sitemap. Any random string of 8 to 128 letters, digits or dashes works as a key.

Any static host works too: the output in `dist/` is plain HTML, CSS and fonts. Files over 25 MiB are not accepted by Cloudflare, which is why large videos go to R2 with `bun run media:push`: it uploads them under a content hash, records them in `src/media-r2.json`, and keeps them out of git. It uploads with the `cf` CLI, so install `cf` and run `cf auth login` first.

On the live site, the R2 host (`media.chengrui.dev`) has edge caching for a year (query strings ignored), a WAF rule that blocks query strings and non-GET/HEAD requests, and a rate limit of 100 requests per 10 seconds per IP, so the only metered item stays near zero.

</details>

<details>
<summary><strong>How it works</strong></summary>

Markdown goes through Astro's unified pipeline with local plugins:

- `plugins/remark-tikz.mjs`: TikZ code blocks to SVG through `latex` and `dvisvgm`, cached by content hash.
- `plugins/remark-theorems.mjs`: section and theorem numbering, figures and tables, `\label` / `\ref`.
- `plugins/remark-reading.mjs`: reading time and section count.
- `plugins/remark-cite.mjs`: `\cite` and the reference list (citation-js, AMS numeric CSL).
- `plugins/media.mjs`: video embedding, dev serving, build copy, R2 URLs.
- `plugins/about.mjs`: the about folder (and its sample switch), its template marker, and the files it links to.
- `plugins/github.mjs`: the GitHub contributions calendar for the about page's activity block, fetched and cached.
- `plugins/search.mjs`: the Pagefind index of the posts after a build, and its dev serving.
- `plugins/rehype-mathjax4.mjs`: MathJax 4 to SVG, per-post macro sandbox, forward references.
- `plugins/rehype-toc.mjs`: TOC entries with rendered math and section previews.
- `plugins/rehype-tables.mjs`, `plugins/rehype-footnotes.mjs`: table wrappers, localized footnotes.

Client-side code is small and lives in `src/components/` (TOC, sidenotes, previews, search, copy buttons). `astro.config.mjs` imports the plugins with a hash of their sources, so editing a plugin re-renders every post in a running dev server.

</details>

## License

The code is [MIT](LICENSE). The posts (except the sample post `hello-math`), the avatar and the site icons are mine and not covered by it; `plugins/ams-numeric.csl` comes from the [CSL styles repository](https://github.com/citation-style-language/styles) under CC BY-SA 3.0.
