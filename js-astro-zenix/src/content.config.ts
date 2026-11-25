import { z, defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: reference('authors'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const authorCollection = defineCollection({
  loader: glob({ pattern: "**/*.{json,yaml,md}", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    bio: z.string(),
    twitter: z.string().optional(),
    github: z.string().optional(),
  }),
});

const changelogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/changelog" }),
  schema: z.object({
    version: z.string(),
    date: z.date(),
    title: z.string(),
    type: z.enum(['major', 'minor', 'patch']).default('minor'),
  }),
});

export const collections = {
  'blog': blogCollection,
  'changelog': changelogCollection,
  'authors': authorCollection,
};
