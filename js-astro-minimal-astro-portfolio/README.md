<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Kaizen](https://github.com/bytekai/minimal-astro-portfolio) Astro theme by bytekai, copied from commit `0666c732bd4d8d13e42d84257fdf3ee4876791fa` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-minimal-astro-portfolio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.toml.
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [bytekai](https://github.com/bytekai), Apache-2.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Free Minimal Astro Portfolio

A modern, minimalist portfolio website built with Astro and deployed on Cloudflare Pages. Features a collection of writings, projects, and professional experiences.

![alt text](image.png)

## Overview

This is a personal portfolio website for ByteKai, a Software Engineer and Curious Tinkerer. The site showcases blog posts, technical notes, project work, and professional experience in a clean, fast-loading format.



## Features

- 🚀 Built with [Astro](https://astro.build) v5.1
- ⚡️ Deployed on [Cloudflare Pages](https://pages.cloudflare.com)
- 📝 Content sections:
  - Blog posts
  - Technical notes
  - Project showcase
  - Professional experience
  - Curated bookmarks
- 🎨 Clean typography with:
  - Inter
  - Roboto Mono
  - Source Sans Pro
- 🌐 Social presence integration
- 📱 Fully responsive design

## Tech Stack

- **Framework**: [Astro](https://astro.build) 5.1.2
- **Deployment**: Cloudflare Pages
- **Fonts**: 
  - @fontsource/inter
  - @fontsource/roboto-mono
  - @fontsource/source-sans-pro

## Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or pnpm

### Local Development

1. Clone the repository
2. Run `pnpm install` to install dependencies
3. Run `pnpm dev` to start the development server
4. Open your browser and navigate to `http://localhost:4321` to view the site

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Astro](https://astro.build)
- [Fontsource](https://fontsource.org)
- [Tailwind CSS](https://tailwindcss.com)

