# Configuration

Four places, and a handful of filenames.

`src/features.ts` is which parts of the template are switched on, plus the two
shape choices below it. `src/consts.ts` is configuration: single values that
decide how the site behaves — where it lives, what language it formats in, who
it is about. **The words the site prints are not here**: the title, the brand,
the tagline, the nav and footer labels and every page's prose live in
`src/content/pages/`, one Markdown file per page — see
[Content](Content.md#page-text). Lists that grow — your bibliography, your CV,
the people in your group — live in `src/data/`, and the works themselves in
`src/content/`.

Everything in `src/consts.ts` is read by code somewhere. If you cannot find where
a value goes, grep for it.

## `src/features.ts`

One boolean per feature — `publications`, `blog`, `people`, and so on — plus
two values that are a choice rather than an on/off: `HOME_SHAPE` (`'profile'`
or `'project'`, which entry page renders at `/`) and `FEED_SOURCE` (`'posts'`
or `'papers'`, what `/feed.xml` is a feed of). Turning a feature off edits one
line here; nothing is deleted, the code stays on disk, and `astro check` still
type-checks it.

An impossible combination — `papers` on with `authors` off, say, or
`FEED_SOURCE: 'posts'` with `blog` off — is refused at config load, naming the
offender, rather than quietly repaired. `npm run init` writes this file for
you from a preset and is re-runnable. See [Features](Features.md) for the
mechanism (what a `false` does and does not do), the dependencies between
flags, and the per-feature table of what each one owns.

## `SITE`

| Field        | Is                                                                                                                                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`        | The site's address, **no trailing slash**, path included. The first field to set — see below. A `SITE_URL` environment variable overrides it for one build, for a preview host ([Deploying](Deploying.md#a-second-host-for-the-same-build)). |
| `brandLogo`  | `{ src, replacesWordmark? }` or `null` — see below. The wordmark itself is text: `brand` in `src/content/pages/site/site.md`.                                                                                                                |
| `lang`       | `<html lang>`.                                                                                                                                                                                                                               |
| `locale`     | Passed to every date and number format on the site. Explicit because `toLocaleString()`'s default follows the _build machine's_ locale, so your laptop and CI would disagree.                                                                |
| `email`      | Your address. It never reaches the served bytes — see `FOOTER.email` and `contact.yml`.                                                                                                                                                      |
| `repo`       | Your repository: the project hero's GitHub button, and the footer credit's link.                                                                                                                                                             |
| `ogImage`    | The 1200×630 link-preview card, or `null`. See below.                                                                                                                                                                                        |
| `demoNotice` | **Set this to `false`.** While it is `true`, a banner sits on the entry page and a word runs in the footer saying the content is a demo, so an unmodified deploy cannot be mistaken for a real site.                                         |

The site's title, nav brand, tagline, default description and copyright holder
used to sit in this table. They are words, so they are in
`src/content/pages/site/` now — see [Content](Content.md#page-text).

### `url`

The whole address, no trailing slash, **path included** for a project page. Its
path _is_ the base: `astro.config.ts` reads `base` off it, and
`scripts/audit-site.mjs` derives the base it expects from the same value — so a
site left on the shipped `https://dfuchss.github.io/astro-studia` builds with
`/astro-studia` on every URL **and passes the audit**, because the links and the
check agree with each other. The first thing to disagree is the host.
`src/pages/robots.txt.ts` reads it too, and `base` is derived, never configured
— see [Deploying](Deploying.md).

### `brandLogo`

A path under `public/`, and one decision:

```ts
brandLogo: { src: '/assets/img/brand-mark.svg' },                          // beside the wordmark
brandLogo: { src: '/assets/img/brand-mark.svg', replacesWordmark: true },  // instead of it
brandLogo: null,                                                          // wordmark alone
```

There are deliberately **no dimensions** to declare. `Nav.astro` fixes the height
(`LOGO_HEIGHT`, 24px) and reads the file's own aspect ratio off disk for the
width, so a wide logo and a square one both fit, the `width`/`height` the audit
requires on every `<img>` are always present, and a path with no file behind it is
a build error naming the path rather than a silently broken image.

There is no `alt` either, for the same reason: beside the wordmark the mark is
decoration and takes `alt=""` rather than making a screen reader say the site's
name twice; in place of the wordmark it _is_ the name and takes `brand` from
`src/content/pages/site/site.md`.

`ProjectHero.astro` — the centred hero a project or group site opens with — reads
the same value, falling back to `/apple-touch-icon.png`, so a site with a logo does not
show it in the corner and a favicon in the middle of its own front page.

### `ogImage`

`public/assets/img/og.png`, 1200×630, which is what every platform crops from.
The shipped one says "replace this" in 76px type so you notice.

Set it to `null` and `BaseHead.astro` falls back to `twitter:card: summary` — the
small text-only card — because `summary_large_image` with no image is a blank
rectangle, which is worse than the card it replaced.

For a per-page image, take an optional `image` prop through `BaseHead` the way
`title` and `description` already do.

## `SELF`

```ts
export const SELF = { first: 'Marcus Tullius', last: 'Cicero', surnames: ['Cicero'] } as const;
```

`first` and `last` are the **one source of the name**: the person hero's heading
and the CV read them, and so does every `{name}` in `src/content/pages/` — the
shipped site title is `'{name} — Studia Theme demo'`.

`surnames` is how an author parsed out of `papers.bib` is recognised as you, so
your name renders bold in an author list. Matching folds accents and the German
sharp s, so `Fuchß`/`Fuchss` and `Muñoz`/`Munoz` both hit — see `isSelf()` in
`src/lib/authors.ts`. List every form you have published under, including a
previous name.

For a group site, list **every member's** surname here — or delete `SELF` along
with the bolding in `src/components/pub/PubEntry.astro`.

## `SECTIONS`

`SECTIONS` lists the areas the site has, and `Section` is its union type.
Whatever lands on `<body data-section>` re-points the neutral `--sec-*` aliases
at one accent family in `src/styles/tokens.css`, so one set of components
recolours itself per area. Nav links carry the attribute too, which is how each
one previews the colour of the page it leads to. It is a list rather than a bare
union so the `section` of each nav row in `src/content/pages/site/nav.md` is
validated against it.

**Adding a section is two edits**: this list, and a matching
`[data-section='…']` block in `tokens.css`. Forget the second and the build fails
— `scripts/audit-site.mjs` collects every value out of the built HTML and every
selector out of the built CSS and compares them.

`tokens.css` always covers one value more than the list has members, which is
why the audit reports nine sections where the list has eight. The extra one is
`contact`: `src/pages/index.astro` sets `data-section="contact"` on its contact
section, and `Section` types only what `<body data-section>` takes, so a section
of a page that is not an area of the site never joins it. The audit reads the
built HTML, where the two are the same attribute.

## The nav and footer rows, and `shown()`

The top bar and the footer's link row are text, so their rows live in
`src/content/pages/site/nav.md` and `site/footer.md` — a `label`, an `href`, and
for the nav the `section` whose accent the link carries. A row may carry a
`feature` key — a `FeatureId` from `src/features.ts`, checked by the content
schema, so a misspelt one fails the build — and `shown()` in `src/consts.ts`
drops the rows whose feature is off; a row with no `feature` always shows. So
turning `blog` off in `src/features.ts` is what drops the `blog` row — nothing to
edit there for that. The demo ships every area the template can render, which is
more than any real site wants; deleting a row outright is for one you will never
want back, as distinct from one a flag already hides. See
[Features](Features.md) for what goes with each.

An `href` is written out, `/publications/`, rather than taken from
`src/lib/paths.ts`: content cannot import. If you rename a route, change the
row too — `npm run audit` fails on a nav link with no page behind it.

## `FOOTER`

Which optional parts of the footer render. The words — the copyright holder,
your affiliation, the link row and the email link's label — are
`src/content/pages/site/footer.md`; the layout is `Footer.astro`.

```ts
export const FOOTER = {
  email: true,
  credit: true,
};
```

- `email` puts `SITE.email` in the footer through `components/Email.astro`, which
  is the only way an address is allowed into a page: the audit greps the built
  output for anything address-shaped and fails the build on a plain `mailto:`.
- `credit` is the "built with Astro and Studia Theme" line. It is the theme's
  branding, so its words stay in `Footer.astro`. The licence is MIT and turning
  this off is expected, not a breach — a credit that cannot be switched off is
  one people delete from the component on day one.

In `footer.md`, `affiliation` is the part after the copyright — "developed at the
MCSE group, KASTEL, KIT" on ardoco.de — as plain strings and links **in order,
joined without spaces**, so what you write is what renders; `[]` for none.
`copyright` is the holder after "© 2026": kept apart from the brand because a
site _about_ someone is not necessarily copyright them, and `'{name}'` for
`SELF`.

Markup none of these can express goes in `Base.astro`'s `footer` slot, which
`Footer.astro` renders as its default slot.

## `AUTHOR_LIMIT`

How many author names a publication entry shows before "and N more authors".

```ts
export const AUTHOR_LIMIT: number | null = 4;
```

`null` lists everyone, which is what a group site wants: the people **are** the
point of its list, and eliding nine of sixteen would hide most of the group. At
exactly `limit + 1` names all are shown anyway — "and 1 more author" takes more
room than the name it stands in for and tells the reader less. See
`truncateAuthors()` in `src/lib/authors.ts`.

## `PEOPLE_ORCID`

Whether the ORCID chip on a person's card at `/people/` shows the word
(`'label'`) or the identifier itself (`'id'`), which is what a registry-minded
reader wants to see and copy. The chips' words — `Website`, `ORCID`, `GitHub`,
`Email` — are `labels` in `src/content/pages/people.md`; ardoco.de's homepage
chip says "Website at KIT", because everyone's is.

The words under the counted numbers in the hero (`STAT_LABELS` before) are
`statLabels` in `src/content/pages/home.md`.

## `ALLOWED_THIRD_PARTY`

Origins the audit will tolerate as _subresources_ in the built HTML, beyond your
own. It ships empty, which means first-party only: no script, style, image,
iframe or font may point anywhere else, and a new one cannot appear unnoticed.

```ts
export const ALLOWED_THIRD_PARTY: string[] = ['www.youtube.com'];
```

Links to other sites are the whole point of an academic page and are never
counted here — only the things a browser fetches without being asked, which are
also the things that see your readers' IP addresses. Add an origin when you
deliberately embed something, and nothing else. See
[Verification](Verification.md).

## `src/data/`

Nine files. Four are content collections with Zod schemas behind them
([Content](Content.md) has those); the rest are plain YAML or JSON read through
`src/lib/data.ts`.

| File                  | Is                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `papers.bib`          | Your bibliography. Standard BibTeX plus `abbr`, `pdf` and `page`, all three checked at build time. |
| `venues.yml`          | Badge name, URL and brand colour, keyed by the BibTeX `abbr`.                                      |
| `authors.yml`         | Everyone who appears anywhere: name and ORCID, nothing else.                                       |
| `people.yml`          | Who appears at `/people/`. **The key is the anchor**, so renaming one changes a published URL.     |
| `cv.yml`              | The whole of `/cv/`. Sections in file order; see below.                                            |
| `contact.yml`         | The rows under "Get in touch", on the entry page and in the `/cv/` lede.                           |
| `socials.yml`         | Profile ids for the chip row, and the ids the data scripts need. Every field optional.             |
| `repositories.yml`    | What `/repositories/` lists: GitHub users, GitHub repos, Zenodo DOIs.                              |
| `project-groups.yml`  | The groups `/projects/` sorts into: `order`, heading, blurb. A project's `category` names one.     |
| `language_colors.yml` | GitHub's language colours, for the dot beside a repository's language.                             |

Plus two **generated and committed** files, which is what makes a fresh clone
build offline with no network and no token:

| File                   | Written by                             | Refreshed by                                   |
| ---------------------- | -------------------------------------- | ---------------------------------------------- |
| `citations.yml`        | `scripts/update-scholar-citations.mjs` | `.github/workflows/update-citations.yml`       |
| `github-metadata.json` | `scripts/fetch-github-metadata.mjs`    | `.github/workflows/update-github-metadata.yml` |

Both workflows are opt-in and neither ships on a schedule. `update-citations.yml`
runs on demand only; `update-github-metadata.yml` also triggers on a push to
`main` touching `src/data/repositories.yml`. Neither needs a secret. See
[Deploying](Deploying.md).

### `cv.yml`

Every section has the same shape — a title, a heading, a list of entries — so
adding "Service" or "Grants" is a new block here and no code at all. Order on the
page is order in the file.

A section renders as a **timeline** (a date rail) if any entry carries a date, or
**rows** (no rail) otherwise, unless `layout:` names one of the two other shapes:
`cards`, a grid for entries with a name, an optional since-date and highlight
chips; or `courses`, a semester-grouped grid where the current semester stays open
and earlier ones collapse.

`count:` puts a noun beside the heading — "Rhetorical instruction 24 courses".
Opt-in, and only worth it where the number is itself the point: a bare count on
every heading is noise the reader can see for themselves.

Every field of an entry except `title` is optional: `org`, `url`, `start`, `end`,
`location`, `note`, `details` (bullets, which may embed a markdown link),
`current: true`, which renders "– present" and a `now` badge and is what the
entry page's "where" row reads, and `minor: true`, which sends a long run of
repeated low-value entries into a collapsed "N more" disclosure instead of
burying the ones that matter. An entry with a `start` and no `end` is a single
date, not an open range: a degree or a prize is not "to the present".

The file's own header documents every field with an example. Read that before
this table.

### `contact.yml`

See [Content](Content.md) for the row shape. The one rule worth repeating here:
**an address goes in `email:`, never in `value:`.** `email:` renders through
`Email.astro`, which splits and rot13s the address so it is not in the served
bytes. A `value:` that looks like an address is rejected at build time with the
row's label, so you find out from the file that caused it rather than from the
audit afterwards.

Two rows are **derived** and appear after the listed ones: the PGP key id, from
`pgp_fingerprint` in `socials.yml`, and your current position, from `cv.yml`.
Neither is repeated here, because a second copy is a copy that can disagree.

### `socials.yml`

`orcid_id`, `scholar_userid`, `github_username`, `dblp_url`,
`linkedin_username`, `semanticscholar_id`, `researchgate_username`, `work_url`,
`pgp_fingerprint`, plus `extra[]` for
anything the fixed fields do not cover. Set a field to `null` (or delete the
line) and its chip does not render — that is how you remove a profile you do not
have, rather than by editing `SocialRow.astro`.

An `extra` entry's `icon` may name one of the marks in `SocialRow.astro` — `orcid`,
`scholar`, `dblp`, `github`, `codeberg`, `gitlab`, `linkedin`, `mastodon`, `bluesky`,
`semanticscholar`, `researchgate`, `work` — and
without one it renders as a text chip, so an unfamiliar platform still looks
deliberate. The fixed list is a convenience, not a whitelist: where an academic
keeps a profile is not something a template gets to decide.

`scholar_userid` does two things: it renders the Scholar chip, and it tells
`scripts/update-scholar-citations.mjs` whose citations to fetch.
`scripts/find-missing-papers.mjs` (`npm run bib:missing`) reads `dblp_url` for
the publication list and falls back to `orcid_id` (OpenAlex) without it; with
neither it says which keys to set and changes nothing. Papers you decline for
good are listed in `src/data/papers-ignore.yml`, which the script creates on
demand, and `CROSSREF_MAILTO` sets the contact address it sends, as for
`bib:check`.
`pgp_fingerprint` is the only setting `/pgp-key/` has — the key id, the grouped
fingerprint, the download path and the inlined armored block all derive from it.

## The settings that are filenames

Five things are configured by putting a file somewhere, with no line in
`src/consts.ts` at all. That is deliberate in each case: a configured path string
is a string that can point at nothing.

| Put it at                                              | And                                                                                                                                                                                                                                          |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/assets/portrait.{avif,gif,jpeg,jpg,png,svg,webp}` | `src/lib/portrait.ts` finds it by `import.meta.glob` at build time, so `<Image>` can optimise it and the audit gets its intrinsic dimensions. None, or two of them, is a build error naming the path.                                        |
| `public/assets/pgp-key/<FINGERPRINT>.asc`              | `/pgp-key/` inlines the armored block in a `<pre>` with a copy button, read at build time so it works without JS and is indexable. No file there is a **supported** state: the page keeps the fingerprint, the key id and the download link. |
| `public/assets/pdf/**.pdf`                             | `astro.config.ts` walks the directory recursively and feeds the result to the sitemap's `customPages`, because the integration lists pages Astro builds and a file in `public/` is not one. Adding a paper needs no upkeep.                  |
| `public/CNAME`                                         | Copied into `dist/`, and `npm run audit` then fails if it ever stops being emitted — the deploy replaces the branch wholesale, so that would be a domain that stops resolving.                                                               |
| `public/.htaccess`                                     | Copied verbatim. `ErrorDocument 404 /404.html` for a host that is not GitHub Pages. See [Deploying](Deploying.md).                                                                                                                           |

`public/.nojekyll` is already there and must stay: without it GitHub Pages runs
Jekyll, which ignores directories beginning with an underscore — which is where
Astro puts every hashed asset. `npm run audit` checks for it.

## `astro.config.ts`

Two things you may want to change, both commented in place:

- **`redirects`** — for URLs you have published elsewhere and cannot move.
- **`markdown.shikiConfig`** — the code-block theme.

Three values in there are **derived** and must not be set by hand.
`trailingSlash` and `build.format` come from `URL_POLICY` in `src/lib/paths.ts`:
one decision, not two. `base` comes from `SITE.url`'s path, so a project page is
one edit — the whole address in `SITE.url` — and writing `base: '/<repo>'` out as
well is the second copy the derivation exists to prevent. The `base-paths`
integration then carries it onto every hand-written internal link and asset,
including the ones in markdown and YAML no helper could reach. See
[Deploying](Deploying.md).
