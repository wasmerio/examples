import type { SiteConfig } from '../types';

/**
 * Central theme configuration.
 * Change the values below to rebrand the theme — every component reads from here.
 * All contact details are placeholders for the demo.
 */
export const siteConfig: SiteConfig = {
  name: 'ST AI Agency',
  brand: { prefix: 'ST', accent: 'AI', suffix: 'Agency' },
  tagline: 'AI agents that run the work, not the demo.',
  description:
    'ST AI Agency builds and runs AI agents for support, sales and back-office teams. Always on, fully audited, live in six weeks.',
  lang: 'en',
  locale: 'en_US',

  email: 'hello@example.com',
  phone: '+1 (000) 123-456',
  phoneHref: '+1000123456',
  location: {
    label: 'Studio',
    lines: ['742 Evergreen Terrace', 'Springfield, United States'],
  },
  responseTime: 'Under one business day, always in writing first',

  footerBlurb:
    'AI agents for operations teams who have to answer for the result. Built, measured and run from Springfield.',
  copyright: `© ${new Date().getFullYear()} ST AI Agency. All rights reserved.`,

  // Replace with your own profiles. Remove an entry to hide its icon.
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'X', href: 'https://x.com/', icon: 'x' },
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'RSS feed', href: '/rss.xml', icon: 'rss' },
  ],

  seo: {
    titleSeparator: ' — ',
    defaultTitle: 'ST AI Agency — AI agents that run the work',
    ogImage: '/preview.jpg',
    ogImageAlt: 'ST AI Agency theme preview showing the homepage on desktop and mobile.',
    twitterHandle: undefined,
    themeColor: '#EC5A11',
  },

  cta: { label: 'Book a demo', shortLabel: 'Book demo', href: '/#contact' },

  forms: {
    contactAction: '',
    newsletterAction: '',
    netlify: false,
  },
};
