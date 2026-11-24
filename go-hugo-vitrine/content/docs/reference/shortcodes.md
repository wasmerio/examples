---
title: Shortcodes
lead: The shortcodes Vitrine adds, and their options.
weight: 3
---


## example

Runs an example and shows its files. [The example shortcode](/docs/examples/example-shortcode/) explains it.

```md
{{</* example "demo" */>}}
{{</* example name="demo" title="A title" run="true" code="true" frame="true" */>}}
```

| Option | Default | |
|---|---|---|
| `name` (or the only positional value) | none | the folder with `example.html`, `style.css`, `script.js`: next to the page, or in `assets/examples/` |
| `title` | none | a title in the frame's label |
| `run` | `true` | `false`: show only the files |
| `code` | `true` | `false`: run without showing the files |
| `frame` | `true` | `false`: run bare, no frame and no files |

## tabs and tab

Content in variants, one shown at a time. [Tabs and callouts](/docs/writing/tabs-and-callouts/) has examples.

```md
{{</* tabs group="install" */>}}
{{</* tab "npm" */>}}Markdown{{</* /tab */>}}
{{</* tab "pnpm" */>}}Markdown{{</* /tab */>}}
{{</* /tabs */>}}
```

| Option | Default | |
|---|---|---|
| `tabs`: `group` | none | tab sets of the same group switch together, and the choice is remembered |
| `tab`: the positional value | none | the tab's label |

## callout

A note or a warning, in Markdown.

```md
