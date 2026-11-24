---
title: "Upgrading Linewise"
description: "How to update the Hugo theme without mixing it with your content."
date: 2026-06-03
tags: ["reference"]
---


Linewise ships as a Hugo theme. Your posts and site configuration stay in your Hugo site; theme code lives under `themes/linewise` or in a Hugo module.

## If installed as a git submodule

Update the theme repository:

```sh
cd themes/linewise
git fetch --tags
git checkout v0.2.0
cd ../..
hugo
```

Then commit the submodule pointer from your site repository:

```sh
git add themes/linewise
git commit -m "chore: update linewise theme"
```

## If installed as a Hugo module

Update the module version:

```sh
hugo mod get github.com/tabsp/linewise@v0.2.0
hugo mod tidy
hugo
```

## What to review

Theme upgrades should not touch your content files. Review these areas after updating:

- `hugo.toml`, especially `[params.linewise]`
- any local layout overrides
- any custom CSS in your site
