import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  // Files starting with an underscore are ignored, which makes drafts easy to
  // park outside the build entirely.
  loader: glob({ base: "./src/content/blog", pattern: "**/[^_]*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Used for the post list, meta description and the OG image. */
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      /** Hidden from production builds, still visible in `astro dev`. */
      draft: z.boolean().default(false),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
    }),
});

export const collections = { blog };
