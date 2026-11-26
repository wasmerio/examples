/**
 * The feature manifest: what this template is made of, and what belongs to
 * what. It is prose plus structure, and it has three consumers that cannot
 * disagree:
 *
 *   src/features.ts       the flags themselves, generated from this list
 *   scripts/gen-docs.mjs  writes that generated region, and the docs table
 *   scripts/init.mjs      sets the flags from a preset or a selection
 *
 * If you add a feature to this template, add it here and run `npm run docs`;
 * everything else follows. Nothing here deletes anything — a feature is off
 * when its flag is false, and its code stays on disk, type-checked.
 *
 * A preset is a STARTING SELECTION, not a mode: init pre-ticks its features
 * and you tick and untick freely, before or after.
 *
 * `profile`  one person: publications, a CV, a blog, software, a GitHub list.
 * `project`  a project or group: sub-projects, paper pages, a team.
 */

/** @typedef {'profile' | 'project'} Preset */

/**
 * @typedef {object} Feature
 * @property {string}   id        stable key: the flag's name and the CLI's word for it
 * @property {string}   label     human name, used in the prompt and the docs
 * @property {string}   blurb     one line: what you lose by turning it off
 * @property {Preset[]} presets   which presets include it by default
 * @property {string[]} requires  feature ids this one needs to work
 * @property {string[]} [requiresAny]  ids of which at least ONE must be on
 * @property {string[]} paths     what the feature owns, repo-relative. NOT a
 *   delete list: it is the "if you want the files gone too" column of the docs.
 *   That includes its page text under src/content/pages/, which is read only
 *   while the feature is on, so deleting it with the rest is safe.
 * @property {string[]} manual    edits a human still has to make, in prose
 */

/** @type {Feature[]} */
export const FEATURES = [
  {
    id: 'publications',
    label: 'Publications',
    blurb: 'A bibliography parsed from BibTeX, with venue badges and copyable citations.',
    presets: ['profile', 'project'],
    requires: [],
    paths: [
      'src/pages/publications',
      'src/components/pub',
      'src/lib/publications.ts',
      'src/loaders/bibtex.ts',
      'src/data/papers.bib',
      'src/data/venues.yml',
      'scripts/update-bib.mjs',
      'scripts/find-missing-papers.mjs',
      'scripts/lib/missing-papers.mjs',
      'src/data/papers-ignore.yml',
      'src/content/pages/publications.md',
      // The words on an entry, shared with `papers`, which needs this feature.
      'src/content/pages/site/publication.md',
    ],
    manual: [
      'drop the `bib:check` and `bib:missing` scripts, and `fast-xml-parser`, from package.json',
    ],
  },

  {
    id: 'papers',
    label: 'Paper pages',
    blurb: 'A page per work: the abstract, a figure, the links, the citation.',
    presets: ['profile', 'project'],
    requires: ['publications', 'authors'],
    paths: [
      'src/pages/papers',
      'src/content/papers',
      'src/components/paper',
      'src/lib/papers.ts',
      // Front-matter figures, through the asset pipeline, and the two
      // full-size images the demo page links to from its prose, which stay
      // under public/ because a link needs a URL that does not move.
      'src/assets/papers',
      'public/assets/img/papers',
      // The feed variant that reads the papers collection; see FEED_SOURCE.
      'src/lib/feed/fromPapers.ts',
      'src/content/pages/papers.md',
    ],
    manual: [],
  },

  {
    id: 'projects',
    label: 'Projects',
    blurb: 'A grid of things you have made, grouped, each with a page of its own.',
    presets: ['profile', 'project'],
    requires: [],
    paths: [
      'src/pages/projects',
      'src/components/project',
      'src/content/projects',
      // Logos and page figures both. Its own directory rather than a shared
      // one, for the same reason papers and posts have theirs: whose image is
      // whose should be answerable by looking.
      'src/assets/projects',
      'src/data/project-groups.yml',
      'src/content/pages/projects.md',
    ],
    manual: [
      'a group site usually calls these `approaches` — rename the collection in src/content.config.ts, the directory under src/pages/, and the label in src/content/pages/site/nav.md',
    ],
  },

  {
    id: 'blog',
    label: 'Blog',
    blurb: 'Dated posts with tags, per-tag pages, drafts, and an RSS feed.',
    presets: ['profile'],
    requires: [],
    paths: [
      'src/pages/blog',
      'src/lib/blog.ts',
      // Imports lib/blog.ts. With the blog off and the feed on, FEED_SOURCE
      // is 'papers' instead — see PRESET_FEED below.
      'src/lib/feed/fromPosts.ts',
      'src/content/posts',
      'public/assets/img/posts',
      'src/content/pages/blog.md',
    ],
    manual: [],
  },

  {
    id: 'feed',
    label: 'RSS feed',
    blurb: 'An Atom/RSS feed at /feed.xml, so people can follow the site.',
    presets: ['profile', 'project'],
    requires: [],
    paths: ['src/pages/feed.xml.ts', 'src/lib/feed'],
    // Deliberately NOT owned by the blog: a project site has no blog and still
    // wants a feed, of its paper pages — but it needs one of the two.
    requiresAny: ['blog', 'papers'],
    manual: [],
  },

  {
    id: 'cv',
    label: 'CV',
    blurb: 'A curriculum vitae rendered from YAML, with a dated timeline rail.',
    presets: ['profile'],
    requires: [],
    paths: ['src/pages/cv', 'src/lib/cv.ts', 'src/data/cv.yml', 'src/content/pages/cv.md'],
    manual: [],
  },

  {
    id: 'repositories',
    label: 'Repositories',
    blurb: 'Your code and archived datasets, from a committed metadata file.',
    presets: ['profile'],
    requires: [],
    paths: [
      'src/pages/repositories',
      'src/data/repositories.yml',
      'src/data/github-metadata.json',
      'src/data/language_colors.yml',
      'scripts/fetch-github-metadata.mjs',
      '.github/workflows/update-github-metadata.yml',
      'src/content/pages/repositories.md',
    ],
    manual: ['drop the `data:github` script from package.json'],
  },

  {
    id: 'people',
    label: 'People',
    blurb: 'A team roster whose entry keys are the anchors author names link to.',
    presets: ['project'],
    requires: ['authors'],
    paths: [
      'src/pages/people',
      'src/components/people',
      'src/lib/people.ts',
      'src/data/people.yml',
      'src/assets/people',
      'src/content/pages/people.md',
    ],
    manual: [],
  },

  {
    id: 'authors',
    label: 'Authors',
    blurb: 'Named co-authors with ORCIDs, referenced by paper pages and the roster.',
    presets: ['profile', 'project'],
    requires: [],
    paths: ['src/data/authors.yml'],
    manual: [],
  },

  {
    id: 'citations',
    label: 'Citation counts',
    blurb: 'Google Scholar counts on each entry, plus h-index and i10 on the list.',
    presets: ['profile', 'project'],
    /*
     * NOT `socials`, although the refresh script needs it:
     * update-scholar-citations.mjs reads `scholar_userid` from
     * src/data/socials.yml, and that file is on disk whatever the flags say.
     * `requires` means "cannot build", and this builds — citations.yml is read
     * on its own. Turning socials off only means nobody refreshes the counts.
     */
    requires: ['publications'],
    paths: [
      'src/lib/citations.ts',
      'src/data/citations.yml',
      'scripts/update-scholar-citations.mjs',
      '.github/workflows/update-citations.yml',
    ],
    manual: [],
  },

  {
    id: 'socials',
    label: 'Profile links',
    blurb: 'ORCID, Scholar, DBLP, GitHub and LinkedIn chips, driven by one YAML file.',
    presets: ['profile'],
    requires: [],
    paths: ['src/components/SocialRow.astro', 'src/data/socials.yml'],
    manual: [],
  },

  {
    id: 'pgp',
    label: 'PGP key',
    blurb:
      'A page for your public key: fingerprint, key id, download, and the armored block inline.',
    presets: ['profile'],
    /* Not `socials`, for the same reason citations is not: the fingerprint is
       one value in src/data/socials.yml, and that file is always on disk. */
    requires: [],
    paths: [
      'src/pages/pgp-key',
      'src/lib/pgp.ts',
      'public/assets/pgp-key',
      'src/content/pages/pgp-key.md',
    ],
    manual: [],
  },

  {
    id: 'demo',
    label: 'Demo switcher',
    blurb: 'The two-button switcher and the second entry page that show both styles.',
    /*
     * In NO preset, on purpose — the only feature like that. The switcher and
     * its second URL exist so someone evaluating the template can see both
     * entry-page shapes. With it off, HOME_SHAPE alone decides which one `/`
     * renders.
     */
    presets: [],
    requires: [],
    paths: ['src/pages/demo', 'src/components/DemoSwitch.astro'],
    manual: [],
  },

  {
    id: 'imprint',
    label: 'Imprint',
    blurb: 'A site notice. Several jurisdictions require one; Germany certainly does.',
    presets: ['profile', 'project'],
    requires: [],
    paths: ['src/pages/imprint', 'src/content/pages/imprint.md'],
    manual: [],
  },
];

