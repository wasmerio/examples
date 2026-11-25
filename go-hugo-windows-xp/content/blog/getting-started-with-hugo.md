---
title: "Getting Started with Hugo"
date: 2025-02-20
tags: ["hugo", "tutorial"]
Summary: "A quick guide to setting up your first Hugo site."
---


Hugo is one of the fastest static site generators available. Here's how to get started.

## Installation

Install Hugo using your package manager:

```bash
# macOS
brew install hugo

# Ubuntu/Debian
sudo apt install hugo

# Windows
choco install hugo-extended
```

## Create a new site

```bash
hugo new site my-website
cd my-website
```

## Add this theme

```bash
git submodule add https://github.com/probonas/hugo-theme-windowsxp.git themes/hugo-theme-windowsxp
```

Then set `theme = 'hugo-theme-windowsxp'` in your `hugo.toml`.

## Start the dev server

```bash
hugo server -D
```

