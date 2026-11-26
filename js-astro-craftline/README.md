<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Craftline](https://github.com/formgong/craftline-astro-theme) Astro theme by formgong, copied from commit `749dd81e164f760ed4e826fb71cbf6a7db85eff7` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-craftline.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
- **Environment variables:** The theme's example env file lists `PUBLIC_FORMGONG_ACCESS_KEY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [formgong](https://github.com/formgong), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Craftline

A free Astro theme for local service businesses: plumbers, electricians, cleaners, handymen and contractors.

**Live demo:** https://craftline.formgong.com · **No build step?** Download `craftline-html.zip` from the [latest release](https://github.com/formgong/craftline-astro-theme/releases/latest): plain HTML files, replace `fk_your_access_key` and `https://example.com` with your own and upload them anywhere.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/formgong/craftline-astro-theme) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fformgong%2Fcraftline-astro-theme&project-name=craftline&repository-name=craftline&env=PUBLIC_FORMGONG_ACCESS_KEY&envDescription=Your%20Formgong%20access%20key%20%28fk_...%29.%20Create%20a%20free%20form%20to%20get%20one.&envLink=https%3A%2F%2Fformgong.com%2Fnew%3Fname%3Dcraftline)

Each button copies the theme to your GitHub, builds it and asks for one value: your Formgong access key (`fk_…`), free at https://formgong.com/new. The form works from the first deploy. Then set `url` in `src/config.ts` to your domain.

The demo business is **Northside Plumbing & Heating**, a fictional plumber in the fictional town of Fernhollow. Everything you see is sample content: phone numbers use the 555-01xx range reserved for fiction, and every email and link uses `example.com`.

- **One file to rebrand.** Name, phone, address, service areas, hours, social links, accent color and the form key live in `src/config.ts`.
- **A home page that tells a story.** The hero picture is the first frame of a scroll story: a leak at 11:40 pm, a form sent from a phone, a van on the way, a fixed price, a dry floor. The house is a real CSS 3D object, seen at a fixed three-quarter angle, with a cutaway front wall where the leak and the repair happen. Everything is driven by CSS (scroll-driven animations). No animation library, no WebGL, no JavaScript.
- **A quote form that never fakes success.** It shows "Request received" only when the form backend answers `success: true`. Errors and lost connections show an error. Without JavaScript it still works as a plain HTML form.
- **Dark, light type, one loud accent.** A navy ground, large light-weight display type with the key words in the accent, solid accent service cards with small line animations that explain each service, stat counters, a large quote panel, and an ambient pipe network behind the hero.
- **Fast and accessible.** Static pages, one self-hosted variable font, two tiny scripts (the form and closing the mobile menu). Labels on every field, visible focus, AA contrast on every text color pair, `prefers-reduced-motion` respected.

Built with Astro 7, Tailwind CSS 4 and TypeScript.

## Quick start

```sh
npm create astro@latest -- --template formgong/craftline-astro-theme
cd your-project
npm run dev
```

Or clone the repository and run `npm install`, then `npm run dev`. Node 22.12 or newer is required.

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Local dev server at `http://localhost:4321`    |
| `npm run build`   | Static site in `dist/`                         |
| `npm run preview` | Serve the built site locally                   |
| `npm run check`   | Type-check `.astro` and `.ts` files            |

## Rebrand it

Open `src/config.ts`. The main fields:

| Field                         | Used for                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `name`, `shortName`, `tagline`, `description` | Header, footer, page titles, meta description, JSON-LD       |
| `url`                         | Canonical URLs, Open Graph, sitemap, robots.txt and the form's redirect      |
| `schemaType`                  | schema.org type: `Plumber`, `Electrician`, `HVACBusiness`, `RoofingContractor`, `GeneralContractor` or `LocalBusiness` |
| `phone`, `emergencyPhone`, `email`, `address` | Click-to-call buttons, contact page, footer, JSON-LD          |
| `serviceAreas`                | Service area list and map (the first eight get a pin), JSON-LD `areaServed`  |
| `hours`, `hoursNote`          | Contact page, footer, JSON-LD opening hours                                  |
| `social`                      | Footer icons. Real profile URLs are also added to JSON-LD `sameAs`           |
| `trust`                       | License number, years, rating, response time, call-out fee. Sample values: replace them, then clear `trust.note` |
| `theme.accent`, `theme.accentText` | The one accent color (highlighted words, buttons, service cards) and the text color on accent fills (keep 4.5:1 contrast) |
| `formgong`                    | Fallback access key, endpoint and email subject for the quote form           |

Replace the logo in `src/components/Logo.astro` and `public/favicon.svg`, and regenerate `public/og.png` (1200×630) and `public/apple-touch-icon.png` (180×180).

The JSON-LD block deliberately has no star rating: search engines ignore ratings a business publishes about itself.

## Set up the form

The quote form posts to [Formgong](https://formgong.com), a hosted form backend, so you don't need a server.

1. Create a free form at [formgong.com/new](https://formgong.com/new?name=Website%20quote%20form) (or from the dashboard if you already have an account).
2. Copy the form's access key. It starts with `fk_` and is public by design: it only lets visitors send submissions to that one form.
3. Add it to a `.env` file in the project root:

   ```sh
   PUBLIC_FORMGONG_ACCESS_KEY=fk_your_access_key
   ```

   or set `formgong.accessKey` in `src/config.ts`. While the placeholder key is in use, the dev server shows a reminder above the form.
4. Set `url` in `src/config.ts` to your real domain. Visitors without JavaScript are redirected to `/thanks/` on that domain.

Submissions arrive by email and, if you connect it, in Telegram. The free plan covers 250 submissions a month.

**The Formgong credit links your review page.** With a real access key, the build asks Formgong once (`POST https://formgong.com/api/review-page` with the key and your site's `url`). Formgong makes a public review page for your site the first time, where your clients can read and leave reviews, and the "Formgong" link next to the form points there. You can switch the page off in the Formgong dashboard (Reviews → your site → Settings), or change the link in `src/components/Footer.astro`. With the placeholder key or another form backend nothing is sent and the link goes to formgong.com.

**How the form behaves**

- Without JavaScript: a normal `POST` to `https://formgong.com/submit`. The hidden `_redirect` field sends the visitor to `/thanks/` afterwards.
- With JavaScript: the same fields are sent with `fetch` and `Accept: application/json`. The button is disabled while sending. The success state, with its checkmark animation, appears only when the JSON response has `success === true`. Any other response shows the server's `message`. A network failure shows an error and the phone number.
- The hidden `botcheck` field is a spam honeypot. Keep it empty and keep it in the markup.

**Using another form backend.** Any service that accepts a standard form `POST` works. Set `PUBLIC_FORMGONG_ENDPOINT` (or `formgong.endpoint`) to its URL and rename the hidden fields to what that service expects. If its JSON response is shaped differently, change the single `reply?.success === true` check in `src/components/QuoteForm.astro`.

## Edit the content

- **Services:** one Markdown file per service in `src/content/services/`. Frontmatter: `title`, `summary`, `order`, `priceFrom`, `priceNote`, `duration`, `included` (list), `featured` (adds the emergency number to the card) and `art`, the card's line animation: `pulse`, `sonar`, `drain`, `bars`, `wave` or `drip` (see `src/components/ServiceArt.astro`). The body is the service page.
- **Headings:** wrap key words in asterisks to show them in the accent, for example `title="What we fix, and what it *usually costs*"` (section headings, page headers and the quote section).
- **Testimonials:** `src/content/testimonials.json`. Each review can point to a service by its file name. The demo reviews are samples and are labeled as such on the page.
- **FAQ:** `src/content/faq.json`.
- **Page copy:** the home page story captions are in `src/components/story/StoryHero.astro`; the hero headline and bullets in `src/pages/index.astro`.

Some sample figures appear in copy as well as in the config (the $129 call-out in the FAQ, the $149 repair in the story). Search for `$` when you change prices.

## The home page story

Four files:

- `src/components/story/StoryHero.astro`: hero text and the six chapter captions.
- `src/components/story/StoryScene.astro`: three stacked layers that share one coordinate system: the sky and road (SVG), the house (below), and the cards, phone and van in front of it (SVG).
- `src/components/story/House3D.astro`: the house as a CSS 3D box (`transform-style: preserve-3d`): four walls, floor, a two-plane roof and a chimney. The front wall is the cutaway with the kitchen, pipes and boiler that the story animates.
- `src/styles/story.css`: layout, the 3D geometry and the timelines.

The scene is a 1200×600 canvas anchored to the right edge. The frame is a size container, and one canvas unit is `--u = max(100cqw / 1200, 100cqh / 600)` pixels, so the SVG layers and the 3D house line up exactly at any frame size. On wide layouts the unit is capped so the house stays in the right half.

The house itself never moves. It sits at one fixed three-quarter angle (the cutaway faces you, the left wall and the roof show), and only the things inside the cutaway and the cards around it animate. An earlier version turned the house with the scroll; on a pinned stage that read as the house jumping, so the 3D wrappers now have no animations at all.

Each caption block declares a named view timeline (`--ch1` … `--ch6`) and the story wrapper shares them with `timeline-scope`. Every animated part of the scene follows exactly one chapter, with `animation-range` set per layout. When something has to appear in one chapter and leave in a later one, it sits inside two nested groups with one animation each. On desktop the scene is pinned next to the captions; on phones it is pinned at the top (about 55% of the screen) and the captions scroll underneath.

Browsers without scroll-driven animations or `timeline-scope`, and visitors who prefer reduced motion, get a static version: a front-facing house that doesn't move, and a small picture next to each caption. Nothing is hidden. The scroll version was checked in Chrome and in WebKit (Playwright's WebKit 27.2, via a recorded video: its screenshot path flattens every 3D transform, even a plain test cube).

To adapt the story to another trade, rewrite the captions and redraw the parts of the scene you need, or replace `StoryHero` with a plain hero in `src/pages/index.astro`.

Two CSS details that keep it working:

- Scroll-driven rules use longhand properties (`animation-name`, `animation-timeline`, …). A minifier can merge a shorthand and `animation-timeline` into one declaration that Chrome rejects.
- Wrappers around revealed content use `overflow: clip`, not `overflow: hidden`. `overflow: hidden` creates a scroll container, and a view timeline inside it would track that box instead of the page.

## Look

Dark first: navy ground (`--c-bg`), near-white type, one accent from `theme.accent`. Display type is Urbanist at a light weight; the key words of each heading take the accent and a thin accent rule follows the lead. Service cards are solid accent blocks with dark type. Colors are tokens at the top of `src/styles/global.css`.

## Motion

All motion is CSS and SVG. Page-to-page transitions use native cross-document View Transitions (`@view-transition`), so there is no client router. Sections fade in with `animation-timeline: view()` where supported. The stat numbers count up once as they scroll in (a registered integer property printed with `counter()`; screen readers get the plain number). The pipe network behind the hero (`src/components/story/PipeNetwork.astro`) is generated at build time from a fixed seed, with slow water pulses along some runs. Hover effects move only `transform` and `opacity`. With `prefers-reduced-motion: reduce` there are no transitions, reveals, counters or ambient animations: everything shows its final state.

## Project structure

```text
src/
├── components/
│   ├── story/          StoryHero, StoryScene (SVG layers), House3D (CSS 3D house), PipeNetwork, StoryVignette (static fallback pictures)
│   ├── sections/       Stats, services grid, quote panel, how it works, areas, reviews, FAQ, quote section
│   ├── illustrations/  Van, map placeholder
│   ├── QuoteForm.astro The form and its script
│   ├── Head.astro      Meta tags, Open Graph, JSON-LD
│   ├── Header.astro, Footer.astro, Logo.astro, Icon.astro, icons.ts
│   └── PageHeader.astro, SectionHeading.astro, Highlight.astro, ServiceCard.astro, ServiceArt.astro
├── content/            services/*.md, testimonials.json, faq.json
├── layouts/            BaseLayout.astro
├── lib/schema.ts       JSON-LD built from the config
├── pages/              index, about, contact, thanks, 404, services/, robots.txt.ts
├── styles/             global.css (tokens, components, motion), story.css
├── config.ts           Everything you rebrand
└── content.config.ts   Collection schemas
public/                 favicon.svg, og.png, apple-touch-icon.png
```

## Deploy

`npm run build` produces a static site in `dist/` that any static host can serve. On Vercel or Netlify, set `PUBLIC_FORMGONG_ACCESS_KEY` in the project's build environment variables: the key is read at build time. The Deploy to Cloudflare button stores it as a Worker secret instead, and `worker.js` puts it into the form as each page is served. Set `url` in `src/config.ts` first so canonical links, the sitemap and the form redirect point at your domain.


## More free form tools

- Build a form field by field and copy plain HTML: https://formgong.com/en/tools/html-form-generator/

## License

MIT, see `LICENSE`. The illustrations and icons were drawn for this theme and are covered by the same license. The font is Urbanist, licensed under the SIL Open Font License 1.1 and installed from `@fontsource-variable/urbanist`.
