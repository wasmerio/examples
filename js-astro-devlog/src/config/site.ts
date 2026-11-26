/**
 * ==============================================================================
 * 🌟 DEV.LOG — SINGLE SOURCE OF TRUTH CONFIGURATION
 * ==============================================================================
 * Welcome to your personal dev blog template!
 *
 * Customize the ENTIRE site by simply editing this single file:
 *  1. Site Brand, Title & Favicon (Name, SEO Title, Description, Favicon, OG Image)
 *  2. Author Profile (Your Name, Role, Bio, Avatar, Socials)
 *  3. Hero Section (Greeting, Tagline, Buttons)
 *  4. Navigation Menu & Categories
 *  5. Footer Details
 * ==============================================================================
 */

export interface SiteAuthor {
  /** Your full name (e.g., "Alex Morgan") */
  name: string;
  /** Your job title or tagline (e.g., "Software Engineer & Creative Developer") */
  role: string;
  /** Path to your avatar photo in public/ (e.g., "/images/avatar.jpg") */
  avatar: string;
  /** Short personal bio displayed on the home page, about page, and article footers */
  bio: string;
  /** Your current city / location (e.g., "San Francisco, CA") */
  location?: string;
  /** Short status pill shown on your profile card */
  status?: string;
  /** Your social and contact links */
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface NavLink {
  text: string;
  href: string;
}

export interface CategoryInfo {
  name: string;
  desc: string;
}

export interface SiteConfig {
  /** Short brand name shown in the top header (e.g., "DEV.LOG" or "ALEX.DEV") */
  name: string;
  /** Custom 1-letter badge in header (e.g., "D", "A", or "⚡") */
  logoLetter?: string;
  /** Full default SEO page title shown in browser tabs */
  title: string;
  /** Default meta description for search engines and social cards */
  description: string;
  /** Production domain URL of your blog (e.g., "https://myblog.com") */
  url: string;
  /** Path to favicon in public/ (e.g., "/favicon.svg", "/favicon.ico", or "/favicon.png") */
  favicon: string;
  /** Default OpenGraph preview image */
  defaultOgImage?: string;

  /** Single Author Profile */
  author: SiteAuthor;

  /** Home Page Hero Section */
  hero: {
    greeting: string;
    badge: string;
    tagline: string;
    primaryButton: { text: string; href: string };
    secondaryButton: { text: string; href: string };
  };

  /** Header Navigation Links */
  navLinks: NavLink[];

  /** Topic Categories */
  categories: CategoryInfo[];

  /** About Me Page Details */
  about?: {
    philosophyTitle?: string;
    philosophyParagraphs?: string[];
    quote?: string;
    highlights?: Array<{
      icon: string;
      title: string;
      desc: string;
    }>;
    techArsenal?: Array<{
      name: string;
      desc: string;
      category: string;
    }>;
  };

  /** Footer Newsletter & Subscription Details */
  newsletter?: {
    badge?: string;
    title?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    successMessage?: string;
  };

  /** 404 Page Not Found Configuration */
  notFound?: {
    badge?: string;
    title?: string;
    description?: string;
    homeButtonText?: string;
    browseButtonText?: string;
  };

  /** Search Modal Configuration */
  search?: {
    modalTitle?: string;
    placeholder?: string;
  };

  /** UI Section Headings & Badges */
  ui?: {
    latestPostsBadge?: string;
    latestPostsTitle?: string;
    categoriesTitle?: string;
    tagsTitle?: string;
    shareTitle?: string;
    shareDescription?: string;
    shareCopiedMessage?: string;
    tocTitle?: string;
    authorCardTitle?: string;
    writtenByText?: string;
  };

