# 配置参考

BlogGPT 的全局配置集中在项目根目录的两个 TypeScript 文件中：

- **`blog.config.ts`** — 站点基础信息、多语言策略、主题外观、侧栏导航、正文增强、目录（TOC）、社交分享、写作统计与页脚版权。
- **`friends.config.ts`** — 分组管理的友情链接列表。

## 必填项与默认值说明

BlogGPT 会校验 `blog.config.ts` 的类型与配置值。仓库已提供完整配置，建议在此基础上修改：

- **核心必填/建议修改项**：部署前请修改 `site.title`、`site.baseUrl`、`site.defaultLocale`、`site.locales` 以及 `author.name`。
- **保留必需配置**：`appearance`、`sidebar.width`、`posts`、`article` 和 `footer` 中的大多数字段仍需保留，不会自动补齐。可省略的设置包括 `site.localePrefixPolicy`、`posts.pathPrefix`、`article.display`、`article.toc.hideDelay`、`article.shareCover.fontPath`，以及 `sharing`、`statistics`；具体以 `src/types/config.ts` 中带 `?` 的字段为准。

## 多语言文字类型（`Localized`）

在配置文档中，许多文本属性的类型被标注为 `Localized`。这意味着你可以传入**以下任意一种格式**：

1. **普通字符串**（所有语言共用同一段文字）：
   ```ts
   title: 'Raincarnator 的博客';
   ```
2. **按语言区分的对象**（根据当前界面语言自动展示对应文字）：
   ```ts
   title: {
     zh: 'Raincarnator 的博客',
     en: "Raincarnator's Blog",
   }
   ```

## `blog.config.ts` 完整配置示例

下面展示各配置分组的写法；标题、作者和配色是示例值，可按喜好修改。空导航数组表示暂不添加入口，实际使用时可参考[导航配置](./navigation.md)补充。

```ts
export default {
  // 1. 站点信息与多语言
  site: {
    title: { zh: '我的博客', en: 'My Blog' }, // Localized（必填）
    baseUrl: 'https://example.com', // 正式环境的完整域名
    defaultLocale: 'zh', // 默认语言代码
    locales: ['zh', 'en'], // 启用的语言代码列表
    localePrefixPolicy: 'redirect-to-default', // 'redirect-to-default' | 'omit-default-prefix' | 'require-prefix'
    timezone: 'Asia/Shanghai', // 时区（IANA 格式）
  },

  // 2. 作者名片与社交链接
  author: {
    name: { zh: '博主', en: 'Author' }, // Localized
    bio: { zh: '记录生活与想法。', en: 'Notes & ideas.' },
    avatar: '/favicon.svg', // public/ 下的路径或外部图片 URL
    socials: [
      { label: 'GitHub', icon: 'github', href: 'https://github.com/yourname' },
    ],
  },

  // 3. 界面提示文案
  text: {
    siteDescription: { zh: '个人博客', en: 'Personal blog' },
    homeHeading: { zh: '今天想读点什么？', en: 'What would you like to read?' },
    searchHeading: { zh: '搜索文章', en: 'Search posts' },
    searchPlaceholder: { zh: '输入关键词...', en: 'Type keywords...' },
    notFoundMessage: { zh: '页面未找到', en: 'Page not found' },
    footerDescription: { zh: '', en: '' },
    tabs: {
      search: { zh: '搜索', en: 'Search' },
      posts: { zh: '文章', en: 'Posts' },
    },
  },

  // 4. 视觉外观与代码高亮
  appearance: {
    defaultTheme: 'system', // 'light' | 'dark' | 'system'
    pageTransition: 'fade', // 'fade' | 'none'
    codeThemes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    showCodeLineNumbers: false,
    categoryCoverStyle: 'thumbnail', // 'thumbnail' | 'fade' | 'background'
  },

  // 5. 侧边栏导航与宽度限制
  sidebar: {
    items: [], // 主导航链接
    menu: [], // 次级菜单链接
    width: {
      default: 340,
      min: 240,
      max: 480,
    },
  },

  // 6. 文章列表与分页
  posts: {
    pathPrefix: '', // 如 '[year]' 或 '[year]/[month]'
    perPage: 5,
    homeLimit: 4,
    menuLimit: 12,
    randomLimit: 12,
    showDraftsInDev: true,
    dateFormat: { year: 'numeric', month: 'short', day: 'numeric' },
  },

  // 7. 正文增强、目录（TOC）与动态分享卡片
  article: {
    math: true, // KaTeX 数学公式
    mermaid: true, // Mermaid 图表
    lightbox: true, // 图片点击放大
    callouts: true, // Callouts 提示块
    display: {
      title: true,
      author: true,
      published: true,
      updated: true,
      readingTime: true,
      tags: true,
      share: true,
      navigation: true,
    },
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

  // 8. 社交分享
  sharing: {
    copyFormat: '{title}\n{description}\n{author} · {blog}\n{url}',
    platforms: [],
  },

  // 9. 写作统计与热力图
  statistics: {
    enabled: true,
    articleCount: true,
    wordCount: true,
    days: true,
    languages: true,
    averageWords: true,
    updateFrequency: true,
    firstPublication: true,
    lastUpdate: true,
    heatmap: true,
    recentWords: true,
    recentLimit: 12,
  },

  // 10. 页脚与版权许可
  footer: {
    since: 2024,
    author: 'Astro Theme BlogGPT',
    showAttribution: true,
    license: {
      label: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
  },
};
```
