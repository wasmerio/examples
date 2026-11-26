<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Twoism](https://github.com/esafev/twoism) Astro theme by esafev, copied from commit `87b8ec0d0b54370a5db2671738ed26e01955ec47` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-twoism.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with bun, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Changed the build script to `astro build`, because the theme's `astro check` step fails on type errors only.
- **Environment variables:** None.
- **Credit:** theme by [esafev](https://github.com/esafev), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Twoism

An Astro template for a short intro and a list of notes. Named after the 1995 Boards of Canada EP.

Demo: [twoism.pages.dev](https://twoism.pages.dev)

## Preview

| Light | Dark |
| --- | --- |
| ![Home page in light mode](.github/assets/home-light.webp) | ![Home page in dark mode](.github/assets/home-dark.webp) |
| ![A note in light mode](.github/assets/note-light.webp) | ![A note in dark mode](.github/assets/note-dark.webp) |

## Start

```sh
bun create astro@latest --template esafev/twoism
bun run dev
```

## Customize

Your name, links and site URL live in `src/consts.ts`, the intro in `src/content/intro.mdx`, notes in `src/content/notes`.

## Scripts

```sh
bun run note:create "Title" "Description"   # draft note
bun run portrait:create photo.jpg           # dithered portrait, macOS
bun run image:dither photo.jpg              # dithered image for a note
```
