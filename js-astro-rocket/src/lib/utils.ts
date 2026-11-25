import { defaultLocale } from '@/i18n';

/**
 * Format a date for display. Defaults to the site's default locale so dates
 * read correctly per language (e.g. "24 juni 2026" on a Dutch page, "2026年6月24日"
 * on a Chinese one); callers that know the active locale should pass it.
 */
export function formatDate(date: Date, locale: string = defaultLocale): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** Latin-script reading speed, words per minute. */
const WORDS_PER_MINUTE = 200;
/**
 * CJK reading speed, characters per minute. CJK scripts (Chinese, Japanese,
 * Korean) aren't space-delimited, so they're counted per character rather than
 * per whitespace-separated "word".
 */
const CJK_CHARS_PER_MINUTE = 400;
/**
 * Characters from space-less East Asian scripts: Hiragana, Katakana, the CJK
 * Unified Ideographs (incl. Extension A) and Compatibility blocks, Hangul
 * syllables, and halfwidth Katakana.
 */
const CJK_PATTERN = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯ｦ-ﾟ]/g;

/**
 * Estimate reading time in minutes from a piece of content (typically a post's
 * raw body). CJK characters are counted individually and every other script by
 * whitespace-delimited words, each at its own reading speed — so a Chinese or
 * Japanese post no longer collapses to "1 min" the way a naive `split(' ')`
 * would. Light markup stripping keeps the estimate focused on prose rather than
 * code, HTML/JSX, or MDX import lines. Always returns at least 1.
 */
export function getReadingTime(content: string): number {
  const text = (content ?? '')
    .replace(/^\s*(?:import|export)\s.*$/gm, ' ') // MDX import/export statements
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/<[^>]+>/g, ' ') // HTML / JSX tags
    .replace(/[#>*_~]/g, ' '); // common Markdown markers

  const cjkChars = (text.match(CJK_PATTERN) || []).length;
  const words = text
    .replace(CJK_PATTERN, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = words / WORDS_PER_MINUTE + cjkChars / CJK_CHARS_PER_MINUTE;
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Check if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Resolve a flat array of social profile URLs into structured link objects.
 * Matches each URL against known platforms to derive icon name and label.
 */
const SOCIAL_PLATFORMS = [
  { key: 'github',    match: /github\.com/i,                  label: 'GitHub',      icon: 'github'    },
  { key: 'twitter',   match: /x\.com|twitter\.com/i,          label: 'X / Twitter', icon: 'x-twitter' },
  { key: 'linkedin',  match: /linkedin\.com/i,                label: 'LinkedIn',    icon: 'linkedin'  },
  { key: 'instagram', match: /instagram\.com/i,               label: 'Instagram',   icon: 'instagram' },
  { key: 'bluesky',   match: /bsky\.app|bluesky\.social/i,    label: 'Bluesky',     icon: 'bluesky'   },
] as const;

export interface ResolvedSocialLink {
  key: string;
  href: string;
  label: string;
  icon: string;
}

export function resolveSocialLinks(urls: string[]): ResolvedSocialLink[] {
  return urls.flatMap((href) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.match.test(href));
    if (!platform) return [];
    return [{ key: platform.key, href, label: platform.label, icon: platform.icon }];
  });
}
