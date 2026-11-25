import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'work'>;

export const workPageSize = 6;

export const projectHref = (project: Project) => `/work/${project.id}/`;

/** Published case studies, in `order`, then newest first. */
export async function getProjects() {
  const projects = await getCollection('work', ({ data }) => !data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export const workPageHref = (page: number) => (page <= 1 ? '/work/' : `/work/page/${page}/`);
