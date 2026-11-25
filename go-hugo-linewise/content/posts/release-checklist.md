---
title: "Release Checklist"
description: "Checks to run before tagging a Linewise theme release."
date: 2026-06-02
tags: ["reference", "release"]
---


Use this checklist before tagging a Hugo theme release.

## Pick the version

Choose the next semantic version, for example `0.2.0`.

There is no separate version file. The git tag is the source of truth for Linewise releases.

## Run checks

```sh
pnpm lint
pnpm format:check
pnpm build
pnpm test
```

## Review theme metadata

Check these files before tagging:

```text
theme.toml
go.mod
README.md
images/screenshot.png
exampleSite/content/posts/theme-reference.md
```

## Check upgrade notes

Document breaking changes when any of these change:

- public keys under `[params.linewise]`
- documented partial override points
- shortcodes
- generated route behavior
- `/search.json` shape
