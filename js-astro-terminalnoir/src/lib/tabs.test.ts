import { expect, it } from 'vitest';
import { nextTab } from './tabs';

it('supports arrow keys, Home and End', () => {
  expect(nextTab(0, 'ArrowLeft', 3)).toBe(2);
  expect(nextTab(2, 'ArrowRight', 3)).toBe(0);
  expect(nextTab(1, 'Home', 3)).toBe(0);
  expect(nextTab(1, 'End', 3)).toBe(2);
  expect(nextTab(1, 'Enter', 3)).toBe(1);
  expect(nextTab(0, 'ArrowRight', 0)).toBe(0);
});
