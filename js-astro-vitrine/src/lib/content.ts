// The one place that queries content. Pages import from here and never call
// getCollection() themselves: the draft filter and the catalogue numbering have
// to be the same everywhere, and a page that queries on its own will forget one
// of them sooner or later.
import { getCollection, type CollectionEntry } from 'astro:content';
import { catalogue } from '../config';

export type Group = CollectionEntry<'collections'>;
export type Plate = CollectionEntry<'objects'> & { number: string; group: Group };

const pad = (n: number) => String(n).padStart(2, '0');

/** Collections as the catalogue arranges them: `order` first, then title. */
export async function getGroups(): Promise<Group[]> {
  const groups = await getCollection('collections');
  return groups.sort(
    (a, b) =>
      (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER) ||
      a.data.title.localeCompare(b.data.title),
  );
}

/**
 * Every published object in catalogue order — by collection, then by year — each
 * carrying its number. An object without an `accession` of its own is numbered by
 * where it falls: collection 02, third entry, is `02-03`. Undated objects sort last
 * rather than to the front.
 */
export async function getPlates(): Promise<Plate[]> {
  const groups = await getGroups();
  const objects = await getCollection('objects', ({ data }) => !data.draft);
  return groups.flatMap((group, g) =>
    objects
      .filter((object) => object.data.collection.id === group.id)
      .sort(
        (a, b) =>
          (a.data.year ?? Number.MAX_SAFE_INTEGER) - (b.data.year ?? Number.MAX_SAFE_INTEGER) ||
          a.data.title.localeCompare(b.data.title),
      )
      .map((object, i) => ({
        ...object,
        group,
        number: object.data.accession ?? `${pad(g + 1)}-${pad(i + 1)}`,
      })),
  );
}

/** The plates for the home grid: whatever is `featured`, or the head of the catalogue when nothing is. */
export async function getFeaturedPlates(limit = catalogue.platesPerPage): Promise<Plate[]> {
  const plates = await getPlates();
  const featured = plates.filter((plate) => plate.data.featured);
  return (featured.length ? featured : plates).slice(0, limit);
}

/** Collections with how many published objects each one holds. */
export async function getGroupsWithCounts(): Promise<{ group: Group; count: number }[]> {
  const plates = await getPlates();
  return (await getGroups()).map((group) => ({
    group,
    count: plates.filter((plate) => plate.group.id === group.id).length,
  }));
}

export const platePath = (plate: { id: string }) => `/catalogue/${plate.id}`;
export const groupPath = (group: { id: string }) => `/collections/${group.id}`;

/** The wall label, in the order a museum prints it. */
export function cartellino(plate: Plate): string[] {
  return [
    plate.data.medium,
    plate.data.dateText,
    catalogue.showAccession ? plate.number : '',
  ].filter((part) => part.length > 0);
}

/**
 * What to look at after this object: the entries that follow it in its own
 * collection, wrapping round to the start, and then the rest of the catalogue
 * when the collection is too thin to fill the row.
 */
export async function getRelatedPlates(
  plate: Plate,
  limit = catalogue.relatedPlates,
): Promise<Plate[]> {
  const plates = await getPlates();
  const group = plates.filter((other) => other.group.id === plate.group.id);
  const at = group.findIndex((other) => other.id === plate.id);
  const neighbours = [...group.slice(at + 1), ...group.slice(0, at)];
  const elsewhere = plates.filter((other) => other.group.id !== plate.group.id);
  return [...neighbours, ...elsewhere].slice(0, limit);
}

/** The plates of one collection, in catalogue order. */
export async function getPlatesOf(group: { id: string }): Promise<Plate[]> {
  return (await getPlates()).filter((plate) => plate.group.id === group.id);
}
