import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { personAnchor } from './paths.ts';

export type Member = {
  entry: CollectionEntry<'people'>;
  author: CollectionEntry<'authors'>;
};

/** Everyone on /people/, in the order they declare. */
export async function members(): Promise<Member[]> {
  const people = (await getCollection('people')).sort((a, b) => a.data.order - b.data.order);

  return Promise.all(
    people.map(async (entry) => {
      const author = await getEntry(entry.data.author);
      if (!author) {
        throw new Error(`people.yml: ${entry.id} references author ${entry.data.author.id}`);
      }
      return { entry, author };
    }),
  );
}

/** Surname → that person's anchor on /people/, built once per page. Matching is
    on the folded surname alone (the same fold as surnameKey() in authors.ts) —
    loose on purpose: one name spelled two ways beats two people sharing one. */
export async function peopleLinks(): Promise<Map<string, string>> {
  const fold = (s: string) =>
    s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/ß/g, 'ss')
      .toLowerCase();

  const map = new Map<string, string>();
  for (const { entry } of await members()) {
    for (const surname of entry.data.surnames) {
      map.set(fold(surname), personAnchor(entry.id));
    }
  }
  return map;
}
