import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const order = (file: string) => readFileSync(file, 'utf8').match(/@layer [a-z, ]+;/)?.[0];

describe('cascade layer order', () => {
  it('is declared in <head> before any stylesheet, the same as in global.css', () => {
    // A route-split stylesheet can load first; without this, it would fix the order.
    expect(order('src/theme/Layout.astro')).toBeTruthy();
    expect(order('src/theme/Layout.astro')).toBe(order('src/theme/styles/global.css'));
  });
});
