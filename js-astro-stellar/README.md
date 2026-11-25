<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Stellar](https://github.com/ekmas/stellar) Astro theme by ekmas, copied from commit `6bb6fb599a58b03c8e159d390293f8ead59bd4dd` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-stellar.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Set `site` in astro.config.mjs to the Wasmer demo URL, because 6 home page links pointed at stellar-theme.netlify.app.
- **Environment variables:** None.
- **Credit:** theme by [ekmas](https://github.com/ekmas), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Stellar

Stellar is a modern type-safe documentation theme for Astro.

## Get started 

Visit [documentation](https://stellar-theme.netlify.app/en/introduction/) to get started.

## Features

- Astro v4
- Dark mode
- I18n (type safe)
- MD & MDX support
- Search powered by fuse.js
- Tailwind styling
- View transitions API
- Responsive & SEO-friendly
- Shiki code syntax styling
- Custom import path

## License

MIT
