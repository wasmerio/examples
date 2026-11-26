# Customization

Site settings live in `src/config.ts`, colours and spacing in `src/styles/`, fonts in `astro.config.mjs`. Nothing site-specific is hardcoded in components. For notes, fields and the gutter markers, see [content.md](content.md).

## Site identity

`src/config.ts`, `site`:

| Key              | What it is                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `name`           | The site's name: the header, page titles, the feed. For a personal site, usually your name.    |
| `description`    | The home page's meta description and the feed description.                                     |
| `url`            | Your domain, `https://…`, no trailing slash. Sitemap, canonical links and social cards use it. |
| `locale`         | The page language, `en`, `ko`, `de` …                                                          |
| `author`         | Your name in the footer and in structured data.                                                |
| `defaultOgImage` | The social card for pages without their own: a 1200×630 PNG in `public/`.                      |
| `lede`           | The line at the top of the home page, above the table of notes. `''` leaves it out.            |

`seo.titleTemplate` sets page titles (`%s · Your Name`). `seo.jsonLd` says whether the site belongs to a `Person` or an `Organization`.

## Navigation

`nav.header` in `src/config.ts`: a list of `{ label, href }`. Labels are printed as paths, so `notes` reads `/notes`; keep them short and lowercase. The current section is in the text colour, the others are grey. The name in the header always links home.

Three items fit on one line at 360px wide next to a 12-character name. With a longer name or more items, the links wrap to a second line under the name.

The footer holds the copyright line, the feed link, the theme credit and the light/dark switch: `src/components/common/Footer.astro`.

## The home page

`monoline` in `src/config.ts`:

| Key         | What it does                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `homeCount` | How many notes the home table lists. With more notes than that, `all N notes →` links to `/notes`. |
| `gutter`    | `false` hides the source gutter markers everywhere ([content.md](content.md#the-source-gutter)).   |

The home page is `site.lede` and the table. When there are no notes, the table is left out.

## The source gutter

The markers are added by `src/lib/monoline-plugin.ts` when the site is built, and drawn by `src/styles/monoline.css`, which also holds every other rule for a note's body. The gutter is `4rem` (`--gutter-width` on `.note-column`); markers hang in it from 48rem up, and fold into a prefix on the first line below that.

`monoline.gutter: false` adds `no-gutter` to the body, which hides the markers but keeps the column and the spacing.

## Colours and other tokens

Every colour is a token in `src/styles/tokens.css`, written as `light-dark(<light>, <dark>)`. Do not edit that file: override tokens in `src/styles/theme.css`, which loads after it.

```css
:root {
  --primary: light-dark(#a23a1c, #f0a184); /* links, the author on social cards, focus rings */
}
```

| Token             | Used for                                                        |
| ----------------- | --------------------------------------------------------------- |
| `--background`    | The page.                                                       |
| `--surface`       | Code blocks.                                                    |
| `--foreground`    | Text, titles, the rule under table headers.                     |
| `--muted`         | Gutter markers, dates, tags, meta lines, footnotes, the footer. |
| `--border`        | Hairlines between table rows and above footnotes.               |
| `--primary`       | Links in text, focus rings.                                     |
| `--primary-hover` | Links on hover.                                                 |
| `--content-width` | The text column, `38rem` (about 66 characters).                 |
| `--wide-width`    | The page frame for the header, tables and footer, `52rem`.      |

Run `pnpm check:contrast` after changing a colour. It checks every text colour against every background, in light and dark, and fails below 4.5:1.

Code blocks keep their own syntax colours (`github-light-high-contrast` and `github-dark-high-contrast`, set in `astro.config.mjs` under `shikiConfig`) on `--surface`.

## Dark mode

The site follows the reader's system setting; the switch at the end of the footer (`theme: system`) cycles system, light and dark and remembers the choice. Set `features.darkMode` to `false` to remove the switch (the system setting still applies).

## Fonts

`astro.config.mjs` loads the fonts through Astro's font API from Fontsource, Latin subset, all under the SIL Open Font License. There are two roles, each a CSS variable:

| Variable         | Role                                                                      | Default                    |
| ---------------- | ------------------------------------------------------------------------- | -------------------------- |
| `--font-body`    | Reading text                                                              | Atkinson Hyperlegible Next |
| `--font-heading` | Everything structural: navigation, paths, dates, titles, the gutter, code | Atkinson Hyperlegible Mono |

Keep `--font-heading` a monospace face: the tables line up their dates in `ch`, and the gutter is sized for it. To use another face, change `name` in the `pairings` entry and run `pnpm dev`. For a font that needs a wider character set, change `subsets`.

## Footer credit

The footer carries one line crediting the theme: `Monoline theme by ondelva`, linking to the theme's page. It is a plain link in `src/components/common/Footer.astro`; delete it and the separator before it if you would rather not have it. Keeping it is how other people find the theme. Monoline Pro ships without it.

## Words and language

Every word the theme prints is in `ui` at the end of `src/config.ts`: table headings, the meta line (`8 min · 1794 words`), the 404 page, the theme switch. The footer credit is not in it (see above). To publish in another language, set `site.locale` (the page's `lang`) and translate `ui`. Counts are functions, so plurals stay right: ``words: (count) => `${count} Wörter` ``. Dates stay `YYYY-MM-DD` in every language.

## Analytics

`analytics` in `src/config.ts`. Off by default: `provider: null` renders nothing and the site loads no third-party script.

| `provider`    | `id`                      | `host`                                 |
| ------------- | ------------------------- | -------------------------------------- |
| `'plausible'` | Your site's domain        | Your instance's origin, if self-hosted |
| `'umami'`     | The website ID            | Your instance's origin, if self-hosted |
| `'ga4'`       | The measurement ID, `G-…` | Ignored                                |

## Favicon and default social card

Replace `public/favicon.svg`, `public/favicon.ico` and `public/og-default.png` (1200×630).