  /** Footer Details */
  footer: {
    tagline: string;
    copyright: string;
    brandDescription?: string;
  };
}

export const siteConfig: SiteConfig = {
  // ----------------------------------------------------------------------------
  // 1. SITE BRANDING, TITLE & FAVICON
  // ----------------------------------------------------------------------------
  name: "DEV.LOG",
  logoLetter: "D",
  title: "DEV.LOG — Personal Dev Blog & Digital Garden",
  description:
    "A high-performance personal developer blog and digital notebook crafted with Astro, strict TypeScript, and Liquid Glass UI.",
  url: "https://devlog.example.com",
  favicon: "/favicon.svg", // Place your favicon in public/favicon.svg or public/favicon.ico
  defaultOgImage: "/images/og-default.png",

  // ----------------------------------------------------------------------------
  // 2. AUTHOR PROFILE (SINGLE AUTHOR FOR ENTIRE SITE)
  // ----------------------------------------------------------------------------
  author: {
    name: "Alex Morgan",
    role: "Software Engineer & Creative Developer",
    avatar: "/images/avatar.jpg", // Place your photo in public/images/avatar.jpg
    bio: "Frontend engineer and creative developer fascinated by the craft of building blazingly fast web apps, liquid glass design systems, and resilient software architectures.",
    location: "San Francisco, CA",
    status: "Building the future of spatial web interfaces",
    social: {
      github: "https://github.com/nivinvysakh/devlog-astro-template",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      email: "alex@example.com",
    },
  },

  // ----------------------------------------------------------------------------
  // 3. HOME HERO SECTION
  // ----------------------------------------------------------------------------
  hero: {
    greeting: "Hey, I'm Alex",
    badge: "Software Engineer • Creative Developer",
    tagline:
      "Welcome to my personal dev blog and digital notebook. I write about building fast web apps with Astro, mastering strict TypeScript, and crafting tactile Liquid Glass UI.",
    primaryButton: {
      text: "Read My Articles",
      href: "/blog",
    },
    secondaryButton: {
      text: "About Me",
      href: "/about",
    },
  },

  // ----------------------------------------------------------------------------
  // 4. HEADER NAVIGATION LINKS
  // ----------------------------------------------------------------------------
  navLinks: [
    { text: "Articles", href: "/blog" },
    { text: "Categories", href: "/categories" },
    { text: "Tags", href: "/tags" },
    { text: "About Me", href: "/about" },
  ],

  // ----------------------------------------------------------------------------
  // 5. TOPIC CATEGORIES
  // ----------------------------------------------------------------------------
  categories: [
    { name: "Tech", desc: "Astro Islands architecture, core web performance, and TypeScript engineering." },
    { name: "Design", desc: "Liquid Glass UI, spatial design systems, fluid motion, and modern aesthetics." },
    { name: "Architecture", desc: "Domain-Driven Design, clean decoupled systems, and software durability." },
    { name: "Story", desc: "Engineering insights, case studies, and modern frontend storytelling." },
  ],

  // ----------------------------------------------------------------------------
  // 6. ABOUT ME PAGE (PHILOSOPHY, FOCUS PILLARS, TECH ARSENAL)
  // ----------------------------------------------------------------------------
  about: {
    philosophyTitle: "My Engineering Philosophy",
    philosophyParagraphs: [
      "I started this blog as my personal digital garden—a place to document experiments, architectural patterns, and lessons learned while crafting modern web applications.",
      "I believe that a modern website should feel instantaneous, tactile, and visually delightful. In an era where web apps often ship megabytes of unnecessary JavaScript runtimes, I advocate for content-first static delivery with selective island hydration.",
    ],
    quote: "Every byte of JavaScript saved and every millisecond shaved off TTFB makes the web a faster, more accessible, and more joyful space for everyone.",
    highlights: [
      {
        icon: "⚡",
        title: "Speed & Zero-JS",
        desc: "Shipping ultra-lightweight static HTML first, hydrating only when client interactivity is strictly required.",
      },
      {
        icon: "✨",
        title: "Liquid Glass Design",
        desc: "Crafting translucent, refractive spatial UI with specular highlights and GPU-accelerated blur effects.",
      },
      {
        icon: "🛡️",
        title: "Type Safety & Domain Invariants",
        desc: "Eliminating entire categories of runtime bugs using compiler-enforced discriminated unions and pure functions.",
      },
      {
        icon: "🚀",
        title: "60fps Micro-Interactions",
        desc: "Building responsive spring physics, compositor animations, and tactile interactive feedback.",
      },
    ],
    techArsenal: [
      { name: "Astro 7", desc: "Islands architecture, server islands, and zero-JS defaults", category: "Framework" },
      { name: "TypeScript", desc: "Strict domain models, algebraic types, and nominal branding", category: "Language" },
      { name: "Tailwind CSS 4", desc: "Liquid Glass design system, modern gradients & CSS tokens", category: "Styling" },
      { name: "Vite & Pagefind", desc: "Instant hot-reloading and lightning-fast static indexing", category: "Tooling" },
      { name: "React / Preact", desc: "Isolated reactive client components when state is required", category: "UI Library" },
      { name: "Edge Runtimes", desc: "Distributed low-latency deployment at the CDN edge", category: "Infra" },
    ],
  },

  // ----------------------------------------------------------------------------
  // 7. FOOTER NEWSLETTER & SUBSCRIPTION
  // ----------------------------------------------------------------------------
  newsletter: {
    badge: "Personal Dev Notes",
    title: "Follow My Engineering Journey & Experiments",
    description:
      "Occasional writeups on frontend architecture, liquid glass UI craft, Astro experiments, and lessons learned building software.",
    placeholder: "you@domain.com",
    buttonText: "Get Updates",
    successMessage: "Thanks for subscribing to my dev notes!",
  },

  // ----------------------------------------------------------------------------
  // 8. 404 NOT FOUND PAGE
  // ----------------------------------------------------------------------------
  notFound: {
    badge: "HTTP_STATUS // 404_NOT_FOUND",
    title: "Page Lost in the Stream",
    description:
      "The route, article, or resource you were looking for doesn't exist, has been moved, or is currently being rewritten.",
    homeButtonText: "Return Home",
    browseButtonText: "Browse Articles",
  },

  // ----------------------------------------------------------------------------
  // 9. SEARCH MODAL CONFIGURATION
  // ----------------------------------------------------------------------------
  search: {
    modalTitle: "Search Publications",
    placeholder: "Type keywords (e.g. Astro, TypeScript, Islands, CSS)...",
  },

  // ----------------------------------------------------------------------------
  // 10. REUSABLE UI LABELS & SECTION TITLES
  // ----------------------------------------------------------------------------
  ui: {
    latestPostsBadge: "Recent Writing",
    latestPostsTitle: "Latest Notes & Deep Dives",
    categoriesTitle: "Browse by Topic",
    tagsTitle: "Popular Tags",
    shareTitle: "Share This Post",
    shareDescription: "Found this post helpful? Share it with your developer friends.",
    shareCopiedMessage: "Post link copied to clipboard!",
    tocTitle: "Table of Contents",
    authorCardTitle: "About the Author",
    writtenByText: "Written by",
  },

  // ----------------------------------------------------------------------------
  // 11. FOOTER DETAILS
  // ----------------------------------------------------------------------------
  footer: {
    tagline: "Crafted with Astro 7, TypeScript, and Liquid Glass aesthetics.",
    copyright: "Alex Morgan",
    brandDescription:
      "Personal blog & digital notebook template. Writing about high-performance web development, TypeScript architecture, and creative UI engineering.",
  },
};

export default siteConfig;
