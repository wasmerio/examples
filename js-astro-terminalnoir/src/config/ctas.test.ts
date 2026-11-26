import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it, vi } from 'vitest';
import { site, parseSite } from './site';
import Home from '../views/Home.astro';
import { getCtas } from '../lib/ctas';

vi.mock('./site', async importOriginal => {
  const original = await importOriginal<typeof import('./site')>();
  const actions = (suffix: string) => ({
    header: { label: `Header ${suffix}`, href: '/about#start' },
    hero: {
      primary: { label: `Hero primary ${suffix}`, href: '/showcase' },
      secondary: { label: `Hero secondary ${suffix}`, href: 'https://example.org/download' },
    },
    box: {
      eyebrow: `Eyebrow ${suffix}`,
      title: `Title ${suffix}`,
      body: `Body ${suffix}`,
      primary: { label: `Box primary ${suffix}`, href: 'repository' },
      secondary: { label: `Box secondary ${suffix}`, href: '/about' },
    },
  });
  return { ...original, site: { ...original.site, ctas: { en: actions('EN'), 'pt-br': actions('PT') } } };
});

it('renders all configured CTA labels and destinations without editing views', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Home);
  for (const label of [
    'Header EN',
    'Hero primary EN',
    'Hero secondary EN',
    'Box primary EN',
    'Box secondary EN',
    'Eyebrow EN',
    'Title EN',
    'Body EN',
  ]) {
    expect(html).toContain(label);
  }
  expect(html).toContain('href="/about#start"');
  expect(html).toContain('href="https://example.org/download"');
  expect(html).toContain(site.repository);
});
it('localizes internal CTA paths and preserves external and repository URLs', () => {
  const ctas = getCtas('pt-br', '/toolkit/');
  expect(ctas.header).toEqual({ label: 'Header PT', href: '/toolkit/pt-br/about#start' });
  expect(ctas.hero.secondary.href).toBe('https://example.org/download');
  expect(ctas.box.primary.href).toBe(site.repository);
});
it.each(['javascript:alert(1)', '//evil.example', '/\\evil.example'])('rejects unsafe CTA links: %s', href => {
  const input = structuredClone(site);
  input.ctas.en.header.href = href;
  expect(() => parseSite(input)).toThrow();
});
it('requires CTA content for both languages', () => {
  expect(() => parseSite({ ...site, ctas: { en: site.ctas.en } })).toThrow();
});
