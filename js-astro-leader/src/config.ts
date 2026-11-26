// src/config.ts — single entry point for site settings. Everything site-specific lives here; never hardcode in components.
export const site = {
  name: 'Leader',
  description: 'A workshop for small web tools, and the notes kept while building them.',
  url: 'https://example.com',
  locale: 'en', // BCP 47, e.g. 'en', 'ko'
  author: 'Ada Example', // Fictional demo author. Replace with your name
  defaultOgImage: '/og-default.png',
} as const;

export const nav = {
  header: [
    { label: 'Work', href: '/work' },
    { label: 'Notes', href: '/notes' },
    { label: 'About', href: '/about' },
  ],
  footer: [
    {
      title: 'Site',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'lucide:github' },
    // Icons are Lucide names (https://lucide.dev/icons)
  ],
} as const;

export const seo = {
  titleTemplate: '%s · Leader',
  twitterHandle: '',
  jsonLd: { type: 'Person' as 'Person' | 'Organization', name: site.author },
};

/*
  Categories. A category is a group of work AND a group of notes, and its accent
  is what makes the group visible: the colour runs from the index line to the
  product page to the notes filed under it.

  `accent` is 1-4 and points at --accent-N in src/styles/tokens.css. Four is the
  ceiling -- past that the colours stop telling groups apart. Renaming a category
  here is the only place it changes; content refers to it by `slug`.
*/
export const categories = [
  { name: 'tooling', slug: 'tooling', accent: 1, blurb: 'The tools around the code.' },
  {
    name: 'infra',
    slug: 'infra',
    accent: 2,
    blurb: 'Where it runs, and what it costs to keep it there.',
  },
  {
    name: 'data',
    slug: 'data',
    accent: 3,
    blurb: 'Databases, feeds, and the queries that get expensive.',
  },
  {
    name: 'build log',
    slug: 'build-log',
    accent: 4,
    blurb: 'Notes from building the things on this site.',
  },
] as const;

export const work = {
  /*
    The signature. 'line' draws the hairline leader that joins a product to its
    category, the way a printed table of contents joins a title to its page
    number; it thickens into the category accent on hover. 'none' drops the rule
    and leaves the two ends of the row to stand on their own.
  */
  leaderRule: 'line' as 'line' | 'none',
  /* Products whose status is 'building' are dimmed rather than hidden. Off, they
     are left out of the site entirely until their status changes. */
  showBuilding: true,
};

export const blog = {
  postsPerPage: 10,
  showReadingTime: true,
};

/*
  Contact. `endpoint` is a static form service (Formspree, Web3Forms, Basin):
  paste the URL it gives you and /contact renders the form. Left empty, the
  page offers the address instead -- better than a form with nowhere to post.

  Formspree and Basin take the URL alone. Web3Forms wants a key in the body as
  well, which Leader Pro carries.
*/
export const contact = {
  endpoint: '',
  email: 'hello@example.com',
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
