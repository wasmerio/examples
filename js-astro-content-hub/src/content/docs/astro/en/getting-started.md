---
title: "Getting Started"
description: "Create a new Astro project and run the dev server."
order: 1
---

Scaffold a new project:

```bash
npm create astro@latest
```

Start the dev server:

```bash
npm run dev
```

Astro uses **file-based routing**: any `.astro` file in `src/pages/` becomes a
route. A `src/pages/index.astro` file maps to `/`.

Build the static site with:

```bash
npm run build
```

The output goes to `dist/`, ready to deploy as static files.
