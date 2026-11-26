/**
 * The buyer's look choices, read from src/theme.config.ts: the one reader of that file. The layout and pages get the
 * choices only from `getConfig(settings)`, per request (never at module load), so a later CMS setting
 * (`Settings.config`) reaches every page.
 *
 * Look, accent, collage and thumbnails are CSS only: the layout sets `data-look`, `data-accent`, `data-collage` and
 * `data-thumbs` on <html>, and every look and accent file ships in the CSS under its attribute. The article list,
 * the Now line, the page switches and the Built with link choose markup when a page renders.
 *
 * Plain Node loads this file (the unit tests), so it imports nothing Node cannot load.
 */
import * as file from "../theme.config.ts";

export const LOOKS = ["clear", "field", "trail"] as const;
/** The ids in src/styles/accents/accents.json (the unit tests check they agree). */
export const ACCENTS = ["glacier", "moss", "alpenglow", "dusk"] as const;
export const COLLAGES = ["mosaic", "row", "sheet"] as const;
/** How the article lists (/articles, a category, a tag) show their posts: a two-column card grid, or rows. */
export const ARTICLE_LISTS = ["grid", "rows"] as const;
/** The optional pages a buyer can turn off. */
export const OPTIONAL_PAGES = ["projects", "speaking", "uses", "now"] as const;
/** The on and off choices. */
export const SWITCHES = ["thumbnails", "nowLine", "builtWith"] as const;

export type LookId = (typeof LOOKS)[number];
export type Accent = (typeof ACCENTS)[number];
export type Collage = (typeof COLLAGES)[number];
export type ArticleList = (typeof ARTICLE_LISTS)[number];
export type OptionalPage = (typeof OPTIONAL_PAGES)[number];

export type Config = {
	look: LookId;
	accent: Accent;
	collage: Collage;
	/** The article lists' layout: "grid" (cards, two columns) or "rows" (the home page's rows). */
	articleList: ArticleList;
	/** The square photo beside each post in a list. */
	thumbnails: boolean;
	/** The Now status line under the intro. */
	nowLine: boolean;
	/** One switch per optional page; off leaves the page out everywhere. */
	pages: Record<OptionalPage, boolean>;
	/** The footer's "Built with Astronomic" link. */
	builtWith: boolean;
};

/** A config group from settings (Settings.config): any field may be left out; each set field wins over the file. */
export type ConfigSettings = Partial<Omit<Config, "pages">> & { pages?: Partial<Config["pages"]> };

const IDS = { look: LOOKS, accent: ACCENTS, collage: COLLAGES, articleList: ARTICLE_LISTS } as const;
type IdKey = keyof typeof IDS;
type SwitchKey = (typeof SWITCHES)[number];
const ID_KEYS = Object.keys(IDS) as IdKey[];
const ALL_KEYS = [...ID_KEYS, ...SWITCHES, "pages"];

const empty = (value: unknown) => value === undefined || value === null || value === "";
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);

/**
 * Lays `extra` over `base`. Each empty field (undefined, null, "") keeps the base value; each unknown key or id, or a
 * switch that is not true or false, keeps it too and calls `bad` with the reason.
 */
