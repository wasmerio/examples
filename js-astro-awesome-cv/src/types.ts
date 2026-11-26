import { z } from 'astro/zod';

export const cvSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  accent: z.string().default('#dc3522'),
  demo: z.boolean().default(false),
  summary: z.string(),
  contact: z.object({ email: z.string(), linkedin: z.url(), github: z.url() }),
  projects: z.array(z.object({ title: z.string(), description: z.string() })),
  experience: z.array(
    z.object({
      company: z.string(),
      location: z.string(),
      roles: z.array(z.object({ title: z.string(), dates: z.string(), points: z.array(z.string()) })),
    }),
  ),
  skills: z.array(z.object({ category: z.string(), items: z.string() })),
  recognition: z.array(z.object({ title: z.string(), note: z.string() })),
  education: z.array(
    z.object({ degree: z.string(), institution: z.string(), dates: z.string(), note: z.string().optional() }),
  ),
  languages: z.string(),
});

export type CV = z.infer<typeof cvSchema>;
