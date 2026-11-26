/**
 * Balcão – site configuration.
 * Edit this file first: business name, contact links, colours and languages.
 * Everything below is SAMPLE data. Replace it before publishing your site.
 */
export type Locale = 'en' | 'pt-br';

export const site = {
  /** Business name shown in the header, footer and page titles. */
  name: 'Studio Exemplo',
  /** Production URL (used for canonical links, sitemap and Open Graph). */
  url: 'https://example.com',
  /** First language = the one served at "/". The others get a prefix, e.g. /pt-br/. */
  defaultLocale: 'en' as Locale,
  locales: ['en', 'pt-br'] as Locale[],
  contact: {
    email: 'hello@example.com',
    /** WhatsApp number in international format, digits only (country + area code + number). */
    whatsapp: '5500000000000',
    phoneDisplay: '+55 (00) 00000-0000',
    city: 'Your City',
  },
  social: {
    instagram: '',
  },
  /**
   * Brand colours (any CSS colour). They feed Tailwind's `brand-*` utilities.
   * Tip: pick a 600 that passes 4.5:1 contrast against white text.
   */
  colors: {
    brand50: '#eefbf6',
    brand100: '#d6f5e8',
    brand500: '#14a374',
    brand600: '#0d8460',
    brand700: '#0b6a4e',
    brand900: '#08392b',
  },
};
