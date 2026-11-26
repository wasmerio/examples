/**
 * ============================================
 * SITE CONFIGURATION
 * ============================================
 * Edit this file to customize the template for your organization.
 * All site-wide settings (name, address, meta, etc.) live here.
 */

export const siteConfig = {
  /** The main name displayed in the navbar, hero, and footer */
  siteName: "[Unit Name]",

  /** Subtitle shown below the name in the navbar */
  siteSubtitle: "[Unit Subtitle]",

  /** Motto/tagline shown in the hero badge */
  siteMotto: "[Unit Motto]",

  /** Default meta description for SEO */
  siteDescription:
    "An educational website about [Unit Name] — a [describe your organization here].",

  /** Base URL for Open Graph / canonical links */
  siteUrl: "https://your-domain.com",

  /** Path to Open Graph image (relative to /public) */
  ogImage: "/og-image.jpg",

  /** Headquarters / address shown in the footer */
  address: {
    line1: "[Your City, Region]",
    line2: "[Your Country]",
  },

  /** Footer copyright text */
  copyright: "[Unit Name] Project — 2026",

  /** Footer disclaimer text */
  disclaimer:
    "This site was created as a starter template. Replace this text with your own disclaimer.",

  /** Navigation links — adjust labels via i18n translations */
  navLinks: [
    { href: "/", i18nKey: "nav.home", label: "Home" },
    { href: "/sejarah", i18nKey: "nav.history", label: "History" },
    { href: "/struktur", i18nKey: "nav.structure", label: "Structure" },
    { href: "/galeri", i18nKey: "nav.gallery", label: "Gallery" },
  ],
};
