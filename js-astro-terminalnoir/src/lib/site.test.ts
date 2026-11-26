import { describe, expect, it } from 'vitest';
import { isActive } from './site';

describe('isActive', () => {
  it('marks Home only on the root path', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/', '/ports')).toBe(false);
  });

  it('marks a section on its own path and its children', () => {
    expect(isActive('/ports', '/ports')).toBe(true);
    expect(isActive('/ports', '/ports/ghostty')).toBe(true);
    expect(isActive('/ports', '/ports/')).toBe(true);
  });

  it('does not match a section that only shares a prefix', () => {
    expect(isActive('/doc', '/docs')).toBe(false);
  });
});

describe('isActive in a prefixed locale', () => {
  it('treats the locale root as Home', () => {
    expect(isActive('/pt-br', '/pt-br', '/pt-br')).toBe(true);
    expect(isActive('/pt-br', '/pt-br/ports', '/pt-br')).toBe(false);
    expect(isActive('/pt-br/ports', '/pt-br/ports/ghostty', '/pt-br')).toBe(true);
  });
});
