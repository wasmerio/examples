import { z } from 'zod';

const webUrl = z
  .string()
  .url()
  .refine(value => ['https:', 'http:'].includes(new URL(value).protocol));

export function resolveSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return 'https://example.com';
  return webUrl.parse(trimmed);
}
const action = z.object({
  label: z.string().min(1),
  href: z.union([z.literal('repository'), z.string().regex(/^\/(?!\/)[a-z0-9/-]*(?:#[a-z0-9-]+)?$/), webUrl]),
});
const ctas = z.object({
  header: action,
  hero: z.object({ primary: action, secondary: action }),
  box: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    primary: action,
    secondary: action,
  }),
});
const schema = z.object({
  name: z.string().min(1),
  terminalLabel: z.string().min(1),
  url: webUrl,
  repository: webUrl,
  author: z.string().min(1),
  version: z.string().min(1),
  ctas: z.object({ en: ctas, 'pt-br': ctas }),
  nav: z.array(z.object({ href: z.string().regex(/^\/(?!\/)[a-z0-9/-]*$/), key: z.string().min(1) })),
  hero: z.object({
    en: z.object({ title: z.string(), description: z.string() }),
    'pt-br': z.object({ title: z.string(), description: z.string() }),
  }),
  install: z.array(
    z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: z.string().min(1), command: z.string().min(1) }),
  ),
});

export const parseSite = (value: unknown) => schema.parse(value);
export const site = parseSite({
  name: 'Noir CLI',
  terminalLabel: '~/noir-cli',
  url: resolveSiteUrl(process.env.SITE_URL),
  repository: 'https://github.com/nandomoreirame/terminalnoir-astro-theme',
  author: 'Your name',
  version: '0.0.1',
  ctas: {
    en: {
      header: { label: 'Get started', href: '/docs#quickstart' },
      hero: {
        primary: { label: 'Docs', href: '/docs' },
        secondary: { label: 'Integrations', href: '/integrations' },
      },
      box: {
        eyebrow: 'Open source',
        title: 'Make it yours.',
        body: 'Replace the name, domain and example integrations, then publish the static site.',
        primary: { label: 'GitHub repository', href: 'repository' },
        secondary: { label: 'Read the guide', href: '/docs' },
      },
    },
    'pt-br': {
      header: { label: 'Começar', href: '/docs#quickstart' },
      hero: {
        primary: { label: 'Documentação', href: '/docs' },
        secondary: { label: 'Integrações', href: '/integrations' },
      },
      box: {
        eyebrow: 'Código aberto',
        title: 'Deixe com a sua cara.',
        body: 'Troque o nome, o domínio e as integrações de exemplo, e publique o site estático.',
        primary: { label: 'Repositório no GitHub', href: 'repository' },
        secondary: { label: 'Ler o guia', href: '/docs' },
      },
    },
  },
  nav: [
    { href: '/', key: 'nav.home' },
    { href: '/about', key: 'nav.about' },
    { href: '/integrations', key: 'nav.integrations' },
    { href: '/docs', key: 'nav.docs' },
    { href: '/showcase', key: 'nav.showcase' },
  ],
  hero: {
    en: {
      title: 'Build with clarity.',
      description: 'A fictional developer tool demonstrating Terminal Noir Astro Theme.',
    },
    'pt-br': {
      title: 'Desenvolva com clareza.',
      description: 'Uma ferramenta fictícia para demonstrar o Terminal Noir Astro Theme.',
    },
  },
  install: [
    { id: 'npm', label: 'npm example', command: 'npm install example-package' },
    { id: 'pnpm', label: 'pnpm example', command: 'pnpm add example-package' },
  ],
});
