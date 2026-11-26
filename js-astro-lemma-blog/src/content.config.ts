import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ABOUT_DIR, TEMPLATE } from '../plugins/about.mjs';

// One folder per post: src/content/posts/<slug>/{zh,en}.md, with the post's
// images and videos next to them. zh.md and en.md are translations of each other.
const macro = z.union([
  z.string(),
  z.tuple([z.string(), z.number()]),
  z.tuple([z.string(), z.number(), z.string()]),
]);

const files = glob({ pattern: '**/{zh,en}.md', base: './src/content/posts' });

const posts = defineCollection({
  // A build leaves drafts out of the store, so their images are not bundled
  // either (pages already skip them). The dev server keeps them for preview.
  loader: {
    name: 'posts',
    load: async (context) => {
      await files.load(context);
      if (!import.meta.env.PROD) return;
      for (const [id, entry] of context.store.entries()) if (entry.data.draft) context.store.delete(id);
    },
  },
  schema: z.object({
    title: z.string(),
    // Required: the abstract under the title, the post list summary, and the
    // meta description search results show.
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Read by plugins/rehype-mathjax4.mjs, not by templates.
    macros: z.record(z.string(), macro).optional(),
    // Section numbers (1, 1.1) and theorem numbers per section (2.1); see plugins/remark-theorems.mjs.
    numbering: z.boolean().default(true),
    // Written by AI: the post header tells readers so.
    ai: z.boolean().default(false),
  }),
});

// The about page: {zh,en}.md in src/content/about/ (src/about.sample/ with
// LEMMA_ABOUT=sample; see plugins/about.mjs). A language without a file has
// no about page. The body is the bio; the rest is structured data.
const link = z.object({ label: z.string(), href: z.string() });
// A top-level list left empty (`links:` with nothing under it) is null: no entries.
const list = <T extends z.ZodType>(entry: T) => z.array(entry).nullish().transform((v) => v ?? []);
// `when: 2024` is a YAML number and `when: 2024-09-01` a date; both are shown as written.
const when = z.union([z.string(), z.number(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v)));
// Entries and sections are strict: a misspelt key is an error, not a field quietly dropped.
const item = z
  .object({
    when: when.optional(),
    title: z.string(),
    subtitle: z.string().optional(),
    note: z.string().optional(),
    href: z.string().optional(),
    links: z.array(link).default([]),
  })
  .strict();
// A paper, written as it should print. arxiv and doi take an id or a URL; url
// is the paper's own page (linked from the title); pdf may be a file in the
// about folder. The BibTeX copy button appears when bibtex is given.
const publication = z
  .object({
    title: z.string(),
    authors: z.array(z.string()).default([]),
    venue: z.string().optional(),
    year: z.number().int().optional(),
    note: z.string().optional(),
    selected: z.boolean().default(false),
    url: z.string().optional(),
    pdf: z.string().optional(),
    // A string: unquoted, YAML reads 2505.10230 as a number and drops the last 0.
    arxiv: z.string().optional(),
    doi: z.string().optional(),
    links: z.array(link).default([]),
    bibtex: z.string().optional(),
  })
  .strict();
// selectedOnly: only the papers marked `selected: true`. A selectedOnly
// section without a list of its own takes them from the other publications
// sections of the file, so 代表论文 and 全部论文 share one list.
const publications = z
  .object({
    kind: z.literal('publications'),
    heading: z.string(),
    publications: z.array(publication).nullish(),
    selectedOnly: z.boolean().default(false),
  })
  .strict()
  .refine((s) => s.publications !== undefined || s.selectedOnly, 'a section needs `items`, `publications` or `selectedOnly: true`');
const items = z
  .object({
    kind: z.literal('items'),
    heading: z.string(),
    // `items:` with nothing under it is null: an empty section, left out.
    items: z.array(item).nullable().transform((v) => v ?? []),
  })
  .strict();
// Blocks named by a `kind:` key; each is optional on the page, and its heading too.
const optionalHeading = z.string().optional();
// What the owner is doing now, and where: the page shows the local time
// there (timezone: an IANA name such as Asia/Shanghai).
const timeZone = z.string().refine((zone) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}, 'an IANA time zone, such as Asia/Shanghai');
const now = z
  .object({ kind: z.literal('now'), heading: optionalHeading, text: z.string(), updated: when.optional(), place: z.string().optional(), timezone: timeZone.optional() })
  .strict();
// A year of GitHub contributions (plugins/github.mjs); by default those of
// site.links.github in lemma.config.mjs.
const activity = z.object({ kind: z.literal('activity'), heading: optionalHeading, github: z.string().optional() }).strict();
// Interests, languages, tools: a label, then its words.
const stack = z
  .object({
    kind: z.literal('stack'),
    heading: optionalHeading,
    groups: z.array(z.object({ label: z.string(), tags: z.array(z.string()) }).strict()),
  })
  .strict();
// Software and other work: the title links to href, else to repo. Without
// `stars:`, a GitHub repo's stars are fetched at build time (plugins/github.mjs).
const project = z
  .object({
    title: z.string(),
    note: z.string().optional(),
    href: z.string().optional(),
    repo: z.string().optional(),
    stars: z.number().int().optional(),
    when: when.optional(),
    links: z.array(link).default([]),
  })
  .strict();
const projects = z.object({ kind: z.literal('projects'), heading: optionalHeading, projects: z.array(project) }).strict();
// Short facts as label and value (based in, office, languages).
const facts = z
  .object({
    kind: z.literal('facts'),
    heading: optionalHeading,
    facts: z.array(z.object({ label: z.string(), value: z.string(), href: z.string().optional() }).strict()),
  })
  .strict();
// The latest posts in the page's language.
const recentPosts = z.object({ kind: z.literal('posts'), heading: optionalHeading, limit: z.number().int().positive().default(3) }).strict();

// A section's kind is its `kind:` key, or follows from its keys (`items`,
// else publications), and the section is checked as that kind only. A union
// would try each kind in turn: a paper with a bad field then made the section
// pass as an empty list of items, and vanish.
const sectionKind = (s: Record<string, unknown>) => ('kind' in s ? s.kind : 'items' in s ? 'items' : 'publications');
const section = z.preprocess(
  (s) => (s && typeof s === 'object' && !Array.isArray(s) ? { ...s, kind: sectionKind(s as Record<string, unknown>) } : s),
  z.discriminatedUnion('kind', [items, publications, now, activity, stack, projects, facts, recentPosts]),
);

const aboutFiles = glob({ pattern: '{zh,en}.md', base: ABOUT_DIR });

const about = defineCollection({
  // A build leaves out a file that still holds the template's marker, so
  // the placeholder page never goes live; the dev server shows it.
  loader: {
    name: 'about',
    load: async (context) => {
      await aboutFiles.load(context);
      if (!import.meta.env.PROD) return;
      for (const [id, entry] of context.store.entries()) {
        if (!`${entry.body}${JSON.stringify(entry.data)}`.includes(TEMPLATE)) continue;
        context.store.delete(id);
        context.logger.warn(`${id}.md still holds the template marker ${TEMPLATE}: its about page is not built until the marker is gone`);
      }
    },
  },
  schema: z.object({
    title: z.string(),
    name: z.string(),
    tagline: z
      .string()
      .nullish()
      .transform((v) => v ?? undefined),
    links: list(link),
    // Forms of the owner's name to set in bold in author lists; by default
    // (also when left empty) site.authorBibtex from lemma.config.mjs.
    self: z
      .array(z.string())
      .nullish()
      .transform((v) => v ?? undefined),
    sections: list(section),
  }),
});

export const collections = { posts, about };
