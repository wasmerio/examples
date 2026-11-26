<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Portfolio Aajafry](https://github.com/aajafry/portfolio) Astro theme by aajafry, copied from commit `c588d46797e7e808d3282fe0d42554fa15e5a070` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-portfolio-aajafry.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and runs the `@astrojs/node` standalone server on Wasmer Edge.
- **Changed for Wasmer:**
  - Replaced the @astrojs/vercel adapter with @astrojs/node 9.0.3 in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.
  - Resized 2 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Added a `start` script (`node ./dist/server/entry.mjs`) to package.json so Wasmer can start the Node server.
- **Environment variables:** None.
- **Credit:** theme by [aajafry](https://github.com/aajafry), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

