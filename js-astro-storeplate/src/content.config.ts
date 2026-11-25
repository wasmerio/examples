import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { aboutCollection } from "./types/pages/aboutCollection";
import { contactCollection } from "./types/pages/contactCollection";
import { ctaSectionCollection } from "./types/sections/ctaSectionCollection";
import { paymentCollection } from "./types/sections/paymentCollection";
import { z } from "astro/zod";

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// Export collections
export const collections = {
  // Pages
  pages: pagesCollection,
  about: aboutCollection,
  contact: contactCollection,

  // sections
  ctaSection: ctaSectionCollection,
  paymentSection: paymentCollection,
};
