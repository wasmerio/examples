#!/usr/bin/env bun
/**
 * Build src/config.json from src/data.yml + src/systems.yml + GitHub project metadata.
 *
 * - data.yml and systems.yml are the sources of truth (manual config).
 * - Each project URL is fetched from GitHub; existing entries are refreshed,
 *   missing ones are appended, entries no longer in the queue are dropped.
 * - GitHub responses are cached in `.cache/sync.json` with a TTL (default 1h).
 * - If neither input YAML has changed since the last sync, sync is skipped.
 * - Set GH_TOKEN (or GITHUB_TOKEN) to raise the API rate limit from 60/h to 5000/h.
 *
 * Use:
 *   bun run scripts/sync.ts
 *   SYNC_TTL=0 bun run scripts/sync.ts   # always refetch (ignore cache)
 *   SYNC_FORCE=1 bun run scripts/sync.ts  # always run (ignore skip check)
 */
import {
	existsSync,
	mkdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load as parseYaml } from "js-yaml";
import {
	buildProjectFromUrl,
	fetchRepo,
	type GHRepo,
	type Project,
	parseRepoUrl,
} from "./lib/project.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONFIG_PATH = resolve(ROOT, "src/config.json");
const DATA_PATH = resolve(ROOT, "src/data.yml");
const SYSTEMS_PATH = resolve(ROOT, "src/systems.yml");
const CACHE_PATH = resolve(ROOT, ".cache/sync.json");

const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

interface Data {
	site: {
		title: string;
		description: string;
		url: string;
		author: string;
		handle_suffix?: string;
		image: string;
		image_width: number;
		image_height: number;
		theme_color: string;
		job_title: string;
		social: Record<string, string>;
		twitter: string;
		locale: string;
		type: string;
		footer?: {
			status: string;
			errors: number;
			warnings: number;
			uptime: string;
		};
	};
	current: string;
	booted_at: string;
	host: {
		name: string;
		cpu: string;
		gpu: string;
		memory: string;
		resolution: string;
	};
	about: {
		command: string;
		status: Record<string, unknown>;
		bio: { icon: string; text: string }[];
		paths: { name: string; current?: boolean }[];
	};
	uses: {
		command: string;
		cpu: Record<string, unknown>;
		memory: Record<string, unknown>;
		hardware: Record<string, unknown>;
		peripherals: Record<string, unknown>;
	};
	contact: {
		command: string;
		email: string;
		inbox: { from: string; date: string; href: string }[];
		hints: Record<string, unknown>[];
	};
	projects_ui: {
		command: string;
		root: string;
	};
	projects: string[];
}

interface CacheEntry {
	fetched_at: number;
	data: GHRepo;
}

interface Cache {
	entries: Record<string, CacheEntry>;
}

function readData(): Data {
	const raw = readFileSync(DATA_PATH, "utf-8");
	const parsed = parseYaml(raw) as Data;
	if (!parsed.projects || !Array.isArray(parsed.projects)) {
		console.error("✗ data.yml must have a `projects` array");
		process.exit(1);
	}
	return parsed;
}

function readSystems(): Record<string, unknown>[] {
	const raw = readFileSync(SYSTEMS_PATH, "utf-8");
	const parsed = parseYaml(raw) as Record<string, unknown>[];
	if (!Array.isArray(parsed)) {
		console.error("✗ systems.yml must be an array");
		process.exit(1);
	}
	return parsed;
}

function readCache(): Cache {
	try {
		return JSON.parse(readFileSync(CACHE_PATH, "utf-8")) as Cache;
	} catch {
		return { entries: {} };
	}
}

function writeCache(cache: Cache): void {
	mkdirSync(dirname(CACHE_PATH), { recursive: true });
	writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, "\t")}\n`);
}

function mtimeMs(path: string): number {
	return existsSync(path) ? statSync(path).mtimeMs : 0;
}

async function fetchRepoCached(
	cache: Cache,
	url: string,
	owner: string,
	repo: string,
	ttlMs: number,
): Promise<GHRepo | null> {
	const cached = cache.entries[url];
	if (cached && ttlMs > 0 && Date.now() - cached.fetched_at < ttlMs) {
		return cached.data;
	}
	const fresh = await fetchRepo(owner, repo);
	if (fresh) {
		cache.entries[url] = { fetched_at: Date.now(), data: fresh };
	}
	return fresh;
}

async function reconcileProjects(
	queueUrls: string[],
	ttlMs: number,
): Promise<{
	projects: Project[];
	added: number;
	refreshed: number;
	skipped: number;
	removed: number;
	cache: Cache;
}> {
	const cache = readCache();
	let existing: Project[] = [];
	if (existsSync(CONFIG_PATH)) {
		try {
			existing =
				(JSON.parse(readFileSync(CONFIG_PATH, "utf-8")).sections?.projects
					?.projects as Project[] | undefined) ?? [];
		} catch {
			existing = [];
		}
	}
	const byUrl = new Map(existing.map((p) => [p.url, p] as const));

	const next: Project[] = [];
	let added = 0;
	let refreshed = 0;
	let skipped = 0;

	for (const url of queueUrls) {
		const prev = byUrl.get(url);
		const parts = parseRepoUrl(url);
		if (!parts) {
			console.error(`✗ invalid URL, skipped: ${url}`);
			skipped++;
			if (prev) next.push(prev);
			continue;
		}
		const repo = await fetchRepoCached(
			cache,
			url,
			parts.owner,
			parts.repo,
			ttlMs,
		);
		if (!repo) {
			console.error(`✗ fetch failed, skipped: ${url}`);
			skipped++;
			if (prev) next.push(prev);
			continue;
		}
		const fresh = buildProjectFromUrl(repo, url);
		if (prev) {
			Object.assign(prev, fresh);
			next.push(prev);
			refreshed++;
		} else {
			next.push(fresh);
			added++;
		}
		await new Promise((r) => setTimeout(r, 200));
	}

	const removed = Math.max(0, existing.length - next.length);
	return { projects: next, added, refreshed, skipped, removed, cache };
}

async function main() {
	if (
		!process.env.SYNC_FORCE &&
		existsSync(CONFIG_PATH) &&
		mtimeMs(DATA_PATH) <= mtimeMs(CONFIG_PATH) &&
		mtimeMs(SYSTEMS_PATH) <= mtimeMs(CONFIG_PATH)
	) {
		console.log("input YAMLs unchanged, skipping sync");
		return;
	}

	const data = readData();
	const systems = readSystems();

	const ttlMs =
		process.env.SYNC_TTL !== undefined
			? Number(process.env.SYNC_TTL)
			: DEFAULT_TTL_MS;
	const { projects, added, refreshed, skipped, removed, cache } =
		await reconcileProjects(data.projects, ttlMs);

	const config = {
		site: data.site,
		current: {
			slug: data.current,
			booted_at: data.booted_at,
			host: data.host.name,
			cpu: data.host.cpu,
			gpu: data.host.gpu,
			memory: data.host.memory,
			resolution: data.host.resolution,
		},
		systems,
		sections: {
			about: {
				command: data.about.command,
				status: data.about.status,
				bio: data.about.bio,
				paths: data.about.paths,
			},
			projects: {
				command: data.projects_ui.command,
				root: data.projects_ui.root,
				projects,
			},
			uses: data.uses,
			contact: data.contact,
		},
	};

	mkdirSync(dirname(CONFIG_PATH), { recursive: true });
	writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, "\t")}\n`);
	writeCache(cache);

	console.log(
		`\n✓ ${added} added, ${refreshed} refreshed, ${removed} removed, ${skipped} skipped (cache TTL ${ttlMs}ms)`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
