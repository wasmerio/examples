import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  // Every Markdown file in src/content/blog becomes /blog/<file-name>
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    author: z.string(),
    authorRole: z.string().optional(),
    /** Path to an image in /public, e.g. "/images/blog-ai-agents.webp" */
    image: z.string(),
    imageAlt: z.string(),
    tags: z.array(z.string()).default([]),
    /** Optional manual override; otherwise calculated from the word count. */
    readingTime: z.number().int().positive().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
