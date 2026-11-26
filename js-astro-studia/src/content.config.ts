import { defineCollection, reference, type SchemaContext } from 'astro:content';
import { z } from 'zod';
import { file, glob } from 'astro/loaders';
import { bibtexLoader } from './loaders/bibtex.ts';
import { FEATURES, type FeatureId } from './features.ts';
import { SECTIONS } from './consts.ts';
import { PAPERS } from './lib/paths.ts';

/*
 * The content model. Every cross-reference goes through `reference()`, so a
 * bad slug or an unknown venue stops the build naming the offender instead of
 * rendering blank. Field by field: docs/Content.md.
 *
 * Every collection is declared whatever the flags say, so `reference()` keeps
 * type-checking; one whose feature is off is loaded `empty` instead, so the
 * demo file behind it can be deleted too. docs/Features.md.
 */

const empty = () => [] as { id: string }[];

/**
 * A `reference()` array, or an always-empty one when the target collection is
 * off. A reference into an EMPTY collection is not a type error but a runtime
 * one, and Astro logs it and then finishes the build successfully.
 *
 * The cast keeps one declared type across both branches; without it the union
 * of two identical array types makes `.map()` uncallable at every consumer.
 */
type Ref<C extends string> = { collection: C; id: string };
const refs = <C extends 'authors' | 'projects'>(collection: C, on: boolean) =>
  (on
    ? z.array(reference(collection))
    : z.array(z.unknown()).transform(() => [])) as unknown as z.ZodType<Ref<C>[], Ref<C>[]>;

/** Badge colours for the publication list, keyed by the BibTeX `abbr`. */
const venues = defineCollection({
  loader: FEATURES.publications ? file('src/data/venues.yml') : empty,
  schema: z.object({
    name: z.string(),
    url: z.url().optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'venue colour must be a 6-digit hex value'),
  }),
});

/** Everyone who appears as an author anywhere, plus everyone in people.yml. */
const authors = defineCollection({
  loader: FEATURES.authors ? file('src/data/authors.yml') : empty,
  schema: z.object({
    name: z.string(),
    orcid: z.string().nullable().default(null),
  }),
});

/** The people shown at /people/. The collection id is the page anchor, so a
    key here is a published URL. */
const people = defineCollection({
  loader: FEATURES.people ? file('src/data/people.yml') : empty,
  /* A function so it can take `image()`. It works under a file() loader as it
     does under glob(): the path is relative to the file the entry was loaded
     from, which here is src/data/people.yml — so `../assets/…`. */
  schema: ({ image }) =>
    z.object({
      /** Name and ORCID come from authors.yml, not from here. */
      author: reference('authors'),
      order: z.number().int(),
      role: z.string().optional(),
      /** A portrait under src/assets/, relative to src/data/. */
      image: image(),
      email: z.string().optional(),
      url: z.url().optional(),
      github: z.string().optional(),
      /** Every surname this person publishes under; links an author name in the
          publication list back to this entry. */
      surnames: z.array(z.string()).min(1),
    }),
});

/**
 * This paper's own page; a slug with no markdown behind it fails the build.
 * Assembled from PAPERS rather than typed out, so renaming the route cannot
 * leave a validator insisting on the old prefix. Applied only when `papers` is
 * on, because with that collection empty every slug would be missing.
 */
const pageRule = {
  field: 'page',
  as: 'pageSlug',
  resolve: (raw: string, { key }: { key: string }) => {
    const pattern = new RegExp(`^${PAPERS}([a-z0-9._-]+)/?$`);
    const match = pattern.exec(raw);
    if (!match) throw new Error(`${key}: page = {${raw}} is not a ${PAPERS}<slug>/ path`);
    return { value: match[1], file: `src/content/papers/${match[1]}.md` };
  },
};

