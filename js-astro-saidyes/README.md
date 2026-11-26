<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Said Yes!](https://github.com/roicort/saidyes) Astro theme by roicort, copied from commit `5781d7c877b3072616906ce223db457ba35abf94` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-saidyes.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with bun, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 7 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [roicort](https://github.com/roicort), AGPL-3.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Said Yes!

This is a simple Astro project that demonstrates how to create a basic wedding invitation using GSAP.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
