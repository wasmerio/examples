/**
 * Which parts of this template are switched on. Nothing is deleted: a `false`
 * leaves the code on disk, still type-checked. docs/Features.md.
 *
 * The region below is generated from scripts/features.mjs by `npm run docs`,
 * which keeps your true/false values.
 */

// BEGIN GENERATED: flags
// Generated from scripts/features.mjs by `npm run docs`; your values are kept.

/** The flags. One boolean per feature; `npm run init` writes them for you. */
export const FEATURES = {
  /** A bibliography parsed from BibTeX, with venue badges and copyable citations. */
  publications: true,
  /** A page per work: the abstract, a figure, the links, the citation. */
  papers: true,
  /** A grid of things you have made, grouped, each with a page of its own. */
  projects: true,
  /** Dated posts with tags, per-tag pages, drafts, and an RSS feed. */
  blog: true,
  /** An Atom/RSS feed at /feed.xml, so people can follow the site. */
  feed: true,
  /** A curriculum vitae rendered from YAML, with a dated timeline rail. */
  cv: true,
  /** Your code and archived datasets, from a committed metadata file. */
  repositories: true,
  /** A team roster whose entry keys are the anchors author names link to. */
  people: true,
  /** Named co-authors with ORCIDs, referenced by paper pages and the roster. */
  authors: true,
  /** Google Scholar counts on each entry, plus h-index and i10 on the list. */
  citations: true,
  /** ORCID, Scholar, DBLP, GitHub and LinkedIn chips, driven by one YAML file. */
  socials: true,
  /** A page for your public key: fingerprint, key id, download, and the armored block inline. */
  pgp: true,
  /** The two-button switcher and the second entry page that show both styles. */
  demo: true,
  /** A site notice. Several jurisdictions require one; Germany certainly does. */
  imprint: true,
};

/** `a: [b]` — `a` cannot build with `b` off. */
const REQUIRES: Partial<Record<FeatureId, FeatureId[]>> = {
  papers: ['publications', 'authors'],
  people: ['authors'],
  citations: ['publications'],
};

/** `a: [b, c]` — `a` needs at least one of `b` or `c`. */
const REQUIRES_ANY: Partial<Record<FeatureId, FeatureId[]>> = {
  feed: ['blog', 'papers'],
};

// END GENERATED: flags

/** Derived from the flags, so the two cannot disagree. */
export type FeatureId = keyof typeof FEATURES;

/** Which entry page renders at `/`. With `demo` on, its second URL renders
    the other one. */
export const HOME_SHAPE: 'profile' | 'project' = 'profile';

/** What `/feed.xml` is a feed OF. Not tied to the blog: a project site has
    none and still wants a feed, of its paper pages. */
export const FEED_SOURCE: 'posts' | 'papers' = 'posts';

/**
 * Returned from a page or endpoint whose feature is off: a prerendered route
 * with no response body is not written to disk.
 *
 * 410 and not 404, because a 404 makes the build render 404.astro INTO the
 * file — the one outcome this exists to avoid. Dev writes nothing either way,
 * so 404 is free there and gets you the real 404 page.
 */
export const disabled = () => new Response(null, { status: import.meta.env.DEV ? 404 : 410 });

/**
 * Refuse a combination that cannot build, naming the offender. A refusal and
 * not a repair: turning the dependency back on behind your back hides the
 * choice, which is usually to turn the dependent feature off instead.
 *
 * Worth stopping for, because the failure it prevents is quiet — Astro reports
 * a dangling reference() and then finishes the build successfully.
 */
function assertFeatures(): void {
  const problems: string[] = [];

  for (const [id, deps] of Object.entries(REQUIRES) as [FeatureId, FeatureId[]][]) {
    if (!FEATURES[id]) continue;
    for (const dep of deps) {
      if (!FEATURES[dep]) problems.push(`${id} needs ${dep}, which is off`);
    }
  }

  for (const [id, options] of Object.entries(REQUIRES_ANY) as [FeatureId, FeatureId[]][]) {
    if (!FEATURES[id]) continue;
    if (!options.some((o) => FEATURES[o])) {
      problems.push(`${id} needs at least one of ${options.join(' or ')}, and all are off`);
    }
  }

  // FEED_SOURCE is a feature constraint too, and names the collection it reads.
  if (FEATURES.feed) {
    const source = FEED_SOURCE === 'posts' ? 'blog' : 'papers';
    if (!FEATURES[source]) {
      problems.push(`FEED_SOURCE is '${FEED_SOURCE}', which needs ${source}, and it is off`);
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `src/features.ts: this combination cannot build.\n` +
        problems.map((p) => `  · ${p}`).join('\n') +
        `\nTurn the dependency on, or the dependent feature off. docs/Features.md.`,
    );
  }
}

assertFeatures();