const publications = defineCollection({
  loader: FEATURES.publications
    ? bibtexLoader({
        file: 'src/data/papers.bib',

        links: [
          // A PDF you host: an absolute URL, or a path under public/assets/pdf/.
          {
            field: 'pdf',
            as: 'pdfUrl',
            allowAbsolute: true,
            resolve: (rel) => ({
              value: `/assets/pdf/${rel}`,
              file: `public/assets/pdf/${rel}`,
            }),
          },
          ...(FEATURES.papers ? [pageRule] : []),
        ],
      })
    : empty,

  // Every field the loader produces has to be declared here or Zod drops it.
  schema: z.object({
    key: z.string(),
    type: z.string(),
    title: z.string(),
    authors: z.array(z.object({ first: z.string(), last: z.string() })).min(1),
    year: z.number().int(),
    month: z.number().int().min(1).max(12).optional(),
    // Optional: an entry with no venue renders without a badge.
    abbr: reference('venues').optional(),
    booktitle: z.string().optional(),
    journal: z.string().optional(),
    school: z.string().optional(),
    institution: z.string().optional(),
    publisher: z.string().optional(),
    series: z.string().optional(),
    volume: z.string().optional(),
    number: z.string().optional(),
    pages: z.string().optional(),
    location: z.string().optional(),
    doi: z.string().optional(),
    url: z.url().optional(),
    keywords: z.array(z.string()).default([]),
    /** Scholar cluster id; the key into src/data/citations.yml. */
    googleScholarId: z.string().optional(),
    /** From `pdf` — see the links[] wiring above. */
    pdfUrl: z.string().optional(),
    /** From `page` — the slug of this paper's own page under /papers/. */
    pageSlug: z.string().optional(),
    bibtex: z.string(),
    searchText: z.string(),
  }),
});

/**
 * A figure: an image from src/assets/, through the asset pipeline, so the
 * dimensions and the hashed filename come from the build rather than from a
 * disk read at render time.
 *
 * A factory rather than a constant, because `image()` is handed to a schema and
 * cannot be imported — and both collections that take a figure pass their own.
 */
const figureFor = ({ image }: SchemaContext) =>
  z.object({
    src: image(),
    alt: z.string(),
    /** A white plate behind it. True for dark line art on transparency, which
        is invisible on this background; false for an image with its own. */
    plate: z.boolean().default(true),
    /** A window frame with this titlebar label. Explicit rather than derived
        from `plate`: the two coincide often enough to look right until they don't. */
    frame: z.string().optional(),
  });

/** label -> URL, rendered as a row of chips. A record, because every paper
    lives in a different handful of places. */
const linkMap = z
  .record(
    z.string(),
    z.union([
      z.url(),
      z.string().regex(/^\/[^\s]*$/, 'link must be an absolute URL or a site-relative path'),
    ]),
  )
  .optional();

/**
 * One page per paper. The filename is the URL, and what a `page = {…}` field
 * in papers.bib has to match.
 */
