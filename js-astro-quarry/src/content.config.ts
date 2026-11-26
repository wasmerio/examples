import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pricing plans. One column each on /pricing, ordered by `order`.
const plans = defineCollection({
  loader: file('./src/content/plans.json'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    priceMonthly: z.number().nonnegative(),
    currency: z.string().default('USD'),
    features: z.array(z.string()).nonempty(), // printed in the plan column
    cta: z.object({ label: z.string(), href: z.string() }),
    featured: z.boolean().default(false), // one highlighted column
    order: z.number().int().positive(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(), // the name as it should be printed under the title
    draft: z.boolean().default(false),
  }),
});

export const collections = { plans, blog };
