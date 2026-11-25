<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Simple Portfolio](https://github.com/saminnet/astro-simple-portfolio) Astro theme by saminnet, copied from commit `601fbc73792aeb1d80b35d27615bce37fd1c3dd2` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-simple-portfolio-saminnet.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
  - Removed the @astrojs/cloudflare adapter from astro.config.mjs and build a static site, since every page can be prerendered. The package stays in package.json so the lockfile is unchanged.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [saminnet](https://github.com/saminnet), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<h1 align=center>Astro Simple Portfolio</h1>

<p align=center>A simple and high performing portfolio template built with Astro.</p>
<h2 align="center"><a target="_blank" href="https://astro-simple-portfolio.pages.dev" rel="nofollow"> Demo</a> | <a  target="_blank" href="https://pagespeed.web.dev/analysis/https-astro-simple-portfolio-pages-dev/h2jlbf759y?form_factor=desktop"> Page Speed (100) 🚀 </a>
</h2>

![Screenshot](https://github.com/saminnet/astro-simple-portfolio/assets/5575369/ee64b583-1d9c-47f5-9832-863eaf8968a3)

### 📌 Key Features

- 🎨 Highly customizable (Colors, Fonts, etc.)
- 🌅 Supports both static and animated backgrounds
- 🅰️ Incorporates `astro-fonts` for automatic Google fonts optimization
- ⚡ Designed for speed (100 Google PageSpeed Score)
- 🎨 Built with the Tailwind CSS framework
- 📱 Fully responsive across all devices - desktops, tablets, and smartphones
- 💬 Code formatted using [Prettier](https://prettier.io/)
- 🔍 SEO optimized

### 🧞 Commands

This project utilizes [pnpm](https://pnpm.io) as its package manager. However, you have the flexibility to choose your preferred package manager.

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

### ✍️ Contributing

Contributions are welcome. Please open an issue or submit a pull request.

### 📄 License

![GitHub License](https://img.shields.io/github/license/saminnet/astro-simple-portfolio)

This project is licensed under the MIT License
