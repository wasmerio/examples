# Customization

Edit these files. Commands in the starter are examples. They are shown as text and are not executed.

## Identity and domain

`src/config/site.ts` holds the product name, terminal label, public URL, repository URL, author, version, navigation,
hero copy, call-to-action content and install commands. The public URL is the origin for canonical links, the sitemap
and robots.

Navigation `href` values are site paths such as `/docs`. The `key` must exist in both `en` and `pt-br` inside
`src/i18n/ui.ts`. A missing key fails the build.

## Hero and install tabs

Hero title and description are `site.hero.en` and `site.hero['pt-br']`. Install tabs are `site.install`. Each item needs
an `id`, a `label` and a `command`.

## Calls to action

`site.ctas.en` and `site.ctas['pt-br']` configure the header button, both hero buttons and the bottom CTA box. Each
action has a `label` and `href`. The box also has `eyebrow`, `title` and `body` text. Use an internal path such as
`/docs#quickstart` to automatically retain the current language and deployment base, an HTTP(S) URL for an external
destination, or `repository` to follow `site.repository`. Both languages are required. Unsafe protocols and
protocol-relative URLs fail configuration validation.

## Integrations

`src/data/integrations.json` stores one record per locale. Every slug needs an `en` record and a `pt-br` record.
Categories are `editor`, `terminal` and `automation`. An optional `screenshot` is a public SVG path matching
`/images/<name>.svg`. Put the file in `public/images/`. An empty array is a valid catalogue.

## Palette, fonts and the default mode

Colors live in `src/data/palette.json`. The layout writes them as `--tn-*` variables. Fonts are the Fontsource packages
imported by `src/layouts/Layout.astro`: Inter, Newsreader and JetBrains Mono.

Noir is the default. Paper is stored as `tn-theme=light`. The mode buttons are labeled `Noir` and `Paper` in both
locales (`theme.noir` and `theme.paper` in `src/i18n/ui.ts`).

## Remove the showcase

The showcase is `src/pages/showcase.astro`, `src/pages/pt-br/showcase.astro` and `src/views/Showcase.astro`. Delete
those files and remove the `/showcase` item from `site.nav` plus the unused `nav.showcase` dictionary keys in both
locales.
