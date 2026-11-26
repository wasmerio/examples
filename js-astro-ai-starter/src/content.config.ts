import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().max(200),
			date: z.coerce.date(),
			updated: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			cover: image().optional(),
			coverAlt: z.string().optional(),
			draft: z.boolean().default(false),
			// AI extras per post. All default on; turn one off per post when it does not fit.
			ai: z
				.object({
					tldr: z.boolean().default(true),
					askAuthor: z.boolean().default(true),
					translate: z.boolean().default(true),
					quiz: z.boolean().default(false),
					readNext: z.boolean().default(true),
				})
				.default({ tldr: true, askAuthor: true, translate: true, quiz: false, readNext: true }),
			// Filled by `npm run ai:meta` when missing; you can also write them by hand.
			takeaways: z.array(z.string()).optional(),
		}),
});

export const collections = { blog };
