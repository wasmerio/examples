import { expect, it } from 'vitest';
import { site, parseSite, resolveSiteUrl } from './site';

it('provides replaceable product identity', () => {
  expect(site.name).toBe('Noir CLI');
  expect(site.repository).toBe('https://github.com/nandomoreirame/terminalnoir-astro-theme');
  expect(site.url).toBe('https://example.com');
  expect(site.install[0].command).toContain('example');
});

it('rejects script URLs', () => {
  expect(() => parseSite({ ...site, repository: 'javascript:alert(1)' })).toThrow();
});

it('rejects invalid navigation paths', () => {
  expect(() => parseSite({ ...site, nav: [{ href: '//evil.example', key: 'nav.home' }] })).toThrow();
});

it('keeps the example origin unless SITE_URL is an http(s) URL', () => {
  expect(resolveSiteUrl(undefined)).toBe('https://example.com');
  expect(resolveSiteUrl('  ')).toBe('https://example.com');
  expect(resolveSiteUrl('https://demo.example')).toBe('https://demo.example');
  expect(() => resolveSiteUrl('javascript:alert(1)')).toThrow();
});
