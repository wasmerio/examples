+++
title = 'Text-Font'
date = 2026-02-19T00:00:00Z
draft = false
authors = ['Sugam Pokharel']
toc = true
[build]
  list="never"
+++

The `text-font` shortcode applies custom font family and/or size for a content block.

Params:
- `family`
- `size`

## Shortcode Example

{{< codeblock lang="md" >}}
{{</* text-font family="Georgia, serif" size="4rem" */>}}
This line uses custom font settings.
{{</* /text-font */>}}
{{< /codeblock >}}

## Actual Use

{{< text-font family="Georgia, serif" size="4rem" >}}
This line uses custom font settings.
{{< /text-font >}}
