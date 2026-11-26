# Customization

Everything in this file is a change to one of two places: `src/config.ts` (what the site is and
which features are on) and `src/styles/theme.css` (what it looks like). Nothing here asks you to
edit a component.

## What is in `src/config.ts`

| Group        | Setting                                                       | What it does                                                                    |
| ------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `site`       | `name` `description` `url` `locale` `author` `defaultOgImage` | Identity. Printed in the wordmark, the footer, the feed and every canonical URL |
| `nav`        | `header` `footer` `social`                                    | The desk bar, the footer groups and the social icons                            |
| `seo`        | `titleTemplate` `twitterHandle` `jsonLd`                      | Title pattern and the site-wide structured data                                 |
| `coverLines` | `overlay` `divider` `max`                                     | The signature: how the teasers on a cover plate are set                         |
| `blog`       | `postsPerPage` `relatedPosts` `showReadingTime`               | A desk front's page size, and what the foot of an article carries               |
| `features`   | `darkMode`                                                    | The switches                                                                    |
| `analytics`  | `provider` `id` `host`                                        | One tag, or none. `host` is for a self-hosted install                           |

The rest of this file goes group by group, plus the file that is not config: the tokens in
`theme.css`.

## Site identity

```ts
export const site = {
  name: 'Halftone',
  description: 'A newsmagazine where the picture leads...',
  url: 'https://example.com',
  locale: 'en',
  author: 'Linnea Holm',
  defaultOgImage,
};
```

`url` is the one you must change before you deploy: canonical links, the feed, the sitemap and
`robots.txt` all print absolute URLs from it. `locale` is a BCP 47 code and sets both the document
language and the way dates and counts are formatted. `defaultOgImage` is the photograph shared for
a page that has none of its own — the import at the top of the file, cropped to 1200x630 at build.

`author` is the editor: printed in the footer line, in the colophon and in the site-wide JSON-LD.

## Navigation, footer and social links

`nav.header` is the desk bar. It is a written list rather than a loop over the desks, because the
bar also carries the colophon and because five desks fit across a phone and seven do not.

`nav.footer` is a list of groups, each a title and its links. The theme ships one, **More**, with
the colophon and the feed in it. A group with no links does not print, so a group you empty
disappears rather than leaving a heading behind.

