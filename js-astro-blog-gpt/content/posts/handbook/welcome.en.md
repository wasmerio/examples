---
title: 'Meet BlogGPT'
slug: 'welcome'
date: 2026-10-16
description: 'Start with a feature map and reading order to build your first site.'
categories: ['guide']
tags: ['astro', 'design']
featured: true
image: '/images/covers/strata.webp'
---

BlogGPT is a static theme built with Astro. Each article introduces a group of features. Explore the interface first, or follow the reading order below.

## From a chat layout to a blog

The sidebar holds navigation, pinned articles and recent posts, while the main area presents the content. The homepage input finds articles, and reading pages retain familiar spacing and controls. Each entry has its own static address for bookmarks, subscriptions and sharing.

## Read in this order

| Stage                | Article                                                     | What you can do afterward                                     |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| Prepare content      | [Content organization](../content-bundle/)                  | Manage files, translations, attachments and writing templates |
| Start writing        | [Markdown typography](../markdown/)                         | Write text, lists, tables and code                            |
| Enrich content       | [Article enhancements](../article-enhancements/)            | Use callouts, math, diagrams and lightboxes                   |
| Control enhancements | [Per-entry enhancement switches](../enhancement-overrides/) | Override global enhancement defaults                          |
| Adjust reading pages | [Article display](../display-options/)                      | Choose which article details to show                          |
| Explore interactions | [Browsing and search](../design/)                           | Use search, outlines, commands, sharing and statistics        |
| Customize the site   | [Configuration and extensions](../configuration/)           | Set appearance, copy, navigation and global extensions        |
| Prepare to publish   | [Publishing and migration](../migration/)                   | Configure domains, visibility, feeds and deployment           |
| View the result      | [Reading sample](../reading-sample/)                        | Observe covers, long paragraphs, quotations and spacing       |

## Run locally first

```sh title="Terminal"
pnpm install
pnpm dev
```

Use local preview to edit content. Build the site to view production search indexes and share covers. Publishing steps are collected in “Publishing and migration”; the theme documentation in the repository covers individual fields.

## Keep your writing workflow

Theme settings and content are managed separately. Adjust navigation, descriptive copy and reading features, or add styles and scripts through global extension files. Content stays in local files and builds into a site ready for static hosting.
