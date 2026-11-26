import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.boolean().default(true),
    date: z.coerce.date(),
    author: z.string().default('amirdaraee'),
    photo: z.string().optional(),
    imgCredit: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    language: z.string().default('en'),
  }),
});

export const collections = { blog };
