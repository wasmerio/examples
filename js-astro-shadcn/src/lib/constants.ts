// src/lib/constants.ts

// 環境の判定
export const isDev = process.env.NODE_ENV === 'development';
export const isStg = process.env.NODE_ENV === 'staging';
export const isProd = process.env.NODE_ENV === 'production';

// NODE_ENVに基づいてURLを設定
export const setSiteUrl = {
  SITE_URL: {
    DEV: 'http://dev.hoge.com/',
    STG: 'http://stg.hoge.com/',
    PROD: 'http://prod.hoge.com/',
  },
  BASE_URL: {
    STATUS: false,
    DEV: '/hoge/',
    STG: '/hoge/',
    PROD: '/hoge/',
  },
  ASSETS_URL: {
    STATUS: false,
    DEV: 'http://dev.hoge.assets.com/',
    STG: 'http://stg.hoge.assets.com/',
    PROD: 'http://prod.hoge.assets.com/',
  },
};

// 現在の環境を取得
export const getCurrentEnv = (): 'DEV' | 'STG' | 'PROD' => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'DEV';
    case 'staging':
      return 'STG';
    case 'production':
      return 'PROD';
    default:
      return 'DEV';
  }
};

// URL設定
export const SITE_URL = {
  DEV: setSiteUrl.SITE_URL.DEV,
  STG: setSiteUrl.SITE_URL.STG,
  PROD: setSiteUrl.SITE_URL.PROD,
} as const;

export const BASE_URL = {
  STATUS: setSiteUrl.BASE_URL.STATUS,
  DEV: setSiteUrl.BASE_URL.DEV,
  STG: setSiteUrl.BASE_URL.STG,
  PROD: setSiteUrl.BASE_URL.PROD,
} as const;

export const ASSETS_URL = {
  STATUS: setSiteUrl.ASSETS_URL.STATUS,
  DEV: setSiteUrl.ASSETS_URL.DEV,
  STG: setSiteUrl.ASSETS_URL.STG,
  PROD: setSiteUrl.ASSETS_URL.PROD,
} as const;

// 現在の環境に基づいたURLを取得する関数
export const getCurrentSiteUrl = () => SITE_URL[getCurrentEnv()];
export const getCurrentBaseUrl = () => {
  // GitHub Pages用の特別処理
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL;
  }
  return BASE_URL.STATUS ? BASE_URL[getCurrentEnv()] : '/';
};
export const getCurrentAssetsUrl = () => (ASSETS_URL.STATUS ? ASSETS_URL[getCurrentEnv()] : '');

// サイトの基本情報（環境に応じて動的に設定）
export const SITE_CONFIG = {
  name: 'これはサイト名です',
  title: 'これはタイトルです',
  description: 'これはディスクリプションです',
  url: getCurrentSiteUrl(),
  author: 'あなたの名前',
  locale: 'ja_JP',
  defaultLocale: 'ja',
} as const;

// SEO関連のデフォルト設定
export const SEO_DEFAULTS = {
  ogType: 'website',
  ogImage: '/assets/common/images/ogp_image.png',
  twitterCard: 'summary_large_image',
} as const;

// パスの設定（環境別URL対応）
export const PATHS = {
  images: {
    favicon: `${getCurrentAssetsUrl()}assets/common/images/favicon`,
    ogp: `${getCurrentAssetsUrl()}assets/common/images/ogp_image.png`,
    appleTouchIcon: `${getCurrentAssetsUrl()}assets/common/images/apple-touch-icon.png`,
  },
} as const;

// 共通の型定義
export interface PageMeta {
  title?: string;
  description?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// サイト全体のメタデータデフォルト値
export const DEFAULT_PAGE_META: PageMeta = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  ogType: SEO_DEFAULTS.ogType,
  ogImage: SEO_DEFAULTS.ogImage,
};

// SNSのリンク（必要に応じて）
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/hogehoge',
  facebook: 'https://facebook.com/hogehoge',
  instagram: 'https://instagram.com/hogehoge',
  line: 'https://line.me/ti/p/hogehoge',
  linkedin: 'https://linkedin.com/in/hogehoge',
} as const;

// テーマの設定（必要に応じて）
export const THEME_CONFIG = {
  defaultTheme: 'light',
  themeStorageKey: 'theme-preference',
} as const;
