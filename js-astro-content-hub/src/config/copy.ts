// Instance copy - the strings and names that make this site "your site".
// Rebrand by editing THIS file: site name, UI strings, landing copy, and
// product-page copy. The i18n machinery around it lives in src/lib/i18n.ts,
// which re-exports everything here so existing imports keep working.
//
// Adding a language: append the locale to `locales` in src/lib/i18n.ts, then
// add a matching block to every table below. Every table is typed
// `Record<Locale, …>` seeded from the `en` entry, so a missing locale (or a
// key that drifts from the `en` seed) is a compile error.

import type { Locale } from '../lib/i18n';

/** Site name - set this to your project's name. Used in <title>, nav, footer. */
export const siteName = 'Astro Content Hub';

/** UI strings per locale. `t.en` is the canonical shape; every other locale must
 *  match it exactly. `fallbackNotice` is shown when a page renders the default
 *  language content because no localized version exists. */
const tEn = {
  home: 'Home',
  posts: 'Posts',
  docs: 'Docs',
  breadcrumbDocs: 'Docs',
  products: 'Products',
  ctaGitHub: 'GitHub',
  productsPageEyebrow: 'Catalog',
  productsPageTitle: 'Products',
  productsPageLead: 'Every project that ships docs and posts in this hub.',
  viewAllProducts: 'All products',
  toggleMenu: 'Toggle menu',
  builtWith: 'Built with awareness.',
  footerTagline: 'A content hub for open-source projects, written in the open.',
  noTranslation: 'No translation available',
  noPages: 'No pages yet.',
  fallbackNotice: '',
  postsListEyebrow: 'Blog',
  postsListTitle: 'Posts',
  postsListLead:
    'Thoughts on developer tooling, bundle analysis, perception, and building with awareness.',
  postsDescription:
    'Technical articles from the content hub — guides, notes, and announcements.',
  noPosts: 'No posts yet. Check back soon.',
  allPostsBack: '← All Posts',
  relatedPosts: 'Related posts',
  byAuthor: 'by {author}',
  viewSource: 'View source →',
  tagEyebrow: 'Tag',
  tagLead: '{n} post{s}',
  tagDescription: 'Posts tagged {label}',
  previous: '← Previous',
  next: 'Next →',
  searchOpen: 'Open search',
  searchClose: 'Close search',
  searchPlaceholder: 'Search…',
  searchScopeAll: 'All',
  searchScopePosts: 'Posts',
  searchScopeDocs: 'Docs',
  searchScopeProducts: 'Products',
  searchNoResults: 'No results found',
  searchLoading: 'Searching…',
  searchResultsFor: 'Results for {query}',
  searchError: 'Search is unavailable right now. Try again later.',
  searchHint: 'Search docs, posts, and products across the hub',
  searchMatchCount: '{n} result',
  searchMatchCountPlural: '{n} results',
};
export type UIStrings = typeof tEn;
export const t: Record<Locale, UIStrings> = {
  en: tEn,
  'zh-Hans': {
    home: '首页',
    posts: '博客',
    docs: '文档',
    breadcrumbDocs: '文档',
    products: '产品',
    ctaGitHub: 'GitHub',
    productsPageEyebrow: '目录',
    productsPageTitle: '产品',
    productsPageLead: '本中心收录了所有提供文档与文章的项目。',
    viewAllProducts: '全部产品',
    toggleMenu: '切换菜单',
    builtWith: '用心构建。',
    footerTagline: '为开源项目打造的内容中心,以开放方式撰写。',
    noTranslation: '暂无中文翻译',
    noPages: '暂无页面。',
    fallbackNotice: '此页暂无中文翻译,以下显示英文原文。',
    postsListEyebrow: '博客',
    postsListTitle: '文章',
    postsListLead:
      '关于开发工具、bundle 分析、感知,以及以觉察之心构建的思考。',
    postsDescription: '内容中心的技术文章 —— 指南、笔记与公告。',
    noPosts: '暂无文章,敬请期待。',
    allPostsBack: '← 全部文章',
    relatedPosts: '相关文章',
    byAuthor: '作者:{author}',
    viewSource: '查看源码 →',
    tagEyebrow: '标签',
    tagLead: '共 {n} 篇文章',
    tagDescription: '标签为 {label} 的文章',
    previous: '← 上一篇',
    next: '下一篇 →',
    searchOpen: '打开搜索',
    searchClose: '关闭搜索',
    searchPlaceholder: '搜索…',
    searchScopeAll: '全部',
    searchScopePosts: '博客',
    searchScopeDocs: '文档',
    searchScopeProducts: '产品',
    searchNoResults: '未找到结果',
    searchLoading: '搜索中…',
    searchResultsFor: '“{query}” 的搜索结果',
    searchError: '搜索暂不可用,请稍后重试。',
    searchHint: '搜索整个中心的文档、博客与产品',
    searchMatchCount: '{n} 条结果',
    searchMatchCountPlural: '{n} 条结果',
  },
};

