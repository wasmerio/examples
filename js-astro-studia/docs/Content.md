# Content

Eight collections, defined in `src/content.config.ts`. Every cross-reference
goes through Astro's `reference()`, which is the point of the whole file: a bad
slug, an unknown venue or a BibTeX key pointing at a page that does not exist
**stops the build and names the offender**. The single values that configure
the site live in `src/consts.ts` instead — see
[Configuration](Configuration.md) — and the words every page prints around its
data are a collection of their own, `pages` — see [Page text](#page-text).

What a failure looks like:

```
[ERROR] [content] Invalid content reference: entry "cicero_de_officiis_1913"
in collection "publications" (field: abbr) references "NOPE" in collection
"venues", but that entry does not exist.
```

## Replacing the demo content

Every path below holds Cicero's bytes. Grouped by directory, because the useful
property of the list is that it is finite.

| Where                  | What                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `src/consts.ts`        | `SITE.url`, `email`, `repo`, `brandLogo`, `SELF`, `FOOTER`; `demoNotice: false`                                                           |
| `src/content/pages/`   | every file: the title, brand, tagline and description in `site/`, the nav and footer rows, and each page's words                          |
| `src/styles/`          | `tokens.css`                                                                                                                              |
| `src/data/`            | `papers.bib`, `venues.yml`, `authors.yml`, `people.yml`, `cv.yml`, `contact.yml`, `socials.yml`, `repositories.yml`, `project-groups.yml` |
| `src/data/`, generated | `citations.yml`, `github-metadata.json`                                                                                                   |
| `src/content/`         | `papers/`, `projects/`, `posts/`                                                                                                          |
| `src/assets/`          | `portrait.*`, `papers/`, `projects/`, `people/`                                                                                           |
| `public/`              | `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`, `site.webmanifest`, `assets/img/og.png`, `assets/img/brand-mark.svg`            |
| `public/assets/`       | `pgp-key/*.asc`, `pdf/editions/de-re-publica-excerpt.pdf`, `img/papers/*.svg`, `img/posts/*.svg`                                          |
| the repository itself  | `README.md`, `.github/media/*.webp`, `LICENSE`                                                                                            |

Three of those are quieter than the others:

- `citations.yml` and `github-metadata.json` are keyed to the demo BibTeX entries
  and to GitHub's `octocat`. A key nothing matches is a **silent no-op, not an
  error** — stale rows simply never render. Empty both, then `npm run data:github`.
- the `.asc` under `public/assets/pgp-key/` is a throwaway: nobody holds the
  secret half, so it encrypts nothing. Delete it, and point `pgp_fingerprint` in
  `socials.yml` at your own key or at `null`.
- `public/site.webmanifest` says `"name": "M. T. Cicero"`. No page shows it;
  every app installer does.

## Where images live

One rule: **an image a collection schema names lives in `src/assets/`**, and the
schema declares it with Astro's `image()` helper. The path is written relative to
the file the entry came from, so from a markdown page under
`src/content/papers/` that is `../../assets/papers/overview.svg`, and from
`src/data/people.yml` it is `../assets/people/cicero.svg`. The build then gives
you a hashed filename, the intrinsic `width` and `height` the audit requires, and
`1x`/`2x` variants where a component asks for them.

| Field                        | Lives in                | Written as                            |
| ---------------------------- | ----------------------- | ------------------------------------- |
| `figure.src` on a paper page | `src/assets/papers/`    | `../../assets/papers/<name>.svg`      |
| `figure.src` on a project    | `src/assets/projects/`  | `../../assets/projects/<name>.svg`    |
| `logo` on a project          | `src/assets/projects/`  | `../../assets/projects/<name>.svg`    |
| `image` in `people.yml`      | `src/assets/people/`    | `../assets/people/<name>.svg`         |
| your portrait                | `src/assets/portrait.*` | nothing — the filename is the setting |

`image()` works the same under a `file()` loader as under `glob()`: `people` is
one YAML file rather than a directory of markdown, and its paths resolve relative
to `src/data/` because that is where the entry was loaded from.

`public/` is for files that need a URL that never moves — the favicons, the
manifest, `og.png` (a `<meta>` tag names it absolutely), your PDFs, your PGP key,
the brand mark that `SITE.brandLogo` points at, and any image a post **links** to
at full size. [Deploying](Deploying.md) has the full list and the reasoning.

An image you write into prose by hand is the one exception, and it stays in
`public/` — see [Images in a post](#images-in-a-post) below for why.

## Publications — `src/data/papers.bib`

Standard BibTeX, plus three fields that are this template's. All three are
stripped from the citation a reader copies, and all three are checked while the
site builds.

| Field  | Means                                                 | If it is wrong                           |
| ------ | ----------------------------------------------------- | ---------------------------------------- |
| `abbr` | the venue badge; a key in `venues.yml`                | build fails                              |
| `pdf`  | a file under `public/assets/pdf/`, or an absolute URL | build fails if the file is not there     |
| `page` | this work's own page, `/papers/<slug>/`               | build fails if the markdown is not there |

`abbr` is optional. An entry without one renders with no badge, which is what
you want for a preprint or a report — the alternative is inventing a "misc" row
in `venues.yml` for a required reference to point at.

```bibtex
@inproceedings{surname_keyword_2026,
  abbr         = {ICSE},
  title        = {A Title With a Brace-Protected {Acronym}},
  author       = {Surname, Given and Other, Someone},
  booktitle    = {Proceedings of Something},
  year         = {2026},
  month        = {5},
  location     = {Somewhere},
  doi          = {10.1145/1234567.1234568},
  pdf          = {2026/my-paper.pdf},
  page         = {/papers/my-paper/},
  keywords     = {one, two},
  google_scholar_id = {qXqzPbLUKZkC},
}
```

Braces protect casing: `{Acronym}` stays `Acronym` rather than being
sentence-cased. The loader parses the file twice — once decoded to Unicode for
display, once raw — so the block a reader copies keeps its LaTeX escapes
verbatim rather than a normalised approximation.

**Adding a link field of your own** is a `links[]` entry in
`src/content.config.ts`: the field to read, the key it lands under, and where
its value has to exist on disk. Declare the key in the schema too, or Zod drops
it.

## Venues — `src/data/venues.yml`

```yaml
ICSE:
  name: International Conference on Software Engineering
  url: https://conf.researchr.org/home/icse-2026
  color: '#a3107c'
```

Paste the venue's real brand colour. `VenueBadge.astro` mixes it toward white
for the label and toward the page for the fill, so a colour chosen for a white
conference site still reads here — you do not need to pre-lighten it.

## Authors and people

`authors.yml` is everyone who appears anywhere: in an author list, on a paper
page, or as a member of your group. Name and ORCID, nothing else.

`people.yml` is who appears on `/people/`, and it points at `authors.yml` for
the name rather than repeating it. **The key is the anchor** — `atticus` is
`/people/#atticus` — so renaming a key changes a published URL.

`surnames` is how a name parsed out of `papers.bib` is matched back to a
person, which is what turns an author name in the publication list into a link.
List every form someone publishes under, including a previous name. Matching
folds accents and `ß`, so `Fuchß`/`Fuchss` and `Muñoz`/`Munoz` both land.

## Paper pages — `src/content/papers/`

The filename is the URL. `de-officiis.md` is `/papers/de-officiis/`, and that
is what a `page = {/papers/de-officiis/}` field has to match.

```yaml
---
title: The title as it should appear on the page
description: One or two sentences. Used for the meta description too.
publication: surname_keyword_2026 # the BibTeX key
authors: [surname, other] # keys from authors.yml
projects: [some-project] # keys from src/content/projects/
status: to-appear # or `published`, the default
order: 1
featured: true # also list it in the entry page's paper block
figure:
  src: ../../assets/papers/overview.svg # relative to this file; see "Where images live"
  alt: A description someone who cannot see it would want.
  plate: true # white plate behind dark-on-transparent line art
  frame: approach overview # window frame, with this as its titlebar label
links:
  paper: { acm: https://…, arxiv: https://… }
  replication: { zenodo: https://… }
  slides: { pdf: /assets/pdf/2026/talk.pdf }
---
```

Nothing bibliographic goes in the front matter. Venue, year, DOI and the
citation all come from the BibTeX entry, so they have one source of truth.

That includes the short venue label — the breadcrumb leaf on the page, the
tag on a `/papers/` row, the line under a title in a project's related-papers
list. It is the entry's `abbr`, the badge's own text. An entry **without** an
`abbr` shows what it says it appeared in instead — the proceedings, journal or
series title — which is long, but is the entry's own record and so cannot be
wrong; an entry that names no container shows nothing. The template never
invents a word here: an earlier version fell back to "preprint" for any entry
without a badge, and called two published workshop papers preprints. The way
to a short label is the way to a badge — an `abbr` on the entry and a row in
`venues.yml`. `src/content/papers/de-fato.md` is the no-`abbr` case.

The page's meta description — what a link preview and a feed reader show —
is `description`, or failing that the venue: the stated `venue.label`, the
`conferenceName`, or the entry's container. Never the site's own blurb.

`order` is the sequence on `/papers/`; `featured` is what the entry page's
"Paper pages" block selects on, newest first, so that block is a handful of
pages you curate here rather than everything in the directory. Both are read
from this file and not from the BibTeX entry: they are decisions about the site,
and `papers.bib` is a bibliography.

The fields whose meaning is not obvious from the name:

| Field                     | Is                                                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                  | `published` (the default) or `to-appear`. The venue line reads "To appear at" rather than "Published at", and the row on `/papers/` is marked "· to appear" |
| `conferenceName`          | The event the work was presented at, which the proceedings title is not. The page wraps it in "Published at"                                                |
| `conferenceUrl`           | That event's own homepage, which neither `abbr`, `links.paper` nor the DOI points at                                                                        |
| `additionalPresentations` | Later outings of the same work — `{ name, shortName?, url }`. Not in `papers.bib`, where one entry per talk would list the paper five times                 |
| `projects`                | Keys from `src/content/projects/`, **written here and nowhere else**: a project page derives its own paper list by scanning this field                      |

`conferenceName` and `conferenceUrl` belong only to a page with a `publication`;
a stated `venue` already carries its own label and URL, and the schema rejects
the combination.

### A page for a talk that was never published

`publication` is optional, because not every page with something to say is a
publication: a working-group meeting, an invited lecture, a national workshop
prints no proceedings, so there is no BibTeX entry to point at and nothing to
cite. Such a page states the two things the entry would have told it — the year
and the venue — and is the one case where the front matter carries something
bibliographic, because there is nowhere else for it to be:

```yaml
---
title: 'De legibus naturae: praelectio Latine habita'
authors: [cicero, quintus, atticus]
# The only date the page has: /papers/, the feed and the project lists sort on it.
year: 2026
venue:
  mark: 🏛 # a flag or other mark before the label (ardoco.de uses 🇩🇪)
  label: Praelectio in Conventiculo Latino Arpinati habita
  short: Conventiculum Arpinas # for the breadcrumb and the list rows
  url: https://www.tulliana.eu/
  bylineConnector: oratores # the byline's "by", in the page's language
---
```

One object rather than four loose fields, because the four only mean anything
together: they are the parts of one sentence the page says for itself, in its
own language. That is also why `label` is the whole sentence and gets no
"Published at" in front of it, and why the byline drops the English `, and `
between the last two names in this case — a comma needs no translation.

The schema enforces the rest: `venue` and `publication` are mutually exclusive
(as are `venue` and `conferenceName`), and `year` is required with the former
and rejected with the latter. A page in this state keeps its **Cite** section,
with a sentence in place of the BibTeX saying that the venue publishes nothing —
the absence is a fact about the venue, not a hole in the site.

`src/content/papers/de-legibus-praelectio.md` is this case, with every field
annotated.

`links` has exactly three groups; any other key is silently dropped by the
schema. Add one in `content.config.ts` if you need it, and a label for it in
`LINK_LABELS` on the paper page. A key of the form `<venue>_<kind>`, where
`<kind>` is itself a labelled key, needs no row: `colloquium_pdf` renders as
"PDF (COLLOQUIUM)", so the decks from a work's several outings can sit side by
side under `slides` — see `linkLabel()` in `src/lib/papers.ts`.

## Projects — `src/content/projects/`

The filename is the URL here too: `latin-vocabulary.md` is
`/projects/latin-vocabulary/`.

`category` names a group in `src/data/project-groups.yml` — its heading, its
blurb and its `order` on `/projects/` — through `reference()`, so a typo fails
the build, and a new group is one entry in that file. It is optional. Leave
it off every entry and `/projects/` is one flat list with no group headings,
which is what a site that does not sort its projects wants; set it on some
entries and not others and the rest gather under a final "Other" group rather
than dropping off the page. An entry with `redirect` gets no page of its own
and links straight out — useful for work that lives on someone else's site.

`order` sorts within a group, lower first, ties broken by title. `repositories`
is a list of `{ name, url }` rendered as chips on the project's own page: the two
or three a reader of _this_ project needs, not the site-wide `/repositories/`
list.

Logos go in `src/assets/projects/`, like the page figure below, and run through
Astro's image pipeline — hashed filename, dimensions known at build time. That is
the difference between `src/assets/` and `public/`: only `public/` has URLs that
never move, and only things that need one belong there.

An optional `figure` puts an overview diagram above the prose — the same field,
with the same four keys, that a paper page takes:

```yaml
figure:
  src: ../../assets/projects/translation-strategies.svg
  alt: Three strategies for moving a term between languages.
  plate: false # true (the default) for dark line art on transparency
  frame: translation strategies # omit for no window frame
```

It is the same sub-schema in `src/content.config.ts`, not a copy of it, so the
two can never mean different things. Leave it out and the page renders without
one. The path goes through `image()` like the logo, and `src/assets/projects/`
is the `projects` feature's own directory — see the `Owns` column in
[Features](Features.md) — so nothing else's figures live there to confuse with
it if you ever delete it by hand.

## Posts — `src/content/posts/`

**The filename sets the permalink** and must be `YYYY-MM-DD-slug.md`:
`2026-02-11-on-translating-philosophy.md` publishes at
`/blog/2026/02/11/on-translating-philosophy/`. The date in the front matter has
to agree with the filename, and the build fails if it does not.

The date is taken from the filename rather than from the parsed date on
purpose: reading a `Date` with local getters shifts the day backwards anywhere
west of UTC, so the same post would publish at two different URLs depending on
where it was built.

`draft: true` keeps a post out of the list, the tag pages, the feed and the
sitemap — it is not built at all.

`tags` accepts both `tags: one` and `tags: [one, two]`, and each tag gets a page
at `/blog/tag/<tag>/`, slugified.

`featured: true` puts a `★` on the post's row on `/blog/` and counts it in the
lede there. It changes nothing about the feed, the tag pages or the post's own
page.

### What else markdown can express

Because remark passes HTML through untouched, prose can reach for a handful of
affordances `.prose` styles. All of them are plain markup in the `.md` — there is
no component to import and no plugin involved.

**A before/after pair.** Two images side by side, each linking to its full-size
file, stacking on a narrow screen:

```html
<figure class="compare">
  <div class="compare-pair">
    <a href="/assets/img/papers/before.svg"><img src="…" width="640" height="400" alt="…" /></a>
    <a href="/assets/img/papers/after.svg"><img src="…" width="640" height="400" alt="…" /></a>
  </div>
  <figcaption>What changed.</figcaption>
</figure>
```

Those two paths are under `public/`, and have to be: each image is **linked** at
full size, and a link needs a URL Astro has not renamed. See
[Images in a post](#images-in-a-post).

**An icon-led list**, for a set of tools or components — each row an inline icon,
a name, a description, and a row of links:

```html
<ul class="tool-landscape">
  <li>
    <svg
      class="ti"
      style="--ti: #5cc8e8"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="…" />
    </svg>
    <strong>Some tool</strong> — what it does.<br />
    <span class="tool-links">
      <svg class="ti" …><path d="…" /></svg> <a href="…">Service</a>
      &nbsp;&middot;&nbsp;
      <svg class="ti" …><path d="…" /></svg> <a href="…">GitHub</a>
    </span>
  </li>
</ul>
```

`.ti` is a 24×24 inline SVG at `1.05em`, drawn in `currentColor` unless you set
`--ti` to a colour. Inline the path yourself — there is no icon dependency here,
deliberately, and a colour you pick has to clear the contrast check like any
other.

**An embedded video**, 16:9 and framed:

```html
<div class="video"><iframe src="…" title="…" loading="lazy" allowfullscreen></iframe></div>
```

That one needs its host added to `ALLOWED_THIRD_PARTY` in `src/consts.ts`, or
`npm run audit` fails — on purpose. An iframe is the one thing in prose that
sees your readers' IP addresses, so it should take a deliberate edit.

### Images in a post

Markdown's `![](…)` cannot carry `width` and `height`, which the audit
requires, and cannot opt out of the white plate `.prose` puts behind an SVG.
Write the tag directly — remark passes HTML through untouched:

```html
<figure>
  <img
    class="no-plate"
    src="/assets/img/posts/thing.svg"
    alt="…"
    width="760"
    height="300"
    loading="lazy"
  />
  <figcaption>A caption.</figcaption>
</figure>
```

Drop `class="no-plate"` when the image _is_ dark-on-transparent line art.

**These live in `public/`, not `src/assets/`.** Astro rewrites a relative image
path only in markdown's own `![](…)` syntax; an `<img>` you write by hand is
passed through exactly as typed, so a `src` into `src/assets/` would point at
nothing in the built output. That is the trade for the two things `![](…)` cannot
express, and it is why `public/assets/img/posts/` and `public/assets/img/papers/`
still exist. Everything a **schema** names goes through `image()` instead — see
[Where images live](#where-images-live).

## A group site rather than a personal one

Nothing here assumes one author. List every member's surname in
`SELF.surnames` so all of their names are emphasised in author lists, fill in
`people.yml`, and give the entry page the project shape —
`npm run init -- --preset project`, or set `HOME_SHAPE: 'project'` in
`src/features.ts` directly if you have already run init. Both shapes stay in
`src/pages/index.astro`; the flag just picks which one renders at `/`.

## Page text — `src/content/pages/`

The `.astro` files under `src/pages/`, `src/components/` and `src/layouts/` hold
layout and code. Every word a reader sees that is not computed — a page's
`<title>` and description, its lede, the labels on its chips and buttons, the
nav and footer rows — is in `src/content/pages/`, one Markdown file per page:

| File                                                                                                                                    | Holds                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `site/site.md`                                                                                                                          | the site `title` (the `<title>` suffix, the feed's title, the project hero), the nav `brand` and `brandPrompt`, the default `description` |
| `site/tagline.md`                                                                                                                       | the line under the name in both heroes, as Markdown — so it can carry any number of links                                                 |
| `site/nav.md`, `site/footer.md`                                                                                                         | the nav rows; the footer's copyright holder, affiliation, link row and email label                                                        |
| `site/contact.md`, `site/publication.md`                                                                                                | words shared across pages: the contact block, a publication entry and paper page                                                          |
| `home.md`, `home/profile.md`, `home/project.md`, `home/involvement.md`                                                                  | the entry page: shared stat labels, then each shape's words; `profile.md`'s body is the pitch, `involvement.md` the list                  |
| `404.md`, `blog.md`, `cv.md`, `imprint.md`, `papers.md`, `people.md`, `pgp-key.md`, `projects.md`, `publications.md`, `repositories.md` | one page each; `404.md` holds only the chips under the theme's message                                                                    |

**Front matter holds the short strings, the body holds rich text.** `title` and
`description` are the page's meta; the body is its lede, or the block the file
is named for. The rest is grouped by kind — `labels` for short words, `intros`
for the sentence under a section heading, `more` for the "all … →" links,
`plurals` for a `{ one, other }` pair — and the comments in each file say where
each string lands.

**`{placeholders}`** are filled by the template with computed values:
`'{count} entries,'`, `'since {date}'`. `{name}` works in every title and
description, and in `site/site.md`, and is `SELF.first` and `SELF.last` from
`src/consts.ts` — the name has one source. A placeholder the template does not
know stays as typed, so a typo shows on the page rather than vanishing.

**The schema is strict.** Every field is optional, because one collection holds
every page's shape, and the template asks for the ones it needs through `need()`
in `src/lib/pages.ts` — a missing one fails the build naming file and field. A
key the schema does not know is a build error too, so a misspelt `descripton:`
cannot be silently ignored, and a nav or footer row's `feature` is checked
against the flags.

**Each feature's file is read only while it is on**, and is listed in that
feature's `Owns` column in [Features](Features.md), so deleting a switched-off
feature's files includes its page text.

What stays in the templates, deliberately: headings and the `## kicker` above
them, `aria-label`s, `alt` text and tooltips, the labels of interactive controls
(the copy buttons, the skip link, the filter's placeholder), separators and
glyphs, and the footer's "built with" credit, which is the theme's branding.
So does wording that is the theme's voice rather than the site's — text no
owner would reasonably edit: the 404 page's title, message and description,
the demo banner and switcher, the advice and setup notice on `/pgp-key/`, the
"nothing to cite" sentence on a paper page, and the "no metadata yet" notes on
`/repositories/`. `content/pages/` holds what a site owner changes: their own
text, their links and where they point. Structured data that grows — your CV, contact rows, people — stays in
`src/data/`.

Two Markdown details. Astro's typographer curls a straight `'` in a body into
`’`; write `&#39;` where the straight one matters. And a body renders as
paragraphs, so a template places it in a block, never inside a `<p>`.

## Renaming a route

Say `/papers/` should be `/conferences/`, or `/projects/` should be
`/approaches/` because that is what your group calls them. It is **three
edits**, and only one of them is code:

1. **The constant in `src/lib/paths.ts`.** `PAPERS` and `PROJECTS` are the only
   places those two prefixes are written down. Every back link, breadcrumb,
   hero action and slug helper reads one of them, and so does the
   regex in `src/content.config.ts` that validates a `page = {…}` field — it is
   assembled from the constant rather than typed out, precisely so a rename
   cannot leave a validator behind insisting on the old prefix.

2. **The route directory.** `git mv src/pages/papers src/pages/conferences`.
   Astro derives routes from the filesystem, so this one cannot come from a
   constant. It is also the only reason this is not a single edit.

3. **The data that names the route.** For `papers`, the `page = {/papers/…/}`
   fields in `src/data/papers.bib`. They are content, not code, and the build
   fails with the offending BibTeX key if you forget one. So are the `href`s
   in `src/content/pages/site/nav.md` and the papers lede in
   `src/content/pages/papers.md`, which cannot import a constant; the audit
   names the page a stale one is on.

Two things that look like they should be on that list and are not. The
**collection name** (`papers` in `src/content.config.ts`) and its **source
directory** (`src/content/papers/`) never appear in a URL, so a route rename
does not touch them — rename them too if you like the symmetry, but that is a
separate edit and `reference()` will tell you if you do half of it.

Then `npm run build && npm run audit`: the audit resolves every internal link
in the built output, so anything still pointing at the old prefix is a failure
naming the page it is on.

This is three edits for `/papers/` and `/projects/` specifically, because those
two prefixes appear nowhere else as literals. `/blog/` and `/publications/` do —
see [Architecture](Architecture.md) — so renaming those means grepping for the
prefix as well.

## The contact block — `src/data/contact.yml`

The rows under "Get in touch" on the entry page, and the same rows in the `/cv/`
lede. One list, rendered by `src/components/Contact.astro`, so a handle added
here shows up in both places with no markup to edit.

```yaml
- label: email
  email: true # true means SITE.email; write an address for a different one

- label: matrix
  value: '@cicero:example.org'
  href: https://matrix.to/#/@cicero:example.org
  mono: true
  note: for anything that should not sit in a mailbox
```

Every row has a `label` and then **exactly one** of `value` and `email`, plus
the optional `href`, `mono` and `note`. Getting that wrong is a build error
naming the row, not a label with nothing beside it.

**An address goes in `email:`, never in `value:`.** `email:` renders through
`src/components/Email.astro`, which splits and rot13s the address so it is not
in the served bytes; `npm run audit` greps the built output for anything
address-shaped and fails the deploy if one appears. A `value:` that looks like
an address is rejected at build time with the row's label, so you find out from
the file that caused it rather than from the audit afterwards.

Two rows are **derived** and appear after the listed ones: the PGP key id, from
`pgp_fingerprint` in `socials.yml`, and your current position, from `cv.yml`.
Neither is repeated here, because a second copy is a copy that can disagree
with `/pgp-key/` and `/cv/`.

It is its own file rather than a block in `cv.yml` because the contact block
outlives the CV: `npm run init -- --preset project` turns `cv` off in
`src/features.ts` — `cv.yml` stays on disk and still gets parsed, just not
read by anything — and the entry page it produces still has a contact
section.

## Your portrait — `src/assets/portrait.*`

Drop in `portrait.` plus any of `avif`, `gif`, `jpeg`, `jpg`, `png`, `svg` or
`webp`, and delete the one that shipped. There is no setting: both the
hero and the `/cv/` lede read `src/lib/portrait.ts`, which finds the file by
extension at build time.

A configured path string could not do this. Astro's `<Image>` optimises and
sizes an asset it can resolve statically, and the audit fails any `<img>`
without intrinsic width and height — so the filename is the configuration, and
`import.meta.glob` is what turns it back into a real static import.

No portrait, or two of them, is a build error naming the path it expected.

## The PGP key — `public/assets/pgp-key/`

`pgp_fingerprint` in `socials.yml` is the only setting, and `/pgp-key/` derives
the key id, the grouped fingerprint and the download path from it. Export your
public key to `public/assets/pgp-key/<FINGERPRINT>.asc` and the page also
inlines the armored block in a `<pre>` with a copy button — read at build time,
so it works without JavaScript and is indexable. No file there is a supported
state, not a broken one: the page keeps the fingerprint, the key id and the
download link.
