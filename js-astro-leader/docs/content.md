# Content

Two collections, both typed with zod in `src/content.config.ts`. A file that breaks its
schema fails the build with the field and the file named, rather than shipping a half-empty
row.

```
src/content/
  work/<slug>.md      one product
  notes/<slug>.md     one note   (.mdx when it imports a component)
```

The filename is the URL: `work/pennant.md` is `/work/pennant`, `notes/one-tab-one-glance.md`
is `/notes/one-tab-one-glance`.

## Categories come first

Both products and notes require a `category`, and it has to be one of the slugs in
`categories` in `src/config.ts`. That is not bureaucracy — the category is the colour, the
colour is what makes a group readable down the right edge of every list, and a row without
one has nothing on one of its two ends.

Four categories is the ceiling: the palette has four accents and past four the colours stop
telling groups apart. Rename one in `config.ts` and the schema enum changes with it, so a
file still using the old slug is a build error rather than a silent colourless row.

## Products — `src/content/work/`

| Field      | Type                               | Required | Notes                                                                                    |
| ---------- | ---------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `title`    | string                             | yes      | The left end of the row                                                                  |
| `category` | a slug from `config.ts`            | yes      | The right end, in that category's colour                                                 |
| `summary`  | string, max 160                    | yes      | The line under the row, and the meta description when the body offers nothing better     |
| `status`   | `live` \| `building` \| `archived` | no       | Default `live`. `building` dims the row; `archived` drops it to its own group on `/work` |
| `started`  | date                               | yes      | Only the year is ever printed                                                            |
| `url`      | URL                                | no       | The product itself                                                                       |
| `repo`     | URL                                | no       | Source, if it is public                                                                  |
| `order`    | integer                            | no       | Shelf order, ascending. Files without one follow, newest first                           |
| `draft`    | boolean                            | no       | Default `false`. `true` leaves it out of the build entirely                              |

```md
---
title: 'Pennant'
category: 'tooling'
summary: 'A status page that fits in one browser tab.'
status: 'live'
started: 2024-03-11
url: 'https://pennant.example.com'
repo: 'https://git.example.com/ada/pennant'
order: 1
---

The body is the product page: what it does, what it does not do, why it exists.
```

A product with `status: building` is dimmed rather than hidden, because a shelf that shows
what is half-built is more interesting than one that does not. If you disagree, set
`work.showBuilding: false` in `src/config.ts` and it is left out until its status changes.

## Notes — `src/content/notes/`

| Field         | Type                    | Required | Notes                                                                             |
| ------------- | ----------------------- | -------- | --------------------------------------------------------------------------------- |
| `title`       | string                  | yes      |                                                                                   |
| `category`    | a slug from `config.ts` | yes      | Same list as products                                                             |
| `pubDate`     | date                    | yes      | Sorting, the date column, the feed                                                |
| `updatedDate` | date                    | no       | Printed beside the byline when present                                            |
| `description` | string, max 160         | no       | Without it the first paragraph of the body is used, cut at a word                 |
| `work`        | a file id in `work/`    | no       | Files the note under a product: it appears on that product's page, and vice versa |
| `author`      | string                  | no       | Falls back to `site.author`                                                       |
| `draft`       | boolean                 | no       | Default `false`                                                                   |

```md
---
title: 'Why the queue got expensive'
category: 'data'
pubDate: 2026-08-14
description: 'A retry policy I wrote in ten minutes cost me four months of database bill.'
work: marlin
---

The body. Footnotes are ordinary GFM.
```

Dates are written plainly (`2026-08-14`) and read as UTC, so a date-only `pubDate` never
slips a day west of Greenwich.

## Inside a note

- **Footnotes** are ordinary GFM: `text[^1]` in the body, `[^1]: the note` at the end.
- **Math** is LaTeX between dollar signs: `$…$` inside a sentence, `$$…$$` on lines of its
  own. KaTeX sets it at build time, so the page ships no script for it, and only a page with
  math loads the KaTeX stylesheet. Chemical equations use mhchem: `$\ce{2H2 + O2 -> 2H2O}$`.
  Two dollar signs in one paragraph (`$20 and $30`) read as a formula between them; write `\$`
  for a literal one.
- **Code blocks** are highlighted with the theme's own colours rather than an imported IDE
  theme.
- **Components** need MDX. Rename the file to `.mdx` and import your own component at the
  top of the body; Leader Pro ships a `Callout` for the aside that is true but is not the
  argument.
- **Images** are the author's business — the theme is finished without any. There is no
  `src/assets/` until you make one: create it, put the file there, and use `<Image>` from
  `astro:assets` in an `.mdx` file, or a plain
  Markdown image for something already sized. Every one needs alt text.

- **A figure that should follow the palette is an SVG, not a picture of one.** A
  photograph is the same in both modes, so `<Image>` is right for it. A chart or a diagram
  is not: a light-mode PNG is unreadable on the dark canvas, and the theme switches through
  `color-scheme` rather than `prefers-color-scheme`, so a `<picture>` with a media query
  will not follow the switcher. Importing an `.svg` gives you a component instead, and
  because the markup is inlined, `currentColor` and the theme's own tokens work inside it:

  ```mdx
  import Chart from '../../assets/monthly-cost.svg';

  <figure>
    <Chart />
    <figcaption>What the caption says.</figcaption>
  </figure>
  ```

  The sample note "What the shelf costs to run" does exactly this. Give the `<svg>` a
  `role="img"` and a `<title>` — that title is its alt text — and set its own `width` and
  `height` so it renders at its drawn size rather than stretching to the measure.

## Drafts

`draft: true` excludes a file from the build everywhere: the lists and the feed. There is
no preview URL — run `pnpm dev`, where drafts are also
excluded, and flip the flag when it is ready.

## The feed

`/rss.xml` carries every note, newest first, with the description or the opening of the
body. `<link rel="alternate">` in every page's `<head>` points at it, so a reader that
looks for a feed finds one from any page on the site. Leader Pro adds a feed per category
and a Pagefind search.
