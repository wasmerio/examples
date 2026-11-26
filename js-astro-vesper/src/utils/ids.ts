/**
 * Ids the layout and pages already use: the main landmark and the theme-core parts' ids (the "On this page" label
 * and the search input, PART_IDS). A heading with the same text gets "-2" (outline's `reserved`), so its link does
 * not jump to them. The page tasks add their own.
 *
 * Plain Node loads this file (the content tests), so keep it free of imports Node cannot load: only theme-core's
 * ./outline, which has none.
 */
import { PART_IDS } from "@astronomic/theme-core/outline";

/** The <main> landmark: the skip link's target. */
export const mainId = "main";

/** The home page's headings: the intro, the newest posts and the side cards. */
export const homeIds = { intro: "intro-heading", latest: "latest-heading", newsletter: "newsletter-heading", work: "work-heading", projects: "projects-heading" } as const;

/** The smaller pages' own headings: the other projects under a project, the about page's work history. */
export const pageIds = { moreProjects: "more-projects", work: "work-history" } as const;

export const reservedIds = [mainId, ...PART_IDS, ...Object.values(homeIds), ...Object.values(pageIds)];
