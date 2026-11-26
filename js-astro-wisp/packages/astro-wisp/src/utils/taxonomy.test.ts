import { describe, expect, it } from 'vitest';
import { buildTaxonomy, slugify } from './taxonomy';

describe('slugify', () => {
  it('小写、空格转连字符', () => expect(slugify('  Machine Learning ')).toBe('machine-learning'));
  it('中文保留原样', () => expect(slugify('机器 学习')).toBe('机器-学习'));
  it('去掉 URL 保留字符', () => expect(slugify('C++/Rust?')).toBe('crust'));
  it('slugMap 优先', () => expect(slugify('机器学习', { 机器学习: 'ml' })).toBe('ml'));
});

describe('buildTaxonomy', () => {
  const items = [
    { names: ['Rust', '机器学习'], post: 'p1' },
    { names: ['rust-x'], post: 'p2' },
    { names: ['机器学习', '机器学习'], post: 'p3' },
  ];
  it('计数、分组、排序', () => {
    const t = buildTaxonomy(items);
    expect(t.map((x) => [x.name, x.slug, x.count])).toEqual([
      ['机器学习', '机器学习', 2],
      ['Rust', 'rust', 1],
      ['rust-x', 'rust-x', 1],
    ]);
    expect(t[0]!.posts).toEqual(['p1', 'p3']);
  });
  it('slug 冲突抛错并包含冲突名', () => {
    expect(() => buildTaxonomy([{ names: ['AI', 'ai'], post: 1 }])).toThrow(/"AI".*"ai"/);
  });
  it('slugMap 可消除冲突', () => {
    const t = buildTaxonomy([{ names: ['AI', 'ai'], post: 1 }], { AI: 'ai-upper' });
    expect(t.map((x) => x.slug).sort()).toEqual(['ai', 'ai-upper']);
  });
  it('空 slug 抛错', () => {
    expect(() => buildTaxonomy([{ names: ['???'], post: 1 }])).toThrow(/slug 为空/);
  });
});
