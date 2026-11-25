import type { DefaultTheme } from 'vitepress';

export const englishTheme: DefaultTheme.Config = {
  siteTitle: 'BlogGPT Docs',
  langMenuLabel: 'Language',
  skipToContentLabel: 'Skip to content',
  notFound: {
    title: 'Page not found',
    quote: 'There is no documentation at this address.',
    linkLabel: 'Back to home',
    linkText: 'Back to home',
  },
  nav: [
    { text: 'Guide', link: '/en/guide/getting-started' },
    { text: 'Configuration', link: '/en/config/reference' },
    { text: 'DIY', link: '/en/customization/hooks' },
  ],
  sidebar: [
    {
      text: 'Getting started',
      items: [
        { text: 'Meet BlogGPT', link: '/en/guide/overview' },
        { text: 'Installation and preview', link: '/en/guide/getting-started' },
        { text: 'Build and deploy', link: '/en/guide/deployment' },
      ],
    },
    {
      text: 'Content',
      items: [
        { text: 'Files and URLs', link: '/en/content/organization' },
        { text: 'Frontmatter', link: '/en/content/frontmatter' },
        { text: 'Languages and translations', link: '/en/content/languages' },
        { text: 'Bundles and attachments', link: '/en/content/bundles' },
        { text: 'Categories, tags and pages', link: '/en/content/taxonomy' },
        { text: 'Archetypes', link: '/en/content/archetypes' },
      ],
    },
    {
      text: 'Configuration',
      items: [
        { text: 'Complete reference', link: '/en/config/reference' },
        { text: 'Site and appearance', link: '/en/config/site' },
        {
          text: 'Navigation, author and friends',
          link: '/en/config/navigation',
        },
        { text: 'Content enhancements', link: '/en/config/enhancements' },
        { text: 'Reading, sharing and statistics', link: '/en/config/reading' },
        { text: 'Interactive outline', link: '/en/config/toc' },
      ],
    },
    {
      text: 'Extensions and maintenance',
      items: [
        { text: 'Site-wide HTML / CSS / JS', link: '/en/customization/hooks' },
        { text: 'Migration', link: '/en/guide/migration' },
        { text: 'FAQ', link: '/en/guide/faq' },
      ],
    },
  ],
  outline: { level: [2, 3], label: 'On this page' },
  docFooter: { prev: 'Previous page', next: 'Next page' },
  sidebarMenuLabel: 'Menu',
  returnToTopLabel: 'Back to top',
  darkModeSwitchLabel: 'Appearance',
  lightModeSwitchTitle: 'Switch to light mode',
  darkModeSwitchTitle: 'Switch to dark mode',
  editLink: {
    pattern:
      'https://github.com/Raincarnator/BlogGPT/edit/main/apps/docs/:path',
    text: 'Edit this page on GitHub',
  },
  lastUpdated: {
    text: 'Last updated',
    formatOptions: {
      dateStyle: 'long',
      timeStyle: 'medium',
      forceLocale: true,
    },
  },
  footer: {
    message: 'BlogGPT · Documentation',
    copyright:
      'Documentation released under the MIT License. Copyright © 2026 Raincarnator',
  },
};

export const englishSearch = {
  button: { buttonText: 'Search docs', buttonAriaLabel: 'Search docs' },
  modal: {
    noResultsText: 'No results found',
    resetButtonTitle: 'Clear search',
    displayDetails: 'Show detailed list',
    backButtonTitle: 'Close search',
    footer: {
      selectText: 'Select',
      navigateText: 'Navigate',
      closeText: 'Close',
    },
  },
};
