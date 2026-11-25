import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    category: z.enum(['tech', 'life']).default('tech'),
    author: z.string().default('Rowan Hale'),
    mathjax: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const trips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trips' }),
  schema: z.object({
    title: z.string(),
    place: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    heroImage: z.string(),
    gallery: z.array(z.string()).default([]),
    circlePhotos: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, trips };
