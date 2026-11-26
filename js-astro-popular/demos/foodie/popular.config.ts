/** Popular: theme configuration (Lucky Town Foodie Club demo). See README for all options. */

export const SITE = {
  title: "Lucky Town Foodie Club",
  tagline: "A fictional foodie club, demo content for the Popular theme",
  description: "Neighbours who cook, eat and share in Lucky Town. (Lucky Town is a made-up place, this is example content demonstrating the Popular theme.)",
  brandName: "Lucky Town",
  brandSub: "Foodie Club",
  logo: '/images/logo.png',
  favicon: '/images/logo.png',
  ogImage: '/images/hero.png',
  locale: 'en-US',
  landAcknowledgement: "Add your community's land acknowledgement or welcome statement here, this demo keeps it as a placeholder.",
};

/* UI strings. Translate your site by editing these values; keys map 1:1 to
   the Hugo theme's i18n/en.toml (see PARITY.md). */
export const STRINGS: Record<string, string> = {
  skipToContent: 'Skip to content',
  primaryNav: 'Primary',
  toggleMenu: 'Toggle menu',
  nextMeetup: 'Next meetup',
  venueTba: 'Venue to be announced',
  eventCancelled: 'Cancelled',
  rsvp: 'RSVP',
  rsvpExternal: 'RSVP on Luma',
  allEvents: 'All events',
  allSpeakers: 'All speakers',
  allVenues: 'All venues',
  allOrganizers: 'All organizers',
  comingUp: 'Coming up',
  upcomingEvents: 'Upcoming events',
  upcomingLead: 'Save your seat early, space is limited and our rooms fill up.',
  noUpcomingEvents: 'Nothing on the calendar right now, follow us to hear when the next one lands.',
  lookingBack: 'Looking back',
  pastEvents: 'Past events',
  venueWanted: 'Venue wanted',
  eventPlanning: 'Planning',
  confirmed: 'Confirmed',
  fromTheBlog: 'From the blog',
  latestFromCommunity: 'Latest from our community',
  readTheBlog: 'Read the blog',
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
  eyebrowBlog: 'Blog',
  eyebrowEvents: 'Events',
  eyebrowAuthor: 'Author',
  eyebrowDocs: 'Docs',
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

export const BRAND: Record<string, string> = {
  primary: "#b45309",
  primaryHover: "#92400e",
  primaryActive: "#7c2d12",
  secondary: "#7c2d12",
  accent: "#0f766e",
  ink: '#142a36',
  surfaceWash: "#efe7dd",
  surfaceWashSoft: "#f8f3ec",
  surfaceInk: '#142a36',
  fontSans: 'Inter, system-ui, sans-serif',
  fontDisplay: 'Quantico, Inter, sans-serif',
};

export const NAV: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: 'Start here', href: '/start/' },
  {
    label: 'About',
    href: '/about/',
    children: [
      { label: 'About us', href: '/about/' },
      { label: 'Organizers', href: '/organizers/' },
    ],
  },
  { label: 'Blog', href: '/blog/' },
  { label: 'Events', href: '/events/' },
  { label: 'Cook with us', href: '/speak/' },
  { label: 'Handbook', href: '/handbook/' },
];

export const CTA = { label: 'RSVP', url: 'https://example.com/rsvp', icon: 'fa-solid fa-calendar' };

export const SOCIAL = [
  { label: 'Instagram', icon: 'fa-brands fa-instagram', url: 'https://example.com' },
  { label: 'Mastodon', icon: 'fa-brands fa-mastodon', url: 'https://example.com' },
  { label: 'RSS', icon: 'fa-solid fa-rss', url: '/rss.xml' },
  { label: 'Email', icon: 'fa-solid fa-envelope', url: 'mailto:hello@example.com' },
];

export const FOOTER = {
  tagline: "Cook · Eat · Share, an Astro demo site for the Popular theme",
  credit: { label: 'Popular. An Astro theme by Mariatta.', url: 'https://popular.mariatta.ca/' },
  columns: [
    { title: 'Community', links: [
      { label: 'About us', href: '/about/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Code of Conduct', href: '/code-of-conduct/' },
    ]},
    { title: 'Get involved', links: [
      { label: 'Host a session', href: '/get-involved/' },
      { label: 'Offer a venue', href: '/get-involved/' },
      { label: 'Organizers', href: '/organizers/' },
    ]},
    { title: 'Organizers', links: [
      { label: 'Organizer Handbook', href: '/handbook/' },
      { label: 'Meetup Runbooks', href: '/runbooks/' },
    ]},
  ],
};

