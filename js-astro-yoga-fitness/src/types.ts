/**
 * Shared types for the theme's configuration and content data.
 * Edit the data itself in `src/config/site.ts` and `src/data/*.ts`.
 */

/** Names of the symbols defined in `src/components/icons/IconSprite.astro`. */
export type IconName =
  | 'logo'
  | 'calendar'
  | 'bag'
  | 'menu'
  | 'close'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'focus'
  | 'lotus'
  | 'clock'
  | 'level'
  | 'pin'
  | 'check'
  | 'plus'
  | 'camera'
  | 'play'
  | 'chat'
  | 'globe'
  | 'mail'
  | 'phone';

export interface ImageData {
  /** Path inside `public/`, e.g. `/images/class-hatha.webp`. */
  src: string;
  /** Describe the image. Use an empty string only for purely decorative images. */
  alt: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

export interface OpeningHours {
  /** Visible label, e.g. "Mon to Fri". */
  label: string;
  /** Visible hours, e.g. "6:00 to 21:00". */
  hours: string;
  /** Machine-readable values for structured data. */
  days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>;
  opens: string;
  closes: string;
}

export interface SiteConfig {
  /** Brand name shown in titles, structured data and copyright. */
  name: string;
  /** Lower-case word mark displayed next to the logo symbol. */
  logoText: string;
  tagline: string;
  description: string;
  /** Short paragraph under the footer logo. */
  footerAbout: string;
  /** BCP 47 language tag for the `<html lang>` attribute. */
  lang: string;
  /** Open Graph locale, e.g. `en_US`. */
  locale: string;
  /**
   * Set to `true` while the site contains placeholder business details.
   * Structured data then omits the address and phone number.
   */
  isDemo: boolean;
  contact: {
    email: string;
    phone: string;
    /** `tel:` friendly version of the phone number. */
    phoneHref: string;
    address: {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    };
  };
  hours: OpeningHours[];
  socials: SocialLink[];
  /** Where "Book" / "Reserve" buttons point when an item has no URL of its own. */
  bookingUrl: string;
  forms: {
    /**
     * Endpoint for the contact form (Formspree, Web3Forms, your own API…).
     * Leave empty to run the form in demo mode (validated, never sent).
     */
    contactAction: string;
    /** Endpoint for the newsletter form. Leave empty for demo mode. */
    newsletterAction: string;
  };
  seo: {
    /** Title used on the home page. Other pages use `Page title | name`. */
    defaultTitle: string;
    titleSeparator: string;
    /** Default social sharing image (path inside `public/`). 1200×630 recommended. */
    ogImage: string;
    ogImageAlt: string;
    /** Optional X/Twitter handle including the @, or an empty string. */
    twitterHandle: string;
    themeColor: string;
  };
  copyright: string;
}

export interface NavigationItem {
  label: string;
  /** Site-relative path (`/blog`) or home-page anchor (`/#classes`). */
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavigationItem[];
}

export interface HeroWord {
  text: string;
  /** Render in the italic serif display style. */
  serif?: boolean;
}

export interface CallToAction {
  label: string;
  href: string;
}

export interface YogaClass {
  title: string;
  description: string;
  image: ImageData;
  /** Short badge on the image, e.g. "All levels". */
  level: string;
  duration: string;
  intensity: string;
  href?: string;
}

export interface ScheduleItem {
  time: string;
  period: 'am' | 'pm';
  className: string;
  instructor: string;
  duration: string;
  level?: string;
  bookingUrl?: string;
}

export interface ScheduleDay {
  /** Short label for the day button, e.g. "Mon". */
  short: string;
  /** Full name used for screen readers and the no-JS fallback. */
  name: string;
  classes: ScheduleItem[];
}

export interface Coach {
  name: string;
  role: string;
  bio?: string;
  image: ImageData;
  socials: SocialLink[];
}

export interface FocusArea {
  title: string;
  description: string;
  /** Short name used for the image hotspot, e.g. "Neck". */
  spot: string;
  /** Hotspot position over the image, as CSS percentages. */
  x: string;
  y: string;
}

export interface VisitStep {
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  featured?: boolean;
  badge?: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: ImageData;
}

export interface GalleryImage extends ImageData {
  caption?: string;
  href?: string;
}

export interface Retreat {
  title: string;
  description: string;
  /** ISO date, e.g. `2026-11-14`. */
  date: string;
  location: string;
  image: ImageData;
  price: string;
  ctaLabel: string;
  bookingUrl: string;
}

export interface FAQ {
  question: string;
  answer: string;
}
