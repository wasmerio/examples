/**
 * What each home section shows. The pickers are plain functions of entries already in rule order
 * (src/content/rules.ts), so plain Node tests them (scripts/units/home.test.mjs); `loadHome` reads the content for the
 * page in one round of calls.
 *
 * Plain Node loads this file: type imports, and the setup reader (plain too).
 */
import type { CollagePhoto, Content, Job, Model, Post, Project, Settings } from "~/content";
import type { Config } from "./config";
import { collageState } from "./setup";

/** How many entries each section shows at most: the newest posts, the featured projects. */
export const HOME_LIMITS = { posts: 5, projects: 3 } as const;

export const pickPosts = <T>(posts: readonly T[]): T[] => posts.slice(0, HOME_LIMITS.posts);

/** The featured projects (in rule order), at most three; none while the Projects page is off. */
export const pickProjects = <T>(featured: readonly T[], on: boolean): T[] => (on ? featured.slice(0, HOME_LIMITS.projects) : []);

/**
 * The photos the band shows: all of them for 4, 5 or 6; none for any other count (collageState: a build stops on it,
 * and a production server, which checks nothing, shows no band).
 */
export const collageToShow = <T>(photos: readonly T[]): T[] => (collageState(photos) === "ok" ? [...photos] : []);

/** Which side cards show beside the newsletter: Work with a job or a CV, Projects while on and not empty. */
export function homeCards({ jobs, cvFile, projects, projectsOn }: { jobs: number; cvFile?: string; projects: number; projectsOn: boolean }) {
	return { work: jobs > 0 || !!cvFile, projects: projectsOn && projects > 0 };
}

export type HomeData = { posts: Post[]; total: number; collage: CollagePhoto[]; jobs: Job[]; projects: Project[] };

/** The entries the home page shows; the projects are read only while the Projects page is on. */
export async function loadHome(content: Content<Model, Settings>, config: Pick<Config, "pages">): Promise<HomeData> {
	const [posts, total, collage, jobs, projects] = await Promise.all([
		content.posts.list({ limit: HOME_LIMITS.posts }),
		content.posts.count(),
		content.collage.list(),
		content.jobs.list(),
		config.pages.projects ? content.projects.list({ featured: true }) : undefined,
	]);
	return {
		posts: pickPosts(posts.items),
		total,
		collage: collageToShow(collage.items),
		jobs: jobs.items,
		projects: pickProjects(projects?.items ?? [], config.pages.projects),
	};
}
