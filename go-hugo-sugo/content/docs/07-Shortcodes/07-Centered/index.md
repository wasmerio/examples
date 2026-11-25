+++
title = 'Centered'
date = 2026-02-19T00:00:00Z
draft = false
authors = ['Sugam Pokharel']
toc = true
[build]
  list="never"
+++

The `centered` shortcode wraps content in a centered block. There's also a [right](../16-Right/) shortcode but no left because left is the default rendering.  

## Shortcode Example

{{< codeblock lang="md" >}}
{{</* centered */>}}
This paragraph is centered.
{{</* /centered */>}}
{{< /codeblock >}}

## Actual Use

{{< centered >}}
This paragraph is centered.
{{< /centered >}}
