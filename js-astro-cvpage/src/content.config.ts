import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { cvSchema } from "../schema/cv";

const cv = defineCollection({
    loader: glob({ pattern: '*.yaml', base: "content/cv" }),
    schema: cvSchema,
});

export const collections = { cv };