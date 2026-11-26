export const SITE = {
  title: 'Imprint',
  shortTitle: 'Imprint',
  description: 'Notes on software, systems, and the work behind them.',
  author: process.env.IMPRINT_AUTHOR ?? 'Your Name',
  url: process.env.IMPRINT_SITE_URL ?? 'https://example.com',
  basePath: process.env.IMPRINT_BASE_PATH ?? '/',
  language: 'en',
  htmlLang: 'en',
  locale: 'en-US',
  timeZone: 'UTC',
  pageSize: 10,
  avatar: '/avatar.svg',
  hero: {
    title: 'Write things down. Leave an imprint.',
    subtitle: 'Field notes on building, operating, and understanding technology.',
  },
  navigation: {
    github: process.env.IMPRINT_GITHUB_URL ?? 'https://github.com/your-name',
  },
  footer: {
    licenseName: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
} as const;
