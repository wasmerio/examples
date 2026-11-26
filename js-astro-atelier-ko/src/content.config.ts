import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      collection: z.string(),
      category: z.string(),
      material: z.string(),
      price: z.number().int().nonnegative(),
      shortDescription: z.string(),
      dimensions: z.string(),
      finish: z.string(),
      leadTime: z.string(),
      images: z.array(image()).min(1),
      order: z.number().int().nonnegative().default(999),
    }),
});

export const collections = { products };
