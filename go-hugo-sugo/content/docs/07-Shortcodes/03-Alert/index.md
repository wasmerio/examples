+++
title = 'Alert'
date = 2026-02-19T00:00:00Z
draft = false
authors = ['Sugam Pokharel']
toc = true
[build]
  list="never"
+++

The `alert` shortcode triggers a browser JavaScript alert with the shortcode inner text.

## Shortcode Example

{{< codeblock lang="html" >}}
{{</* alert */>}}This is a shortcode alert demo.{{</* /alert */>}}
{{< /codeblock >}}

## Actual Use

{{< alert >}}This is a shortcode alert demo.{{< /alert >}}

Well it wont show up here as other shortcodes but you must have seen the popup when opening the page. 