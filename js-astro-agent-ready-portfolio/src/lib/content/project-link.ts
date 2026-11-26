import type { GithubProject } from "$lib/types/portfolio";

// A card with a `page` links to its project page; otherwise it opens `href` in a new tab.
export const projectLink = (project: GithubProject) =>
  project.page
    ? { href: `/projects/${project.page}` }
    : { href: project.href, target: "_blank", rel: "noopener noreferrer" };
