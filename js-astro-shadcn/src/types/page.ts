import type { Language, Theme } from './common';
import type { ComponentType, ReactNode } from 'react';

export type Environment = 'DEV' | 'STG' | 'PROD';

export interface PageMeta {
  title?: string;
  description?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface SeoConfig {
  ogType: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: string;
  locale: string;
  defaultLocale: Language;
}

export interface UrlConfig {
  SITE_URL: Record<Environment, string>;
  BASE_URL: {
    STATUS: boolean;
  } & Record<Environment, string>;
  ASSETS_URL: {
    STATUS: boolean;
  } & Record<Environment, string>;
}

export interface PathConfig {
  images: {
    favicon: string;
    ogp: string;
    appleTouchIcon: string;
  };
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  line?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
}

export interface ThemeConfig {
  defaultTheme: Theme;
  themeStorageKey: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface PageData {
  meta: PageMeta;
  breadcrumbs?: BreadcrumbItem[];
  lastModified?: Date;
  readingTime?: number;
}

export interface LayoutProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  ogImage?: string;
  children?: ReactNode;
}

export interface PageContext {
  pathname: string;
  searchParams: globalThis.URLSearchParams;
  environment: Environment;
  locale: Language;
  theme: Theme;
}

export interface StaticPage {
  slug: string;
  meta: PageMeta;
  content: string;
  lastModified: Date;
}

export interface DynamicPageParams {
  [key: string]: string | string[] | undefined;
}

export interface PageProps<T = DynamicPageParams> {
  params: T;
  searchParams: Record<string, string | string[] | undefined>;
}

export interface ErrorPageProps {
  statusCode: number;
  title: string;
  message: string;
  stack?: string;
}

export type PageComponent<T = Record<string, never>> = ComponentType<T & PageProps>;

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}
