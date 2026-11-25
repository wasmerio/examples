---
title: Vitrine
description: "Vitrine is a Hugo theme for documentation: tabs, a two-level sidebar, llms.txt, and examples that run on the page next to their code."
lead: A Hugo theme for documentation, with examples that run on the page next to their code.
facts: ["Hugo 0.146 or newer", "No JavaScript framework", "llms.txt", "MIT licence"]
install: hugo mod get github.com/maxfettinger/vitrine
actions:
  - { label: Get started, url: docs/getting-started/ }
  - { label: Examples, url: examples/ }
  - { label: GitHub, url: "https://github.com/maxfettinger/vitrine" }
---


## A live example

The walk below runs on this page. Under it are the files it's made of, exactly as they run: no build step, and no
second copy of the code to keep in sync.

{{< example name="walk" title="A random walk" >}}

## What you get

**Examples that run.** A folder with `example.html`, and optionally `style.css` and `script.js`, becomes a live demo
with its files in tabs below it. Its CSS is scoped to the example, its script runs as a module, and an import map
lets the script import a library by its npm name. See [Live examples](/docs/examples/).

**Navigation.** Tabs across the top for the site's sections, a two-level sidebar for the section you're in, "On this
page" on the right, previous and next at the bottom. See [Pages and navigation](/docs/writing/pages-and-navigation/).

**Docs for AI assistants.** `llms.txt`, `llms-full.txt` and a Markdown copy of every page, with no setup. See
[llms.txt](/docs/reference/llms-txt/).

**Small.** Plain CSS and one small script, no framework and no Node build. Hugo does everything.

