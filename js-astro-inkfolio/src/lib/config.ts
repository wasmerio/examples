import raw from '../../site.config.yaml?raw';
import { parse } from 'yaml';
import { ui as uiDict } from '../i18n/ui';
import { toTrad } from './trad';

export type Lang = 'en' | 'zh' | 'zh-hant';

export interface NavLeaf {
  label: string;
  labelZh?: string | null;
  href: string;
  sub?: string;
  subZh?: string;
}

export interface NavItem extends NavLeaf {
  items?: NavLeaf[];
}

export interface FooterColumn {
  title: string;
  titleZh?: string;
  links: NavLeaf[];
}

export interface BannerConfig {
  enabled: boolean;
  dismissible: boolean;
  text: string;
  textZh?: string;
  link: string;
  linkText: string;
  linkTextZh?: string;
}

const parsed = parse(raw) as Record<string, any>;

export const weather = (parsed.weather ?? {}) as Record<string, any>;

export const site = {
  name: parsed.site.name as string,
  nameZh: (parsed.site.nameZh as string) ?? parsed.site.name,
  tagline: (parsed.site.tagline as string) ?? '',
  taglineZh: (parsed.site.taglineZh as string) ?? parsed.site.tagline ?? '',
  description: (parsed.site.description as string) ?? '',
  descriptionZh: (parsed.site.descriptionZh as string) ?? parsed.site.description ?? '',
  url: (import.meta.env.SITE || (parsed.site.url as string)).replace(/\/$/, ''),
  author: (parsed.site.author as string) ?? '',
  authorZh: (parsed.site.authorZh as string) ?? parsed.site.author ?? '',
  greeting: (parsed.site.greeting as string) ?? '',
  greetingZh: (parsed.site.greetingZh as string) ?? parsed.site.greeting ?? '',
  avatar: (parsed.site.avatar as string) ?? '',
  telegram: (parsed.site.telegram as string) ?? '',
  contactEndpoint: (parsed.site.contactEndpoint as string) ?? '',
  email: (parsed.site.email as string) ?? '',
  defaultLanguage: ((parsed.site.defaultLanguage as string) ?? 'en') as Lang,
  showLanguageSwitcher: parsed.site.showLanguageSwitcher !== false,
};

const asLeaf = (item: NavLeaf): NavLeaf => ({
  label: item.label,
  labelZh: item.labelZh ?? null,
  href: item.href,
  sub: item.sub,
  subZh: item.subZh,
});

/**
 * Nav entries may be written three ways:
 *   - { key: about, href: /about/ }        labels come from the UI dictionary
 *   - { name: { en: About, zh: 关于 }, href: /about/ }   your own wording
 *   - { label: About, labelZh: 关于, href: /about/ }     the old explicit form
 * Keys win over names, names win over labels; anything missing falls back to
 * the key itself so a typo shows up instead of a blank link.
 */
const NAV_KEY_ALIAS: Record<string, string> = {
  posts: 'articles',
  writing: 'posts',
  log: 'log',
  nav: 'nav',
  mcp: 'mcp',
  friends: 'friends',
  docs: 'docs',
  weekly: 'weekly',
  research: 'research',
  projects: 'projects',
  about: 'about',
  contact: 'contact',
  newsletter: 'newsletter',
  privacy: 'privacy',
};

function rawLabel(item: any, lang: 'en' | 'zh' | 'zh-hant'): string {
  const key = item?.key ? NAV_KEY_ALIAS[item.key] ?? item.key : null;
  if (key) {
    const dict = (lang === 'zh-hant' ? uiDict.zhHant : lang === 'zh' ? uiDict.zh : uiDict.en) as unknown as Record<string, string>;
    if (dict[key]) return dict[key];
    if (dict[`nav_${key}`]) return dict[`nav_${key}`];
  }
  const name = item?.name;
  if (name && typeof name === 'object') {
    const v = name[lang] ?? name.zh ?? name.en;
    if (v) return String(v);
  }
  if (item?.label || item?.labelZh) {
    const base = lang === 'en' ? item.label : item.labelZh ?? item.label;
    return String(base ?? '');
  }
  return String(item?.key ?? '');
}

export const nav: NavItem[] = ((parsed.nav ?? []) as NavItem[]).map((item) => ({
  ...asLeaf(item),
  ...(item.items ? { items: item.items.map(asLeaf) } : {}),
}));

