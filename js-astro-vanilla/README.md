<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Vanilla](https://github.com/protomorph/astro-vanilla) Astro theme by protomorph, copied from commit `450fadbff92e6fe98f14c185afe3893e8f722dcb` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-vanilla.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [protomorph](https://github.com/protomorph), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Vanilla

A simple, minimal style, framework free Astro blog starter template.

## Getting Started

Create a new astro project with

```sh
npm create astro@latest -- --template protomorph/astro-vanilla
```

or use one of these:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github.com/protomorph/astro-vanilla)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github.com/protomorph/astro-vanilla)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/protomorph/astro-vanilla)

## Integrations

This project comes with some integrations pre installed:

 - MDX
 - RSS
 - Sitemap
 - AutoImport

Review `src/consts.ts` to change the site settings to your liking.

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
