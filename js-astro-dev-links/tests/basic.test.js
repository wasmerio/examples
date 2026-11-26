import { describe, it, expect } from 'vitest';

describe('Basic Project Validation', () => {
  it('should have a functional environment', () => {
    expect(true).toBe(true);
  });

  it('should have the expected package name', async () => {
    const pkg = await import('../package.json');
    expect(pkg.default.name).toBe('linkspace');
  });
});
