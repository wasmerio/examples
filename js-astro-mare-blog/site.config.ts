export interface NavItem {
  /** Navigation item display label */
  name: string;
  /** Navigation target path or URL */
  href: string;
  /** Icon identifier */
  icon?: string;
}

export interface AuthorLink {
  /** Link display label */
  name: string;
  /** Link target URL */
  href: string;
  /** Icon identifier */
  icon?: string;
}

export interface SiteConfig {
  /** Site language */
  lang: string;
  /** Site title */
  title: string;
  /** Site description */
  description: string;
  /** Author name */
  author: string;
  /** Author URL */
  authorUrl: string;
  /** Author biography */
  authorBio: string;
  /** Detailed author introduction displayed on the About page */
  authorDetails: string;
  /** Author location */
  authorLocation: string;
  /** GitHub username used for the contribution graph */
  githubUsername: string;
  /** Author avatar image URL */
  avatar: string;
  /** Optional array of author links */
  authorLinks?: AuthorLink[];
  /** Base URL of the site */
  url: string;
  /** Number of posts to show on each blog archive page */
  postsPerPage: number;
  /** Header navigation items */
  nav: NavItem[];
  /** Giscus comment system configuration */
  giscus: {
    /** Enable or disable Giscus comments */
    enabled: boolean;
    /** Target GitHub repository in 'owner/repo' format */
    repo: string;
    /** Repository GraphQL Node ID */
    repoId: string;
    /** Discussion category name */
    category: string;
    /** Discussion category GraphQL Node ID */
    categoryId: string;
    /** Theme for light mode */
    theme: string;
    /** Theme for dark mode */
    darkTheme: string;
    /** UI language */
    lang: string;
  };
}

export function defineConfig(config: SiteConfig): SiteConfig {
  return config;
}

export default defineConfig({
  lang: "en",
  title: "Mare Blog",
  description: "A minimal, lightning-fast personal blog built with Astro.",
  author: "Niceeepoiu",
  authorUrl: "https://www.github.com/Niceeepoiu",
  authorBio: "A passionate developer.",
  authorDetails:
    "A student with basic full-stack development skills who enjoys playing Minecraft.",
  authorLocation: "Zhejiang, China",
  githubUsername: "Niceeepoiu",
  avatar: "/avatar.webp",
  authorLinks: [
    {
      name: "GitHub",
      href: "https://www.github.com/Niceeepoiu",
      icon: "lucide:github",
    },
    {
      name: "Email",
      href: "mailto:abefgpoiu@outlook.com",
      icon: "lucide:mail",
    },
  ],
  url: "https://mare-blog.pages.dev",
  postsPerPage: 6,
  nav: [
    { name: "Home", href: "/", icon: "lucide:home" },
    { name: "Blog", href: "/blog", icon: "lucide:book-open" },
    { name: "Journal", href: "/journal", icon: "lucide:calendar-days" },
    { name: "Friends", href: "/friends", icon: "lucide:users" },
    { name: "About", href: "/about", icon: "lucide:user" },
  ],
  giscus: {
    enabled: true,
    repo: "Niceeepoiu/mare-blog",
    repoId: "R_kgDOUH3Ucg",
    category: "Announcements",
    categoryId: "DIC_kwDOUH3Ucs4DEfws",
    theme: "light",
    darkTheme: "dark",
    lang: "en",
  },
});
