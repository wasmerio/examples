// src/config.ts — single entry point for site settings. Everything site-specific lives here; never hardcode in components.
export const site = {
  name: 'Quarry',
  description: 'A marketing site for a developer tool, set like a printed technical reference.',
  url: 'https://example.com',
  locale: 'en', // BCP 47, e.g. 'en', 'ko'
  author: 'Ada Example', // Fictional demo company. Replace with your own
  defaultOgImage: '/og-default.png',
} as const;

export const nav = {
  header: [
    { label: 'How it works', href: '/#how' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Writing', href: '/blog' },
    { label: 'About', href: '/about' },
  ],
  // The header keeps one call to action to the right of the links above.
  cta: { label: 'Start free', href: '/pricing' },
  footer: [
    {
      title: 'Product',
      links: [
        { label: 'Pricing', href: '/pricing' },
        { label: 'Writing', href: '/blog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
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
    // Icons are Lucide names (https://lucide.dev/icons)
  ],
} as const;

export const seo = {
  titleTemplate: '%s · Quarry',
  twitterHandle: '',
  jsonLd: { type: 'Organization' as 'Person' | 'Organization', name: site.name },
};

export const blog = {
  postsPerPage: 10,
  showReadingTime: true,
};

export const contact = {
  // Where /contact posts. Any service that accepts a plain form POST works:
  // Formspree, Web3Forms, Basin. Replace the id; nothing else on the page changes.
  formEndpoint: 'https://formspree.io/f/your-form-id',
  email: 'hello@example.com', // shown beside the form for people who would rather write
  responseTime: 'Two working days, usually the same one.',
};

export const features = {
  darkMode: true,
  // The signature: numbered labels that stay in the left margin while a section
  // scrolls. Off puts the label inline above the section heading instead.
  marginalIndex: true,
  // A flag lands here when something reads it. One that controls nothing is worse
  // than no flag, because a buyer turns it on and waits.
};

export const analytics = {
  provider: null as null | 'plausible' | 'ga4' | 'umami',
  id: '',
  // Self-hosted Plausible or Umami: the origin serving the script, no trailing slash.
  // Empty means the hosted service. GA4 ignores it.
  host: '',
};

// Every word the theme prints around your content, in one place: translate these and set
// site.locale, which also sets dates and prices. Counts are functions, so plurals stay right:
// posts: (count) => `${count} Artikel`. Strings marked HTML carry a link and are printed as
// markup. The marketing pages (home, pricing, about) are written in their own files under
// src/pages/.
const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
export const ui = {
  skipToContent: 'Skip to content',
  mainNav: 'Main', // read out for the header links
  rss: 'RSS',
  theme: { system: 'System', light: 'Light', dark: 'Dark' },
  updated: 'Updated',
  lastUpdated: (date: string) => `Last updated ${date}`,
  pagination: 'Pagination', // read out for the newer/older and previous/next links
  blog: {
    title: 'Writing',
    page: (page: number) => `Writing, page ${page}`,
    description:
      'Notes on how Quarry indexes, ranks and searches, and what we decided not to build.',
    intro:
      'Mostly about the parts of a search engine that are boring from the outside: what the index leaves out, why ranking changed, and where a network request would have been convenient and was not made.',
    newer: 'Newer',
    older: 'Older',
    pageOf: (page: number, last: number) => `Page ${page} of ${last}`,
    minutes: (count: number) => `${count} min`,
    all: 'All writing',
    tag: 'Tag',
    tagDescription: (tag: string) => `Everything written about ${tag}.`,
    posts: (count: number) => n(count, 'post', 'posts'),
    feed: `${site.name} — Writing`, // the RSS feed's title
  },
  pricing: {
    month: ' a month', // after a price, with its space
    twelveMonths: (price: string) => `${price} over twelve months`,
    featured: 'Most bought',
  },
  contact: {
    title: 'Contact',
    description: `Ask a question about ${site.name}, report a problem, or write about a licence.`,
    heading: 'Write to us.',
    intro:
      'A licence question, a file that will not index, a feature you need. It reaches the two people who write the software, not a queue.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    // HTML
    messageHint:
      'If it is a file that will not index, the output of <code class="font-mono text-[0.84375rem]">quarry status</code> tells us more than anything else you could paste.',
    send: 'Send',
    reply: 'Reply',
    byMail: 'By mail',
    bugs: 'Bugs',
    // HTML. {issues} is the first link in nav.social.
    bugsText:
      'The <a href="{issues}">issue tracker</a> is read before this form is, and other people can see the answer there.',
  },
  notFound: {
    title: 'Page not found',
    heading: 'Nothing is indexed here.',
    text: 'The page you asked for is not on this site. It may have moved, or the link may have been written down wrong.',
    blog: 'Writing',
    pricing: 'Pricing',
    home: 'Home',
  },
};
