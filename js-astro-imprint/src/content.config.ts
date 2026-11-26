import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string().optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    archived: z.boolean().optional().default(false),
    noindex: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
