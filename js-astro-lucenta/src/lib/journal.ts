import { getCollection, type CollectionEntry } from "astro:content";
import { journalCategories, type JournalCategory } from "@/config/journal";
import type { Person } from "@/lib/people";

export type Entry = CollectionEntry<"journal">;

export const entryHref = (entry: Entry) => `/journal/${entry.id}/`;
export const journalCategoryHref = (category: JournalCategory) => `/journal/category/${category}/`;
export const journalCategoryLabel = (category: JournalCategory) =>
  journalCategories[category].label;

/** Published entries, newest first. Drafts never leave the dev server. */
export async function getJournal() {
  const entries = await getCollection("journal", ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** The people on an entry's byline, in frontmatter order. */
export const authorsOf = (entry: Entry, people: Map<string, Person>) =>
  entry.data.authors
    .map((ref) => people.get(ref.id))
    .filter((person): person is Person => person !== undefined);

/** Same category first, then the newest of the rest. */
export const relatedEntries = (entry: Entry, entries: Entry[], count = 3) => {
  const others = entries.filter((other) => other.id !== entry.id);
  const same = others.filter((other) => other.data.category === entry.data.category);
  const rest = others.filter((other) => other.data.category !== entry.data.category);
  return [...same, ...rest].slice(0, count);
};

/** Words per minute, rounded up, never below one. */
export const readingTime = (body = "") =>
  Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220));