const papers = defineCollection({
  loader: FEATURES.papers ? glob({ base: 'src/content/papers', pattern: '**/*.md' }) : empty,
  /** A function so it can take `image()` — the figure goes through src/assets/. */
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().optional(),

        /**
         * The BibTeX key. Everything bibliographic is read from there, not here.
         * OPTIONAL: a talk at a venue that publishes nothing has no entry to
         * point at, and states its `venue` and `year` itself instead. The
         * refinements below make those the only two possibilities.
         */
        publication: reference('publications').optional(),

        /** The year, only for a page with no `publication`; with one it comes
          from the entry. */
        year: z.number().int().optional(),

        /**
         * The venue, stated outright, for a page with no `publication`. The
         * presence of this object IS which of the two sources a page has.
         *
         * One object, not four sibling strings: the four mean nothing apart
         * from each other, and four loose fields once ended in a default prefix
         * doubling as the "is a venue stated at all?" sentinel. It is also the
         * home of the label's language — a German sentence makes every English
         * word the template adds beside it wrong, so the byline's "by" lives
         * here and the serial "and" between names goes away. `status` is not
         * consulted for a stated venue.
         */
        venue: z
          .object({
            /** The whole sentence, in the page's own language. Not a prefix. */
            label: z.string(),
            /** The event's own page, if it has one. */
            url: z.url().optional(),
            /** A flag or other mark, before the label. */
            mark: z.string().optional(),
            /** For the breadcrumb and the list rows, where the sentence does not
              fit. Defaults to `label`. */
            short: z.string().optional(),
            /** The byline's "by", in the page's language: "von", "par", "a". */
            bylineConnector: z.string().default('by'),
          })
          .optional(),

        /** Authors as authors.yml entries, so each can link to an ORCID. The
          BibTeX author list is strings; this one is identities. */
        authors: refs('authors', FEATURES.authors).default([]),

        /** Spelled out rather than a boolean: `inPress: false` is true of a paper
          that is out and of one never submitted. */
        status: z.enum(['published', 'to-appear']).default('published'),

        /**
         * The conference or series' OWN homepage, which neither `abbr` (the
         * proceedings), `links.paper` (the publisher's copy) nor the DOI points
         * at. For a paper with an entry; the page wraps it in "Published at".
         */
        conferenceName: z.string().optional(),
        conferenceUrl: z.url().optional(),

        /** Later outings for the same work. Not in papers.bib, where one entry
          per talk would show the same paper five times on /publications/. */
        additionalPresentations: z
          .array(z.object({ name: z.string(), shortName: z.string().optional(), url: z.url() }))
          .default([]),

        /**
         * The projects this work came out of, stated here and nowhere else: a
         * project page derives its paper list by scanning this field. A project
         * with a `redirect` is fine; the page links out to it.
         *
         * Through refs() because `papers` does not require `projects`.
         */
        projects: refs('projects', FEATURES.projects).default([]),

        /** Sort key for /papers/. Lower comes first. */
        order: z.number().int().default(100),
        featured: z.boolean().default(false),

        figure: figureFor({ image }).optional(),

        links: z.object({ paper: linkMap, replication: linkMap, slides: linkMap }).default({}),
      })
      /* Refinements rather than prose, because the failure is silent: a page
       with both sources renders whichever the markup checks first, and one
       with neither renders an empty venue line and sorts last. */
      .refine((paper) => Boolean(paper.publication) !== Boolean(paper.venue), {
        message:
          'a paper page needs exactly one venue source: a `publication` (the BibTeX entry) or a stated `venue`',
        path: ['venue'],
      })
      .refine((paper) => !(paper.venue && (paper.conferenceName || paper.conferenceUrl)), {
        message:
          '`conferenceName`/`conferenceUrl` belong to a paper with a `publication`; a stated `venue` already carries its own label and url',
        path: ['conferenceName'],
      })
      .refine((paper) => Boolean(paper.publication) !== (paper.year !== undefined), {
        message:
          'set `year` only on a paper with no `publication` — with an entry the year comes from the BibTeX, and without one nothing else has a date',
        path: ['year'],
      }),
});

/** The groups /projects/ sorts its entries into: the one list of categories,
    with each one's heading and blurb. A project's `category` references it. */
const projectGroups = defineCollection({
  loader: FEATURES.projects ? file('src/data/project-groups.yml') : empty,
  schema: z
    .object({
      /** The key a project's `category` names; file() leaves it in the data. */
      id: z.string(),
      /** file() does not keep the YAML order, so the page sorts by this. */
      order: z.number().int(),
      label: z.string(),
      blurb: z.string(),
    })
    .strict(),
});

/** Things you have made. An entry with `redirect` is a link out and gets no
    page of its own. */
const projects = defineCollection({
  loader: FEATURES.projects ? glob({ base: 'src/content/projects', pattern: '**/*.md' }) : empty,
  /** A function so it can take `image()`: the logo and the figure both go
      through the asset pipeline from src/assets/. */
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      /**
       * The group on /projects/: an id in src/data/project-groups.yml.
       * Optional: leave it off every entry for a flat list, and entries
       * without one gather under a final "Other" group rather than dropping
       * off the page.
       */
      category: reference('projectGroups').optional(),
      order: z.number().int().default(100),
      /** When set, the entry links straight out and no page is generated. */
      redirect: z.url().optional(),
      /** The two or three repositories a reader of THIS project needs, as
          chips. Not the site-wide /repositories/ list. */
      repositories: z.array(z.object({ name: z.string(), url: z.url() })).default([]),
      logo: image().optional(),
      /** An overview diagram: the same sub-schema the papers use, so the two
          cannot mean different things. */
      figure: figureFor({ image }).optional(),
    }),
});

/** Front matter in the wild uses both `tags: x` and `tags: [x, y]`. */
const toArray = (v: string | string[]) => (Array.isArray(v) ? v : [v]);

