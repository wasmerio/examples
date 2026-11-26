import { getCollection, type CollectionEntry } from "astro:content";

export type Person = CollectionEntry<"people">;

export async function getPeople() {
  const people = await getCollection("people");
  return people.sort(
    (a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name),
  );
}

export const peopleById = (people: Person[]) =>
  new Map(people.map((person) => [person.id, person]));
