export const site = {
  name: 'lone',
  wordmark: 'lone',
  motto: 'Paper, charcoal, and code.',
  description: 'Notes on software and travel. English and Chinese.',
  url: 'https://example.com',
  lang: 'en',
  author: 'your name',
  email: 'you@example.com',
  github: 'https://github.com/iClew/lone',
  ogImage: '/images/hero.jpg',
  favicon: '/favicon.svg',
  rssTitle: '',
  years: '2016–2026',
  icp: { href: '', text: '' },
};

export const nav = [
  { href: '/', label: 'Notes' },
  { href: '/archive/', label: 'Archive' },
  { href: '/about/', label: 'About' },
  { href: '/rss.xml', label: 'RSS' },
];

export const home = {
  title: 'lone',
  lede: 'A blank page. Code, and walks.',
  hero: '/images/hero.jpg',
  streamLabel: 'Latest',
  pageSize: 10,
  tagPreview: 12,
  pin: '',
};

export const archive = {
  title: 'Archive',
  lede: 'Every note, by year.',
};

export const tags = {
  title: 'Tags',
  lede: 'Browse by tag.',
};

export const categories = {
  title: 'Kinds',
  lede: 'Journal and walks.',
  labels: {
    note: 'Journal',
    travel: 'Travel',
  } as Record<string, string>,
};

export const about = {
  title: 'About',
  lede: 'Software and travel. English and Chinese.',
  body: [
    'I keep notes here in English and Chinese: software, a few walks, and the odd page that still wants paper.',
    'The home is one landscape, then writing you can actually read. Older years sit in the archive.',
    'The feed is RSS if you want it in a reader.',
  ],
};

export const notFound = {
  title: 'No such page',
  lede: 'That note is not here.',
};

export const ui = {
  skipToContent: 'Skip to content',
  emptyStream: 'Nothing here yet.',
  emptyTags: 'No tags yet.',
  /* Shown where the body would be, so a note with no prose says so instead of
     falling from its cover straight into the gallery. The component picks by
     the note's own `lang`; a missing key falls back to `emptyStream`. */
  noBody: 'No words for this one — the photos are the note.',
  backToNotes: '← Notes',
  backToTags: '← Tags',
  allNotes: 'Archive →',
  allTagsCount: (n: number) => `All ${n} tags →`,
  leadLabel: 'Latest note',
  pinLabel: 'Recommended',
  leadRead: 'Read →',
  issueMeta: (year: number, count: number) => `${year} · ${count} notes`,
  pagerPage: (n: number) => `Page ${n}`,
  byKind: 'By kind',
  bySubject: 'By subject',
  langEn: 'en',
  langZh: 'zh',
  readMin: (n: number) => (n === 1 ? '1 min' : `${n} min`),
  photoCount: (n: number) => (n === 1 ? '1 photo' : `${n} photos`),
  noteCount: (n: number) => (n === 1 ? '1 note' : `${n} notes`),
  pagerPrev: 'Previous page',
  pagerNext: 'Next page',
  galleryLabel: 'Photos',
  tocLabel: 'Contents',
  morePhotos: (n: number) => `+${n}`,
  postNavOlder: 'Older',
  postNavNewer: 'Newer',
  postNavAll: 'All notes',
  linkEmail: 'Email',
  linkGithub: 'GitHub',
  linkRss: 'RSS',
  ariaNav: 'Primary',
  ariaPager: 'Pagination',
  ariaContents: 'Contents',
  ariaAdjacent: 'Adjacent notes',
  footCopyright: (years: string, name: string) => `© ${years} ${name}`,
  footThemeLabel: 'Theme',
  footTheme: 'lone',
  footThemeHref: 'https://github.com/iClew/lone',
  themeDay: 'Day',
  themeNight: 'Night',
  themeToDay: 'Switch to day',
  themeToNight: 'Switch to night',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  menuCloseWord: 'Close',
};
