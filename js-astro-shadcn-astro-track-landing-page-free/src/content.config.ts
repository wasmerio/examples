import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
    pubDate: z.string(),
    author: z.string().default('shadcn Studio'),
    avatarUrl: z.string().optional(),
    category: z.string().default('General'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false)
  })
})

export const collections = { blog }
