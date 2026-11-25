<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Saral](https://github.com/yashjawale/saral-theme-astro) Astro theme by yashjawale, copied from commit `33de6aa0594139ca43a62a4475d7de55d0877e2f` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-saral.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 4 images over 300 KB to at most 1600 px wide, keeping file names and formats.
- **Environment variables:** None.
- **Credit:** theme by [yashjawale](https://github.com/yashjawale), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Saral Theme

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![Lint, Format, and Type Check](https://github.com/yashjawale/saral-theme-astro/actions/workflows/lint.yml/badge.svg)](https://github.com/yashjawale/saral-theme-astro/actions/workflows/lint.yml)
[![Deploy to GitHub Pages](https://github.com/yashjawale/saral-theme-astro/actions/workflows/deploy.yml/badge.svg)](https://github.com/yashjawale/saral-theme-astro/actions/workflows/deploy.yml)

A simple & minimal theme for personal blog sites, crafted for Astro framework.

View demo at [https://yashjawale.github.io/saral-theme-astro/](https://yashjawale.github.io/saral-theme-astro/)

View in Astro themes at [https://astro.build/themes/details/saral/](https://astro.build/themes/details/saral/)

> Like what you see? Consider starring the repository 🌟

![Theme Screenshot](./screenshot.jpg)

Derived from [yashjawale.github.io](https://yashjawale.github.io)

## Features

- Image optimization on build
- Accessible emojis
- Automatic reading time display for posts
- Automatic last update status for posts
- Dark mode support
- RSS feed
- Includes GitHub workflows for linting & formatting

## Getting started

- Clone this repository
- Install dependencies with `npm i`
- Start dev server with `npm run dev`
- Remove `<meta name="robots" content="noindex" />` tag from `src/components/BaseHead.astro` file
- Remove `.github/workflows/deploy.yml` if not deploying to [GitHub Pages](https://docs.github.com/en/pages)
- Update `base` value in `src/consts.ts` file - if your site is not in a subdirectory, make it empty string
- Update favicons & opengraph images ([realfavicongenerator.net](https://realfavicongenerator.net/) is a nice site to get the favicons cropped)
- Update page content & images
- Publish your site 🚀

## Adding a blog post

- Add `your-blog-post.md` file under `src/content/blog` (filename denotes the URL slug)
- Write content in file using Markdown syntax
- Add cover image at `src/assets/blogimages/<YOUR_SLUG>/cover.jpg` - Recommended dimensions: `853x480px`
- For adding images to content, use the folowing syntax for caption support `![Alt text](../../assets/blogimages/<YOUR_SLUG>/imagename.ext)`
- Create a PR & merge after passing workflow checks

> [!TIP]
> Facing any issues or want a feature? Feel free to create a new [issue](https://github.com/yashjawale/saral-theme-astro/issues)

---

<a href="https://yashjawale.github.io/" target="_blank"><img style="height: 22px;" src="https://raw.githubusercontent.com/yashjawale/.github/main/docs/logo.svg" alt="Yash Jawale"/></a>
