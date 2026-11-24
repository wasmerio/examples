---
title: Roadmap
lead: What Vitrine doesn't do yet, and might, if people need it.
weight: 3
---


Vitrine 1.0 does what its own docs and a small library's docs need. These are left out on purpose for now; open an
[issue](https://github.com/maxfettinger/vitrine/issues) if you need one, and say what for.

| Feature | Notes |
|---|---|
| Search | most likely with [Pagefind](https://pagefind.app/), which indexes the built site and needs no server |
| Translations | the theme's own words ("On this page", "Previous", "Edit this page") are English; Hugo's i18n files would make them translatable, and multilingual sites possible |
| A third sidebar level | the sidebar shows two levels |
| Versioned docs | one site per version works today, with a link between them; a version menu is not built in |
| Last updated dates | from Git (`enableGitInfo`), under each page |
| An announcement banner | today: the body-end hook |
| Diagrams | Mermaid, as a code block render hook |
| "Copy page" button | the page's Markdown copy to the clipboard, for pasting into an assistant |

Already there but easy to miss: [llms.txt](/docs/reference/llms-txt/), [maths](/docs/writing/maths/),
[hooks and your own CSS](/docs/guides/customizing/).

