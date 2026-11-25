---
title: About
author: Fabston
---


**Priam** is a a simple theme that supports a navigation menu, a home page, other single pages, lists of pages, blog posts, categories, tags, and RSS. That's it. Nothing fancy.

# config.yaml

For this example site, I defined permalinks for one section, `post`. This is optional, and it is up to your personal taste of URLs.

```yaml
permalinks:
  post: "/post/:slug/"
```

You can define the menu through `menu.main`, e.g.,

```yaml {linenos=table}
menu:
  main:
    - name: Home
      url: ""
      weight: 1
    - name: About
      url: "about/"
      weight: 2
    - name: Posts
      url: "post/"
      weight: 3
```

Alternatively, you can add `menu: main` to the YAML metadata of any of your pages, so that these pages will appear in the menu.

The page footer and description can be defined in `.Params` e.g.:

```yaml
params:
  description: "A minimal Hugo website"
  footer: "This theme is cool!"
```

The page author will be set in `.Author` e.g.:
