---
title: Tables and native components
date: 2026-01-12
summary: Simple and wide tables, scroll regions, and native details/summary.
tags: [basic, markdown]
---

This page covers tables and native HTML components. Simple tables can omit a caption; wide or complex tables should use a `Table: …` caption line.

# Tables

## Simple table (no caption)

| Item | Status |
| :--- | :--- |
| Simple table | Caption optional |

```md
| Item | Status |
| :--- | :--- |
| Simple table | Caption optional |
```

## Table with caption

Table: Markdown column alignment

|     Center      |         Right | Left           |
| :-------------: | ------------: | :------------- |
| Center (`:-:`)  | Right (`-:`)  | Left (`:-`)    |
| b               |      aaaaaaaaa | aaaa           |
| c               |           aaaa | a              |

```md
Table: Markdown column alignment

|     Center      |         Right | Left           |
| :-------------: | ------------: | :------------- |
| Center (`:-:`)  | Right (`-:`)  | Left (`:-`)    |
| b               |      aaaaaaaaa | aaaa           |
| c               |           aaaa | a              |
```

## Wide table

Table: Post list horizontal scroll demo

| Date | Title | Category | Tags | Status | Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-05-17 | Extended Markdown sample | Docs | markdown, style | Published | https://example.com/posts/markdown-style-example |
| 2026-05-18 | Pure CSS component test | UI | css, html, static | Draft | https://example.com/posts/css-only-components |

```md
Table: Post list horizontal scroll demo

| Date | Title | Category | Tags | Status | Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-05-17 | Extended Markdown sample | Docs | markdown, style | Published | https://example.com/posts/markdown-style-example |
| 2026-05-18 | Pure CSS component test | UI | css, html, static | Draft | https://example.com/posts/css-only-components |
```

## Native collapsible

<details>
<summary>Show more</summary>
Collapsible content using native HTML `<details>`.
</details>

```html
<details>
<summary>Show more</summary>
Collapsible content using native HTML `<details>`.
</details>
```
