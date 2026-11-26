// src/config.ts — single entry point for site settings. Every site-specific value lives here; never hardcode them in components.
import defaultOgImage from './assets/og-default.png';

export const site = {
  name: 'Pilcrow',
  description: 'A minimal, typography-first Astro theme.',
  url: 'https://example.com',
  locale: 'en', // 'en' | 'ko' | 'hu' — UI strings come from src/i18n/<locale>.ts
  author: 'Ada Marlow', // Fictional demo author. Replace with your name
  defaultOgImage, // 1200×630. A post's heroImage takes precedence
} as const;

export const nav = {
  header: [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: [
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'lucide:github' },
    // Icons are Lucide names (https://lucide.dev/icons), e.g. { label: 'Mastodon', href: '…', icon: 'lucide:at-sign' }
  ],
} as const;

export const seo = {
  titleTemplate: '%s · Pilcrow',
  twitterHandle: '',
  jsonLd: { type: 'Person' as 'Person' | 'Organization', name: site.author },
};

export const blog = {
  postsPerPage: 10,
  dropCap: true, // Drop the first letter of a post two lines, in the accent color
};

export const features = {
  darkMode: true,
};

// Forms post to static-friendly services. With an empty value the form still renders but won't submit.
export const forms = {
  web3formsKey: '', // /contact — access key from https://web3forms.com
  newsletter: {
    action: '', // subscribe URL that accepts a single `email` field
  },
};

export const analytics = {
  provider: null as null | 'plausible' | 'ga4' | 'umami',
  id: '',
  // Self-hosted Plausible or Umami: the origin serving the script, no trailing slash.
  // Empty means the hosted service. GA4 ignores it.
  host: '',
};
