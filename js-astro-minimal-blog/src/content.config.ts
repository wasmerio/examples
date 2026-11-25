import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { FRONTMATTER_TAGS } from './constants'

const zodEnum = <T>(arr: T[]): [T, ...T[]] => arr as [T, ...T[]]

const TAGS_NAMES = Array.from(FRONTMATTER_TAGS.keys())

const blog = defineCollection({
	loader: glob({ pattern: '**\/[^_]*.mdx', base: './content/blog' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		description: z.string(),
		date: z.date(),
		lastUpdated: z.date(),
		tags: z.array(z.enum(zodEnum(TAGS_NAMES))),
		image: z.string().optional(),
		searchIndex: z.boolean().optional().default(true),
	}),
})

export const collections = {
	blog,
}