/** Support box at the bottom of blog posts, null hides it. */
export const SUPPORT = null;

/** Section list-page headers. */
export const SECTIONS = {
  blog: { eyebrow: 'Blog', title: 'From our community', lead: "Recaps and spotlights from Lucky Town Foodie Club, example posts showing the theme's blog." },
  events: { eyebrow: 'Events', title: 'Upcoming gatherings & announcements', lead: 'All events are free, and newcomers are always welcome.' },
  organizers: { eyebrow: 'The team', title: 'Organizers', lead: "Lucky Town Foodie Club is run entirely by volunteers. Want to help? We'd love to have you." },
  speakers: { eyebrow: 'Speakers', title: 'Speakers', lead: 'Everyone who has taken the mic at one of our gatherings.' },
  venues: { eyebrow: 'Venues', title: 'Venues', lead: 'The rooms that host us.' },
};

export const HOME = {
  hero: {
    eyebrow: "Cook · Eat · Share",
    title: "Neighbours who cook, eat and share",
    lead: "Lucky Town Foodie Club is a home for everyone who plans their day around meals. We cook together, crawl the city's best dessert counters, and argue lovingly about poutine.",
    image: '/images/hero.png',
    ctas: [
      { label: 'RSVP', url: 'https://example.com/rsvp', icon: 'fa-solid fa-calendar', variant: 'primary' },
      { label: 'About us', url: '/about/', variant: 'outline' },
    ],
  },
  stats: [{ value: "2019", label: "club founded" }, { value: "All", label: "appetites welcome" }, { value: "Free", label: "to attend" }, { value: "Monthly", label: "dinners in Lucky Town" }],
  featuresHead: { eyebrow: 'What we do', title: "What Lucky Town Foodie Club is all about", lead: 'No experience necessary, come as you are.' },
  features: [
    { icon: "fa-solid fa-utensils", title: "Cooking nights", body: "Hands-on evenings where everyone leaves with flour on their shirt and a container of leftovers." },
    { icon: "fa-solid fa-ice-cream", title: "Food crawls", body: "Guided wanders through dessert counters, dumpling windows and the occasional legendary food truck." },
    { icon: "fa-solid fa-bowl-food", title: "Potlucks & cook-offs", body: "Bring a dish, defend your recipe. The great poutine cook-off is our unofficial championship." },
  ],
  testimonialsHead: { eyebrow: 'Kind words', title: 'What members say' },
  testimonials: [
    { quote: "I came for the potluck and stayed for the people. Also the potluck.", name: "Marisol", role: "Member since the first cook-off" },
    { quote: "My sourdough has a fan club now. I'm mostly fine with being the plus-one.", name: "Theo", role: "Bread person" },
    { quote: "Three cooking nights in and I finally own a rolling pin. Growth.", name: "June", role: "Newest member" },
  ],
  getInvolved: {
    eyebrow: 'Community',
    title: "Pull up a chair",
    lead: "Host a cooking night, offer a kitchen, or just bring your appetite.",
    ctas: [
      { label: 'Get involved', url: '/get-involved/', variant: 'primary' },
      { label: 'Read the handbook', url: '/handbook/', variant: 'outline' },
    ],
  },
};

/** Demo-only switcher bar. Adopters: set to null (or delete the demo bar usage). */
export const DEMO_BAR = {
  current: "foodie",
  repo: 'https://github.com/Mariatta/astro-theme-popular',
  links: [
    { slug: 'aquarium', label: 'Aquarium', icon: 'fa-solid fa-fish' },
    { slug: 'foodie', label: 'Foodie', icon: 'fa-solid fa-utensils' },
    { slug: 'kdrama', label: 'KDrama', icon: 'fa-solid fa-tv' },
    { slug: 'superfan', label: 'Superfan', icon: 'fa-solid fa-star' },
  ],
};
