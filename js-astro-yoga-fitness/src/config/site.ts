import type { SiteConfig } from '../types';

/**
 * Central site configuration.
 *
 * Change your studio name, contact details, opening hours, social links,
 * form endpoints and SEO defaults here. Everything below is fictional demo
 * content — replace it before you launch.
 *
 * The production URL is set in `astro.config.mjs` (or the SITE_URL env var).
 */
export const site: SiteConfig = {
  name: 'Yoga Fitness',
  logoText: 'yogafitness',
  tagline: 'Yoga classes, breathwork & mindful movement',
  description:
    'Yoga Fitness offers guided yoga classes, breathwork, retreats and mobility sessions for every level.',
  footerAbout:
    'A neighborhood studio for mindful movement, steady breath and a community that shows up for each other.',
  lang: 'en',
  locale: 'en_US',

  // Demo mode keeps the placeholder address and phone number out of structured data.
  isDemo: true,

  contact: {
    email: 'contact@example.com',
    phone: '+1 (000) 555-0100',
    phoneHref: '+10005550100',
    address: {
      street: '123 Maplewood Lane, Suite 4B',
      locality: 'Springfield',
      region: 'IL',
      postalCode: '62704',
      country: 'USA',
    },
  },

  hours: [
    {
      label: 'Mon to Fri',
      hours: '6:00 to 21:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '06:00',
      closes: '21:00',
    },
    { label: 'Saturday', hours: '7:00 to 18:00', days: ['Saturday'], opens: '07:00', closes: '18:00' },
    { label: 'Sunday', hours: '8:00 to 14:00', days: ['Sunday'], opens: '08:00', closes: '14:00' },
  ],

  // Replace these with your own profile URLs.
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'camera' },
    { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'play' },
    { label: 'WhatsApp', href: 'https://www.whatsapp.com/', icon: 'chat' },
    { label: 'Website', href: 'https://example.com/', icon: 'globe' },
  ],

  bookingUrl: '/contact',

  forms: {
    // e.g. 'https://formspree.io/f/your-form-id' — see README › Contact form.
    contactAction: '',
    newsletterAction: '',
  },

  seo: {
    defaultTitle: 'Yoga Fitness | Yoga Classes, Breathwork & Mindful Movement',
    titleSeparator: '|',
    ogImage: '/og-default.jpg',
    ogImageAlt: 'A woman meditating cross-legged in tall grass at sunset',
    twitterHandle: '',
    themeColor: '#F5F4F1',
  },

  copyright: 'Yoga Fitness. All rights reserved.',
};
