<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Quell](https://github.com/formgong-hq/quell-astro) Astro theme by formgong-hq, copied from commit `4bc640519a4705fb522d961ed68e6bd58d8b5109` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-quell.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [formgong-hq](https://github.com/formgong-hq), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Quell — free Astro template with a working contact form

A one-page portfolio for an architect, a structural engineer or a small design studio, in a single index.html plus an img/ folder.

![Quell screenshot](./screenshot.png)

**Live demo:** https://quell.formgong.com · **Template page:** https://formgong.com/en/website-templates/quell/?utm_source=github&utm_medium=template&utm_campaign=quell-astro

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/formgong-hq/quell-astro)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/formgong-hq/quell-astro)
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/formgong-hq/quell-astro)

## Features

- One-page, responsive, fonts bundled (no Google Fonts requests)
- Contact form that works without a server, powered by [Formgong](https://formgong.com/?utm_source=github&utm_medium=template&utm_campaign=quell-astro&utm_content=features), a free form backend
- Spam protection (honeypot), success/error states from the real server answer
- Privacy page included · MIT licensed

## Quick start

```sh
npm install
npm run dev     # http://localhost:4321
npm run build   # static site in dist/
```

## Contact form via Formgong

The form posts straight to `https://formgong.com/submit`; no backend, no PHP, no serverless function.


1. Create a form at https://formgong.com/new and copy its access key.
2. Open `src/content.json` and replace `fk_your_access_key` (under `form.access_key`) with that key. Every text of the page lives in the same file.
3. The form sends `access_key`, `subject`, `botcheck`, `name`, `email`, `project`, `location`, `timing`, `message`. The page shows thanks only when Formgong answers `success: true`.

Submissions arrive by email (and optionally Telegram, Slack or Discord). Formgong has a free plan: [create a free form](https://formgong.com/?utm_source=github&utm_medium=template&utm_campaign=quell-astro&utm_content=form-setup).

## Deploy

Build command: `npm run build` · Output directory: `dist`. Works on Netlify, Vercel, Cloudflare and any static host.

## Files


```
public/
  fonts/
    archivo-normal-100-900-62125-latin-ext.woff2
    archivo-normal-100-900-62125-latin.woff2
    OFL-Archivo.txt
  img/  (15 files)
  site.css
  site.js
src/
  components/  (10 files)
  layouts/
    Base.astro
  pages/
    index.astro
  content.json
.gitignore
astro.config.mjs
LICENSE
package.json
```

## Images

The photos were generated for this template (ChatGPT image generation, OpenAI). The places and people are fictional. Replace them with your own before launch.

## Fonts

Archivo: bundled as WOFF2 files (Latin and Latin Extended), no requests to Google Fonts. SIL Open Font License 1.1, the licence texts are next to the font files.

MIT license.

## License

MIT © Formgong. Demo names, texts and photos are fictional sample content. Questions: support@formgong.com