/** Landing page copy, per locale. Kept separate from `t` (small UI strings)
 *  because the landing page has a lot of long-form marketing text.
 *  This is original sample copy - replace it with your own. */
const homeEn = {
  title: 'Astro Content Hub',
  description: 'A content hub that aggregates documentation and posts from many open-source projects, with per-page localization and free auto-deploy.',
  eyebrow: 'Open Source Content Hub',
  heroTitleA: 'One hub for your',
  heroTitleB: 'docs and posts.',
  heroLead: 'Publish documentation and blog posts from many repositories into a single, fast, localized static site. Content ships through pull requests, so nothing lands on main without review.',
  ctaGithub: 'View on GitHub',
  ctaProjects: 'Documentation',
  latestEyebrow: 'Latest',
  latestTitle: 'From the blog',
  allPosts: 'All Posts ->',
  focusEyebrow: 'Why this starter',
  focusTitle: 'Built for content, not config',
  focusLead: 'The hard parts - i18n with per-page fallback, content collections, and free deployment - are already solved. You write Markdown; the hub builds and deploys.',
  card1Title: 'Content collections',
  card1Body: 'Posts and docs are typed Markdown loaded from the filesystem. Frontmatter is validated before content ever reaches the site.',
  card2Title: 'Localized by design',
  card2Body: 'Every page has an English default and a Chinese shell. Missing translations fall back gracefully instead of 404-ing.',
  card3Title: 'Zero-config styling',
  card3Body: 'A single global stylesheet with design tokens. Components stay small; Markdown reuses shared prose typography.',
  productsEyebrow: 'Products',
  productsTitle: 'Products in this hub',
  learnMore: 'Learn More',
  principlesEyebrow: 'Principles',
  principlesTitle: 'How we build',
  principle1Title: 'Open by default',
  principle1Body: 'Source code, decisions, and content are shared with the community.',
  principle2Title: 'Reviewed before ship',
  principle2Body: 'External content arrives as a pull request, so a human reviews it before it publishes.',
  principle3Title: 'Localized',
  principle3Body: 'A missing translation never breaks a link - it shows the default language with a notice.',
  principle4Title: 'Free to deploy',
  principle4Body: 'Static output deploys to GitHub Pages and Cloudflare Pages at no cost.',
  ctaTitle: 'Start your hub',
  ctaBody: 'Fork the template, point it at your domain, and copy an example repo to begin contributing content.',
  ctaGithubOrg: 'View the template on GitHub',
  homeStatsEyebrow: 'By the numbers',
  homeStatsTitle: 'Small, fast, focused',
  homeStatsProducts: 'Products',
  homeStatsLocales: 'Locales',
  homeStatsPages: 'Pages built',
};
export type HomeCopy = typeof homeEn;
export const home: Record<Locale, HomeCopy> = {
  en: homeEn,
  'zh-Hans': {
    title: 'Astro Content Hub',
    description: '聚合多个开源项目的文档与文章的内容中心,支持逐页本地化,并可免费自动部署。',
    eyebrow: '开源内容中心',
    heroTitleA: '一个汇聚你所有',
    heroTitleB: '文档与文章的中心。',
    heroLead: '将多个仓库中的文档与博客文章发布到同一个快速、本地化的静态站点。内容通过拉取请求进入,任何内容在上线前都经过人工审阅。',
    ctaGithub: '在 GitHub 上查看',
    ctaProjects: '文档',
    latestEyebrow: '最新',
    latestTitle: '来自博客',
    allPosts: '全部文章 ->',
    focusEyebrow: '为何选择此模板',
    focusTitle: '为内容而生,而非配置',
    focusLead: '棘手的部分 -- 带逐页回退的 i18n、内容集合、免费部署 -- 已经为你解决。你只需写 Markdown,中心负责构建与部署。',
    card1Title: '内容集合',
    card1Body: '文章与文档是从文件系统加载的带类型 Markdown。内容到达站点之前,Frontmatter 即经过校验。',
    card2Title: '原生本地化',
    card2Body: '每个页面都有英文默认版与中文外壳。缺失的翻译会优雅回退,而非返回 404。',
    card3Title: '零配置样式',
    card3Body: '单一全局样式表配合设计变量。组件保持精简,Markdown 复用统一的排版样式。',
    productsEyebrow: '产品',
    productsTitle: '本中心收录的产品',
    learnMore: '了解更多',
    principlesEyebrow: '原则',
    principlesTitle: '我们如何构建',
    principle1Title: '默认开放',
    principle1Body: '源代码、决策与内容都与社区共享。',
    principle2Title: '上线前审阅',
    principle2Body: '外部内容以拉取请求形式进入,因此在发布前会经过人工审阅。',
    principle3Title: '本地化',
    principle3Body: '缺失的翻译不会破坏链接 -- 它会以提示方式展示默认语言版本。',
    principle4Title: '免费部署',
    principle4Body: '静态输出可零成本部署到 GitHub Pages 与 Cloudflare Pages。',
    ctaTitle: '开始你的中心',
    ctaBody: '复刻模板,指向你的域名,并复制一个示例仓库即可开始贡献内容。',
    ctaGithubOrg: '在 GitHub 上查看模板',
    homeStatsEyebrow: '数据一览',
    homeStatsTitle: '小巧、快速、专注',
    homeStatsProducts: '产品数',
    homeStatsLocales: '语言数',
    homeStatsPages: '构建页数',
  },
};

