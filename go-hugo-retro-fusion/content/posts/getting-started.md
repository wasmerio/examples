---
title: "Getting Started"
date: 2026-09-25
description: "Install the theme, point it at your content, and build your first page."
summary: "Three ways to install it, what to do if the theme folder is not where you want it, and the smallest config that works."
categories: ["Setup"]
tags: ["install", "setup", "git"]
series: ["Start Here"]
---


There is no build step. The theme is a folder of templates, one stylesheet and
one script, so installing it is copying a directory and naming it in your
config.

## Install it

Pick whichever suits you.

**Copy the directory** — simplest, and you can edit the theme in place:

```bash
cp -r retro-fusion /path/to/your-site/themes/
```

**Git submodule** — keeps the theme updatable with `git submodule update`:

```bash
cd /path/to/your-site
git submodule add https://github.com/you/retro-fusion themes/retro-fusion
```

**Hugo modules** — needs Go installed:

```bash
hugo mod init github.com/you/your-site
hugo mod get github.com/you/retro-fusion
```

Then name it in `hugo.toml`:

```toml
theme = "retro-fusion"
```

That is the whole install.

## The demo site is inside the theme

