import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Homepage collection
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({}).catchall(z.any()),
});

// About collection
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({}).catchall(z.any()),
});

// Blog collection
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    featured: z.boolean().optional(),
    author: z.object({
      name: z.string(),
      avatar: z.string().optional(),
      designation: z.string().optional(),
    }).optional(),
    draft: z.boolean().optional(),
  }),
});

// Careers collection
const careersCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/careers" }),
  schema: z.object({}).catchall(z.any()),
});

// Case Studies collection
const caseStudiesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    logo: z.string().optional(),
    date: z.coerce.date().optional(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
    review_video: z.string().optional(),
  }),
});

// Changelog collection
const changelogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/changelog" }),
  schema: z.object({}).catchall(z.any()),
});

// Contact collection
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({}).catchall(z.any()),
});

// Features collection
const featuresCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/features" }),
  schema: z.object({}).catchall(z.any()),
});

// Integrations collection
const integrationsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/integrations" }),
  schema: z.object({}).catchall(z.any()),
});

// Pages collection
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({}).catchall(z.any()),
});

// Pricing collection
const pricingCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pricing" }),
  schema: z.object({}).catchall(z.any()),
});

// Sections collection
const sectionsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({}).catchall(z.any()),
});

// Export collections
export const collections = {
  homepage: homepageCollection,
  about: aboutCollection,
  blog: blogCollection,
  careers: careersCollection,
  "case-studies": caseStudiesCollection,
  changelog: changelogCollection,
  contact: contactCollection,
  features: featuresCollection,
  integrations: integrationsCollection,
  pages: pagesCollection,
  pricing: pricingCollection,
  sections: sectionsCollection,
};
