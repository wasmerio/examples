import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A `slug` in frontmatter overrides the entry id, which is the note's URL
const notes = defineCollection({
  loader: glob({
    base: './src/content/notes',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    published: z.boolean().default(false),
  }),
});

export const collections = { notes };
