# Features

Everything ships **on**. A commented-out feature is not type-checked, not
built, not audited, and rots within two Astro releases — so the demo doubles as
the test suite, and every code path this template contains is exercised by
`npm run build && npm run audit`.

Turning one off is editing one boolean in [`src/features.ts`](../src/features.ts).
Nothing is deleted. The code stays on disk, `astro check` still type-checks it,
and turning it back on is the same edit again.

## Turning one off

```ts
// src/features.ts
export const FEATURES = {
  publications: true,
  papers: true,
  blog: false, // ← that is the whole edit
  …
};
```

Then:

```bash
npm run check && npm run build && npm run audit
```

`npm run init` writes this file for you from a preset, and asks about the two
shape choices below at the same time — see [Quickstart](Quickstart.md). It is
re-runnable, and it deletes nothing either.

## What a `false` actually does

Five things, and they are worth knowing because they are what you would
otherwise have to do by hand:

| Where                          | What happens                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| The routes under `src/pages/`  | Not emitted. The page returns an empty response, and Astro writes no file for one — the build log says `(file not created, response body was empty)`. |
| `sitemap.xml`                  | The entry goes. `src/integrations/sitemap-shape.ts` drops any URL with no file behind it in `dist/`.                                                  |
| The nav and footer rows        | The row is filtered out, so nothing links to a route that is not there.                                                                               |
| Its content collection         | Declared as always, but loaded **empty**. So `getCollection()` returns `[]`, and every dynamic route under it generates no paths.                     |
| Its sections on the entry page | Not rendered.                                                                                                                                         |

Three things deliberately **do not** happen.

`SECTIONS` in `src/consts.ts` and the `[data-section='…']` blocks in
`src/styles/tokens.css` keep every member, because an accent family nothing
renders costs a few bytes and switching the feature back on then needs no edit.

The CSS of a component that no longer renders still ships. Astro bundles the
scoped styles of every component a page imports, whether or not anything renders
it, and a flag does not change what is imported. It is a few hundred bytes in
the shared stylesheet. It is also why `VenueBadge.astro` reads its venue colour
as `var(--brand, var(--sec))`: that property arrives inline per badge, so with
`publications` off the rule ships and nothing defines it — and the audit is
right to fail a `var()` that nothing anywhere defines. A fallback is a
definition.

Files under `public/` stay published. Nothing in the build understands them, so
an unreferenced PDF or image is served and never linked. If you mind, delete
them yourself — the `Owns` column below lists them per feature.

## Dependencies

Some features need others, and `src/features.ts` refuses a combination that
cannot build rather than quietly fixing it:

```
src/features.ts: this combination cannot build.
  · papers needs authors, which is off
Turn the dependency on, or the dependent feature off. docs/Features.md.
```

A refusal and not a repair, because switching `authors` back on behind your back
hides the real choice, which is usually to turn `papers` off instead. The build
asserts it at config load; `npm run docs:check` asserts the same thing in CI
without building, and `npm run init` refuses the selection up front.

The `Needs` column below is the whole list. It is shorter than you might expect:
`pgp` and `citations` read one value each out of `src/data/socials.yml`, and that
file is on disk whatever the flags say, so neither needs the `socials` feature.
Only the script that refreshes the citation counts does.

## The two shape choices

Beside the booleans, `src/features.ts` holds two values that are a choice rather
than an on/off:

- **`HOME_SHAPE`** — `'profile'` or `'project'`: which of the two entry pages
  renders at `/`. One person, or one project and the people behind it. Both
  shapes stay in `src/pages/index.astro`; this picks which one runs. With the
  `demo` feature on, its second URL renders the other, so you can compare them
  before deciding.
- **`FEED_SOURCE`** — `'posts'` or `'papers'`: what `/feed.xml` is a feed **of**.
  Deliberately not tied to the blog, because a project site with no blog still
  wants a feed, of its paper pages. It has to name something that is on, and the
  assert says so if it does not.

## What goes with what

The `Owns` column is what the feature is made of — useful if you want its files
gone as well as its flag off, and the one thing no flag can do for you is the
`Also by hand` column.

<!-- BEGIN GENERATED: features -->
<!-- Generated from scripts/features.mjs by `npm run docs`. Do not edit by hand. -->

