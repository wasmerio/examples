# Content

Two collections, defined and type-checked in `src/content.config.ts`. `pnpm dev` and
`pnpm build` both fail with the file name and the field when frontmatter does not match,
so the schema is the first place to look when a build stops.

- `src/content/objects/*.mdx` — one file per object. This is the catalogue.
- `src/content/collections/*.md` — the archive's own divisions.

Delete the samples when you start your own archive; nothing in the code refers to them by
name.

## An object

```mdx
---
title: 'Mechanical table'
image: '../../assets/objects/riesener-mechanical-table-1781.webp'
caption: 'Cabinetwork'
dateText: 'ca. 1781'
year: 1781
medium: 'Oak veneered with mahogany, gilt bronze, steel'
dimensions: '80.6 × 111.4 × 64.1 cm'
accession: '33.12'
collection: 'cabinetwork'
span: 2
featured: true
credit: 'Photograph: the archive'
---

The top rises on a rack worked from the side, and the writing surface comes
forward with it.
```

| Field        | Required | Notes                                                                                                                                                                                                                                                                                                          |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`      | ✓        | Also the alt text of the plate                                                                                                                                                                                                                                                                                 |
| `image`      | ✓        | Path relative to the file, resolved through `astro:assets`. Cut out or shot on white: the plate sets the object _inside_ the cell, so any aspect ratio works and nothing is ever cropped. The edge of the photograph is faded into the paper, so a sweep that is not quite white does not print as a rectangle |
| `caption`    | ✓        | The line above the cell. A label, not a sentence: "Glass", "Cabinetwork"                                                                                                                                                                                                                                       |
| `dateText`   | ✓        | Printed exactly as written — `ca. 1600`, `1893–96`, `undated`. The display string is the required field because a catalogue dates things in prose                                                                                                                                                              |
| `year`       |          | A number, used for sorting. The catalogue is arranged by collection and then by year; undated entries sort to the end of their collection, by title                                                                                                                                                            |
| `medium`     | ✓        | First line of the cartellino                                                                                                                                                                                                                                                                                   |
| `dimensions` |          | Printed on the entry page                                                                                                                                                                                                                                                                                      |
| `accession`  |          | Your own catalogue number. Left out, the entry is numbered by where it falls — collection 02, third entry, is `02-03`. `catalogue.showAccession` hides numbers everywhere                                                                                                                                      |
| `collection` | ✓        | The `id` of a file in `src/content/collections/` — its filename without the extension. A name that does not exist fails the build                                                                                                                                                                              |
| `credit`     |          | Photograph or lender credit, printed small under the entry                                                                                                                                                                                                                                                     |
| `span`       |          | `1` or `2`. A `2` takes a double-width cell in the grid                                                                                                                                                                                                                                                        |
| `featured`   |          | Eligible for the home page plate                                                                                                                                                                                                                                                                               |
| `draft`      |          | `true` keeps the entry off every page. The photograph is another matter — see below                                                                                                                                                                                                                            |

The body of the file is the note, printed under the object. It is MDX, so a component
import works, but a note is usually a paragraph or two.

### Work not ready to be seen

`draft: true` keeps an entry out of the catalogue and the collections. It does not keep
its photograph out of `dist/`: the file is still read, so the image is still registered
and still built, unlinked but downloadable by anyone who guesses the name.

Objects under `src/content/objects/_drafts/` are not read at all, which is where an
object that must not leave the building belongs. Move the file back up a level when
it is ready — the image path goes back from `../../../assets/` to `../../assets/` —
and the entry is catalogued from that build on.

Both, together, are the safe habit: the folder for the photograph, `draft: true` for
the entry, so a file moved up before its note is finished still does not print.

## A collection

```md
---
title: 'Silver'
description: 'Raised, cast and gilded work, dated by the marks struck into it.'
order: 2
cover: '../../assets/objects/burghley-ewer.webp'
---
```

| Field         | Required | Notes                                                                                                                         |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `title`       | ✓        |                                                                                                                               |
| `description` | ✓        | One paragraph, printed above the plates and used as the page description                                                      |
| `order`       |          | A positive integer. Sections of a catalogue are arranged, not alphabetised; files without an `order` follow the numbered ones |
| `cover`       |          | Kept for the Pro edition, where a section found by search is drawn with it. Nothing in this edition prints it                 |

A collection page prints `description` above its plates and nothing else; the body of the
file is not rendered in this edition.

The filename is the id: `silver.md` is referenced as `collection: 'silver'` and lives at
`/collections/silver/`.

## Images

Put them in `src/assets/objects/` and reference them with a relative path. Astro hashes,
resizes and converts them at build time; nothing in `src/assets/` is served as you wrote
it, and nothing belongs in `public/` except the favicon and the default share image.

WebP at around 1600px on the long side is a good target: large enough for the plate to
hold at page size, small enough that the catalogue page stays fast.

## Feed, sitemap, share cards

`/rss.xml` lists the catalogue in order, and `/sitemap-index.xml` is generated at build.
An object page shares its own plate as the preview image; every other page falls back to
`site.defaultOgImage`, which is `public/og-default.jpg` — replace it with a picture of
your own archive.
