import { defineConfig } from 'vitepress';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { englishTheme, englishSearch } from './english';
export default defineConfig({
  lang: 'zh-CN',
  title: 'BlogGPT',
  description: 'astro-theme-BlogGPT 使用文档',
  base: process.env.DOCS_BASE ?? '/',
  cleanUrls: true,
  appearance: true,
  lastUpdated: true,
  async transformPageData(page, { siteConfig }) {
    // Git supplies publication history; source archives still have file mtimes.
    if (
      !page.lastUpdated &&
      page.frontmatter.lastUpdated !== false &&
      page.frontmatter.layout !== 'home'
    ) {
      page.lastUpdated = (
        await stat(resolve(siteConfig.srcDir, page.filePath))
      ).mtimeMs;
    }
  },
  locales: {
    root: { label: '简体中文', lang: 'zh-CN', link: '/' },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'astro-theme-BlogGPT documentation',
      themeConfig: englishTheme,
    },
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: `${(process.env.DOCS_BASE ?? '/').replace(/\/$/, '')}/logo.svg`,
      },
    ],
  ],
  themeConfig: {
    langMenuLabel: '语言',
    logo: '/logo.svg',
    siteTitle: 'BlogGPT 文档',
    skipToContentLabel: '跳转到正文',
    notFound: {
      title: '页面不存在',
      quote: '这个地址没有对应的文档。',
      linkLabel: '返回首页',
      linkText: '返回首页',
    },
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '配置', link: '/config/reference' },
      { text: 'DIY', link: '/customization/hooks' },
    ],
    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '认识 BlogGPT', link: '/guide/overview' },
          { text: '安装与预览', link: '/guide/getting-started' },
          { text: '构建与部署', link: '/guide/deployment' },
        ],
      },
      {
        text: '内容管理',
        items: [
          { text: '目录与网址', link: '/content/organization' },
          { text: 'Frontmatter', link: '/content/frontmatter' },
          { text: '语言版本与回退', link: '/content/languages' },
          { text: '内容包与附件', link: '/content/bundles' },
          { text: '分类、标签和页面', link: '/content/taxonomy' },
          { text: 'Archetype 模板', link: '/content/archetypes' },
        ],
      },
      {
        text: '主题配置',
        items: [
          { text: '完整配置参考', link: '/config/reference' },
          { text: '站点与外观', link: '/config/site' },
          { text: '导航、作者和友链', link: '/config/navigation' },
          { text: '文章增强', link: '/config/enhancements' },
          { text: '阅读、分享与统计', link: '/config/reading' },
          { text: '交互式文章目录', link: '/config/toc' },
        ],
      },
      {
        text: '扩展与维护',
        items: [
          { text: '全站 HTML / CSS / JS', link: '/customization/hooks' },
          { text: '迁移现有博客', link: '/guide/migration' },
          { text: '常见问题', link: '/guide/faq' },
        ],
      },
    ],
    search: {
      provider: 'local',
      options: {
        locales: { en: { translations: englishSearch } },
        miniSearch: {
          options: {
            tokenize: (text) =>
              [
                ...new Intl.Segmenter('zh', { granularity: 'word' }).segment(
                  text,
                ),
              ]
                .filter((part) => part.isWordLike)
                .map((part) => part.segment),
          },
        },
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到相关内容',
            resetButtonTitle: '清除搜索',
            displayDetails: '显示详细列表',
            backButtonTitle: '关闭搜索',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换为浅色模式',
    darkModeSwitchTitle: '切换为深色模式',
    editLink: {
      pattern:
        'https://github.com/Raincarnator/BlogGPT/edit/main/apps/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'long',
        timeStyle: 'medium',
        forceLocale: true,
      },
    },
    footer: {
      message: 'BlogGPT · 使用文档',
      copyright:
        'Documentation released under the MIT License. Copyright © 2026 Raincarnator',
    },
  },
});
