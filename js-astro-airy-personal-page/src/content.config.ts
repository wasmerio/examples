import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { ANNOUNCEMENT_TYPES, BENTO_SIZES, BENTO_DISPLAY_TYPES } from '@constants/ui';

const site = defineCollection({
  loader: glob({ pattern: "site.yaml", base: "config" }),
  schema: ({ image }) => z.object({
    site: z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      slogan: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      splitRatio: z.number().default(50),
      banner: image(),
      avatar: image().optional(),
      ogImage: z.string().optional(),
      brandIcon: z.string().optional().nullable(),
      appleTouchIcon: z.string().optional().nullable(),
      startYear: z.number().optional(),
    }),

    navigation: z.array(z.object({
      name: z.string(),
      path: z.string().optional(),
      icon: z.string().optional(),
      children: z.array(z.lazy(() => z.object({
        name: z.string(),
        path: z.string(),
        icon: z.string().optional()
      }))).optional()
    })).optional(),

    announcements: z.array(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string().optional(),
      type: z.enum(ANNOUNCEMENT_TYPES),
      priority: z.number().optional(),
      color: z.string().optional(),
      persistent: z.boolean().optional(),
      publishDate: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      link: z.object({
        url: z.string(),
        text: z.string().optional(),
        external: z.boolean().optional()
      }).optional()
    })).nullish().transform((items) => items ?? []),

    about: z.object({
      description: z.string(),
      bento: z.array(z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        size: z.enum(BENTO_SIZES),
        type: z.enum(BENTO_DISPLAY_TYPES),
        items: z.array(z.object({
          name: z.string(),
          icon: z.string()
        })).optional(),
        links: z.array(z.object({
          name: z.string(),
          url: z.string(),
          icon: z.string().optional()
        })).optional()
      }))
    })
  })
});

export const collections = { site };
