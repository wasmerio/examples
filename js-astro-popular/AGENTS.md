# AGENTS.md: working in astro-theme-popular

Instructions for AI agents (and new contributors) working in this repository.

## Report instructions that don't work

These instructions, the [quick start](https://popular.mariatta.ca/docs/quick-start/?fw=astro),
and `scripts/setup.py` are meant to be followed literally. When any of them is
wrong, out of date, ambiguous, or fails when you run it, treat that as a bug in
the docs, not as something to route around silently:

- **Tell the user as you hit it**, in the moment: the step, the command you ran,
  what you expected, what actually happened.
- **Offer to report it upstream**, so it gets fixed for everyone: an issue at
  https://github.com/Mariatta/astro-theme-popular/issues (or a pull request
  fixing the wording, if the fix is obvious). File it only with the user's
  go-ahead, and if the problem is in a shared doc, mention that the sibling repo
  `hugo-theme-popular` likely needs the same fix.
- **Do not paper over it.** A workaround that lives only in your session leaves
  the next reader to hit the same wall. If you must work around a step to keep
  going, say so explicitly and still surface the report.

This applies whether you are setting up a site for a user or modifying the theme
itself.

## What this repo is

**Popular** is a community/meetup theme that ships as two parallel
implementations: this repo (Astro) and the sibling repo `hugo-theme-popular`
(Hugo). Both implement the same design, content model, and demos. A written
contract (`PARITY.md`) plus `scripts/sync-shared.sh --check` keep them from
drifting. If the sibling repo is checked out next to this one, many changes
here must be mirrored there (see "Parity rules" below).

## The single most important thing to know

This repo is an **npm workspace** with two ways of building the same theme, and
knowing which one you are looking at explains most confusion.

| Member | What it is |
|---|---|
| `package/` | The theme as a publishable Astro integration. The only published artifact. |
| `demos/<slug>/` | Five real consumer projects (starter, aquarium, foodie, kdrama, superfan), each installing the package and supplying its own `popular.config.ts`, `src/content/`, `public/images/`. |
| `smoke/` | The minimal consumer, with six config variants CI builds to exercise overrides, opt-outs, preview mode and subpaths. |
| `create-popular-site/` | The scaffolder behind `npm create popular-site@latest`. Its `templates/` is gitignored and written by `prepack` from `demos/*`, so never edit templates: edit the demo. |
| `src/` | The **template model**: the old copy-the-repo site, kept working until the phase-4 cutover. |

```bash
npm install                            # one install links every member
npm run dev --workspace demos/aquarium # or: npm run demo:aquarium
npm run build --workspaces             # build everything
```

Consequences:

- **A demo is a project, not a fixture.** Edit `demos/<slug>/**` and build it
  where it lives. There is no activation step and nothing is copied into `src/`
  (`scripts/use-demo.mjs` is gone, retired in phase 3).
- **Demo content imports theme components by package specifier**
  (`astro-theme-popular/components/Callout.astro`), because a consumer has no
  `src/components/`. `src/content/` still uses template-relative paths. Both are
  correct; `scripts/starter-content.py` knows the mapping.
- **When editing shared config shape (NAV, FOOTER, BRAND), apply the same edit
  to `src/config.ts` and all five `demos/*/popular.config.ts`.**
- **Merge-based forks**: `src/content/` ships live sample entries (event, post,
  organizer, speaker, venue). Forks that merge from upstream rather than copy
  should expect to delete or replace those samples; `demos/**` is inert.

## The npm package transition (PACKAGING.md, PR #9)

`package/` is the theme as a publishable Astro integration (phases 1-3 done);
`smoke/` is its minimal consumer, built in CI. Until the cutover, theme code
exists **twice**: the canonical template-model copy (`src/`,
`public/scripts/`) and the package copy (`package/src/`, `package/scripts/`).
Any edit to one must be applied to the other; the package-smoke workflow
fails on drift (styles/scripts byte-identical; components/layouts/pages/lib
identical modulo the config import, `../config` in src vs `popular:config`
in the package). The one exception is `BaseLayout.astro`, which diverges by
design (the package version has no static script tags; the integration
injects them): mirror edits to it by hand.

