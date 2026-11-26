
import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { blog } from '../schema/blog'

export const collections = {
	blog: defineCollection({
		loader: glob({
			pattern: '**\/[^_]*.{md,mdx}',
			base: './content/blog',
		}),
		schema: blog,
	})
}
