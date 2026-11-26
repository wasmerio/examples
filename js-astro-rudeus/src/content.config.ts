import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const posts = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './src/content/posts',
    }),
    schema: z.object({
        title: z.string(),
        category: z.string().optional(),
        description: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default('博主'),
        tags: z.array(z.string()).default([]),
        image: z.string().optional(),
        alias: z
            .preprocess((value) => {
                if (value == null) return []
                return Array.isArray(value) ? value : [value]
            }, z.array(z.string()))
            .optional(),
    }),
})

const zone = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdx}',
        base: './src/content/zone',
    }),
    schema: z.object({
        title: z.string().optional(),
        pubDate: z.coerce.date(),
    }),
})

export const collections = { posts, zone }
