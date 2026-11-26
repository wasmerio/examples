---
tagline: "The web framework for content-driven websites."
description: "Astro is a modern static site generator that ships zero JavaScript by default and lets you use any UI framework."
highlights:
  - label: "License"
    value: "MIT"
  - label: "UI Frameworks"
    value: "React, Vue, Svelte"
install: |
  npm create astro@latest
features:
  - title: "Islands by default"
    body: "Ship interactive components only where needed. Everything else is static HTML, so pages stay fast."
  - title: "Framework agnostic"
    body: "Bring React, Vue, Svelte, Solid, or Preact. Astro renders them to HTML at build time."
  - title: "Content collections"
    body: "Type-safe Markdown and MDX with validated frontmatter, typed APIs, and fast incremental builds."
links:
  - label: "Website"
    href: "https://astro.build"
---

Astro is a static site generator that prioritizes content-driven websites:
blogs, docs, portfolios, and marketing sites. It compiles to HTML by default
and lets you opt into client-side interactivity only where it matters.

## Why content-driven?

Most pages on the web are mostly static. Astro embraces this: render to HTML
at build time, and hydrate interactive "islands" individually. The result is
smaller payloads and faster pages without giving up rich UI.

```bash
# Create a new project
npm create astro@latest
```
