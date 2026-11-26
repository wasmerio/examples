import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
    loader: glob({base: './src/content/blog', pattern: '**/*.md'}),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        pubDate: z.coerce.date(),
        modifyDate: z.coerce.date().optional(),
    }),
})

export const collections = { blog }
