---
title: Build in Shortcodes
subtitle: Build in Hugo shortcodes
date: 2022-08-09T10:53:18+02:00
lastmod: 2022-08-09T10:53:18+02:00
draft: false
weight: 960
type: null

author: "author"
avatar: /img/me.png  # link to avatar file
authorLink: ""
description: "Descrizione da rivedere se è un doppione subtitle"

tags:
  - shortcodes
  - hugo

categories:
  - theme-usage

hiddenFromHomePage: false
hiddenFromSearch: false

resources:
  - name: featured-image
    src: build-in-shortcodes.webp

featured: false
sidebar: false
toc: true
math:
  enable: false
lightgallery: false
license: ""
slug: build-in-shortcodes
---



**Hugo** provides multiple built-in shortcodes for author convenience and to keep your markdown content clean.

Hugo uses Markdown for its simple content format. However, there are a lot of things that Markdown doesn’t support well. You could use pure HTML to expand possibilities.

But this happens to be a bad idea. Everyone uses Markdown because it’s pure and simple to read even non-rendered. You should avoid HTML to keep it as simple as possible.

To avoid this limitations, Hugo created [shortcodes](https://gohugo.io/extras/shortcodes/).
A shortcode is a simple snippet that can generate reasonable HTML code and conforms to Markdown's design philosophy.

Hugo ships with a set of predefined shortcodes that represent very common usage. These shortcodes are provided for author convenience and to keep your markdown content clean.

## 1 figure {#figure}

[Documentation of `figure`](https://gohugo.io/content-management/shortcodes#figure)

Example `figure` input:

```markdown
{{</* figure src="lighthouse.jpg" title="Lighthouse (figure)" width="690px" */>}}
```

The rendered output looks like this:

{{< figure src="lighthouse.jpg" title="Lighthouse (figure)" width="690px">}}

The HTML looks like this:

```html
<figure>
    <img src="/images/lighthouse.jpg"/>
    <figcaption>
        <h4>Lighthouse (figure)</h4>
    </figcaption>
</figure>
```

## 2 gist
