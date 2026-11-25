---
title: 'Setup'
---


# Setup

This document shows a brief guide to setup hugo-theme-monochrome in your hugo project.

## Quick Start

### Install Hugo

You need "extended" version of hugo to support SASS. Checkout [Install Hugo](https://gohugo.io/getting-started/installing/) for more details.

Take Linux for example:

```bash
snap install hugo --channel=extended
```

> The minimum hugo version that hugo-theme-monochrome required is `0.146.0`

### Create a New Site

```bash
hugo new site <project name>
```

### Add a Theme

```bash
cd <project name>
git init
git submodule add https://github.com/kaiiiz/hugo-theme-monochrome.git themes/hugo-theme-monochrome
```

Then add `theme = "hugo-theme-monochrome"` to your `hugo.toml`

### Customize the Theme

See [Configuration](/hugo-theme-monochrome/configuration/).

