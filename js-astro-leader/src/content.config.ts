import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categories } from './config';

// The only list of category slugs is config.ts; renaming one there is a build
// error here rather than a silent colourless row.
const category = z.enum(categories.map((c) => c.slug) as [string, ...string[]]);

// A product on the shelf. Every field the index line needs is required: a row
// without a title or a category has nothing on one of its two ends.
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    category,
    // The line under the row, and the meta description when the body has no better one.
    summary: z.string().max(160),
    // 'building' dims the row, 'archived' drops it to its own group at the foot of /work.
    status: z.enum(['live', 'building', 'archived']).default('live'),
    started: z.coerce.date(), // only the year is ever printed
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number().int().optional(), // shelf order; without it the shelf is newest first
    draft: z.boolean().default(false),
  }),
});

// A note. `category` is required for the same reason as on work: the right end
// of the row is where the colour lives, and an uncategorised note breaks the column.
const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    category,
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    description: z.string().max(160).optional(),
    work: reference('work').optional(), // files the note under a product
    author: z.string().optional(), // falls back to site.author
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, notes };
