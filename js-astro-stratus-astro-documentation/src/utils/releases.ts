import { getCollection } from "astro:content";

/** Every changelog entry, newest first: by date, then by version on a tie. */
export async function getReleases() {
  const collection = await getCollection("changelog");

  return collection.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() ||
      b.data.version.localeCompare(a.data.version, undefined, { numeric: true })
  );
}
