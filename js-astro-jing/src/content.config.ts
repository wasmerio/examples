import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SITE } from "@/config";
import { CONTENT_DIR } from "@/config/content-dir";

const blog = defineCollection({
  loader: glob({ base: `${CONTENT_DIR}/blog`, pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),

      date: z.coerce.date(),
      updated: z.coerce.date().optional(),

      tags: z.array(z.string()).default(SITE.defaultFmTag ? [SITE.defaultFmTag] : []),
      categories: z
        .array(z.string())
        .default(SITE.defaultFmCategory ? [SITE.defaultFmCategory] : []),

      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      toc: z.boolean().default(SITE.defaultFmToc),
      comments: z.boolean().default(SITE.defaultFmComments),
      math: z.boolean().default(SITE.defaultFmMath),
    }),
});

const about = defineCollection({
  loader: glob({ base: CONTENT_DIR, pattern: "about.{md,mdx}" }),
});

export const collections = { blog, about };
