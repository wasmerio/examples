import { defineCollection, z } from "astro:content";

const novel = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string().min(1),
    volume: z.number().int().positive(),
    chapter: z.number().int().positive(),
    title: z.string().min(1),
    date: z.coerce.date().optional(),
    summary: z.string().optional(),
  }),
});

export const collections = {
  novel,
};
