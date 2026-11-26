import { AUTHOR_LIMIT, SELF } from '../consts.ts';

export type Person = { first: string; last: string };

/** Strip diacritics, ß -> ss: bibliographies spell one person "Fuchß" and
    "Fuchss", "Muñoz" and "Munoz". */
const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ß/g, 'ss')
    .toLowerCase();

const SELF_SURNAMES = SELF.surnames.map(fold);

/** The key PubEntry reads the people map with; peopleLinks() in people.ts
    builds it with a local copy of the same fold, so keep the two identical. */
export const surnameKey = fold;

export const isSelf = (p: Person) => SELF_SURNAMES.includes(fold(p.last));

/** "Edsger W. Dijkstra" */
export const fullName = (p: Person) => [p.first, p.last].filter(Boolean).join(' ');

/** isSelf() for a display name: the surname is the last word. "van der Aalst"
    reduces to "Aalst"; when that bites, list the spelling in SELF.surnames. */
export const isSelfName = (name: string) =>
  isSelf({ first: '', last: name.split(/\s+/).at(-1) ?? name });

/** Truncated author list. At exactly limit + 1 all are shown: "and 1 more
    author" takes more room than the name. `null` lists everyone. */
export function truncateAuthors(people: Person[], limit: number | null = AUTHOR_LIMIT) {
  if (limit === null || people.length <= limit + 1) return { shown: people, hidden: 0 };
  return { shown: people.slice(0, limit), hidden: people.length - limit };
}
