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

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    organisation: z.string().optional(),
    role: z.string().optional(),
    duration: z.string().optional(),
    tools: z.array(z.string()).default([]),
    publishedAt: z.string(),
    image: z.string().optional(),
    heroImage: z.string().optional(),
    logo: z.string().optional()
  })
})

export const collections = { blog, 'case-studies': caseStudies }
