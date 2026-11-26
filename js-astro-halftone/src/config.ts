// src/config.ts — single entry point for site settings. Everything site-specific lives here; never hardcode in components.
import defaultOgImage from './assets/sample/the-cranes-at-kieldrecht.avif';

export const site = {
  name: 'Halftone',
  description:
    'A newsmagazine where the picture leads: cover plates, section desks, and reporting with room to breathe.',
  url: 'https://example.com',
  locale: 'en', // BCP 47, e.g. 'en', 'ko'
  author: 'Linnea Holm', // Fictional demo editor. Replace with your name
  // The share card for pages that carry no photograph of their own (colophon, 404). Swap the
  // import above for your own picture; it is cropped to 1200x630 at build.
  defaultOgImage,
} as const;

export const nav = {
  header: [
    { label: 'Ports', href: '/ports' },
    { label: 'Transit', href: '/transit' },
    { label: 'Power', href: '/power' },
    { label: 'Land', href: '/land' },
    { label: 'Colophon', href: '/colophon' },
  ],
  footer: [
    {
      title: 'More',
      links: [
        { label: 'Colophon', href: '/colophon' },
        { label: 'Feed', href: '/rss.xml' },
      ],
    },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'lucide:github' },
    // Icons are Lucide names (https://lucide.dev/icons)
  ],
} as const;

export const seo = {
  titleTemplate: '%s · Halftone',
  twitterHandle: '',
  jsonLd: { type: 'Person' as 'Person' | 'Organization', name: site.author },
};

// The signature. Cover lines are the stacked, labelled teasers set on a cover
// plate: a kicker box, a headline, a short deck, one per entry.
export const coverLines = {
  overlay: true, // false lays them beside the photograph instead of on it
  divider: 'plus' as 'plus' | 'rule' | 'none',
  max: 3, // entries on the home plate
};

export const blog = {
  postsPerPage: 4, // a desk front runs four; the fifth article starts page two
  relatedPosts: 3,
  showReadingTime: true,
};

export const features = {
  darkMode: true,
};

// Nothing is loaded until a provider is named. `id` is the site identifier the provider
// gave you: the domain for Plausible, the measurement id (G-XXXXXXX) for GA4, the website id
// for Umami. `host` is for a self-hosted install -- the origin the script is served from.
export const analytics = {
  provider: null as null | 'plausible' | 'ga4' | 'umami',
  id: '',
  host: '',
};
