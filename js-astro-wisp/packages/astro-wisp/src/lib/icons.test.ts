import { describe, expect, it } from 'vitest';
import { iconSvg, iconHast, hasIcon } from './icons';

describe('iconSvg', () => {
  it('inlines lucide svg with currentColor and aria-hidden', () => {
    const s = iconSvg('sun');
    expect(s).toMatch(/^<svg/);
    expect(s).toContain('currentColor');
    expect(s).toContain('aria-hidden="true"');
    expect(s).toContain('width="1em"');
  });
  it('labels icon when label given', () => {
    expect(iconSvg('rss', { label: 'RSS' })).toContain('aria-label="RSS"');
  });
  it('throws on unknown icon', () => {
    expect(() => iconSvg('no-such-icon-xyz')).toThrow(/未知/);
    expect(hasIcon('moon')).toBe(true);
  });
});

describe('iconHast', () => {
  it('produces the same svg as iconSvg, as hast', () => {
    const h = iconHast('arrow-up', { class: 'x' });
    expect(h.tagName).toBe('svg');
    expect(h.properties).toMatchObject({
      className: ['wisp-icon', 'x'],
      ariaHidden: 'true',
      viewBox: '0 0 24 24',
    });
    const path = h.children[0] as import('hast').Element;
    expect(path.tagName).toBe('path');
    expect(path.properties).toMatchObject({ stroke: 'currentColor', d: 'm5 12l7-7l7 7m-7 7V5' });
  });
  it('nests grouped elements', () => {
    // Lucide 的多元素图标可能带 <g>；解析后结构与字符串版一致
    const h = iconHast('copy');
    const tags = JSON.stringify(h).match(/"tagName":"(\w+)"/g);
    expect(tags?.length).toBeGreaterThan(1);
    expect(iconSvg('copy').match(/<(path|rect|g)\b/g)?.length).toBe(tags!.length - 1);
  });
  it('throws on unknown icon', () => {
    expect(() => iconHast('no-such-icon-xyz')).toThrow(/未知/);
  });
});
