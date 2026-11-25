/**
 * Navigation Configuration
 *
 * Defines navigation menus for the site. Astro handles routing via the
 * filesystem — this only controls which links appear in nav menus.
 *
 * - `navItems`       → main (header) navigation
 * - `footerNavItems` → footer navigation, configured independently from
 *                      the header so you can show different links in the
 *                      footer (e.g. add a Privacy link, drop About, etc.)
 * - `legalLinks`     → small legal-style links (Privacy, Terms, Imprint…)
 *                      shown in the footer's bottom row when supported
 *                      by the active footer layout.
 *
 * ## i18n
 *
 * You write each link once. When i18n is enabled, the Header and Footer
 * localize it automatically for the active locale:
 *
 * - **href** is locale-prefixed via `localizedPath` — `/blog` stays `/blog`
 *   on the default locale and becomes `/<locale>/blog` elsewhere — so nav
 *   keeps the visitor inside their locale. External, `mailto:`/`tel:`, and
 *   `#anchor` hrefs are left untouched.
 * - **label** is translated when you give the item a `labelKey` pointing at
 *   a string in `src/i18n/<locale>.json` (resolved with `t()`); without one,
 *   the literal `label` is used as-is.
 *
 * For the rare case where a locale needs a structurally different label or
 * path (e.g. a localized slug like `/over-ons`), add a `locales` override —
 * see `NavItemOverride`. With i18n off, none of this runs and the output is
 * identical to a single-locale site.
 */
import { localizedPath, t, defaultLocale, type Locale } from '@/i18n';

/** Per-locale override for a nav item or legal link's label and/or path. */
export interface NavItemOverride {
  /** Replaces the resolved label for this locale. */
  label?: string;
  /** Replaces the canonical path for this locale (still locale-prefixed). */
  href?: string;
}

export interface NavItem {
  label: string;
  href: string;
  order: number;
  external?: boolean;
  /** i18n dictionary key for the label (e.g. `'nav.items.blog'`). Falls back to `label`. */
  labelKey?: string;
  /** Per-locale label/path overrides, keyed by locale code. */
  locales?: Record<string, NavItemOverride>;
}

/**
 * A footer column declared in config. `titleKey` is looked up in the locale
 * files when present, so a translated site gets a translated heading;
 * `title` is the fallback for a column that has no key.
 */
export interface FooterLinkGroupConfig {
  titleKey?: string;
  title: string;
  /**
   * `LegalLink` rather than `NavItem`: the two carry the same fields except
   * `order`, which a group has no use for — the array is the order.
   */
  links: LegalLink[];
}

export interface LegalLink {
  label: string;
  href: string;
  external?: boolean;
  /** i18n dictionary key for the label. Falls back to `label`. */
  labelKey?: string;
  /** Per-locale label/path overrides, keyed by locale code. */
  locales?: Record<string, NavItemOverride>;
}

/** A nav item resolved for one locale: label translated, href locale-prefixed. */
export interface ResolvedNavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', order: 0, labelKey: 'nav.items.home' },
  { label: 'Services', href: '/services', order: 1, labelKey: 'nav.items.services' },
  { label: 'Projects', href: '/projects', order: 2, labelKey: 'nav.items.projects' },
  { label: 'Blog', href: '/blog', order: 3, labelKey: 'nav.items.blog' },
  { label: 'About', href: '/about', order: 4, labelKey: 'nav.items.about' },
  { label: 'Contact', href: '/contact', order: 5, labelKey: 'nav.items.contact' },
];

export const footerNavItems: NavItem[] = [
  { label: 'Home', href: '/', order: 0, labelKey: 'nav.items.home' },
  { label: 'Services', href: '/services', order: 1, labelKey: 'nav.items.services' },
  { label: 'Projects', href: '/projects', order: 2, labelKey: 'nav.items.projects' },
  { label: 'Blog', href: '/blog', order: 3, labelKey: 'nav.items.blog' },
  { label: 'About', href: '/about', order: 4, labelKey: 'nav.items.about' },
  { label: 'Contact', href: '/contact', order: 5, labelKey: 'nav.items.contact' },
  { label: 'GitHub', href: 'https://github.com/hansmartensdev/Astro-Rocket', order: 6, external: true },
];

