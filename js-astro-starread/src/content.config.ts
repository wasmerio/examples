import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: glob({ base: './src/content', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.coerce.date().optional(),
        categories: z.array(z.string()).optional(),
        cover: z.string().default('/defaultCover.jpg'),
        tags: z.array(z.string()).optional(),
        prev: z.string().nullable().optional(),
        next: z.string().nullable().optional(),
        lang: z.string().optional(),
      }),
  }),
};
