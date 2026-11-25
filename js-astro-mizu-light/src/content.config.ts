import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: () =>
		z.object({
			title: z.string(),
			pubDate: z.date(),
			author: z.string(),
			description: z.string(),
			image: z.string().optional(),
			thumbnail: z.string().optional()
		})
})

export const collections = {
	blog
}
