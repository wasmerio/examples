<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astrogent](https://github.com/fauziralpiandi/astrogent) Astro theme by fauziralpiandi, copied from commit `6a943912ea0e2a4c556f7eb08fd71e55a1338141` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-astrogent.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [fauziralpiandi](https://github.com/fauziralpiandi), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# AI Agent Landing Page

![Demo](public/screenshot.jpeg)

A modern, production-ready landing page template for AI and SaaS products. Built with Astro and Tailwind CSS.

## Features

- ⚡️ **Astro 5** - Fast, static site generation
- 🎨 **Tailwind CSS 4** - Modern styling with CSS-first config
- 📱 **Fully Responsive** - Mobile-first design
- ♿ **Accessible** - Semantic HTML & ARIA compliant
- 🎭 **Smooth Animations** - Scroll-triggered effects
- 🎯 **SEO Ready** - Meta tags & Open Graph
- 🧩 **Modular Components** - Easy to customize

## Sections

- Hero with stats
- Features grid (9 cards)
- How it works (4 steps)
- Testimonials (6 with company logos)
- Pricing tiers (3 plans)
- FAQ accordion (6 questions)
- Contact form
- Footer

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Customization

Edit content in:

- `src/config.ts` - Site configuration
- `src/content/*.ts` - Features, testimonials, FAQ
- `src/styles/globals.css` - Colors & animations

## Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)

Works on Replit, Vercel, Netlify, and GitHub Pages.

## License

[MIT](LICENSE)
