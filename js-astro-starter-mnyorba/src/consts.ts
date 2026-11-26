/**
 * Global constants and site configuration.
 *
 * Contains all site-wide settings including metadata, social links,
 * analytics configuration, and localization options.
 *
 * @module src/consts
 */

/**
 * Site metadata for HTML head and SEO
 */
export const metadata = {
  /** Main site title */
  title: "Astro starter theme with Tailwind CSS",
  /** Site description for meta tags and search engines */
  description:
    "Astro starter with Tailwind CSS — fast, accessible, and ready to customize.",
  /** SEO keywords */
  keywords: "Astro, starter, theme, basics, tutorial, example",
  /** Search engine crawling instructions */
  robots: "index, follow",
  /** Site author name */
  author: "Your Name",
  /** Default social sharing image */
  image: "/images/site-image.jpg",
  /** Open Graph content type */
  type: "website" as const, // 'website' | 'article'
};

/**
 * Site deployment and build configuration
 */
export const config = {
  /** Site's deploy URL - must start with https:// or http:// */
  url: "https://mnyorba.github.io/",
  /** Base path for deployment (e.g. "/blog" for GitHub Pages) */
  base: "/astro-starter",
  /** Number of blog posts displayed per page */
  postsPerPage: 3,
};

/**
 * Analytics and tracking configuration
 */
export const analytics = {
  /** Plausible Analytics settings */
  plausible: {
    /** Domain to track */
    domain: "mnyorba.github.io",
    /** Self-hosted Plausible instance URL */
    apiHost: "https://analytics.mnyorba.dev",
  },
  /** Google Tag Manager configuration */
  google: {
    /** GTM container ID */
    id: "GTM-52VX65NP",
  },
};

/**
 * Internationalization and date formatting settings
 */
export const locale = {
  /** Default site locale */
  default: "en-US",
  /** Date formatting configuration */
  date: {
    /** Locale for date formatting */
    locale: "en-US",
    /** Intl.DateTimeFormat options */
    options: {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions,
  },
};
