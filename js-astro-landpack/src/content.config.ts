import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const text = z.string().min(1);
const link = z
  .url()
  .refine((value) => /^https?:\/\//i.test(value), "Use an HTTP or HTTPS URL.");
const crop = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
  width: z.number().positive(),
  height: z.number().positive(),
});
const heading = z.object({
  title: text,
  description: text,
  order: z.number().int().nonnegative(),
});
const project = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/project" }),
  schema: ({ image }) =>
    z.object({
      name: text,
      shortName: text,
      description: text,
      seo: z
        .object({
          image: z.union([
            link,
            z
              .string()
              .regex(
                /^\/(?!\/)[^\s]+$/,
                "Use a root-relative public path or HTTP(S) URL.",
              ),
          ]),
          imageAlt: text,
          imageWidth: z.number().int().positive().optional(),
          imageHeight: z.number().int().positive().optional(),
        })
        .optional(),
      eyebrow: text,
      headline: text,
      headlineAccent: text,
      intro: text,
      command: text,
      background: z.enum(["grid", "glow", "rays"]).default("glow"),
      stamp: z
        .object({
          enabled: z.boolean().default(true),
          ringText: text,
          title: text,
          label: text,
          href: text.refine(
            (value) => value.startsWith("#") || /^https?:\/\//.test(value),
            "Use an anchor or HTTP(S) link.",
          ),
        })
        .optional(),
      faqHeading: text.default("A few things worth knowing."),
      faqIntro: text.default(
        "Answers to the questions that come up before your first install.",
      ),
      repository: link,
      docs: link,
      demo: link.optional(),
      license: text,
      author: text,
      authorUrl: link,
      authorAvatar: image().optional(),
      authorAvatarFraming: z
        .enum(["portrait", "reference"])
        .default("portrait"),
      stats: z.array(
        z.object({ value: text, label: text, href: link.optional() }),
      ),
      highlights: z.array(
        z.object({
          eyebrow: text,
          title: text,
          description: text,
          graphic: z.enum(["flow", "roles"]),
          image: image().optional(),
          imageLight: image().optional(),
          crop: crop.optional(),
          cropLight: crop.optional(),
          imageAlt: text.optional(),
        }),
      ),
      featuresHeading: text,
      featuresIntro: text,
      setupHeading: text,
      setupIntro: text,
      setupNote: text,
      integrationsHeading: text,
      integrationsIntro: text,
      ctaHeading: text,
      ctaIntro: text,
      preview: z.object({
        frame: z.enum(["arc", "browser", "safari"]).default("arc"),
        address: text,
        title: text,
        subtitle: text,
        apps: z.array(text).min(1),
        caption: text,
        image: image().optional(),
        imageLight: image().optional(),
        imageAlt: text.optional(),
      }),
    }),
});
const features = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/features" }),
  schema: heading.extend({
    icon: z.enum([
      "key",
      "globe",
      "apps",
      "shield",
      "users",
      "code",
      "activity",
      "palette",
      "book",
    ]),
  }),
});
const steps = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/steps" }),
  schema: heading.extend({ command: text }),
});
const integrations = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/integrations" }),
  schema: heading.extend({
    icon: z.enum(["laravel", "nodejs", "python", "go", "openid"]).optional(),
    language: z.enum([
      "php",
      "javascript",
      "typescript",
      "python",
      "go",
      "bash",
      "json",
      "text",
      "ruby",
      "rust",
      "java",
      "csharp",
    ]),
    code: text,
    package: text.optional(),
    source: link.optional(),
    href: link,
  }),
});
const faq = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/faq" }),
  schema: z.object({ question: text, order: z.number().int().nonnegative() }),
});
export const collections = { project, features, steps, integrations, faq };
