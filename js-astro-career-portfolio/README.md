<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Career Portfolio: Data-Driven Astro SSG](https://github.com/nbakh16/career-portfolio-template) Astro theme by nbakh16, copied from commit `1367d019ce8399f528fbc49388c47d796c395410` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-career-portfolio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** The theme's example env file lists `PUBLIC_API_URL`, `SITE_URL`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [nbakh16](https://github.com/nbakh16), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# CareerPortfolio: Data-Driven Astro SSG
Live Demo: [careerportofio.netlify.app](https://careerportofio.netlify.app)

[![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/🤝_Contributions-Welcome-blue)](CONTRIBUTING.md)

A high-performance, responsive portfolio built with **Astro**, **Tailwind CSS**, and **Native Browser Animations**. Designed to be 100% data-driven and easy to customize as a reusable template.

## 🌟 Highlights
- **Zero-JS by Default:** Leveraging Astro's islands architecture.
- **JSON-First:** Update your information in `src/data/` without touching any code.
- **SEO & AI Ready:** Auto-generated `sitemap.xml`, `robots.txt`, and `/llms.txt` endpoint for AI/LLM crawlers, full Open Graph/Twitter Card support and JSON-LD structured data.
- **Built-in Themes**: Switch between multiple professional color palettes and light/dark modes from a single config file.
- **Fully Responsive:** Optimized for mobile, tablet, and desktop.
- **Performance:** Optimized for perfect Lighthouse scores.

## 🛠️ Tech Stack
- **Frontend:** [Astro](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Iconify](https://iconify.design/) via `astro-icon`
- **Deployment:** [Netlify](https://www.netlify.com)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) *(Works without backend — open source release coming soon)*

## 🚀 Getting Started
Follow these instructions to get a local copy up and running.

### Prerequisites
Make sure you have **Astro v6** and **Node.js** (v22.12.0 or higher) installed on your machine.

### Installation
1. Click **Use this template** on this repository.
2. Choose **Create a new repository**.
3. Clone your new repository: `git clone <your-repo-url>`
4. Navigate to your repo: `cd <your-repo-name>`
5. Install dependencies: `npm install`
6. Start development server: `npm run dev`
7. Update your content in `/src/data/`
8. Build and deploy on your preferred platform


## 🛠️ How to Customize
To make this portfolio yours, simply edit the JSON files in `src/data/`.

### 🎨 Switching Themes
This template comes with multiple built-in color palettes. To change the theme of your portfolio, open `src/config.ts` and update the `baseTheme` variable to one of the available options:

```typescript
export const SITE_CONFIG = {
  // Options: 'default', 'strategic', 'innovator', 'executive'
  baseTheme: 'default', 
};
```
*(The template will automatically handle the dark/light mode toggles for whichever base theme you choose!)*

### 📁 Directory Structure
```
├── public/              # Global static assets (placeholder.jpg, favicon)
├── src/
│   ├── assets/          # Project & Profile images (Supports automatic Astro optimization)
│   ├── components/      # Reusable Astro components
│   ├── data/            # JSON files for project data
│   ├── layouts/         # Layout templates with Meta tags
│   ├── pages/           # Site routes (index.astro)
│   └── styles/          # Global CSS styles
│   └── config.ts        # Global site configuration
├── astro.config.mjs     # Astro configuration
└── tsconfig.json        # TypeScript configuration
```

### 🔍 SEO & AI Optimization
All SEO and AI metadata is driven from `src/data/home.json`. Update the fields below to improve search engine, social media and AI crawler visibility:

| Field | Description |
| :------------ | :----------------------------------------------------------- |
| `siteUrl` | Your deployed domain (e.g. `https://yourname.dev`). Required for canonical URLs, sitemap and absolute OG image links. |
| `webpageTitle` | Page tab title and Open Graph title tag. |
| `description` | Primary intro summary used for meta description, Open Graph, Twitter preview cards and `/llms.txt`. |
| `lang` | Page language code (e.g. `en`, `fr`, `de`). Sets the `<html lang>` attribute. |
| `jobTitle` | Your role — included in JSON-LD structured data shown to search engines and `/llms.txt`. |
| `keywords` | Comma-separated keywords for the `<meta name="keywords">` tag. |
| `twitterHandle` | Your Twitter/X username (with or without `@`). Enables Twitter Card attribution. |
| `ogImageUrl` | Path to your Open Graph preview image. Use a **1200×630 px** image for best results across all platforms. |

> **Automatic Features:**
> - `sitemap-index.xml` & `robots.txt`: Auto-generated at build time.
> - `/llms.txt`: Dynamically generated Markdown portfolio route for AI agents and LLM web crawlers (powered by [`src/pages/llms.txt.ts`](file:///Users/nabil/_projects/astro-trial/career-portfolio-template/src/pages/llms.txt.ts)).



### 📚 Useful commands and links for reference:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

Tailwind CSS: `npx astro add tailwind`

Inter font: `npm install @fontsource-variable/inter` 

Space Grotesk font: `npm install @fontsource-variable/space-grotesk`

Astro-icon: `npx astro add astro-icon`

Material Desing Icons: `npm install @iconify-json/mdi`

https://docs.astro.build/en/guides/styling/#add-tailwind-4

https://www.astroicon.dev

https://icon-sets.iconify.design/mdi/?category=Material

## 🤝 Contributing
Contributions are welcome!  
Please read the [Contributing Guide](CONTRIBUTING.md) before opening a PR.

## 📝 License
This project is licensed under the [MIT License](LICENSE)
