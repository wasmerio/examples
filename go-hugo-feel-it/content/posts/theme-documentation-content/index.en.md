---
weight: 2
title: "Theme Documentation - Content"
date: 2020-03-05T15:58:26+08:00
lastmod: 2020-03-05T15:58:26+08:00
draft: false
author: "FeelIt"
authorLink: "https://feelit.khusika.id"
description: "Find out how to create and organize your content quickly and intuitively in FeelIt theme."
resources:
- name: "featured-image"
  src: "featured-image.webp"
- name: "featured-image-preview"
  src: "featured-image-preview.webp"

tags: ["content", "Markdown"]
categories: ["documentation"]

lightgallery: true

toc:
  auto: false
math:
  enable: true
---


Find out how to create and organize your content quickly and intuitively in **FeelIt** theme.

<!--more-->

## 1 Contents Organization {#contents-organization}

A few suggestions to help you get a good looking site quickly:

* Keep post pages in the `content/posts` directory, for example: `content/posts/my-first-post.md`
* Keep other pages in the `content` directory, for example: `content/about.md`
* Local resources organization

{{< admonition note "Local Resource Reference" >}}
{{< version 0.2.10 >}}

There are three ways to reference local resources such as **images** and **music**:

1. Using [page resources](https://gohugo.io/content-management/page-resources/) in [page bundles](https://gohugo.io/content-management/page-bundles/).
   You can reference page resources by the value for `Resources.GetMatch` or the filepath of the resource relative to the page directory directly.
2. Store resources in the **assets** directory, which is `/assets` by default.
   The filepath of the resource to reference in the post is relative to the assets directory.
3. Store resources in the **static** directory, which is `/static` by default.
   The filepath of the resource to reference in the post is relative to the static directory.

The **priority** of references is also in the above order.

There are many places in the theme where the above local resource references can be used,
such as **links**, **images**, `image` shortcode, `music` shortcode and some params in the **front matter**.

Images in page resources or assets directory [processing](https://gohugo.io/content-management/image-processing/)
will be supported in the future.
It's really cool! :(fa-regular fa-grin-squint fa-fw):
{{< /admonition >}}

## 2 Front Matter {#front-matter}

**Hugo** allows you to add front matter in `yaml`, `toml` or `json` to your content files.

