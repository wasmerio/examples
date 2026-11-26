<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [wqqz.dev](https://github.com/imwqqz/wqqz.dev) Astro theme by imwqqz, copied from commit `6e78905c0cc6878e37bcc0e54618ad559cf748d4` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-wqqz-dev.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [imwqqz](https://github.com/imwqqz), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# example-portfolio

> Highly customizable and performant portfolio template built with Astro, React, and Tailwind CSS.

![preview.png](preview.png)

## What's inside

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![KaTeX](https://img.shields.io/badge/KaTeX-008080?style=for-the-badge&logo=libretexts&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

- [Astro](https://astro.build) for static pages and content collections
- [React](https://react.dev) for the interactive bits, like the archive list and search overlay
- [Tailwind CSS v4](https://tailwindcss.com) for all the styling
- [Expressive Code](https://expressive-code.com) for highlighted code blocks, file tabs, and terminal windows
- [KaTeX](https://katex.org) so you can write math in your markdown

## Getting started

You'll need Node.js (v18 or newer) and `pnpm`.

```bash
# grab a copy of the repo
git clone https://github.com/example/example-portfolio
cd example-portfolio

# install the dependencies
pnpm install

# run the dev server and start editing
pnpm dev
```

Open http://localhost:4321. Add `--host` to `pnpm dev` if you want to view it from another device on your network.

## Site content

### Your personal info lives in `public/0user.json`

This is the one file you'll touch the most. It holds your name and role, the home page paragraphs, site metadata like the title and description, every contact link (email, GitHub, X, Discord), and the whole resume section.

```json
{
  "name": "John Doe",
  "contacts": [
    { "label": "email", "text": "john.doe@example.com", "href": "mailto:john.doe@example.com" }
  ]
}
```

### Blog posts live in `src/content/archives/*.md`

Each post is a plain markdown file. The frontmatter at the top tells the site what to show:

```yaml
---
title: Post title
description: Short summary shown in listings and search.
date: 2026-09-20
tags:
  - security
draft: true    # remove this (or set false) to publish the post
---
```

The easiest way to start is to copy `0-draft-1.md` or `0-draft-2.md`, fill them with your writing, and flip `draft` off when you're ready.

Some nice extras your markdown supports:

```md
> [!NOTE] / [!TIP] / [!SUCCESS] / [!IMPORTANT] / [!WARNING] / [!CAUTION]   callout boxes

```ts title="app.ts"                                   a code block with a file tab

```bash frame="terminal" group="run" tab="pnpm"          a terminal window, tabs if you group
```

## Customizing colors

The whole color scheme lives in `src/styles/global.css`, split into a light block (`:root`) and a dark block. Every color has a short comment next to it saying what it's used for, so you can just tweak the `oklch(...)` values and see the difference.

```css
--background: oklch(99% .002 286);   /* page background */
--accent:     oklch(54% .22 293);    /* highlight: links, focus */
```

The site uses JetBrains Mono for everything. That's loaded in `src/layouts/Base.astro`.

## Project structure

```
example-portfolio/
├── public/
│   └── 0user.json          # your site info, contacts, resume
├── src/
│   ├── content/archives/   # your blog posts
│   ├── pages/              # home, archives, tags, resume, 404
│   ├── components/         # a few React and Astro components
│   ├── layouts/            # Base.astro handles the head, metadata, and fonts
│   ├── lib/                # helpers for info, archives, search, tags
│   └── styles/             # global.css holds the color tokens
├── README.md
└── LICENSE
```

> This project is licensed under the [MIT License ](LICENSE), Be nice. Details in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).