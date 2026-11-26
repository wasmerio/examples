import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const archives = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/archives'
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().optional().default(false),
    ogImage: z.string().optional()
  })
});

export const collections = { archives };
