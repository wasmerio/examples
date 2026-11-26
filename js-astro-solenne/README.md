<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Solenne](https://github.com/Sv3nskie/astro-theme-solenne) Astro theme by Sv3nskie, copied from commit `f7d0b69373249d55d5cc8dfff5fb118db27eb3ea` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-solenne.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [Sv3nskie](https://github.com/Sv3nskie), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Solenne — Astro theme

A warm, editorial one-page theme for **boutique hotels, B&Bs and guesthouses**. Light and dark mode, a real booking bar, and live "right now" cards for local time and weather — built with plain CSS and one vanilla JS file.

**[Live demo →](https://sv3nskie.github.io/astro-theme-solenne/)**

## Features

- **Booking bar** with a date-range calendar and a guests picker (adults, children, pets). Wire the submit handler to your booking engine.
- **At-a-glance cards:** live local clock, live weather (Open-Meteo, no API key), stay times and travel times.
- **Light / dark mode** that remembers the visitor's choice, with no flash on load.
- **Room gallery, amenities, "book direct" benefits, stats, location reasons and guest stories.**
- **Responsive, accessible, and fast:** responsive images, lazy loading, scroll reveals that respect `prefers-reduced-motion`.
- **Zero dependencies** beyond Astro.

## Getting started

```bash
npm create astro@latest -- --template Sv3nskie/astro-theme-solenne
cd <your-project>
npm run dev
```

## Make it yours

| What | Where |
| --- | --- |
| Hotel name, district, city, SEO, share image | `src/config.ts` |
| Time zone and coordinates for the clock and weather cards | `src/config.ts` |
| Crest / logo | `src/components/Emblem.astro` |
| Section copy and photos | `src/components/*.astro` (one file per section) |
| Colors, type, light/dark tokens | `src/styles/styles.css` |
| Booking bar, calendar, theme toggle | `src/scripts/main.js` |

Placeholder photography is from [Unsplash](https://unsplash.com) — replace it with your own before launch. Icons: [Phosphor](https://phosphoricons.com).

## Deploying

Any static host works (`npm run build` → `dist/`). The included GitHub Actions workflow publishes the demo to GitHub Pages.

## Credits

Designed and built by **[Sven Esser](https://sv3n.dev?utm_source=github&utm_medium=theme-readme&utm_campaign=solenne)** — full-stack & Web3 developer. Need a site for your hotel? [Get in touch](https://sv3n.dev/contact?utm_source=github&utm_medium=theme-readme&utm_campaign=solenne).

MIT licensed. Keeping the small "Theme by Sv3n" credit in the footer is appreciated but not required.
