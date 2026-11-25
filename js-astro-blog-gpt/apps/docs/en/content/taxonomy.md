# Categories, Tags, and Pages

Beyond blog posts, BlogGPT supports three additional content collections under `content/`: **categories**, **tags**, and **standalone pages**.

## Categories and Tags

When you assign `categories: [frontend]` or `tags: [astro, css]` in a post's frontmatter, BlogGPT automatically groups those posts on `/categories/frontend`, `/tags/astro`, and `/tags/css`.

By default, an unconfigured category or tag displays its raw slug (`frontend`). To customize its display name, description, cover image, or multi-language translations, create a Markdown file in `content/categories/` or `content/tags/`:

```markdown
---
title: Frontend Engineering
description: Deep dives into modern web frameworks, CSS architecture, and browser performance.
image: /images/categories/frontend.webp
coverStyle: background
---

Optional introductory Markdown text rendered at the top of the category archive page.
```

You can also scaffold category and tag definition files with the CLI:

```bash
pnpm new category frontend --title "Frontend Engineering"
pnpm new tag astro --title "Astro"
```

## Standalone Pages (`content/pages/`)

Use `content/pages/` for timeless standalone pages such as **About (`/about`)**, **Now (`/now`)**, **Uses (`/uses`)**, or a **Changelog (`/changelog`)**.

```bash
pnpm new page about --title "About Me"
```

### Linking a Page in the Sidebar

Creating a file at `content/pages/about.md` makes it live at `/about`. To add a link to it in the sidebar navigation, add an entry to `sidebar.items` or `sidebar.menu` in `blog.config.ts` (see [Navigation, Author, and Friends](../config/navigation.md)).

If you want a standalone page to be reachable only via its direct URL without appearing in site listings or search indexes, add `hidden: true` to its frontmatter.