function merge(base: Config, extra: unknown, where: string, bad: (reason: string) => void): Config {
	if (empty(extra)) return base;
	if (!isObject(extra)) {
		bad(`${where} is not an object.`);
		return base;
	}
	const config: Config = { ...base, pages: { ...base.pages } };
	for (const [key, value] of Object.entries(extra)) {
		if (empty(value)) continue;
		if (key === "pages") {
			if (!isObject(value)) {
				bad(`${where}: pages is not an object.`);
				continue;
			}
			for (const [name, on] of Object.entries(value)) {
				if (empty(on)) continue;
				if (!(OPTIONAL_PAGES as readonly string[]).includes(name)) bad(`${where}: unknown page "pages.${name}". Use ${OPTIONAL_PAGES.join(", ")}.`);
				else if (typeof on !== "boolean") bad(`${where}: pages.${name} is ${JSON.stringify(on)}, not true or false; keeping ${config.pages[name as OptionalPage]}.`);
				else config.pages[name as OptionalPage] = on;
			}
			continue;
		}
		if ((SWITCHES as readonly string[]).includes(key)) {
			if (typeof value !== "boolean") bad(`${where}: ${key} is ${JSON.stringify(value)}, not true or false; keeping ${config[key as SwitchKey]}.`);
			else config[key as SwitchKey] = value;
			continue;
		}
		if (!(ID_KEYS as string[]).includes(key)) {
			bad(`${where}: unknown setting "${key}". Use ${ALL_KEYS.join(", ")}.`);
			continue;
		}
		const ids: readonly string[] = IDS[key as IdKey];
		if (typeof value !== "string" || !ids.includes(value)) bad(`${where}: unknown ${key} "${String(value)}"; keeping "${config[key as IdKey]}". Use one of: ${ids.join(", ")}.`);
		else (config as Record<IdKey, string>)[key as IdKey] = value;
	}
	return config;
}

/** Vite replaces `import.meta.env.VESPER_CONFIG` in a build (astro.config.mjs); plain Node reads the environment. */
const testOverride = () => (typeof import.meta.env === "object" ? import.meta.env.VESPER_CONFIG : globalThis.process?.env?.VESPER_CONFIG);

/** One line for the build's output and the dev server's log while VESPER_CONFIG is set, so it is never baked in silently. */
export function testConfigNotice(raw: string | undefined = testOverride()): string | undefined {
	return raw ? `VESPER_CONFIG is set (test only): ${raw}. Unset it before you build the real site.` : undefined;
}

/** The theme's own defaults: what a production server falls back to for a bad value in the config file. */
export const DEFAULT_CONFIG: Config = {
	look: "clear",
	accent: "glacier",
	collage: "mosaic",
	articleList: "grid",
	thumbnails: true,
	nowLine: true,
	pages: { projects: true, speaking: true, uses: true, now: true },
	builtWith: false,
};

/** The config file's values (src/theme.config.ts), or a stand-in for one in the unit tests. */
export type ConfigFile = Record<IdKey | SwitchKey | "pages", unknown>;

/**
 * Every problem in the config file: an unknown look, accent, collage or article list, a switch that is not true or false, or a
 * page switch that is missing, unknown or not true or false. astro.config.mjs runs it when the config loads, so
 * `pnpm check`, `pnpm dev` and every build (the EmDash server build too, which renders no page while it builds) stop
 * on a typo.
 */
export function checkConfigFile(values: ConfigFile = file): string[] {
	const problems: string[] = [];
	const where = "src/theme.config.ts";
	for (const key of ID_KEYS) {
		const ids: readonly string[] = IDS[key];
		const value = values[key];
		if (typeof value !== "string" || !ids.includes(value)) problems.push(`${where}: unknown ${key} ${JSON.stringify(value)}. Use one of: ${ids.join(", ")}.`);
	}
	for (const key of SWITCHES) if (typeof values[key] !== "boolean") problems.push(`${where}: ${key} must be true or false.`);
	if (!isObject(values.pages)) problems.push(`${where}: pages must be an object with ${OPTIONAL_PAGES.join(", ")}.`);
	else {
		for (const key of OPTIONAL_PAGES) if (typeof values.pages[key] !== "boolean") problems.push(`${where}: pages.${key} must be true or false.`);
		for (const key of Object.keys(values.pages)) if (!(OPTIONAL_PAGES as readonly string[]).includes(key)) problems.push(`${where}: unknown page "pages.${key}". Use ${OPTIONAL_PAGES.join(", ")}.`);
	}
	return problems;
}

