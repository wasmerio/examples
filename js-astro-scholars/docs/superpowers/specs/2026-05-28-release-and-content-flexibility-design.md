# Release And Content Flexibility Design

## Context

This repository is currently used mainly as a GitHub template for personal
academic websites. It has no release tags, no `.github` automation, and no
template update mechanism. `package.json` reports version `0.2.0`, while the
changelog already documents `0.3.0`, so the project also needs a single
version source of truth before downstream users can track updates reliably.

The content model is intentionally simple: site-wide settings live in
`src/side.config.ts`; About, Projects, and Teaching content lives in YAML files;
publications use BibTeX; blog posts use Markdown content collections. This is
easy for new users, but the YAML pages currently expose only a narrow set of
fields. Users who need custom links, labels, highlights, or richer sections must
edit Astro templates directly.

## Goals

- Add a release/tag workflow so template versions can be tracked with SemVer
  tags such as `v0.3.0`.
- Add a downstream template update bot workflow that can open PRs in user repos
  when the upstream template publishes a newer tag.
- Keep GitHub template usage as the primary path.
- Prepare, but not complete, a future npm package path so standard Dependabot
  package bumps can coexist with template updates.
- Increase content freedom without making first-time usage harder.
- Preserve the existing YAML structure and keep current user data valid.

## Non-Goals

- Do not split the Astro theme into a published npm package in this first pass.
- Do not replace YAML with MDX everywhere.
- Do not require users to understand Astro components for normal profile edits.
- Do not make the template updater overwrite user-owned data files by default.

## Release And Version Design

The first pass will use `package.json` as the canonical project version and keep
`CHANGELOG.md` plus `.template-version` in sync with it.

Release tags will use the `vX.Y.Z` format. A release is valid only when:

- `package.json.version` equals the latest changelog entry.
- `.template-version` equals `package.json.version`.
- The pushed tag equals `v${package.json.version}`.
- `pnpm verify` passes.

The repository will include a release workflow that runs on pushed SemVer tags.
The workflow checks the version files, runs verification, and creates a GitHub
release for the tag. The human release process stays explicit:

1. Update version files and changelog.
2. Run `pnpm verify`.
3. Commit the release changes.
4. Create an annotated tag, for example `git tag -a v0.3.0 -m "Release v0.3.0"`.
5. Push the commit and tag.

This keeps release authority in git tags instead of hidden package registry
state.

## Template Update Bot Design

Template repositories do not provide the same clean dependency graph as npm
packages. A repository created from a GitHub template may not share useful git
history with the upstream template, so a plain `git merge upstream/vX.Y.Z` is
too fragile for downstream users.

The first-pass updater will therefore use a conservative overlay strategy:

- A copied workflow runs in downstream user repositories on a weekly schedule or
  by manual dispatch.
- It reads the upstream repository from `.template-sync.json`.
- It compares the local `.template-version` to upstream SemVer tags.
- If a newer tag exists, it clones that tag into a temporary directory.
- It copies template-owned files into the user repo while skipping protected
  user-owned paths.
- It updates `.template-version`.
- It opens a PR with the changes.

Protected paths will include user content and personalization by default:

- `src/side.config.ts`
- `src/data/**`
- `src/content/posts/**`
- `public/profile.*`
- environment files and local generated output

The updater will favor safe PRs over perfect synchronization. If a user heavily
customizes template-owned pages or layouts, the PR may contain conflicts or
reviewable changes, but it should not silently rewrite personal profile data.

## npm Package Path

The npm package path should be added after the template update mechanism is
stable. The target shape is:

- A package such as `@jxpeng/astro-scholars` exports layouts, components, data
  helpers, and default styling.
- A generated user site imports package components and keeps only personal
  content/config locally.
- Standard Dependabot can bump the package dependency and open PRs.
- The template update bot remains useful for users who stay on the GitHub
  template path.

This requires clearer component boundaries before publishing. The first pass
should not force that split, but new helpers should be written so they can move
into a package later.

## Content Flexibility Design

The content model will evolve in three layers.

### Layer A: Enhanced YAML

This is the first implementation target.

Existing YAML shapes remain valid. Optional fields add freedom where users
currently hit the most limits:

- Shared link objects: `{ label, href, icon? }`
- Shared badges: short labels rendered separately from technology tags.
- Shared highlights: short bullet lists for project/course/award detail.
- Shared metadata rows: `{ label, value }` pairs for facts that do not deserve
  a new hard-coded schema field.

Projects can add optional `subtitle`, `badges`, `highlights`, `links`,
`metadata`, and `featured`. Existing `url` remains supported and is converted to
the default project link when `links` is absent.

Teaching modules can add optional `badges`, `highlights`, and `links` while the
existing single `link` field remains valid.

About custom sections can add optional section icons and item-level `badges`,
`highlights`, and `links`. The current string item form still works.

### Layer B: YAML Plus Markdown/MDX

The first pass will document this as the next extension rather than implement it
fully. The intended interface is a sidecar content reference from YAML, for
example `content: projects/scholars-portal.md`, where Markdown/MDX stores longer
free-form narrative while YAML still controls ordering, filtering, and metadata.

This layer is useful for users who want richer writing but do not want to edit
Astro pages.

### Layer C: Components And Slots

This is the npm-package-aligned layer. Pages should eventually become thin
wrappers around reusable components with typed props and slots. Advanced users
can write Astro/MDX composition directly, while normal users keep using YAML.

## Data Flow

YAML files will still be parsed at build time. Lightweight TypeScript helpers
will normalize optional fields into predictable arrays:

- A project `url` becomes a default link if `links` is missing.
- A teaching module `link` becomes a default link if `links` is missing.
- Missing arrays normalize to empty arrays.
- Invalid or empty optional fields are ignored during rendering.

Pages should render normalized data, not raw YAML values, so future Markdown/MDX
and npm package extraction can reuse the same helpers.

## Testing Strategy

- Add unit tests for release version parsing and tag comparison.
- Add unit tests for template sync matching/protected path logic.
- Add unit tests for project and teaching normalization helpers.
- Keep `pnpm verify` as the top-level confidence command.
- Run `pnpm verify` before claiming completion.

## Rollout

1. Add version files, release validation, and GitHub release workflow.
2. Add template update config, scripts, and downstream workflow.
3. Add YAML normalization helpers and tests.
4. Update Projects, Teaching, and About rendering to consume optional fields.
5. Update English and Chinese README docs with release, template update, and
   flexible content examples.
6. Verify the full site.
7. Create the first release tag after the working tree is committed.
