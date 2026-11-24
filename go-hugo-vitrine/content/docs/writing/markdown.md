---
title: Markdown
lead: Headings, links, code blocks, tables and images, and what Vitrine adds to each.
weight: 2
---


Vitrine uses Hugo's Markdown (CommonMark with GitHub's extensions: tables, task lists, strikethrough). A few elements
get extra behaviour through Hugo's render hooks.

## Headings

Start a page's chapters at `##`; the page's title is its `#`. Every `##` starts at a thin rule. Headings get a `#`
link to themselves, shown on hover, so readers can link to a chapter. `##` and `###` headings are listed in "On this
page".

## Links

```md
[Installation](/docs/getting-started/installation/)
[a chapter on this page](#code-blocks)
[the config file](hugo.toml)
[Hugo](https://gohugo.io/)
```

- A link to a page, written as its path in `content/`, becomes that page's address. It works with or without the
  trailing slash, and keeps working if your site lives under a subpath like `example.org/docs/`.
- A link to a file next to the page (in its page bundle) becomes the file's address.
- A path from the site's root to a file in `static/` gets the site's base path.
- A link to another site opens in a new tab, and screen readers hear "opens in a new tab".

## Code blocks

Fenced code gets a head with its language and a copy button:

```js
const answer = 42;
```

Name the file instead of the language with `file`:

````md
```js {file="script.js"}
const answer = 42;
```
