import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.yml' }),
	schema: ({ image }) =>
		z.object({
			id: z.string(),
			name: z.string(),
			bio: z.string(),
			avatar: image().optional(),
			role: z.string().optional(),
			location: z.string().optional(),
			focus: z.string().optional(),
		}),
});

const socials = defineCollection({
	loader: file('src/content/socials.yml'),
	schema: z.object({
		id: z.string().optional(),
		label: z.string(),
		href: z.string(),
	}),
});

const projects = defineCollection({
	// Load Markdown and MDX files in the `src/content/projects/` directory.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

const site = defineCollection({
	loader: file('src/site-config.yml'),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		based: z.string().optional(),
		timezone: z.string().optional(),
		locale: z.string().optional(),
	}),
});

const testimonials = defineCollection({
	loader: glob({ base: './src/content/testimonials', pattern: '**/*.yml' }),
	schema: ({ image }) =>
		z.object({
			quote: z.string(),
			author: z.string(),
			role: z.string().optional(),
			avatar: image().optional(),
		}),
});

export const collections = { blog, socials, authors, projects, site, testimonials };
