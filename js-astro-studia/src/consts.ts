import { FEATURES, type FeatureId } from './features.ts';

/**
 * The config file: single values that decide how the site behaves — where it
 * lives, which language it formats in, who it is about. No words a reader sees:
 * the site's text is in `src/content/pages/` (the title, the brand, the nav and
 * footer labels, every page's prose), lists that grow are in `src/data/`, and
 * the works themselves in `src/content/`. docs/Configuration.md.
 */

export const SITE = {
  /** No trailing slash. With a `base` configured, include that path. */
  url: 'https://dfuchss.github.io/astro-studia',

  /** A mark beside the wordmark, or `null`. Dimensions and alt are derived;
      `replacesWordmark` for a logo with the name already in it. The wordmark
      itself is `brand` in src/content/pages/site/site.md. */
  brandLogo: { src: '/assets/img/brand-mark.svg', replacesWordmark: false } as {
    src: string;
    replacesWordmark?: boolean;
  } | null,

  /** Used for <html lang>. */
  lang: 'en',

  /** Formats every date and number; toLocaleString()'s default drifts between machines. */
  locale: 'en-US',

  email: 'cicero@example.org',

  /** The project hero's GitHub button, and the footer credit's link. */
  repo: 'https://github.com/dfuchss/astro-studia',

  /** The 1200x630 link-preview card. null for the small text-only card. */
  ogImage: '/assets/img/og.png',

  /** SET THIS TO false once the content is yours: banner on the entry page, word
      in the footer. */
  demoNotice: true as boolean,
} as const;

/**
 * Who the site is about, and the one source of their name: the hero, the CV
 * and every `{name}` in src/content/pages/ read it from here. `surnames` is how
 * an author parsed out of papers.bib is recognised as you (accents and ß
 * folded; see isSelf()) — list every name you, or every member of a group, has
 * published under.
 */
export const SELF = {
  first: 'Marcus Tullius',
  last: 'Cicero',
  surnames: ['Cicero'],
} as const;

/**
 * The areas of the site; `<body data-section>` picks the accent family. ADDING
 * ONE IS TWO EDITS: this list and a `[data-section='…']` block in tokens.css,
 * and the audit compares the two. A list rather than a bare union so the nav
 * rows in src/content/pages/site/nav.md are validated against it.
 *
 * Every area stays listed whatever the flags say; an unrendered accent family
 * costs a few bytes, and switching the feature back on needs no edit here.
 */
export const SECTIONS = [
  'home',
  'publications',
  'papers',
  'projects',
  'repositories',
  'blog',
  'people',
  'cv',
] as const;
export type Section = (typeof SECTIONS)[number];

/**
 * A row shown only while its feature is on; one with no `feature` always. The
 * nav and footer rows in src/content/pages/site/ carry a `feature`, validated
 * against the flags, so a typo fails the build instead of hiding a link.
 */
export const shown = <T extends { feature?: FeatureId }>(rows: T[]): T[] =>
  rows.filter((row) => !row.feature || FEATURES[row.feature]);

/**
 * Which optional parts of the footer render: the email link and the theme's
 * "built with" credit. The footer's words — the links, the affiliation, the
 * copyright holder — are src/content/pages/site/footer.md; anything these
 * cannot express goes through Base.astro's `footer` slot.
 */
export const FOOTER = {
  email: true,
  credit: true,
};

/** Author names shown before "and N more authors". `null` lists everyone. */
export const AUTHOR_LIMIT: number | null = 4;

/** On a person's card at /people/, the ORCID chip shows the id itself or the
    word (`chips.orcid` in src/content/pages/people.md). */
export const PEOPLE_ORCID: 'label' | 'id' = 'id';

/** Extra origins the audit tolerates for subresources — an embedded talk's host. */
export const ALLOWED_THIRD_PARTY: string[] = [];
