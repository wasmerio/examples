# Theming

Everything visual lives in two files: `src/styles/tokens.css` (the values) and
`src/styles/base.css` (the element styles and a handful of primitives).
Everything else is a scoped `<style>` block in the component that needs it.
There is no utility framework and no class soup in the markup.

## Changing the palette

One base hex per accent family:

```css
--cyan: #5cc8e8;
--green: #55d39a;
--violet: #ad8cf2;
--rose: #f18fa2;
--amber: #e0b364;
```

Those are the accents, not every colour there is. `tokens.css` also names the
surfaces (`--bg*`), the text greys (`--text*`) and `--warn` as bare hex, and
`src/data/venues.yml` and `src/data/language_colors.yml` carry colours of their
own — a venue's brand colour, GitHub's language dots. The contrast check reads
every bare-hex token except the surfaces, which is the count its `✓` line
prints. Every family stays defined whatever `src/features.ts` says, even one
read by exactly one `[data-section]` block whose feature is off — `--green` for
publications, `--rose` for the blog — because an accent nothing renders costs a
few bytes, and switching the feature back on then needs no edit here. The other
three are read from elsewhere as well: `--cyan` and `--amber` by section blocks
that survive any one feature, and `--violet-glow` by the second background
gradient in `base.css`, on every page.

Each family has five roles, and the other four are mixed from the base with
`color-mix()`:

| Role      | Used for                                                 |
| --------- | -------------------------------------------------------- |
| base      | links, icons, the accent rule under a heading            |
| `-strong` | hover, and headings that carry the accent themselves     |
| `-line`   | borders and rules — never text                           |
| `-dim`    | tints: chip backgrounds, `:target` highlights            |
| `-glow`   | the fixed radial wash behind the page, in `body::before` |

Deriving them is why a hue is one edit. Writing them out by hand means five
edits and a hex-to-rgb conversion, which is how the two source sites ended up
with `--green-line: rgb(74 222 128 / 38%)` sitting next to `#4ade80`.

**Keep each base at 3:1 against `--bg`, and the `--text*` values at 4.5:1.**
`npm run audit` checks this and will tell you which token and by how much. The
check derives its own list, so a sixth family is covered without your adding it
anywhere — see [Verification](Verification.md).

## Sections

A page sets `data-section` on `<body>`; the `[data-section]` blocks at the
bottom of `tokens.css` re-point the neutral `--sec-*` aliases at one family. A
single set of components therefore recolours itself per area of the site.

Nav links carry `data-section` too, which is how each one previews the colour
of the page it leads to — with no per-section CSS at all, because the
attribute on the link has already re-pointed `--sec` inside it.

**Adding a section is two edits:**

1. the `SECTIONS` list in `src/consts.ts`
2. a matching `[data-section='…']` block in `tokens.css`

Forget the second and the build fails: `audit-site.mjs` collects every
`data-section` value out of the built HTML and every selector out of the built
CSS, and reports any value with no block.

The union is one member shorter than the list of values. `src/pages/index.astro`
sets `data-section="contact"` on its contact section and `tokens.css` has a block
for it, but it is not a `Section`: the union types what `<body data-section>`
takes, and no page is _the_ contact page. That is why the audit counts one
section more than the union has members — it reads the built HTML, where the two
are the same attribute.

Sections may share a family. Several areas over one family reads as a palette; a
distinct hue per area reads as a swatch chart.

## Width

Two different questions, two tokens:

- **`--max`** is the width of the page — `.wrap` is `max-width: var(--max)`
  plus the gutter, and every page and section is inside a `.wrap`.
- **`--measure`** is the reading column: how wide a column of prose may get
  before the eye loses the start of the next line. It is in `ch`, not `rem`,
  because the answer is a number of characters — so it follows the font you
  choose instead of needing re-tuning when you change one.

Article pages size their header, figure, prose, link list and cite block to
`--measure`, so their left and right edges line up all the way down.

## Fonts

Self-hosted through `@fontsource` and imported in `src/layouts/Base.astro`.
Swapping a face is that import plus the `--font-*` lines in `tokens.css`.

Import only the weights you use. Importing a `@fontsource` package bare pulls
every weight of every subset, most of which the browser never requests.

## Dark only

`color-scheme: dark` on bare `:root`, and no `[data-theme]` anywhere, so every
colour has exactly one definition and there is no second palette to keep in
step. `audit-site.mjs` fails the build if a `[data-theme]` block reappears.

If you want a light theme this is the check to delete first — but note that
every `color-mix()` role above assumes a dark ground, and the contrast check
compares against `--bg` alone.

## The primitives

Documented so you use them rather than reinventing them. All in `base.css`.

| Class        | Is                                                                     |
| ------------ | ---------------------------------------------------------------------- |
| `.wrap`      | the page container: `--max` wide, centred, with the gutter             |
| `.section`   | the vertical rhythm. `.section + .section` drops the top padding       |
| `.card`      | a filled surface — used sparingly; this site is built from hairlines   |
| `.chip`      | a pill: a link, a tag, a small control                                 |
| `.kicker`    | the mono eyebrow above a heading. `data-sigil` picks `$`, `##` or none |
| `.mono`      | switch to the mono face at the small size                              |
| `.jump`      | a wrapping row of `.chip`s linking to ids further down the page        |
| `.scroll-x`  | wide content scrolls in its own box, never the page body               |
| `.sr-only`   | visually hidden, still read aloud                                      |
| `.skip-link` | the keyboard skip target, revealed on focus                            |
| `.reveal`    | fades in on scroll. A no-op without JS, and under reduced motion       |

## The logo in the header

`Nav.astro` renders a wordmark — `brand`, with an optional `brandPrompt` prefix,
both text in `src/content/pages/site/site.md` — and a mark beside it when
`SITE.brandLogo` is set. That is one line in `src/consts.ts` and no edit here — see [Configuration](Configuration.md):

```ts
brandLogo: { src: '/assets/img/brand-mark.svg' },       // beside the wordmark
brandLogo: { src: '/assets/img/brand-mark.svg', replacesWordmark: true },
brandLogo: null,                                       // wordmark alone
```

The path is under `public/`. There are deliberately no dimensions to declare:
the nav fixes the height (`LOGO_HEIGHT` in `Nav.astro`) and reads the file's
aspect ratio off disk for the width, so a wide logo and a square one both fit,
the `width`/`height` the audit requires on every `<img>` are always there, and a
path with no file behind it fails the build naming the path.

There is no `alt` either, for the same reason: beside the wordmark the mark is
decoration and takes `alt=""` rather than making a screen reader say the site's
name twice, and in place of the wordmark it _is_ the name, so its alt is the
`brand` from `site/site.md`.

The demo ships `public/assets/img/brand-mark.svg` with `brandLogo` set, so the
path is exercised rather than only described. Replace the file, or set
`brandLogo: null` for a wordmark alone.

`ProjectHero.astro` — the centred hero a project or group site opens with —
reads the same value, so a site with a logo does not show it in the corner and a
favicon in the middle of its own front page. It used to hard-code the
favicon, which meant putting your own logo there was a component edit. With
`brandLogo: null` it falls back to `/apple-touch-icon.png`, because a centred
hero still needs something above the title and the site icon is the one image
every site here is guaranteed to have.
