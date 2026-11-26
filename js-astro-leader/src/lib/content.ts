/*
  content.ts -- every collection query, date and path the pages share.

  The draft filter lives here and nowhere else. A page that calls getCollection
  directly is the page that will one day ship a draft, so pages call getWork()
  and getNotes() instead.
*/
import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, site, work as shelf } from '../config';

export type WorkEntry = CollectionEntry<'work'>;
export type NoteEntry = CollectionEntry<'notes'>;
export type Category = (typeof categories)[number];

/* Shelf order: `order` first and ascending, then everything without one, newest first. */
function byShelf(a: WorkEntry, b: WorkEntry) {
  const x = a.data.order;
  const y = b.data.order;
  if (x !== undefined && y !== undefined) return x - y;
  if (x !== undefined) return -1;
  if (y !== undefined) return 1;
  return b.data.started.valueOf() - a.data.started.valueOf();
}

export const getWork = async (): Promise<WorkEntry[]> =>
  (
    await getCollection(
      'work',
      (e) => !e.data.draft && (shelf.showBuilding || e.data.status !== 'building'),
    )
  ).sort(byShelf);

export const getNotes = async (): Promise<NoteEntry[]> =>
  (await getCollection('notes', (e) => !e.data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

/* The schema enum is built from this same list, so an unknown slug cannot build. */
export const categoryOf = (slug: string): Category =>
  categories.find((c) => c.slug === slug) as Category;

export const workPath = (id: string) => `/work/${id}`;
export const notePath = (id: string) => `/notes/${id}`;
export const categoryPath = (slug: string) => `/category/${slug}`;

/*
  Dates. Row columns are set in mono and read as a column, so they stay ISO at
  every locale -- the widths have to match for the column to exist. toISOString
  is UTC, which is also what keeps a date-only pubDate from slipping a day west
  of Greenwich; the same reason pins timeZone on the prose formatter below.
*/
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const prose = new Map<string, Intl.DateTimeFormat>();
export const formatDate = (d: Date, locale: string = site.locale) =>
  (
    prose.get(locale) ??
    prose
      .set(locale, new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }))
      .get(locale)!
  ).format(d);

export const year = (d: Date) => String(d.getUTCFullYear());

// Chinese and Japanese are written without spaces: each character counts as a word and reads
// faster than one. Korean separates words with spaces and counts like English.
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;

/* 200 words a minute, rounded up, never zero. */
export const readingTime = (body = '') => {
  const cjk = body.match(CJK)?.length ?? 0;
  const words = body.replace(CJK, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200 + cjk / 400));
};

/*
  A note without a description still needs one for the list, the RSS item and
  the OG tag, so the body supplies it: first paragraph, markdown stripped,
  cut at a word. Not a markdown parser -- the sample bodies are prose, and a
  heading or a code fence at the top is the only shape worth skipping.
*/
export const excerpt = (body = '', max = 160) => {
  const first =
    body
      .replace(/^---[\s\S]*?---/, '')
      .replace(/```[\s\S]*?```/g, '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('>')) ?? '';
  const flat = first
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, flat.lastIndexOf(' ', max)).trimEnd()}…`;
};

/* Neighbours in an already-sorted list: notes read newest first, work in shelf order. */
export const neighbours = <T extends { id: string }>(list: T[], id: string) => {
  const i = list.findIndex((e) => e.id === id);
  return { prev: list[i - 1], next: list[i + 1] };
};
