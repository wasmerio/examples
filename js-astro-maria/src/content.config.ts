import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*/index.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      summary: z.string(),
      year: z.number().int(),
      role: z.string(),
      services: z.array(z.string()).default([]),
      duration: z.string().optional(),
      team: z.string().optional(),
      cover: image(),
      coverAlt: z.string(),
      tint: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .default('#e9e9e3'),
      order: z.number().default(100),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      url: z.url().optional(),
    }),
});

export const collections = { work };
