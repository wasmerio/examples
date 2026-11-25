import { getLocalePath, type Locale } from './i18n';
import { siteConfig } from './site';

export type NavigationConfigItem =
  | string
  | {
      label: string | Record<Locale, string>;
      href: string;
      icon?: string;
    };

export type NavigationItem = {
  href: string;
  label: string;
  icon?: string;
  external: boolean;
};

// System routes addressable by id from siteConfig.nav.
const routeRegistry = {
  posts: {
    label: { en: 'Posts', 'zh-cn': '文章' },
    href: '/posts/',
    icon: 'lucide:file-text'
  },
  projects: {
    label: { en: 'Projects', 'zh-cn': '项目' },
    href: '/projects/',
    icon: 'lucide:layers'
  },
  archives: {
    label: { en: 'Archives', 'zh-cn': '归档' },
    href: '/archives/',
    icon: 'lucide:archive'
  }
} satisfies Record<
  string,
  {
    label: Record<Locale, string>;
    href: string;
    icon: string;
  }
>;

export type RouteId = keyof typeof routeRegistry;

export function isExternalHref(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function resolveNavigationItem(item: NavigationConfigItem) {
  if (typeof item !== 'string') return item;
  return (routeRegistry as Record<string, NavigationConfigItem & object>)[item];
}

function resolveHref(locale: Locale, href: string) {
  if (isExternalHref(href) || href.startsWith('#')) return href;
  return getLocalePath(locale, href);
}

function resolveLabel(locale: Locale, label: string | Record<Locale, string>) {
  return typeof label === 'string' ? label : label[locale];
}

export function getNavigation(
  locale: Locale,
  items: NavigationConfigItem[] = siteConfig.nav
): NavigationItem[] {
  return items
    .map(resolveNavigationItem)
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      href: resolveHref(locale, item.href),
      label: resolveLabel(locale, item.label),
      icon: item.icon,
      external: isExternalHref(item.href)
    }));
}
