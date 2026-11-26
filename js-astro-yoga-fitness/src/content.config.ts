import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    /** Minutes. Calculated from the article length when omitted. */
    readingTime: z.number().int().positive().optional(),
    /** Path inside `public/`, e.g. `/images/blog-01.webp`. */
    image: z.string(),
    imageAlt: z.string(),
    author: z.string().default('Yoga Fitness Team'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
