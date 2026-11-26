import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const BLOG_DIRECTORY: string = process.env.USE_FIXTURE_POSTS ? './src/tests/fixtures/blog' : './src/content/blog';

const blog = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: BLOG_DIRECTORY }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z
      .array(z.string())
      .default([])
      .transform((tags: string[]): string[] => [...new Set(tags)]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
