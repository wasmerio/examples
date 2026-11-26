import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { pageMetadata, robotsBody } from './seo';

it('builds absolute base-aware canonical and alternate links', () => {
  const meta = pageMetadata('https://example.com', '/toolkit/', '/toolkit/pt-br/docs/', 'Docs', 'Guide');
  expect(meta.canonical).toBe('https://example.com/toolkit/pt-br/docs');
  expect(meta.alternates.en).toBe('https://example.com/toolkit/docs');
  expect(meta.image).toBe('https://example.com/toolkit/og-image.svg');
});

it('points robots at the sitemap index for the configured base', () => {
  expect(robotsBody('https://example.com', '/toolkit/')).toContain(
    'Sitemap: https://example.com/toolkit/sitemap-index.xml',
  );
  expect(robotsBody('https://example.com', '/')).toContain('Sitemap: https://example.com/sitemap-index.xml');
});

it('includes the sitemap integration and drops the original domain', () => {
  const config = readFileSync(new URL('../../astro.config.mjs', import.meta.url), 'utf8');
  expect(config).toContain('@astrojs/sitemap');
  expect(config).not.toContain(['terminalnoir', 'web.app'].join('.'));
});
