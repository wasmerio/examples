import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export interface SeriesItem {
  id: string;
  title: string;
  order: number;
}

export interface SeriesNeighbors {
  prev?: SeriesItem;
  next?: SeriesItem;
}

/** 纯逻辑只依赖这几个字段，便于单测。 */
export interface PostLike {
  id: string;
  data: { pubDate: Date; draft: boolean };
}

/** 过滤草稿（includeDrafts 为 true 时保留），按 pubDate 降序；同时间按 id 升序以保持稳定。 */
export function filterAndSortPosts<T extends PostLike>(
  posts: T[],
  opts: { includeDrafts?: boolean } = {},
): T[] {
  return posts
    .filter((p) => opts.includeDrafts || !p.data.draft)
    .sort(
      (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.id.localeCompare(b.id),
    );
}

/** 按发布年份分组，年份降序，组内保持输入顺序。 */
export function groupByYear<T extends PostLike>(posts: T[]): Array<{ year: number; posts: T[] }> {
  const map = new Map<number, T[]>();
  for (const p of posts) {
    const y = p.data.pubDate.getUTCFullYear();
    (map.get(y) ?? map.set(y, []).get(y)!).push(p);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, posts]) => ({ year, posts }));
}

/** 按系列顺序返回文章导航项，未加入该系列的文章不参与排序。 */
export function filterAndSortSeries<
  T extends {
    id: string;
    data: { title: string; pubDate: Date; series?: { id: string; order: number } };
  },
>(posts: T[], seriesId: string): SeriesItem[] {
  return posts
    .filter((post) => post.data.series?.id === seriesId)
    .sort(
      (a, b) =>
        a.data.series!.order - b.data.series!.order ||
        a.data.pubDate.getTime() - b.data.pubDate.getTime() ||
        a.id.localeCompare(b.id),
    )
    .map((post) => ({ id: post.id, title: post.data.title, order: post.data.series!.order }));
}

/** 返回当前系列文章的前后章节；系列顺序优先于全站发布时间。 */
export function seriesNeighbors(series: SeriesItem[], currentId: string): SeriesNeighbors {
  const index = series.findIndex((item) => item.id === currentId);
  return {
    prev: index > 0 ? series[index - 1] : undefined,
    next: index >= 0 && index < series.length - 1 ? series[index + 1] : undefined,
  };
}

const cachedPosts = new Map<boolean, Promise<PostEntry[]>>();

/**
 * 唯一的取数入口。默认在生产环境过滤草稿，dev 环境显示草稿；
 * 显式传 includeDrafts 可覆盖。生产构建期按 includeDrafts 缓存结果，避免每个路由重复扫描集合。
 */
export async function getPosts(opts: { includeDrafts?: boolean } = {}): Promise<PostEntry[]> {
  const includeDrafts = opts.includeDrafts ?? import.meta.env.DEV;
  if (import.meta.env?.PROD) {
    let pending = cachedPosts.get(includeDrafts);
    if (!pending) {
      pending = getCollection('posts')
        .then((entries) => filterAndSortPosts(entries, { includeDrafts }))
        .catch((err) => {
          cachedPosts.delete(includeDrafts);
          throw err;
        });
      cachedPosts.set(includeDrafts, pending);
    }
    return pending;
  }
  return filterAndSortPosts(await getCollection('posts'), { includeDrafts });
}

export interface SeriesSummary {
  /** frontmatter 中的 series.id */
  id: string;
  /** 系列名：取系列中 order 最小的一篇（通常是总览篇）的标题 */
  title: string;
  description?: string;
  /** 系列第一篇（总览篇）的文章 id，用作入口 */
  firstId: string;
  items: SeriesItem[];
  /** 系列中最新一篇的发布时间 */
  updated: Date;
}

/** 把文章按 series.id 分组成系列摘要，按最近更新时间降序；同时间按系列 id 升序。 */
export function summarizeSeries<
  T extends {
    id: string;
    data: {
      title: string;
      description?: string;
      pubDate: Date;
      series?: { id: string; order: number };
    };
  },
>(posts: T[]): SeriesSummary[] {
  const groups = new Map<string, T[]>();
  for (const p of posts) {
    const id = p.data.series?.id;
    if (!id) continue;
    let members = groups.get(id);
    if (!members) {
      members = [];
      groups.set(id, members);
    }
    members.push(p);
  }
  const summaries: SeriesSummary[] = [];
  for (const [id, members] of groups) {
    members.sort(
      (a, b) =>
        a.data.series!.order - b.data.series!.order ||
        a.data.pubDate.getTime() - b.data.pubDate.getTime() ||
        a.id.localeCompare(b.id),
    );
    const first = members[0]!;
    let maxUpdated = first.data.pubDate.getTime();
    const items: SeriesItem[] = [];
    for (const m of members) {
      const t = m.data.pubDate.getTime();
      if (t > maxUpdated) maxUpdated = t;
      items.push({ id: m.id, title: m.data.title, order: m.data.series!.order });
    }
    summaries.push({
      id,
      title: first.data.title,
      description: first.data.description,
      firstId: first.id,
      items,
      updated: new Date(maxUpdated),
    });
  }
  return summaries.sort(
    (a, b) => b.updated.getTime() - a.updated.getTime() || a.id.localeCompare(b.id),
  );
}

/**
 * 首页「最新文章」分页的文章序列（`/page/n/` 与首页底部的分页导航共用）。
 * - 有系列时首页是整本手册的总目录，没有分页列表：返回空数组，`/page/n/` 一页都不生成。
 * - 没有系列时排除首页精选区展示的文章（最多 featuredCount 篇），避免第 2 页重复出现。
 */
export function homePagedPosts<
  T extends { data: { featured?: boolean; series?: { id: string; order: number } } },
>(posts: T[], featuredCount: number): T[] {
  if (posts.some((p) => p.data.series)) return [];
  const featured = new Set(posts.filter((p) => p.data.featured).slice(0, featuredCount));
  return posts.filter((p) => !featured.has(p));
}
