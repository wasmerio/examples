# Architecture

An Astro static site with no UI framework, no CSS framework and no theme layer.
There is no runtime: `npm run build` produces a directory of HTML, CSS and a
little inline JavaScript, and nothing on the host has to do anything but serve
files.

This page is the map. It says what each piece is for and, where the answer is not
obvious, what the alternative was and why it lost.

## The shape of a build

```
astro.config.ts
  ├─ SITE.url          ← src/consts.ts               the address, written once
  ├─ trailingSlash,    ← URL_POLICY in lib/paths.ts  derived, not configured
  │  build.format
  ├─ publicPdfs()      walks public/assets/pdf/ → the sitemap's customPages
  └─ integrations: [ sitemap, sitemapShape, basePaths ]

src/content.config.ts        eight collections
  ├─ file()      venues.yml, authors.yml, people.yml
  ├─ glob()      content/papers/, content/projects/, content/posts/,
  │              content/pages/ → the words every template prints
  └─ bibtexLoader()  data/papers.bib  → the `publications` collection

src/pages/**                 routes; each renders through layouts/Base.astro
src/lib/**                   every question a page asks, answered in one place
src/data/**                  the YAML and JSON, read through lib/data.ts

dist/
  ├─ @astrojs/sitemap writes sitemap-index.xml + sitemap-0.xml
  ├─ sitemapShape()   rewrites each <loc> to the file that was emitted
  └─ basePaths()      prefixes every hand-written URL with `base`, if set
```

The integration order in `astro.config.ts` is load-bearing: `sitemapShape` has to
run after the sitemap exists, and both run at `astro:build:done` in the order
listed.

## `URL_POLICY` — the one decision everything else follows

`URL_POLICY` in `src/lib/paths.ts` is `'directory'` or `'preserve'`, and it is the
single place the site's URL _shape_ is decided. Five things read it, and nothing
else needs to:

| Reader                              | Does                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `astro.config.ts`                   | derives `trailingSlash` and `build.format`                                                          |
| `paperPath()`                       | the one link helper whose shape differs between the two                                             |
| `routePath()`                       | turns `Astro.url.pathname` — the **file** path under `'preserve'` — back into the published address |
| `src/pages/feed.xml.ts`             | emits every item link absolute, so `@astrojs/rss` cannot re-shape it                                |
| `src/integrations/sitemap-shape.ts` | rewrites each sitemap entry to the file that exists                                                 |

And `scripts/audit-site.mjs` asserts the outcome: every internal link, canonical,
sitemap entry and feed link must name a file on disk **by its exact shape**, so a
page or helper that gets the policy wrong fails the build rather than shipping a 404. [Deploying](Deploying.md) has the policy itself; [Verification](Verification.md)
has the resolution rule.

`paths.ts` also holds every route prefix as a constant. For `PAPERS` and
`PROJECTS` that holds absolutely: nothing else interpolates a slug into one of
those two, and nothing else writes either as a literal — not a back link, not a
breadcrumb, not even the regex `src/content.config.ts` validates
a `page = {…}` field with, which is _assembled_ from `PAPERS` precisely so a
route rename cannot leave a validator behind insisting on the old prefix. The
one exception is text: the nav rows in `src/content/pages/site/nav.md` write
every top-level `href` out, because a content file cannot import a constant —
the audit fails on a row whose page is gone.

`/blog/` and `/publications/` are not in that state. `src/lib/blog.ts:20` builds
the permalink from a literal `/blog/`, the tag page's "← all posts" back link and
two breadcrumbs write it out, and the lede in `src/content/pages/papers.md`
links `/publications/` directly. Renaming the blog is therefore more than the three
edits in [Content](Content.md) — grep the prefix as well. The audit reports a
stale link, but only once it is in the built output.

## The BibTeX loader

`src/loaders/bibtex.ts` is an Astro content loader: `src/data/papers.bib` in, a
typed `publications` collection out. It exists because the alternative — a YAML
copy of your bibliography — is a second copy of a file you already maintain, and
the two disagree within a month.

Three things about it are not obvious:

**It parses the file twice.** Once decoded to Unicode, for display; once raw, so
the BibTeX block a reader copies keeps its LaTeX escapes verbatim rather than a
normalised approximation. Brace protection survives: `{Acronym}` stays `Acronym`
rather than being sentence-cased.

**`links[]` declares the fields that are yours rather than the bibliography's.** A
`.bib` accumulates bookkeeping — a path to the PDF you host, a path to the paper's
own page on your site — and those are the fields most likely to rot, because
nothing about renaming a file tells you a `.bib` entry still points at the old
name. Declaring one does three things at once: validates the value against disk,
exposes the result on the collection entry under `as`, and keeps the field out of
the copyable citation. Declare the `as` key in the schema too, or Zod strips it
back out.

