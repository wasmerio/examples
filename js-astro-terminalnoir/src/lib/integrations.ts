import { z } from 'zod';
import source from '../data/integrations.json';

const link = z
  .string()
  .url()
  .refine(value => ['https:', 'http:'].includes(new URL(value).protocol));
const entry = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.enum(['en', 'pt-br']),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['editor', 'terminal', 'automation']),
  icon: z.string().min(1),
  homepage: link,
  featured: z.boolean().default(false),
  screenshot: z
    .string()
    .regex(/^\/images\/[a-z0-9-]+\.svg$/)
    .optional(),
  body: z.string().default(''),
});

export type Integration = z.infer<typeof entry>;

export function parseIntegrations(input: unknown): Integration[] {
  const entries = z.array(entry).parse(input);
  const keys = new Set<string>();
  for (const item of entries) {
    const key = `${item.locale}/${item.slug}`;
    if (keys.has(key)) throw new Error(`Duplicate integration: ${key}`);
    keys.add(key);
  }
  for (const item of entries) {
    for (const locale of ['en', 'pt-br']) {
      if (!keys.has(`${locale}/${item.slug}`)) throw new Error(`Missing translation: ${locale}/${item.slug}`);
    }
  }
  return entries;
}

export const integrations = parseIntegrations(source);
export const getIntegrations = (locale: 'en' | 'pt-br') => integrations.filter(item => item.locale === locale);
