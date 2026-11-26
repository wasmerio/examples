import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

const DEFAULT_PAGE_SIZE = 12;

export function slugOf(p: Post) {
  return p.data.slug || p.id.replace(/\.md$/, '');
}

export function hrefOf(p: Post) {
  return `/notes/${slugOf(p)}/`;
}

export function utcYmd(d: Date) {
  return {
    y: d.getUTCFullYear(),
    m: String(d.getUTCMonth() + 1).padStart(2, '0'),
    day: String(d.getUTCDate()).padStart(2, '0'),
  };
}

export function formatDate(d: Date) {
  const { y, m, day } = utcYmd(d);
  return `${y}.${m}.${day}`;
}

export function opening(p: Post, max = 160) {
  const fromMeta = (p.data.description || '').trim();
  const source = fromMeta || firstParagraph(p.body ?? '');
  return truncate(source, max);
}

function firstParagraph(body: string) {
  const text = body
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>]/g, '')
    .trim();
  const para = text.split(/\n\s*\n/)[0] || '';
  return para.replace(/\s+/g, ' ').trim();
}

export function truncate(text: string, max: number) {
  const s = text.trim();
  if (s.length <= max) return s;

  const space = s.lastIndexOf(' ', max);
  if (space > max * 0.8) {
    let cut = s.slice(0, space).replace(/[,.;:，。；：、]+$/, '');
    cut = cut.replace(/\s+(?:a|an|the|and|or|of|to|for|with|from|into)$/i, '');
    return `${cut}…`;
  }

  /* Chinese has no spaces, so the word-boundary branch never fires and the cut
     lands mid-word. Strip trailing punctuation, then a single trailing function
     word. One word, one strip. */
  const ZH_STOP = /[的了和与或及而则在把被向着从对到]$/;
  let cut = s.slice(0, max).replace(/[,.;:，。；：、]+$/, '');
  cut = cut.replace(ZH_STOP, '');
  return `${cut}…`;
}

export async function published(): Promise<Post[]> {
  return (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function leadOf(posts: Post[], pin?: string) {
  const want = (pin || '').trim();
  if (want) {
    const hit = posts.find((p) => slugOf(p) === want);
    if (hit) return hit;
  }
  return posts[0] ?? null;
}

export function streamOf(posts: Post[], lead?: Post | null) {
  if (!lead) return posts;
  return posts.filter((p) => p.id !== lead.id);
}

export function coverOf(p: Post) {
  return p.data.cover || p.data.images?.[0] || '';
}

export function galleryOf(p: Post) {
  const cover = (p.data.cover || '').trim();
  const raw = (p.data.images ?? []).map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (src: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    out.push(src);
  };
  push(cover);
  for (const src of raw) push(src);
  return out;
}

export function pageSizeOf(n?: number) {
  const x = Number(n);
  if (!Number.isFinite(x) || x < 1) return DEFAULT_PAGE_SIZE;
  return Math.floor(x);
}

export function pageCount(total: number, size: number) {
  if (total <= 0) return 1;
  return Math.max(1, Math.ceil(total / size));
}

export function pageOf(posts: Post[], page: number, size: number) {
  const start = Math.max(0, (page - 1) * size);
  return posts.slice(start, start + size);
}

export function pageHref(page: number) {
  return page <= 1 ? '/' : `/page/${page}/`;
}

export function tagHref(tag: string) {
  return `/tags/${encodeURIComponent(tag.trim())}/`;
}

const CATEGORY = new Set(['note', 'travel']);
const CATEGORY_ORDER = ['note', 'travel'];

export function categoryOf(p: Post) {
  return p.data.category || 'note';
}

export function categoryHref(category: string) {
  return `/categories/${encodeURIComponent(category)}/`;
}

export function byCategory(posts: Post[]) {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const c = categoryOf(p);
    const list = map.get(c) ?? [];
    list.push(p);
    map.set(c, list);
  }
  const keys = [
    ...CATEGORY_ORDER.filter((k) => map.has(k)),
    ...[...map.keys()].filter((k) => !CATEGORY_ORDER.includes(k)),
  ];
  return keys.map((category) => ({ category, posts: map.get(category)! }));
}

export function langOf(p: Post) {
  const l = (p.data.lang || '').toLowerCase();
  if (l.startsWith('zh')) return 'zh' as const;
  if (l.startsWith('en')) return 'en' as const;
  return '';
}

export function readMinutes(p: Post) {
  const raw = `${p.data.description || ''}\n${p.body ?? ''}`;
  const text = raw
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>`\[\]]/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const latin = text.replace(/[\u4e00-\u9fff]/g, ' ').trim();
  const words = latin ? latin.split(/\s+/).filter(Boolean).length : 0;
  const photos = galleryOf(p).length * 0.3;
  return Math.max(1, Math.round(words / 200 + cjk / 400 + photos));
}

export function tagsOf(posts: Post[]) {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const raw of p.data.tags ?? []) {
      const tag = raw.trim();
      if (!tag || CATEGORY.has(tag)) continue;
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'zh'))
    .map(([tag, count]) => ({ tag, count }));
}

export function yearGroups(posts: Post[]) {
  const map = new Map<number, Post[]>();
  for (const p of posts) {
    const y = p.data.date.getUTCFullYear();
    const list = map.get(y) ?? [];
    list.push(p);
    map.set(y, list);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, posts: items }));
}
