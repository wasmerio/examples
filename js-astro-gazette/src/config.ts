// src/config.ts — single entry point for site settings. Everything site-specific lives here; never hardcode in components.
export const site = {
  name: 'Gazette',
  description:
    'A weekly magazine published in issues: a cover, a contents page, and room for the long pieces.',
  url: 'https://example.com',
  locale: 'en', // BCP 47, e.g. 'en', 'ko'
  author: 'Marguerite Oyelaran', // Fictional demo editor. Replace with your name
  email: 'editor@example.com', // Printed on the masthead page as the editorial address
  defaultOgImage: '/og-default.png',
} as const;

export const nav = {
  header: [
    { label: 'Current Issue', href: '/' },
    { label: 'Archive', href: '/issues' },
    { label: 'Masthead', href: '/about' },
  ],
  footer: [
    {
      title: 'Magazine',
      links: [
        { label: 'Archive', href: '/issues' },
        { label: 'Masthead', href: '/about' },
        { label: 'RSS', href: '/rss.xml' },
      ],
    },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'lucide:github' },
    // Icons are Lucide names (https://lucide.dev/icons)
  ],
} as const;

export const seo = {
  titleTemplate: '%s · Gazette',
  twitterHandle: '',
  jsonLd: { type: 'Organization' as 'Person' | 'Organization', name: site.name },
};

// The signature. 'leaders' draws the dotted leader rule between a contents row's
// title and its byline; 'plain' falls back to a bare two-column row.
export const contents = {
  style: 'leaders' as 'leaders' | 'plain',
  numbering: true, // article numbers hung in the left margin
};

export const issues = {
  articlesPerIssue: 7, // editorial guide; nothing enforces it
  showFolio: true, // "Issue 04 · Essays · 03 / 07" line at the foot of an article
  dropCap: false, // off by default; an article opts in with `dropCap: true`
};

export const archive = {
  issuesPerPage: 12,
  showReadingTime: true,
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
