// src/config.ts — single entry point for site settings. Everything site-specific lives here; never hardcode in components.
export const site = {
  name: 'Harbor Notes',
  description: 'What a box costs to move, and why it changed.',
  url: 'https://example.com',
  locale: 'en', // BCP 47, e.g. 'en', 'ko'
  author: 'Ines Varga', // Fictional demo author. Replace with your name
  defaultOgImage: '/og-default.png',
} as const;

export const nav = {
  header: [
    { label: 'Archive', href: '/archive' },
    { label: 'About', href: '/about' },
    { label: 'Subscribe', href: '/subscribe' },
  ],
  footer: [
    {
      title: 'Site',
      links: [
        { label: 'Archive', href: '/archive' },
        { label: 'About', href: '/about' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
    {
      title: 'Readers',
      links: [
        { label: 'Start here', href: '/start-here' },
        { label: 'Corrections', href: '/corrections' },
        { label: 'Sponsor an issue', href: '/sponsor' },
      ],
    },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'lucide:github' },
    // Icons are Lucide names (https://lucide.dev/icons)
  ],
} as const;

export const seo = {
  titleTemplate: '%s · Harbor Notes',
  twitterHandle: '',
  jsonLd: { type: 'Person' as 'Person' | 'Organization', name: site.author },
};

export const newsletter = {
  cadence: 'Every Tuesday',
  // Number of the oldest issue on the site. Moving from another platform mid-run? Set it to
  // the number your first imported issue had there, and the rest count up from it by date.
  firstIssue: 93,
  // The Cut: a members issue's free part ends at <!-- cut --> and the rest is removed from the
  // build (page and RSS). false keeps the removal but shows a plain "Continue reading" link
  // instead of the rule, word meter and form.
  theCut: true,
  price: '$12/mo', // printed on the members button; keep it in step with `plans` below
  // The subscribe forms post to Buttondown. Another provider: src/lib/subscribe-target.ts.
  username: 'harbor-notes', // Buttondown newsletter username
  homeRecent: 8, // archive rows on the home page
};

// The /subscribe table, in order. `price` is printed as written.
export const plans = [
  {
    name: 'Free',
    price: '$0',
    detail: 'The free issues, about two in five, and the opening of every members issue.',
  },
  { name: 'Monthly', price: '$12 a month', detail: 'Every issue in full, plus the archive.' },
  {
    name: 'Annual',
    price: '$120 a year',
    detail: 'Every issue in full, plus the archive. Two months free.',
  },
];

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

// Every word the theme prints, in one place: translate these and set site.locale, which also
// sets the language of dates and numbers. Counts are functions, so plurals stay right:
// issues: (count) => `${count} Ausgaben`. Numbers arrive formatted (1,240).
const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
export const ui = {
  skipToContent: 'Skip to content',
  mainNav: 'Main', // read out for the header links
  rss: 'RSS',
  theme: { name: 'Theme', system: 'System', light: 'Light', dark: 'Dark' },
  issues: (count: number) => n(count, 'issue', 'issues'),
  free: 'Free', // an issue's access, beside its week label
  members: 'Members',
  minutes: (count: number) => `${count} min`,
  updated: 'Updated',
  bar: {
    members: (share: number) => `Members issue, ${share}% free`, // read out for an archive row's bar
    free: 'Free issue',
    note: 'The bar shows how much of each issue is free.',
  },
  cut: {
    label: 'Members-only continuation',
    teaser: (free: string, total: string) => `${free} of ${total} words free`,
    read: (free: string, total: string) => `You've read ${free} of ${total} words`,
    rest: (words: string, minutes: number) => `${words} words · ${minutes} min for members`,
    readFree: 'Read the free part',
    button: (price: string) => `Read the rest · ${price}`,
    continue: 'Continue reading', // newsletter.theCut = false
    member: 'Already a member?',
    byEmail: 'Members get the full issue by email.',
    feed: (words: string) => `Continue reading: ${words} more words for members`, // RSS
  },
  form: { email: 'Email address', placeholder: 'you@company.com', button: 'Subscribe' },
  home: {
    byline: (cadence: string, author: string) => `${cadence} · by ${author}`,
    latest: 'Latest issue',
    readIssue: (number: number) => `Read issue ${number}`,
    recent: 'Recent issues',
    fullArchive: 'Full archive',
    subscribe: 'Subscribe',
    pitch: (cadence: string, price: string) =>
      `${cadence}, one issue. Free issues go to everyone on the list; members get every issue in full for ${price}.`,
  },
  issue: {
    next: 'Get the next issue',
    cadence: (cadence: string) => `${cadence}, by email.`,
    more: 'More issues', // read out for the previous/next rows
  },
  archive: {
    title: 'Archive',
    description: (count: number) => `Every issue, ${count} so far.`,
    summary: (count: number, since: string, members: number) =>
      `${count} issues since ${since} · ${members} for members.`,
    topics: 'Topics',
  },
  topic: { description: (topic: string) => `Issues on ${topic.toLowerCase()}.` },
  startHere: {
    title: 'Start here',
    description: `Where to begin with ${site.name}: a short reading list.`,
    intro: (count: number) =>
      `${count} issues is a lot to read backwards. These are the ones I send to people who ask where to begin. The bar on each row shows how much of it is free.`,
    latest: 'The latest', // the shelf shown until the ids in start-here.astro match your issues
  },
  subscribe: {
    title: 'Subscribe',
    description: `${site.description} Free and paid plans.`,
    intro: (cadence: string) =>
      `${cadence}, ${site.name} sends one issue on container freight rates, capacity and the schedule data behind them, written by ${site.author}. Sign up free, then upgrade from the welcome email if you want the members issues in full.`,
    plans: 'Plans',
    plan: 'Plan',
    price: 'Price',
    get: 'What you get',
    samples: 'Read a free issue first',
  },
  subscribed: {
    title: 'Check your inbox',
    description: `Confirm your subscription to ${site.name}.`,
    text: "A confirmation email is on its way. Click the link in it and you're on the list.",
    demo: 'This is a demo site, so nothing was sent and no address was stored. On a real site the form goes to your newsletter provider, which sends a confirmation email and then brings the reader here.',
    meanwhile: 'Meanwhile, three free issues',
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you asked for is not here.',
    home: 'Back to the home page',
  },
};
