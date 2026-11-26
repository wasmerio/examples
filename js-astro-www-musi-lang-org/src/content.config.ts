import type { ContentConfig } from "astro:content";
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const musiBook = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./content/musi-book" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		group: z.string(),
		section: z.string(),
		order: z.number().int(),
		slug: z.string(),
		summary: z.string(),
		sourceTruth: z.string().optional(),
		examples: z.string().optional(),
	}),
});

export const collections: ContentConfig["collections"] = { musiBook };
