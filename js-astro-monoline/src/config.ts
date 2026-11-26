// src/config.ts — single entry point for site settings. Everything site-specific lives here; never hardcode in components.
export const site = {
  name: 'Mira Okonkwo',
  description: 'Notes on design work, written down so I stop forgetting them.',
  url: 'https://example.com',
  locale: 'en', // BCP 47, e.g. 'en', 'ko'
  author: 'Mira Okonkwo', // Fictional demo author. Replace with your name
  defaultOgImage: '/og-default.png',
  // The README line on the home page, above the table of notes. One or two sentences.
  lede: 'I design software for a living and keep notes on how it goes: the process, the meetings, the tools, the parts that did not work.',
} as const;

// The header links, in order. Lowercase labels: the header prints them as paths, `/notes`.
export const nav = {
  header: [
    { label: 'notes', href: '/notes' },
    { label: 'about', href: '/about' },
  ],
} as const;

export const seo = {
  titleTemplate: `%s · ${site.name}`,
  twitterHandle: '',
  jsonLd: { type: 'Person' as 'Person' | 'Organization', name: site.author },
};

export const monoline = {
  // The source gutter: Markdown markers beside headings, quotes, lists, code and footnotes.
  // false hides them (the markup keeps its data-md attributes).
  gutter: true,
  homeCount: 12, // rows in the home table; the rest are on /notes
};

export const features = {
  darkMode: true,
};

export const analytics = {
  provider: null as null | 'plausible' | 'ga4' | 'umami',
  id: '',
  // Self-hosted Plausible or Umami: the origin serving the script, no trailing slash.
  // Empty means the hosted service. GA4 ignores it.
  host: '',
};

// Every word the theme prints, in one place: translate these along with site.locale.
// Dates stay YYYY-MM-DD in every language.
const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
export const ui = {
  skipToContent: 'Skip to content',
  notes: 'notes', // the /notes heading and the first part of every path line
  table: { date: 'date', note: 'note', tag: 'tag' },
  recentNotes: 'Recent notes', // read out before the home table
  allNotes: 'All notes', // read out before the /notes table
  allNotesLink: 'all notes →',
  allCount: (count: number) => `all ${count} notes →`,
  notesDescription: (count: number) => `All ${count} notes, newest first.`,
  nothingYet: 'Nothing here yet.',
  meta: {
    minutes: (count: number) => `${count} min`,
    words: (count: number) => n(count, 'word', 'words'),
    updated: (date: string) => `updated ${date}`,
  },
  older: 'older',
  newer: 'newer',
  olderNewer: 'Older and newer notes',
  notFound: 'There is no note at this address.',
  recent: 'recent',
  rss: 'rss',
  theme: { label: 'theme', system: 'system', light: 'light', dark: 'dark', name: 'Color theme' },
};
