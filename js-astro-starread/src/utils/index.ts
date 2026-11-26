import { themeConfig } from '../../starread.config';
import type { Author, ProcessedAuthor } from '../../scripts/type/frontmatter';
export { calculateSunTimes, isDayTime, getUserLatLng, shouldUseDarkMode } from './sunTime';

const defaultLang = themeConfig.lang || 'zh';
const localeKeys = Object.keys(themeConfig.locales || {});
const supportedLangs: string[] = localeKeys.map(key => {
  if (key === '/') return defaultLang;
  return key.replace(/^\/|\/$/g, '');
}).filter(Boolean);

export function getLangFromUrl(url: string): string {
  const path = url.replace(/^\/|\/$/g, '');
  const firstSegment = path.split('/')[0];

  if (supportedLangs.includes(firstSegment)) {
    return firstSegment;
  }

  return defaultLang;
}

export function getPathWithoutLang(url: string): string {
  const path = url.replace(/^\/|\/$/g, '');
  const segments = path.split('/');

  if (supportedLangs.includes(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }

  return '/' + path;
}

export function switchLangPath(url: string, targetLang: string): string {
  if (targetLang === defaultLang) {
    return getPathWithoutLang(url);
  }

  const basePath = getPathWithoutLang(url);
  return `/${targetLang}${basePath}`;
}

export function getLocaleKey(lang: string): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

export function getCurrentSiteLocale(lang: string) {
  const localeKey = getLocaleKey(lang);
  return themeConfig.locales?.[localeKey] || {};
}

export function getCurrentThemeLocale(lang: string) {
  const localeKey = getLocaleKey(lang);
  return themeConfig.themeLocales?.[localeKey] || {};
}

export function getAvailableLanguages() {
  return localeKeys.map(key => {
    const lang = key === '/' ? defaultLang : key.replace(/^\/|\/$/g, '');
    const siteLocale = themeConfig.locales?.[key] || {};
    const themeLocale = themeConfig.themeLocales?.[key] || {};
    return {
      code: lang,
      name: themeLocale.selectLanguageName || siteLocale.title || lang,
      flag: themeLocale.flag || '',
      path: key,
    };
  });
}

export function useTranslations(lang: string) {
  const siteLocale = getCurrentSiteLocale(lang);
  const themeLocale = getCurrentThemeLocale(lang);

  return {
    site: {
      title: siteLocale.title || '星阅主题',
      description: siteLocale.description || '',
      footer: {
        text: siteLocale.footer?.text || '© 2025 StarRead',
      },
    },
    widget: {
      author: {
        name: themeLocale.widget?.author?.name || 'StarRead',
        description: themeLocale.widget?.author?.description || '',
      },
      ad: {
        title: themeLocale.widget?.ad?.title || '',
        description: themeLocale.widget?.ad?.description || '',
        buttonText: themeLocale.widget?.ad?.buttonText || '',
      },
      categories: themeLocale.widget?.categories || themeConfig.widget.categories.map(c => ({ ...c, title: c.name })),
      carousel: {
        title: themeLocale.widget?.carousel?.title || '',
      },
      banner: {
        title: themeLocale.widget?.banner?.title || '',
        tags: themeLocale.widget?.banner?.tags || [],
      },
    },
    navbar: themeLocale.navbar || themeConfig.navbar,
    sidebar: {
      progress: themeLocale.sidebar?.progress || '字数统计',
      author: themeLocale.sidebar?.author || '作者',
      ad: themeLocale.sidebar?.ad || '广告',
      tagcloud: themeLocale.sidebar?.tagcloud || '标签云',
      statistic: themeLocale.sidebar?.statistic || '站点统计',
      toc: themeLocale.sidebar?.toc || '文章目录',
    },
    search: {
      placeholder: themeLocale.search?.placeholder || '搜索文档 (⌘K)',
      noResults: themeLocale.search?.noResults || '没有找到与 "{query}" 相关的内容，请尝试其他关键词',
      loading: themeLocale.search?.loading || '正在搜索...',
      initialTip: themeLocale.search?.initialTip || '支持使用键盘进行导航，Windows用户请用Ctrl 替换 ⌘',
      clear: themeLocale.search?.clear || '清除搜索',
      viewDetails: themeLocale.search?.viewDetails || '查看详情',
      shortcuts: {
        open: themeLocale.search?.shortcuts?.open || '打开搜索',
        browse: themeLocale.search?.shortcuts?.browse || '浏览',
        select: themeLocale.search?.shortcuts?.select || '选择',
        close: themeLocale.search?.shortcuts?.close || '关闭',
      },
    },
    selectLanguageName: themeLocale.selectLanguageName || '简体中文',
    flag: themeLocale.flag || '',
    localeKey: getLocaleKey(lang),
  };
}

export function generateHexString(length: number = 6): string {
  const safeLength = Math.max(2, Math.min(32, length));
  try {
    const array = new Uint8Array(Math.ceil(safeLength / 2));
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, safeLength);
  } catch {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < safeLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export function formatDate(dateString?: string | Date): string {
  if (typeof dateString === 'string' && dateString.includes(' ')) {
    return dateString;
  }

  let date: Date;
  if (!dateString) {
    date = new Date();
  } else if (dateString instanceof Date) {
    date = dateString;
  } else {
    date = new Date(dateString);
  }
  
  if (isNaN(date.getTime())) {
    return typeof dateString === 'string' ? dateString : '';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date).replace(/\//g, '-');
}

export function getCoverImage(cover?: string): string {
  return cover || themeConfig.defaultCover || '/defaultCover.jpg';
}

export function getAuthorInfo(author?: Author): ProcessedAuthor {
  const themeLocale = getCurrentThemeLocale(defaultLang);
  return {
    name: author?.name || themeLocale.widget?.author?.name || 'Anonymous',
    avatar: author?.avatar || themeConfig.widget.author.avatar || '/defaultAvatar.jpg'
  };
}

export function sortEntriesByDate<T extends { data: { date?: string | Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const getTime = (d?: string | Date) => {
      if (!d) return 0;
      const time = new Date(d).getTime();
      return isNaN(time) ? 0 : time;
    };
    return getTime(b.data.date) - getTime(a.data.date);
  });
}

export function countWords(text: string): number {
  if (!text) return 0;
  const plainText = text.replace(/<[^>]*>/g, '');
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (plainText.match(/\b[a-zA-Z]+\b/g) || []).length;
  return chineseChars + englishWords;
}

export interface WidgetConfig {
  [key: string]: boolean;
}

/**
 * 将扁平化的导航配置转换为嵌套结构
 * 
 * @param flatNavbar 扁平化的导航数组，包含 indent 字段
 * @returns 嵌套结构的导航数组，兼容原有 NavBar 组件
 */
export function flattenNavbarToNested(flatNavbar: Array<{ icon?: string; name: string; href?: string; indent?: number }>) {
  const result: Array<{ name?: string; text?: string; href?: string; icon?: string; items?: any[] }> = [];
  const stack: any[] = [];

  flatNavbar.forEach((item) => {
    const indent = item.indent || 0;

    while (stack.length > indent) {
      stack.pop();
    }

    const navItem: any = {
      name: item.name,
      text: item.name,
      icon: item.icon,
      href: item.href,
    };

    if (item.href) {
      if (stack.length === 0) {
        result.push(navItem);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.items) {
          parent.items = [];
        }
        parent.items.push({
          text: item.name,
          link: item.href,
          icon: item.icon
        });
      }
    } else {
      if (stack.length === 0) {
        result.push(navItem);
        stack.push(navItem);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.items) {
          parent.items = [];
        }
        parent.items.push(navItem);
        stack.push(navItem);
      }
    }
  });

  return result;
}