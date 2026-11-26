/** Popular: theme configuration (Truly Madly Riley, personal-site demo).
 *  Shows the theme running a personal site for one person instead of a
 *  community: the blog is a news feed, events are speaking appearances,
 *  and there is no organizers section at all. Riley is fictional.
 *  See README for all options. */

export const SITE = {
  title: "Truly Madly Riley",
  tagline: "A fictional superfan's personal site, demo content for the Popular theme",
  description: "Riley's corner of the internet: Darren Hayes fandom, vinyl news, and the occasional conference talk. (Riley is a made-up person, this is example content demonstrating the Popular theme as a personal site.)",
  brandName: "Truly Madly",
  brandSub: "Riley",
  logo: '/images/logo.svg',
  favicon: '/images/logo.svg',
  ogImage: '/images/hero.svg',
  locale: 'en-US',
  landAcknowledgement: "Fan-made and gloriously unofficial: this site is a love letter, not affiliated with anyone it adores.",
};

/* UI strings. The key set matches the Hugo theme's i18n/en.toml (see
   PARITY.md); the values here are re-voiced for a personal site, which is
   also how you'd translate the theme. */
export const STRINGS: Record<string, string> = {
  skipToContent: 'Skip to content',
  primaryNav: 'Primary',
  toggleMenu: 'Toggle menu',
  nextMeetup: 'Next appearance',
  venueTba: 'Venue to be announced',
  eventCancelled: 'Cancelled',
  rsvp: 'Details',
  rsvpExternal: 'Event details',
  allEvents: 'All appearances',
  allSpeakers: 'All speakers',
  allVenues: 'All venues',
  allOrganizers: 'All organizers',
  comingUp: 'On the calendar',
  upcomingEvents: 'Upcoming appearances',
  upcomingLead: 'Podcasts, panels, popups and the occasional conference. Come say hi after.',
  noUpcomingEvents: 'Nothing booked right now. Invite me to your thing, or your karaoke night.',
  lookingBack: 'Looking back',
  pastEvents: 'Past appearances',
  venueWanted: 'Venue wanted',
  eventPlanning: 'Planning',
  confirmed: 'Confirmed',
  fromTheBlog: 'From the blog',
  latestFromCommunity: 'Latest news & obsessions',
  readTheBlog: 'Read the news',
  allPosts: 'All posts',
  filterLabel: 'Filter:',
  filterAll: 'All',
  subscribeRss: 'Subscribe via RSS',
  subscribeCalendar: 'Subscribe to calendar',
  subscribeGoogle: 'Add to Google Calendar',
  downloadCalendar: 'Download .ics',
  watchRecording: 'Watch',
  viewSlides: 'Slides',
  hasRecording: 'Recording available',
  talks: 'Talks',
  talksLead: 'Every talk from our past events, with recordings and slides where we have them.',
  learnMore: 'Learn more',
  joinChat: 'Join the chat',
  speakerInviteTitle: 'Your name here?',
  speakerInviteBody: 'We are always looking for new voices. Lightning talks welcome, and we will help you prepare.',
  subscribeRssTitle: 'Follow new posts in any feed reader',
  noPosts: 'No posts yet, check back soon.',
  ourSpeaker: 'Our speaker',
  minRead: '{n} min read',
  authorsBy: 'By',
  listSeparator: ', ',
  listSeparatorFinal: ' & ',
  posts: 'Posts',
  guest: 'Guest',
  website: 'Website',
  previewLabel: 'Preview',
  previewBanner: 'This is a preview. Nothing here is published yet.',
  checklist: 'Checklist',
  copyCode: 'Copy code',
  checklistDone: 'done',
  writtenBy: 'Written by {name}',
  eyebrowBlog: 'News',
  eyebrowEvents: 'Appearances',
  eyebrowAuthor: 'Author',
  eyebrowDocs: 'Guides',
  eyebrowTag: 'Tag',
  taggedCount: '{n} post(s) tagged {tag}',
  speakers: 'Speakers',
  eyebrowSpeaker: 'Speaker',
  eyebrowOrganizer: 'Organizer',
  sessionsBy: 'Sessions by {name}',
  eyebrowVenue: 'Venue',
  gettingThere: 'Getting there & access',
  wheelchairAccessible: 'Wheelchair accessible',
  transit: 'Transit',
  parking: 'Parking',
  venueEvents: 'Events held here',
  beforeYouArrive: 'Before you arrive',
  postNavigation: 'More posts',
  newerPost: 'Newer post',
  olderPost: 'Older post',
  paginationLabel: 'Pagination',
  paginationPrev: 'Previous',
  paginationNext: 'Next',
};

