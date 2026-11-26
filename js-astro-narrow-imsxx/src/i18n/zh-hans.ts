/**
 * Chinese (Simplified) UI copy.
 * Key names follow the upstream hugo-narrow i18n/zh-hans.toml so translations
 * can be diffed against the source.
 */
export const zhHans = {
  list: {
    pages: (n: number) => `${n} 个页面`,
    terms: (n: number) => `${n} 项`,
  },
  article: {
    empty: "暂无内容",
    relatedContent: "相关内容",
    prev: "上一篇",
    next: "下一篇",
    alert: {
      note: "注意",
      tip: "提示",
      important: "重要",
      caution: "小心",
      warning: "警告",
    },
    updated: "更新于",
    readingTime: (n: number) => `${n} 分钟`,
    wordCount: (n: number) => `${n} 字`,
  },
  code: {
    copy: "复制",
    copied: "已复制",
    expand: "展开",
    collapse: "折叠",
  },
  nav: {
    home: "首页",
    anchor: "链接到此部分",
    backHome: "返回首页",
    breadcrumb: "面包屑导航",
    menu: "菜单",
    prev: "上一页",
    next: "下一页",
    pageInfo: (current: number, total: number) =>
      `第 ${current} 页，共 ${total} 页`,
  },
  ui: {
    skipToContent: "跳到正文",
    language: "语言",
    announcementDismiss: "关闭公告",
    dockAriaLabel: "快捷操作工具栏",
    dockSearch: "搜索",
    dockComments: "评论",
    dockBackToTop: "返回顶部",
    toc: "目录",
    tocPin: "固定目录",
    tocUnpin: "取消固定目录",
    tocClose: "关闭目录",
    galleryLayoutSwitch: "切换图库布局",

    searchClear: "清空",
    searchPlaceholder: "搜索文章...",
    searchClose: "关闭",
    searchEmpty: "开始搜索",
    searchLoading: "搜索中...",
    searchNoResults: "未找到结果",
    searchResultsCount: (n: number) => `找到 ${n} 个结果`,
    searchHints: ["导航", "选择", "关闭", "快捷键"],

    themeDark: "暗色",
    themeLight: "亮色",
    themeSystem: "跟随系统",

    contentWidth: "页面宽度",
    contentWidthReset: "恢复默认",
    backdropBlur: "背景磨砂",
    backdropBlurReset: "恢复默认",
    grainSize: "背景噪点",
    grainSizeReset: "恢复默认",

    appearanceToggle: "外观设置",
    colorScheme: "配色方案",
    themeMode: "明暗模式",
  },
  comments: {
    title: "评论",
    notConfigured: "评论系统未配置",
  },
  home: {
    featuredProjects: "特色项目",
    viewAll: "查看全部",
    recentPosts: "最近文章",
  },
  resume: {
    experience: "工作经历",
    education: "教育背景",
    skills: "技能",
    certifications: "证书",
    languages: "语言能力",
  },
  notFound: {
    title: "页面未找到",
    message: "抱歉，你访问的页面不存在或已被移除。",
  },
  footer: {
    poweredBy: "由",
  },
  context: {
    seriesPrev: "上一部分",
    seriesNext: "下一部分",
    seriesPartOf: (current: number, total: number) =>
      `第 ${current} 篇，共 ${total} 篇`,
    seriesParts: "全部篇目",
    seriesViewSeries: "查看系列",
  },
  projects: {
    visit: "打开项目",
  },
}

export type Dict = typeof zhHans

/** Dictionaries for other locales may translate only part of the tree. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}
