import type { CollectionEntry } from 'astro:content';
import type { Lang } from './config';

export interface DocItem {
  id: string;
  title: string;
  href: string;
}

export interface DocSection {
  key: string;
  title: string;
  items: DocItem[];
}

/** Section order and labels. Keys are the first path segment of a docs file. */
const SECTIONS: Record<string, { en: string; zh: string; 'zh-hant'?: string }> = {
  'getting-started': { en: 'Getting started', zh: '开始使用' },
  configuration: { en: 'Configuration', zh: '配置' },
  content: { en: 'Content', zh: '内容' },
  reference: { en: 'Reference', zh: '参考' },
};

const SECTION_ORDER = ['getting-started', 'configuration', 'content', 'reference'];

export function docHref(id: string, lang: Lang): string {
  return lang === 'zh' ? `/zh/docs/${id}/` : `/docs/${id}/`;
}

type Entry = CollectionEntry<'docs'> | CollectionEntry<'docsZh'>;

/** Build the sidebar tree: sections in a fixed order, pages by frontmatter `order`. */
export function buildSidebar(entries: Entry[], lang: Lang): DocSection[] {
  const groups = new Map<string, DocItem[]>();
  for (const entry of entries) {
    const [section] = entry.id.split('/');
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section)!.push({ id: entry.id, title: entry.data.title, href: docHref(entry.id, lang) });
  }

  return SECTION_ORDER.filter((key) => groups.has(key)).map((key) => {
    const items = groups.get(key)!.sort((a, b) => {
      const ea = entries.find((e) => e.id === a.id)!;
      const eb = entries.find((e) => e.id === b.id)!;
      return (ea.data.order ?? 100) - (eb.data.order ?? 100);
    });
    return { key, title: (SECTIONS[key] as any)?.[lang] ?? SECTIONS[key]?.zh ?? key, items };
  });
}

/** Previous / next across the flattened sidebar, so the order matches what readers see. */
export function docNeighbours(sidebar: DocSection[], id: string, _lang: Lang) {
  const flat = sidebar.flatMap((section) => section.items);
  const index = flat.findIndex((item) => item.id === id);
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  };
}

export { SECTIONS, SECTION_ORDER };
