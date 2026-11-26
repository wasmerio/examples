import { getPosts, type PostEntry } from './posts';
import config from 'virtual:wisp/config';

export interface TaxonomyTerm<P = PostEntry> {
  name: string;
  slug: string;
  count: number;
  posts: P[];
}

/**
 * 名称 -> URL 段：slugMap 优先；否则 trim、小写、空白转 `-`、去掉 URL 保留字符；中文原样保留。
 */
export function slugify(name: string, slugMap: Record<string, string> = {}): string {
  const mapped = slugMap[name];
  if (mapped !== undefined) return mapped;
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[/\\?#%&=+:;,.'"`!@$^*()[\]{}<>|~]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 把名称列表分组为词条；两个不同名称得到同一 slug 时抛错（消息含冲突名）。保持文章顺序。 */
export function buildTaxonomy<P>(
  items: Array<{ names: string[]; post: P }>,
  slugMap: Record<string, string> = {},
  kind = 'taxonomy',
): TaxonomyTerm<P>[] {
  const bySlug = new Map<string, TaxonomyTerm<P>>();
  for (const { names, post } of items) {
    for (const name of new Set(names)) {
      const slug = slugify(name, slugMap);
      if (!slug)
        throw new Error(`[wisp] ${kind} "${name}" 的 slug 为空，请在 taxonomy.slugMap 中指定`);
      const existing = bySlug.get(slug);
      if (existing && existing.name !== name) {
        throw new Error(
          `[wisp] ${kind} slug 冲突："${existing.name}" 与 "${name}" 都生成 "${slug}"，请在 taxonomy.slugMap 中为其中之一指定不同的 slug`,
        );
      }
      if (existing) {
        existing.posts.push(post);
        existing.count++;
      } else {
        bySlug.set(slug, { name, slug, count: 1, posts: [post] });
      }
    }
  }
  return [...bySlug.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'),
  );
}

export function collectTags(posts: PostEntry[], slugMap: Record<string, string> = {}) {
  return buildTaxonomy(
    posts.map((p) => ({ names: p.data.tags, post: p })),
    slugMap,
    '标签',
  );
}

export function collectCategories(posts: PostEntry[], slugMap: Record<string, string> = {}) {
  return buildTaxonomy(
    posts.map((p) => ({ names: p.data.category ? [p.data.category] : [], post: p })),
    slugMap,
    '分类',
  );
}

/** 标签词条，按文章数降序。 */
export async function getTags(): Promise<TaxonomyTerm[]> {
  return collectTags(await getPosts(), config.taxonomy.slugMap);
}

export async function getCategories(): Promise<TaxonomyTerm[]> {
  return collectCategories(await getPosts(), config.taxonomy.slugMap);
}
