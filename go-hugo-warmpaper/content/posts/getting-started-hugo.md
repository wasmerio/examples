---
title: "Getting Started with Hugo"
date: 2026-05-20
tags: ["Hugo", "Tutorial", "Web"]
categories: ["Technology"]
---


Hugo is one of the fastest static site generators available. This guide will help you get started.

## Installation

First, install Hugo on your system.

### macOS

```bash
brew install hugo
```

### Windows

```bash
choco install hugo-extended
```

### Linux

```bash
snap install hugo
```

## Creating a New Site

```bash
hugo new site my-blog
cd my-blog
git init
```

## Adding a Theme

```bash
git submodule add https://github.com/finch-xu/hexo-theme-warmpaper.git themes/warmpaper
```

