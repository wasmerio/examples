# Content

This directory holds all content collection source files (Markdown, MDX, JSON, YAML).

## Structure

Each subdirectory maps to a collection defined in `src/content.config.ts`:

```text
src/content/
  blog/          ← matches the `blog` collection in content.config.ts
    getting-started-with-this-starter.mdx
    my-post.mdx
```

## Adding a new collection

1. Create a subdirectory here (e.g. `src/content/projects/`)
2. Add a matching `defineCollection()` entry in `src/content.config.ts`
3. Run `astro dev` — Astro regenerates `.astro/types.d.ts` with full type safety

## Querying collections in pages

```astro
---
import { getCollection } from 'astro:content';

// Returns all non-draft entries, sorted by date
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---
```

Docs: https://docs.astro.build/en/guides/content-collections/
