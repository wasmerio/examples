---
title: "Getting started"
description: "Install the theme, add the config it requires, and publish."
weight: 1
date: 2026-07-27
---


Northlight needs Hugo **extended** 0.164.0 or newer and nothing else. No Node, no npm, no
CSS framework, no build step beyond Hugo itself.

## Install

As a submodule, which is the route that needs no Go toolchain:

```bash {file="terminal"}
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/mortennordbye/northlight.git themes/northlight
```

Or as a Hugo Module, if you already use them:

```toml {file="hugo.toml"}
[module]
  [[module.imports]]
    path = "github.com/mortennordbye/northlight"
```

Then point the site at it:

```toml {file="hugo.toml"}
theme = "northlight"
```

## Required configuration

Four settings the theme cannot work without, and each fails in a way that looks like a
theme bug if you skip it.

```toml {file="hugo.toml"}
[markup.highlight]
  noClasses = false          # Chroma emits CSS classes, which the theme styles.
                             # Leave it true and every code block renders unstyled.

