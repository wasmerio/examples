import { describe, expect, it } from 'vitest';
import { formatMatrix, formatNumber } from './format';
import { clampIndex } from './timeline';

describe('format', () => {
  it('numbers', () => {
    expect(formatNumber(5)).toBe('5');
    expect(formatNumber(0.5)).toBe('0.5');
    expect(formatNumber(1 / 3)).toBe('0.33');
    expect(formatNumber(-1.25)).toBe('−1.25');
    expect(formatNumber(-0.001)).toBe('0');
  });
  it('matrix', () => {
    expect(
      formatMatrix([
        [1, null],
        [-2, 0.5],
      ]),
    ).toBe('1 ·\n−2 0.5');
  });
  it('clampIndex', () => {
    expect(clampIndex(-1, 5)).toBe(0);
    expect(clampIndex(9, 5)).toBe(4);
    expect(clampIndex(2, 0)).toBe(0);
  });
});
