+++
title = 'Codeblock'
date = 2026-02-19T00:00:00Z
draft = false
authors = ['Sugam Pokharel']
toc = true
[build]
  list="never"
+++

The `codeblock` shortcode renders syntax-highlighted code with a toolbar and copy button. It has a 'lang' field where you can enter the language that the code is in so that it will be highlighted according to its own syntax rules. 

## Shortcode Example

{{< codeblock lang="html" >}}
{{</* codeblock lang="bash" */>}}
npm run build
{{</* /codeblock */>}}
{{< /codeblock >}}

## Actual Use

{{< codeblock lang="shell" >}}
npm run build
{{< /codeblock >}}
