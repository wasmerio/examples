# Configuration Reference

All global settings for your blog live in two TypeScript files at the root of your project:

- **`blog.config.ts`** — Site metadata, multi-language settings, appearance, sidebar navigation, Markdown enhancements, table of contents, sharing, statistics, and footer.
- **`friends.config.ts`** — Grouped blogroll / friends links.

## Required Fields and Defaults

BlogGPT checks the types and values in `blog.config.ts`. The repository includes a complete configuration to use as your starting point:

- **Essential settings**: You should always set `site.title`, `site.baseUrl`, `site.defaultLocale`, `site.locales`, and `author.name`.
- **Keep required fields**: Most fields under `appearance`, `sidebar.width`, `posts`, `article`, and `footer` must remain in your configuration; they are not filled in automatically. Optional settings include `site.localePrefixPolicy`, `posts.pathPrefix`, `article.display`, `article.toc.hideDelay`, `article.shareCover.fontPath`, `sharing`, and `statistics`. Fields marked with `?` in `src/types/config.ts` are optional.

## Multilingual `Localized` Values

Many text fields in `blog.config.ts` have the type `Localized`. A `Localized` field accepts **either**:

1. **A plain string** (used across all languages):
   ```ts
   title: 'Raincarnator Blog';
   ```
2. **A locale-keyed object** (displays the matching string for each language):
   ```ts
   title: {
     zh: 'Raincarnator 的博客',
     en: "Raincarnator's Blog",
   }
   ```

## Complete `blog.config.ts` Example

This example shows every configuration group. The title, author, and colors are sample values you can change. Empty navigation arrays leave those areas without links; see [Navigation](./navigation.md) to add them.

```ts
export default {
  // 1. Site Metadata & i18n
  site: {
    title: { zh: '我的博客', en: 'My Blog' }, // Localized (Required)
    baseUrl: 'https://example.com', // Canonical production URL
    defaultLocale: 'zh', // Primary locale code
    locales: ['zh', 'en'], // Enabled locale codes
    localePrefixPolicy: 'redirect-to-default', // 'redirect-to-default' | 'omit-default-prefix' | 'require-prefix'
    timezone: 'Asia/Shanghai', // IANA timezone string
  },

  // 2. Author Profile
  author: {
    name: { zh: '博主', en: 'Author' }, // Localized
    bio: { zh: '记录生活与想法。', en: 'Notes & ideas.' },
    avatar: '/favicon.svg', // Path in public/ or external URL
    socials: [
      { label: 'GitHub', icon: 'github', href: 'https://github.com/yourname' },
    ],
  },

  // 3. Custom UI Copy
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

  // 4. Visual Appearance & Code Blocks
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

  // 5. Sidebar Navigation & Dimensions
  sidebar: {
    items: [], // Primary navigation items
    menu: [], // Secondary menu links
    width: {
      default: 340,
      min: 240,
      max: 480,
    },
  },

  // 6. Post Lists & Pagination
  posts: {
    pathPrefix: '', // e.g. '[year]' or '[year]/[month]'
    perPage: 5,
    homeLimit: 4,
    menuLimit: 12,
    randomLimit: 12,
    showDraftsInDev: true,
    dateFormat: { year: 'numeric', month: 'short', day: 'numeric' },
  },

  // 7. Article Enhancements, TOC & Share Cover
  article: {
    math: true, // KaTeX math formulas
    mermaid: true, // Mermaid diagrams
    lightbox: true, // Image zoom on click
    callouts: true, // Callout blocks
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

  // 8. Social Sharing
  sharing: {
    copyFormat: '{title}\n{description}\n{author} · {blog}\n{url}',
    platforms: [],
  },

  // 9. Site Statistics & Heatmap
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

  // 10. Footer & Copyright
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
