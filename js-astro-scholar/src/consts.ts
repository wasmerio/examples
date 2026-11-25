// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Friedrich Nietzsche';
export const SITE_DESCRIPTION = 'The academic portfolio of Friedrich Nietzsche.';

export const CV_URL = 'https://shravangoswami.com/resume.pdf';

export const CONTACT = {
  organization: 'Shravan Goswami',
  addressLines: [
    'Creator of Astro Scholar',
  ],
  emails: [
    'contact@shravangoswami.com',
  ],
};

export type SocialIcon = 'website' | 'scholar' | 'email' | 'github' | 'linkedin' | 'twitter';

export const SOCIAL_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  icon: SocialIcon;
}> = [
  {
    label: 'GitHub',
    href: 'https://github.com/shravanngoswamii/astro-scholar',
    icon: 'github',
  },
  {
    label: 'Email',
    href: 'mailto:contact@shravangoswami.com',
    icon: 'email',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shravangoswami/',
    icon: 'linkedin',
  },
  {
    label: 'X',
    href: 'https://x.com/shravangoswamii',
    icon: 'twitter',
  },
];

export const FOOTER_CREDIT = {
  designerName: 'Shravan Goswami',
  designerUrl: 'https://shravangoswami.com',
  sourceLabel: 'Open Source',
  sourceUrl: 'https://github.com/shravanngoswamii/astro-scholar',
};

// Umami analytics — configured via environment variables so no tracking ID is
// committed. Set PUBLIC_UMAMI_WEBSITE_ID (e.g. in a .env file or a CI variable)
// to enable it; leave it unset to disable analytics entirely.
export const UMAMI_SRC = import.meta.env.PUBLIC_UMAMI_SRC ?? 'https://cloud.umami.is/script.js';
export const UMAMI_WEBSITE_ID = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID ?? '';
