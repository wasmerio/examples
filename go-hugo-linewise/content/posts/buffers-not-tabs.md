---
title: "Buffers, Not Tabs"
description: "Why Linewise starts from Vim's buffer model instead of a terminal skin."
date: 2026-06-08
lastmod: 2026-06-08
tags: ["design", "vim"]
---


Most blog themes think in pages. Linewise thinks in buffers.

That small shift changes the interface. A homepage becomes `:ls`, a posts list becomes `:oldfiles`, tags become marks, and search behaves like `:find` feeding a quickfix list.

## Spatial model

The browser viewport is treated as an editor frame. Each region has a Vim name and a specific job:

| Region          | Role                                                 |
| --------------- | ---------------------------------------------------- |
| `command-bar`   | The command-line area and top-level navigation       |
| `file-explorer` | A compact tree exposing the blog's content structure |
| `bufferline`    | The visible set of open/recent buffers               |
| `workspace`     | The active window inside the main editor column      |
| `status-line`   | Mode, current buffer, context, and progress          |

The default desktop layout arranges these like a windowed editor:

```text
Editor Frame
├─ Command Line
├─ Editor Body
│  ├─ File Explorer
│  │  ├─ posts
│  │  ├─ tags
│  │  └─ find
│  └─ Editor Main
│     ├─ Bufferline
│     └─ Active Buffer
└─ Statusline
```

{{< aside title="Mobile" >}}
On mobile, the file explorer becomes a drawer opened from the command bar. The bufferline remains visible and horizontally scrollable.
{{< /aside >}}

## The bufferline