export const legalLinks: LegalLink[] = [];

/**
 * Extra columns for the footer's `columns` layout.
 *
 * Leave this empty and the footer builds its own from the site: a Site column
 * from `footerNavItems`, a Topics column from the most-used blog tags, and a
 * Projects column from the visible projects. Each is dropped when it has
 * nothing in it, so a new site shows one column and fills out as it grows.
 *
 * Anything here is *added* to those, which is what this is for: a column the
 * site has that cannot be derived — a support column, an offices column, a
 * second product. To replace the derived set entirely rather than add to it,
 * pass `linkGroups` to `<Footer>` directly.
 *
 * Every link is real on the demo. A footer that pads itself out with links to
 * somewhere else is worse than a short one, and worse still on a theme people
 * fork: they inherit whatever is here.
 */
export const footerLinkGroups: FooterLinkGroupConfig[] = [
  {
    titleKey: 'footer.groups.questions',
    title: 'Got questions?',
    links: [
      { label: 'FAQ', href: '/about#faq' },
      { label: 'Email', href: 'mailto:hello@hansmartens.dev' },
      { label: 'GitHub', href: 'https://github.com/hansmartensdev/Astro-Rocket', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hansmartensdev', external: true },
      { label: 'Bluesky', href: 'https://bsky.app/profile/hansmartensdev.bsky.social', external: true },
    ],
  },
];

/**
 * Hrefs that must never be locale-prefixed: absolute/protocol-relative URLs,
 * `mailto:`/`tel:` links, and in-page `#anchor`s.
 */
function isExternalOrAnchorHref(href: string): boolean {
  return (
    /^(https?:)?\/\//.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  );
}

/**
 * Resolve a single item for a locale: apply any per-locale override, translate
 * the label (when a `labelKey` is set), and locale-prefix the path (unless it's
 * external or an anchor). On the default locale with i18n off, this returns the
 * item's literal label and unmodified href. Exported for reuse in custom nav
 * components (and unit tests).
 */
export function resolveNavItem(item: NavItem | LegalLink, locale: Locale): ResolvedNavItem {
  const override = item.locales?.[locale];
  const label = override?.label ?? (item.labelKey ? t(item.labelKey, locale) : item.label);
  const rawHref = override?.href ?? item.href;
  const href =
    item.external || isExternalOrAnchorHref(rawHref) ? rawHref : localizedPath(rawHref, locale);
  return { label, href, external: item.external };
}

/**
 * Get header navigation items sorted by order, localized for `locale`.
 */
export function getNavItems(locale: Locale = defaultLocale): ResolvedNavItem[] {
  return [...navItems]
    .sort((a, b) => a.order - b.order)
    .map((item) => resolveNavItem(item, locale));
}

/**
 * Get footer navigation items sorted by order, localized for `locale`.
 * Configured independently from the header — edit `footerNavItems`
 * above to add/remove links in the footer only.
 */
export function getFooterNavItems(locale: Locale = defaultLocale): ResolvedNavItem[] {
  return [...footerNavItems]
    .sort((a, b) => a.order - b.order)
    .map((item) => resolveNavItem(item, locale));
}

/**
 * Get configured legal links (Privacy, Terms, etc.), localized for `locale`.
 * Returned in declaration order.
 */
export function getLegalLinks(locale: Locale = defaultLocale): ResolvedNavItem[] {
  return legalLinks.map((item) => resolveNavItem(item, locale));
}

/**
 * The site logo's link target for `locale` — the locale's home page
 * (`/` on the default locale, `/<locale>` elsewhere).
 */
export function getLogoHref(locale: Locale = defaultLocale): string {
  return localizedPath('/', locale);
}
