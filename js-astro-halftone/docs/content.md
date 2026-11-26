# Content

Three collections, defined in `src/content.config.ts` and validated at build. Articles are
Markdown or MDX files in `src/content/articles/`; desks and authors are JSON lists.

A build fails, loudly and with the file named, when a field is missing or the wrong shape. That is
the point of the schema: a magazine with a headline and no photo credit should not ship.

## desks

`src/content/desks.json`. A desk is a section of the magazine and the axis the whole site turns
on. The `id` **is** the route segment (`/world`) and the value an article puts in `desk`, so there
is no second slug field to fall out of sync with it.

```json
{
  "id": "world",
  "name": "Ports",
  "blurb": "The edge where a country meets its freight: quays, cranes, and the weather that stops them.",
  "order": 1
}
```

| Field   | Type         | Notes                                                                      |
| ------- | ------------ | -------------------------------------------------------------------------- |
| `id`    | string       | The route segment. Lowercase, hyphenated                                   |
| `name`  | string       | Printed on the desk bar and, by default, in an article's kicker box        |
| `blurb` | string?      | The standing line on the desk front. Absent: the front opens into the list |
| `order` | positive int | Navigation and home order                                                  |

Adding a desk is a row here plus a row in `nav.header`. The header list is written by hand rather
than looped, so a desk you do not want in the bar can exist without appearing in it.

## articles

One file per article, in `src/content/articles/`. **The filename is the slug**, and the route is
`/<desk>/<filename>`.

```yaml
---
title: 'The cranes at Kieldrecht'
deck: 'A row of ship-to-shore gantries stands on the left bank of the Scheldt, above a polder.'
standfirst: 'The MSC PSA European Terminal is the newest edge of the Port of Antwerp.'
desk: 'ports'
kicker: 'Dispatch'
byline: ['linnea-holm']
date: 2026-09-18
hero: '../../assets/sample/the-cranes-at-kieldrecht.avif'
heroAlt: 'A long row of container gantry cranes silhouetted above flat ground at dusk'
heroCaption: 'Container cranes at the MSC PSA European Terminal, Kieldrecht.'
heroCredit: 'Benoit Brummer / CC BY 4.0'
heroFocus: 'right'
format: 'report'
featured: true
tags: ['ports', 'shipping', 'infrastructure']
---
```

| Field         | Type                          | Required | Notes                                                                           |
| ------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------- |
| `title`       | string                        | yes      | The headline                                                                    |
| `deck`        | string                        | yes      | Two or three lines. Carries the cover line and the desk list                    |
| `standfirst`  | string                        |          | The lead paragraph under the headline. Falls back to `deck`                     |
| `desk`        | desk id                       | yes      | Must exist in `desks.json`                                                      |
| `kicker`      | string                        |          | The label box. Falls back to the desk name                                      |
| `byline`      | author ids, at least one      | yes      | Must exist in `authors.json`                                                    |
| `date`        | date                          | yes      | `YYYY-MM-DD`. The dateline, and the sort order everywhere                       |
| `hero`        | image                         | yes      | Relative path into `src/assets/`. The picture leads here, so it is not optional |
| `heroAlt`     | string                        | yes      | And neither is its alt text                                                     |
| `heroCaption` | string                        |          | Printed under the picture on the article page                                   |
| `heroCredit`  | string                        | yes      | A photograph that ships without its source is a liability                       |
| `heroFocus`   | `left` `center` `right`       |          | Where the plate crops when cover lines sit over the picture. Default `center`   |
| `format`      | `report` `photoessay` `brief` |          | Default `report`. The layout branches on this, and on nothing else. See below   |
| `featured`    | boolean                       |          | Candidate for the home plate's cover lines. Default `false`                     |
| `rail`        | block list                    |          | See below                                                                       |
| `tags`        | string list                   |          | Subjects. They weight the related reading at the foot of a piece                |
| `draft`       | boolean                       |          | Default `false`. `true` keeps it out of the build                               |

`format` decides the shape of the page. A **report** runs a wide picture with the rail as a column
beside the body. A **brief** opens at the text measure and prints its rail under the body, because
a thousand words cannot hold a column alongside. A **photo essay** puts the headline on the
picture, gives the page over to it, and carries no rail at all.

### The rail

`rail` is the column beside the body — from 64rem up, and under the body below that. It is a list
of blocks, in the order you want them, each tagged by `kind`:

```yaml
rail:
  - kind: stat
    value: '3×'
    label: 'Passengers per sailing since March'
    source: 'Wikimedia Commons'
```

| Block  | Fields                    | Notes                                               |
| ------ | ------------------------- | --------------------------------------------------- |
| `stat` | `value` `label` `source?` | `value` is set in tabular figures, so keep it short |

Adding a rail block of your own means a new member of the union in `content.config.ts` and a case
in `src/components/article/Rail.astro` — a second field beside `rail` would lose the author's order.

## authors

`src/content/authors.json`. The `id` is the value articles use in `byline`, and the route segment
of the contributor page (`/by/dessie-okonkwo`).

| Field      | Type         | Notes                                                            |
| ---------- | ------------ | ---------------------------------------------------------------- |
| `id`       | string       | Lowercase, hyphenated                                            |
| `name`     | string       | As it is printed in a byline                                     |
| `role`     | string?      | Printed in the colophon masthead                                 |
| `order`    | positive int | Masthead running order. Default `99`                             |
| `bio`      | string?      | Printed at the foot of an article and on the contributor page    |
| `portrait` | image?       | Relative path into `src/assets/`                                 |
| `links`    | list?        | `{ label, href }`. `href` must be a full URL, `mailto:` included |

`order` exists because `getCollection` returns authors alphabetically by id, which is not an order
any masthead was ever set in.

## What is computed, and so is not a field

Reading time, the related pieces at the foot of an article and the desk's date span are all
derived at build from what is above. None of them is a frontmatter field, and none of them can
drift from the content.

## MDX

A `.md` file is Markdown. Rename it `.mdx` and the body can import a component of your own — a
chart, a map, an embed — and use it inline:

```mdx
import Soundings from '../../components/Soundings.astro';

<Soundings port="Kieldrecht" />
```

The demo ships one `.mdx` piece so the pipeline is wired and typechecked. For three headline
numbers, use the rail's `stat` blocks rather than a component: the rail is where this theme keeps
its figures.

## Adding a field

Edit the schema in `src/content.config.ts`, then read it in the component that prints it.

Make it **optional, or give it a default**. A required field invalidates every file that does not
have it yet, and the build stops on the first one. Adding `.optional()` now and tightening it later,
once the content has caught up, costs nothing.