/** "static": a static build (and plain Node); "dev": `astro dev`; "production": a server build's server. */
type ConfigMode = "static" | "dev" | "production";
const configMode = (): ConfigMode => {
	if (typeof import.meta.env !== "object") return "static";
	if (import.meta.env.DEV) return "dev";
	return import.meta.env.CONTENT_OUTPUT === "static" ? "static" : "production";
};

/** Production problems already logged, so a server logs each once, not on every request. */
const logged = new Set<string>();

/**
 * The config file's values, each checked: a good value is kept; a bad one stops a build and `astro dev` (throws), and
 * on a production server takes the theme's default (logged once), so a live page never fails on the config.
 */
function fileConfig(values: ConfigFile, mode: ConfigMode, log: (text: string) => void): Config {
	const problems = checkConfigFile(values);
	if (problems.length && mode !== "production") throw new Error(`Config: ${problems.join(" ")}`);
	const known = (key: IdKey) => {
		const value = values[key];
		return typeof value === "string" && (IDS[key] as readonly string[]).includes(value) ? value : DEFAULT_CONFIG[key];
	};
	const on = (key: SwitchKey) => (typeof values[key] === "boolean" ? (values[key] as boolean) : DEFAULT_CONFIG[key]);
	const pages = isObject(values.pages) ? values.pages : {};
	const config = {
		look: known("look"),
		accent: known("accent"),
		collage: known("collage"),
		articleList: known("articleList"),
		thumbnails: on("thumbnails"),
		nowLine: on("nowLine"),
		builtWith: on("builtWith"),
		pages: Object.fromEntries(OPTIONAL_PAGES.map((key) => [key, typeof pages[key] === "boolean" ? pages[key] : DEFAULT_CONFIG.pages[key]])),
	} as Config;
	for (const problem of problems) {
		if (logged.has(problem)) continue;
		logged.add(problem);
		log(`Config: ${problem} Using the default.`);
	}
	return config;
}

/**
 * The config for a request: src/theme.config.ts, then `settings.config` over it (each set field wins; an empty one
 * keeps the file value; an unknown key or id keeps the file value and returns a warning, never an error), then
 * VESPER_CONFIG (test only: JSON such as {"look":"trail","pages":{"now":false}} for one build, so the browser checks
 * and shots can build each config; an unknown key or id there stops the build and `astro dev`). An unknown id in the
 * config file itself stops the build and `astro dev` too (astro.config.mjs checks it first, with checkConfigFile). A
 * production server never throws here: a bad file value or VESPER_CONFIG value is logged once and the default or the
 * file value is kept. Returns the config and the warnings (the setup check adds them to the build's).
 *
 * `options` is for the unit tests: another config file, the mode, and where production problems are logged.
 */
export function getConfig(
	settings?: { config?: ConfigSettings | null } | null,
	{ values = file, mode = configMode(), log = console.error }: { values?: ConfigFile; mode?: ConfigMode; log?: (text: string) => void } = {},
): { config: Config; warnings: string[] } {
	const base = fileConfig(values, mode, log);
	const fail = (reason: string) => {
		if (mode !== "production") throw new Error(`Config: ${reason}`);
		if (logged.has(reason)) return;
		logged.add(reason);
		log(`Config: ${reason}`);
	};

	const warnings: string[] = [];
	let config = merge(base, settings?.config, "settings.config", (reason) => warnings.push(`Config: ${reason}`));

	const raw = testOverride();
	if (raw) {
		let extra: unknown;
		try {
			extra = JSON.parse(raw);
		} catch {
			fail(`VESPER_CONFIG is not JSON: ${raw}`);
			return { config, warnings };
		}
		if (!isObject(extra)) fail(`VESPER_CONFIG is not a JSON object: ${raw}`);
		else config = merge(config, extra, "VESPER_CONFIG", fail);
	}
	return { config, warnings };
}

/** True when an optional page is on in `config` (a path that is not an optional page is always on). */
export const pageOn = (config: Config, page: string) => !(OPTIONAL_PAGES as readonly string[]).includes(page) || config.pages[page as OptionalPage];
