export const siteConfig = {
  name: 'Compass',
  title: 'Compass - An Astro documentation theme',
  description:
    'Compass is a free Astro documentation theme for product docs, help centers, and knowledge bases, with fast static search and MDX components.',
  siteUrl: 'https://compass.xocoweb.workers.dev',
  language: 'en',
  locale: 'en_US',
  dateLocale: 'en-US',
  socialImage: '/og-image.png',
  repository: 'https://github.com/xocothemes/compass',
  /** Prepended to each article's file path for "Edit this page". Leave empty to hide the link. */
  editBaseUrl: 'https://github.com/xocothemes/compass/edit/main/',
  /** The button at the end of the header and in the mobile menu. */
  action: { label: 'GitHub', href: 'https://github.com/xocothemes/compass' },
  footerText: 'An Astro theme for product docs, help centers, and knowledge bases.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/xocothemes/compass' },
    { label: 'RSS', href: '/rss.xml' },
  ],
};

export const footerLinks = [
  { label: 'RSS feed', href: '/rss.xml' },
  { label: 'Sitemap', href: '/sitemap-index.xml' },
  { label: 'llms.txt', href: '/llms.txt' },
];
