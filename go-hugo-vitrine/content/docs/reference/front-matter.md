---
title: Front matter
lead: The keys Vitrine reads at the top of a page, and the start page's own.
weight: 2
---


## Every page

| Key | What it does |
|---|---|
| `title` | the page's heading, its name in the browser tab and, unless `linkTitle` is set, in the sidebar, breadcrumbs and pager |
| `linkTitle` | a shorter name for the sidebar, breadcrumbs, pager and tabs |
| `weight` | the order among its siblings: lower first; pages without one come last |
| `lead` | the line under the title, in Markdown; also the page's description and its summary in lists and llms.txt |
| `description` | the description for search engines and link previews, if it should differ from `lead` |
| `math` | `true` loads MathJax for this page, `false` keeps it off when `params.math` is on |
| `draft` | `true` keeps the page out of the built site; `hugo server -D` shows it |

Hugo's own keys work as usual: `date`, `slug`, `url`, `aliases` (old addresses that redirect to the page) and
`build` (for example `build: { list: never }` to keep a page out of the sidebar).

```yaml
---
title: Configuration reference
linkTitle: Configuration
weight: 1
lead: Every setting, with its default.
---
```

## The start page

`content/_index.md` also reads:

| Key | What it does |
|---|---|
| `facts` | short labels in a row under the lead: `["4 kB gzip", "MIT"]` |
| `install` | a command in a code block with a copy button: `npm install my-lib` |
| `actions` | buttons: a list of `{ label, url }`; the first is filled. A `url` from your site is relative to its root (`docs/`), others are full addresses |

```yaml
---
title: my-lib
lead: What it does, in one or two sentences.
