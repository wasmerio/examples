import { describe, expect, it } from 'vitest';
import { formatDate, toISODate, toISOString } from './date';

const d = new Date('2026-11-06');
describe('date', () => {
  it('zh-CN', () => expect(formatDate(d, 'zh-CN')).toBe('2026年11月6日'));
  it('en', () => expect(formatDate(d, 'en')).toBe('November 6, 2026'));
  it('ISO 辅助', () => {
    expect(toISODate(d)).toBe('2026-11-06');
    expect(toISOString(d)).toBe('2026-11-06T00:00:00.000Z');
  });
});
