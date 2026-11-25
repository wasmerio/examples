---
title: "Shortcodes"
date: 2020-08-11
draft: false
description: "All the shortcodes available in theme."
slug: "shortcodes"
tags: ["shortcodes", "mermaid", "icon", "lead", "docs"]
series:
    - Extra
---


In addition to all the [default Hugo shortcodes](https://gohugo.io/content-management/shortcodes/), Compost adds a few extras for additional functionality.

## Alert

`alert` outputs its contents as a stylised message box within your article. It's useful for drawing attention to important information that you don't want the reader to miss.

The input is written in Markdown so you can format it however you please.

**Example:**

```md
{{</* alert */>}}
**Warning!** This action is destructive!
{{</* /alert */>}}
```

{{< alert >}}
**Warning!** This action is destructive!
{{< /alert >}}

## Badge

`badge` outputs a styled badge component which is useful for displaying metadata.

**Example:**

```md
{{</* badge */>}}
New article!
{{</* /badge */>}}
```

{{< badge >}}
New article!
{{< /badge >}}

## Button

