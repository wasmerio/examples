import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export const getAllProjects = async (): Promise<
  CollectionEntry<"projects">[]
> => {
  const projects = await getCollection("projects");
  return projects.sort(
    (a, b) => b.data.startDate.getTime() - a.data.startDate.getTime(),
  );
};