/** Posts. The FILENAME sets the URL and must be YYYY-MM-DD-slug; blog.ts says why. */
const posts = defineCollection({
  loader: FEATURES.blog ? glob({ base: 'src/content/posts', pattern: '**/*.md' }) : empty,
  schema: z.object({
    title: z.string(),
    /** Must agree with the filename; publishedPosts() throws if it does not. */
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z
      .union([z.string(), z.array(z.string())])
      .transform(toArray)
      .default([]),
    featured: z.boolean().default(false),
    /** Kept out of the list, the feed, the sitemap and its own page. */
    draft: z.boolean().default(false),
  }),
});

/* ── page text ─────────────────────────────────────────────────────────── */

const featureId = z.enum(Object.keys(FEATURES) as [FeatureId, ...FeatureId[]]);

/** A link row. `feature` hides it while that feature is off (see shown() in
    src/consts.ts); `section` is the accent it previews in the nav. */
const linkRow = z
  .object({
    label: z.string(),
    href: z.string(),
    section: z.enum(SECTIONS).optional(),
    feature: featureId.optional(),
  })
  .strict();

/** Singular and plural; the template picks one and fills in `{count}`. */
const plural = z.object({ one: z.string(), other: z.string() }).strict();

/** Short labels keyed by what they label. Which keys a page reads is listed in
    its file; a missing one fails the build naming it (need() in lib/pages.ts). */
const labels = z.record(z.string(), z.string());

/**
 * Every word the templates print that is not computed: one Markdown file per
 * page in src/content/pages/<id>.md, plus site/ for what every page shares and
 * a few fragments (home/involvement.md) for rich blocks placed on their own.
 * Front matter holds meta and short strings, the body holds rich text. Strings
 * may carry `{placeholders}` that the template fills with computed values.
 *
 * Fields are optional because the shapes differ per page; the page that needs
 * one asks for it through need(). `.strict()` makes a misspelt key a build
 * error rather than a silently ignored line. docs/Content.md, "Page text".
 */
const pages = defineCollection({
  loader: glob({ base: 'src/content/pages', pattern: '**/*.md' }),
  schema: z
    .object({
      // Every page: <title> and meta description. Both may say {name}.
      title: z.string().optional(),
      description: z.string().optional(),
      // site/site.md
      brand: z.string().optional(),
      brandPrompt: z.string().optional(),
      // site/nav.md, site/footer.md
      links: z.array(linkRow).optional(),
      // site/footer.md: the holder after "© <year>", the affiliation (text and
      // links, joined with no added spaces), and the email link's word
      copyright: z.string().optional(),
      affiliation: z
        .array(z.union([z.string(), z.object({ label: z.string(), href: z.string() }).strict()]))
        .optional(),
      email: z.string().optional(),
      // a lede line set before or instead of the body; may hold {placeholders}
      lede: z.string().optional(),
      // "N things" before a list's lede; {count} is filled in
      count: z.string().optional(),
      // short words a page places around its lists: buttons, chips, notes
      labels: labels.optional(),
      // a sentence under a section's heading, keyed by section
      intros: labels.optional(),
      // "more →" links under a section
      more: labels.optional(),
      // home.md, home/profile.md, home/project.md
      statLabels: labels.optional(),
      statNote: z.string().optional(),
      interests: z.array(z.string()).optional(),
      // blog.md
      tagTitle: z.string().optional(),
      tagDescription: z.string().optional(),
      tagCount: plural.optional(),
      // cv.md, site/publication.md
      plurals: z.record(z.string(), plural).optional(),
      // site/publication.md: a paper page's link keys → their names
      linkLabels: labels.optional(),
      // projects.md: the group for projects with no `category`; the others
      // are src/data/project-groups.yml
      other: z.object({ label: z.string(), blurb: z.string() }).strict().optional(),
      // imprint.md: label and lines of each field
      fields: z
        .array(z.object({ label: z.string(), lines: z.array(z.string()) }).strict())
        .optional(),
    })
    .strict(),
});

export const collections = {
  venues,
  authors,
  people,
  publications,
  papers,
  projectGroups,
  projects,
  posts,
  pages,
};
