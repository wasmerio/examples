<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Studia](https://github.com/dfuchss/astro-studia) Astro theme by dfuchss, copied from commit `424bec9cf9770f06f68315f055e443accedb3019` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-studia.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [dfuchss](https://github.com/dfuchss), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<h1 align="center"><img src=".github/media/logo.png" alt="Studia Theme" height="110"></h1>

<p align="center">
An academic website template: publications from BibTeX, paper pages, projects,
a blog, a CV, people. Built with <a href="https://astro.build/">Astro</a>.
</p>

<p align="center">
<strong><a href="https://dfuchss.github.io/astro-studia/">Live demo</a></strong>
· <a href="https://github.com/dfuchss/astro-studia/wiki">Documentation</a>
· <a href="https://dfuchss.github.io/astro-studia/demo/project/">Project-site variant</a>
</p>

<p align="center">
<img src=".github/media/home.webp" alt="The entry page: a name, a one-line role, a portrait and a row of publication and citation counts, in a dark palette with monospace section labels." width="840">
</p>

---

Eight content areas, three integrations — one of them Astro's sitemap, two of
them this template's own — and **no UI framework, no CSS framework, no theme
layer**, dark only. Every line of it is source you can read and change — there
is no package boundary between you and the markup.

Extracted from two production sites, [fuchss.org](https://fuchss.org) and
[ardoco.de](https://ardoco.de), which are hand-written in the same style.

The demo is this repository, deployed from `main` by the workflow it ships with.
Everything in it is placeholder content: the works are Cicero's, the website is
not.

## What it looks like

One template, two starting points. `npm run init` sets the flags for either,
and you can mix the features freely afterwards — the presets only pre-tick the
boxes.

<table>
<tr>
<td width="50%"><a href="https://dfuchss.github.io/astro-studia/"><img src=".github/media/home.webp" alt="Personal academic page: name, one-line role, portrait, and a row of publication and citation counts." width="100%"></a></td>
<td width="50%"><a href="https://dfuchss.github.io/astro-studia/demo/project/"><img src=".github/media/project.webp" alt="Academic project page: project title, action chips, sub-projects and a team roster." width="100%"></a></td>
</tr>
<tr>
<td align="center"><code>--preset profile</code> · one person</td>
<td align="center"><code>--preset project</code> · a project or group</td>
</tr>
</table>

<table>
<tr>
<td width="33%"><a href="https://dfuchss.github.io/astro-studia/publications/"><img src=".github/media/publications.webp" alt="Publications grouped by year, each entry with a coloured venue badge, authors, and DOI and BibTeX chips." width="100%"></a></td>
<td width="33%"><a href="https://dfuchss.github.io/astro-studia/papers/de-officiis/"><img src=".github/media/paper.webp" alt="A paper page: breadcrumb, title, author byline with ORCID badges, venue line and abstract." width="100%"></a></td>
<td width="33%"><a href="https://dfuchss.github.io/astro-studia/cv/"><img src=".github/media/cv.webp" alt="A CV page with a dated timeline rail down the left of each section." width="100%"></a></td>
</tr>
<tr>
<td align="center"><a href="https://dfuchss.github.io/astro-studia/publications/">Publications</a><br><sub>parsed from BibTeX</sub></td>
<td align="center"><a href="https://dfuchss.github.io/astro-studia/papers/de-officiis/">Paper page</a><br><sub>one per work</sub></td>
<td align="center"><a href="https://dfuchss.github.io/astro-studia/cv/">CV</a><br><sub>rendered from YAML</sub></td>
</tr>
</table>

It is dark only, on purpose: one palette to get right instead of two, and no
flash of the wrong one on load. The accent palette in `src/styles/tokens.css` is
one base hex per family, with each family's other four roles mixed from it — see
[docs/Theming.md](docs/Theming.md).

## Getting started in five minutes

```bash
npx degit dfuchss/astro-studia my-site   # or "Use this template" on GitHub
cd my-site && npm install && npm run dev
```

Then, in order:

| #   | Edit                    | For                                                                                        |
| --- | ----------------------- | ------------------------------------------------------------------------------------------ |
| 1   | `src/consts.ts`         | **`SITE.url` first** — see below. Then your name (`SELF`), email, and `demoNotice: false`. |
| 2   | `src/styles/tokens.css` | One base hex per accent family. See [docs/Theming.md](docs/Theming.md).                    |
| 3   | `src/data/`             | Your `papers.bib`, venues, CV and `contact.yml`. All of it is demo content.                |
| 4   | `src/content/`          | Your posts, projects and paper pages.                                                      |
| 5   | `src/assets/portrait.*` | Your photo. Any common extension; the filename is the whole setting.                       |
| 6   | `src/content/pages/`    | Every word the site prints: title, brand, tagline, nav and footer rows, each page's text.  |
| 7   | —                       | `npm run check && npm run build && npm run audit`                                          |

`SITE.url` is first because both sides of the base come from it:
`astro.config.ts` derives `base` from its path, and `npm run audit` derives the
base it expects from the same value. Left as shipped, the site builds with
`/astro-studia` on every URL **and passes every check** — the links and the audit
agree with each other — and breaks the moment it is deployed anywhere else.

Turning off an area you do not want is one boolean in `src/features.ts` —
nothing is deleted, the code stays on disk, and `npm run init` sets the flags
for you:

```bash
npm run init                          # pick features interactively
npm run init -- --preset project      # or start from a preset
```

See [docs/Quickstart.md](docs/Quickstart.md) for the walkthrough and
[docs/Features.md](docs/Features.md) for the flag-by-flag detail.

## Documentation

`docs/` is the whole of it, one page per file, also published to this
repository's [wiki](https://github.com/dfuchss/astro-studia/wiki).

| Page                                   | For                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| [Quickstart](docs/Quickstart.md)       | clone, pick features, first build, first deploy                              |
| [Configuration](docs/Configuration.md) | every knob in `src/consts.ts`, and each file in `src/data/`                  |
| [Content](docs/Content.md)             | the collections, their schemas, the page text, and what markdown can express |
| [Theming](docs/Theming.md)             | the palette, the section accents, the widths, the primitives                 |
| [Features](docs/Features.md)           | the flags, their dependencies, and what belongs to what                      |
| [Deploying](docs/Deploying.md)         | Pages, base paths, the URL policy, the wiki                                  |
| [Verification](docs/Verification.md)   | what each check asserts, and why it is written that way                      |
| [Architecture](docs/Architecture.md)   | how the loader, collections, integrations and scripts fit together           |
| [Updating](docs/Updating.md)           | pulling upstream fixes into your copy, even one made with `degit`            |

## Layout

```
src/
  consts.ts           the config file: SITE, SELF, SECTIONS, shown(), FOOTER,
                      AUTHOR_LIMIT, PEOPLE_ORCID, ALLOWED_THIRD_PARTY
  content.config.ts   the eight collections and their schemas
  loaders/bibtex.ts   papers.bib -> a typed `publications` collection
  lib/paths.ts        every URL shape, and URL_POLICY — see docs/Deploying.md
  data/               papers.bib, venues, authors, people, cv, contact, socials, repositories
  content/            papers/, projects/, posts/, and pages/: every word the
                      templates print, one Markdown file per page
  components/ layouts/ lib/ pages/ styles/
  integrations/       base-paths: makes `base` work for hand-written links, in
                      the dev server and in the build alike
                      sitemap-shape: makes every sitemap entry name the file emitted
public/               copied verbatim; everything here is a permanent URL
scripts/              the audit, the setup wizard, the data refreshers
docs/                 the wiki, page per file: quickstart, configuration, content,
                      theming, features, deploying, verification, architecture
```

## Content model

Seven collections of content, plus `pages`, the site's own words. Every cross-reference is an Astro `reference()`, so a bad
slug, an unknown venue, or a BibTeX key pointing at a page that does not exist
**stops the build** and names the offender. In a template language each of
those is a silent lookup that renders blank, and you find out when a reader
tells you.

| Collection     | Source                  | Notes                                       |
| -------------- | ----------------------- | ------------------------------------------- |
| `publications` | `src/data/papers.bib`   | parsed at build time                        |
| `venues`       | `src/data/venues.yml`   | badge colours, keyed by the BibTeX `abbr`   |
| `authors`      | `src/data/authors.yml`  | everyone who appears anywhere; name + ORCID |
| `people`       | `src/data/people.yml`   | the entry key **is** the `/people/#anchor`  |
| `papers`       | `src/content/papers/`   | one page per work; the filename is the URL  |
| `projects`     | `src/content/projects/` | `redirect` makes an entry a link-out        |
| `posts`        | `src/content/posts/`    | the filename sets the permalink             |

Three fields in `papers.bib` are this template's rather than BibTeX's, and all
three are checked at build time: `abbr` (the venue badge), `pdf` (a file you
host) and `page` (this work's own page). See [docs/Content.md](docs/Content.md).

## What `npm run audit` guards

Run by the deploy workflow **before** it publishes, so a regression fails the
build rather than reaching the site.

```
✓ css: 62 custom properties, all defined or defaulted
✓ css: dark-only, no theme toggle
✓ css: all 9 sections have an accent block
✓ a11y: 9 colour tokens all clear WCAG on --bg
✓ links: 549 internal links and 37 fragments resolve
✓ urls: 54 canonical, og:url, Scholar and JSON-LD URLs each name their own file
✓ manifest: 3 URLs across 1 .webmanifest name a file on disk, all carrying the base /astro-studia/
✓ html: 24 pages each have one h1, a title, a description and a canonical (or noindex)
✓ html: all 47 images have intrinsic dimensions
✓ html: no text runs into a link on 24 pages
✓ privacy: no third-party subresources
✓ privacy: no email address appears in the built output
✓ sitemap: robots.txt → sitemap-index.xml → 1 file(s), 24 URLs, every one names a file on disk
✓ feed.xml: 2 <item> entries, 3 links each name a file on disk
✓ dist/.nojekyll present
```

Every link, canonical, sitemap entry and feed link is resolved to a file **by
its exact shape** — `/a/b/` must be `a/b/index.html`, `/a/b` must be
`a/b.html` — so a link whose shape does not match what the build emitted fails
here rather than 404ing on the host. See the URL policy in
[docs/Deploying.md](docs/Deploying.md).

The last one matters more than it looks. Without `.nojekyll`, GitHub Pages runs
Jekyll over the output, Jekyll ignores directories beginning with an underscore,
and `/_astro/` — every hashed stylesheet and script — is simply not served. A
`dist/CNAME present` line joins it whenever you have a `public/CNAME`. See
[docs/Deploying.md](docs/Deploying.md).

All of it is `scripts/audit-site.mjs`, one independent block per check. Delete
the ones you do not want; add your own — [docs/Verification.md](docs/Verification.md)
says what each asserts, and why every regex-based check names a floor on how
little is too little.

## Scripts

| Command                  | Does                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `npm run dev`            | dev server at http://localhost:4321; `/` redirects to the based root                   |
| `npm run start`          | the same thing under the name other toolchains expect                                  |
| `npm run dev:fresh`      | clears `.astro` and Vite's cache first, for when a stale one is the suspect            |
| `npm run build`          | → `dist/`                                                                              |
| `npm run preview`        | serve the built `dist/` locally, to look at the bytes rather than the sources          |
| `npm run check`          | `astro check` + `prettier --check`                                                     |
| `npm run format`         | `prettier --write`                                                                     |
| `npm run audit`          | the one gate: every check over `dist/` — see below                                     |
| `npm run icons`          | write the three `public/` icon PNGs from one image: `npm run icons -- logo.png`        |
| `npm run screenshots`    | regenerate the `.github/media/` README screenshots (needs Chrome; `CHROME` picks one)  |
| `npm run data:github`    | refresh `src/data/github-metadata.json`                                                |
| `npm run data:citations` | refresh `src/data/citations.yml` from Google Scholar (opt-in)                          |
| `npm run bib:check`      | check `papers.bib` against Crossref                                                    |
| `npm run bib:missing`    | propose papers from DBLP or OpenAlex that `papers.bib` lacks (`-i` asks, `--yes` adds) |
| `npm run init`           | write the flags, and who the site is about, from a preset or a selection               |
| `npm run docs`           | regenerate the flag list in `src/features.ts` and the table in `docs/Features.md`      |
| `npm run docs:check`     | fail if either is out of date, or a flag combination cannot build (run in CI)          |

The based root is `/astro-studia/` as shipped, because `base` is derived from
`SITE.url`; dev and the build serve identical URLs.

Node 22 or newer (`.nvmrc`; `.devcontainer/devcontainer.json` pins the same for
GitHub Codespaces and VS Code dev containers). The build needs no network, no
token: `citations.yml` and `github-metadata.json` are committed,
which is what makes a fresh clone build offline.

## Deploying

`.github/workflows/deploy.yml` checks, builds and audits on every push and
pull request to `main`, then publishes `dist/` to the `gh-pages` branch. Three
further workflows are opt-in: two refresh the committed data files, and
`docs.yml` publishes `docs/` to this repository's wiki. The data workflows need
no secret; `docs.yml` needs the `PAT` secret and is pinned to this repository, so
it does nothing in a copy.
See [docs/Deploying.md](docs/Deploying.md).

## Licence

[MIT](LICENSE) — © 2026 Dominik Fuchß.

The demo content is MIT too, and is **meant to be deleted**. It is built around
the works of Marcus Tullius Cicero, cited as a classicist would: the entries
are modern editions, so `year` is the edition's. Its DOIs use the `10.5555`
prefix, which the DOI registry reserves for examples — they render, and
`npm run bib:check` correctly reports them as unregistered. One person in it,
the modern editor, is invented; her ORCID is ORCID's own fictional demo record
and the GitHub handle is `octocat`, so nothing here points at a real identity
or at a link that 404s. The PGP key under `public/assets/pgp-key/` is demo
content in the same sense: generated for the template and then thrown away, so
nobody holds the secret half and it can encrypt nothing. Its user id says so.
