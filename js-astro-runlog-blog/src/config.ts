import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { z } from 'astro/zod';

const configFile = path.resolve(process.cwd(), 'config.yaml');
let rawConfig: unknown = {};

try {
  if (fs.existsSync(configFile)) {
    const fileContent = fs.readFileSync(configFile, 'utf-8');
    rawConfig = load(fileContent) || {};
  }
} catch (e) {
  console.warn('⚠️ 无法读取 config.yaml，将使用默认配置。', e);
}

// Zod Schema 保证类型安全与完备的默认兜底
const ConfigSchema = z.object({
  site: z.object({
    name: z.string().default('Runlog'),
    author: z.string().default('Alex Chen'),
    url: z.string().default('https://dxer.github.io/astro-runlog-blog'),
    description: z.string().default('投资复盘、认知成长与技术系统的结构化日志。'),
    locale: z.enum(['zh-CN', 'en']).default('zh-CN'),
    googleAnalyticsId: z.string().default(''),
    googleSiteVerification: z.string().default(''),
    baiduSiteVerification: z.string().default(''),
    bingSiteVerification: z.string().default(''),
    cta: z.object({
      label: z.string().default('阅读文章'),
      href: z.string().default('/posts'),
    }).default({}),
  }).default({}),

  sections: z.object({
    terminal: z.boolean().default(true),
    pillars: z.boolean().default(true),
    framework: z.boolean().default(true),
    recentPosts: z.boolean().default(true),
    principles: z.boolean().default(true),
    cta: z.boolean().default(true),
  }).default({}),

  hero: z.object({
    label: z.string().default('insight ledger · 思考与复盘日志'),
    title: z.string().default('独立思考，长期复利。'),
    lede: z.string().default('记录投资决策、个人成长、商业认知与技术系统的结构化日志。剥离情绪噪音，追求确定性与知行合一。'),
    code: z.string().default('$ ls -la /posts'),
    primaryButton: z.object({
      label: z.string().default('开始阅读文章 ->'),
      href: z.string().default('/posts'),
    }).default({}),
    secondaryButton: z.object({
      label: z.string().default('核心思考模型 ->'),
      href: z.string().default('#principles'),
    }).default({}),
  }).default({}),

  terminal: z.object({
    filename: z.string().default('decision_ledger.log'),
    stream: z.string().default('investment & growth'),
    status: z.string().default('compounding'),
    steps: z.array(z.object({
      kind: z.string(),
      call: z.string(),
      ms: z.number(),
    })).default([]),
    footer: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).default([]),
  }).default({}),

  categories: z.array(z.object({
    slug: z.string(),
    label: z.string(),
    en: z.string().default(''),
    description: z.string().default(''),
  })).default([]),

  framework: z.object({
    label: z.string().default('framework'),
    title: z.string().default('输入. 执行. 复盘.\n构建认知闭环。'),
    lede: z.string().default('决策不是猜测，而是建立在安全边际、第一性原理与持续证伪基础上的长期复利过程。'),
    loop: z.array(z.object({
      idx: z.string(),
      name: z.string(),
      title: z.string(),
      body: z.string(),
      out: z.string(),
    })).default([]),
  }).default({}),

  principlesSection: z.object({
    label: z.string().default('principles'),
    title: z.string().default('经受时间检验的\n底层思维模型。'),
    lede: z.string().default('大道至简。在纷繁复杂的不确定性世界中，依靠少数根本性原则导航。'),
    items: z.array(z.object({
      id: z.string(),
      name: z.string(),
      rule: z.string(),
      note: z.string(),
    })).default([]),
  }).default({}),

  ctaSection: z.object({
    label: z.string().default('archive & index'),
    title: z.string().default('知行合一，静候时间复利。'),
    lede: z.string().default('不设门槛，不加冗余。所有思考与笔记均以纯文本开放索引。'),
    primaryButton: z.object({
      label: z.string().default('浏览全部文章列表 ->'),
      href: z.string().default('/posts'),
    }).default({}),
    secondaryButton: z.object({
      label: z.string().default('LLM 纯文本索引 ->'),
      href: z.string().default('/llms.txt'),
    }).default({}),
  }).default({}),
});

export const config = ConfigSchema.parse(rawConfig);

