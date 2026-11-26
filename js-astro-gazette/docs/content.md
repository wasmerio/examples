# Content

The magazine is Markdown and JSON under `src/content/`, validated by `src/content.config.ts`. There
is no CMS and no database: every page is built in advance.

The unit is the **issue**. An issue has a cover, a contents page and a handful of pieces; every
piece belongs to exactly one issue and carries its position in that issue's contents.

Images belong in `src/assets/` and are referenced from a content file by relative path
(`../../assets/cover.jpg`), so Astro can process and hash them. `public/` is only for files that
must be served untouched, like the favicon.

## issues

`src/content/issues.json` — one entry per issue, keyed by an id. The key is only a key; the URL is
the number.

| Field           | Type         | Required      | Notes                                                                                |
| --------------- | ------------ | ------------- | ------------------------------------------------------------------------------------ |
| `number`        | integer      | yes           | Both the URL (`/issues/4`) and the folio number                                      |
| `date`          | date         | yes           | Publication date, printed on the cover and in the archive                            |
| `coverLine`     | string       | yes           | The line on the cover. It need not be an article title                               |
| `coverArticle`  | article slug | yes           | The piece the cover points at                                                        |
| `coverImage`    | image        | no            | Left out, the cover is a spot-colour panel — the designed default, not a placeholder |
| `coverImageAlt` | string       | with an image | Required as soon as `coverImage` is set                                              |
| `editorsNote`   | string       | no            | Left out, the note block is not rendered at all                                      |
| `draft`         | boolean      | no            | `true` keeps the issue out of the site, in dev and in the build                      |

```json
{
  "issue-04": {
    "number": 4,
    "date": "2026-09-18",
    "coverLine": "The city that works while the city sleeps",
    "coverArticle": "bread-before-dawn",
    "editorsNote": "We spent this issue awake at hours most of our readers aren't."
  }
}
```

## articles

`src/content/articles/<slug>.md` or `.mdx` — one file per piece. The filename is the URL:
`/issues/<issue number>/<slug>`.

| Field         | Type                | Required      | Notes                                                           |
| ------------- | ------------------- | ------------- | --------------------------------------------------------------- |
| `title`       | string              | yes           |                                                                 |
| `subtitle`    | string              | no            | The standfirst under the title                                  |
| `issue`       | issue id            | yes           | The key in `issues.json`, not the number                        |
| `order`       | integer             | yes           | Position in the contents, and the folio numerator               |
| `department`  | enum                | yes           | `Feature`, `Essay`, `Report`, `Interview`, `Dispatch`           |
| `authors`     | array of author ids | yes           | At least one; several print as a shared byline                  |
| `image`       | image               | no            | The opener                                                      |
| `imageAlt`    | string              | with an image | Required as soon as `image` is set                              |
| `imageCredit` | string              | no            | Printed under the opener                                        |
| `pullQuote`   | string              | no            | `.md` only — prints as an epigraph above the text               |
| `dropCap`     | boolean             | no            | Overrides `issues.dropCap` in `src/config.ts` for this piece    |
| `draft`       | boolean             | no            | `true` keeps the piece out of the site, in dev and in the build |

```md
---
title: 'Bread Before Dawn'
subtitle: 'A neighborhood bakery runs its entire working day between midnight and seven.'
issue: 'issue-04'
order: 1
department: 'Feature'
authors: ['marguerite-oyelaran']
dropCap: true
---

At half past midnight, the only light on the street comes from a bakery…
```

`department` is an enum, which means renaming a value is a content migration: every piece carrying
the old value fails validation until it is edited.

## authors

`src/content/authors.json` — keyed by the id a piece puts in `authors`.

| Field   | Type   | Required | Notes                                               |
| ------- | ------ | -------- | --------------------------------------------------- |
| `name`  | string | yes      | The byline                                          |
| `bio`   | string | no       | Printed under the piece and on the contributor page |
| `image` | image  | no       |                                                     |

```json
{
  "marguerite-oyelaran": {
    "name": "Marguerite Oyelaran",
    "bio": "Marguerite Oyelaran edits Gazette from London."
  }
}
```

Contributors are listed on the masthead page (`/about`) with the number of pieces they have filed.

## What is computed, and therefore not a field

Reading time (from the body), the folio (`order` over the issue's article count), the number of
pieces in an issue, every URL, and the previous and next issue (`number` ± 1). Do not add a field
for any of these.

## MDX

A piece can be `.md` or `.mdx`; the schema and the URL are the same either way. Tables and
footnotes (GFM) work in both.

## Adding a field

Fields are declared with zod in `src/content.config.ts`. Adding a **required** field invalidates
every existing file at once, so add new fields as `.optional()` or with a `.default()`, and run
`pnpm check` to see what the schema says.
