import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    draft: z.boolean(),

    contact_meta: z
      .array(
        z.object({
          name: z.string(),
          contact: z.string(),
        }),
      )
      .optional(),
  }),
});
