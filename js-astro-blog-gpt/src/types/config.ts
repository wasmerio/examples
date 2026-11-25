import type { AstroExpressiveCodeOptions } from 'astro-expressive-code';
type CodeTheme = Extract<
  NonNullable<AstroExpressiveCodeOptions['themes']>[number],
  string
>;
export type Locale = string;
export type Localized = string | Partial<Record<Locale, string>>;
export type NavigationItem = {
  id: string;
  label: Localized;
  description?: Localized;
} & (
  | {
      type: 'builtin';
      route: 'home' | 'posts' | 'categories' | 'archives' | 'links' | 'tags';
      page?: string;
    }
  | { type: 'page'; page: string }
  | { type: 'external'; href: string; newTab?: boolean }
);
export type SidebarItem = NavigationItem & { icon: string };
export type ArticleDisplay = Record<
  | 'author'
  | 'published'
  | 'readingTime'
  | 'updated'
  | 'tags'
  | 'share'
  | 'navigation'
  | 'title',
  boolean
>;
export type StatisticsOptions = {
  enabled: boolean;
  articleCount: boolean;
  wordCount: boolean;
  days: boolean;
  languages: boolean;
  averageWords: boolean;
  updateFrequency: boolean;
  firstPublication: boolean;
  lastUpdate: boolean;
  heatmap: boolean;
  recentWords: boolean;
  recentLimit: number;
};
export interface BlogConfig {
  site: {
    title: Localized;
    baseUrl: string;
    defaultLocale: Locale;
    /** Content/page languages; matching UI translations are optional. */
    locales: Locale[];
    localePrefixPolicy?:
      'redirect-to-default' | 'omit-default-prefix' | 'require-prefix';
    timezone: string;
  };
  author: {
    name: Localized;
    bio: Localized;
    avatar: string;
    socials: { label: Localized; icon: string; href: string }[];
  };
  appearance: {
    defaultTheme: 'light' | 'dark' | 'system';
    pageTransition: 'fade' | 'none';
    codeThemes: { light: CodeTheme; dark: CodeTheme };
    showCodeLineNumbers: boolean;
    categoryCoverStyle: 'thumbnail' | 'fade' | 'background';
  };
  text: {
    siteDescription: Localized;
    homeHeading: Localized;
    tabs: { search: Localized; posts: Localized };
    searchHeading: Localized;
    searchPlaceholder: Localized;
    notFoundMessage: Localized;
    footerDescription: Localized;
  };
  sharing?: {
    copyFormat?: Localized;
    platforms?: { name: Localized; icon?: string; href: string }[];
  };
  statistics?: Partial<StatisticsOptions>;
  article: {
    display?: Partial<ArticleDisplay>;
    math: boolean;
    mermaid: boolean;
    lightbox: boolean;
    callouts: boolean;
    toc: {
      enabled: boolean;
      minDepth: number;
      maxDepth: number;
      expandDelay: number;
      hideDelay?: number;
    };
    shareCover: {
      enabled: boolean;
      width: number;
      height: number;
      background: string;
      foreground: string;
      accent: string;
      fontPath?: string;
    };
  };
  sidebar: {
    items: SidebarItem[];
    menu: NavigationItem[];
    width: { default: number; min: number; max: number };
  };
  posts: {
    pathPrefix?: string;
    perPage: number;
    homeLimit: number;
    menuLimit: number;
    randomLimit: number;
    showDraftsInDev: boolean;
    dateFormat: Intl.DateTimeFormatOptions;
  };

  footer: {
    since: number | string;
    author: Localized;
    showAttribution: boolean;
    license: { label: string; url: string };
  };
}

export type FriendsConfig = {
  title: Localized;
  description?: Localized;
  links: {
    name: Localized;
    description: Localized;
    url: string;
    avatar?: string;
    icon?: string;
  }[];
}[];
