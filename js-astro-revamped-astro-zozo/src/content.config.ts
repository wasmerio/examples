import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const hideElementValues = [
	'title',
	'date',
	'lastmod',
	'tags',
	'readingTime',
	'comments',
] as const;
const hideElements = z.enum(hideElementValues);
export type PostHideElements = (typeof hideElementValues)[number];
const galleryCategoryValues = ['illustration', 'life', 'view'] as const;
export type GalleryCategorySlug = (typeof galleryCategoryValues)[number];

const posts = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			slug: z.string().optional(),
			description: z.string().optional(),
			image: image().optional(),
			date: z.date().optional(),
			lastmod: z.date().optional(),
			hidden: z.boolean().optional(),
			tags: z.array(z.string()).optional(),
			readingTime: z
				.object({
					text: z.string(),
					time: z.number(),
					words: z.number(),
					minutes: z.number(),
				})
				.optional(),
			hide: z.array(hideElements).optional(),
		}),
});

const gallery = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			slug: z.string(),
			category: z.enum(galleryCategoryValues),
			eyebrow: z.string(),
			summary: z.string(),
			alt: z.string(),
			image: image(),
			sortOrder: z.number().default(0),
			year: z.string().optional(),
			location: z.string().optional(),
			credit: z.string().optional(),
			notesTitle: z.string().optional(),
			notes: z.array(z.string()).default([]),
			focusCharacters: z
				.array(
					z.object({
						id: z.string(),
						name: z.string(),
						role: z.string(),
						note: z.string(),
						portrait: image(),
						x: z.number(),
						y: z.number(),
						width: z.number(),
						height: z.number(),
						accent: z.string(),
					}),
				)
				.optional(),
		}),
});

export const collections = {
	posts,
	gallery,
};
