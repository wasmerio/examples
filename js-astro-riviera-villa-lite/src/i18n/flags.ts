import type { Locale } from './locales.ts';

/**
 * Flags of the language menu, drawn inline (no image file, no request to another site).
 * Each drawing fills a 32 × 32 square; the component crops it into a circle.
 */
export const FLAG_CODES = ['fr', 'be', 'ch', 'gb', 'us', 'ie', 'it', 'de', 'at', 'es'] as const;

export type FlagCode = (typeof FLAG_CODES)[number];

/** Flag shown for each language unless `languages.flags` in villa.config.ts says otherwise. */
export const DEFAULT_FLAGS: Record<Locale, FlagCode> = {
  fr: 'fr',
  en: 'gb',
  it: 'it',
  de: 'de',
};

export function flagFor(locale: Locale, overrides: Partial<Record<Locale, FlagCode>> = {}): FlagCode {
  return overrides[locale] ?? DEFAULT_FLAGS[locale];
}

const vertical = (a: string, b: string, c: string) =>
  `<rect width="32" height="32" fill="${b}"/><rect width="10.67" height="32" fill="${a}"/><rect x="21.33" width="10.67" height="32" fill="${c}"/>`;
const horizontal = (a: string, b: string, c: string) =>
  `<rect width="32" height="32" fill="${b}"/><rect width="32" height="10.67" fill="${a}"/><rect y="21.33" width="32" height="10.67" fill="${c}"/>`;

const usStripes = Array.from({ length: 7 }, (_, i) => `<rect y="${(i * 2 * 32) / 13}" width="32" height="${32 / 13}" fill="#B22234"/>`).join('');
const usStars = [4, 8, 12]
  .flatMap((y) => [3, 7, 11].map((x) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#fff"/>`))
  .join('');

export const FLAG_SVG: Record<FlagCode, string> = {
  fr: vertical('#0055A4', '#FFFFFF', '#EF4135'),
  be: vertical('#000000', '#FDDA24', '#EF3340'),
  it: vertical('#009246', '#FFFFFF', '#CE2B37'),
  ie: vertical('#169B62', '#FFFFFF', '#FF883E'),
  de: horizontal('#000000', '#DD0000', '#FFCE00'),
  at: horizontal('#C8102E', '#FFFFFF', '#C8102E'),
  es: '<rect width="32" height="32" fill="#AA151B"/><rect y="8" width="32" height="16" fill="#F1BF00"/>',
  ch: '<rect width="32" height="32" fill="#DA291C"/><rect x="13" y="6" width="6" height="20" fill="#fff"/><rect x="6" y="13" width="20" height="6" fill="#fff"/>',
  gb:
    '<rect width="32" height="32" fill="#012169"/>' +
    '<path d="M0 0L32 32M32 0L0 32" stroke="#fff" stroke-width="6"/>' +
    '<path d="M0 0L32 32M32 0L0 32" stroke="#C8102E" stroke-width="2"/>' +
    '<path d="M16 0V32M0 16H32" stroke="#fff" stroke-width="10"/>' +
    '<path d="M16 0V32M0 16H32" stroke="#C8102E" stroke-width="6"/>',
  us: `<rect width="32" height="32" fill="#fff"/>${usStripes}<rect width="14" height="${(7 * 32) / 13}" fill="#3C3B6E"/>${usStars}`,
};
