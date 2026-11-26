/*
This file is used to define the schema for your content collections.
You shouldn't have to update too much here, but you can add additional fields or override defaults if needed.
https://docs.astro.build/en/guides/content-collections/
*/

import { SITE, COLLECTION_NAMES_LIST } from "./alkaline.config";
// @ts-ignore
import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders'

const collectionNames = COLLECTION_NAMES_LIST;

// base schema for all collections
const postCollectionSchema = {
	authorId: z.number().default(1),
	authorContact: z.string().optional(),
	title: z.string(),
	subtitle: z.string().optional(),
	description: z.string().default(SITE.description || ""),
	pubDatetime: z
		.date()
		.or(z.string().transform((str: string) => new Date(str)))
		.optional(),
	modDatetime: z
		.date()
		.or(z.string().transform((str: string) => new Date(str)))
		.optional(),
	isFeatured: z.boolean().optional(),
	isDraft: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	image: z
		.object({
			src: z.string(),
			alt: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
			format: z.enum(["webp", "jpg", "png", "svg"]).optional(),
			quality: z.number().min(0).max(100).optional(),
		})
		.optional(),
	canonicalURL: z.string().url().optional(),
};

// Advanced customization options //
// These options are useful for granular customization of multiple collections //
// use destructuring for overrides or to add additional fields //

let collectionSchemas: { [key: string]: any } = {};

// loops through each collection and define the schema, and allows for overrides
// @ts-ignore
collectionNames.forEach((collectionName) => {
	collectionSchemas[collectionName] = defineCollection({
		loader: glob({ pattern: '*.md*', base: "./src/data/" + collectionName.toLowerCase() }),
		schema: () =>
			z.object({
				...postCollectionSchema,

				// *  Example overrides  * //

				// * -- Add new field to all collections -- * //

				// customField: z.string().optional(),

				// * -- Override the default author for all collections -- * //

				// author: z.string().optional(),

				// * -- Override the default title for a single collection or multiple collections -- * //

				// title: z
				// 	.string()
				// 	.default(collectionName === "collectionOne" ? COLLECTION_ONE.title : "")
				// 	.optional(),
			}),
	});
	console.log("🚀 ~ collectionSchemas:", './src/data/' + collectionName.toLowerCase())
});


export const collections = collectionSchemas;
