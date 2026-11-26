/**
 * ============================================================
 * Ridgeline — site configuration (single source of truth)
 * ============================================================
 * This file is the ONE place to change your company information.
 * Every page, the header, the footer, the contact page, and the
 * structured data (JSON-LD) read from here.
 *
 * See docs/customization.md for a field-by-field walkthrough.
 */

export type FormProvider = 'formspree' | 'netlify';
export type ThemeName = 'slate-orange' | 'blue-amber';

export interface TrustBadge {
  /** Icon name from src/components/common/Icon.astro */
  icon: string;
  /** Short label, e.g. "Licensed & Insured" */
  label: string;
}

export const siteConfig = {
  /* ----------------------------------------------------------
   * Company identity
   * -------------------------------------------------------- */
  name: 'Ridgeline Roofing Co.',
  /** Short name used in the logo lock-up. */
  logoText: 'Ridgeline',
  logoSuffix: 'Roofing Co.',
  tagline: "Denver's Trusted Roofing Experts Since 2009",
  /** Contractor license line shown in the top bar and footer. */
  licenseLine: 'CO License #RC-104728',

  /* ----------------------------------------------------------
   * Contact (NAP — keep identical everywhere for local SEO)
   * -------------------------------------------------------- */
  phone: '(303) 555-0147',
  /** tel: link version of the phone number (digits only). */
  phoneHref: 'tel:+13035550147',
  email: 'info@ridgelineroofing.com',
  address: {
    street: '4280 Summit Ridge Way',
    city: 'Denver',
    state: 'CO',
    zip: '80221',
  },
  /** Coordinates used in the RoofingContractor JSON-LD. */
  geo: {
    latitude: 39.7392,
    longitude: -104.9903,
  },

  /* ----------------------------------------------------------
   * Hours
   * -------------------------------------------------------- */
  hours: [
    { days: 'Monday – Friday', open: '7:00 AM', close: '6:00 PM' },
    { days: 'Saturday', open: '8:00 AM', close: '4:00 PM' },
    { days: 'Sunday', open: 'Closed', close: '' },
  ],
  /** Schema.org openingHoursSpecification (24h clock). */
  openingHoursSchema: ['Mo-Fr 07:00-18:00', 'Sa 08:00-16:00'],
  emergencyNote: '24/7 emergency storm response available.',

  /* ----------------------------------------------------------
   * Social profiles (used in footer + JSON-LD sameAs)
   * -------------------------------------------------------- */
  social: {
    facebook: 'https://www.facebook.com/ridgelineroofingco',
    instagram: 'https://www.instagram.com/ridgelineroofingco',
  },

  /* ----------------------------------------------------------
   * Lead form backend
   * ----------------------------------------------------------
   * formProvider:
   *   'formspree' — the form posts to `formEndpoint`.
   *                 Create a free form at https://formspree.io and
   *                 paste its endpoint below.
   *   'netlify'   — the form is tagged with data-netlify="true" and
   *                 submissions appear in your Netlify dashboard.
   *                 `formEndpoint` is ignored.
   * See docs/customization.md → "Connecting the forms".
   * -------------------------------------------------------- */
  formProvider: 'formspree' as FormProvider,
  formEndpoint: 'https://formspree.io/f/xaqrqpro',

  /* ----------------------------------------------------------
   * Trust badges (header strip, quote page, footer)
   * ----------------------------------------------------------
   * Legal note: manufacturer certifications are rendered as text
   * badges with generic icons. Do NOT ship real manufacturer logos
   * unless your client holds the certification and has the official
   * asset kit.
   * -------------------------------------------------------- */
  trustBadges: [
    { icon: 'shield-check', label: 'Licensed & Insured' },
    { icon: 'badge-check', label: 'GAF Certified Installer' },
    { icon: 'award', label: 'Owens Corning Preferred' },
    { icon: 'thumbs-up', label: 'BBB A+ Rating' },
    { icon: 'clipboard-check', label: '10-Year Workmanship Warranty' },
  ] satisfies TrustBadge[],

  /* ----------------------------------------------------------
   * Stats (About page number wall, home page)
   * -------------------------------------------------------- */
  stats: {
    yearFounded: 2009,
    projectsCompleted: 3200,
    warrantyYears: 10,
  },

  /* ----------------------------------------------------------
   * Default SEO
   * -------------------------------------------------------- */
  seo: {
    siteName: 'Ridgeline Roofing Co.',
    defaultTitle: 'Ridgeline Roofing Co. | Denver Roofing Contractor',
    defaultDescription:
      'Ridgeline Roofing Co. is a licensed and insured roofing contractor serving the Denver metro. Roof replacement, storm damage restoration, repairs, and free inspections since 2009.',
    /** Path to the default Open Graph image (in /public). */
    ogImage: '/og-default.jpg',
  },

  /* ----------------------------------------------------------
   * Theme — 'slate-orange' (scheme A) or 'blue-amber' (scheme B)
   * -------------------------------------------------------- */
  theme: 'slate-orange' as ThemeName,
} as const;

export type SiteConfig = typeof siteConfig;
