import { config } from './config';

export type Locale = 'zh-CN' | 'en';

export const dictionaries = {
  'zh-CN': {
    skipToContent: '跳至主要内容',
    allPosts: '所有文章',
    topics: '思考支柱',
    principles: '核心准则',
    framework: '决策框架',
    home: '首页',
    searchPlaceholder: '搜索文章标题或内容...',
    searchLabel: '搜索文章',
    postsHeading: '文章与记录。',
    postsLede: '关于投资复盘、认知成长、商业逻辑与技术系统的沉淀记录。',
    postsPageTitle: '所有文章 · Posts',
    allCategories: '全部',
    categoryFilter: '分类筛选',
    exploreCategory: '浏览分类文章 ->',
    readFull: '阅读全文 ->',
    archiveCount: (n: number) => `共 ${n} 篇归档`,
    recentArticles: '近期深度思考与复盘',
    allArchive: (n: number) => `查看全部文章库 (${n}) ->`,
    readingTime: (min: number) => `预计阅读 ${min} 分钟`,
    minShort: '分钟',
    byAuthor: (author: string) => `By ${author}`,
    copyLink: '复制链接',
    copied: '已复制!',
    copyQuote: 'MD 引用',
    rssFeed: 'RSS 订阅',
    tocTitle: '本篇目录',
    metaAuthor: '记录作者',
    metaCategory: '所属分类',
    metaDate: '发布时间',
    metaReadingTime: '阅读时长',
    relatedReading: '继续阅读',
    allSystemsNormal: 'All systems normal',
    rightsReserved: 'All rights reserved.',
    builtWith: 'Built with Astro',
  },
  'en': {
    skipToContent: 'Skip to content',
    allPosts: 'All Posts',
    topics: 'Pillars',
    principles: 'Principles',
    framework: 'Framework',
    home: 'Home',
    searchPlaceholder: 'Search posts by title or keyword...',
    searchLabel: 'Search posts',
    postsHeading: 'Articles & Notes.',
    postsLede: 'Structured thoughts and retrospective logs on systems, investing, and mental models.',
    postsPageTitle: 'All Posts',
    allCategories: 'All',
    categoryFilter: 'Filter by category',
    exploreCategory: 'Explore category ->',
    readFull: 'Read entry ->',
    archiveCount: (n: number) => `${n} entries archived`,
    recentArticles: 'Recent Entries & Notes',
    allArchive: (n: number) => `View full archive (${n}) ->`,
    readingTime: (min: number) => `${min} min read`,
    minShort: 'min',
    byAuthor: (author: string) => `By ${author}`,
    copyLink: 'Copy link',
    copied: 'Copied!',
    copyQuote: 'Cite MD',
    rssFeed: 'RSS Feed',
    tocTitle: 'Table of Contents',
    metaAuthor: 'Author',
    metaCategory: 'Category',
    metaDate: 'Published',
    metaReadingTime: 'Reading Time',
    relatedReading: 'Keep reading',
    allSystemsNormal: 'All systems normal',
    rightsReserved: 'All rights reserved.',
    builtWith: 'Built with Astro',
  },
} as const;

export const currentLocale: Locale = (config.site.locale === 'en' ? 'en' : 'zh-CN') as Locale;

export const t = dictionaries[currentLocale];

export function formatDate(date: Date, locale: Locale = currentLocale): string {
  if (locale === 'en') {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  }
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
}
