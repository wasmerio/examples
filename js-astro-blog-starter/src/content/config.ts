// Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// Define your collection(s)
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    category: z.string().optional(),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    description: z.string().optional(),
    date:z.coerce.date(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    body: z.string().optional(),
    readingTime: z.string().optional(),
    wordCount: z.number().optional(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections  = { blog };
