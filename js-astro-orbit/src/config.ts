/**
 * Single source of truth for everything site-specific.
 * Edit this file first — the whole site follows.
 */

export const SITE = {
  name: "Your Name",
  initials: "YN",
  role: "Platform engineer",
  headline: "Platform & Infrastructure Engineer",
  description: "Short sentence used for meta descriptions and search results.",
  tagline: "One line that says what you build and who it is for.",
  location: "Your City",
  discipline: "Platform engineering",
  locale: "en",
  /** Origin only. The subpath belongs in `base`. Change to your own. */
  url: "https://jagarkarlo.github.io",
  /** Set to "/" when deploying to a domain root. */
  base: "/astro-orbit",
  defaultTheme: "dark",
  themeColor: { dark: "#090d10", light: "#edf0ec" },
  socialImage: "/images/social-card.png",
  portrait: "/images/portrait.svg",
  /** Path to a CV file in public/. Leave empty to hide the download link. */
  cv: "",
  knowsAbout: ["Platform engineering", "Kubernetes", "Observability", "Developer tooling"],
} as const;

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Work", href: "/work/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

export type Social = { label: string; href: string; icon: string };

/** The first entry is shown in the site header. */
export const SOCIALS: Social[] = [
  { label: "GitHub", href: "https://github.com/your-username", icon: "simple-icons:github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle/", icon: "simple-icons:linkedin" },
];

/** Prefixes a root-relative path with the configured deployment base. */
export const withBase = (path: string): string => {
  const prefix = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
};
