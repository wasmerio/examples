import { canonicalLocale } from './locale.ts';
import { validatePostPrefix } from './post-path.ts';
import type { BlogConfig, FriendsConfig } from '../types/config';
import { footerPeriod } from './footer.ts';
import { siteAddress } from './site-url.ts';

function isLocale(code: string) {
  try {
    canonicalLocale(code);
    return true;
  } catch {
    return false;
  }
}

export function validateLocalized(value: unknown, name: string): void {
  if (typeof value === 'string') return;
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    !Object.keys(value).length ||
    Object.entries(value).some(
      ([key, text]) => !isLocale(key) || typeof text !== 'string',
    )
  )
    throw new Error(
      `${name} must be a string or a non-empty BCP 47 locale string map.`,
    );
}

export function validateFriendsConfig(config: FriendsConfig): void {
  for (const group of config) {
    validateLocalized(group.title, 'friends[].title');
    if (group.description !== undefined)
      validateLocalized(group.description, 'friends[].description');
    for (const link of group.links) {
      validateLocalized(link.name, 'friends.links.name');
      validateLocalized(link.description, 'friends.links.description');
    }
  }
}

export function validateConfig(config: BlogConfig): void {
  siteAddress(config.site.baseUrl);
  if (
    config.site.localePrefixPolicy !== undefined &&
    !['redirect-to-default', 'omit-default-prefix', 'require-prefix'].includes(
      config.site.localePrefixPolicy,
    )
  )
    throw new Error(
      'site.localePrefixPolicy must be redirect-to-default, omit-default-prefix or require-prefix.',
    );
  validatePostPrefix(config.posts.pathPrefix ?? '');
  for (const code of [...config.site.locales, config.site.defaultLocale])
    canonicalLocale(code);
  if (
    new Set(config.site.locales.map(canonicalLocale)).size !==
    config.site.locales.length
  )
    throw new Error('site.locales must not contain equivalent BCP 47 codes.');
  validateLocalized(config.site.title, 'site.title');
  validateLocalized(config.author.name, 'author.name');
  validateLocalized(config.author.bio, 'author.bio');
  validateLocalized(config.footer.author, 'footer.author');
  if (typeof config.footer.license.label !== 'string')
    throw new Error(
      'footer.license.label must be a string; the final footer line is language-independent.',
    );
  for (const [key, value] of Object.entries(config.text)) {
    if (key === 'tabs') continue;
    validateLocalized(value, `text.${key}`);
  }
  validateLocalized(config.text.tabs.search, 'text.tabs.search');
  validateLocalized(config.text.tabs.posts, 'text.tabs.posts');
  for (const item of config.author.socials)
    validateLocalized(item.label, 'author.socials.label');
  for (const item of [...config.sidebar.items, ...config.sidebar.menu]) {
    validateLocalized(item.label, 'navigation.label');
    if (item.description !== undefined)
      validateLocalized(item.description, 'navigation.description');
  }
  if (config.sharing?.copyFormat !== undefined)
    validateLocalized(config.sharing.copyFormat, 'sharing.copyFormat');
  for (const item of config.sharing?.platforms ?? [])
    validateLocalized(item.name, 'sharing.platforms.name');
  footerPeriod(config.footer.since);
  if (
    config.statistics?.recentLimit !== undefined &&
    (!Number.isInteger(config.statistics.recentLimit) ||
      config.statistics.recentLimit < 1 ||
      config.statistics.recentLimit > 50)
  )
    throw new Error(
      'statistics.recentLimit must be an integer between 1 and 50.',
    );
  for (const item of config.sharing?.platforms ?? [])
    if (!/^(https?:|mailto:)/i.test(item.href))
      throw new Error('Sharing href must use https, http, or mailto.');
  if (
    !['thumbnail', 'fade', 'background'].includes(
      config.appearance.categoryCoverStyle,
    )
  )
    throw new Error(
      'appearance.categoryCoverStyle must be thumbnail, fade, or background.',
    );
  if (
    config.article.toc.hideDelay !== undefined &&
    (!Number.isFinite(config.article.toc.hideDelay) ||
      config.article.toc.hideDelay < 0)
  )
    throw new Error('article.toc.hideDelay must be a non-negative number.');
  const { minDepth, maxDepth, expandDelay } = config.article.toc;
  if (
    ![minDepth, maxDepth].every(Number.isInteger) ||
    minDepth < 1 ||
    maxDepth > 6 ||
    minDepth > maxDepth ||
    !Number.isFinite(expandDelay) ||
    expandDelay < 0
  )
    throw new Error(
      'article.toc requires 1 <= minDepth <= maxDepth <= 6 and a non-negative expandDelay.',
    );
  const { width, height } = config.article.shareCover;
  if (
    ![width, height].every(
      (value) => Number.isInteger(value) && value >= 320 && value <= 4096,
    )
  )
    throw new Error(
      'Share cover dimensions must be integers between 320 and 4096.',
    );
  if (
    !config.site.locales.length ||
    !config.site.locales.includes(config.site.defaultLocale) ||
    new Set(config.site.locales).size !== config.site.locales.length
  )
    throw new Error(
      'site.locales must be unique and include site.defaultLocale.',
    );
  for (const [name, value] of Object.entries({
    perPage: config.posts.perPage,
    homeLimit: config.posts.homeLimit,
    menuLimit: config.posts.menuLimit,
    randomLimit: config.posts.randomLimit,
  })) {
    if (!Number.isInteger(value) || value < 1)
      throw new Error(`${name} must be a positive integer.`);
  }
  const { min, max, default: defaultWidth } = config.sidebar.width;
  if (
    ![min, max, defaultWidth].every(Number.isFinite) ||
    min < 200 ||
    max > 600 ||
    min > defaultWidth ||
    defaultWidth > max
  )
    throw new Error(
      'sidebar.width must satisfy 200 <= min <= default <= max <= 600.',
    );
}
