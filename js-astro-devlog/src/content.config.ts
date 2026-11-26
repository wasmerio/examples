import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import siteConfig from './config/site';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    category: z.enum(['Tech', 'Design', 'Story', 'Architecture', 'Culture']),
    tags: z.array(z.string()).default([]),
    author: z.string().default(siteConfig.author.name),
    issueNumber: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };


