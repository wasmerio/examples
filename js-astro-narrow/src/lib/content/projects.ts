import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../../config/i18n';

type Project = CollectionEntry<'projects'>;

/** 项目排序:order 优先,其余按标题字典序。 */
export function sortProjects(projects: Project[], locale: Locale) {
  const collator = new Intl.Collator(locale === 'zh-cn' ? 'zh-CN' : locale);
  return [...projects].sort((a, b) => {
    const orderA = a.data.order ?? Number.POSITIVE_INFINITY;
    const orderB = b.data.order ?? Number.POSITIVE_INFINITY;
    return orderA - orderB || collator.compare(a.data.title, b.data.title);
  });
}
