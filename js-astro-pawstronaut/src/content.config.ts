import { defineCollection } from "astro:content";
import { z } from 'astro/zod';
import { file, glob } from "astro/loaders";

const cats = defineCollection({
	loader: file("src/data/cats.json"),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			breed: z.string(),
			gender: z.enum(["male", "female"]),
			age: z.number().min(0),
			birthDate: z.coerce.date().optional(),
			description: z.string().optional(),
			image: image(),
			listDate: z.coerce.date(),
			childFriendly: z.boolean().default(false),
			dogFriendly: z.boolean().default(false),
			catFriendly: z.boolean().default(false),
			outsideCat: z.boolean().default(false),
			sterilized: z.boolean().default(false),
		}),
});

const members = defineCollection({
	loader: file("src/data/members.json"),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			role: z.string(),
			image: image(),
			description: z.string(),
		}),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			slug: z.string(),
			image: image(),
			imageAlt: z.string(),
			excerpt: z.string().optional(),
			publishDate: z.coerce.date().default(new Date(2014, 0, 1)),
		}),
});

export const collections = { cats, members, blog };
