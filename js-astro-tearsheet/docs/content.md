# Content

Tearsheet has one collection, **issues**, defined in `src/content.config.ts`. Everything else on
the site (the numbers, the archive, the topic pages, the meters) is computed from it.

The about, privacy and terms pages are plain Markdown in `src/pages/` with
`layout: ../layouts/Page.astro`. Edit them like any Markdown file.

## issues

One file per issue in `src/content/issues/`, `.md` or `.mdx`. The filename is the URL:
`src/content/issues/the-oldest-ship-on-the-loop.md` is served at `/issues/the-oldest-ship-on-the-loop/`.

```md
---
title: 'The oldest ship on the loop'
dek: 'Average vessel age on main-lane services is falling, but the average hides a tail.'
date: 2026-09-15
topics: ['Capacity', 'Carriers']
---

The free part of the issue.

<!-- cut -->

The members part. It is removed from the build.
```

| Field     | Type     | Required | Notes                                                                              |
| --------- | -------- | -------- | ---------------------------------------------------------------------------------- |
| `title`   | string   | yes      |                                                                                    |
| `dek`     | string   | yes      | The italic line under the title. Also the meta description and the feed summary    |
| `date`    | date     | yes      | `YYYY-MM-DD`. Orders the issues and sets their numbers (below)                     |
| `updated` | date     | no       | Printed on the issue and used in the JSON-LD `dateModified`                        |
| `topics`  | string[] | no       | Each topic gets a page at `/topics/<slug>/`. Spelling must match across issues     |
| `ogImage` | image    | no       | Path relative to the issue file, e.g. `./card.png`. Replaces `site.defaultOgImage` |
| `draft`   | boolean  | no       | `true` keeps the issue out of the build entirely, in dev as well                   |

## The Cut: marking the members part

A members issue has one marker where the free part ends. In `.md`:

```md
<!-- cut -->
```

In `.mdx`, where HTML comments are not allowed:

```mdx
{/* cut */}
```

Everything after the marker is removed while the site is built. It is not hidden with CSS and it
is not in the HTML or the RSS feed. `pnpm check:cut` proves that after a build
by looking for each members passage in every file in `dist/`.

Rules:

- **The marker stands on its own line, with a blank line above and below.** A marker inside a
  list, a quote or a table would mark the issue as members-only without cutting anything, so the
  build stops with an error instead.
- One marker per issue. If there are two, the first one counts.
- No marker: a free issue, published in full.
- A footnote whose definition sits below the cut is removed from the free part too, reference
  and all.

What this is, and what it is not: this is a static site, so it cannot check who is logged in.
Your members read the full issue in their email, sent by your newsletter provider, and the line under The Cut tells them so. The site
publishes the free part, shows how much is left, and asks for the subscription. The full text
still lives in `src/content/issues/` in your repository, so keep that repository private
(see [deploy.md](deploy.md)).

## Pictures

Put the file next to the issues, in `src/content/issues/images/`, and refer to it relatively:

```md
![Gantry cranes lit red over a container ship at night](./images/altenwerder-night.jpg)

_Colombo Express at the Altenwerder terminal, Hamburg, July 2009. Photo: Martin Damboldt, CC0._
```

- The picture is resized at build time and served as WebP in several widths with a `srcset`.
  Save it about 1280px wide (twice the reading column); a larger original only costs build time.
- The alt text describes what is in the picture. It is not counted in the word meter.
- A line set wholly in emphasis right after the picture is styled as its caption. Credit the
  photographer there when the licence asks for it.
- **A picture after the cut is cut with the text.** It is never processed, so it is not in
  `dist/`, and `pnpm check:cut` fails the build if it finds one there. This holds only for
  pictures in `src/`: a file in `public/` is copied to the site whatever links to it, so never
  put a members picture there.

## What is computed, and therefore not a field

- **The issue number.** Issues are numbered by `date`, oldest first, starting at
  `newsletter.firstIssue` in `src/config.ts`. Adding an issue dated before an existing one
  renumbers every issue after it; a draft takes no number.
- **The week label** (`2026.41`): the ISO 8601 week of `date`.
- **Members-only**: the body has a cut marker.
- **Word counts, the free share and the minutes left** on the meter. Words are counted from the
  source, ignoring markup, link targets, comments and code. 230 words a minute.
- Topic pages and their counts, previous and next, every URL.

Do not add a field for any of these.

## Adding a field

1. Add it to the schema in `src/content.config.ts`, as `.optional()` or with `.default(...)`.
   A required field fails every existing issue.
2. Read it where you need it: `issue.data.<field>` in a page or component. Pages get issues from
   `getIssues()` in `src/lib/issues.ts`, never from `getCollection` directly — that function is
   where drafts are filtered and numbers are assigned.
3. `pnpm check && pnpm build`.
