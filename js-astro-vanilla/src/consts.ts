
type ImportsInit = (string | Record<string, (string | [string, string])[]>)[]

export const SITE = {
  TITLE: 'Astro Vanilla',
  DESCRIPTION: 'A simple Astro starter site.',

  BASE: '/',
  URL: 'https://astro-vanilla.netlify.app/',

  LANG: 'en',
  LOCALE: 'en-GB',
  TIMEZONE: 'Europe/London',

  LATEST_POSTS: 4,
  PER_PAGE: 6,
  RELATED_POSTS: 4,
} as const

// https://github.com/delucis/astro-auto-import/
export const IMPORTS: ImportsInit = [
  './src/components/YouTube.astro'
] as const
