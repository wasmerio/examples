import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  type: "content",
  schema: () =>
    z.object({
      title: z.string().max(80),
      summary: z.string().max(200),
      draft: z.boolean().default(false),
      datePub: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
    }),
});

export const collections = { blog };