export function navLabel(item: any, lang: 'en' | 'zh' | 'zh-hant'): string {
  const out = rawLabel(item, lang);
  return lang === 'zh-hant' ? toTrad(out) : out;
}

export const navCta = {
  label: (parsed.navCta?.label as string) ?? '',
  labelZh: (parsed.navCta?.labelZh as string) ?? parsed.navCta?.label ?? '',
  href: (parsed.navCta?.href as string) ?? '',
};

export const social = ((parsed.social ?? []) as { label: string; href: string; icon?: string }[]).map((item) => ({
  label: item.label,
  href: item.href,
  icon: item.icon ?? 'link',
}));

export const footerColumns: FooterColumn[] = ((parsed.footerColumns ?? []) as FooterColumn[]).map((col) => ({
  title: col.title,
  titleZh: col.titleZh ?? col.title,
  links: (col.links ?? []).map(asLeaf),
}));

export const banner: BannerConfig = {
  enabled: parsed.promoBanner?.enabled !== false,
  dismissible: parsed.promoBanner?.dismissible !== false,
  text: parsed.promoBanner?.text ?? '',
  textZh: parsed.promoBanner?.textZh ?? null,
  link: parsed.promoBanner?.link ?? '',
  linkText: parsed.promoBanner?.linkText ?? '',
  linkTextZh: parsed.promoBanner?.linkTextZh ?? null,
};

export const theme = {
  accent: (parsed.theme?.accent as string) ?? '#ff6b01',
  defaultMode: ((parsed.theme?.defaultMode as string) ?? 'auto') as 'auto' | 'light' | 'dark',
  radius: (parsed.theme?.radius as string) ?? '12px',
};

export const footer = {
  note: (parsed.footer?.note as string) ?? '',
  noteZh: (parsed.footer?.noteZh as string) ?? parsed.footer?.note ?? '',
  // Free text shown after the copyright. `note` stays as a legacy alias.
  text: (parsed.footer?.text as string) ?? (parsed.footer?.note as string) ?? '',
  textZh: (parsed.footer?.textZh as string) ?? (parsed.footer?.noteZh as string) ?? parsed.footer?.text ?? '',
  // {year} and {name} are replaced; leave empty for "© {year} {copyrightName}".
  copyright: (parsed.footer?.copyright as string) ?? '',
  copyrightZh: (parsed.footer?.copyrightZh as string) ?? (parsed.footer?.copyright as string) ?? '',
  copyrightName: (parsed.footer?.copyrightName as string) ?? site.name,
  authorUrl: (parsed.footer?.authorUrl as string) ?? '',
  authorLabel: (parsed.footer?.authorLabel as string) ?? '',
  credit: {
    show: parsed.footer?.credit?.show !== false,
    label: (parsed.footer?.credit?.label as string) ?? 'Powered by Inkfolio',
    labelZh: ((parsed.footer?.credit?.labelZh as string) ?? (parsed.footer?.credit?.label as string)) || '由 Inkfolio 驱动',
    href: (parsed.footer?.credit?.href as string) ?? '',
  },
  artLight: (parsed.footer?.artLight as string) ?? '',
  artDark: (parsed.footer?.artDark as string) ?? '',
};

export const analytics = {
  umami: {
    enabled: parsed.analytics?.umami?.enabled === true,
    scriptUrl: (parsed.analytics?.umami?.scriptUrl as string) ?? '',
    websiteId: (parsed.analytics?.umami?.websiteId as string) ?? '',
  },
  googleAnalytics: {
    enabled: parsed.analytics?.googleAnalytics?.enabled === true,
    measurementId: (parsed.analytics?.googleAnalytics?.measurementId as string) ?? '',
  },
  clarity: {
    enabled: parsed.analytics?.clarity?.enabled === true,
    projectId: (parsed.analytics?.clarity?.projectId as string) ?? '',
  },
};

export const consent = {
  enabled: parsed.consent?.enabled !== false,
  storageKey: (parsed.consent?.storageKey as string) ?? 'inkfolio-consent',
  text: (parsed.consent?.text as string) ?? '',
  textZh: (parsed.consent?.textZh as string) ?? parsed.consent?.text ?? '',
  link: (parsed.consent?.link as string) ?? '',
  linkLabel: (parsed.consent?.linkLabel as string) ?? '',
  linkLabelZh: (parsed.consent?.linkLabelZh as string) ?? parsed.consent?.linkLabel ?? '',
  accept: (parsed.consent?.accept as string) ?? 'Accept',
  acceptZh: (parsed.consent?.acceptZh as string) ?? parsed.consent?.accept ?? '接受',
  reject: (parsed.consent?.reject as string) ?? 'Decline',
  rejectZh: (parsed.consent?.rejectZh as string) ?? parsed.consent?.reject ?? '拒绝',
};

