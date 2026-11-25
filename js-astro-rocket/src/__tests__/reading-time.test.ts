import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../lib/utils';

describe('getReadingTime()', () => {
  it('counts Latin-script words at ~200 wpm', () => {
    const text = Array(400).fill('word').join(' '); // 400 words → 2 min
    expect(getReadingTime(text)).toBe(2);
  });

  it('counts CJK characters per-character instead of collapsing to 1 word', () => {
    // A whitespace split would see one "word" → 1 min. Character counting at
    // 400 cpm should give 800 / 400 = 2 minutes.
    const chinese = '中'.repeat(800);
    expect(getReadingTime(chinese)).toBe(2);
  });

  it('gives a realistic estimate for space-less CJK prose', () => {
    const chinese = '你好世界'.repeat(300); // 1200 chars → 3 min
    expect(getReadingTime(chinese)).toBe(3);
  });

  it('excludes fenced code blocks from the estimate', () => {
    const body = 'word '.repeat(200) + '\n```\n' + 'x '.repeat(1000) + '\n```\n';
    // ~200 real words → 1 min; the 1000 "words" inside the code fence are ignored
    expect(getReadingTime(body)).toBe(1);
  });

  it('always returns at least 1 minute, even for empty content', () => {
    expect(getReadingTime('hi')).toBe(1);
    expect(getReadingTime('')).toBe(1);
  });
});