| Feature         | Flag           | What you lose                                                                            | Presets              | Needs                     | Owns                                                                                                                                                                                                                                                                                                                                                        | Also by hand                                                                                                                                                                   |
| --------------- | -------------- | ---------------------------------------------------------------------------------------- | -------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Publications    | `publications` | A bibliography parsed from BibTeX, with venue badges and copyable citations.             | `profile`, `project` | —                         | `src/pages/publications`, `src/components/pub`, `src/lib/publications.ts`, `src/loaders/bibtex.ts`, `src/data/papers.bib`, `src/data/venues.yml`, `scripts/update-bib.mjs`, `scripts/find-missing-papers.mjs`, `scripts/lib/missing-papers.mjs`, `src/data/papers-ignore.yml`, `src/content/pages/publications.md`, `src/content/pages/site/publication.md` | drop the `bib:check` and `bib:missing` scripts, and `fast-xml-parser`, from package.json                                                                                       |
| Paper pages     | `papers`       | A page per work: the abstract, a figure, the links, the citation.                        | `profile`, `project` | `publications`, `authors` | `src/pages/papers`, `src/content/papers`, `src/components/paper`, `src/lib/papers.ts`, `src/assets/papers`, `public/assets/img/papers`, `src/lib/feed/fromPapers.ts`, `src/content/pages/papers.md`                                                                                                                                                         | —                                                                                                                                                                              |
| Projects        | `projects`     | A grid of things you have made, grouped, each with a page of its own.                    | `profile`, `project` | —                         | `src/pages/projects`, `src/components/project`, `src/content/projects`, `src/assets/projects`, `src/data/project-groups.yml`, `src/content/pages/projects.md`                                                                                                                                                                                               | a group site usually calls these `approaches` — rename the collection in src/content.config.ts, the directory under src/pages/, and the label in src/content/pages/site/nav.md |
| Blog            | `blog`         | Dated posts with tags, per-tag pages, drafts, and an RSS feed.                           | `profile`            | —                         | `src/pages/blog`, `src/lib/blog.ts`, `src/lib/feed/fromPosts.ts`, `src/content/posts`, `public/assets/img/posts`, `src/content/pages/blog.md`                                                                                                                                                                                                               | —                                                                                                                                                                              |
| RSS feed        | `feed`         | An Atom/RSS feed at /feed.xml, so people can follow the site.                            | `profile`, `project` | `blog` or `papers`        | `src/pages/feed.xml.ts`, `src/lib/feed`                                                                                                                                                                                                                                                                                                                     | —                                                                                                                                                                              |
| CV              | `cv`           | A curriculum vitae rendered from YAML, with a dated timeline rail.                       | `profile`            | —                         | `src/pages/cv`, `src/lib/cv.ts`, `src/data/cv.yml`, `src/content/pages/cv.md`                                                                                                                                                                                                                                                                               | —                                                                                                                                                                              |
| Repositories    | `repositories` | Your code and archived datasets, from a committed metadata file.                         | `profile`            | —                         | `src/pages/repositories`, `src/data/repositories.yml`, `src/data/github-metadata.json`, `src/data/language_colors.yml`, `scripts/fetch-github-metadata.mjs`, `.github/workflows/update-github-metadata.yml`, `src/content/pages/repositories.md`                                                                                                            | drop the `data:github` script from package.json                                                                                                                                |
| People          | `people`       | A team roster whose entry keys are the anchors author names link to.                     | `project`            | `authors`                 | `src/pages/people`, `src/components/people`, `src/lib/people.ts`, `src/data/people.yml`, `src/assets/people`, `src/content/pages/people.md`                                                                                                                                                                                                                 | —                                                                                                                                                                              |
| Authors         | `authors`      | Named co-authors with ORCIDs, referenced by paper pages and the roster.                  | `profile`, `project` | —                         | `src/data/authors.yml`                                                                                                                                                                                                                                                                                                                                      | —                                                                                                                                                                              |
| Citation counts | `citations`    | Google Scholar counts on each entry, plus h-index and i10 on the list.                   | `profile`, `project` | `publications`            | `src/lib/citations.ts`, `src/data/citations.yml`, `scripts/update-scholar-citations.mjs`, `.github/workflows/update-citations.yml`                                                                                                                                                                                                                          | —                                                                                                                                                                              |
| Profile links   | `socials`      | ORCID, Scholar, DBLP, GitHub and LinkedIn chips, driven by one YAML file.                | `profile`            | —                         | `src/components/SocialRow.astro`, `src/data/socials.yml`                                                                                                                                                                                                                                                                                                    | —                                                                                                                                                                              |
| PGP key         | `pgp`          | A page for your public key: fingerprint, key id, download, and the armored block inline. | `profile`            | —                         | `src/pages/pgp-key`, `src/lib/pgp.ts`, `public/assets/pgp-key`, `src/content/pages/pgp-key.md`                                                                                                                                                                                                                                                              | —                                                                                                                                                                              |
| Demo switcher   | `demo`         | The two-button switcher and the second entry page that show both styles.                 | —                    | —                         | `src/pages/demo`, `src/components/DemoSwitch.astro`                                                                                                                                                                                                                                                                                                         | —                                                                                                                                                                              |
| Imprint         | `imprint`      | A site notice. Several jurisdictions require one; Germany certainly does.                | `profile`, `project` | —                         | `src/pages/imprint`, `src/content/pages/imprint.md`                                                                                                                                                                                                                                                                                                         | —                                                                                                                                                                              |

<!-- END GENERATED: features -->

## If you want the files gone too

You do not have to, and the flag is enough for a site that builds and ships. But
a repository you are going to live in for years is easier to read without a
`src/pages/blog/` you will never open. The honest version of that is:

1. Set the flag to `false` first, and build. That tells you the site is fine
   without it.
2. Delete what the `Owns` column lists for that feature.
3. Build again. Anything you took too much of fails loudly: `astro check`
   rejects the dangling import, and `audit-site.mjs` rejects a surviving link.

What stays behind is the feature's entry in `src/features.ts` — still `false`,
now permanently — plus its row in the manifest and its guards in the source.
Removing those too is a fourth step nothing checks for you, which is exactly why
the flag is the documented route and this is the footnote.

## Worked example: turning the blog off

**1. The flag.**

```diff
 // src/features.ts
-  blog: true,
+  blog: false,
```

**2. The feed.** `blog` is off, so `FEED_SOURCE: 'posts'` now names a collection
that is empty. The assert will say so. Either point the feed at the paper pages:

```diff
-export const FEED_SOURCE: 'posts' | 'papers' = 'posts';
+export const FEED_SOURCE: 'posts' | 'papers' = 'papers';
```

or turn the feed off as well (`feed: false`). `npm run init` makes this choice
for you when the preset only leaves one answer.

**3. Build.**

```bash
npm run check && npm run build && npm run audit
```

That is the whole edit. What you will see in `dist/`: no `blog/`, no `/blog/`
row in the nav, no blog section on the entry page, no blog URLs in
`sitemap.xml`, and — if you repointed it — a `feed.xml` of papers. The `--rose`
accent family is still in `tokens.css` and `'blog'` is still in `SECTIONS`, both unused and both one `blog: true` away from working again.
