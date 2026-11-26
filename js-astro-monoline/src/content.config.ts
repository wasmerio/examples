import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One file per note. The filename is the URL: /notes/<filename>.
// Not fields, computed from the body: word count, reading time and the
// source gutter markers (src/lib/monoline-plugin.ts).
const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string().optional(), // absent: the first paragraph, shortened
    tags: z.array(z.string()).default([]), // the first one is the table's tag column
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
