/**
 * Runs the setup check (src/utils/setup.ts) for src/middleware.ts: once per static build (the first page to render runs
 * it, the rest wait for the same result), on every request in `astro dev` (so a settings change in the CMS shows up),
 * and never on a production server (EmDash settings are checked in dev only; a live page never fails on them).
 *
 * Before it checks, it loads every part of the content that holds links (the menus, the projects, the talks, the uses,
 * the jobs and the collage; the settings are loaded already), so the sources' link check (src/content/links.ts) has
 * seen each value and every refused one is reported, and the posts, for their SEO canonicals. Every collection is also
 * scanned for markers. The Markdown source leaves drafts out of a build and lists them in dev.
 *
 * `publicFile` looks a site path up in the project's public/ folder: a build and `astro dev` run from the project
 * root, in Node.
 */
import { existsSync, statSync } from "node:fs";
import type { MenuItem } from "@astronomic/content";
import { join, normalize, sep } from "node:path";
import { linkProblems } from "../content/links";
import type { CollagePhoto, Job, Page, Post, Project, Settings, Talk, UsesItem } from "../content/model";
import { testConfigNotice } from "./config";
import { checkSetup, hostedDemo, identityOf, setupMode as mode, setupProblems, siteIsLive, testSettingsNotice } from "./setup";

/** The theme's social icon ids (src/icons/*.svg, as Icon.astro reads them). */
const ICONS = Object.keys(import.meta.glob("../icons/*.svg", { query: "?url", import: "default" })).map((path) => path.replace(/^\.\.\/icons\/|\.svg$/g, ""));

function publicFile(path: string) {
	const dir = join(process.cwd(), "public");
	const file = normalize(join(dir, path.split(/[?#]/)[0]));
	return file.startsWith(dir + sep) && existsSync(file) && statSync(file).isFile();
}

let once: Promise<void> | undefined;
/** True once a static build's check has passed: later pages need not read the settings again. */
let passed = false;
let noticed = false;
/** The last warning block printed in dev, so a page load does not repeat it. */
let lastWarning = "";

type List<T = unknown> = { list(): Promise<{ items: T[] }> };
/** What the check reads: every collection for its markers, the collage for its count, and the parts that hold links. */
type CheckedContent = {
	pages: List<Page>;
	collage: List<CollagePhoto>;
	posts: List<Post>;
	projects: List<Project>;
	talks: List<Talk>;
	uses: List<UsesItem>;
	jobs: List<Job>;
	menu(name: string): Promise<MenuItem[]>;
};
/** The menus the layout reads (Base.astro). */
const MENUS = ["primary", "footer"];

async function run(content: CheckedContent, settings: Settings, origin: string) {
	// One line each for the test-only overrides (VESPER_SETTINGS, VESPER_CONFIG), so neither is baked in silently.
	const notices = [testSettingsNotice(), testConfigNotice()].filter(Boolean);
	if (notices.length && !noticed) {
		noticed = true;
		console.warn(`\n${notices.join("\n")}\n`);
	}
	const [{ items: pages }, { items: photos }, { items: posts }, { items: projects }, { items: talks }, { items: uses }, { items: jobs }, ...menuLists] = await Promise.all([
		content.pages.list(),
		content.collage.list(),
		content.posts.list(),
		content.projects.list(),
		content.talks.list(),
		content.uses.list(),
		content.jobs.list(),
		...MENUS.map((name) => content.menu(name)),
	]);
	const menus = Object.fromEntries(MENUS.map((name, i) => [name, menuLists[i] as MenuItem[]]));
	const entries = Object.entries({ posts, projects, pages }).flatMap(([name, items]) => items.map((e) => ({ at: `${name}/${e.slug}`, seo: e.seo })));
	const contentLinks = [
		...projects.map((p) => ({ at: `projects/${p.slug}.link`, href: p.link })),
		...talks.flatMap((t) => [
			{ at: `talks/${t.slug}.video`, href: t.video },
			{ at: `talks/${t.slug}.slides`, href: t.slides },
		]),
		...uses.map((u) => ({ at: `uses/${u.slug}.link`, href: u.link })),
		...jobs.map((j) => ({ at: `jobs/${j.slug}.link`, href: j.link })),
		...photos.map((c) => ({ at: `collage/${c.slug}.link`, href: c.link })),
	];
	checkSetup(setupProblems(settings, { photos, pages, posts, projects, talks, uses, jobs, publicFile, links: linkProblems(), icons: ICONS, menus, entries, contentLinks }), {
		sampleContent: settings.sampleContent,
		live: siteIsLive(origin),
		identity: identityOf(settings),
		demo: hostedDemo(),
		origin,
		mode,
		warn: (text) => {
			if (mode === "dev" && text === lastWarning) return;
			lastWarning = text;
			console.warn(`\n${text}\n`);
		},
	});
}

/** `origin` is the site's public origin (siteOrigin): a placeholder address at a real address is not allowed (checkSetup). */
export function runSetupCheck(content: CheckedContent, settings: Settings, origin: string): Promise<void> {
	if (mode === "production") return Promise.resolve();
	if (mode === "dev") return run(content, settings, origin);
	return (once ??= run(content, settings, origin).then(() => {
		passed = true;
	}));
}

/** Whether a request still needs the check: always in dev, in a static build until it has passed, never on a production server. */
export const setupCheckNeeded = () => mode === "dev" || (mode === "static" && !passed);
