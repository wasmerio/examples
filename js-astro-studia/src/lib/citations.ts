import { SITE } from '../consts.ts';
import { citations, socials } from './data.ts';

/**
 * Scholar cluster id → citation count. Scholar's own keys look like
 * `<profileId>:<clusterId>` while a .bib entry usually carries the cluster id
 * alone, so index on the part after the last colon and accept either.
 */
const byCluster = new Map<string, number>(
  Object.entries(citations.papers).map(([key, value]) => [
    key.split(':').at(-1)!,
    value.citations ?? 0,
  ]),
);

export function citationsFor(googleScholarId?: string): number {
  if (!googleScholarId) return 0;
  return byCluster.get(googleScholarId.split(':').at(-1)!) ?? 0;
}

/** The owner's Scholar profile; undefined without a profile id. */
export function scholarProfileUrl(): string | undefined {
  const user = socials.scholar_userid;
  return user ? `https://scholar.google.com/citations?user=${user}` : undefined;
}

/** The paper's page on the owner's Scholar profile; undefined without a profile id. */
export function scholarPaperUrl(googleScholarId?: string): string | undefined {
  const user = socials.scholar_userid;
  if (!user || !googleScholarId) return undefined;
  const id = googleScholarId.split(':').at(-1)!;
  return `https://scholar.google.com/citations?view_op=view_citation&user=${user}&citation_for_view=${user}:${id}`;
}

/**
 * Total citations, h-index and i10-index, over the whole of citations.yml
 * rather than only the entries in papers.bib, so the numbers match the ones
 * on the Scholar profile.
 */
export function scholarMetrics() {
  const counts = Object.values(citations.papers)
    .map((p) => p.citations ?? 0)
    .sort((a, b) => b - a);

  return {
    total: counts.reduce((sum, n) => sum + n, 0),
    hIndex: counts.reduce((h, n, i) => (n >= i + 1 ? i + 1 : h), 0),
    i10: counts.filter((n) => n >= 10).length,
    lastUpdated: citations.metadata.last_updated,
  };
}

/**
 * Format `last_updated`. UTC in and out: `new Date('2026-09-13')` is midnight
 * UTC, and local getters west of UTC give the previous day.
 */
export function formatUpdated(iso: string): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** The same date, short enough to sit beside a stat's label. */
export function formatUpdatedShort(iso: string): string {
  return new Intl.DateTimeFormat(SITE.locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}
