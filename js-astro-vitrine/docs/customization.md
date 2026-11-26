# Customization

Everything below is one file. Start at `src/config.ts`, and keep colours and metrics in
`src/styles/theme.css` rather than editing the defaults.

Run `pnpm dev` and open `/styleguide` while you work: it prints every token, the type
scale and the plate grid with and without the signature. The page is a development tool
and is never built into `dist/`.

## Site settings — `src/config.ts`

| Setting                                 | What it does                                                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.name`, `site.description`         | Nameplate, footer, feed and meta                                                                                                                    |
| `site.url`                              | Canonical URLs, sitemap, feed. Change it before you publish, or every absolute link points at `example.com`                                         |
| `site.locale`                           | `lang` on `<html>` and `og:locale`                                                                                                                  |
| `site.author`                           | Footer copyright and the JSON-LD publisher                                                                                                          |
| `site.defaultOgImage`                   | The share image for pages that have no plate of their own                                                                                           |
| `nav.header`, `nav.footer`              | Link lists. Order is the order shown                                                                                                                |
| `nav.social`                            | Icon links. `icon` is a [Lucide](https://lucide.dev/icons) name, e.g. `lucide:instagram`                                                            |
| `seo.titleTemplate`                     | `%s` is the page title                                                                                                                              |
| `seo.twitterHandle`                     | Omitted from the meta when empty                                                                                                                    |
| `seo.jsonLd`                            | `Person` or `Organization`, and the name shown as publisher                                                                                         |
| `contact.formEndpoint`                  | Any service that accepts a plain POST: Formspree, Web3Forms, Basin. The form posts straight to it, so there is no script to load                    |
| `contact.email`, `contact.responseTime` | Printed beside the form                                                                                                                             |
| `catalogue.platesPerPage`               | Plates per page in the catalogue                                                                                                                    |
| `catalogue.relatedPlates`               | How many entries follow an object page                                                                                                              |
| `catalogue.showAccession`               | Prints the accession number in the cartellino. Off hides it everywhere                                                                              |
| `features.darkMode`                     | Off removes the switcher; the site then follows the reader's system setting                                                                         |
| `features.plate`                        | Off replaces the rule grid with a plain spaced grid, no rules, no cartellino                                                                        |
| `analytics`                             | `provider` (`'plausible'`, `'ga4'`, `'umami'`) and `id`. Nothing is loaded while `provider` is `null`. `host` is for self-hosted Plausible or Umami |
| `ui`                                    | Every word the theme prints: headings, labels, counts, the contact form. Translate it along with `site.locale`; see below                           |

### Words and language

`ui` at the end of `src/config.ts` holds every word the theme prints, so a catalogue in another language is one block to translate (and `site.locale`). Counts are functions, so plurals stay right: ``objects: (count) => `${count} Objekte` ``. A string that carries a link (`<a href="/terms">Terms</a>`) is printed as markup: keep the tag when you translate it. The colophon's paragraphs and production table are the page itself, `src/pages/colophon.astro`. Dates as written in each object's `dateText`.

## Colours

The palette is CSS custom properties in `src/styles/tokens.css`. Do not edit that file;
override what you want in `src/styles/theme.css`, which is loaded last and unlayered:

```css
:root {
  --primary: light-dark(#1f4b6e, #8fc3e8);
  --rule: light-dark(#111111, #4a4a4a);
}
```

Each colour is a `light-dark()` pair — light value first, dark second. Overriding with a
plain colour sets both modes at once, which is usually not what you want.

| Token                                                        | Where it shows                                                                                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `--background`, `--surface`                                  | Page and raised blocks                                                                                                                   |
| `--foreground`, `--muted`                                    | Body text; captions, meta, bylines                                                                                                       |
| `--border`                                                   | Hairlines that are not the plate rule                                                                                                    |
| `--rule`                                                     | The plate rule and every rule that belongs to the grid                                                                                   |
| `--plate`, `--plate-ink`, `--plate-muted`, `--plate-primary` | Inside the plate cell. These stay paper in dark mode: a photograph shot on white would otherwise sit on a dark page as a white rectangle |
| `--primary`, `--primary-hover`, `--on-primary`               | Links, buttons, the inverted button label                                                                                                |
| `--focus-ring`                                               | Keyboard focus                                                                                                                           |

After any colour change run `pnpm check:contrast`. It measures every text token against
every background, in light and dark, and exits non-zero on anything below WCAG AA
(4.5:1).

## Type

Webfonts are declared in the `fonts:` block of `astro.config.mjs` and served from your own
domain by Astro's font provider. Replace a face by changing `name` and the weights; keep
`cssVariable` as `--font-heading` or `--font-body` and the rest of the theme follows.

For system fonts instead, delete the `fonts:` block and set the stacks in `theme.css`:

```css
:root {
  --font-heading: 'Iowan Old Style', Georgia, serif;
  --font-body: Charter, Georgia, serif;
}
```

Do not add `<link>` tags to an external font host; it costs a connection on first paint and
puts your readers on someone else's log.

## The plate

The signature is four tokens, all overridable in `theme.css`:

| Token                | Default                  | Effect                                                                                |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| `--rule-width`       | `1px`                    | Thickness of the grid rule. `2px` reads as a heavier, more printed sheet              |
| `--plate-pad`        | `clamp(1rem, 3vw, 2rem)` | The air between the object and its rule. Lower it and the objects crowd the grid      |
| `--caption-size`     | `0.78rem`                | The caption floor. Going smaller fails the contrast and legibility gates              |
| `--caption-tracking` | `0.04em`                 | Letter-spacing on captions                                                            |
| `--radius`           | `0`                      | Rounded corners. The theme is built on rules; rounding them mixes two shape languages |

Column counts are set per page, not in the grid component: `PlateGrid` takes a `class`, and
the pages pass Tailwind column utilities. To change how dense the catalogue is, edit the
class in `src/pages/catalogue/[...page].astro`.

`span: 2` in an object's frontmatter gives it a double-width cell. It is an editorial
decision, which is why it lives with the object rather than in a layout.

## Logo and favicon

There is no logo image: the nameplate is `site.name` set in the heading face. To use a
mark instead, replace the `<a href="/">` block in `src/components/common/Header.astro` and
the matching line in `src/components/common/Footer.astro` with an `<Image>` from
`astro:assets`.

Favicons are `public/favicon.svg` and `public/favicon.ico`.

## Pages and layout

| To change                     | Edit                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| Home                          | `src/pages/index.astro`                                                              |
| Catalogue grid and pagination | `src/pages/catalogue/[...page].astro`                                                |
| Object entry                  | `src/pages/catalogue/[id].astro`                                                     |
| Collections                   | `src/pages/collections/index.astro`, `src/pages/collections/[id].astro`              |
| Colophon, contact, legal, 404 | `src/pages/colophon.astro`, `contact.astro`, `privacy.mdx`, `terms.mdx`, `404.astro` |
| Header, footer                | `src/components/common/Header.astro`, `Footer.astro`                                 |
| `<head>` meta                 | `src/components/common/SEO.astro` — pages pass `title` and `description` to `Base`   |

A new page is a file in `src/pages/` using `PageLayout`:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
---

<PageLayout title="About" description="Who keeps this archive.">
  <p>…</p>
</PageLayout>
```

Add it to `nav.header` or `nav.footer` in `config.ts` to link it.

There is no `/about` on purpose: the colophon is where an archive says who keeps it,
what it is made of and how to reach it, and two pages saying that is one too many. If
the page is wanted under its own name, the snippet above is the whole of it — save it
as `src/pages/about.astro` and put `{ label: 'About', href: '/about' }` in
`nav.header`.

## Body copy

Notes and the legal pages use one class, `.prose`, defined at the end of
`src/styles/global.css`. There is no typography plugin to configure: change the rules
there, and wrap anything that should keep its own look in `.not-prose`.

## Legal pages

`privacy.mdx` and `terms.mdx` are placeholders written for an archive that collects
nothing. Read them and replace them with your own before you publish.

## Footer credit

The footer carries one line crediting the theme:

```
© 2026 Ada Example · Vitrine theme by ondelva
```

The licence does not require it. To remove it, edit the last paragraph of
`src/components/common/Footer.astro` and keep whatever you want of the copyright:

```astro
<p class="text-muted mt-12 text-xs">
  © {year} {site.author}
</p>
```

Leaving it is how people find the theme, and it is the only marketing this edition has.
