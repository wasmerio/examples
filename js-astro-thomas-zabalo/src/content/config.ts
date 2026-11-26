import { z, defineCollection } from "astro:content";

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    author: z.object({
      name: z.string(),
      img: z.string(),
      alt: z.string(),
    }),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string().optional()
    }),
  })
});

export const collections = {
  projects: projectsCollection,
};