const isEn = config.site.locale === 'en';
export const basePath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
export const withBase = (p: string) => (!p || p.startsWith('http') || p.startsWith('#') || p.startsWith('mailto:') ? p : `${basePath}${p.startsWith('/') ? p : `/${p}`}`);

// 动态计算导航栏与页脚，与 categories、sections、locale 和 basePath 自动保持同步
const dynamicNav = [
  ...(config.sections.pillars ? [{ label: isEn ? 'Pillars' : '思考支柱', href: `${basePath}/#pillars` }] : []),
  { label: isEn ? 'All Posts' : '所有文章', href: `${basePath}/posts` },
  ...(config.sections.principles ? [{ label: isEn ? 'Principles' : '核心准则', href: `${basePath}/#principles` }] : []),
  ...(config.sections.framework ? [{ label: isEn ? 'Framework' : '决策框架', href: `${basePath}/#framework` }] : []),
];

const dynamicFooter = [
  {
    title: isEn ? 'Navigation' : '导航',
    links: [
      [isEn ? 'Home' : '首页', `${basePath}/`],
      [isEn ? 'Archive' : '文章归档', `${basePath}/posts`],
      ['LLMs.txt', `${basePath}/llms.txt`],
    ] as [string, string][],
  },
  {
    title: isEn ? 'Topics' : '专题',
    links: config.categories.map((c) => [isEn && c.en ? c.en : c.label, `${basePath}/posts`]) as [string, string][],
  },
  ...(config.sections.principles && config.principlesSection.items.length > 0 ? [{
    title: isEn ? 'Principles' : '准则',
    links: config.principlesSection.items.slice(0, 3).map((p) => [isEn && p.rule ? p.rule : p.name, `${basePath}/#principles`]) as [string, string][],
  }] : []),
  {
    title: isEn ? 'Subscribe' : '订阅',
    links: [
      [isEn ? 'RSS Feed' : 'RSS 订阅源', `${basePath}/rss.xml`],
      [isEn ? 'Sitemap' : '站点地图', `${basePath}/sitemap-index.xml`],
      ['LLMs Index', `${basePath}/llms.txt`],
    ] as [string, string][],
  },
];

export const site = {
  ...config.site,
  googleAnalyticsId: (import.meta.env.PUBLIC_GA_ID as string | undefined) || process.env.PUBLIC_GA_ID || config.site.googleAnalyticsId || '',
  nav: dynamicNav,
  menu: [{ label: isEn ? 'Home' : '首页', href: `${basePath}/` }, ...dynamicNav],
  footer: dynamicFooter,
  secondary: config.sections.principles ? { label: isEn ? 'Principles' : '思考模型', href: `${basePath}/#principles` } : { label: isEn ? 'All Posts' : '所有文章', href: `${basePath}/posts` },
  announcement: { text: '', href: '' },
  install: config.hero.code,
  cta: {
    label: config.site.cta?.label || (isEn ? 'Read Posts' : '阅读文章'),
    href: `${basePath}/posts`,
  },
};

export const {
  sections,
  terminal,
  categories,
  framework,
  principlesSection,
} = config;

export const hero = {
  ...config.hero,
  primaryButton: {
    ...config.hero.primaryButton,
    href: withBase(config.hero.primaryButton.href),
  },
  secondaryButton: {
    ...config.hero.secondaryButton,
    href: withBase(config.hero.secondaryButton.href),
  },
};

export const ctaSection = {
  ...config.ctaSection,
  primaryButton: {
    ...config.ctaSection.primaryButton,
    href: withBase(config.ctaSection.primaryButton.href),
  },
  secondaryButton: {
    ...config.ctaSection.secondaryButton,
    href: withBase(config.ctaSection.secondaryButton.href),
  },
};

export interface CategoryMeta {
  slug: string;
  label: string;
  en: string;
  description: string;
}

export function getCategoryMeta(rawCategory?: string): CategoryMeta {
  const slug = (rawCategory || 'general').trim().toLowerCase();
  const matched = config.categories.find((c) => c.slug.toLowerCase() === slug);
  if (matched) return matched;

  const autoLabel = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    slug,
    label: autoLabel,
    en: autoLabel,
    description: `关于 ${autoLabel} 的记录与思考`,
  };
}
