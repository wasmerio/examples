# Customization

Everything below is one file. Start at `src/config.ts`, and keep colours and metrics in
`src/styles/theme.css` rather than editing the defaults.

Run `pnpm dev` and open `/styleguide` while you work: it prints every token, the type
scale, the leader row and the body copy on one page. The page is a development tool and is
never built into `dist/`.

## Site settings — `src/config.ts`

| Setting                         | What it does                                                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.name`, `site.description` | Nameplate, footer, feed and meta                                                                                                                    |
| `site.url`                      | Canonical URLs, sitemap, feed, share cards. Change it before you publish, or every absolute link points at `example.com`                            |
| `site.locale`                   | `lang` on `<html>`, `og:locale`, the prose date format, and which dictionary in `src/i18n/` the theme's own words come from                         |
| `site.author`                   | Footer copyright, the JSON-LD publisher, and the byline on a note that names no author                                                              |
| `site.defaultOgImage`           | The share image for pages with no card of their own                                                                                                 |
| `nav.header`                    | Three items. A fourth overflows at 360px — put it in the footer instead                                                                             |
| `nav.footer`, `nav.social`      | Link lists. `icon` is a [Lucide](https://lucide.dev/icons) name, e.g. `lucide:github`                                                               |
| `seo.titleTemplate`             | `%s` is the page title                                                                                                                              |
| `seo.twitterHandle`             | Omitted from the meta when empty                                                                                                                    |
| `seo.jsonLd`                    | `Person` or `Organization`, and the name shown as publisher                                                                                         |
| `categories`                    | The first axis. `name` is printed, `slug` is what content refers to, `accent` is 1–4 and points at `--accent-N`, `blurb` heads the category page    |
| `work.leaderRule`               | `'line'` draws the signature; `'none'` drops the rule and leaves the two ends of the row                                                            |
| `work.showBuilding`             | On, a product with `status: building` is dimmed. Off, it is left out of the site entirely until its status changes                                  |
| `blog.postsPerPage`             | Notes per page on `/notes`                                                                                                                          |
| `blog.showReadingTime`          | The reading estimate at the end of the byline                                                                                                       |
| `contact.endpoint`              | Any service that accepts a plain POST: Formspree or Basin. Empty, `/contact` prints the address instead of a form with nowhere to post              |
| `contact.email`                 | Printed on `/contact`, `/about` and the legal pages                                                                                                 |
| `features.darkMode`             | Off removes the switcher; the site then follows the reader's system setting                                                                         |
| `analytics`                     | `provider` (`'plausible'`, `'ga4'`, `'umami'`) and `id`. Nothing is loaded while `provider` is `null`. `host` is for self-hosted Plausible or Umami |

## Colours

The palette is CSS custom properties in `src/styles/tokens.css`. Do not edit that file;
override what you want in `src/styles/theme.css`, which is loaded last and unlayered:

```css
:root {
  --primary: light-dark(#8c1f2f, #e08792);
  --accent-2: light-dark(#7a4b12, #e0b075);
}
```

Each colour is a `light-dark()` pair — light value first, dark second. Overriding with a
plain colour sets both modes at once, which is usually not what you want.

| Token                                          | Where it shows                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `--background`, `--surface`                    | The canvas, and the few blocks raised off it                              |
| `--foreground`, `--muted`                      | Body text; metadata, summaries, bylines                                   |
| `--border`                                     | Hairlines: section rules, table rules, the band around a callout          |
| `--border-soft`                                | The leader rule at rest, before it takes a category's colour              |
| `--accent-1` … `--accent-4`                    | The categories. `accent` in `config.ts` chooses which one a category gets |
| `--primary`, `--primary-hover`, `--on-primary` | Links and the inverted label on the one button                            |
| `--focus-ring`                                 | Keyboard focus                                                            |

After any colour change run `pnpm check:contrast`. It measures every text token against
every background, in light and dark, and exits non-zero on anything below WCAG AA (4.5:1).
Leader Pro ships four complete alternative palettes, each one measured the same way.

### Picking four accents

Contrast is the part a script can check. The other part is whether the four read as four.
In the default palette the clay and moss accents are 3.6 apart in OKLab under protanopia
against 20.5 for normal vision, which means a red-green colourblind reader cannot tell
`infra` from `data` by colour. Four hues that all clear AA against two canvases do not
leave much room to also be far apart from each other.

The theme is built so that this is a nuisance rather than a barrier: **no place on the
site uses a colour as the only mark of a category.** A leader row prints the category name
at the far end, the foot of a note prints it, the category page is titled with it. Keep it
that way if you change the accents, and if you write a figure of your own, name the
categories in it rather than relying on a legend.

## Type

Webfonts are declared in the `fonts:` block of `astro.config.mjs` and served from your own
domain by Astro's font provider. Replace a face by changing `name` and the weights; keep
`cssVariable` as `--font-sans-face` or `--font-mono-face` and the rest of the theme follows.

Two things to know before you swap a face:

- **Keep 200 on the text face.** Display type here is set at 200 and never goes above 400.
  A family whose light end stops at 300 changes the theme more than a new palette does.
- **Numbers are set in the mono face on purpose.** Hanken Grotesk ships without tabular
  figures, so dates, years and counts use `--font-mono` to keep their columns lined up.
  A `font-feature-settings: 'tnum'` on the sans face does nothing.

For system fonts instead, delete the `fonts:` block and set the stacks in `theme.css`:

```css
:root {
  --font-body: Charter, 'Iowan Old Style', Georgia, serif;
  --font-heading: var(--font-body);
  --font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
}
```

Do not add `<link>` tags to an external font host; it costs a connection on first paint and
puts your readers on someone else's log.

## The leader rule

The signature is `work.leaderRule` in `src/config.ts` and `src/components/LeaderRow.astro`.
Every list on the site is that one component: the shelf, the notes, the category pages, the
contact page. Changing the row changes all of them, which is the point.

| To change                      | Where                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| Drop the rule                  | `work.leaderRule: 'none'`                                                                           |
| The rule at rest, and on hover | `--border-soft` and the category accent; the widths are in the `<style>` block of `LeaderRow.astro` |
| What the right-hand end says   | The `right` prop where the list is built — `WorkList.astro`, `NoteList.astro`                       |
| Narrow layout                  | Below the breakpoint in `LeaderRow.astro` the rule is hidden and the category moves above the title |

`--radius` is `0`. The theme is built on rules; rounding them mixes two shape languages.

## Logo and favicon

There is no logo image: the nameplate is `site.name` set in the display face. To use a mark
instead, replace the `<a href="/">` block in `src/components/common/Header.astro` and the
matching line in `src/components/common/Footer.astro` with an `<Image>` from `astro:assets`.

Favicons are `public/favicon.svg` and `public/favicon.ico`. `public/og-default.png` is the
share card for pages that have none of their own.

## Pages and layout

| To change                  | Edit                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------- |
| Home                       | `src/pages/index.astro`                                                               |
| The shelf                  | `src/pages/work/index.astro`                                                          |
| Product page               | `src/pages/work/[...slug].astro`                                                      |
| Notes list, note           | `src/pages/notes/[...page].astro`, `src/pages/notes/[...slug].astro`                  |
| Category page              | `src/pages/category/[slug].astro`                                                     |
| About, contact, legal, 404 | `src/pages/about.astro`, `contact.astro`, `privacy.astro`, `terms.astro`, `404.astro` |
| Header, footer             | `src/components/common/Header.astro`, `Footer.astro`                                  |
| `<head>` meta              | `src/components/common/SEO.astro` — pages pass `title` and `description` to `Base`    |

A new page is a file in `src/pages/` using the `Base` layout:

```astro
---
import Base from '../layouts/Base.astro';
import PageHead from '../components/PageHead.astro';

const description = 'What this site is built with.';
---

<Base title="Colophon" {description}>
  <PageHead title="Colophon" lead={description} />

  <section class="border-border border-t">
    <div class="prose mx-auto max-w-wide px-4 py-12 md:py-16">
      <p>…</p>
    </div>
  </section>
</Base>
```

Add it to `nav.header` or `nav.footer` in `config.ts` to link it.

## Body copy

Notes, product pages and the legal pages use one class, `.prose`, defined at the end of
`src/styles/global.css`. There is no typography plugin to configure: change the rules there,
and wrap anything that should keep its own look in `.not-prose`.

## Changing the theme's own words

Every word the theme prints itself -- headings such as `Work` and `Notes`, the metadata
line, the contact form, the 404 -- is in `src/i18n/en.ts`, with a Korean edition in
`src/i18n/ko.ts`. Pages and components read them through `useT()` in `src/i18n/t.ts`.

- **Rewording.** Edit `en.ts`. A key is a string, or a `{ one, other }` pair where the
  number changes the word (`1 note`, `2 notes`); `Intl.PluralRules` picks the form.
- **A site in another language.** Set `site.locale`. `ko` is ready; for any other language
  copy `en.ts` to `src/i18n/<code>.ts`, translate it, and add it to `dicts` in `t.ts`. The
  file is typed against `en.ts`, so a missing key is a build error rather than an English
  word on a translated page. Some keys in the dictionaries are for Leader Pro's pages;
  they cost nothing here.
- **Not in the dictionaries:** your own words in `src/config.ts` (site name and description,
  nav labels, category names and blurbs), the page copy of `about`, `privacy`, `terms` and
  the contact line, the footer credit, and everything in `src/content/`.

## The footer credit

The footer carries one line — `Leader theme by ondelva`, linking to the theme's page on ondelva.com.
It is the `<p>` at the foot of `src/components/common/Footer.astro`; delete it and the
theme works exactly as it did. Keeping it is how the next person finds the theme, and it is
the only thing the free edition asks for. Leader Pro ships without it.

## Legal pages

`privacy.astro` and `terms.astro` are placeholders written for a static site that collects
nothing. Read them and replace them with your own before you publish.