export const seo = {
  titleTemplate: (parsed.seo?.titleTemplate as string) ?? '{title}',
  defaultDescription: (parsed.seo?.defaultDescription as string) ?? site.description,
  ogImage: (parsed.seo?.ogImage as string) ?? '',
  twitterHandle: (parsed.seo?.twitterHandle as string) ?? '',
  locale: (parsed.seo?.locale as string) ?? 'en_US',
  localeZh: (parsed.seo?.localeZh as string) ?? 'zh_CN',
  keywords: (parsed.seo?.keywords as string[]) ?? [],
  structuredData: parsed.seo?.structuredData !== false,
  robots: (parsed.seo?.robots as string) ?? 'index,follow',
};

export function titleFor(title: string, lang: Lang): string {
  const siteName = lang === 'zh' ? site.nameZh : site.name;
  if (!title || title === siteName) return siteName;
  return seo.titleTemplate.replace('{title}', title).replace('{site}', siteName);
}

export function pickLang<T>(value: { en: T; zh: T; 'zh-hant'?: T }, lang: Lang): T {
  if (lang === 'zh-hant') return value['zh-hant'] ?? value.zh;
  return lang === 'zh' ? value.zh : value.en;
}

/** Prefix a path for the requested language: ('/posts/', 'zh') → '/zh/posts/' */
export function langPath(path: string, lang: Lang): string {
  if (lang === 'en') return path;
  const prefix = lang === 'zh-hant' ? '/zh-Hant' : '/zh';
  return path === '/' ? `${prefix}/` : `${prefix}${path}`;
}

export interface McpSource {
  host: string;
  items?: number;
  desc: { en: string; zh: string };
}
export interface McpTool {
  name: string;
  args?: string;
  desc: { en: string; zh: string };
}

export const mcp = {
  enabled: process.env.MCP_ENABLED === 'true' || parsed.mcp?.enabled === true,
  endpoint: (parsed.mcp?.endpoint as string) ?? '',
  name: (parsed.mcp?.name as string) ?? `${site.name} MCP`,
  sources: ((parsed.mcp?.sources ?? []) as McpSource[]).map((src) => ({
    host: src.host,
    items: typeof src.items === 'number' ? src.items : undefined,
    desc: src.desc,
  })),
  tools: ((parsed.mcp?.tools ?? []) as McpTool[]).map((tool) => ({
    name: tool.name,
    args: tool.args ?? '',
    desc: tool.desc,
  })),
};

/** Site fields accept either a scalar or one value per language. */
export function siteText(field: 'name' | 'tagline' | 'description', lang: Lang): string {
  const raw: any = (site as any)[field] ?? (parsed.site as any)?.[field];
  const zhRaw: any = (site as any)[`${field}Zh`] ?? (parsed.site as any)?.[`${field}Zh`];
  if (raw && typeof raw === 'object') {
    const picked = raw[lang] ?? (lang === 'zh-hant' ? raw['zh-hant'] ?? raw.zh : undefined) ?? raw.zh ?? raw.en;
    if (picked) return String(picked);
  }
  if (zhRaw && lang !== 'en') return String(zhRaw);
  return String(raw ?? '');
}

export const covers = {
  list: (parsed as any).covers?.list !== false,
  article: (parsed as any).covers?.article !== false,
};

export const icons = ((parsed as any).icons ?? { mode: 'fontawesome', iconfont: {} }) as {
  mode: 'fontawesome' | 'iconfont';
  iconfont?: { jsUrl?: string; prefix?: string };
};

/** Resolve a config string that may be plain or keyed by language. */
export function pickI18n(value: any, lang: Lang): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.zh ?? value.en ?? '';
}

export const about = ((parsed as any).about ?? {}) as {
  intro?: any;
  expertise?: { icon?: string; title?: any; text?: any }[];
  stack?: { icon?: string; label?: any; note?: any }[];
  journey?: { icon?: string; version?: string; when?: string; what?: any }[];
};
