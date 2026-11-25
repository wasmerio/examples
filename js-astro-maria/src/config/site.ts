export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: 'Maria',
  title: 'Maria - Product designer portfolio',
  description:
    'Maria is a product designer who turns dense workflows and fuzzy requirements into clear, trustworthy digital products. Selected work, case studies, and resume.',
  siteUrl: 'https://maria.xocoweb.workers.dev',
  language: 'en',
  locale: 'en_US',
  dateLocale: 'en-US',
  socialImage: '/og-image.png',

  author: {
    name: 'Maria Ionescu',
    role: 'Product Designer',
    location: 'Lisbon, Portugal',
    email: 'hello@example.com',
  },

  /** The pill above the homepage headline. Set `enabled: false` to remove it. */
  availability: {
    enabled: true,
    label: 'Available for new projects from January 2027',
  },

  /** The button at the end of the header and in the mobile menu. */
  action: { label: 'Get in touch', href: 'mailto:hello@example.com' },

  /** A PDF in `public/`, offered on the resume page. Leave empty to hide the button. */
  resumePdf: '',

  /** The banner and preferences dialog. Set `enabled: false` to remove both. */
  cookieConsent: {
    enabled: true,
  },

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Dribbble', href: 'https://dribbble.com/' },
    { label: 'Behance', href: 'https://www.behance.net/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ] satisfies NavLink[],
};

export const navigation: NavLink[] = [
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
  { label: 'Resume', href: '/resume/' },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Cookies', href: '/cookies/' },
];
