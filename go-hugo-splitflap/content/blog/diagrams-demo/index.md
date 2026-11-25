---
title: "Mermaid Diagrams in the Splitflap Theme"
date: 2024-04-20
draft: false
description: "Demonstration of Mermaid diagram support: flowcharts, sequence diagrams, and pie charts — all styled with the Ayu color system."
tags: ["Mermaid", "Diagrams", "Hugo"]
toc: true
---


The theme loads Mermaid only on pages that contain at least one `mermaid` code block. Diagrams are re-rendered automatically when the visitor switches between Light, Mirage, and Dark — colors always match the active Ayu theme.

<!--more-->

{{< tldr >}}
Use standard fenced code blocks with the `mermaid` language tag. No shortcodes, no extra config — just write the diagram and Hugo handles the rest.
{{< /tldr >}}

## How it works

A Hugo render hook detects `mermaid` code blocks and sets a page-level flag (`hasMermaid`). The base template loads `mermaid.min.js` only when that flag is set, keeping every other page free of the library.

The theme configures Mermaid with `securityLevel: strict` and a custom `base` theme that maps the eight Ayu syntax colors to the diagram color scales.

{{< callout type="warning" title="Strict mode restrictions" >}}
Do not use HTML tags, angle brackets, or HTML entities inside node labels. Write plain text only — for example, use `A[my node]` not `A[<b>my node</b>]`.
{{< /callout >}}

## Flowchart

A simple request-handling pipeline:

```mermaid
flowchart TD
    A[Request received] --> B{Valid input?}
    B -->|Yes| C[Process data]
    B -->|No| D[Return error]
    C --> E[Build response]
    D --> E
    E --> F[Done]
```

## Sequence diagram

Browser, API, and database interaction:

```mermaid
sequenceDiagram
