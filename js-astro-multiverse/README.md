<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Multiverse](https://github.com/AREA44/astro-multiverse) Astro theme by AREA44, copied from commit `0b161fb9ac463d382fb98afc615f6da34d6c9d03` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-multiverse.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml, vercel.json.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [AREA44](https://github.com/AREA44), NOASSERTION. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Multiverse

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)

Say hello to **Multiverse**, a slick, one-page gallery design with a fully functional lightbox. Re-imagined with Astro 7, React 19, and Tailwind CSS 4.

## Tech Stack

- **[Astro 7](https://astro.build)** - Modern web framework for content-driven websites.
- **[React 19](https://react.dev)** - Powering the gallery and lightbox with modern React features and Portals.
- **[Tailwind CSS 4](https://tailwindcss.com)** - Next-generation utility-first CSS framework.
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter)** - High-performance JavaScript/TypeScript linter.
- **[Oxfmt](https://oxc.rs/docs/guide/usage/formatter)** - Ultra-fast code formatter.

## Getting Started

To get started with Astro Multiverse, follow these steps:

```bash
git clone https://github.com/AREA44/astro-multiverse
cd astro-multiverse
pnpm install
pnpm dev
```

## How to Customize

- **Images**: Change your images in the `src/assets` directory.
- **Metadata**: Update site metadata in `src/components/BaseHead.astro`.
- **Styling**: Customize styles in `src/styles/global.css` using Tailwind CSS v4 directives.

## License

**Multiverse** by [AREA44](https://github.com/AREA44). Inspired by the original design from [HTML5 UP](https://html5up.net). Free for personal and commercial use under the [CCA 3.0](https://html5up.net/license) license.

## Credits

Astro Multiverse re-imagines the original template without legacy dependencies:

- Original design by [HTML5 UP](https://html5up.net)
- Re-imagined by [AREA44](https://github.com/AREA44)
- Demo images by [Unsplash](https://unsplash.com)

## Contributions

Contributions to Astro Multiverse are welcome! If you have any suggestions or improvements, feel free to create a pull request.
