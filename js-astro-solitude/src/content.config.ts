import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const common = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    lastmod: z.coerce.date().optional(),
    slug: z.string().optional(),
    url: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    cover: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    series: z.array(z.string()).default([]),
    home: z.boolean().default(true),
    draft: z.boolean().default(false),
    sticky: z.union([z.boolean(), z.number()]).default(false),
    comment: z.boolean().default(true),
    aside: z.boolean().default(true),
    toc: z.boolean().default(true),
    random: z.boolean().default(true),
    type: z.string().optional(),
    not_cover: z.boolean().optional(),
  })
  .passthrough();
export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: common.extend({ date: z.coerce.date() }),
  }),
  pages: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: common,
  }),
};
