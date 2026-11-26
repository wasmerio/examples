import { defineCollection, z } from "astro:content";

// Use the ({ image }) helper in the schema function
const pages = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    image: image(), // Changed from z.string() to image()
    show_tile: z.boolean().optional().default(true),
  }),
});

const posts = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    image: image(), // Changed from z.string() to image()
    show_tile: z.boolean().optional().default(true),
    pubDate: z.date().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
    schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: image(),
    repoUrl: z.string().optional(),
  }),
});


export const collections = { pages, posts, projects };