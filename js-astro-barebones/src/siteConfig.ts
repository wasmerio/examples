import type {
  SiteConfiguration,
  NavigationLinks,
  SocialLinks,
} from "@/types.ts";

export const SITE: SiteConfiguration = {
  title: "Barebones",
  description: "A barebones starter theme. Built with Astro, Tailwind CSS, and Markdown.",
  href: "https://barebones.trevortylerlee.com",
  author: "Trevor Tyler Lee",
  locale: "en-CA",
};

export const NAV_LINKS: NavigationLinks = {
  posts: {
    path: "/posts",
    label: "Posts",
  },
  projects: {
    path: "/projects",
    label: "Projects",
  },
  documentation: {
    path: "/docs",
    label: "Documentation",
  },
};

export const SOCIAL_LINKS: SocialLinks = {
  email: {
    label: "Email",
    href: "mailto:ttl@trevortylerlee.com",
  },
  github: {
    label: "GitHub",
    href: "https://github.com/trevortylerlee",
  },
  twitter: {
    label: "X (formerly Twitter)",
    href: "https://twitter.com/boogerbuttcheek",
  },
};
