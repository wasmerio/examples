import { defineCollection, z } from "astro:content";
import { format } from "date-fns";

// Blogs Collection
const blogsCollection = defineCollection({
    schema: ({ image }) =>
        z.object({
            author: z.string().min(1, "Author name is required"),
            date: z
                .string()
                .transform((str) =>
                    format(new Date(str), "MMMM d, yyyy")
                ),
            title: z.string().min(1, "Title is required"),
            thumbnail: image(),
            categories: z.array(z.string()),
            featured: z.boolean().default(false),
            description: z.string().optional(),
            keywords: z.string().optional(),
        }),
});

// Portfolios Collection
const portfoliosCollection = defineCollection({
    schema: ({ image }) =>
        z.object({
            author: z.string().min(1, "Author name is required"),
            date: z
                .string()
                .transform((str) =>
                    format(new Date(str), "MMMM d, yyyy")
                ),
            title: z.string().min(1, "Title is required"),
            thumbnail: image(),
            category: z.string().min(1, "Category is required"),
            technologies: z.array(z.string()),
            live: z.string().url("Invalid URL format"),
            featured: z.boolean().default(false),
            transitionDuration: z.string(),
            description: z.string().optional(),
            keywords: z.string().optional(),
        }),
});

export const collections = {
    blogs: blogsCollection,
    portfolios: portfoliosCollection,
};
