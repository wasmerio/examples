import { describe, expect, it } from 'vitest';
import { getLocale, getLocalePath } from './index';

describe('default English locale routing', () => {
  it('uses English at the root and Polish only under /pl/', () => {
    expect(getLocale('/')).toBe('en');
    expect(getLocale('/en/')).toBe('en');
    expect(getLocale('/pl/')).toBe('pl');
    expect(getLocale('/pl/privacy-policy/')).toBe('pl');
  });

  it('switches between English root routes and Polish prefixed routes', () => {
    expect(getLocalePath('/pl/privacy-policy/', 'en')).toBe('/privacy-policy/');
    expect(getLocalePath('/privacy-policy/', 'pl')).toBe('/pl/privacy-policy/');
    expect(getLocalePath('/en/', 'en')).toBe('/');
    expect(getLocalePath('/en/', 'pl')).toBe('/pl/');
  });
});
