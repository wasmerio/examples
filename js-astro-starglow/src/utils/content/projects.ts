import { getCollection, type CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";
import { isVisible } from "./visibility";

type Project = CollectionEntry<"projects">;

export const STATUS_ORDER = {
  active: 0,
  maintained: 1,
  experiment: 2,
  archived: 3,
} as const;

/** Featured first, then active → maintained → experiment → archived, then title. */
export function sortProjects<
  T extends {
    data: {
      featured: boolean;
      status: keyof typeof STATUS_ORDER;
      title: string;
    };
  },
>(projects: T[]): T[] {
  return [...projects].sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      STATUS_ORDER[a.data.status] - STATUS_ORDER[b.data.status] ||
      a.data.title.localeCompare(b.data.title)
  );
}

export function getProjectUrl(
  id: string,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `projects/${id}`);
}

export async function getVisibleProjects(): Promise<Project[]> {
  return (await getCollection("projects")).filter(isVisible);
}

export const isLabProject = (project: Project): boolean =>
  project.data.status === "experiment";
