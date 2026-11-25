---
weight: 10
title: "Theme Documentation - typeit Shortcode"
date: 2020-03-03T10:29:41+08:00
lastmod: 2020-03-03T10:29:41+08:00
draft: false
author: "Dillon"
authorLink: "https://dillonzq.com"
description: "The typeit shortcode provides typing animation based on TypeIt library."
images: []
resources:
- name: "featured-image"
  src: "featured-image.png"

tags: ["shortcodes"]
categories: ["documentation"]

hiddenFromHomePage: true
---


The `typeit` shortcode provides typing animation based on [TypeIt](https://typeitjs.com/) library.

<!--more-->

Just insert your content in the `typeit` shortcode and that’s it.

The `typeit` shortcode has the following named parameters:

* **tag** *[optional]*

    HTML tag that wraps the typing content, default value is `div`.

* **class** *[optional]*

    Extra CSS class name(s) added to the typing element.

* **code** *[optional]*

    Code language used to highlight the content, see [Code Content](#code-content).

* **code-link** *[optional]*

    Only applies together with `code`. When enabled, a link written as `[text](url)` inside a highlighted token (such as a comment or string) is rendered as a clickable link.

* **group** *[optional]*

    Name of the group whose contents start typing in sequence, see [Group Content](#group-content).

## 1 Simple Content {#simple-content}

Simple content is allowed in `Markdown` format and **without** rich block content such as images and more...

Example `typeit` input:

```markdown
{{</* typeit */>}}
This is a *paragraph* with **typing animation** based on [TypeIt](https://typeitjs.com/)...
{{</* /typeit */>}}
