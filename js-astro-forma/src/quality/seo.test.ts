import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const seo = JSON.parse(fs.readFileSync('src/data/global/seo.json', 'utf8')) as Record<string, unknown>;

describe('SEO contract', () => {
  it('contains the required default metadata', () => {
    expect(seo.defaultTitle).toEqual(expect.any(String));
    expect(String(seo.defaultTitle).trim()).not.toBe('');
    expect(seo.defaultDescription).toEqual(expect.any(String));
    expect(String(seo.defaultDescription).trim()).not.toBe('');
    expect(seo.defaultOgImage).toEqual(expect.stringMatching(/^\//));
  });

  it('uses explicit boolean indexing flags', () => {
    expect(typeof seo.index).toBe('boolean');
    expect(typeof seo.follow).toBe('boolean');
  });
});
