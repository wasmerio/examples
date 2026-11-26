import { describe, expect, it } from 'vitest';
import {
  filterAndSortPosts,
  filterAndSortSeries,
  groupByYear,
  homePagedPosts,
  seriesNeighbors,
  summarizeSeries,
} from './posts';

const p = (id: string, d: string, draft = false) => ({ id, data: { pubDate: new Date(d), draft } });
const posts = [
  p('a', '2025-03-01'),
  p('b', '2026-11-06'),
  p('c', '2026-01-02', true),
  p('d', '2024-12-31'),
];

describe('filterAndSortPosts', () => {
  it('过滤草稿并按日期降序', () => {
    expect(filterAndSortPosts(posts).map((x) => x.id)).toEqual(['b', 'a', 'd']);
  });
  it('includeDrafts 保留草稿', () => {
    expect(filterAndSortPosts(posts, { includeDrafts: true }).map((x) => x.id)).toEqual([
      'b',
      'c',
      'a',
      'd',
    ]);
  });
  it('不修改入参', () => {
    const copy = [...posts];
    filterAndSortPosts(posts);
    expect(posts).toEqual(copy);
  });
});

describe('groupByYear', () => {
  it('年份降序分组', () => {
    const g = groupByYear(filterAndSortPosts(posts, { includeDrafts: true }));
    expect(g.map((x) => x.year)).toEqual([2026, 2025, 2024]);
    expect(g[0]!.posts.map((x) => x.id)).toEqual(['b', 'c']);
  });
  it('空输入', () => expect(groupByYear([])).toEqual([]));
});

describe('filterAndSortSeries', () => {
  it('只保留系列文章并按 order 排序', () => {
    const input = [
      {
        id: 'later',
        data: { title: 'Later', pubDate: new Date('2026-01-01'), series: { id: 'x', order: 2 } },
      },
      {
        id: 'other',
        data: { title: 'Other', pubDate: new Date('2025-01-01'), series: { id: 'y', order: 1 } },
      },
      {
        id: 'first',
        data: { title: 'First', pubDate: new Date('2026-02-01'), series: { id: 'x', order: 1 } },
      },
    ];
    expect(filterAndSortSeries(input, 'x').map((x) => x.id)).toEqual(['first', 'later']);
  });

  it('按系列顺序返回当前章节的前后项', () => {
    const series = [
      { id: 'intro', title: 'Intro', order: 1 },
      { id: 'practice', title: 'Practice', order: 3 },
      { id: 'graphs', title: 'Graphs', order: 4 },
    ];
    expect(seriesNeighbors(series, 'practice')).toEqual({ prev: series[0], next: series[2] });
    expect(seriesNeighbors(series, 'intro')).toEqual({ next: series[1] });
    expect(seriesNeighbors(series, 'graphs')).toEqual({ prev: series[1] });
  });
});

describe('summarizeSeries', () => {
  const d = (s: string) => new Date(s);
  const posts = [
    {
      id: 'a/intro',
      data: {
        title: 'A 总览',
        description: 'A desc',
        pubDate: d('2026-01-01'),
        series: { id: 'a', order: 1 },
      },
    },
    {
      id: 'a/02',
      data: { title: 'A 第二篇', pubDate: d('2026-03-01'), series: { id: 'a', order: 2 } },
    },
    {
      id: 'b/intro',
      data: { title: 'B 总览', pubDate: d('2026-02-01'), series: { id: 'b', order: 1 } },
    },
    { id: 'solo', data: { title: 'Solo', pubDate: d('2026-04-01') } },
  ];

  it('按系列分组，系列名取 order 最小的一篇，按最近更新降序', () => {
    const list = summarizeSeries(posts);
    expect(list.map((s) => s.id)).toEqual(['a', 'b']);
    expect(list[0]).toMatchObject({ title: 'A 总览', description: 'A desc', firstId: 'a/intro' });
    expect(list[0]!.items.map((i) => i.id)).toEqual(['a/intro', 'a/02']);
    expect(list[0]!.updated).toEqual(d('2026-03-01'));
  });

  it('没有系列时返回空数组', () => {
    expect(summarizeSeries([posts[3]!])).toEqual([]);
  });
});

describe('homePagedPosts', () => {
  const q = (
    id: string,
    extra: { featured?: boolean; series?: { id: string; order: number } } = {},
  ) => ({
    id,
    data: extra,
  });
  it('没有系列：排除首页精选区展示的文章（最多 featuredCount 篇）', () => {
    const posts = [
      q('a', { featured: true }),
      q('b'),
      q('c', { featured: true }),
      q('d', { featured: true }),
    ];
    expect(homePagedPosts(posts, 2).map((x) => x.id)).toEqual(['b', 'd']);
  });
  it('有任何系列：首页是总目录，不分页', () => {
    const posts = [q('a'), q('b', { series: { id: 's', order: 1 } }), q('c')];
    expect(homePagedPosts(posts, 3)).toEqual([]);
  });
});