/**
 * The FEED_SOURCE each preset starts from. A profile site feeds its posts, a
 * project site its paper pages; either is a choice afterwards, not a mode.
 * There is no PRESET_HOME beside it only because HOME_SHAPE happens to carry
 * the preset's own name.
 */
export const PRESET_FEED = /** @type {Record<Preset, 'posts' | 'papers'>} */ ({
  profile: 'posts',
  project: 'papers',
});

export const PRESETS = /** @type {Preset[]} */ (['profile', 'project']);

export const byId = (id) => FEATURES.find((feature) => feature.id === id);

/** Feature ids a preset selects. */
export const featuresFor = (preset) =>
  FEATURES.filter((feature) => feature.presets.includes(preset)).map((feature) => feature.id);

/**
 * What is wrong with a selection, if anything.
 *
 * `requires` is a real dependency, not a suggestion: papers reference authors
 * through Astro's reference(), so a build with papers on and authors off is a
 * build with broken references. The old pruning init silently added the
 * dependency; flags make the opposite choice, and so does this. Being told
 * "papers needs authors" beats having authors switched back on behind your
 * back, because now you can simply turn papers off instead.
 *
 * `requiresAny` is the same rule where more than one answer satisfies it:
 * picking one of `blog`/`papers` for somebody would hand them a whole area
 * they had turned off.
 *
 * src/features.ts asserts exactly this at build time, from the same manifest.
 */
export function check(selected) {
  const on = new Set(selected);
  const missing = [];
  const unmet = [];
  for (const id of on) {
    const feature = byId(id);
    if (!feature) continue;
    for (const dep of feature.requires) if (!on.has(dep)) missing.push({ id, dep });
    const any = feature.requiresAny ?? [];
    if (any.length > 0 && !any.some((option) => on.has(option))) unmet.push({ id, options: any });
  }
  return { missing, unmet };
}
