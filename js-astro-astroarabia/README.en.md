# AstroArabia

[🇸🇦 العربية](./README.md) | [🇬🇧 English](./README.en.md)

[![License: MIT](https://img.shields.io/badge/license-MIT-1f6b58?style=flat-square)](./LICENSE)
![Lighthouse ready](https://img.shields.io/badge/Lighthouse-ready-16a34a?style=flat-square)
![RTL-first](https://img.shields.io/badge/RTL-first-1f6b58?style=flat-square)
![Minimal JS](https://img.shields.io/badge/Minimal-JS-102a2b?style=flat-square)

<img src="./public/astroarabia-preview-en.png" alt="AstroArabia English interface preview" width="1147" />

> [View the live demo](https://astroarabia.pages.dev) — automatically deployed from the `main` branch.

AstroArabia is an open-source, Arabic-first RTL Astro theme starter for the Saudi and wider Arabic technical community. It gives teams a fast, clear path to launch company sites, digital products, portfolios, and campaign pages with native RTL support and minimal client-side JavaScript.

## Highlights

- Built with Astro for fast, static-first output.
- Integrated with Tailwind CSS v4 and a centralized color, spacing, and typography system.
- RTL-first layouts, logical spacing, and direction-aware interactions.
- Dark mode powered by the Tailwind `dark:` variant, with visitor preference persisted locally.
- SEO-ready defaults including canonical URLs, Open Graph metadata, and generated sitemaps.
- Five production-ready routes: agency, SaaS, documentation, portfolio, and landing page.
- Reusable CVA-powered UI primitives for buttons and cards.

## Quick Start

```bash
npm create astro@latest -- --template almahers/astroarabia
```

Then install dependencies and start the local server:

```bash
cd astroarabia
npm install
npm run dev
```

This project requires Node.js `22.12.0` or later and npm `9.6.5` or later. Use an even-numbered or LTS Node.js release.

## Versions and Developer Tooling

The following are the lockfile-resolved versions at the last project audit. Update this table whenever dependencies are upgraded.

| Area           | Package or tool                             | Version            |
| -------------- | ------------------------------------------- | ------------------ |
| Framework      | Astro                                       | `7.2.9`            |
| Build          | Vite                                        | `8.2.2`            |
| Styling        | Tailwind CSS and `@tailwindcss/vite`        | `4.3.3`            |
| Types          | TypeScript                                  | `6.0.3`            |
| Validation     | `@astrojs/check`                            | `0.9.10`           |
| Linting        | ESLint and `eslint-plugin-astro`            | `10.9.1` / `1.7.0` |
| Formatting     | Prettier and `prettier-plugin-astro`        | `3.9.6` / `0.14.1` |
| SEO            | `@astrojs/sitemap`                          | `3.7.3`            |
| Content        | `astro-toc-smol`                            | `0.4.4`            |
| UI utilities   | CVA and `clsx`                              | `0.7.1` / `2.1.1`  |
| Fonts          | Alexandria and IBM Plex Sans Arabic         | `5.3.0`  |
| Sharing        | `astro-social-share`                        | `2.2.0`            |

## Key Project Structure

```text
src/
├── components/
│   ├── ui/                 # CVA-powered Button and Card primitives
│   ├── SiteHeader.astro
│   ├── SiteFooter.astro
│   └── QuoteForm.astro
├── layouts/
│   └── BaseLayout.astro
├── content/
│   └── blog/               # Markdown articles
├── content.config.ts        # Astro content schema
├── assets/                  # Build-optimized images
├── lib/                     # Shared helpers
├── pages/
│   ├── index.astro         # Home page
│   ├── agency/             # Agency and services preset
│   ├── saas/               # SaaS preset
│   ├── docs/               # Documentation preset
│   ├── portfolio/          # Portfolio preset
│   └── landing/            # Landing page preset
└── styles/
    └── global.css
public/                      # Public files and robots.txt
astro.config.mjs             # Astro integrations and site settings
tailwind.config.mjs          # Theme tokens and Tailwind utilities
```

## Commands

| Command                | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `npm install`          | Install project dependencies                      |
| `npm run dev`          | Start the local development server                |
| `npm run build`        | Create a production build in `dist`               |
| `npm run check`        | Validate Astro components and types               |
| `npm test`             | Run the project test suite                        |
| `npm run lint`         | Run code-quality checks                           |
| `npm run format:check` | Check Prettier formatting without modifying files |
| `npm run format`       | Format files with Prettier                        |

## Brand and Theme Customization

Start with `tailwind.config.mjs` to update the color, font, and spacing utilities used by components. Matching theme tokens also live in `src/styles/global.css` under `@theme`, so update both locations when changing the template identity. The project ships IBM Plex Sans Arabic locally for body text and Alexandria for headings.

## Template Settings

Copy `.env.example` to `.env`, then set `PUBLIC_WHATSAPP_NUMBER` to your project’s WhatsApp number using digits only and without the `+` prefix. The bundled number is intentionally a placeholder so the template never points to a personal number.

The quote form is a ready-to-customize interface only: it does not submit data and does not require a particular provider. Connect it to the approach that suits your project, such as Cloudflare Pages Functions, a Worker, or an external form provider, with appropriate validation and protection.

AstroArabia is free for the Arabic web community under the [MIT License](./LICENSE). Replace the example links and content with your project identity before a public launch. Lighthouse scores vary with your content, hosting, and additions, so test the final deployment before launch.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/almahers/astroarabia)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/almahers/astroarabia)

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Pages-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/pages/new/provider/github)

For manual deployment, use the following build command and publish the `dist` directory:

```bash
npm run build
```

## Contributing and License

Contributions that improve the Arabic web experience are welcome. Read the [contribution guide](./CONTRIBUTING.md) before opening a pull request.

Released under the [MIT License](./LICENSE).
