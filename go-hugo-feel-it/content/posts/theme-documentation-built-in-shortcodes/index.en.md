---
weight: 3
title: "Theme Documentation - Built-in Shortcodes"
date: 2020-03-04T16:29:41+08:00
lastmod: 2020-03-04T16:29:41+08:00
draft: false
author: "FeelIt"
authorLink: "https://feelit.khusika.id"
description: "Hugo provides multiple built-in shortcodes for author convenience and to keep your markdown content clean."
resources:
- name: "featured-image"
  src: "featured-image.webp"
- name: "featured-image-preview"
  src: "featured-image-preview.webp"

tags: ["shortcodes"]
categories: ["documentation"]

lightgallery: true
---


**Hugo** provides multiple built-in shortcodes for author convenience and to keep your markdown content clean.

<!--more-->

Hugo uses Markdown for its simple content format. However, there are a lot of things that Markdown doesn’t support well. You could use pure HTML to expand possibilities.

But this happens to be a bad idea. Everyone uses Markdown because it’s pure and simple to read even non-rendered. You should avoid HTML to keep it as simple as possible.

To avoid this limitations, Hugo created [shortcodes](https://gohugo.io/extras/shortcodes/).
A shortcode is a simple snippet that can generate reasonable HTML code and conforms to Markdown's design philosophy.

Hugo ships with a set of predefined shortcodes that represent very common usage. These shortcodes are provided for author convenience and to keep your markdown content clean.

## 1 figure {#figure}

[Documentation of `figure`](https://gohugo.io/content-management/shortcodes#figure)

Example `figure` input:

```markdown
{{</* figure src="/images/lighthouse.jpg" alt="/images/lighthouse.jpg" title="Lighthouse (figure)" */>}}
```

The rendered output looks like this:

{{< figure src="/images/lighthouse.jpg" alt="/images/lighthouse.jpg" title="Lighthouse (figure)" >}}

The HTML looks like this:

```html
<figure>
    <img src="/images/lighthouse.jpg" alt="/images/lighthouse.jpg" />
    <figcaption>
        <h4>Lighthouse (figure)</h4>
    </figcaption>
</figure>
```

