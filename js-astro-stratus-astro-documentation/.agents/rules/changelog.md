---
description: Record releases as files in the changelog collection
globs: src/content/changelog/*.md
alwaysApply: true
---

# Changelog

**There is no `CHANGELOG.md`.** This is a documentation site and it publishes its
own changelog: one file per release in `src/content/changelog/`, rendered newest
first by `<Changelog />` on `/changelog/`. Shipping a release is adding a file.

**Do not keep a running list of unreleased changes.** Day-to-day work is recorded
in the commit message and the pull request body. Nothing goes in the collection
until someone cuts a release, so the published changelog never shows a version
that does not exist.

## Cutting a release

Add `src/content/changelog/<version>.md`, named for the version:

```yaml
---
version: 2.5.0
date: 2026-09-16
summary: >-
  Optional. One or two sentences on what the release is about, or an upgrade
  note. Sits between the version heading and the list.
changes:
  - tag: Added
    text: One line per change, written for a reader of the site.
  - tag: Fixed
    text: What now works that did not before.
---
```

`version` and `date` are required; `date` sorts the page, so it must be real.
`summary` is optional. Each `changes` entry is one line — the reasoning belongs
in the commit, not here.

Use these tags: **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**,
**Security**, and **Breaking** for a change that needs readers to act. Nothing
links a breaking entry to the page it affects — add an `Alert` there by hand if
it needs one.

Leave internal-only work — refactors, code style, test changes — out entirely.

Full authoring guide: [`docs-content-authoring`](../skills/docs-content-authoring/SKILL.md).
