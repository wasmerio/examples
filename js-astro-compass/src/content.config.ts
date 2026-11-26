import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { docsCategorySlugs } from './lib/docs';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      category: z.enum(docsCategorySlugs),
      tags: z.array(z.string()).optional().default([]),
      status: z.enum(['draft', 'published', 'deprecated', 'archived']).optional(),
      author: z.string().optional(),
      editUrl: z.string().optional(),
      heroImage: image().optional(),
      hideFromSearch: z.boolean().optional().default(false),
      redirectFrom: z.array(z.string()).optional().default([]),
      relatedLinks: z
        .array(
          z.object({
            title: z.string(),
            href: z.string(),
            description: z.string().optional(),
            eyebrow: z.string().optional(),
          }),
        )
        .optional()
        .default([]),
      order: z.number().optional().default(100),
      updatedAt: z.coerce.date().optional(),
    }),
});

export const collections = { docs };
