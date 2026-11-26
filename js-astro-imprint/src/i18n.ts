import { SITE } from './config';

const messages = {
  en: {
    skipToContent: 'Skip to content',
    home: 'Posts',
    archives: 'Archives',
    tags: 'Tags',
    rss: 'RSS',
    github: 'GitHub',
    primaryNavigation: 'Primary navigation',
    pagination: 'Pagination',
    themeToggle: 'Toggle color theme',
    recentPosts: 'Recent posts',
    posts: 'POSTS',
    technicalNote: 'Technical note',
    published: 'Published',
    updated: 'Updated',
    archived: 'Archived',
    archiveNotice: 'This post is no longer maintained and may contain outdated information.',
    tableOfContents: 'On this page',
    newerPosts: 'Newer posts',
    olderPosts: 'Older posts',
    postArchives: 'Post archives',
    postTags: 'Post tags',
    notFoundTitle: 'Page not found',
    notFoundMessage: 'No imprint was left here.',
    backHome: 'Back to recent posts',
  },
  zh: {
    skipToContent: '跳到正文',
    home: '文章',
    archives: '归档',
    tags: '标签',
    rss: 'RSS',
    github: 'GitHub',
    primaryNavigation: '主导航',
    pagination: '分页导航',
    themeToggle: '切换明暗主题',
    recentPosts: '最近文章',
    posts: '文章',
    technicalNote: '技术笔记',
    published: '发布于',
    updated: '更新于',
    archived: '历史归档',
    archiveNotice: '本文已停止维护，内容可能已经过时。',
    tableOfContents: '本页目录',
    newerPosts: '较新文章',
    olderPosts: '较早文章',
    postArchives: '文章归档',
    postTags: '文章标签',
    notFoundTitle: '页面未找到',
    notFoundMessage: '这里没有留下记录。',
    backHome: '返回最近文章',
  },
} as const;

export type Language = keyof typeof messages;
export type MessageKey = keyof typeof messages.en;

const language = SITE.language as Language;
export const t = (key: MessageKey) => messages[language][key];

export function pageTitle(page: number) {
  return language === 'zh' ? `文章·第${page}页` : `Posts · Page ${page}`;
}

export function readPostLabel(title: string) {
  return language === 'zh' ? `阅读《${title}》` : `Read “${title}”`;
}

export function countLabel(count: number, singular: string, plural = `${singular}s`) {
  if (language === 'zh') return `${count}${singular}`;
  return `${count} ${count === 1 ? singular : plural}`;
}

export function archiveLabel(year: string, month?: string) {
  if (language === 'zh') return month ? `${year}年${month}月归档` : `${year}年归档`;
  return month ? `Archive · ${year}-${month}` : `Archive · ${year}`;
}

export function archiveMonthLabel(month: string) {
  if (language === 'zh') return `${Number(month)}月`;
  return new Intl.DateTimeFormat(SITE.locale, { month: 'short', timeZone: 'UTC' })
    .format(new Date(`2020-${month}-01T00:00:00Z`));
}

export function taxonomyTitle(kind: 'category' | 'tag', value: string) {
  if (language === 'zh') return `${kind === 'tag' ? '标签' : '分类'}：${value}`;
  return `${kind === 'tag' ? 'Tag' : 'Category'}: ${value}`;
}
