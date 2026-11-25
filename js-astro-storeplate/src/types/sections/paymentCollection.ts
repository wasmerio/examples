import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export const paymentCollection = defineCollection({
  loader: glob({
    pattern: "payments-and-delivery.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    payment_methods: z
      .array(
        z.object({
          name: z.string(),
          image_url: z.string(),
        }),
      )
      .optional(),
    estimated_delivery: z.string().optional(),
  }),
});
