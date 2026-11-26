import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: 'welcome.md', base: './src/content/blog' }),
  schema: z.object({ title: z.string(), category: z.string(), description: z.string().optional(), date: z.date(), tags: z.array(z.string()).optional(), draft: z.boolean().default(false), image: z.string().optional(), image_alt: z.string().optional(), author: z.string().optional() }),
});
const wiki = defineCollection({
  loader: glob({ pattern: 'starter.md', base: './src/content/wiki/iluminacion' }),
  schema: z.object({ title: z.string(), category: z.string(), shortDefinition: z.string(), aliases: z.array(z.string()).default([]), relatedTerms: z.array(z.string()).default([]), relatedArticles: z.array(z.string()).default([]), sources: z.array(z.object({ publisher: z.string(), title: z.string().optional(), url: z.string().url() })).default([]), draft: z.boolean().default(false), description: z.string().optional(), keywords: z.array(z.string()).default([]) }),
});
export const collections = { blog, wiki };
