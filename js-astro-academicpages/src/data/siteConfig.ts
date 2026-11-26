import type { ThemeConfig } from './themes';

/**
 * Site & Author Configuration
 *
 * This file centralizes all site metadata, author profiles, and external link definitions.
 * All social and academic platform fields support either a username/handle or a full URL.
 */

export interface AuthorConfig {
  /** Display name shown in the sidebar header */
  name: string;
  /** Avatar image path located in /public (e.g. '/images/profile.png') */
  avatar: string;
  /** Optional pronouns (e.g. 'they/them' or 'she/her') */
  pronouns?: string;
  /** Short biography or research focus */
  bio?: string;
  /** Physical location, city, or institution */
  location?: string;
  /** Primary university, institute, or employer */
  employer?: string;
  /** Personal, lab, or institution website URL */
  website?: string;
  /** Contact email address */
  email?: string;

  // ---------------------------------------------------------------------------
  // Academic & Scholarly Platforms
  // ---------------------------------------------------------------------------
  /** Academia.edu username or full URL */
  academia?: string;
  /** arXiv author identifier or full URL */
  arxiv?: string;
  /** DBLP author PID or profile URL (e.g. '123/4567') */
  dblp?: string;
  /** Google Scholar user ID or full profile URL */
  googlescholar?: string;
  /** Hugging Face username or full URL */
  huggingface?: string;
  /** INSPIRE-HEP author ID or URL */
  inspire_hep?: string;
  /** Impactstory profile ID */
  impactstory?: string;
  /** IEEE Xplore author ID or profile URL */
  ieee?: string;
  /** ACM Digital Library profile URL or author ID */
  acm?: string;
  /** OpenReview profile handle or URL */
  openreview?: string;
  /** ORCID identifier or full URL (e.g. '0000-0000-0000-0000') */
  orcid?: string;
  /** Open Science Framework (OSF) profile URL */
  osf?: string;
  /** PhilPapers profile handle or URL */
  philpapers?: string;
  /** PubMed author search query or profile URL */
  pubmed?: string;
  /** ResearchGate profile handle or URL */
  researchgate?: string;
  /** Scopus author ID or profile URL */
  scopus?: string;
  /** Semantic Scholar author ID or profile URL */
  semantic?: string;
  /** SSRN author ID or URL */
  ssrn?: string;
  /** Zotero username or profile URL */
  zotero?: string;

  // ---------------------------------------------------------------------------
  // Code, Data & Developer Platforms
  // ---------------------------------------------------------------------------
  /** Bitbucket username or URL */
  bitbucket?: string;
  /** CodePen username or URL */
  codepen?: string;
  /** Dribbble username or URL */
  dribbble?: string;
  /** GitHub username or full URL */
  github?: string;
  /** GitLab username or full URL */
  gitlab?: string;
  /** Kaggle username or full URL */
  kaggle?: string;
  /** Stack Overflow user ID or full profile URL */
  stackoverflow?: string;

  // ---------------------------------------------------------------------------
  // Social Media & Publishing Networks
  // ---------------------------------------------------------------------------
  /** ArtStation username or URL */
  artstation?: string;
  /** Bluesky handle or URL (e.g. 'user.bsky.social') */
  bluesky?: string;
  /** Discord server invite or profile handle */
  discord?: string;
  /** Facebook username or URL */
  facebook?: string;
  /** Flickr username or URL */
  flickr?: string;
  /** Foursquare username or URL */
  foursquare?: string;
  /** Goodreads author/user profile URL or ID */
  goodreads?: string;
  /** Keybase username or URL */
  keybase?: string;
  /** Instagram username or URL */
  instagram?: string;
  /** Last.fm username or URL */
  lastfm?: string;
  /** LinkedIn username or full profile URL */
  linkedin?: string;
  /** Mastodon full instance URL (e.g. 'https://mastodon.social/@user') */
  mastodon?: string;
  /** Medium username or publication URL */
  medium?: string;
  /** Pinterest username or URL */
  pinterest?: string;
  /** SoundCloud username or URL */
  soundcloud?: string;
  /** Steam profile ID or custom URL */
  steam?: string;
  /** Substack publication handle or URL */
  substack?: string;
  /** Telegram channel or username */
  telegram?: string;
  /** Threads username or URL */
  threads?: string;
  /** Tumblr username or URL */
  tumblr?: string;
  /** X handle or URL (e.g. 'handle' or 'https://x.com/handle') */
  x?: string;
  /** Sina Weibo username or URL */
  weibo?: string;
  /** Wikipedia user or author page URL */
  wikipedia?: string;
  /** XING username or URL */
  xing?: string;
  /** YouTube channel ID, handle, or URL */
  youtube?: string;
  /** Zhihu username or URL */
  zhihu?: string;
}

export interface SiteConfig {
  /** Site language/locale code (e.g. 'en-US', 'en', 'fr-FR') */
  locale: string;
  /** Global HTML page title & SEO brand */
  title: string;
  /** Separator between page title and site name in browser tabs */
  titleSeparator: string;
  /** Short website description for OpenGraph meta tags */
  description: string;
  /**
   * Canonical production deployment URL
   * Subpath deployment is supported automatically if a path is included (e.g. 'https://user.github.io/my-repo')
   */
  url: string;
  /** Light and dark color theme presets or custom palettes */
  theme?: ThemeConfig;
  /** Left sidebar author profile details */
  author: AuthorConfig;
  /** Enable or disable breadcrumb navigation trails */
  breadcrumbs: boolean;
  /** Classification mapping for publication filter tabs */
  publicationCategories: Record<string, { title: string }>;
}

export const siteConfig: SiteConfig = {
  locale: 'en-US',
  title: 'Your Name / Site Title',
  titleSeparator: '-',
  description: "Your Name's Academic Portfolio",
  url: 'https://username.github.io',
  theme: {
    // Light: 'default' | 'github-light' | 'one-light' | 'catppuccin-latte' | 'alucard' | 'tokyo-night-day' | 'solarized-light' | 'nord-light' | 'gruvbox-light' | 'monokai-light' | 'rose-pine-dawn' | 'light-owl' | 'ayu-light' | 'kanagawa-lotus' | 'everforest-light' | 'flexoki-light'
    light: 'default',
    // Dark: 'default' | 'github-dark' | 'one-dark' | 'catppuccin-mocha' | 'dracula' | 'tokyo-night' | 'solarized-dark' | 'nord' | 'gruvbox-dark' | 'monokai' | 'rose-pine' | 'night-owl' | 'ayu-dark' | 'kanagawa-wave' | 'everforest-dark' | 'flexoki-dark'
    dark: 'default',
    // Set to false or remove on personal sites to disable the live masthead theme picker
    picker: true,
  },
  breadcrumbs: true,
  author: {
    avatar: '/images/profile.png',
    name: 'Your Name',
    bio: 'Role / Title · Department · Research Focus',
    location: 'City, State / Country',
    employer: 'Your University or Organization',
    website: 'https://example.org',
    email: 'none@example.org',

    // Academic & Scholarly Profiles (accepts username/ID or full URL)
    googlescholar: 'https://scholar.google.com/citations?user=your_scholar_id',
    orcid: '0000-0000-0000-0000',

    // Code & Professional Profiles
    github: 'your-github-username',
    linkedin: 'your-linkedin-username',
    x: 'your-x-handle',
  },
  publicationCategories: {
    books: { title: 'Books' },
    journals: { title: 'Journal Articles' },
    conferences: { title: 'Conference Papers' },
  },
};