**Errors carry the entry key.** A `.bib` is one long list of near-identical
records, and the key is the only thing that says which one.

`abbr`, `google_scholar_id` and `selected` are stripped from the copyable block by
default, and every `links[].field` is added to that list automatically — an
internal path has no business in a citation someone pastes into their own `.bib`,
and making you remember that separately is a trap.

## Collections and cross-references

Eight collections, in `src/content.config.ts`. Three are YAML through `file()`,
four are markdown through `glob()`, one is the BibTeX loader.

The eighth, `pages`, is not content in the same sense: it is the site's own
words, one file per page under `src/content/pages/`, so the `.astro` files hold
layout and code only. It is always loaded, whatever the flags say; each
feature's file is read only from code that runs while the feature is on.
`src/lib/pages.ts` reads it — `getPage(id)` for front matter plus the rendered
body, `fill()` for `{placeholders}`, `need()` to fail the build on a missing
field — and its schema is `.strict()`, so an unknown key is an error, and nav and
footer rows validate their `feature` against the flags and their `section`
against `SECTIONS`. [Content](Content.md#page-text) has the file list.

Every cross-reference goes through Astro's `reference()`. That is the point of the
whole file: a bad slug, an unknown venue or a BibTeX key pointing at a page that
does not exist stops the build with the offending id in the message. The same
mistake in a template language is a silent lookup that renders blank.

It also makes the dependency graph real rather than advisory, which is why
[features](Features.md) has an order:

```
venues ← publications ← papers → authors ← people
                          ↓
                       projects
```

Every collection is declared regardless of `src/features.ts`, so `reference()`
keeps type-checking and a feature can be switched back on without touching this
file. One switched off gets `empty` — `() => []` — in place of its loader. Two
fields, `papers.authors` and `papers.projects`, go one step further through a
`refs()` helper: where the collection on the other end of the reference might be
off, it swaps `z.array(reference(c))` for an array that is always empty, because
a reference into an _empty_ collection is not a type error, it is a runtime
one — Astro logs `Invalid content reference` per entry and then finishes the
build successfully, which would otherwise ship the field silently blank instead
of catching it at the schema.

The `papers` schema carries the sharpest constraint in the codebase, as three Zod
refinements: a paper page has **exactly one** venue source — a `publication` (the
BibTeX entry) or a stated `venue` object — `conferenceName`/`conferenceUrl` belong
only to the first, and `year` only to the second. Refinements rather than prose,
because the failure they prevent is silent: a page with both renders whichever the
markup happens to check first, and a page with neither renders an empty venue line
and sorts to the end of every list. See [Content](Content.md).

## `src/lib/` — one answer per question

The rule is that a question two pages both ask gets answered once, here. A helper
in this directory usually exists because two consumers had drifted apart.

| Module            | Answers                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `paths.ts`        | every URL shape, and `URL_POLICY`                                                                                     |
| `pages.ts`        | the page text: `getPage()`, `{placeholder}` filling, plurals, the site title and nav rows, and the joined `SELF` name |
| `data.ts`         | the YAML and JSON in `src/data/`, imported with `?raw` and parsed once                                                |
| `papers.ts`       | is this page a publication or a talk; its year, venue, short label, description, byline, and which pages are featured |
| `publications.ts` | the deterministic newest-first order, and year buckets                                                                |
| `authors.ts`      | name folding (`Fuchß`/`Fuchss`), "is this me", and author-list truncation                                             |
| `people.ts`       | the roster, and the surname → anchor map that links an author name to a person                                        |
| `citations.ts`    | Scholar cluster id → count, and the h- and i10-index                                                                  |
| `format.ts`       | number formatting in `SITE.locale` — the stats row needs it whether or not the counts are on                          |
| `blog.ts`         | the permalink, derived from the **filename**, and the published-post list                                             |
| `cv.ts`           | the CV's sections, their layouts and the count labels                                                                 |
| `contact.ts`      | the contact rows, validated, with `email: true` resolved                                                              |
| `pgp.ts`          | key id, grouped fingerprint, download path and the armored block — all from one value                                 |
| `portrait.ts`     | your portrait, found by `import.meta.glob` over `src/assets/portrait.*`                                               |
| `images.ts`       | intrinsic dimensions of the configured brand mark under `public/`, read off disk                                      |
| `feed/`           | `FeedItem`, plus two interchangeable sources — `fromPosts` and `fromPapers`                                           |

Two patterns recur and are worth recognising:

**A single stored value, everything else derived.** `pgp.ts` stores a 40-character
fingerprint and nothing else; the key id, the formatted fingerprint, the `.asc`
path and the inlined block all come from it, so the five cannot disagree. Same
instinct behind `blog.ts` deriving the permalink from the filename: reading a
`Date` with local getters shifts the day backwards anywhere west of UTC, so the
same post would publish at two different URLs depending on where it was built.

**Read from the working directory, never from `import.meta.url`.** During
`astro build` these modules are bundled into `dist/`, so a path relative to the
module points into the output and every lookup fails — while `astro dev`, which
runs the source in place, works fine. That is the worst shape of bug, because it
only appears in CI. `images.ts` and `pgp.ts` both say so at the point it matters.

Everything in `src/data/` is likewise imported with Vite's `?raw` and parsed in
`data.ts`, rather than read with `fs` at render time, for the same reason — plus
hot reload on a data file for free. Every file is imported whatever
`src/features.ts` says, because none of it is expensive: a switched-off
feature's YAML is parsed and then read by nobody. Deleting one of the files is
therefore a real edit to this module, not a flag — nothing here takes an unused
import out for you.

## The two integrations

Both do the same kind of thing — rewrite the bytes that are actually published,
once, at the end of the build — because both answer a question that cannot be
answered from inside a component.

### `base-paths.ts`

Astro's `base` rewrites the URLs Astro generates itself, but not a `/cv/` you wrote
by hand, and deliberately: given `/something` it cannot know whether you meant it
relative to the base or to the server root. There is no option that changes this.

The usual workaround is a `withBase()` helper called at each of the ~20 places that
emit a path. That is worse than it sounds: you have to remember it every time,
forgetting is silent, and it **cannot reach the cases that break most often** — an
image path in `people.yml`, a slides link in a paper's front matter, a plain
`![](/assets/…)` in a post. Those are strings in content, not expressions in a
component, and no helper can be called from them.

So this rewrites the output instead — `.html`, `.xml` and `.webmanifest` — and
serves the same rewrite from an `astro:server:setup` middleware, with a 302 from
`/` to the based root, so dev and the build agree. They did not: dev used to 404
on `/` and on every `public/` asset. Only URL-bearing attributes — `href`, `src`,
`srcset`, and `content` on exactly the meta tags where it is a URL. `<script>` and
`<style>` bodies are masked out first and restored after, because a leading slash
means something else entirely in there. It is a no-op when no base is set, and
`npm run audit` proves it worked when one is.

Its `content` matcher is worth a second look if you change it: it matches against
the **whole tag**, not the attribute alone, because an earlier version tested the
attribute match — which of course never contains the sibling `property=` — and so
silently skipped `og:image`.

### `sitemap-shape.ts`

`@astrojs/sitemap` decides whether an entry ends in a slash by looking at
`build.format`. Under `URL_POLICY: 'preserve'` that is wrong for most of the site:
`/people/` is still `people/index.html` and its address still ends in a slash, but
the sitemap says `/people`. Only the flat paper pages are right by accident.

There is no option for this, and the integration's `serialize` hook cannot tell
`/people` (a directory) from `/papers/foo` (a file) by looking at the URL. **The
build output can**: after the pages are written, one of `<path>/index.html` or
`<path>.html` exists, and that is the shape the entry must have. So this runs once
over the sitemap as written and asks the disk, rewriting whole `<url>`/`<sitemap>`
elements rather than bare `<loc>`s — an entry with no file behind it has to take
its `<lastmod>` and siblings with it, and a lone `<loc>` cannot.

A path that is itself a file — a PDF from `customPages`, or `sitemap-0.xml`
inside the sitemap index's own entries — is left alone: a real file, not an HTML
route to reshape. A path with nothing on disk at all is **dropped**: a feature
switched off in `src/features.ts` still gets counted as a page before its route
renders an empty response (see "Feature gating" below), so without this the
sitemap would list a URL that 404s.

Under the default policy every entry that does exist already ends in a slash and
resolves to an `index.html`, so nothing changes there and the output is
byte-identical.

## Components and layout

`src/layouts/Base.astro` is the only layout: `<html>`, the fonts, `BaseHead`, the
skip link, `Nav`, the main slot, `Footer`, and two named slots — `head` and
`footer` — for the things a page or a site needs that no config field can express.

Components are grouped by what they belong to rather than by kind:
`components/paper/`, `components/project/`, `components/people/`,
`components/pub/`, `components/hero/`. That grouping is what makes deleting a
feature's components, if you ever choose to, a directory removal rather than a
grep.

There is no utility framework and no class soup. `src/styles/tokens.css` holds the
values, `src/styles/base.css` the element styles and a dozen documented primitives
(`.wrap`, `.section`, `.card`, `.chip`, `.kicker`, …), and everything else is a
scoped `<style>` block in the component that needs it. See [Theming](Theming.md).

`PersonHero.astro` and `ProjectHero.astro` are the two entry-page shapes. Both are
always in `src/pages/index.astro`: `HOME_SHAPE` in `src/features.ts` picks which
one renders at `/`, and with `demo` on, the switcher's second URL renders the
other by passing `shape` as a prop. A `PRESET_HERO` table would be a second
place the answer is written down.

## Feature gating

`src/features.ts` holds the whole model: the generated `FEATURES` flag object
and the `REQUIRES`/`REQUIRES_ANY` dependency tables (both written by
`scripts/gen-docs.mjs` from `scripts/features.mjs`, your values kept), a
hand-written `FeatureId` type (`keyof typeof FEATURES`), the two shape choices
`HOME_SHAPE` and `FEED_SOURCE`, a `disabled()` helper, and a module-scope
`assertFeatures()` call that throws on a combination that cannot build.
`src/consts.ts` imports it, so that assertion runs at config load — for `dev`,
`build` and `audit` alike.

Turning a feature off has to make its routes disappear, and Astro 7 gives this
template nothing built for that: there is no route-exclusion config, and the
`astro:routes:resolved` hook only observes the route list, too late to act on
it. What there is instead is one deliberate behaviour worth using: a prerendered
route whose response has **no body** is not written to disk. `generate.js` in Astro's
own build returns early and logs `(file not created, response body was empty)`.
So every gated page, and the feed endpoint, opens with

```ts
if (!FEATURES.x) return disabled();
```

`disabled()` answers **410**, not 404. A 404 would make the build render
`404.astro` _into_ that file — leaving exactly the file this is meant not to
have. In `dev`, where nothing is written to disk either way, `disabled()`
answers 404 instead, because there a 404 gets you the real 404 page rather than
a blank response.

Dynamic routes — `papers/[slug]`, `blog/tag/[tag]`, `projects/[...slug]`, the
dated post route — would stop existing without a guard: their `getStaticPaths`
reads a collection that `src/content.config.ts` has already loaded empty
(above), so it returns `[]` and generates nothing on its own. They are guarded
all the same, with `if (!FEATURES.x) return [];` as the first line, for a
different reason: `getStaticPaths` runs whatever the page's own guard says, and
`getCollection()` on an empty collection logs `The collection "x" does not exist
or is empty` on every build. The deploy workflow greps the build output for that
string, so a legitimate build must not print it.

**The trap that shaped this.** `addPageName()` runs _before_ the render, inside
Astro's own static-site generator, so a route that goes on to emit no file has
already been counted as a page — and `@astrojs/sitemap` reads that count. A
switched-off feature would therefore still get a sitemap entry pointing at a
file that was never written, which is why `sitemap-shape.ts` (above) checks the
disk for every entry and drops the ones with nothing behind them.

## `scripts/`

| Script                         | Run by                       | Is                                                                                                                                                            |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features.mjs`                 | —                            | the manifest: what each optional area is made of, and the rules a selection has to satisfy                                                                    |
| `init.mjs`                     | `npm run init`               | writes `src/features.ts`, `src/consts.ts` and `site/site.md` from a preset or selection, then checks, builds and audits                                       |
| `gen-docs.mjs`                 | `npm run docs`, `docs:check` | regenerates the flags and dependency tables in `src/features.ts` and the table in [Features](Features.md), both from the manifest                             |
| `audit-site.mjs`               | `npm run audit`              | the one gate: every check over `dist/`, including the host files                                                                                              |
| `fetch-github-metadata.mjs`    | `npm run data:github`        | writes the committed `src/data/github-metadata.json`                                                                                                          |
| `update-bib.mjs`               | `npm run bib:check`          | checks `papers.bib` against Crossref. Shares the BibTeX parser with `find-missing-papers.mjs`.                                                                |
| `find-missing-papers.mjs`      | `npm run bib:missing`        | proposes papers from DBLP (or OpenAlex) that `papers.bib` lacks, completed from Crossref. `-i` asks per entry, `--yes` adds. Shares `lib/missing-papers.mjs`. |
| `update-scholar-citations.mjs` | the citations workflow       | writes the committed `src/data/citations.yml`. Opt-in; needs the network.                                                                                     |

None of these three are template setup to be stripped out once the site is
done. `init` is re-runnable — changing your mind about a feature later is
exactly what a boolean is for — and `gen-docs`/`docs:check` keep
`src/features.ts` and [Features](Features.md) in step with the manifest for as
long as the manifest exists. Nothing offers to delete any of it.

The npm scripts with no file in here are Astro's own: `dev` (and `start`, the
same command), `build`, `preview` (serves the built `dist/`), `check` and
`format` — plus `dev:fresh`, which clears `.astro` and Vite's cache before
starting dev.

`init.mjs` is small because it does one thing: write booleans into
`src/features.ts`, four strings into `src/consts.ts` and two into
`src/content/pages/site/site.md`, nothing else. It still
refuses rather than guesses — `export const FEATURES = {`, a flag line per
feature, `export const HOME_SHAPE`, each `SITE`/`SELF` string field and the
`title`/`brand` lines of `site.md` are all
landmarks it has to find before it edits around them, and a missing one is a
hard stop, because that means the file has been restructured since the
manifest was written and the script no longer understands it. It reports
rather than repairs: it offers to run check, build and audit at the end and
says which failed, and because nothing is ever deleted, `git diff` of those
three files is the whole story either way.

`gen-docs.mjs` exists for a narrower reason. The manifest already knows what
each feature owns and what a human still has to edit by hand; a second,
hand-written copy of that list in the docs is a copy that drifts, and nothing
tells you. So the table is generated between two markers, everything else in
that file is left alone, and `npm run docs:check` is what keeps it honest.

## Data that is fetched, committed, and never fetched at build time

`src/data/citations.yml` and `src/data/github-metadata.json` are written by scripts
and **committed**. The build reads the files, never the network.

That is what makes a fresh clone build with no network, no token and nothing to
rate-limit — and makes a build from six months ago produce the same page. The cost
is that the numbers are as fresh as the last run, which for a citation count is the
right trade.

Two workflows refresh them and commit the result. `update-citations.yml` runs on
demand only; `update-github-metadata.yml` also runs on a push touching
`src/data/repositories.yml`. Both push with the built-in `GITHUB_TOKEN` and then start
`deploy.yml` themselves with `gh workflow run`: a push made with that token
triggers no other workflow, but a dispatch does. The dispatch step has no
fallback, because the failure that matters here is a green job whose result
silently never ships. See
[Deploying](Deploying.md).

## CI

| Workflow                     | On                                                                    | Does                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `deploy.yml`                 | push and PR to `main`, or on demand                                   | install, prettier, `astro check`, `docs:check`, build, audit, then publish `dist/` to `gh-pages` on a non-PR push |
| `docs.yml`                   | push to `main` touching `docs/**` or the workflow itself, or manually | copies `docs/` into this repository's wiki                                                                        |
| `update-github-metadata.yml` | manually, or a push touching `repositories.yml`                       | refreshes and commits `github-metadata.json`                                                                      |
| `update-citations.yml`       | manually                                                              | refreshes and commits `citations.yml`                                                                             |

## `docs/` and the wiki

The pages you are reading are written **wiki-native**: flat, one file per page, and
the filename _is_ the page name and the title (`Features.md` →
"Features"). No subdirectories, because a wiki has no directories.

Links between them are written the way the repository wants them —
`[Deploying](Deploying.md)` — because `docs/` on GitHub is where most people will
read them, and there a bare `](Deploying)` resolves to nothing. On the way into the
wiki, `.github/workflows/docs.yml` strips the `.md`, because _there_ a
`](Deploying.md)` resolves to a file view rather than a page. One `sed` reconciles
the two readers, and neither has to be broken for the other.

The workflow replaces the wiki wholesale on every push to `main` that touches
`docs/**`, which is why `_Footer.md` says so: an edit made in the wiki's web UI is
overwritten by the next push.

Two things about it that are easier to read here than to discover in CI:

- **The `.wiki` repository does not exist until someone creates the first page in
  the web UI.** Checking it out before that fails. The workflow probes for it first
  and fails with that sentence rather than a generic clone error.
- **The default `GITHUB_TOKEN` cannot push to a wiki**, and neither can a
  fine-grained personal access token — GitHub's fine-grained permission list has
  no wiki entry, so there is nothing to grant. It takes a **classic** token with
  the `repo` scope (`public_repo` for a public repository), stored as
  `PAT`. The workflow checks for it before `actions/checkout` runs, because
  a missing secret and an uninitialised wiki otherwise produce the same
  "repository not found" and want opposite fixes. Four steps, in
  [Deploying](Deploying.md).