`nav.social` takes [Lucide](https://lucide.dev/icons) icon names — `lucide:github`,
`lucide:instagram`, `lucide:rss`. An empty list prints no icon row at all.

## Colour

`src/styles/tokens.css` holds every colour the theme uses, each written once as
`light-dark(<light>, <dark>)`. Do not edit that file — override what you want in
`src/styles/theme.css`, which is loaded after it and is the file that survives an update:

```css
:root {
  --primary: light-dark(#8c1f2f, #e08792);
}
```

A plain colour (`--primary: #8c1f2f`) changes both modes at once. Keep the two apart unless
you mean it: the dark-mode value of a spot colour is almost always lighter than the light-mode
one, or it disappears into the page.

| Token                                                                | What it paints                                                 |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| `--background` / `--surface`                                         | the page, and the blocks set into it (callouts, figures)       |
| `--foreground` / `--muted`                                           | body text; bylines, folios and photo credits                   |
| `--border`                                                           | hairline rules                                                 |
| `--primary` / `--primary-hover` / `--on-primary`                     | the spot: wordmark, kicker boxes, links                        |
| `--plate` / `--on-plate` / `--on-plate-muted` / `--primary-on-plate` | cover plates — the scrim over a photograph, and the type on it |

The plate tokens are the same in both modes on purpose. A plate is dark whatever the reader
has chosen, because it sits on a photograph.

### Contrast

`pnpm check:contrast` measures every text colour against every background it can land on, in
both modes, and fails below WCAG AA. Change a colour, run it, and fix what it flags before you
publish — AA is the one thing in this theme you should not talk yourself out of.

## Type

Three CSS variables carry the whole theme: `--font-body` (article prose and decks),
`--font-heading` (headlines, the wordmark, navigation) and `--font-mono` (kickers, folios,
photo credits, figures).

Webfonts are loaded by Astro in `astro.config.mjs`, which is why a font is not a `theme.css`
override. To use system fonts instead, set the variables in `theme.css` and delete the
matching block from the config's `fonts` array.

## The cover lines

The signature of the theme: the labelled teasers set on the cover plate. `coverLines` in
`config.ts`:

| Setting   | Values                         | What it does                                             |
| --------- | ------------------------------ | -------------------------------------------------------- |
| `overlay` | `true` / `false`               | on the photograph, or on a plate-coloured panel below it |
| `divider` | `'plus'` / `'rule'` / `'none'` | what separates one entry from the next                   |
| `max`     | a number                       | how many entries the home plate carries                  |

Set `overlay: false` when your cover photographs are light or busy. Type on a picture is a
promise about the picture, and it is better made once, in config, than guessed at per article.

## The desk front and the article

```ts
export const blog = {
  postsPerPage: 4,
  relatedPosts: 3,
  showReadingTime: true,
};
```

A desk front carries its newest piece on a plate and the rest as a list, `postsPerPage` at a time.
Six is chosen so that a desk with seven pieces actually paginates; raise it and page two appears
later. `relatedPosts` is how many pieces the "what to read next" rundown at the foot of an article
carries. They are scored, not listed: a shared tag weighs double a shared desk, and anything the
rail already printed is taken out first, so nothing on the page comes round twice.
`showReadingTime: false` drops the estimate from the dateline.

## Feature switches

```ts
export const features = {
  darkMode: true,
};
```

| Switch     | On                                        | Off                                                                    |
| ---------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `darkMode` | The light/dark control sits in the header | The page follows the reader's system setting and says nothing about it |

## Share cards

An article's card is its own photograph, cropped to 1200×630 and baked to JPEG at build.

A page with no photograph of its own — the colophon, the 404 — shares the picture in
`site.defaultOgImage`, which is an import at the top of `config.ts`. Point it at a photograph
that says what the magazine is; it is the card a reader sees before they have seen the site.

## Analytics

```ts
export const analytics = {
  provider: null as null | 'plausible' | 'ga4' | 'umami',
  id: '',
  host: '',
};
```

One tag, or none. Nothing at all is emitted until a provider is named, so a site that measures
nothing ships no third-party script, no cookie banner and no extra request.

`id` is the identifier the provider gave you: the domain for Plausible, the measurement id
(`G-XXXXXXX`) for GA4, the website id for Umami. `host` is for a **self-hosted** Plausible or
Umami — the origin the script is served from, with or without a trailing slash. Leave it empty for
the hosted service.

Plausible and Umami need no consent notice in their hosted form: neither sets a cookie nor stores
an identifier. GA4 does both, and a site using it needs its own notice. That is a legal choice, not
a theme setting, and the theme does not make it for you.

## UI strings and languages

Every word the theme prints that your writing did not — labels, counts, navigation — is in
`src/i18n/<code>.ts`. English and Korean ship. To write the site in another language, add the
module against the `Strings` type, import it in `src/i18n/index.ts`, and set `site.locale` to its
code. The type fails the build the moment `en.ts` grows a key your module has not answered.

The standing prose on the colophon and the other pages is deliberately _not_ in the string tables.
That copy is yours to rewrite in the page it belongs to; a magazine's about-page voice does not
belong in a table of button labels.

## SEO

```ts
export const seo = {
  titleTemplate: '%s · Halftone',
  twitterHandle: '',
  jsonLd: { type: 'Person', name: site.author },
};
```

`%s` is the page title; the home page prints `site.name` alone. `jsonLd.type` is `Person` for a
magazine with an editor and `Organization` for one with a masthead. Per-page structured data —
`NewsArticle`, `BreadcrumbList` — is added by the pages themselves through `SEO.astro`, which is
the only file that writes `<head>` meta.

## Favicon

`public/favicon.svg` and `public/favicon.ico`. These are the two files in `public/` that are meant
to be there; everything else belongs in `src/assets/` so that Astro processes it.
