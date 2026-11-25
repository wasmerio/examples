// 站点基础信息：用于 Header、SEO、RSS、sitemap 与页脚。
export const SITE_TITLE = "LogFlow Theme";
export const SITE_DESCRIPTION = "A compact Astro theme for writing and publishing.";
export const SITE_URL = "https://example.com";
export const COPYRIGHT_NAME = "LogFlow Theme";

// 静态页面标题与概述：同时用于页面标题区域和 SEO description。
export const PAGE_COPY = {
  blog: {
    title: "文章",
    description: "按时间浏览全部文章。",
    descriptionItalic: false,
  },
  collections: {
    title: "专题",
    description: "按系列阅读相关文章。",
    descriptionItalic: false,
  },
  tags: {
    title: "标签",
    description: "按主题浏览全部文章。",
    descriptionItalic: false,
  },
  years: {
    title: "文章归档",
    description: "按发布时间浏览全部文章。",
    descriptionItalic: false,
  },
  friends: {
    title: "友链",
    description: "收藏一些值得长期拜访的个人站点。",
    descriptionItalic: false,
  },
  about: {
    title: "关于",
    description: "关于作者、本站和内容授权。",
    descriptionItalic: false,
  },
} as const;

// Header 导航入口。
export const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "文章" },
  { href: "/friends", label: "友链" },
  { href: "/about", label: "关于" },
] as const;

// 页脚社交链接；icon 对应 SocialIcon 内置图标键名。
export const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/kevynf/logflow-theme",
    icon: "social/github",
  },
] as const;

// 首页个人信息与内容数量。
export const HOME = {
  avatar: {
    src: "/favicon.svg",
    alt: "LogFlow Theme avatar",
  },
  motto: "Build in public.",
  description: "一个窄版、紧凑的 Astro 博客主题。",
  recentPostsLimit: 6,
} as const;

// 首页 GitHub 贡献图。
export const GH_CONTRIBUTE = {
  title: "GitHub 活跃度",
  description: "最近一年的开源贡献记录",
  username: "octocat",
  profileUrl: "https://github.com/octocat",
  errorMessage: "GitHub 贡献图暂时不可用。",
} as const;

// 静态全文搜索；关闭后 Header 不渲染搜索入口。
export const SEARCH = {
  enabled: true,
  maxResults: 8,
} as const;

// 友链数据维护在独立文件中。
export { FRIEND_LINKS } from "./config/friend-links";

// 评论系统配置，当前提供方为 giscus。
export const COMMENTS = {
  enabled: false,
  provider: "giscus",
  repo: "owner/repository",
  repoId: "",
  category: "Announcements",
  categoryId: "",
  mapping: "pathname",
  themeLight: "light_protanopia",
  themeDark: "transparent_dark",
  lang: "zh-CN",
} as const;
