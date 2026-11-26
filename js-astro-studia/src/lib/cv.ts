import { parse } from 'yaml';
import cvRaw from '../data/cv.yml?raw';
import { SITE } from '../consts.ts';

/** How a section renders. `timeline` (a date rail) and `rows` (none) are chosen
    by layoutOf() when a section names nothing; `cards` and `courses` are always
    explicit. */
export type CvLayout = 'timeline' | 'rows' | 'cards' | 'courses';

export type CvEntry = {
  title: string;
  org?: string;
  url?: string;
  start?: string;
  end?: string;
  /** Still going. Renders "– present" and a `now` badge. */
  current?: boolean;
  location?: string;
  note?: string;
  details?: string[];
  /** Sends this entry to the section's collapsed tail — per-entry rather than
      "keep the first N", because it is about the kind of entry, not its rank. */
  minor?: boolean;
  /** Chips under a `cards` entry, entry.g. the areas a project touches. */
  highlights?: string[];
  /** A `courses` entry's term, entry.g. "WS 26/27" or "SS 2026". */
  semester?: string;
  /** A `courses` entry's kind, entry.g. "Lecture / Practice". */
  type?: string;
};

export type CvSection = {
  id: string;
  heading: string;
  layout?: CvLayout;
  /** A noun for an entry count beside the heading: `courses` renders "Teaching
      6 courses". Opt-in; the noun is the switch. `singular|plural` for a
      section that may hold one entry. */
  count?: string;
  entries: CvEntry[];
};

export type Cv = {
  summary?: string;
  /** Research-interest tag cloud rendered under the summary. */
  interests?: string[];
  sections: CvSection[];
};

export const cv = parse(cvRaw) as Cv;

/** Format one end of a date range. "2020-03" is formatted for the site's locale,
    in UTC so the month cannot shift with the build machine's zone; anything else
    ("Winter 2024/25", "63 BC") passes through untouched. */
export function formatDate(value: string): string {
  const yearMonth = /^(\d{4})-(\d{2})$/.exec(value);
  if (yearMonth) {
    return new Intl.DateTimeFormat(SITE.locale, {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${value}-01T00:00:00Z`));
  }
  return value;
}

/** "Jan 2020 – present", "63 BC – 62 BC", "2020", or "" when undated.
    `present` is the word for a range still going: `labels.present` in
    src/content/pages/cv.md. */
export function dateRange(entry: CvEntry, present: string): string {
  if (!entry.start) return entry.end ? formatDate(entry.end) : '';
  const from = formatDate(entry.start);
  if (entry.current) return `${from} – ${present}`;
  if (!entry.end) return from;
  const to = formatDate(entry.end);
  return from === to ? from : `${from} – ${to}`;
}

/** Explicit, not inferred: "a start and no end" also describes a degree or a
    prize, and inferring would label every one of them "now". */
export const isCurrent = (entry: CvEntry) => entry.current === true;

/** The first current entry anywhere in the CV. The home page's "where to find
    me" line reads it, so the two cannot disagree. */
export function currentPosition(): CvEntry | undefined {
  for (const section of cv.sections) {
    const hit = section.entries.find(isCurrent);
    if (hit) return hit;
  }
  return undefined;
}

/** The default layout for a section that names none: a rail only once there
    are dates to hang on it. */
export function layoutOf(section: CvSection): CvLayout {
  return (
    section.layout ??
    (section.entries.some((entry) => entry.start || entry.end) ? 'timeline' : 'rows')
  );
}

/** "6 courses" for a section that named a `count` noun, nothing otherwise. */
export function countLabel(section: CvSection): string | undefined {
  if (!section.count) return undefined;
  const count = section.entries.length;
  const [one, many = one] = section.count.split('|');
  return `${count} ${count === 1 ? one : many}`;
}

/** An entry's `minor` flag splits a section's main list from its collapsed tail. */
export function splitMinor(entries: CvEntry[]): { main: CvEntry[]; minor: CvEntry[] } {
  return {
    main: entries.filter((entry) => !entry.minor),
    minor: entries.filter((entry) => entry.minor),
  };
}

/** A semester string → a sortable number, newest largest. Keyed on the year the
    semester STARTS in, so the two spellings mix: `WS 26/27` sorts above
    `SS 2026`. */
export function semesterKey(semester: string): number {
  const match = /(\d{4}|\d{2})/.exec(semester);
  if (!match) return 0;
  const year = match[1].length === 2 ? 2000 + Number(match[1]) : Number(match[1]);
  return year * 10 + (semester.startsWith('WS') ? 1 : 0);
}

/** A `courses` section's entries, newest semester first, split into the
    current term and everything before it. */
export function groupCourses(entries: CvEntry[]): { current: CvEntry[]; past: CvEntry[] } {
  const sorted = [...entries].sort(
    (first, second) => semesterKey(second.semester ?? '') - semesterKey(first.semester ?? ''),
  );
  const currentSemester = sorted[0]?.semester;
  return {
    current: sorted.filter((course) => course.semester === currentSemester),
    past: sorted.filter((course) => course.semester !== currentSemester),
  };
}

/** A `details` bullet is plain text unless it embeds a markdown link ("Reviewer
    for [ACM TOSEM](https://…)"). Only that construct is parsed; a bullet may
    carry more than one. */
export type DetailPart = { text: string; url?: string };
export function parseDetail(detail: string): DetailPart[] {
  const parts: DetailPart[] = [];
  const link = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = link.exec(detail))) {
    if (match.index > last) parts.push({ text: detail.slice(last, match.index) });
    parts.push({ text: match[1], url: match[2] });
    last = match.index + match[0].length;
  }
  if (last < detail.length) parts.push({ text: detail.slice(last) });
  return parts;
}
