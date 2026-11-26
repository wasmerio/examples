import { getCollection, type CollectionEntry } from 'astro:content';
import { countCjk, countWords, excerpt, readingMinutes } from './text';

export { isoDate } from './text';

export type Note = CollectionEntry<'notes'> & {
  words: number;
  minutes: number;
  /** The description, or the first paragraph shortened. */
  summary: string;
};

/** Every published note, newest first. The only place drafts are filtered out. */
export const getNotes = async (): Promise<Note[]> =>
  (await getCollection('notes', ({ data }) => !data.draft))
    .map((entry) => {
      const body = entry.body ?? '';
      const words = countWords(body);
      return {
        ...entry,
        words,
        minutes: readingMinutes(words, countCjk(body)),
        summary: entry.data.description ?? excerpt(body),
      };
    })
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

export const notePath = (note: { id: string }): string => `/notes/${note.id}`;
