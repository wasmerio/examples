// Site Configuration
// Centralize all settings here, do not hardcode in components.

export const siteConfig = {
  // Site title — displayed in nav, footer, and page titles
  title: 'CapsuleX',

  // Site description — used in meta tags and hero section
  description: 'A minimal blog theme with capsule design',

  // Author name — used in footer and meta author tag
  author: 'wangjacks',

  // Site URL — set before deployment (e.g., https://example.com)
  // Used for RSS feed and SEO
  site: 'https://capsule-x-brown.vercel.app',

  // HTML lang attribute — affects SEO and accessibility
  lang: 'en',

  // Navigation links — displayed in capsule nav bar
  nav: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Tags', href: '/tags' },
  ],

  // Social links — leave empty to hide
  social: {
    github: 'https://github.com/wangjacks/capsule-x',
  },

  // Feature toggles
  features: {
    readingProgress: true,  // Show reading progress bar on post pages
    backToTop: true,        // Show back to top button
    callout: true,          // Show callout components in blog posts
    lightbox: true,         // Enable image lightbox on click
    rss: true,              // Enable RSS feed
    search: true,           // Enable client-side search (Fuse.js)
  },
};

export type SiteConfig = typeof siteConfig;
