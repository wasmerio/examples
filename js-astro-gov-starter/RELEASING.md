# Releasing

This starter is versioned so that anyone can pin a copy to a known-good
combination of Astro, Node, and USWDS. Every release is a git tag, a GitHub
Release, and a CHANGELOG entry that all agree with each other.

## What the version numbers promise

Full definitions live at the top of [CHANGELOG.md](./CHANGELOG.md). In short:

- **Major** — the Astro major version changed, the minimum Node version rose, or
  existing component markup/props/config changed in a way that needs edits in a
  project already built on this starter.
- **Minor** — new components, pages, collections, CI gates, or config options,
  with existing code untouched.
- **Patch** — fixes and dependency bumps within the same Astro major.

**A new Astro major always forces a new major here**, even if nothing else
changed. That is the point: someone who needs Astro 6 can clone `v1.x` and get a
tree that actually builds.

It does not follow that each Astro major gets only one line. A breaking change of
our own starts a new line too, so several lines can target the same Astro major —
`v2.x` and `v3.x` both target Astro 7. Every line still targets exactly one Astro
major; the compatibility table says which line is current for each.

The compatibility table in [README.md](./README.md#pick-a-release) must be
updated in the same commit as any major release.

## Cutting a release

Releases are cut from `main`, in two steps.

### 1. Land the release commit

On a branch, then merged to `main` through a PR:

- Bump `version` in `package.json`.
- In `CHANGELOG.md`, rename the `## [Unreleased]` section to
  `## [X.Y.Z] - YYYY-MM-DD` and add a fresh empty `## [Unreleased]` above it.
- Update the link reference definitions at the bottom of `CHANGELOG.md`.
- For a **major** release, also update the README compatibility table and the
  Astro version in the README's opening line.
- Run `pnpm ci:check` and make sure CI is green.

### 2. Publish

Either push the tag:

```bash
git checkout main && git pull
git tag v2.0.0
git push origin v2.0.0
```

...or, if you'd rather not tag locally, go to **Actions → Release → Run
workflow**, pick the branch, and enter `2.0.0`. The tag is created at that
branch's head.

> **The Actions tab only lists "Release" once `release.yml` is on `main`.**
> GitHub registers workflows from the default branch only, so a `workflow_dispatch`
> workflow that exists solely on a feature or release branch does not appear at
> all — and the branch dropdown cannot rescue it, because there is no workflow
> there to select. Pushing a tag has no such restriction: it runs the workflow
> from the tag's own tree. So on a branch whose `release.yml` has not reached
> `main` yet, tag the release rather than looking for it in the UI. Once the
> file is on `main`, the dropdown can target any branch, including `release/1.x`,
> and GitHub runs that branch's copy of the file.

Both paths run the same
[`.github/workflows/release.yml`](./.github/workflows/release.yml), which:

1. **Verifies the version matches `package.json`** and fails loudly if not, so
   a release can never claim a version the tree does not contain.
2. **Refuses to overwrite an existing release**, so a re-run cannot silently
   replace published notes.
3. **Extracts the release notes** from the matching `CHANGELOG.md` section via
   `scripts/changelog-section.mjs`, so the notes on the Releases page are the
   notes committed to the repo — there is no second copy to keep in sync. A
   version with no CHANGELOG section fails the run.
4. **Runs `astro check` and a full build** on the released commit. A release is
   a "use this exact commit" promise; it is proven before it is published.
5. **Publishes the GitHub Release** with a `.tar.gz` of the source.

A version containing a hyphen (`2.1.0-rc.1`) is published as a prerelease.

To preview the notes a tag would publish:

```bash
node scripts/changelog-section.mjs 2.0.0
```

## Writing release notes

The CHANGELOG section *is* the release notes, so write it for someone deciding
whether to adopt this release, not for someone reading the diff.

Every release section starts with the two facts a reader of this template needs
before anything else:

```markdown
## [2.0.0] - 2026-08-22

Targets **Astro 7**. Requires **Node.js 22.12 or newer**.
```

Then, as applicable, `### Added`, `### Changed`, `### Fixed`, `### Removed`,
`### Security` — the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
sections.

Additionally:

- **Every major release needs an `### Upgrading from N-1.x` section.** This is
  a template, not a dependency: adopters merge changes into their own fork, so
  spell out what they have to change in their copy, with diffs. If a change is
  silent — no error, just different output — say so explicitly and say how to
  detect it.
- **Say what did *not* change.** "No components, pages, routes, props, or
  content collection schemas changed" tells a reader more about their upgrade
  risk than a list of version bumps does.
- **Name concrete versions**, not "latest" — `Astro 6.1.7 → 7.2.4`.
- **Explain pins.** If a dependency is deliberately held back, say why, so the
  next person does not "fix" it.
- **Carry known issues forward.** A `### Known issues` section that survives
  across releases is better than an issue rediscovered by every adopter.

## Backporting to an older line

Older major lines get fixes only. Branch from the tag, fix, tag a patch:

```bash
git checkout -b release/1.x v1.0.0
# ... fix, bump package.json to 1.0.1, add a CHANGELOG section ...
git tag v1.0.1 && git push origin v1.0.1
```

The release workflow runs on any `v*` tag, so a backport publishes the same way.
Tag rather than reaching for the Actions tab here: an older line's `release.yml`
is not the copy on `main`, and per the note above, a run dispatched from the UI
uses the file from the branch you select, so keep each line's copy current if you
intend to dispatch from it.
