import { describe, expect, it } from 'vitest';
import { toGridClasses } from './grid-classes';

describe('toGridClasses', () => {
  it('returns a static class for a single default column count', () => {
    expect(toGridClasses(3)).toBe('grid-cols-3');
  });

  it('returns static classes for responsive column counts', () => {
    expect(toGridClasses({ default: 1, md: 3, xl: 4 })).toBe('grid-cols-1 md:grid-cols-3 xl:grid-cols-4');
  });

  it('rejects unsupported column counts and breakpoints', () => {
    expect(() => toGridClasses(13 as never)).toThrow(/column/i);
    expect(() => toGridClasses({ tablet: 2 } as never)).toThrow(/breakpoint/i);
  });
});
