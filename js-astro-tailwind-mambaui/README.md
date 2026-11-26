<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Tailwind Mambaui](https://github.com/getmarkus/astro-tailwind-mambaui-template) Astro theme by getmarkus, copied from commit `ac1235ab3bf33e580381edbe8e99e51174c53c33` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-tailwind-mambaui.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed the GitHub Pages sub-path `base: '/astro-tailwind-mambaui-template'` from astro.config.mjs, so assets load at the root of the Wasmer app.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [getmarkus](https://github.com/getmarkus), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Example Astro template for the MAMBA UI (Tailwind) component library

The criteria for this combination of [Astro](https://astro.build)* and [MAMBA UI](https://mambaui.com/)* was:
* Copy/paste html
* Responsive components
* Minimal js or jsx and at most Alpine.js support
* Open source or permissible

Astro* and MAMBA UI* - not affiliated (just a fan)

Note: not fully functional and just the main example layout pages

```
npm create astro@latest -- --template getmarkus/astro-tailwind-mambaui-template
```