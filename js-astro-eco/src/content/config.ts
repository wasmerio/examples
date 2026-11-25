import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const page = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
  }),
});

export const collections = { blog, page };