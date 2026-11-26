<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Vanilla Framework](https://github.com/getmarkus/astro-vanilla-framework) Astro theme by getmarkus, copied from commit `b055fc0f5f9d8729099907b61bba31566b5ee51e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-vanilla-framework.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed the GitHub Pages sub-path `base: '/astro-vanilla-framework'` from astro.config.mjs, so assets load at the root of the Wasmer app.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [getmarkus](https://github.com/getmarkus), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Example template for the Ubuntu Vanilla CSS Component framework

I have been working with Tailwind CSS recently and wow is it efficient to work with. But sometimes you need an "enterprise" friendly or more "industrial" look. 

Then I found Ubuntu's [Vanilla](https://vanillaframework.io/) CSS framework. 

Here is an [Astro](https://astro.build/) template to show off some capablities.

* SASS/SCSS framework
* Minimal
* Well used and tested (Ubuntu products)
* Alpine.js friendly
* Permissive license

Ubuntu* - not affiliated (just a fan)

```
npm create astro@latest -- --template getmarkus/astro-vanilla-framework
```

* [Ubuntu Vanilla 4.0 announcement](https://ubuntu.com/blog/vanilla-4-0-release)
* [Ubuntu Vanilla Github release notes](https://github.com/canonical/vanilla-framework/releases/)

### Attribution
* [logo](https://logoipsum.com/)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


