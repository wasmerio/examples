import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      thumbnail: image().optional(),
      category: z.object({
        slug: z.string(),
        title: z.string(),
      }),
      author: z.object({
        slug: z.string(),
        name: z.string(),
      }),
    }),
});

const service = defineCollection({
  loader: glob({
    base: './src/content/service',
    pattern: '**/*.{md,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      thumbnail: image().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
    }),
});

const team = defineCollection({
  loader: glob({
    base: './src/content/team',
    pattern: '**/*.{md,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      thumbnail: image().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      rating: z.number().default(5)
    }),
});

export const collections = {
  blog,
  service,
  team
};