---
title: Customization
description: Describes common Browse theme configuration parameters that can be adjusted via config file or via Front
  Matter section.
lead: Describes common Browse theme configuration parameters that can be adjusted via config file or via Front Matter
  section.
date: 2022-01-24T14:00:00.000Z
thumbnail:
  src: "img/placeholder.png"
  visibility:
    - list
authorbox: false
sidebar: false
pager: false
weight: 2
menu: main
---


Customization page describes common Browse configuration parameters which can be specified via configuration file or
via Front Matter section. That includes logo section tuning, adding a sidebar with widgets, adjusting highlight color,
and more.

<!--more-->

This section will mainly cover customization settings that are unique to this theme. If something is not covered here,
there's a good chance it is covered somewhere in [Hugo docs](https://gohugo.io/documentation/).

### Logo

**Browse** allows you to set a custom logo in the site header. You may use text, or image, or both. Use the following
options in your site config:

```toml
[Params.logo]
  image = "img/placeholder.png"
  title = "Browse"
  subtitle = "Just another site"
```

**Note:** logo image will display at a maximum width of 128 pixels and a maximum height of 128 pixels
when you use text and image simultaneously. When the only logo image is active, it will display at a maximum height of
256 pixels. Ideally, your logo image should be SVG.

---

If you don't set any of these variables, the theme uses the site title as a logo title. Don't need a logo section?
Disable it this way:

```toml
[Params.logo]
  image = false
  title = false
  subtitle = false
```

### Highlight color
