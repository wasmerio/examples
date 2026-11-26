import { getCollection } from 'astro:content';
import type { 
  Author, 
  EntryData, 
  ProcessedAuthor, 
  ProcessedEntry, 
  AdjacentEntry 
} from '../../scripts/type/frontmatter';
import { 
  formatDate, 
  getCoverImage, 
  getAuthorInfo, 
  sortEntriesByDate, 
  countWords 
} from '../utils';

export type { 
  Author, 
  EntryData, 
  ProcessedAuthor, 
  ProcessedEntry, 
  AdjacentEntry 
};

export { 
  formatDate, 
  getCoverImage, 
  getAuthorInfo, 
  sortEntriesByDate, 
  countWords 
};

/**
 * 获取相邻文章信息
 * 
 * @param currentId 当前文章的 ID
 * @param collection 内容集合名称
 * @returns 包含前一篇和后一篇文章信息的对象
 */
export async function getAdjacentEntries(currentId: string, collection: 'docs'): Promise<{ prev: AdjacentEntry | null; next: AdjacentEntry | null }> {
  try {
    const entries = await getCollection(collection);
    const sortedEntries = sortEntriesByDate(entries);
    
    const currentIndex = sortedEntries.findIndex(entry => entry.id === currentId);
    
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }
    
    const prev = currentIndex < sortedEntries.length - 1 ? sortedEntries[currentIndex + 1] : null;
    const next = currentIndex > 0 ? sortedEntries[currentIndex - 1] : null;
    
    const formatAdjacentEntry = (entry: typeof sortedEntries[0] | null): AdjacentEntry | null => {
      if (!entry?.id) return null;
      return {
        title: entry.data.title || 'Untitled',
        cover: getCoverImage(entry.data.cover),
        date: formatDate(entry.data.date),
        id: entry.id
      };
    };
    
    return {
      prev: formatAdjacentEntry(prev),
      next: formatAdjacentEntry(next)
    };
  } catch (error) {
    console.error('获取相邻文章时出错:', error);
    return { prev: null, next: null };
  }
}

/**
 * 处理文章数据，添加格式化后的字段
 * 
 * @param entries 原始文章条目数组
 * @param collection 内容集合名称
 * @returns 处理后的文章条目数组
 */
export function processEntryData(entries: Array<{ data: EntryData; body: string; _collection: string; id: string }>, collection: string): ProcessedEntry[] {
  return entries.map(entry => ({
    ...entry,
    processed: {
      date: formatDate(entry.data.date),
      cover: getCoverImage(entry.data.cover),
      author: getAuthorInfo(entry.data.author),
      categories: Array.isArray(entry.data.categories) ? entry.data.categories : [],
      category: entry.data.categories?.[0] || '未分类',
      tags: Array.isArray(entry.data.tags) ? entry.data.tags : [],
      views: typeof entry.data.views === 'number' ? entry.data.views : 0,
      id: entry.id
    }
  }));
}

/**
 * 生成静态路径
 * 
 * @param collection 内容集合名称
 * @returns 静态路径配置数组
 */
export async function generateStaticPaths(collection: 'docs') {
  try {
    const entries = await getCollection(collection);
    const sortedEntries = [...sortEntriesByDate(entries)].reverse();
    
    return sortedEntries.map((entry, index) => {
      const prev = index > 0 ? sortedEntries[index - 1].id : null;
      const next = index < sortedEntries.length - 1 ? sortedEntries[index + 1].id : null;
      const id = entry.id;
      
      return {
        params: { id: id.replace(/^\//, '').replace(/\/$/, '') },
        props: { 
          entry,
          prev,
          next
        },
      };
    });
  } catch (error) {
    console.error('生成静态路径时出错:', error);
    return [];
  }
}