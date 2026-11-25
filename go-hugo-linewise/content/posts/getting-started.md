---
title: "Getting Started with Linewise"
description: "How to install, configure, and write your first post."
date: 2026-06-09
tags: ["meta", "hugo"]
---


Linewise is a Hugo theme. Your site owns the content, config, and branding; the theme owns the layouts, styles, and interaction model.

## Installation

Create a Hugo site:

```sh
hugo new site my-blog
cd my-blog
```

Then choose one installation mode.

### Git submodule

Add Linewise under `themes/linewise`:

```sh
git submodule add https://github.com/tabsp/linewise themes/linewise
```

Configure Hugo with `theme = "linewise"`:

```toml
baseURL = "https://example.com"
title = "My Blog"
locale = "en"
theme = "linewise"
```

### Hugo Module

Initialize module support in your site:

```sh
hugo mod init github.com/you/my-blog
```

