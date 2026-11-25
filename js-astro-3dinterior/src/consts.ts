// src/consts.ts

// Site metadata
export const SITE_TITLE = 'Studio Alpha';
export const SITE_DESCRIPTION = 'Architecture studio specializing in minimalist design.';

// Blog settings
export const BLOG_TITLE = 'Studio Alpha Blog';
export const BLOG_DESCRIPTION = 'Insights on minimalism, architecture, and essential design.';
export const POSTS_PER_PAGE = 6;
export const BLOG_URL = '/blog';

// Author defaults
export const DEFAULT_AUTHOR = 'Studio Alpha';

// 🆕 Blog-related constants
export const BLOG_CATEGORIES = [
  'All posts',
  'Architecture',
  'Materials',
  'Philosophy',
  'Innovation',
  'Interior Design',
  'Urbanism',
  'Wellness'
] as const;

export const BLOG_SOCIAL_SHARE = {
  twitter: true,
  linkedin: true,
  facebook: true,
  email: true
} as const;

export const DEFAULT_BLOG_IMAGE = '/favicon.svg';