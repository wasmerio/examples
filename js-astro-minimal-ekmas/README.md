<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Minimal Ekmas](https://github.com/ekmas/minimal) Astro theme by ekmas, copied from commit `2e2cd80bbec2d1b3aaa64d7d6e6deaaf1f02f31c` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-minimal-ekmas.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [ekmas](https://github.com/ekmas), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Minimal

Minimal is a minimalistic astro theme for blogs.

## Get started

[Create a new repo](https://github.com/ekmas/minimal/generate) from this template.

## Features

- Astro v4
- Tailwind for styling
- Responsive & SEO-friendly
- Dark/Light mode support
- MD & MDX posts
- View Transitions API
- Content collections
- Expressive-code code blocks
- Shiki code syntax styling
- Icons by [Svgrepo](https://www.svgrepo.com/)

## Configure

- Go to `astro.config.mjs` and change site
- Go to `src/config.ts` and configure data for meta tags
- You can also customize colors of entire layout by changing colors in tailwind config.
- You can customize code blocks config by changing `expressiveCode` object in astro config. Visit [expressive-code docs](https://expressive-code.com/reference/configuration) for more info.
- To change code blocks theme, you'll have to update themes both in `themes` array and in `config.ts`

## How to add new post

Create a new md/mdx file inside src/content/posts, and make sure it's in this format:

```
---
title: 'First post'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Dec 22 2023'
tags: ['astro', 'blogging', 'learning']
---

Your post
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## License

MIT
