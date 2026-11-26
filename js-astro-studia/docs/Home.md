# Studia Theme

An academic website template: a bibliography parsed from BibTeX, a page per
paper, projects, a blog, a CV, a people roster. Built with
[Astro](https://astro.build/), and with **no UI framework, no CSS framework and
no theme layer**. Dark only.

Every line of it is source in your own repository. There is no package boundary
between you and the markup, which means there is also nothing to wait for when
you want something changed — and nothing to keep in step with an upstream
release.

Extracted from two production sites, [fuchss.org](https://fuchss.org) and
[ardoco.de](https://ardoco.de), which are hand-written in the same style. Where
a decision here looks over-thought, it is usually because one of those two
shipped the obvious version first and it broke.

## What you get

Eight areas of a site, all of them optional:

| Area         | Route            | Comes from                                                |
| ------------ | ---------------- | --------------------------------------------------------- |
| Home         | `/`              | `src/pages/index.astro`, one of two shapes                |
| Publications | `/publications/` | `src/data/papers.bib`, parsed at build time               |
| Paper pages  | `/papers/`       | `src/content/papers/`, one file per work                  |
| Projects     | `/projects/`     | `src/content/projects/`                                   |
| Blog         | `/blog/`         | `src/content/posts/`, plus tag pages and drafts           |
| Repositories | `/repositories/` | `src/data/repositories.yml` and a committed metadata file |
| People       | `/people/`       | `src/data/people.yml`                                     |
| CV           | `/cv/`           | `src/data/cv.yml`                                         |

And the smaller ones that come with them: `/feed.xml`, `/pgp-key/`, `/imprint/`,
`/404.html`, `/robots.txt`, `/sitemap-index.xml` and the `/sitemap-0.xml` it
points at, and `/demo/project/` — the second entry-page shape, which the
`demo` feature's flag turns off along with the switcher.

## The three things worth knowing before you start

**Everything ships on.** A commented-out feature is not type-checked, not built,
not audited, and rots within two Astro releases — so the demo content doubles as
the test suite, and every code path in here is exercised by
`npm run build && npm run audit`. Turning an area off is one boolean in
`src/features.ts`, and nothing is deleted. [Features](Features.md) says what
a `false` does, and `npm run init` sets the booleans for you.

**Mistakes are build failures, not blank spaces.** Every cross-reference between
collections goes through Astro's `reference()`, so a bad slug, an unknown venue
or a BibTeX key pointing at a page that does not exist stops the build and names
the offender. In a template language each of those is a silent lookup that
renders empty, and you learn about it when a reader tells you.

**What the site publishes is checked before it is published.** `npm run audit`
resolves every internal link, canonical URL, sitemap entry and feed link to a
file on disk _by its exact shape_, asserts the host files GitHub Pages needs, and
fails the deploy if an email address reaches the served bytes.
[Verification](Verification.md) says what each check asserts and what went wrong
once to make it exist.

## Where to go

| Page                              | For                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| [Quickstart](Quickstart.md)       | clone, pick features, first build, first deploy — in that order                       |
| [Configuration](Configuration.md) | every knob in `src/consts.ts`, and what each file in `src/data/` is                   |
| [Content](Content.md)             | the seven collections, their schemas, and what markdown can express                   |
| [Theming](Theming.md)             | the palette, the section accents, the widths, the primitives                          |
| [Features](Features.md)           | what a flag in `src/features.ts` does, its dependencies, and what belongs to what     |
| [Deploying](Deploying.md)         | GitHub Pages, base paths, the URL policy, what stays in `public/`                     |
| [Verification](Verification.md)   | what each check asserts, and why it is written the way it is                          |
| [Architecture](Architecture.md)   | how the BibTeX loader, the collections, the integrations and the scripts fit together |

These pages are written to be read in `docs/` in the repository as well as here
in the wiki; a workflow copies them across on every push to `main`. See
[Architecture](Architecture.md) for how that works.
