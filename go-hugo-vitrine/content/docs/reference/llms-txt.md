---
title: llms.txt
lead: Your docs as plain Markdown for AI assistants, generated with every build.
weight: 4
---


## What Vitrine publishes

With every build, Vitrine writes three kinds of files next to your pages:

| File | What it holds |
|---|---|
| `/llms.txt` | your site's title and description, then a list per section of its pages, each with its lead and a link to its Markdown copy, in the sidebar's order: the format proposed at [llmstxt.org](https://llmstxt.org/) |
| `/llms-full.txt` | every page's Markdown in one file, in the same order |
| `/<page>/index.md` | each page's title, lead and Markdown source |

Every page also names its Markdown copy in its head:

```html
<link rel="alternate" type="text/markdown" href="/docs/reference/llms-txt/index.md">
```

See this site's [llms.txt](/llms.txt) and [llms-full.txt](/llms-full.txt).

## Using them

Point your assistant at the file that fits:

- **llms.txt** when it can follow links: it reads the list and fetches the pages it needs.
- **llms-full.txt** when you paste or attach the whole documentation, or for a tool that reads a single address.
- **A page's `index.md`** for one topic.

Shortcodes appear in the Markdown as you wrote them (`{{</* tabs */>}}`, `{{</* example "demo" */>}}`). Assistants
read them well enough, but an example's files aren't in the Markdown copy; describe what an example shows in the
page's text.

## Turning them off

```toml {file="hugo.toml"}
[params]
  llms = false
```

