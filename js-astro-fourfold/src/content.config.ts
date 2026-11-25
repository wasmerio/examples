import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const locale = z.enum(['zh-cn', 'en']).default('zh-cn');
const common = {
  title: z.string(),
  description: z.string(),
  locale,
  translationKey: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  seoTitle: z.string().optional(),
  canonical: z.url().optional(),
  ogImage: z.string().optional(),
};

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    ...common,
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    column: z.string().optional(),
    columnOrder: z.number().optional(),
    minutes: z.number().positive().optional(),
    comments: z.boolean().default(false),
  }),
});

const columns = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/columns' }),
  schema: z.object({ ...common, slug: z.string().regex(/^[^/?#]+$/) }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    ...common,
    publishedAt: z.coerce.date(),
    status: z.enum(['active', 'maintained', 'archived', 'paused']).default('active'),
    type: z.string().default('project'),
    externalUrl: z.url().optional(),
    repositoryUrl: z.url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({
    ...common,
    publishedAt: z.coerce.date(),
    kind: z.string().default('note'),
    version: z.string().default('0.1'),
    tags: z.array(z.string()).default([]),
    paperUrl: z.url().optional(),
    codeUrl: z.url().optional(),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/photos' }),
  schema: z.object({
    ...common,
    slug: z.string().regex(/^[^/?#]+$/),
    cover: z.string().optional(),
    photos: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).default([]),
  }),
});

const links = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/links' }),
  schema: z.object({
    ...common,
    url: z.url(),
    group: z.string().default('常读'),
  }),
});

export const collections = { writing, columns, projects, research, photos, links };
