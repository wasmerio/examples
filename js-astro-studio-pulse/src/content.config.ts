import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        description: z.string(),
        author: z.string(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
    }),
});

export const collections = { blog };