export type {
  SearchProvider,
  CoverColorProvider,
  CommentProvider,
  FeatureModules,
} from './providers';

export interface KeyboardShortcutConfiguration {
  name?: string;
  modifier: 'shift' | 'mod' | string;
  key: string;
  action?: string;
  url?: string;
}

export interface KeyboardConfiguration {
  enable: boolean;
  list: KeyboardShortcutConfiguration[];
}

export interface CommentConfiguration {
  use: string;
  commentBarrage?: boolean;
  lazyload?: boolean;
  count?: boolean;
  sidebar?: boolean;
  pv?: boolean;
  avatar?: string;
  newest_comment?: {
    enable?: boolean;
    storage?: number;
    limit?: number;
  };
}

export interface ValineConfiguration {
  appId?: string;
  appKey?: string;
  serverURLs?: string;
  avatar?: string;
  visitor?: boolean;
  style?: boolean;
  option?: Record<string, unknown>;
}

export interface AssetConfiguration {
  twikoo?: string;
  waline?: string;
  waline_css?: string;
  valine?: string;
  blueimp_md5?: string;
  artalk?: string;
  artalk_css?: string;
  [name: string]: string | undefined;
}

export interface HighlightConfiguration {
  enable?: boolean;
  copy?: boolean;
  line_numbers?: boolean;
  max_height?: number;
  themes?: {
    light?: string;
    dark?: string;
  };
}

export type SolitudeSiteConfiguration = ReturnType<
  typeof import('@/lib/site/runtime-config').runtimeConfig
> & {
  copyright?: {
    limit: number;
    author: string;
    link: string;
    source: string;
    info: string;
  };
  docsearch?: ReturnType<
    typeof import('@/lib/site/runtime-config').runtimeConfig
  >['search']['docsearch'];
};

export interface SolitudePageConfiguration {
  is_post: boolean;
  is_page: boolean;
  is_home: boolean;
  page: string;
  toc: boolean;
  comment: boolean;
  color: string | false;
}

export interface SolitudeLifecycleEvents {
  ready: { config: SolitudeSiteConfiguration; page: SolitudePageConfiguration };
  beforeNavigate: undefined;
  afterNavigate: { page: SolitudePageConfiguration };
  themeChange: { theme: 'light' | 'dark' };
}