/* List pagination size. Mirrors Hugo's [pagination] pagerSize (see PARITY.md). */
export const PAGINATION = { pageSize: 3 };

/* Renameable content sections: point post-author bylines or the homepage
   team grid at a differently-named collection (must exist in your
   content.config.ts). Defaults are the theme's own section names.
   Hugo parity: [params.sections] (see PARITY.md). */
export const SECTIONS_MAP = {
  authors: 'authors',
  team: 'organizers',
};

/* Celestial gold on midnight: burnished gold with dark button text,
   silk-cream ink, deep cosmos surfaces. Uses the dark-palette brand keys. */
export const BRAND: Record<string, string> = {
  primary: '#C3A364',        // burnished gold: buttons & main branding
  primaryHover: '#D9BA7B',   // brighter champagne gold on hover
  primaryActive: '#A1834C',  // deeper metallic gold when active
  secondary: '#E6C687',      // soft champagne shimmer
  accent: '#F3E5AB',         // radiant stardust cream
  ink: '#F4F1EA',            // silk-cream headings on the dark backgrounds
  link: '#D9BA7B',           // prose links need light gold on midnight
  linkHover: '#F3E5AB',
  surfaceWash: '#121B2D',    // midnight-blue hero / section wash
  surfaceWashSoft: '#141F36',
  surfaceInk: '#0A0E1A',     // deep cosmos footer bands
  surfacePage: '#0A0E1A',    // the page itself goes dark
  surfaceCard: '#121B2D',
  surfaceTertiary: '#0F1626',
  textBody: '#D9D4C5',
  textMuted: '#A39D8A',
  textOnBrand: '#0A0E1A',    // dark text on gold buttons, not white
  borderSubtle: '#26304A',
  fontSans: 'Inter, system-ui, sans-serif',
  fontDisplay: 'Quantico, Inter, sans-serif',
};

export const NAV: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: 'About', href: '/about/' },
  { label: 'News', href: '/blog/' },
  { label: 'Appearances', href: '/events/' },
  { label: 'Listening guide', href: '/listening-guide/' },
];

export const CTA = { label: 'Say hi', url: 'mailto:hello@example.com', icon: 'fa-solid fa-envelope' };

export const SOCIAL = [
  { label: 'Mastodon', icon: 'fa-brands fa-mastodon', url: 'https://example.com' },
  { label: 'Instagram', icon: 'fa-brands fa-instagram', url: 'https://example.com' },
  { label: 'RSS', icon: 'fa-solid fa-rss', url: '/rss.xml' },
  { label: 'Email', icon: 'fa-solid fa-envelope', url: 'mailto:hello@example.com' },
];

export const FOOTER = {
  tagline: "Truly, madly, deeply a fan site, an Astro demo site for the Popular theme",
  credit: { label: 'Popular. An Astro theme by Mariatta.', url: 'https://popular.mariatta.ca/' },
  columns: [
    { title: 'Site', links: [
      { label: 'About', href: '/about/' },
      { label: 'News', href: '/blog/' },
      { label: 'Appearances', href: '/events/' },
    ]},
    { title: 'Fan stuff', links: [
      { label: 'Listening guide', href: '/listening-guide/' },
      { label: 'Concert prep', href: '/concert-prep/' },
    ]},
    { title: 'Say hi', links: [
      { label: 'Email', href: 'mailto:hello@example.com' },
      { label: 'Mastodon', href: 'https://example.com' },
    ]},
  ],
};

