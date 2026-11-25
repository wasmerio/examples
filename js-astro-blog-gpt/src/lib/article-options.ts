import type { BlogConfig, ArticleDisplay } from '../types/config';

export type ArticleFeatures = Record<
  'math' | 'mermaid' | 'lightbox' | 'callouts' | 'toc' | 'shareCover',
  boolean
>;
export function articleFeatures(
  data: Partial<ArticleFeatures>,
  defaults: BlogConfig['article'],
): ArticleFeatures {
  return {
    math: data.math ?? defaults.math,
    mermaid: data.mermaid ?? defaults.mermaid,
    lightbox: data.lightbox ?? defaults.lightbox,
    callouts: data.callouts ?? defaults.callouts,
    toc: data.toc ?? defaults.toc.enabled,
    shareCover: data.shareCover ?? defaults.shareCover.enabled,
  };
}

export type MarkdownFile = {
  path?: string;
  data?: { astro?: { frontmatter?: Record<string, unknown> } };
};
export function markdownFeature(
  file: MarkdownFile,
  name: keyof ArticleFeatures,
  fallback: boolean,
): boolean {
  const value = file.data?.astro?.frontmatter?.[name];
  return typeof value === 'boolean' ? value : fallback;
}

export function articleDisplay(
  data: { display?: Partial<ArticleDisplay> },
  defaults?: Partial<ArticleDisplay>,
): ArticleDisplay {
  const result = {} as ArticleDisplay;
  for (const key of [
    'author',
    'published',
    'readingTime',
    'updated',
    'tags',
    'share',
    'navigation',
    'title',
  ] as const)
    result[key] = data.display?.[key] ?? defaults?.[key] ?? true;
  return result;
}