/** Generic copy for a product detail page. Product-specific fields (name,
 *  github, badges) come from the `products` array in `site.config.ts` (repo root);
 *  this supplies the surrounding labels, which are identical across products. */
const productCopyEn = {
  metaDescription: '{name} — open-source project documentation and posts.',
  heroBadge: 'Open Source',
  documentation: 'Documentation',
  viewSource: 'View Source',
  learnMore: 'Learn More',
  docsEyebrow: 'Documentation',
  docsTitle: 'Docs',
  readDocs: 'Read the Docs',
  ctaTitle: 'Explore the project',
  ctaBody: 'Read the documentation or browse the source on GitHub.',
  ctaPrimary: 'View on GitHub',
  ctaSecondary: 'Read the Docs',
};
export type ProductCopy = typeof productCopyEn;
export const productCopy: Record<Locale, ProductCopy> = {
  en: productCopyEn,
  'zh-Hans': {
    metaDescription: '{name} —— 开源项目文档与文章。',
    heroBadge: '开源',
    documentation: '文档',
    viewSource: '查看源码',
    learnMore: '了解更多',
    docsEyebrow: '文档',
    docsTitle: '文档',
    readDocs: '阅读文档',
    ctaTitle: '深入了解项目',
    ctaBody: '阅读文档,或在 GitHub 上浏览源码。',
    ctaPrimary: '在 GitHub 上查看',
    ctaSecondary: '阅读文档',
  },
};

/** Organization copy - the front door of the hub. This is the *organization's*
 *  story (who you are, what you build, how to reach you), shown on the landing
 *  page's mission section and available to any page that wants an org intro.
 *  Rebrand by editing THIS block; per-locale like every other copy table. */
const orgEn = {
  eyebrow: 'The Organization',
  title: 'Who we are',
  mission:
    'We build open-source developer tools and documentation in the open. Every project in this hub ships its own docs and product page — and everything lands here through a reviewed pull request.',
  linksLabel: 'Connect',
  links: [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Contact', href: 'https://github.com/awareride/astro-content-hub/issues' },
  ],
};
export type OrgCopy = typeof orgEn;
export const org: Record<Locale, OrgCopy> = {
  en: orgEn,
  'zh-Hans': {
    eyebrow: '组织',
    title: '我们是谁',
    mission:
      '我们以开放方式构建开源开发者工具与文档。本中心里的每个项目都自带文档与产品页 —— 而所有内容都通过经审阅的拉取请求汇聚到这里。',
    linksLabel: '联系我们',
    links: [
      { label: 'GitHub', href: 'https://github.com' },
      { label: '联系我们', href: 'https://github.com/awareride/astro-content-hub/issues' },
    ],
  },
};
