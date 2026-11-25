// Site-wide settings. Edit this file to rebrand the theme — every page,
// the RSS feed, and Open Graph tags read from here.

import type { UIKey } from './i18n/en';

export const SITE = {
  /** BCP 47 language tag. Picks the UI dictionary in `src/i18n/`, and sets
   *  `<html lang>`, date formatting, and the RSS feed language. Dictionaries
   *  ship for `en` and `ja`; regional variants like `en-GB` reuse the base
   *  language's strings while keeping their own date format. */
  locale: 'en',
  /** Site name — used in the header brand, <title>, and og:site_name. */
  title: 'Astro Keel',
  /** Default meta description for pages that don't set their own. */
  description: 'A minimal, neutral, and modern portfolio and blog theme for Astro.',
  /** Description of the RSS feed at /rss.xml. */
  rssDescription: 'Notes, essays, and release logs from Astro Keel.',
  /** Default social share image, relative to the site root (see public/). */
  ogImage: '/og.jpg',
  /** Post author, emitted in JSON-LD BlogPosting structured data.
   *  Leave empty ('') to omit the author field. */
  author: 'Astro Keel',
  /** Footer credit line. */
  footerText: 'Built with Astro Keel.',
} as const;

/** Icons bundled with the theme — see `src/components/SocialLinks.astro`. */
export type SocialIcon = 'github' | 'x' | 'linkedin' | 'rss' | 'email';

export interface SocialLink {
  /** Accessible name announced on the icon-only link. */
  label: string;
  /** Full URL, `mailto:` address, or site-root path (gets `base` applied). */
  href: string;
  icon: SocialIcon;
}

/** Social profiles rendered as inline SVG icons in the footer.
 *  Add or remove entries here — no template edits needed. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/kpab/astro-keel', icon: 'github' },
  { label: 'RSS feed', href: '/rss.xml', icon: 'rss' },
];

/** Giscus — GitHub Discussions-backed comments on blog posts.
 *  See `GISCUS` below; values come from https://giscus.app. */
export interface GiscusConfig {
  /** Master switch. While `false`, no Giscus markup, CSS, or script is emitted. */
  enabled: boolean;
  /** Target repository, `owner/name`. Needs public Discussions and the
   *  giscus GitHub App installed. */
  repo: string;
  /** Repository ID from giscus.app (starts with `R_`). */
  repoId: string;
  /** Discussion category name, e.g. `Announcements`. */
  category: string;
  /** Category ID from giscus.app (starts with `DIC_`). */
  categoryId: string;
  /** How a post maps to its discussion. `pathname` is the safest default —
   *  it survives retitling, unlike `title`. */
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  /** Use a strict title match when looking up the discussion. */
  strict: boolean;
  /** Show the reaction bar above the comment list. */
  reactionsEnabled: boolean;
  /** Put the comment box above (`top`) or below (`bottom`) the thread. */
  inputPosition: 'top' | 'bottom';
  /** Giscus UI language, e.g. `en`, `ja`, `fr`. */
  lang: string;
  /** Giscus theme used while the site is in light mode. */
  lightTheme: string;
  /** Giscus theme used while the site is in dark mode. The widget is told to
   *  switch live when the header toggle flips. */
  darkTheme: string;
}

/** Comments are **off by default** — the theme ships no third-party JavaScript
 *  unless you ask for it. To turn them on: enable Discussions on your repo,
 *  install the giscus app (https://github.com/apps/giscus), fill in the IDs
 *  from https://giscus.app, and set `enabled: true`. */
export const GISCUS: GiscusConfig = {
  enabled: false,
  repo: '',
  repoId: '',
  category: 'Announcements',
  categoryId: '',
  mapping: 'pathname',
  strict: true,
  reactionsEnabled: true,
  inputPosition: 'bottom',
  lang: 'en',
  // Other options include `preferred_color_scheme`, `transparent_dark`,
  // `noborder_light`, `cobalt`, or a URL to your own theme CSS.
  lightTheme: 'light',
  darkTheme: 'dark',
};

export type NavItem =
  | { href: string; label: string; labelKey?: never }
  | { href: string; labelKey: UIKey; label?: never };

/** Header navigation. `href` is relative to the site root; the configured
 *  `base` is applied automatically via `withBase()`. The bundled entries
 *  localize through the UI dictionary; give a page you add yourself a literal
 *  `label` instead — one of the two is required. */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/about/', labelKey: 'nav.about' },
  { href: '/works/', labelKey: 'nav.works' },
  { href: '/blog/', labelKey: 'nav.blog' },
  { href: '/search/', labelKey: 'nav.search' },
];
