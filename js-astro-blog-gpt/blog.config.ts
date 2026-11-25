import type { BlogConfig } from './src/types/config';

/** Frequent identity, copy and content settings come first; optional services follow reading defaults. */
const config: BlogConfig = {
  site: {
    title: 'BlogGPT',
    baseUrl: 'https://example.com/', // Include the deployment directory, e.g. https://example.com/blog/.
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    localePrefixPolicy: 'redirect-to-default', // Recommended: unprefixed pages refresh directly to the default language.
    timezone: 'Asia/Shanghai',
  },
  author: {
    name: 'Astro Theme BlogGPT',
    bio: {
      zh: '欢迎来到 BlogGPT 主题演示站点！',
      en: 'Welcome to the BlogGPT theme demo site!',
    },
    avatar: '/images/avatar.webp',
    socials: [
      {
        label: 'GitHub',
        icon: 'simple-icons:github',
        href: 'https://example.com/social/github',
      },
      {
        label: 'YouTube',
        icon: 'simple-icons:youtube',
        href: 'https://example.com/social/video',
      },
      {
        label: {
          zh: '电子邮件',
          en: 'Email',
        },
        icon: 'lucide:mail',
        href: 'mailto:hello@example.com',
      },
    ],
  },
  text: {
    siteDescription: {
      zh: '一个用 Astro 构建，受到 ChatGPT 布局启发的博客主题',
      en: "An Astro blog theme inspired by ChatGPT's layout.",
    },
    tabs: {
      search: {
        zh: '阅读',
        en: 'Read',
      },
      posts: {
        zh: '文章',
        en: 'Articles',
      },
    },
    homeHeading: {
      zh: '今天想读点什么？',
      en: 'What would you like to read today?',
    },
    searchHeading: {
      zh: '输入关键词，发现一篇文章',
      en: 'Enter keywords to discover an article',
    },
    searchPlaceholder: {
      zh: '搜索文章、想法与关键词',
      en: 'Search articles, ideas and keywords',
    },
    notFoundMessage: {
      zh: '这一页，还没有写下故事。',
      en: 'This page has no story yet.',
    },
    footerDescription: {
      zh: 'BlogGPT 主题演示 · 示例资料与内容均可替换。',
      en: 'BlogGPT theme demo · Sample content ready to customize.',
    },
  },
  posts: {
    perPage: 5,
    homeLimit: 4,
    menuLimit: 12, // Plus-menu articles; use 99999 to include all.
    randomLimit: 12, // Independent candidate count for the random button and /random.
    pathPrefix: '', // Optional date directory, e.g. [year]/ or [year]/[month]/.
    dateFormat: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    showDraftsInDev: true,
  },
  sidebar: {
    items: [
      {
        id: 'home',
        type: 'builtin',
        route: 'home',
        label: {
          zh: '首页',
          en: 'Home',
        },
        icon: 'square-pen',
      },
      {
        id: 'posts',
        type: 'builtin',
        route: 'posts',
        page: 'posts',
        label: {
          zh: '文章',
          en: 'Articles',
        },
        icon: 'files',
      },
      {
        id: 'categories',
        type: 'builtin',
        route: 'categories',
        page: 'categories',
        label: {
          zh: '分类',
          en: 'Categories',
        },
        icon: 'shapes',
      },
      {
        id: 'archives',
        type: 'builtin',
        route: 'archives',
        page: 'archives',
        label: {
          zh: '归档',
          en: 'Archives',
        },
        icon: 'archive',
      },
      {
        id: 'links',
        type: 'builtin',
        route: 'links',
        page: 'links',
        label: {
          zh: '友链',
          en: 'Friends',
        },
        icon: 'link',
      },
      {
        id: 'about',
        type: 'page',
        page: 'about',
        label: {
          zh: '关于',
          en: 'About',
        },
        icon: 'info',
      },
      {
        id: 'theme-github',
        type: 'external',
        href: 'https://github.com/Raincarnator/BlogGPT',
        newTab: true,
        label: {
          zh: 'Github 仓库',
          en: 'Github repository',
        },
        icon: 'simple-icons:github',
      },
      {
        id: 'docs',
        type: 'external',
        href: 'https://bloggpt.reincarnatey.net',
        newTab: true,
        label: {
          zh: 'BlogGPT 文档',
          en: 'BlogGPT docs',
        },
        icon: 'book-open',
      },
    ],
    menu: [
      {
        id: 'home',
        type: 'builtin',
        route: 'home',
        label: {
          zh: '首页',
          en: 'Home',
        },
        description: {
          zh: '搜索与近期文章',
          en: 'Search and recent articles',
        },
      },
      {
        id: 'posts',
        type: 'builtin',
        route: 'posts',
        page: 'posts',
        label: {
          zh: '文章',
          en: 'Articles',
        },
        description: {
          zh: '浏览所有文章',
          en: 'Browse all articles',
        },
      },
      {
        id: 'about',
        type: 'page',
        page: 'about',
        label: {
          zh: '关于',
          en: 'About',
        },
        description: {
          zh: '了解这个演示站',
          en: 'About this demo',
        },
      },
      {
        id: 'theme-github',
        type: 'external',
        href: 'https://github.com/Raincarnator/BlogGPT',
        newTab: true,
        label: {
          zh: 'Github 仓库',
          en: 'Github repository',
        },
      },
      {
        id: 'docs',
        type: 'external',
        href: 'https://bloggpt.reincarnatey.net',
        newTab: true,
        label: {
          zh: 'BlogGPT 文档',
          en: 'BlogGPT documentation',
        },
        description: {
          zh: '开始搭建你的博客',
          en: 'Build your own blog',
        },
      },
    ],
    width: {
      default: 340,
      min: 240,
      max: 480,
    },
  },
  appearance: {
    defaultTheme: 'system',
    pageTransition: 'fade',
    codeThemes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    showCodeLineNumbers: false,
    categoryCoverStyle: 'thumbnail',
  },
  article: {
    display: {
      author: true,
      published: true,
      readingTime: true,
      updated: true,
      tags: true,
      share: true,
      navigation: true,
      title: true,
    },
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
    since: 2024,
    author: 'Astro Theme BlogGPT',
    showAttribution: true,
    license: {
      label: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
  },
  sharing: {
    copyFormat: '{title}\n{description}\n{author} · {blog}\n{url}',
    platforms: [
      {
        name: 'X',
        icon: 'simple-icons:x',
        href: 'https://twitter.com/intent/tweet?text={title}&url={url}',
      },
      {
        name: 'Facebook',
        icon: 'simple-icons:facebook',
        href: 'https://www.facebook.com/sharer/sharer.php?u={url}',
      },
      {
        name: 'LinkedIn',
        icon: 'simple-icons:linkedin',
        href: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
      },
      {
        name: 'Reddit',
        icon: 'simple-icons:reddit',
        href: 'https://www.reddit.com/submit?url={url}&title={title}',
      },
      {
        name: 'Bluesky',
        icon: 'simple-icons:bluesky',
        href: 'https://bsky.app/intent/compose?text={text}',
      },
      {
        name: 'Threads',
        icon: 'simple-icons:threads',
        href: 'https://www.threads.net/intent/post?text={text}',
      },
      {
        name: 'Telegram',
        icon: 'simple-icons:telegram',
        href: 'https://t.me/share/url?url={url}&text={title}',
      },
      {
        name: 'WhatsApp',
        icon: 'simple-icons:whatsapp',
        href: 'https://wa.me/?text={text}',
      },
      {
        name: 'LINE',
        icon: 'simple-icons:line',
        href: 'https://social-plugins.line.me/lineit/share?url={url}',
      },
      {
        name: {
          zh: '微博',
          en: 'Weibo',
        },
        icon: 'simple-icons:sinaweibo',
        href: 'https://service.weibo.com/share/share.php?url={url}&title={title}&pic={image}',
      },
      {
        name: 'QQ',
        icon: 'simple-icons:qq',
        href: 'https://connect.qq.com/widget/shareqq/index.html?url={url}&title={title}&summary={description}&desc={description}&site={blog}&pics={image}',
      },
      {
        name: {
          zh: 'QQ 空间',
          en: 'QQ Space',
        },
        icon: 'simple-icons:qzone',
        href: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&summary={description}&pics={image}',
      },
      {
        name: 'Tumblr',
        icon: 'simple-icons:tumblr',
        href: 'https://www.tumblr.com/widgets/share/tool?canonicalUrl={url}&title={title}&caption={description}&posttype=link',
      },
      {
        name: 'Pinterest',
        icon: 'simple-icons:pinterest',
        href: 'https://www.pinterest.com/pin/create/button/?url={url}&media={image}&description={title}',
      },
      {
        name: {
          zh: '电子邮件',
          en: 'Email',
        },
        icon: 'lucide:mail',
        href: 'mailto:?subject={title}&body={text}',
      },
    ],
  },
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
};

export default config;
