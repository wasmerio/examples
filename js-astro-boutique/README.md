<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Boutique](https://github.com/Sv3nskie/astro-theme-boutique) Astro theme by Sv3nskie, copied from commit `c1a5f0943977d65a5990b0b97fe2d33daf2e5f2c` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-boutique.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [Sv3nskie](https://github.com/Sv3nskie), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Boutique — a free Astro theme for small shops

A dark, scroll-driven one-page theme for independent boutiques, showrooms and
small retail brands. Everything moves as a pure function of scroll position, so
it all reverses cleanly on the way back up.

- Pinned hero: a curtain lifts, the logo docks into a frosted-glass header
- "New in" cards fan out from a single stack, with tilt and hover lift
- Brand grid, a sideways-scrolling lookbook, parallax interior shots
- Full-bleed photo band with a pull quote, shop cards with directions and WhatsApp
- Zero client-side dependencies (about 4 kB of JS), respects `prefers-reduced-motion`

## Quick start

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in ./dist
```

Set your production URL in `astro.config.mjs` (`site`) so
canonical and social-card URLs are absolute.

## Make it yours

All copy, links and image paths live in **`src/config.ts`**. You shouldn't need to
touch the components for a normal site.

| To change | Edit |
| --- | --- |
| Shop name, title, description, logo | `site` in `src/config.ts` |
| Photos | drop files in `public/images/` and update the paths in `src/config.ts` |
| Logo | replace `public/logo.svg` (light-coloured, roughly 85 × 90) |
| Brand logos | add `logo: 'images/brands/name.svg'` (black on transparent; inverted to white automatically) or leave it as text |
| Colours, fonts, spacing | the tokens at the top of `src/styles/global.css` |
| Section order | `src/pages/index.astro` |

The images shipped here are generated placeholders. Replace them with your own
photography. Only show brand logos you have permission to use.

Aspect ratios, crop positions and drift amounts for the lookbook and interior
shots are set per image in `config.ts`.

## Credit

The footer carries a small "Theme by Sv3n" link, rendered by
`src/components/ThemeCredit.astro`. It is a regular link with UTM parameters
(`utm_source`, `utm_medium`, `utm_campaign`, and your hostname as `utm_content`).
It's appreciated and keeps the theme free; to remove it, set `credit.enabled` to
`false` in `src/config.ts`.

## Notes

- Fonts load from Google Fonts (Inter). To self-host, swap the `<link>` in
  `src/layouts/Layout.astro` for `@fontsource/inter`.
- If your project path contains `&`, run Astro with `node node_modules/astro/astro.js`
  on Windows; npm's `.cmd` shims can't handle it.

## License

MIT © Sv3n
