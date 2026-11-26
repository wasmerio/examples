export const siteConfig = {
  name: 'Agency Name',
  shortName: 'Agency',
  domain: 'agency.gov',
  description: 'Official website of [Agency Name]. Find services, information, and resources.',
  locale: 'en-US',

  // Required links for USA Identifier footer component
  links: {
    about: '/about/',
    accessibility: '/accessibility/',
    foia: 'https://www.foia.gov/',
    noFear: 'https://www.eeoc.gov/no-fear-act-data',
    oig: 'https://www.oversight.gov/',
    privacy: '/privacy/',
    budget: '/',
    usagov: 'https://www.usa.gov/',
  },
} as const;

export type SiteConfig = typeof siteConfig;