/** Support box at the bottom of blog posts; a personal site's tip jar. */
export const SUPPORT = {
  badge: 'Enjoying the blog?',
  text: 'This site is a one-person labour of love (and of one particular discography). If a post made your day, you can toss a coin in the tip jar or just tell me your favourite b-side.',
  ctas: [
    { label: 'Tip jar', url: 'https://example.com/tips', variant: 'primary' },
    { label: 'Say hi', url: 'mailto:hello@example.com', variant: 'outline' },
  ],
};

/** Section list-page headers. */
export const SECTIONS = {
  blog: { eyebrow: 'News', title: 'News & obsessions', lead: 'Site news, vinyl arrivals, concert diaries and essays nobody asked for.' },
  events: { eyebrow: 'Appearances', title: 'Appearances & collabs', lead: "Fandom, pop history and why Affirmation still slaps: I'll talk about it anywhere with a microphone." },
  organizers: { eyebrow: 'The team', title: 'Organizers', lead: 'It is just me here.' },
  speakers: { eyebrow: 'Speakers', title: 'Speakers', lead: 'Everyone who has taken the mic at one of our gatherings.' },
  venues: { eyebrow: 'Venues', title: 'Venues', lead: 'The rooms that host us.' },
};

export const HOME = {
  hero: {
    eyebrow: "Truly · Madly · Deeply",
    title: "Hi, I'm Riley: full-time Darren Hayes superfan",
    lead: "Writer, vinyl collector, occasional conference speaker, and the person your friends warned you about if you mention Savage Garden within earshot. This is my corner of the internet.",
    image: '/images/hero.svg',
    ctas: [
      { label: 'About me', url: '/about/', icon: 'fa-solid fa-heart', variant: 'primary' },
      { label: 'Read the news', url: '/blog/', variant: 'outline' },
    ],
  },
  stats: [{ value: "1997", label: "fan since" }, { value: "27", label: "concerts attended" }, { value: "2", label: "cassette copies of Affirmation" }, { value: "5", label: "karaoke trophies" }],
  featuresHead: { eyebrow: 'What I do here', title: "One person, three hobbies, one discography", lead: 'The site is personal; the enthusiasm is universal.' },
  features: [
    { icon: "fa-solid fa-pen-nib", title: "Write", body: "News updates, concert diaries and essays on two decades of pop history." },
    { icon: "fa-solid fa-record-vinyl", title: "Collect", body: "Vinyl, cassettes, tour programmes, and one very treasured signed setlist." },
    { icon: "fa-solid fa-microphone-lines", title: "Talk", body: "Panels and podcasts about fandom, nostalgia and why b-sides matter." },
  ],
  testimonialsHead: { eyebrow: 'Kind words', title: 'What people say about the blog' },
  testimonials: [
    { quote: "Riley once explained the entire Savage Garden discography to me at a bus stop. I missed my bus on purpose.", name: "Priya", role: "Friend, converted fan" },
    { quote: "The listening guide got me from zero to crying at Two Beds and a Coffee Machine in a weekend.", name: "Marcus", role: "Reader" },
    { quote: "I came for the vinyl photos and stayed for the footnotes.", name: "June", role: "Newsletter subscriber" },
  ],
  getInvolved: {
    eyebrow: 'Say hi',
    title: "Tell me your favourite b-side",
    lead: "Invite me to your podcast, trade vinyl doubles, or just argue amiably about track sequencing.",
    ctas: [
      { label: 'Email me', url: 'mailto:hello@example.com', variant: 'primary' },
      { label: 'Upcoming appearances', url: '/events/', variant: 'outline' },
    ],
  },
};

/** Demo-only switcher bar. Adopters: set to null (or delete the demo bar usage). */
export const DEMO_BAR = {
  current: "superfan",
  repo: 'https://github.com/Mariatta/astro-theme-popular',
  links: [
    { slug: 'aquarium', label: 'Aquarium', icon: 'fa-solid fa-fish' },
    { slug: 'foodie', label: 'Foodie', icon: 'fa-solid fa-utensils' },
    { slug: 'kdrama', label: 'KDrama', icon: 'fa-solid fa-tv' },
    { slug: 'superfan', label: 'Superfan', icon: 'fa-solid fa-star' },
  ],
};
