const siteOrigin = (import.meta.env.SITE_URL ?? 'https://example.org').replace(/\/$/, '');
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const siteUrl = `${siteOrigin}${basePath}`;

export const site = {
  name: 'A Quiet Publication',
  title: 'A Quiet Publication · 静态个人出版物模板',
  description: '写作、专栏、项目、研究与影像放在同一套静态档案里。这是 Fourfold 的示例站点。',
  url: siteUrl,
  author: {
    name: 'Site Author',
    bio: '示例作者。关心个人网站如何被长期维护：写作如何归档，项目如何留下状态，研究如何标出版本。',
    email: '',
  },
  locale: 'zh-cn',
  locales: ['zh-cn', 'en'] as const,
  writingPageSize: 8,
  tagIndexThreshold: 1,
  license: {
    name: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  },
  social: [
    { label: 'GitHub', href: 'https://github.com/Liyuk/astro-fourfold' },
  ] as Array<{ label: string; href: string }>,
  features: {
    search: true,
    favorites: true,
    theme: true,
    rss: true,
    share: true,
    tips: false,
    newsletter: false,
    comments: false,
  },
} as const;

export type Locale = (typeof site.locales)[number];
