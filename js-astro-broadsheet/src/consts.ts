import type { Metadata, NavLink, Site } from "@types";

/**
 * 站点信息。使用模板时优先修改这个文件。
 */
export const SITE: Site = {
  TITLE: "Broadsheet",
  // 页头与页脚展示的品牌字样
  WORDMARK: "Broadsheet",
  DESCRIPTION: "一个报刊式排版的 Astro 博客模板，适合写技术文章与项目记录。",
  TAGLINE: "记录技术、实践与持续学习。",
  // 影响 <html lang> 与日期、标签排序的语言
  LOCALE: "zh-CN",
  AUTHOR: {
    NAME: "Your Name",
    // 侧栏头像占位文字，建议 1—2 个字符
    INITIALS: "BS",
    ROLE: "全栈工程师",
    SLOGAN: "记录技术、实践与持续学习。",
  },
};

/** 页头主导航（首页链接已固定存在，无需在此重复） */
export const NAV_LINKS: NavLink[] = [
  { href: "/blog", label: "归档" },
  { href: "/about", label: "关于" },
  { href: "/projects", label: "项目" },
];

/** 页脚导航 */
export const FOOTER_LINKS: NavLink[] = [
  { href: "/blog", label: "归档" },
  { href: "/about", label: "关于" },
  { href: "/projects", label: "项目" },
  { href: "/tags", label: "标签" },
  { href: "/rss.xml", label: "RSS" },
];

/** 侧栏与关于页展示的常用技术，留空数组即可隐藏该区块 */
export const STACK: string[] = [
  "Astro",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Node.js",
];

/** 各页面的标题与描述，用于 <title> 与 SEO */
export const HOME: Metadata = {
  TITLE: "首页",
  DESCRIPTION: "一个报刊式排版的 Astro 博客模板，适合写技术文章与项目记录。",
};

export const BLOG: Metadata = {
  TITLE: "文章",
  DESCRIPTION: "全部文章与随笔。",
};

export const PROJECTS: Metadata = {
  TITLE: "项目",
  DESCRIPTION: "参与和创建的项目。",
};

export const TAGS: Metadata = {
  TITLE: "标签",
  DESCRIPTION: "按主题浏览文章。",
};

export const ABOUT: Metadata = {
  TITLE: "关于",
  DESCRIPTION: "关于站点作者与这个博客。",
};
