<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Orrery](https://github.com/formgong/orrery-astro-theme) Astro theme by formgong, copied from commit `22211c3afcb2f53f491933e669a698514118bd80` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-orrery.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
- **Environment variables:** The theme's example env file lists `PUBLIC_FORMGONG_ACCESS_KEY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [formgong](https://github.com/formgong), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Orrery

A free Astro theme for consultants and small B2B service firms: a dark site with large light type, one lime accent and a home page that moves as you scroll.

**Live demo:** https://orrery.formgong.com · **No build step?** Download `orrery-html.zip` from the [latest release](https://github.com/formgong/orrery-astro-theme/releases/latest): plain HTML files, replace `fk_your_access_key` and `https://example.com` with your own and upload them anywhere.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/formgong/orrery-astro-theme) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fformgong%2Forrery-astro-theme&project-name=orrery&repository-name=orrery&env=PUBLIC_FORMGONG_ACCESS_KEY&envDescription=Your%20Formgong%20access%20key%20%28fk_...%29.%20Create%20a%20free%20form%20to%20get%20one.&envLink=https%3A%2F%2Fformgong.com%2Fnew%3Fname%3Dorrery)

Each button copies the theme to your GitHub, builds it and asks for one value: your Formgong access key (`fk_…`), free at https://formgong.com/new. The form works from the first deploy. Then set `url` in `src/config.ts` to your domain.

The demo business is **Quillmoor Analytics**, a fictional five-person data and strategy consultancy in the fictional town of Port Alder. Everything on the site is sample content: phone numbers use the 555-01xx range reserved for fiction, every email and link uses `example.com`, and the team is described by role, not by name.

- **One file to rebrand.** Name, contact details, hours, the hero counters, the accent color and the form key live in `src/config.ts`. Services are Markdown files.
- **Thirteen scroll and load effects, no animation library.** Service cards that start as a staircase and pull up into a grid as you scroll, flipping in from flat; statements that fill line by line; a panel that slides in from the screen edge; titles that tilt into place. Timings, easings and scroll ranges were measured on the reference design with Playwright. All of it is CSS plus three tiny scripts, and all of it stops for visitors who prefer reduced motion.
- **A contact form that never fakes success.** It shows "Message received" only when the form backend answers `success: true`. Errors and lost connections show an error. Without JavaScript it still works as a plain HTML form.
- **Fast and accessible.** Static pages, one self-hosted font (Questrial), a few small scripts (the canvas scenes, the entrance trigger, the orbit lean, the form, closing the mobile menu). Labels on every field, visible focus, AA contrast for every text colour in its final state. Lighthouse mobile: 99–100 / 100 / 100 / 100.

Built with Astro 7, Tailwind CSS 4 and TypeScript.

## Quick start

```sh
npm create astro@latest -- --template formgong/orrery-astro-theme
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

| Field                                     | Used for                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `name`, `shortName`, `tagline`, `description` | Logo (two-line wordmark: `shortName`, then the rest of `name`), page titles, meta description, JSON-LD |
| `url`                                     | Canonical URLs, Open Graph, sitemap, robots.txt and the form's redirect                    |
| `schemaType`                              | schema.org type, e.g. `ProfessionalService`, `AccountingService`, `LegalService`           |
| `phone`, `email`, `address`, `areaServed` | Header menu, footer, contact page, JSON-LD                                                 |
| `hours`, `hoursNote`                      | Contact page, JSON-LD opening hours                                                        |
| `social`                                  | Footer icons. Real profile URLs are also added to JSON-LD `sameAs`                         |
| `stats`, `statsNote`                      | The four counters in the hero. Sample values: replace them, then clear `statsNote`         |
| `theme.accent`, `theme.accentText`        | The one accent (key words, buttons, cards, the process panel) and the text color on it (keep 4.5:1) |
| `formgong`                                | Fallback access key, endpoint and email subject for the contact form                      |
| `nav`, `cta`                              | Header links and the accent button in the header and footer                               |

Replace the logo mark in `src/components/Logo.astro` and `public/favicon.svg`, and regenerate `public/og.png` (1200×630) and `public/apple-touch-icon.png` (180×180).

The JSON-LD block has no star rating on purpose: search engines ignore ratings a business publishes about itself.

## Set up the form

The contact form posts to [Formgong](https://formgong.com), a hosted form backend, so you don't need a server. It appears on the contact page; the buttons on the home page lead to it.

1. Create a free form at [formgong.com/new](https://formgong.com/new?name=Website%20contact%20form) (or from the dashboard if you already have an account).
2. Copy the form's access key. It starts with `fk_` and is public by design: it only lets visitors send submissions to that one form.
3. Add it to a `.env` file in the project root:

   ```sh
   PUBLIC_FORMGONG_ACCESS_KEY=fk_your_access_key
   ```

   or set `formgong.accessKey` in `src/config.ts`. While the placeholder key is in use, the dev server shows a reminder above the form.
4. Set `url` in `src/config.ts` to your real domain. Visitors without JavaScript are redirected to `/thanks/` on that domain. Formgong only follows a redirect on the site that sent the form, so on `localhost` you land on Formgong's own thank-you page instead.

Submissions arrive by email and, if you connect it, in Telegram. The free plan covers 250 submissions a month.

**The Formgong credit links your review page.** With a real access key, the build asks Formgong once (`POST https://formgong.com/api/review-page` with the key and your site's `url`). Formgong makes a public review page for your site the first time, where your clients can read and leave reviews, and the "Formgong" link next to the form points there. You can switch the page off in the Formgong dashboard (Reviews → your site → Settings), or change the link in `src/components/Footer.astro`. With the placeholder key or another form backend nothing is sent and the link goes to formgong.com.

**How the form behaves**

- Without JavaScript: a normal `POST` to `https://formgong.com/submit`. The hidden `_redirect` field sends the visitor to `/thanks/` afterwards.
- With JavaScript: the same fields are sent with `fetch` and `Accept: application/json`. The button is disabled while sending. The success state, with its checkmark animation, appears only when the JSON response has `success === true`. Any other response shows the server's `message`. A network failure shows an error and your email address.
- The hidden `botcheck` field is a spam honeypot. Keep it empty and keep it in the markup.

**Using another form backend.** Any service that accepts a standard form `POST` works. Set `PUBLIC_FORMGONG_ENDPOINT` (or `formgong.endpoint`) to its URL and rename the hidden fields to what that service expects. If its JSON response is shaped differently, change the single `reply?.success === true` check in `src/components/ContactForm.astro`.

## Edit the content

- **Services:** one Markdown file per service in `src/content/services/`. Frontmatter: `title`, `tags` (the short line on the card), `summary`, `order`, `priceFrom`, `duration`, `deliverables` (list) and `art`, the card's line animation: `grid`, `bars`, `forecast`, `curve`, `bells` or `clusters` (see `src/components/ServiceArt.astro`). The body is shown on the services page.
- **Key words in the accent:** wrap them in asterisks, for example `lines={["Our *services*"]}`. This works in section headings, page headers and the lines that fill on scroll (`FillLines.astro`: one string per line).
- **Home page copy:** one file per section in `src/components/sections/`. The process steps are at the top of `Process.astro`.
- **About page:** roles and terms at the top of `src/pages/about.astro`.

## The effects

Numbers match the comments in the code.

| #  | Effect | Where |
| -- | ------ | ----- |
| 1  | Fixed 90px header: logo, three links, accent button, a 1px divider from the content edge to the screen edge | `Header.astro` |
| 2  | On load the first heading line tilts in, the second is wiped in from the left, the lead fades in; a 3D particle network fills the whole hero behind the text, pushed aside by the pointer | `sections/Hero.astro`, `scripts/scenes.ts` (`plexus`) |
| 3  | Counters count up from 0 in steps, in the accent color | `.count` in `effects.css` |
| 4  | The hero stays put (sticky) while the next block slides up over it | `.hero-wrap` in `pages/index.astro` |
| 5  | A statement fills line by line: the key words turn from grey to the accent behind a front that sweeps left to right | `FillLines.astro`, `.fl-top` |
| 6  | Line-art orbits turn slowly and lean towards the pointer | `Orbits.astro`, `.orbit-ring`, `scripts/follow.ts` |
| 7  | A large rounded panel of drifting lines grows from 90% as it scrolls in; its quote flips in | `sections/MediaPanel.astro`, `.media`, `scenes.ts` (`flow`) |
| 8  | Two-tone section heading that fills like 5, a lead and a short accent rule | `sections/Services.astro` |
| 9  | Service cards start as a staircase, each 300px below the last, and pull up into a 3-column grid (2 columns on tablets) as you scroll; each flips in from flat when it reaches the screen; the finished grid scrolls away as one block | `sections/Services.astro`, `ServiceCard.astro`, `ServiceArt.astro`, `[data-enter="flip"]` |
| 10 | Split section: the picture grows from 90% as it scrolls in | `sections/Split.astro`, `Ridgelines.astro`, `.split-pic` |
| 11 | An accent panel slides in from the left edge of the screen next to sticky turning orbits; each step's dot opens, its title tilts in and its paragraph is wiped up | `sections/Process.astro`, `[data-enter]` |
| 12 | The closing heading fills like 5 | `sections/FinalCta.astro` |
| 13 | Footer over a rolling 3D field of dots | `Footer.astro`, `scenes.ts` (`wave`) |

How it is built:

- **Scroll-linked effects are CSS** (`animation-timeline: view(0px)`, one view timeline per element), so the browser runs them off the scroll position with no scroll listeners. They are all in `src/styles/effects.css`. `view(0px)` rather than `view()`: the default inset is the page's `scroll-padding`, which would shorten every range by the header height.
- **Entrances are CSS animations started by a 20-line script** (`src/scripts/enter.ts`): when 15% of an element is on screen it gets `.is-in` and its animation plays once. The card staircase is plain `position: sticky`: every card sits in its own track, and all tracks end together.
- **One canvas script** (`src/scripts/scenes.ts`, under 6 KB minified with the other two, no dependencies) draws the particle network, the drifting lines and the dot wave. It caps the device pixel ratio at 2, draws only while a canvas is on screen and the tab is visible, and draws one still frame for reduced motion.
- **The counters are CSS too:** a registered integer property stepped from 0 and printed with `counter()`. The real numbers are in the HTML for screen readers and search engines.

Phones (under 751px) get no entrances and no scroll effects, like the reference design. Browsers without scroll-driven animations, pages without JavaScript and visitors who prefer reduced motion see every section in its final state: text filled, cards flat and lit, the panel in place, titles straight. Nothing is hidden.

Three CSS details that keep it working:

- Scroll-driven rules use longhand properties (`animation-name`, `animation-timeline`, …). A minifier can merge a shorthand and `animation-timeline` into one declaration that Chrome rejects.
- Wrappers around animated content use `overflow: clip`, not `overflow: hidden`. `overflow: hidden` creates a scroll container, and a view timeline inside it would track that box instead of the page.
- Entrances keep `transform: none` in their first keyframe, so the observer measures the element's real box before it starts. The cards and the media quote fade in over 1.2 s while they flip (as on the reference); every text colour passes AA once settled.

## Look

Navy-black ground (`--c-bg`, #040319), #EEEEEE type (white for the hero heading), a grey (`--c-dim`, #949494, 6.7:1) for text that has not filled yet, and one accent from `theme.accent` (#DCFD35) with navy text on it. Type is Questrial (one weight; bold is synthesized), sized to the reference: 72px heading, 62px statements, 38px paragraphs, 22px leads. Cards and buttons have a 12px radius, pictures 24px.

## Project structure

```text
src/
├── components/
│   ├── sections/       Hero, Statement, MediaPanel, Services, Split, Process, FinalCta (the home page, in order)
│   ├── ContactForm.astro   The form and its script
│   ├── FillLines.astro     Line-by-line fill (5, 8, 12)
│   ├── Orbits.astro        Line-art orbits (6, 11)
│   ├── Ridgelines.astro    Build-time ridgeline chart (10)
│   ├── ServiceCard.astro, ServiceArt.astro   Service cards and their line drawings (9)
│   ├── Head.astro          Meta tags, Open Graph, JSON-LD
│   └── Header, Footer, Logo, Icon, PageHeader, SectionHeading, Highlight
├── content/services/   One Markdown file per service
├── layouts/            BaseLayout.astro
├── lib/                schema.ts (JSON-LD), highlight.ts
├── pages/              index, services/, about, contact, thanks, 404, robots.txt.ts
├── scripts/            scenes.ts (canvas scenes), enter.ts (entrance trigger), follow.ts (orbit lean)
├── styles/             global.css (tokens, components), effects.css (all motion)
├── config.ts           Everything you rebrand
└── content.config.ts   Collection schema
public/                 favicon.svg, og.png, apple-touch-icon.png
```

## Deploy

`npm run build` produces a static site in `dist/` that any static host can serve. On Vercel or Netlify, set `PUBLIC_FORMGONG_ACCESS_KEY` in the project's build environment variables: the key is read at build time. The Deploy to Cloudflare button stores it as a Worker secret instead, and `worker.js` puts it into the form as each page is served. Set `url` in `src/config.ts` first so canonical links, the sitemap and the form redirect point at your domain.


## More free form tools

- Build a form field by field and copy plain HTML: https://formgong.com/en/tools/html-form-generator/

## License

MIT, see `LICENSE`. The illustrations, line drawings and icons were drawn for this theme and are covered by the same license. The font is Questrial, licensed under the SIL Open Font License 1.1 and installed from `@fontsource/questrial`.
