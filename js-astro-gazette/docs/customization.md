# Customization

Everything site-specific lives in `src/config.ts` and `src/styles/theme.css`. You should not have
to open a component for any of the changes below.

## Site identity

`src/config.ts`, the `site` object:

- `name` — the nameplate in the sticky bar, the footer wordmark, and page titles. It is set type,
  not an image file: change the word here and the font pairing sets it.
- `description` — the tagline under the footer wordmark, the meta description, and the feed.
- `url` — your production URL. Set it before you deploy: canonical links, the feed, the sitemap and
  `robots.txt` all print absolute URLs from it.
- `locale` — the language of the magazine. It needs a dictionary at `src/i18n/<locale>.ts`.
- `author` — the editor's name, printed in the footer line and in the JSON-LD.
- `email` — the editorial address, printed on the masthead page (`/about`).
- `defaultOgImage` — the share card, `public/og-default.png`. Replace the file, or point this
  at your own 1200×630 image.

## Footer credit

The footer carries one line crediting the theme: `Gazette theme by ondelva`, linking to the
theme page on ondelva.com. It is a plain link in `src/layouts/Base.astro` — delete it if you would rather not have it.
Keeping it is how other people find the theme. Gazette Pro ships without it.

## Navigation, footer and social links

`src/config.ts`, the `nav` object:

- `nav.header` — the links in the sticky bar. Three or four fit a phone beside the nameplate.
- `nav.footer` — groups, each a `title` and a list of `links`.
- `nav.social` — icon links. `icon` is a Lucide name (`lucide:github`, see lucide.dev/icons). Your
  own SVG goes in `src/icons/` and is referenced by its filename without the extension.

The labels here are the one place you write the theme's words yourself; everything else it prints
lives in the dictionaries.

## Colours and other tokens

`src/styles/theme.css` is your override file. Every token and its default is in
`src/styles/tokens.css` — read that file, do not edit it. Declarations in `theme.css` are
unlayered, so they win without specificity tricks:

```css
:root {
  --primary: light-dark(#8c1f2f, #e08792);
  --content-width: 42rem;
}
```

Colours use `light-dark(<light>, <dark>)`. Overriding with a plain colour changes both modes at
once. The tokens worth knowing:

- `--background`, `--surface`, `--foreground`, `--muted`, `--border`, `--primary`,
  `--primary-hover`, `--on-primary` — paper, ink, and one spot colour. There is no second accent by
  design: a coloured section background or a second hue breaks the two-colour press run the theme
  is built on.
- `--rule-hair`, `--rule-strong`, `--rule-heavy` — the lines that draw the structure. This theme
  has no cards and no shadows; `--radius` is `0`.
- `--leader-dot`, `--leader-color` — the dotted leader in a contents row.
- `--content-width` (the 65ch article measure), `--wide-width` (the page container).

Change a colour and run `pnpm check:contrast`. It measures every text-on-background pair, light and
dark, against WCAG AA and prints the ratios.

## The styleguide

In dev, `/styleguide` shows the tokens, the type scale and the signature rows on one page. Look at
it in light, dark and at 360px after any change to `theme.css`. The route is dev-only: it is a
design tool, not a page you ship.

## Webfonts

`astro.config.mjs`, the `fonts:` block (Astro's fontsource provider, latin subsets, self-hosted at
build). The three faces are bound to `--font-body`, `--font-heading` and `--font-display`. Do not
add a font CDN link; add a face here instead.

The last entries in each `fallbacks` list are system Korean faces: no latin subset carries Hangul
and a CJK webfont is megabytes. To ship one yourself, add it to this block and point `--font-body`
at it in `theme.css`.

## The contents rows

The signature. `src/config.ts`, the `contents` object:

- `style` — `'leaders'` draws the dotted rule between a title and its byline; `'plain'` drops the
  fill span, and the dots with it.
- `numbering` — the article numbers hung in the left margin.

The rule itself is `.leaders` / `.leaders__fill` in `src/styles/global.css`: one
`border-block-end: dotted`.

## Issues and articles

`src/config.ts`, the `issues` object:

- `articlesPerIssue` — an editorial guide only; nothing enforces it.
- `showFolio` — the `Issue 04 · Essays · 03 / 07` line at the foot of a piece.
- `dropCap` — the default for every piece. A single article overrides it with `dropCap: true` in
  its frontmatter.

`src/config.ts`, the `archive` object: `issuesPerPage` and `showReadingTime`.

## UI strings

`src/i18n/<locale>.ts`. Every word the theme prints itself is a key there, read in a component with
`useT()`. Page copy — the masthead prose, an article — is content, and lives in the page or in
`src/content/`.

To reword something, edit the dictionary. To publish in another language, copy `en.ts` to
`<locale>.ts`, translate the values, and set `site.locale`.

## Analytics

`src/config.ts`, the `analytics` object. `provider` is `null` (nothing is rendered), `'plausible'`,
`'ga4'` or `'umami'`. `id` is the domain you registered with Plausible, the GA4 measurement id
(`G-XXXXXXX`), or the Umami website id. The snippet lives in
`src/components/common/Analytics.astro` — swap in another provider's tag there.

`host` is for a self-hosted Plausible or Umami: the origin that serves the script, with no trailing
slash (`https://stats.example.com`). Leave it empty for the hosted service, and for GA4.

Until `provider` and `id` are both filled in, the built pages load no third-party script at all.

## SEO

`src/config.ts`, the `seo` object: `titleTemplate` (e.g. `'%s · Gazette'`), `twitterHandle`, and
`jsonLd` (`{ type: 'Person' | 'Organization', name }`). The `<head>` itself is
`src/components/common/SEO.astro`.

## Favicon

`public/favicon.svg` and `public/favicon.ico`. `public/` is for files that must be served
byte-for-byte; images that belong to content go in `src/assets/`.
