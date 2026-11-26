import { describe, expect, it } from 'vitest';
import { sitePath } from './paths';

describe('sitePath', () => {
  it('joins internal paths with Astro base and preserves already prefixed paths', () => {
    expect(sitePath('/', '/')).toBe('/');
    expect(sitePath('/', '/posts/demo/')).toBe('/posts/demo/');
    expect(sitePath('/infra-note/', '/')).toBe('/infra-note/');
    expect(sitePath('/infra-note/', '/posts/demo/')).toBe('/infra-note/posts/demo/');
    expect(sitePath('/infra-note/', '/infra-note/posts/demo/')).toBe('/infra-note/posts/demo/');
  });

  it('preserves external, protocol-relative, and fragment links', () => {
    expect(sitePath('/infra-note/', 'https://example.com/')).toBe('https://example.com/');
    expect(sitePath('/infra-note/', '//cdn.example.com/app.js')).toBe('//cdn.example.com/app.js');
    expect(sitePath('/infra-note/', '#section')).toBe('#section');
  });
});
