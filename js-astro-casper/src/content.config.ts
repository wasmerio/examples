import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    cover: z.string().optional().nullable(),
    date: z.union([z.date(), z.string()]),
    tags: z.preprocess(
      (val) => {
        if (!val) return [];
        if (typeof val === 'string') return [val];
        if (Array.isArray(val)) return val;
        return [];
      },
      z.array(z.string())
    ).default([]),
    class: z.string().optional(),
    subclass: z.string().optional(),
    author: reference('authors'), // Type-safe reference to an author document
    current: z.string().optional(),
    navigation: z.union([z.boolean(), z.string()]).optional(),
    layout: z.string().optional(),
    disqus: z.boolean().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    username: z.string(),
    name: z.string(),
    bio: z.string().optional(),
    picture: z.string().optional().nullable(),
    location: z.string().optional(),
    url: z.union([z.string(), z.boolean()]).optional(),
    url_full: z.union([z.string(), z.boolean()]).optional(),
    facebook: z.union([z.string(), z.boolean()]).optional(),
    twitter: z.union([z.string(), z.boolean()]).optional(),
    cover: z.union([z.string(), z.boolean()]).optional(),
  }),
});

const tags = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tags' }),
  schema: z.object({
    name: z.string(),
    description: z.union([z.string(), z.boolean()]).optional(),
    cover: z.union([z.string(), z.boolean()]).optional(),
  }),
});

export const collections = {
  posts,
  authors,
  tags,
};
