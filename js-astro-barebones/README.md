<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [SuperWeb Barebones](https://github.com/superwebthemes/barebones) Astro theme by superwebthemes, copied from commit `683a244ba4a00fd802274ab39f5bdbb734eb54a9` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-barebones.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [superwebthemes](https://github.com/superwebthemes), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Introducing Barebones 🦴

![barebones-cover](https://github.com/user-attachments/assets/bde6d3af-472f-4320-96ec-b70040098ea9)

[View demo](https://barebones.trevortylerlee.com/)

Welcome to Barebones, an open source template for [Astro](https://astro.build/) designed for simplicity and flexibility. Whether you're a seasoned developer or just starting out, Barebones provides everything you need to kickstart your next blog with minimal setup.

Head over to the [repository](https://github.com/trevortylerlee/barebones) and check out our [documentation](https://barebones.trevortylerlee.com/docs) to get started.

## Key features

- **Fast by default:** Leverage the power of Astro, Tailwind CSS, and Markdown to create fast, lightweight web pages.
- **Minimal and customizable:** Solid foundation to build upon and meet your unique needs. Zero frameworks installed.
- **SEO-friendly:** Sitemap, an [RSS feed](https://barebones.trevortylerlee.com/rss.xml), and Open Graph protocol support out of the box.
- **Accessible to all:** System, dark, and light mode support. Keyboard navigation and semantic HTML.
- **Free and open source:** Join the community and contribute to make this project even better!

## Core Web Vitals

Performance: **100**

Accessibility: **100**

Best Practices: **100**

SEO: **100**

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
