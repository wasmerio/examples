import type { IconName } from './components/icons/icons';

export interface Link {
  label: string;
  href: string;
}

export interface NavigationItem extends Link {
  /** Treat as current page when the visitor is on this path (or below it). */
  matchPath?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

export interface SiteConfig {
  /** Full site name, used in titles and structured data. */
  name: string;
  /** Logo word mark, split so the middle part can be dimmed like the original design. */
  brand: { prefix: string; accent: string; suffix: string };
  tagline: string;
  description: string;
  /** Language of the site content. */
  lang: string;
  /** Locale for Open Graph, e.g. en_US. */
  locale: string;
  email: string;
  phone: string;
  /** Phone in a dialable format for tel: links. */
  phoneHref: string;
  location: { label: string; lines: string[] };
  responseTime: string;
  /** Short footer blurb under the logo. */
  footerBlurb: string;
  copyright: string;
  social: SocialLink[];
  seo: {
    /** Appended to page titles: "Page — ST AI Agency". */
    titleSeparator: string;
    defaultTitle: string;
    /** Default social sharing image, relative to /public. */
    ogImage: string;
    ogImageAlt: string;
    twitterHandle?: string;
    themeColor: string;
  };
  cta: { label: string; shortLabel: string; href: string };
  forms: {
    /**
     * Form endpoint. Leave empty to keep the forms in "demo mode": nothing is sent and
     * visitors see a notice instead. See README › Contact form.
     */
    contactAction: string;
    newsletterAction: string;
    /** Adds the attributes Netlify Forms needs to detect the form at build time. */
    netlify: boolean;
  };
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface Solution {
  number: string;
  title: string;
  description: string;
  /** Small image that appears when the row is hovered (desktop only). */
  image?: string;
  href: string;
  category?: string;
  features?: string[];
}

export interface Feature {
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  timing: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Customer {
  company: string;
  title: string;
  sector: string;
  description: string;
  image: string;
  imageAlt: string;
  metrics: Metric[];
  featured?: boolean;
  url?: string;
}

export interface Stat {
  value: string;
  description: string;
}

export interface Sector {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  workflows?: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  imageAlt?: string;
  link?: Link;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  imageAlt?: string;
  bio?: string;
  social?: SocialLink[];
}

export interface PricingPlan {
  name: string;
  price: string;
  /** e.g. "/ month". Leave empty for "Custom". */
  billing?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: Link;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SectionHeading {
  kicker: string;
  /** May contain <br> for intentional line breaks. */
  title: string;
  lead?: string;
}
