import type { BlogConfig } from './src/types/config';

// Set SITE_URL for a custom domain, or replace baseUrl below with a fixed URL.
const deploymentUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.URL) ||
  'https://example.com/';

const config: BlogConfig = {
  site: {
    title: '我的博客',
    baseUrl: deploymentUrl,
    defaultLocale: 'zh',
    locales: ['zh'],
    localePrefixPolicy: 'redirect-to-default',
    timezone: 'Asia/Shanghai',
  },
  author: {
    name: '博主',
    bio: '记录生活与想法。',
    avatar: '/favicon.svg',
    socials: [],
  },
  text: {
    siteDescription: '记录生活与想法。',
    tabs: { search: '阅读', posts: '文章' },
    homeHeading: '今天想读点什么？',
    searchHeading: '输入关键词，发现一篇文章',
    searchPlaceholder: '搜索文章、想法与关键词',
    notFoundMessage: '这一页，还没有写下故事。',
    footerDescription: '记录生活与想法。',
  },
  posts: {
    perPage: 10,
    homeLimit: 4,
    menuLimit: 12,
    randomLimit: 12,
    dateFormat: { year: 'numeric', month: 'short', day: 'numeric' },
    showDraftsInDev: true,
  },
  sidebar: {
    items: [
      {
        id: 'home',
        type: 'builtin',
        route: 'home',
        label: '首页',
        icon: 'square-pen',
      },
      {
        id: 'posts',
        type: 'builtin',
        route: 'posts',
        label: '文章',
        icon: 'files',
      },
      {
        id: 'links',
        type: 'builtin',
        route: 'links',
        label: '友链',
        icon: 'link',
      },
      { id: 'about', type: 'page', page: 'about', label: '关于', icon: 'info' },
    ],
    menu: [
      { id: 'home', type: 'builtin', route: 'home', label: '首页' },
      { id: 'posts', type: 'builtin', route: 'posts', label: '文章' },
    ],
    width: { default: 340, min: 240, max: 480 },
  },
  appearance: {
    defaultTheme: 'system',
    pageTransition: 'fade',
    codeThemes: { light: 'github-light', dark: 'github-dark' },
    showCodeLineNumbers: false,
    categoryCoverStyle: 'thumbnail',
  },
  article: {
    math: true,
    mermaid: true,
    lightbox: true,
    callouts: true,
    toc: {
      enabled: true,
      minDepth: 2,
      maxDepth: 4,
      expandDelay: 1000,
      hideDelay: 800,
    },
    shareCover: {
      enabled: true,
      width: 1200,
      height: 630,
      background: '#f5f5f5',
      foreground: '#171717',
      accent: '#3b82f6',
    },
  },
  footer: {
    since: 2026,
    author: '博主',
    showAttribution: true,
    license: {
      label: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
  },
};

export default config;
