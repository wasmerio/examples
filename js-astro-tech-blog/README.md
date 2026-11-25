<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Blog](https://github.com/nicdun/astro-tech-blog) Astro theme by nicdun, copied from commit `a0d33371776354b515a1e388ef459281a02fbde1` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-tech-blog.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed the @astrojs/vercel adapter from astro.config.mjs and build a static site, since every page can be prerendered. The package stays in package.json so the lockfile is unchanged.
  - Resized 3 images over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [nicdun](https://github.com/nicdun), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro & Tailwind CSS Starter Kit

## 🔥 Features

Explore the Astro.js Personal Blog Template – a sleek and feature-rich platform for your personal blog:

- **Astro.js v5 Powered**: Dynamic and efficient JavaScript-driven experience.
- **Tailwind CSS Integration**: Ensures a stylish and responsive design.
- **RSS Feed Support**: Keeps your audience updated effortlessly.
- **Markdown Compatibility**: Streamlines content creation with easy formatting.
- **Syntax Highlighting**: Enhances code snippet readability for tech enthusiasts.
- **SEO-Optimized**: Includes a sitemap for optimal search engine visibility.
- **Vercel Deployment:** preconfigured Vercel deployment & web analytics.
- **Framework of your choice:** 100% Astro.js only template - choose your JS Framework (react preinstalled)

Unlock a seamless blend of aesthetics and functionality to share your unique voice with the world.

## 💻 Showcase

![showcase](/public/showcase.png 'AstroPress - Tech Blog Template')

## 📦 Template Integrations

- @astrojs/tailwind - https://docs.astro.build/en/guides/integrations-guide/tailwind/
- @astrojs/react - https://docs.astro.build/en/guides/integrations-guide/react/
- @astrojs/sitemap - https://docs.astro.build/en/guides/integrations-guide/sitemap/
- @astrojs/rss - https://docs.astro.build/en/guides/rss/
- @vercel/analytics - https://vercel.com/docs/analytics/
- rehype-pretty-code - https://rehype-pretty-code.netlify.app/

## 🏛️ Template Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🚀 Getting started

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |


## ❤️ Helping out

If you find that something isn't working right then I'm always happy to hear it to improve this starter! You can contribute in many ways and forms. Let me know by either:

1. [Filing an issue](https://github.com/nicdun/astro-tech-blog/issues)
2. [Submitting a pull request](https://github.com/nicdun/astro-tech-blog/pulls)
3. [Starting a discussion](https://github.com/nicdun/astro-tech-blog/discussions)
4. [Buying me a coffee!](https://www.buymeacoffee.com/nicdun)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/nicdun)

## ☕ Thank you!
A big thank you to the creators of the awesome Astro static site generator and to all using this starter to make the web a bit more accessible for all people around the world :)
