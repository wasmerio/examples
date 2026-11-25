export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink extends NavLink {
  /** A file name from `src/icons/bootstrap`, used as `social-<name>`. */
  icon: string;
}

export const siteConfig = {
  name: "Quiet Pages",
  title: "Quiet Pages - An independent magazine on writing, design, and the slow web",
  description:
    "An independent magazine on writing, design, and the slow web. Essays, field notes, and conversations, published occasionally and read closely.",
  siteUrl: "https://quietpages.xocoweb.workers.dev",
  language: "en",
  locale: "en_US",
  dateLocale: "en-US",
  socialImage: "/og-image.png",

  /** Used to estimate read time when a post has no `readingTime`. */
  wordsPerMinute: 220,

  email: "hello@example.com",

  /**
   * POST endpoints for the forms. Leave a value empty and that form runs in demo mode:
   * it validates and confirms, but sends nothing.
   */
  forms: {
    newsletter: "",
    contact: "",
  },

  socials: [
    { label: "X", href: "https://x.com/", icon: "twitter-x" },
    { label: "Bluesky", href: "https://bsky.app/", icon: "bluesky" },
    { label: "GitHub", href: "https://github.com/xocothemes/quietpages", icon: "github" },
  ] satisfies SocialLink[],
};

export const navigation: NavLink[] = [
  { label: "Writing", href: "/blog/" },
  { label: "Sections", href: "/categories/" },
  { label: "Contributors", href: "/authors/" },
  { label: "About", href: "/about/" },
];

export const footerLinks: NavLink[] = [
  { label: "Archive", href: "/blog/" },
  { label: "Contributors", href: "/authors/" },
  { label: "Tags", href: "/tags/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
  { label: "RSS feed", href: "/rss.xml" },
];
