<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Shopify Polaris](https://github.com/getmarkus/astro-shopify-polaris) Astro theme by getmarkus, copied from commit `49ea2efbd82d88288824e2090bdd346d59afcbd2` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-shopify-polaris.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed the GitHub Pages sub-path `base: '/astro-shopify-polaris'` from astro.config.mjs, so assets load at the root of the Wasmer app.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [getmarkus](https://github.com/getmarkus), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro + Shopify's Polaris Admin Framework

Here is a quick theme template to experiment with Shopify's design system for Admin Apps called [Polaris](https://polaris.shopify.com/). The goal is to see if it works with [Astro](https://astro.build).

```bash
npm create astro@latest -- --template getmarkus/astro-shopify-polaris
```

[Live Demo](https://www.christophermarkus.com/astro-shopify-polaris/). Please keep in mind this is a work in progress and not functionally complete.

Breaking down this implementation into three broad steps.

### See if Shopify's opinionated React components play well with Astro:

So far so good, Shopify's design system and [React components](https://github.com/Shopify/polaris/tree/main/polaris-react) seem to work well together on first attempt. The only core requirement was to make sure the Components are always wrapped in their [App provider](https://polaris.shopify.com/components/utilities/app-provider).

### See if this integrates in with Shopify's system (WIP)

As would be expected Shopify has requirements for building Apps and Admin extentions that developers need to [follow](https://shopify.dev/docs/apps/tools#app-templates). 

Shopify recommends and provides [remix](https://github.com/Shopify/shopify-app-template-remix) and [node](https://github.com/Shopify/shopify-app-template-node) templates to get started. So this next experiment will be to see if Astro also works.

### Finish out and comply with the full suite of App Design Guildlines (WIP)

Are their any Astro gotchas? I doubt it but this last step will test it out. Need to makes sure this will cover Shopify's [App Design Guidelines](https://shopify.dev/docs/apps/design-guidelines)

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

