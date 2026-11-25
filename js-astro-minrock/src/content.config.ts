import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]).transform((tags) => [...new Set(tags)]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    audio: z.boolean().default(true),
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string().default('General'),
    tags: z.array(z.string()).default([]).transform((tags) => [...new Set(tags)]),
    stars: z.number().default(0),
    repoUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    emoji: z.string().default('📦'),
    featured: z.boolean().default(false),
  })
});

export const collections = { blog, projects };
