---
title: "Getting Started with splitflap"
date: 2024-03-15
draft: false
description: "A walkthrough of the theme's main features: split-flap board, color themes, shortcodes, and content sections."
tags: ["Hugo", "Theme", "Setup"]
featured_image: "cover.png"
# toc: true
---


Welcome to **splitflap** — a Hugo theme centered on a split-flap display landing page, the Ayu color system, and the Monaspace typeface family.

<!--more-->

This post walks through the key moving parts so you can get your own site up and running quickly.

{{< tldr >}}
Copy `exampleSite/hugo.toml` to your project root, adjust `baseURL` and `params`, add content, and run `hugo server`.
{{< /tldr >}}

## The split-flap board

The landing page renders an animated split-flap display. Messages are configured in `hugo.toml` under `params.board.messages`:

```toml
[params.board]
  messages = [
    ['', '', 'HELLO WORLD', '', 'MY SITE', '', ''],
    ['', '', 'WELCOME', '', '', '', '']
  ]
```

Each message is an array of up to **7 lines**. Each line holds at most **20 characters**. Use only: `A-Z 0-9 . , - ! ? ' / :` and space — all uppercase.

{{< callout type="tip" title="Empty lines for centering" >}}
Pad messages with empty strings at the top and bottom to vertically center the text on the board.
{{< /callout >}}

## Color themes

Three themes are available: **Light**, **Mirage**, and **Dark**. The switcher in the header lets visitors change themes at any time; the choice is persisted in `localStorage`.

Set the default theme for first-time visitors in `hugo.toml`:

```toml
[params]
  defaultTheme = "light"   # light | mirage | dark
```
