import { z } from 'astro/zod';
import { defineTemplate } from '@templates/define';

export const schema = z.object({
  categories: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        desc: z.string().optional(),
      }),
    )
    .optional(),
  friends: z
    .array(
      z.object({
        name: z.string(),
        href: z.string(),
        site: z.string().optional(),
        desc: z.string().optional(),
        favicon: z.string().optional(),
        faviconText: z.string().optional(),
        faviconBg: z.string().optional(),
        faviconColor: z.string().optional(),
        tag: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  mySite: z
    .object({
      name: z.string(),
      url: z.string(),
      avatar: z.string().optional(),
      desc: z.string().optional(),
    })
    .optional(),
});

export default defineTemplate({
  id: 'friend',
  name: 'Friend links',
  description: 'Grouped friend links and site exchange information.',
  schema,
  load: () => import('@templates/friend/Template.astro'),
});
