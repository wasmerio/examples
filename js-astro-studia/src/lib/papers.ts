import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type Paper = CollectionEntry<'papers'>;
type Pub = CollectionEntry<'publications'>;

/* Everything a paper page's consumers need, answered once. A paper is either a
   publication with a BibTeX entry behind it or a talk at a venue that publishes
   nothing — the `papers` schema in src/content.config.ts. */

/**
 * The publication a paper points at, if it points at one. No `publication` is a
 * legitimate page (a non-archival talk); one that does not resolve is a typo in
 * a BibTeX key and throws, because the page it makes looks almost right.
 */
export async function paperPublication(paper: Paper): Promise<Pub | undefined> {
  const ref = paper.data.publication;
  if (!ref) return undefined;
  const pub = await getEntry(ref);
  if (!pub) throw new Error(`${paper.id}: publication ${ref.id} not found`);
  return pub;
}

/** The year to date, sort and group a paper by: the entry's, or the page's own.
    Undefined only if the schema's refinements were removed; sorting on `?? 0`
    then parks the paper last rather than failing. */
export function paperYear(paper: Paper, pub: Pub | undefined): number | undefined {
  return pub?.data.year ?? paper.data.year;
}

/**
 * Where a paper appeared, in one shape whichever source it came from. The
 * sentence comes from the page's own front matter either way, which is why
 * paperVenue() takes no publication.
 */
export type PaperVenue = {
  /** True when the page states this itself: no "Published at" in front of the
      label, no English conjunction in the byline. */
  stated: boolean;
  /** A flag or other mark, before the label. Stated venues only. */
  mark?: string;
  /** Which words go in front of a DERIVED label: `publishedAt` or `toAppearAt`
      in src/content/pages/site/publication.md. Unset for a stated label,
      which is the whole sentence. */
  prefix?: 'publishedAt' | 'toAppearAt';
  label: string;
  url?: string;
  /** The byline's "by", in the page's language. Stated venues only. */
  connector?: string;
};

export function paperVenue(paper: Paper): PaperVenue | undefined {
  const venue = paper.data.venue;
  if (venue) {
    return {
      stated: true,
      mark: venue.mark,
      label: venue.label,
      url: venue.url,
      connector: venue.bylineConnector,
    };
  }
  if (paper.data.conferenceName) {
    return {
      stated: false,
      prefix: paper.data.status === 'to-appear' ? 'toAppearAt' : 'publishedAt',
      label: paper.data.conferenceName,
      url: paper.data.conferenceUrl,
    };
  }
  return undefined;
}

/**
 * The byline's words. A DERIVED page gets the serial "A, B, and C"; a page that
 * STATES its venue states it in its own language, so the connector comes from
 * the front matter and the names are joined with commas nothing must translate.
 */
export function paperByline(venue: PaperVenue | undefined, count: number) {
  return {
    connector: venue?.stated ? venue.connector : undefined,
    separator: (i: number) => (venue?.stated ? ', ' : i === count - 1 ? ', and ' : ', '),
  };
}

/** What a BibTeX entry says the work appeared IN — one chain, two callers. */
export function paperContainer(pub: Pub | undefined): string | undefined {
  const record = pub?.data;
  return (
    record?.booktitle ??
    record?.journal ??
    record?.series ??
    record?.school ??
    record?.institution ??
    record?.publisher
  );
}

/**
 * The shortest TRUE name for where a paper appeared, or undefined when the
 * entry names no container. Never a word the template invents: a "preprint"
 * fallback here once mislabelled published workshop papers.
 */
export function paperVenueShort(paper: Paper, pub: Pub | undefined): string | undefined {
  return (
    paper.data.venue?.short ?? paper.data.venue?.label ?? pub?.data.abbr?.id ?? paperContainer(pub)
  );
}

/** The one-line summary for a link preview and a feed reader. Never the site's
    blurb; when there is nothing, BaseHead falls back to the site description
    in src/content/pages/site/site.md. */
export function paperDescription(paper: Paper, pub: Pub | undefined): string | undefined {
  return paper.data.description ?? paperVenue(paper)?.label ?? paperContainer(pub);
}

/**
 * The label for a key in a paper's `links` map: the caller's table, then
 * `<venue>_<kind>` with `<kind>` itself a labelled key (`icsa23_pdf` is
 * "PDF (ICSA23)"), then the key as typed — so one more deck needs no edit.
 */
export function linkLabel(key: string, labels: Record<string, string>): string {
  if (labels[key]) return labels[key];
  const match = /^(.+)_([a-z0-9]+)$/i.exec(key);
  if (match && labels[match[2]])
    return `${labels[match[2]]} (${match[1].replace(/[-_]/g, ' ').toUpperCase()})`;
  return key;
}

/**
 * The paper pages an entry page's block lists: `featured`, newest first, then
 * `order`. From `papers`, not from `publications`: a page whose venue is stated
 * rather than cited has no row there and would never appear.
 */
export async function featuredPapers(): Promise<{ paper: Paper; pub: Pub | undefined }[]> {
  const papers = await getCollection('papers', (paper) => paper.data.featured);
  const rows = await Promise.all(
    papers.map(async (paper) => {
      const pub = await paperPublication(paper);
      return { paper, pub, year: paperYear(paper, pub) };
    }),
  );
  return rows
    .sort(
      (first, second) =>
        (second.year ?? 0) - (first.year ?? 0) ||
        first.paper.data.order - second.paper.data.order ||
        first.paper.data.title.localeCompare(second.paper.data.title),
    )
    .map(({ paper, pub }) => ({ paper, pub }));
}
