import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			coverImage: z.union([image(), z.string().url()]),
			tags: z.array(z.string()),
			author: z.string(),
			avatar: image(),
			excerpt: z.string().optional(),
			publishedDate: z.date().transform((date) =>
				date.toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
				}),
			),
		}),
});

export const collections = {
	blogs: postsCollection,
};
