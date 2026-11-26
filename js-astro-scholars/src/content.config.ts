import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const externalLink = z
	.object({
		label: text,
		href: z.url({
			protocol: /^https?$/,
			message: 'Resource links must use an absolute HTTP(S) URL'
		})
	})
	.strict();
const metadata = z.object({ label: text, value: text }).strict();

const posts = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: './src/content/posts'
	}),
	schema: ({ image }) =>
		z
			.object({
				title: text,
				description: text,
				publishedAt: z.coerce.date(),
				updatedAt: z.coerce.date().optional(),
				tags: z.array(text).default([]),
				featured: z.boolean().default(false),
				heroImage: image().optional(),
				heroImageAlt: text.optional(),
				draft: z.boolean().default(false)
			})
			.superRefine((data, ctx) => {
				if (data.heroImage && !data.heroImageAlt) {
					ctx.addIssue({
						code: 'custom',
						path: ['heroImageAlt'],
						message: 'heroImageAlt is required when heroImage is set'
					});
				}
			})
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: ({ image }) =>
		z
			.object({
				title: text,
				summary: text,
				status: z.enum(['active', 'past', 'unspecified']),
				period: text,
				order: z.number().int().nonnegative(),
				subtitle: text.optional(),
				featured: z.boolean().default(false),
				draft: z.boolean().default(false),
				cover: image().optional(),
				coverAlt: text.optional(),
				badges: z.array(text).default([]),
				tech: z.array(text).default([]),
				highlights: z.array(text).default([]),
				metadata: z.array(metadata).default([]),
				links: z.array(externalLink).default([])
			})
			.superRefine((data, ctx) => {
				if (data.cover && !data.coverAlt) {
					ctx.addIssue({
						code: 'custom',
						path: ['coverAlt'],
						message: 'coverAlt is required when cover is set'
					});
				}
			})
});

const teaching = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/teaching' }),
	schema: ({ image }) =>
		z
			.object({
				title: text,
				code: text,
				summary: text,
				term: text,
				status: z.enum(['current', 'recent', 'past']),
				order: z.number().int().nonnegative(),
				draft: z.boolean().default(false),
				cover: image().optional(),
				coverAlt: text.optional(),
				badges: z.array(text).default([]),
				tags: z.array(text).default([]),
				highlights: z.array(text).default([]),
				links: z.array(externalLink).default([])
			})
			.superRefine((data, ctx) => {
				if (data.cover && !data.coverAlt) {
					ctx.addIssue({
						code: 'custom',
						path: ['coverAlt'],
						message: 'coverAlt is required when cover is set'
					});
				}
			})
});

export const collections = { posts, projects, teaching };
