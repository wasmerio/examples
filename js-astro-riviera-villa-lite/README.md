<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Riviera Villa Lite](https://github.com/riviera-themes/riviera-villa-lite) Astro theme by riviera-themes, copied from commit `b80dcab3868c17e0af4c821521629975eabb8997` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-riviera-villa-lite.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [riviera-themes](https://github.com/riviera-themes), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Riviera Villa: an Astro theme for a holiday villa's direct-booking website

> **Lite edition** (free, MIT licence): one language, no availability calendar. Riviera Villa Pro adds four languages, a calendar synced with Airbnb, Booking.com and Vrbo, and Google VacationRental data. [Get Riviera Villa Pro](https://buy.polar.sh/polar_cl_giwhNBpe2Jzsty2tFyBLdPs9DhWoZR2KeRGla15k4Tj)

A calm, photo-first website for one holiday rental. Guests read about the house, check the dates and send a booking request straight to the owner, with no platform fee.

Built with Astro 7, Tailwind CSS 4 and TypeScript. No cookie, no tracker, no Google Fonts request.


## Start in 5 minutes

You need [Node.js](https://nodejs.org) 22.23 or newer.

```sh
npm install
npm run dev          # http://localhost:4321
```

1. Open `villa.config.ts`. Every text and setting of the site is in this one file: name, address, capacity, rates by season, reviews, FAQ, house rules, contact, colours.
2. Put your photos in `src/assets/photos/`, with the file names used in `villa.config.ts` (or change the names there).
3. Run `npm run build`. The site is written to `dist/`, ready for any static host.

The build checks `villa.config.ts` and stops with a clear message if a translation, a photo or a value is missing:

```
villa.config.ts has 2 problem(s):
  - translation hero.title: missing de
  - gallery[3].image: "kitchen.jpg" is not in src/assets/photos/
```

## Customise

### Texts and languages

Each text visitors read is written once per language, one line each:

```ts
title: {
  fr: 'Une villa face à la mer,\nà *Ramatuelle*',
  en: 'A villa facing the sea,\nin *Ramatuelle*',
},
```

- `*word*` sets a word in italics (and in the accent colour); `\n` starts a new line.
- `languages.active` lists the languages to publish. You only need translations for those.
- Interface texts (menus, form labels, calendar) are in `src/i18n/ui/<language>.ts`.

### Sections

Hide a section with `sections` in `villa.config.ts` (for example `faq: false`). Reorder sections in `src/views/home-page.astro`.

### Colours and fonts

`theme.colors` sets the background, the surface (cards, menu), the text and the accent colour. Shades are computed from them.

Fonts are self-hosted with Fontsource. To change one:

```sh
npm install @fontsource/playfair-display
```

then replace the imports in `src/styles/fonts.css` and the family name in `theme.fonts`.

### Photos

- Use landscape photos, 1800 px wide or more (2400 px for `hero.jpg`). Astro resizes them and serves WebP in several sizes.
- `hero.jpg` sits behind the white title: keep calm sky or water in the lower left part.
- The theme ships sober placeholders (`npm run photos:placeholders` puts them back).
- Google asks for at least 8 photos, including a bedroom, a bathroom and a common area: set `category` on each gallery photo.

## Booking requests

The form checks the dates, the number of guests, the minimum stay of the season and, when the calendar is on, nights already booked. It then sends the request by email through a free form service. Nothing runs on your server.

**Web3Forms** (free plan, no account needed beyond your email):

1. Get an access key at [web3forms.com](https://web3forms.com).
2. In `villa.config.ts`: `booking: { provider: 'web3forms', key: 'your-access-key' }`.

**Formspree**:

1. Create a form at [formspree.io](https://formspree.io) and copy its ID (the end of `https://formspree.io/f/xxxxxxx`).
2. `booking: { provider: 'formspree', key: 'xxxxxxx' }`.
3. The form posts with JavaScript: if Formspree answers with a reCAPTCHA error, turn reCAPTCHA off in the form settings.

A pasted address (`https://formspree.io/f/xwkgabcd`) is reduced to its ID, and a key in the wrong format stops the build with an example of the right one.

Spam: the form carries the hidden trap field of each service (`botcheck` for Web3Forms, `_gotcha` for Formspree) and sends it, so the service drops what robots fill in. If spam still comes through, add the captcha your service documents (Web3Forms: hCaptcha; Formspree: reCAPTCHA, hCaptcha or Cloudflare Turnstile with your own keys). A captcha loads a third-party script: mention it in your privacy page.

Both keys are public by design: they only allow sending a message to you.

**No service** (`provider: 'none'`, or an empty key): the button opens WhatsApp or the guest's email app with the request already written.

Without JavaScript, the form posts straight to Web3Forms or Formspree; with no service, it is replaced by the WhatsApp and email buttons.


## Deploy

| Host | Settings |
|---|---|
| **Cloudflare Pages** | Build command `npm run build`, output `dist`. Add the variable `NODE_VERSION` = `24`. |
| **Netlify** | Build command `npm run build`, publish directory `dist`. `public/_headers` is applied. |
| **Vercel** | Framework preset Astro, output `dist`. |
| **Any static host** | Upload the content of `dist/`. |

Set `site.url` in `villa.config.ts` to the final address before the build: canonical links, the sitemap and sharing previews use it. The build warns while it is still `example.com`.

## SEO

- Title and description per language, canonical link, `hreflang` links between languages, `<html lang>`.
- `sitemap-index.xml` with language alternates, and `robots.txt`.
- Open Graph image (1200 × 630) made from `seo.shareImage`.
- Images are optimised by Astro's `<Image>` component (WebP, several widths, lazy loading below the fold).

## Privacy, accessibility, speed

- No cookie, no analytics, no third-party request on page load. The map is a link to OpenStreetMap, not an embed.
- France: the tourist rental registration number (`property.registrationNumber`) is shown in the footer.
- Keyboard navigation everywhere (menu, photo viewer), visible focus, labels on every field, `prefers-reduced-motion` respected, contrasts checked on the default colours.
- About 16 KB of JavaScript (minified, before compression), split per feature. Without JavaScript every text and photo still shows, and guests can still write by WhatsApp or email.

## Commands

| Command | |
|---|---|
| `npm run dev` | Local site with live reload |
| `npm run build` | Production site in `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run check` | Type check (`astro check`) |
| `npm test` | Unit tests (Vitest) |
| `npm run photos:placeholders` | Put the placeholder images back |

## Working with an AI assistant

`AGENTS.md` and `CLAUDE.md` explain the theme to coding assistants (Claude Code, Cursor, Copilot...). Ask yours: "Replace the demo villa with my property: here are my texts and photos."

## Help and licence

- Help and common questions: `docs/help.md`.
- Licence: see `LICENSE.md`. The demo photos are not part of the theme.
