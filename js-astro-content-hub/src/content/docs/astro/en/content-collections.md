---
title: "Content Collections"
description: "Type-safe Markdown and data loading in Astro."
order: 2
---

Content collections let you organize Markdown and data files with a schema. Astro
validates frontmatter at build time and gives you typed entries.

Define a collection in `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({ title: z.string(), order: z.number().default(0) }),
});

export const collections = { docs };
```

Then query entries with `getCollection('docs')` and render them with
`render(entry)`. This template's docs are built exactly this way.
