+++
title = 'Video'
date = 2026-02-19T00:00:00Z
draft = false
authors = ['Sugam Pokharel']
toc = true
[build]
  list="never"
+++

Sugo does not ship a custom shortcode named `video`. For video embeds, use Hugo embedded shortcodes like `youtube` and `vimeo`.

## Shortcode Example

{{< codeblock lang="md" >}}
{{</* youtube 0RKpf3rK57I */>}}
{{</* vimeo 55073825 */>}}
{{< /codeblock >}}

## Actual Use

{{< youtube 0RKpf3rK57I >}}

{{< vimeo 55073825 >}}
