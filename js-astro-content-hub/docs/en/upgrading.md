---
title: "Upgrading"
description: "How adopters of the astro-content-hub template update to a new release with minimal migration work."
order: 4
---

This guide explains how **template adopters** (people who forked or copied
this repo and rebranded it) update to a new template release without painful
migrations. If you are a maintainer who wants to know how releases are made,
see [Contributing](../../../CONTRIBUTING.md).

> **The short version.** The template is designed so that the Machinery
> (routing, i18n, collection wiring, sync tooling) evolves upstream while your
> rebranding lives in a small set of config/content files. Upgrading is a
> `git merge` of the upstream release tag, plus one command
> (`npm run check:upstream`) that tells you exactly which files need a human
> decision. No zip re-download, no manual file-copying.

## Why a git merge works here

The repo is split into three tiers (see [Architecture](./architecture.md)):

| Tier | What lives there | Upgrade expectation |
|---|---|---|
| **Machinery** | `src/lib/`, `src/pages/`, `src/content.config.ts`, `src/env.d.ts`, `scripts/`, `skills/`, `.github/workflows/`, `astro.config.mjs`, `tsconfig.json` | You should **never hand-edit** these. They are the "one correct answer" code. |
| **Your site** | `site.config.ts` (the `site` block + `products` array), `src/config/copy.ts`, `src/components/*` (look), `src/styles/*`, `src/content/**` | Your rebranding lives here. Conflicts with upstream are expected and resolvable. |
| **Extensions** | `src/components/product-landing/<slug>.astro`, `src/styles/product-themes/<slug>.css`, `src/content/product-info/**`, the `examples/*` sample repos | Opt-in features; they copy forward without conflicts unless a Machinery interface changes. |

A release changes **Machinery** files. Your rebranding changes **Your-site**
files. A 3-way `git merge` reconciles the two sides cleanly - most releases
merge with zero conflicts because your changes and the upstream changes touch
different files.

## Prerequisites (do this once)

You must have the upstream repo as a git remote and the tag you started from:

```bash
git remote add upstream https://github.com/awareride/astro-content-hub.git
git fetch upstream --tags
```

If you started from a **zip download** (no git history), you cannot merge.
The fix is small: `git init`, commit your current tree, then add the upstream
remote and fetch. From then on every upgrade is a merge. See
[Starting from a zip](#starting-from-a-zip).

## Upgrading to a new release

```bash
# 1. Make sure your working tree is clean.
git status

# 2. Create an upgrade branch (never upgrade directly on main).
git checkout -b upgrade/v1.1.0

# 3. Merge the upstream release tag.
git merge upstream/v1.1.0
```

Then handle the result:

- **No conflicts** - the common case. Machinery merged in, your site files
  untouched. Run the verification below and merge the branch.
- **Conflicts** - they will be in **Your-site** files (`site.config.ts`,
  `copy.ts`, components, styles) because both sides touched them. This is
  expected; resolve each one by hand, keeping both your rebranding and the
  upstream change where sensible. Machinery conflicts mean you edited a
  Machinery file - see [If you edited Machinery](#if-you-edited-machinery).

### Verification

```bash
npm run check:upstream        # Machinery drift guard (byte-compare vs the release)
npm run build                 # type check + build must pass
```

`npm run check:upstream` compares every Machinery file in your tree against
the **newest release tag** (a `vX.Y.Z` tag; override with
`UPSTREAM_TAG=v1.1.0`). It reports:

- `MISSING` - a Machinery file shipped in the release is gone (you renamed or
  deleted it). Git merges do **not** flag this, and it can silently break the
  site (e.g. the index route disappearing).
- `DIFFERS` - a Machinery file differs from the release (you hand-edited it).
  Again, git may have merged without a conflict while silently dropping the
  upstream fix.
- `+` additions - contract-path files that are not in the release (adopter
  additions). These are allowed and listed for visibility only.

Any `MISSING`/`DIFFERS` means a human decision is required before the upgrade
is done. The command exits non-zero in that case.

> **Why this matters.** Git merge is good at merging *edits to the same file
> at the same path*, but it cannot detect that you renamed a Machinery file
> (the upstream path silently vanishes) or that you edited a Machinery file
> *before* an upstream change (git thinks it is already merged, and the
> upstream fix is dropped). `check:upstream` catches both by comparing bytes
> against the release, not by looking at merge history.

## If you edited Machinery

The contract is: **Machinery files have one correct answer, and the template
maintainers own it.** If `check:upstream` flags a Machinery file you edited:

1. Decide whether your edit is a **bug fix** that should go upstream - if so,
   open a PR to the template repo, and take the upstream version locally.
2. Or take the upstream version and re-apply your change as a small patch on
   top (documented in your upgrade commit).

Either way the goal is the same: after the upgrade, your Machinery files
byte-match the release, so the next upgrade is clean again.

## Starting from a zip

If you downloaded the repo as a zip instead of cloning:

```bash
git init
git add -A
git commit -m "initial import of astro-content-hub <version>"
git remote add upstream https://github.com/awareride/astro-content-hub.git
git fetch upstream --tags
```

Now `git merge upstream/<tag>` works exactly as above. The first upgrade may
produce more conflicts because your history starts at the zip snapshot, but
`npm run check:upstream` will tell you what needs attention.

## What a release contains

Template releases are tagged (`v1.0.0`, `v1.1.0`, ...). The release notes /
CHANGELOG list:

- **What changed** (features, fixes).
- **Which Machinery files changed** - if you never hand-edit those, the merge
  is routine.
- **Breaking changes** (if any) - always a major version bump, with migration
  steps.

Because the template follows [semver](https://semver.org/) and keeps the
documented contracts backward compatible (`Product`/`NavLink`/`FooterColumn`
interfaces, the `copy.ts` shape, CSS token names, the `.prose` class), your
`site.config.ts`, `copy.ts`, and styles keep working across releases. New
features are added as **optional fields** or new Extension files, so they do
not force a migration.

## Tips for frequent upgraders

- **`git rerere`** (reuse recorded resolution) remembers how you resolved a
  conflict, so repeated upgrades resolve themselves:
  `git config --global rerere.enabled true`.
- **Keep upgrade commits separate** from feature work. An upgrade branch per
  release (`upgrade/v1.1.0`) keeps the merge history readable.
- **Check `npm run check:upstream` before AND after** the merge. Before: it
  tells you the upgrade will be routine. After: it confirms nothing was lost.

## Related

- [Architecture](./architecture.md) - the Machinery / Your site / Extensions
  tier map.
- [Deployment](./deployment.md) - pointing the site at your infrastructure.
- [Authoring](./authoring.md) - writing content in the hub.
