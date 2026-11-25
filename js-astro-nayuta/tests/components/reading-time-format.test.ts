import { expect, test } from 'bun:test';
import { formatReadingTime } from '../../src/assets/utils/reading-time';

test('formats minutes consistently for article metadata', () => {
  expect(formatReadingTime(1)).toBe('1 min');
  expect(formatReadingTime(4)).toBe('4 mins');
});

test.each([undefined, null, '4 mins', 0, -1, 1.5, NaN, Infinity])(
  'reports invalid or missing compilation metadata: %s',
  (value) => {
    expect(() => formatReadingTime(value)).toThrow('readingTimeMinutes');
  },
);
