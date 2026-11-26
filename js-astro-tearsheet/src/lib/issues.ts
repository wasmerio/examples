// The one place that lists issues. The draft filter lives here only; pages never call
// getCollection('issues') themselves, or one of them will forget the filter. Drafts stay out in
// dev too: they would take an issue number and shift every later one.
import { getCollection, type CollectionEntry } from 'astro:content';
import { newsletter, site } from '../config';
import { isoWeekLabel, splitAtCut, type CutStats } from './cut';

export type Issue = CollectionEntry<'issues'> & {
  number: number;
  week: string; // 2026.41
  cut: CutStats;
};

/** Published issues, newest first, numbered by date from newsletter.firstIssue. */
// Built once per build: every page asks, and each call counts every body.
// Not in dev, where an edited issue must show up on the next request.
let built: Promise<Issue[]> | undefined;
export const getIssues = (): Promise<Issue[]> =>
  import.meta.env.PROD ? (built ??= loadIssues()) : loadIssues();

async function loadIssues(): Promise<Issue[]> {
  const entries = (await getCollection('issues', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.date.valueOf() - b.data.date.valueOf(),
  );
  // The glob loader logs a render error (such as a misplaced cut marker) and carries on.
  // Stop the build instead of shipping an issue with no body.
  // MDX is rendered on demand, so only .md entries carry `rendered` here.
  const broken = entries.find((entry) => !entry.rendered && !entry.filePath?.endsWith('.mdx'));
  if (broken) throw new Error(`Issue "${broken.id}" failed to render; see the error above.`);
  return entries
    .map((entry, i) => ({
      ...entry,
      number: newsletter.firstIssue + i,
      week: isoWeekLabel(entry.data.date),
      cut: splitAtCut(entry.body ?? ''),
    }))
    .reverse();
}

const dateFormat = new Intl.DateTimeFormat(site.locale, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC', // without it, zones west of UTC print the day before
});
export const formatDate = (date: Date) => dateFormat.format(date);

export const issueHref = (issue: Pick<Issue, 'id'>) => `/issues/${issue.id}`;

export const topicSlug = (topic: string) => topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
export const topicHref = (topic: string) => `/topics/${topicSlug(topic)}`;

/** Topics in use, most issues first. */
export function topicsOf(issues: Issue[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const issue of issues)
    for (const t of issue.data.topics) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