## Commands

```bash
npm install            # one install for every workspace member
npm run dev            # dev server for the template-model site in src/
npm run build          # builds src/ to dist/
npm run demo:<name>    # dev server for that demo workspace
npm run demos:build    # build every workspace member
```

To bulk-populate events and speakers from a Sessionize event, run
`python3 scripts/sessionize-import.py --url <sessionize view/All endpoint> --site .`
(or `scripts/spreadsheet-import.py --xlsx <workbook>` for spreadsheet-based
planning; both share the same conventions) instead of writing the files by hand (never overwrites existing files).

`dist/` and `.astro/` are generated; never hand-edit them.
`public/` here is **source** (static assets, shared scripts), unlike Hugo
where `public/` is build output.

## Setting up a new site for a user

When a user asks you to set up a **new community site** with this theme (as
opposed to modifying the theme itself), the write path is the setup wizard, not
your editor. Your job is the conversation; `scripts/setup.py` is the
deterministic, tested writer.

1. **Read the schema** `src/data/setup-questions.json`. It is the single source
   of truth (the Hugo repo renders it as a "Before you build" worksheet page).
   Interview the user **conversationally, grouped by topic** (identity, then
   governance, then links), one topic per exchange, never as a flat form dump.
2. **For `decision`-layer questions, advise, don't just collect.** Use the
   question's `help` text, surface its `handbook_url`, and bring relevant
   context ("you mentioned you're a PyLadies chapter, the PSF Code of Conduct is
   the conventional choice there"). "Not decided yet" is a valid answer: record
   it and move on.
3. **Write the answers to `answers.json`** and run
   `python3 scripts/setup.py --answers answers.json --dry-run`. Show the user
   the diff. On approval, run it **without** `--dry-run`; it detects Astro and
   writes `src/config.ts` plus the seed pages. On a fresh template the wizard
   adopts the unedited starter `src/config.ts` and CoC page automatically (no
   `--force` needed); it only refuses, and asks for `--force`, once the user has
   hand-edited those files, so their work is never silently overwritten.
4. **Never hand-edit `src/config.ts` or the seed pages to apply the answers.**
   The script owns that write path; hand-edits drift from the schema and skip
   the `DECISIONS.md` audit trail.
5. **After writing, `npm run build`** and confirm it succeeds. Point the user at
   `DECISIONS.md` for what was decided and the "Still open" list for what to
   come back to.

The wizard also writes `astro.config.mjs` (`site` and `base`, split from the one
`base_url` answer by `split_site_base()`, because Astro needs them separate) and
`.github/workflows/deploy.yml` (GitHub Pages, parameterless), the latter unless
the site already has workflows of its own.

**Two shapes.** `--astro-model template` writes into a copy of this repo (the
default, and what an existing site detects as); `--astro-model package` writes a
small site that depends on `astro-theme-popular` from npm: `popular.config.ts`,
a pinned `package.json`, a one-line `src/content.config.ts`. Creating a site
from nothing wants the package model, and
`scripts/starter-content.py --format astro --astro-model package` copies the
starter content with its MDX component imports rewritten to package specifiers
(a consumer has no `src/components/`). See PARITY.md for the full table. Tell the user to set Settings ->
Pages -> Source: GitHub Actions once.

Same invariant as the wizard: sugar, never a gate. A user who wants to skip the
interview entirely still gets a clean starter config.

## Parity rules (important)

- `src/styles/**` and `public/scripts/**` must stay **byte-identical** with
  `hugo-theme-popular/assets/css/**` and `assets/js/**`. After editing either
  side, copy to the other repo and run `bash scripts/sync-shared.sh --check`
  (image drift is known and tolerated).
- New shared JS files must be registered in three places: a `<script>` tag in
  `src/layouts/BaseLayout.astro`, the bundle in hugo-theme-popular's
  `layouts/_default/baseof.html`, and the file table in both `PARITY.md`s.
- Component changes usually need an equivalent change in the mapped Hugo
  template; the mapping table is in `PARITY.md`.
- The content model is zod-validated in `src/content.config.ts`; if you add a
  front matter field, update the schema, both `PARITY.md`s, and the Hugo side.

## Adding content

Front matter is YAML (`---`). Key content types (full schema in
`src/content.config.ts` and `PARITY.md`):

- **Blog post** (`content/blog/*.md`): `title`, `date`, `authors: ["slug"]`
  (matching `content/authors/<slug>.md`), `description`, `image`, `tags`.
- **Event** (`content/events/*.md`): `title`, `date`, `image`, plus venue fields.
- **Organizer** (`content/organizers/*.md`): `title`, `weight`, `role`, `photo`,
  `description`, `social` list (`label`, `icon`, `url`).
- **Speaker** (`content/speakers/*.md`): same shape as authors; events reference
  them via `speakers: ["slug"]`.
- **Venue** (`content/venues/*.md`): `title`, `address`, `notes` (arrival
  instructions, inherited by events), `accessibility`, `website`; events
  reference one via `venueRef: "slug"`.

Image paths are **root-absolute** (`/images/post-1.png`), both in front matter
and in markdown bodies. The theme's links assume deployment at a domain root.
Put an italic line right after a body image for a caption.

Remember: add demo content under `demos/<slug>/src/content/`, not only `src/`.
Demo MDX imports components by package specifier, not by relative path.

## Configuration knobs

- `SITE.previewMode` renders the preview banner (`components/PreviewBar.astro`),
  for tools that build a site on someone's behalf. Never set it in a demo config
  or anything the wizard writes: a real site showing "this is a preview" is the
  failure this design prevents (see PARITY.md).
- `NAV` supports one level of nesting via a `children` array on an item;
  it renders as a dropdown (see `src/components/Header.astro`).
- `BRAND` drives all colors/fonts; `BaseLayout.astro` emits an `html:root`
  override. Keep the `html:root` selector: since Astro 7, the bundled token CSS
  is injected after the inline override, and plain `:root` would lose the
  specificity tie and revert the site to the theme's default palette.
- `FOOTER` takes `tagline`, optional `credit: { label, url }`, and `columns`.

## Subpath deployments (URL rules)

A site can set `base` in `astro.config.mjs` (a GitHub project page lives at
`user.github.io/repo/`). Astro rewrites the asset URLs it generates itself and
nothing else, so **never write a bare path into a component**:

- Any href or src: `href={withBase('/events/')}`, `src={withBase(d.image)}`
- Absolute URLs (canonical, `og:image`, JSON-LD, feeds, `llms.txt`):
  `absoluteUrl('/events/', Astro.site ?? Astro.url)`. `Astro.site` is the bare
  origin and does not carry the base; `Astro.url.pathname` does.

Both live in `lib/url.ts` (exported publicly as `astro-theme-popular/url`) and
pass external URLs, `mailto:`, `tel:` and `#fragment` through untouched, so
applying one is never wrong: use them for adopter config values and content
front matter too, which is what keeps adopters from having to rewrite links.
Markdown bodies are handled by a hook registered on the active Markdown
processor: `popular-markdown.mjs` (template model) and `package/index.mjs`
(npm consumers); the same hook adds the per-section `#` anchors and the
`g-table-scroll` wrapper around markdown tables (PARITY.md, "Heading anchors"
and "Markdown tables"). It has to be an integration, not a `markdown.rehypePlugins`
entry: Astro 7's default processor runs no rehype plugins, and only an
integration sees the resolved config, so `astro build --base ...` is honored.
Keep the two copies in step. `package-smoke.yml` builds
`smoke/astro.base.config.mjs` with `base: '/sub'` and fails on any internal
`href`/`src` left at the root. The Hugo twin uses `rel-href.html`,
`rel-src.html` and `abs-url.html` (PARITY.md, "Subpath deployments").

## Naming conventions

- Config keys, component props, and frontmatter fields must be descriptive
  words, never single letters or cryptic abbreviations. A reader should
  understand a key without opening the component that consumes it. Example:
  the `HOME.stats` entries use `value` and `label` (renamed from the old
  `n` and `l`; do not reintroduce short forms like these).
- The same applies to `STRINGS` keys, CSS custom properties, and JS `data-*`
  hooks: name for meaning, and keep the names identical across both repos
  since the key names are part of the parity contract.

## Internationalization (UI strings)

- Never hardcode user-facing text in components/pages. Add a key to `STRINGS`
  in every config (`src/config.ts` + all `demos/*/popular.config.ts`) and use
  `STRINGS.key`; add the same key to hugo-theme-popular's `i18n/en.toml`
  (the key sets must match, see PARITY.md).
- Dates: always `toLocaleDateString(SITE.locale, ...)`, never a hardcoded
  `'en-US'`. `SITE.locale` also drives `<html lang>`.
- Shared JS must stay language-free; pass text via `data-*` attributes on
  `<body>` (see `data-copy-label` / `data-checklist-done` in BaseLayout).
- Site owners translate by editing `STRINGS` and `SITE.locale` in `config.ts`.

## Settings that live outside this repo

The demo gallery gets a Netlify Deploy Preview per pull request. The whole
configuration is in the Netlify UI, deliberately: no `netlify.toml`, no
workflow, nothing an adopter who copies this template would inherit, and no
Netlify dependency for anyone using the theme. Production stays on GitHub Pages.

| Setting | Value |
|---|---|
| Build command | `npm ci && node scripts/build-sites.mjs "$DEPLOY_PRIME_URL" "" public` |
| Publish directory | `public` |
| `NODE_VERSION` | must match `deploy-demo.yml` (currently 22) |
| `POPULAR_PREVIEW_NOTE` | optional, scoped to deploy previews: renders the preview banner |
| Custom domain | none: production stays on GitHub Pages |
| Sensitive variable policy | require approval for pull requests from forks |

Four things that are easy to get wrong, each learned the hard way on the Hugo
repo:

- **Build the whole tree, not one site.** `scripts/build-sites.mjs` is what
  production runs too. A preview that builds only the active `src/` looks right
  until you click a demo in the gallery and get a 404.
- **The base prefix is empty on Netlify** and `/astro-theme-popular` on Pages,
  which is why it is an argument rather than a constant. Demos land at
  `/aquarium/` and friends either way.
- **Pin `NODE_VERSION`.** Nothing in this repo can check what Netlify uses, so
  it drifts silently from the version CI tests. When you change the Node version
  in `deploy-demo.yml`, change it in the Netlify UI too.
- **Fork pull requests run `npm ci`,** which executes lifecycle scripts from the
  fork's `package.json`. That is arbitrary code from a stranger, so require
  approval rather than building automatically. The Hugo repo can be laxer
  because a Hugo build runs no third-party code.

## CI checks

- `.github/workflows/image-alt.yml` activates and builds each demo and fails if
  any `<img>` lacks a non-empty `alt` attribute, or any markdown image is
  written as `![](...)`. Always give images meaningful alt text (image captions
  go in an italic line after the image, not in `alt`).
- `.github/workflows/helper-tests.yml` runs the Python helper-script tests
  (`python3 -m unittest discover -s scripts/tests`); run them after touching
  anything in `scripts/`.

## Writing style for content and docs

- No em dashes anywhere; use a comma or a colon instead.
- Demo copy must identify the framework: "an Astro demo site", never just
  "a demo site". (The Hugo repo says "a Hugo demo site".)
- All demo/example content is fictional; every outbound link in demo content
  points to `example.com`. Do not add real organizations or people. Exception:
  license attribution must keep its real links (the Code of Conduct credits
  the Django CoC and Geek Feminism template, as CC-BY requires).
- The theme credit is "Popular. An Astro theme by Mariatta." linking to the
  project site https://popular.mariatta.ca/ (set per site via `FOOTER.credit`).
