---
title: "内容集合"
description: "Astro 中带类型安全的 Markdown 与数据加载。"
order: 2
---

内容集合让你用 schema 来组织 Markdown 与数据文件。Astro 在构建时校验 frontmatter,
并为你提供带类型的条目。

在 `src/content.config.ts` 中定义集合:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({ title: z.string(), order: z.number().default(0) }),
});

export const collections = { docs };
```

随后用 `getCollection('docs')` 查询条目,并用 `render(entry)` 渲染。本模板的文档正是
以这种方式构建的。
