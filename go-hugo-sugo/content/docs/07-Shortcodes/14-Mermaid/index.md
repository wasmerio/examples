+++
title = 'Mermaid'
date = 2026-02-19T00:00:00Z
draft = false
authors = ['Sugam Pokharel']
toc = true
[build]
  list="never"
+++

The `mermaid` shortcode renders Mermaid diagrams.

## Shortcode Example

{{< codeblock lang="md" >}}
{{</* mermaid */>}}
flowchart TD
  A[Write] --> B[Build]
  B --> C[Publish]
{{</* /mermaid */>}}
{{< /codeblock >}}

## Actual Use

{{< mermaid >}}
flowchart TD
  A[Write] --> B[Build]
  B --> C[Publish]
{{< /mermaid >}}
