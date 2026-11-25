<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Fumika](https://github.com/iyanarmanda/fumika) Astro theme by iyanarmanda, copied from commit `579d334447b4f055b63bf6d8e7f6bce9019e8dcb` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-fumika.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
  - Resized 6 images over 300 KB to at most 1600 px wide, keeping file names and formats.
- **Environment variables:** None.
- **Credit:** theme by [iyanarmanda](https://github.com/iyanarmanda), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Fumika🐈

![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 11](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fiyanarmanda%2Ffumika.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fiyanarmanda%2Ffumika?ref=badge_shield&issueType=license)

A clean, minimalist, and modern, static blog template built with [Astro](https://astro.build). **Fumika** is heavily modified from [Fuwari](https://github.com/saicaca/fuwari).

[**Live Demo**](https://fumika-demo.netlify.app)

**Preview**:

Light Mode:
![Preview Image Light Mode](https://raw.githubusercontent.com/iyanarmanda/resource/main/fumika/home-light.png)

Dark Mode:
![Preview Image Dark Mode](https://raw.githubusercontent.com/iyanarmanda/resource/main/fumika/home-dark.png)

## Tech Stacks

- [Astrojs v7](https://astro.build)
- [Svelte v5](https://svelte.dev/)
- [Tailwind CSS v4](https://tailwindcss.com)
- [SCSS](https://sass-lang.com/)

## Features

- [x] Smooth animations and page transitions
- [x] Light / dark mode
- [x] Responsive design
- [x] Customizable theme, banner, and other components
- [x] Search functionality with [Pagefind](https://pagefind.app/)
- [x] [Markdown extended features](https://github.com/iyanarmanda/fumika?tab=readme-ov-file#-markdown-extended-syntax)
- [x] Table of contents
- [x] RSS feed
- [x] Meta and Open Graph Tag
- [x] i18n translation
- [x] Comment feature with [Giscus](https://giscus.app/)
- [x] Google Analytics using [Partytown](https://partytown.qwik.dev/)

*See upcoming features in [ROADMAP](https://github.com/iyanarmanda/fumika/blob/main/ROADMAP.md)

### Markdown Extended Features

In addition to Astro's default support for GitHub Flavored Markdown ([Docs](https://github.github.com/gfm/)), several extra Markdown features are included:
- Admonitions ([Preview and Usage](https://fumika-demo.netlify.app/posts/markdown-extended/#admonitions))
- GitHub repository cards ([Preview and Usage](https://fumika-demo.netlify.app/posts/markdown-extended/#github-repository-cards))
- Enhanced code blocks with Expressive Code ([Preview](https://fumika-demo.netlify.app/posts/expressive-code/) / [Docs](https://expressive-code.com/))
- Mermaid Diagram ([Preview](https://fumika-demo.netlify.app/posts/mermaid/) / [Docs](https://mermaid.js.org/))
- Typography features ([Preview and Usage](https://fumika-demo.netlify.app/posts/markdown-extend/#typography-features))

## Getting Started

1. Create your blog repository:
   - [Generate a new repository](https://github.com/iyanarmanda/fumika/generate) from this template or fork this repository.
     - Or run one of the following commands:
       `sh
       npm create fumika@latest
       yarn create fumika
       pnpm create fumika@latest
       bun create fumika@latest
       deno run -A npm:create-fumika@latest
       `
2. To edit your blog locally, clone your repository, run `pnpm install` to install dependencies.
   - Install [pnpm](https://pnpm.io) `npm install -g pnpm` if you haven't.
3. Edit the config file `src/config.ts` to customize your blog.
4. Run `pnpm new-post <filename>` to create a new post and edit it in `src/content/posts/`.
5. Deploy your blog to Netlify, GitHub Pages, etc. following [the guides](https://docs.astro.build/en/guides/deploy/). You need to edit the site configuration in `astro.config.mjs` before deployment.

## Frontmatter of Posts

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
ogImage: /media/images/cover.webp # by default is empty and use `image` frontmatter if it from public directories or url.
draft: false
---
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`      |
| `pnpm build`               | Build your production site to `./dist/`          |
| `pnpm preview`             | Preview your build locally, before deploying     |
| `pnpm check`               | Run checks for errors in your code               |
| `pnpm format`              | Format your code using **Biome**                 |
| `pnpm lint`                | Lint your code using **Biome**                   |
| `pnpm new-post <filename>` | Create a new post                                |
| `pnpm astro ...`           | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro --help`        | Get help using the Astro CLI                     |
| `pnpm test`                | Running unit testing using **Vitest**            |

## License

This project is licensed under the MIT License.
