import { getCollection, type CollectionEntry } from "astro:content";
import { disciplineKeys, disciplines, type Discipline } from "@/config/work";

export type Work = CollectionEntry<"work">;

export const workHref = (work: Work) => `/work/${work.id}/`;
export const disciplineLabel = (key: Discipline) => disciplines[key].label;

/** Published projects, newest first. Drafts never leave the dev server. */
export async function getWork() {
  const work = await getCollection("work", ({ data }) => import.meta.env.DEV || !data.draft);
  return work.sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
}

export const featuredWork = (work: Work[]) =>
  work.filter((item) => item.data.featured).sort((a, b) => a.data.order - b.data.order);

/** Disciplines that have at least one project, in config order, with their counts. */
export const disciplineCounts = (work: Work[]) =>
  disciplineKeys
    .map((key) => ({
      key,
      count: work.filter((item) => item.data.disciplines.includes(key)).length,
    }))
    .filter((row) => row.count > 0);

/** The next project in order, wrapping round, for the link at the foot of a case study. */
export const nextWork = (work: Work[], current: Work) => {
  const index = work.findIndex((item) => item.id === current.id);
  return work[(index + 1) % work.length];
};

/** A unique name per project, shared by its card image and its case study cover. */
export const transitionName = (work: Work) => `work-${work.id}`;
