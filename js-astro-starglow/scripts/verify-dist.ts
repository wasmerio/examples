// Assertions over the production build in dist/.
//
// Run: ./dev.sh pnpm verify          (node scripts/verify-dist.ts [distDir])
//
// Output: `verify-dist: all {n} checks passed.` and exit 0, or one
// `verify-dist: FAIL {check}: {file}: {message}` line per problem, then
// `verify-dist: {k} of {n} checks failed.` and exit 1. A missing dist or
// origin prints `verify-dist: FAIL setup: ...`.
//
// Zero dependencies: `node:` builtins only and erasable TypeScript only, so
// Node >= 22.18 strips the types natively. HTML is checked with regular
// expressions over Astro's deterministic output, not a parser.
//
// The origin comes from SITE_URL when set, else from the `Sitemap:` line of
// the build's own robots.txt. No host is written in this file.
//
// The demo-marker rule assumes no published content contains that literal.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { gunzipSync } from "node:zlib";
import { findDraftOnlyAssets } from "./draft-assets.ts";

if (existsSync(".env")) process.loadEnvFile(".env");

const DIST = process.argv[2] ?? "dist";
const DEMO_MARKER = "[DEMO]";
const CONTENT_ROUTE_PATTERNS = [
  /^\/(blog|notes)\/\d{4}\/[a-z0-9-]+\/$/,
  /^\/projects\/[a-z0-9-]+\/$/,
];
const PROJECT_ROUTE = /^\/projects\/[a-z0-9-]+\/$/;
const SHARE_INTENT_PATTERN =
  /wa\.me\/|facebook\.com\/sharer|x\.com\/intent|twitter\.com\/intent|t\.me\/share|pinterest\.com\/pin|linkedin\.com\/shareArticle|reddit\.com\/submit/gi;
const PLACEHOLDER_MARKERS = ["[PLACEHOLDER]", "[[TODO", DEMO_MARKER];
const POST_ROUTE = /^\/blog\/\d{4}\/[^/]+\/$/;
const NOTE_ROUTE = /^\/notes\/\d{4}\/[^/]+\/$/;
const ONE_DAY_MS = 86_400_000;
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const PNG_SIGNATURE = "89504e470d0a1a0a";
/** Routes that must exist in every build, as dist files. */
const STATIC_ROUTES = [
  "/",
  "/blog/",
  "/notes/",
  "/projects/",
  "/lab/",
  "/tags/",
  "/search/",
  "/about/",
  "/contact/",
  "/rss.xml",
  "/404.html",
  "/robots.txt",
  "/sitemap-index.xml",
];
/** Tailwind utilities that leave the type scale of site-theme.css. */
const TYPE_SCALE_FILES = /\.(astro|ts|tsx|js|md|mdx|css)$/;
const OUT_OF_SCALE =
  /(?<![\w-])(?:(?:[a-z0-9-]+|\[[^\]\s]*\]):)*(text-[4-9]xl|text-\[[0-9.][^\]\s]*\]|font-(?:thin|extralight|black|\[[^\]\s]*\]))(?![\w-])/g;
/** The font sizes (px) and weights of the type scale in site-theme.css. */
const SCALE_SIZES = new Set([10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32]);
const SCALE_WEIGHTS = new Set([400, 600]);
/** CSS in stylesheets and Astro `<style>` blocks. */
const STYLE_FILES = /\.(css|astro)$/;
/** `font-size`, `font-weight`, the `font` shorthand and the `--t-*` / `--text-*` tokens. */
const FONT_DECLARATION =
  /(?<![\w-])(font-size|font-weight|font|--t-[\w-]+|--text-(?:xs|sm|base|lg|\d?xl))\s*:\s*([^;{}]+)/g;

const failures: string[] = [];
let currentCheck = "setup";
let checkRuns = 0;
let failedRuns = 0;

/** Records one problem. `file` is relative to dist, or "" for a global one. */
function fail(file: string, message: string): void {
  failures.push(`${currentCheck}: ${file ? `${file}: ` : ""}${message}`);
}

/** Runs one named check over one target, and counts it and whether it failed. */
function run(name: string, check: () => void): void {
  currentCheck = name;
  checkRuns += 1;
  const before = failures.length;
  check();
  if (failures.length > before) failedRuns += 1;
}

/** A precondition that stops the run before any check can start. */
function stopSetup(message: string): never {
  console.error(`verify-dist: FAIL setup: ${message}`);
  return process.exit(1);
}

// --- Files and routes -------------------------------------------------------

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function rel(file: string): string {
  return relative(DIST, file).split(sep).join("/");
}

/** URL path of a built html file: dist/blog/2026/x/index.html -> /blog/2026/x/ */
function routeOf(file: string): string {
  const path = rel(file);
  if (path === "index.html") return "/";
  if (path.endsWith("/index.html"))
    return `/${path.slice(0, -"index.html".length)}`;
  return `/${path}`;
}

function read(file: string): string {
  return readFileSync(file, "utf8");
}

// --- Source entries ---------------------------------------------------------

type Entry = {
  route: string;
  draft: boolean;
  future: boolean;
  /** A post whose frontmatter sets `ogImage` brings its own preview image. */
  customOg: boolean;
};

/** Pages whose frontmatter sets `canonicalUrl`, by route. */
const CANONICAL_OVERRIDES = new Map<string, string>();
/** Pages whose frontmatter sets `ogImage`, by route: the author's own preview image. */
const OG_OVERRIDES = new Map<string, string>();

function frontmatter(file: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(read(file));
  return match?.[1] ?? "";
}

/** A scalar frontmatter value: quoted, or bare up to a ` #` comment. */
function frontmatterValue(fm: string, key: string): string | undefined {
  const line = new RegExp(`^${key}:[ \\t]*(.*)$`, "m").exec(fm)?.[1]?.trim();
  if (!line) return undefined;
  const quote = line[0];
  if (quote === '"' || quote === "'") {
    const end = line.indexOf(quote, 1);
    return end === -1 ? undefined : line.slice(1, end);
  }
  return line.replace(/\s+#.*$/, "");
}

function sourceEntries(): Entry[] {
  const layouts = [
    {
      base: "src/content/blog",
      route: (id: string) => `/blog/${id}/`,
      posts: true,
    },
    {
      base: "src/content/notes",
      route: (id: string) => `/notes/${id}/`,
      posts: false,
    },
    {
      base: "src/content/projects",
      route: (id: string) => `/projects/${id}/`,
      posts: false,
    },
  ];
  const now = Date.now();
  const entries: Entry[] = [];
  for (const { base, route, posts } of layouts) {
    for (const file of walk(base)) {
      const parts = relative(base, file).split(sep);
      if (parts.some(part => part.startsWith("_"))) continue;
      if (!/\.mdx?$/.test(file)) continue;
      const fm = frontmatter(file);
      const id = parts.join("/").replace(/\.mdx?$/, "");
      const published = /^pubDatetime:\s*["']?([^"'\r\n]+)/m
        .exec(fm)?.[1]
        ?.trim();
      const override = frontmatterValue(fm, "canonicalUrl");
      if (override) CANONICAL_OVERRIDES.set(route(id), override);
      const ogOverride = frontmatterValue(fm, "ogImage");
      if (ogOverride) OG_OVERRIDES.set(route(id), ogOverride);
      entries.push({
        route: route(id),
        draft: /^draft:\s*true\s*$/m.test(fm),
        // A post dated within a day of now may or may not be built yet.
        future:
          posts && published
            ? new Date(published).getTime() > now - ONE_DAY_MS
            : false,
        customOg: posts && /^ogImage:/m.test(fm),
      });
    }
  }
  for (const file of walk("src/content/pages")) {
    if (!/\.mdx?$/.test(file)) continue;
    if (relative("src/content/pages", file).startsWith("_")) continue;
    const fm = frontmatter(file);
    const id = relative("src/content/pages", file)
      .split(sep)
      .join("/")
      .replace(/\.mdx?$/, "");
    const route = id === "home" ? "/" : `/${id}/`;
    const override = frontmatterValue(fm, "canonicalUrl");
    if (override) CANONICAL_OVERRIDES.set(route, override);
    const ogOverride = frontmatterValue(fm, "ogImage");
    if (ogOverride) OG_OVERRIDES.set(route, ogOverride);
  }
  return entries;
}

// --- HTML helpers -----------------------------------------------------------

/** A numeric character reference; an out-of-range value reads as U+FFFD, never throws. */
function fromCodePoint(value: number): string {
  return Number.isInteger(value) && value >= 0 && value <= 0x10ffff
    ? String.fromCodePoint(value)
    : "\uFFFD";
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec: string) => fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Value of one attribute of an opening tag, entities decoded, or undefined.
 * Attributes are read in order with their quoted values consumed whole, so
 * `name=` text inside another attribute's value is never taken for one.
 */
function attr(tag: string, name: string): string | undefined {
  const wanted = name.toLowerCase();
  const rest = tag.replace(/^<[^\s>/]+/, "");
  for (const [, key, double, single, bare] of rest.matchAll(
    /[\s/]+([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))|[\s/]+[^\s"'<>/=]+/g
  )) {
    if (key?.toLowerCase() !== wanted) continue;
    const value = double ?? single ?? bare;
    return value === undefined ? undefined : decodeEntities(value);
  }
  return undefined;
}

/** The rest of an opening tag: a quoted value may hold `<` and `>` (Astro escapes neither). */
const TAG_REST = String.raw`(?:[^>"']|"[^"]*"|'[^']*')*`;

/**
 * Removes whole elements by name. Tags are consumed one at a time with their
 * quoted values, so `<script>` text inside an attribute (a title that quotes
 * code) is never read as an element.
 */
function removeElements(html: string, names: string[]): string {
  const pattern = new RegExp(
    String.raw`<!--[\s\S]*?-->|<(${names.join("|")})\b${TAG_REST}>[\s\S]*?<\/\1\s*>|<[a-z][a-z0-9-]*\b${TAG_REST}>`,
    "gi"
  );
  return html.replace(pattern, (match, name: string | undefined) =>
    name ? "" : match
  );
}

/** Page markup with the contents of script, style, template and noscript removed. */
function visibleMarkup(html: string): string {
  return removeElements(html, ["script", "style", "template", "noscript"]);
}

function plainText(markup: string): string {
  return decodeEntities(markup.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function headOf(html: string): string {
  const open = new RegExp(String.raw`<head\b${TAG_REST}>`, "i").exec(html);
  if (!open) return "";
  const rest = removeElements(html.slice(open.index + open[0].length), [
    "script",
    "style",
  ]);
  // The first `</head>` that is not inside a quoted attribute value.
  const end = new RegExp(
    String.raw`<[a-z][a-z0-9-]*\b${TAG_REST}>|<\/head\s*>`,
    "gi"
  );
  for (const match of rest.matchAll(end))
    if (match[0].startsWith("</")) return rest.slice(0, match.index);
  return "";
}

// --- Checks -----------------------------------------------------------------

function checkSourceEntriesBuilt(entries: Entry[]): void {
  for (const entry of entries) {
    const built = existsSync(join(DIST, entry.route, "index.html"));
    if (entry.draft && built) fail("", `draft built: ${entry.route}`);
    if (!entry.draft && !entry.future && !built)
      fail("", `published entry missing: ${entry.route}`);
  }
}

function checkTextFiles(
  files: string[],
  entries: Entry[],
  origin: string
): void {
  const draftRoutes = entries
    .filter(entry => entry.draft)
    .map(entry => entry.route);
  for (const file of files.filter(name => /\.(html|xml|txt)$/.test(name))) {
    const text = read(file);
    if (text.includes(DEMO_MARKER)) fail(rel(file), `contains ${DEMO_MARKER}`);
    for (const route of draftRoutes) {
      if (
        text.includes(`href="${route}"`) ||
        text.includes(`${origin}${route}`)
      ) {
        fail(rel(file), `links draft route ${route}`);
      }
    }
  }
}

type Fragment = {
  url?: unknown;
  content?: unknown;
  meta?: { title?: unknown };
};

/** Returns the number of fragments found. */
function checkSearchBundle(files: string[], entries: Entry[]): number {
  for (const name of ["pagefind.js", "pagefind-entry.json"]) {
    if (!existsSync(join(DIST, "pagefind", name)))
      fail("", `pagefind: bundle missing (${name})`);
  }

  const draftRoutes = new Set(
    entries.filter(entry => entry.draft).map(entry => entry.route)
  );
  const urls: string[] = [];
  const fragmentFiles = files.filter(
    file =>
      rel(file).startsWith("pagefind/fragment/") &&
      file.endsWith(".pf_fragment")
  );
  for (const file of fragmentFiles) {
    const name = file.split(sep).pop() ?? file;
    let fragment: Fragment;
    try {
      const raw = gunzipSync(readFileSync(file)).toString("utf8");
      fragment = JSON.parse(raw.slice(raw.indexOf("{"))) as Fragment;
    } catch (error) {
      fail(
        "",
        `pagefind: fragment ${name} cannot be parsed (${error instanceof Error ? error.message : String(error)})`
      );
      continue;
    }
    const url = typeof fragment.url === "string" ? fragment.url : "";
    urls.push(url);
    if (!CONTENT_ROUTE_PATTERNS.some(pattern => pattern.test(url))) {
      fail(
        "",
        `pagefind: fragment ${name} indexes ${url} (not a content route)`
      );
    }
    const content =
      typeof fragment.content === "string" ? fragment.content : "";
    const title =
      typeof fragment.meta?.title === "string" ? fragment.meta.title : "";
    if (content.includes(DEMO_MARKER) || title.includes(DEMO_MARKER)) {
      fail("", `pagefind: fragment ${name} contains ${DEMO_MARKER}`);
    }
    if (draftRoutes.has(url))
      fail("", `pagefind: fragment ${name} indexes draft route ${url}`);
  }

  for (const entry of entries) {
    if (entry.draft || entry.future) continue;
    const count = urls.filter(url => url === entry.route).length;
    if (count === 0)
      fail("", `pagefind: published route ${entry.route} not indexed`);
    if (count > 1)
      fail(
        "",
        `pagefind: published route ${entry.route} indexed ${count} times`
      );
  }

  const entryFile = join(DIST, "pagefind", "pagefind-entry.json");
  if (existsSync(entryFile)) {
    try {
      const parsed = JSON.parse(read(entryFile)) as {
        languages?: Record<string, { page_count?: number }>;
      };
      const pageCount = Object.values(parsed.languages ?? {}).reduce(
        (sum, language) => sum + (language.page_count ?? 0),
        0
      );
      if (pageCount !== urls.length) {
        fail(
          "",
          `pagefind: pagefind-entry.json counts ${pageCount} page(s) but ${urls.length} fragment(s) exist`
        );
      }
    } catch {
      fail("", "pagefind: pagefind-entry.json is not valid JSON");
    }
  }
  return urls.length;
}

type Meta = { key: string; content: string };

function metaTags(head: string): Meta[] {
  const metas: Meta[] = [];
  // A quoted value may hold `>` (a title with `</script>`), so quotes are skipped.
  for (const [tag] of head.matchAll(/<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const key = attr(tag, "property") ?? attr(tag, "name");
    if (key) metas.push({ key, content: attr(tag, "content") ?? "" });
  }
  return metas;
}

/**
 * og:image must be absolute. A file on the origin must exist in dist; an image
 * on another origin must be the author's own `ogImage` override for the page.
 */
function checkOgImageUrl(
  name: string,
  route: string,
  url: string,
  origin: string
): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail(name, `og:image ${url} is not an absolute URL`);
    return;
  }
  if (!url.startsWith(`${origin}/`)) {
    const override = OG_OVERRIDES.get(route);
    let allowed = false;
    try {
      allowed =
        override !== undefined && new URL(override, origin).href === url;
    } catch {
      allowed = false;
    }
    if (!allowed)
      fail(
        name,
        `og:image ${url} is on another origin and is not this page's ogImage override`
      );
    return;
  }
  let path: string;
  try {
    path = decodeURIComponent(parsed.pathname).slice(BASE.length);
  } catch {
    fail(name, `og:image ${url} has a malformed path`);
    return;
  }
  const target = join(DIST, path);
  if (!existsSync(target) || !statSync(target).isFile())
    fail(name, `og:image ${url} not in dist`);
}

const CONTENT_TYPE_LABELS: [RegExp, string][] = [
  [POST_ROUTE, "Post"],
  [NOTE_ROUTE, "Note"],
  [/^\/projects\/[a-z0-9-]+\/$/, "Project"],
];

/** Preview tags that must agree with each other and with the page. */
function checkOgPreviewTags(
  name: string,
  route: string,
  html: string,
  head: string,
  entries: Entry[],
  origin: string
): void {
  const metas = metaTags(head);
  const first = (key: string): string | undefined =>
    metas.find(meta => meta.key === key)?.content;
  const ogImage = first("og:image");
  const ogAlt = first("og:image:alt");

  if (/<meta\b[^>]*\sproperty=["']?twitter:/i.test(head))
    fail(name, "Twitter tag written with property= instead of name=");
  const twitterImage = first("twitter:image");
  if (twitterImage !== undefined && twitterImage !== ogImage)
    fail(name, `twitter:image ${twitterImage} != og:image ${ogImage}`);
  const twitterAlt = first("twitter:image:alt");
  if (twitterAlt !== undefined && twitterAlt !== ogAlt)
    fail(name, `twitter:image:alt "${twitterAlt}" != og:image:alt "${ogAlt}"`);

  const generated =
    ogImage !== undefined &&
    (ogImage === `${origin}/og.png` ||
      (ogImage.startsWith(origin) && ogImage.endsWith("/index.png")));
  if (generated) {
    const width = first("og:image:width");
    const height = first("og:image:height");
    if (width !== String(OG_WIDTH) || height !== String(OG_HEIGHT))
      fail(
        name,
        `og:image size ${width ?? "(none)"}x${height ?? "(none)"}, expected ${OG_WIDTH}x${OG_HEIGHT}`
      );
  }

  // Content pages with generated images use their own, not the site default.
  const label = CONTENT_TYPE_LABELS.find(([pattern]) =>
    pattern.test(route)
  )?.[1];
  if (!label || !existsSync(join(DIST, "og.png"))) return;
  const entry = entries.find(candidate => candidate.route === route);
  if (entry?.customOg) return;
  const expected = `${origin}${route}index.png`;
  if (ogImage !== expected)
    fail(name, `og:image ${ogImage ?? "(none)"} != ${expected}`);
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(visibleMarkup(html))?.[1];
  if (h1 !== undefined && ogAlt !== `${label}: ${plainText(h1)}`)
    fail(name, `og:image:alt "${ogAlt}" != "${label}: ${plainText(h1)}"`);
}

type LdEntity = Record<string, unknown>;

function isRecord(value: unknown): value is LdEntity {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Structured data each kind of page must carry, and nothing else. */
function expectedLdTypes(route: string): string[] {
  if (route === "/") return ["Person", "WebSite"];
  if (POST_ROUTE.test(route)) return ["BlogPosting"];
  if (NOTE_ROUTE.test(route)) return ["Article"];
  if (PROJECT_ROUTE.test(route)) return ["SoftwareSourceCode"];
  return [];
}

/** `datetime` values of the `<time>` elements the page shows. */
function visibleTimes(markup: string): Set<string> {
  const times = new Set<string>();
  for (const [tag] of markup.matchAll(/<time\b[^>]*>/gi)) {
    const value = attr(tag, "datetime");
    if (value !== undefined) times.add(value);
  }
  return times;
}

type LdPage = {
  canonical: string | undefined;
  ogImage: string | undefined;
  modified: string | undefined;
  published: string | undefined;
};

/** Every JSON-LD value must be what the page itself shows. */
function checkJsonLd(
  name: string,
  route: string,
  html: string,
  origin: string,
  page: LdPage
): void {
  const entities: LdEntity[] = [];
  let placeholder = false;
  for (const [, body = ""] of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      fail(name, "invalid JSON-LD");
      continue;
    }
    if (PLACEHOLDER_MARKERS.some(marker => body.includes(marker)))
      placeholder = true;
    if (!isRecord(parsed)) continue;
    const graph = parsed["@graph"];
    if (Array.isArray(graph)) entities.push(...graph.filter(isRecord));
    else entities.push(parsed);
  }
  if (placeholder) fail(name, "JSON-LD contains a placeholder marker");

  const counts = new Map<string, number>();
  for (const entity of entities) {
    const type = typeof entity["@type"] === "string" ? entity["@type"] : "?";
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  for (const [type, n] of counts) {
    if (n > 1) fail(name, `JSON-LD type ${type} appears ${n} times`);
  }
  const found = [...counts.keys()].sort();
  const expected = expectedLdTypes(route).sort();
  if (found.join(",") !== expected.join(",")) {
    fail(
      name,
      `JSON-LD types ${found.join(", ") || "none"} != ${expected.join(", ") || "none"}`
    );
  }

  const markup = visibleMarkup(html);
  const h1Html = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(markup)?.[1];
  const h1 = h1Html === undefined ? undefined : plainText(h1Html);
  const times = visibleTimes(markup);
  const person = `${origin}/#person`;
  const text = (value: unknown): string =>
    typeof value === "string" ? value : "(none)";
  const expectEqual = (field: string, value: unknown, want?: string): void => {
    if (want !== undefined && value !== want)
      fail(name, `JSON-LD ${field} ${text(value)} != ${want}`);
  };
  const expectVisibleTime = (field: string, value: unknown): void => {
    if (value === undefined) return;
    if (typeof value !== "string" || !times.has(value))
      fail(
        name,
        `JSON-LD ${field} ${text(value)} is not a visible <time> value`
      );
  };
  const reference = (field: string, value: unknown): void => {
    const id = isRecord(value) ? value["@id"] : undefined;
    if (id !== person)
      fail(name, `JSON-LD ${field} @id ${text(id)} != ${person}`);
  };

  for (const entity of entities) {
    const type = entity["@type"];
    if (type === "Person") {
      expectEqual("Person @id", entity["@id"], person);
      if (route === "/") {
        const links = new Set<string>();
        for (const [tag] of markup.matchAll(/<a\b[^>]*>/gi)) {
          const relations = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
          const href = attr(tag, "href");
          if (relations.includes("me") && href !== undefined) links.add(href);
        }
        const sameAs = Array.isArray(entity.sameAs) ? entity.sameAs : [];
        for (const url of sameAs) {
          if (typeof url !== "string" || !links.has(url))
            fail(name, `Person.sameAs ${text(url)} has no rel="me" link`);
        }
      }
    } else if (type === "WebSite") {
      reference("publisher", entity.publisher);
    } else if (
      type === "BlogPosting" ||
      type === "Article" ||
      type === "SoftwareSourceCode"
    ) {
      const field = type === "SoftwareSourceCode" ? "name" : "headline";
      expectEqual(field, entity[field], h1);
      expectEqual("url", entity.url, page.canonical);
      expectEqual("image", entity.image, page.ogImage);
      reference("author", entity.author);
      expectVisibleTime("datePublished", entity.datePublished);
      expectVisibleTime("dateModified", entity.dateModified);
      if (type === "BlogPosting") {
        const published = text(entity.datePublished);
        const modified = text(entity.dateModified);
        if ((page.published ?? "(none)") !== published)
          fail(
            name,
            `article:published_time ${page.published ?? "(none)"} != JSON-LD datePublished ${published}`
          );
        if ((page.modified ?? "(none)") !== modified)
          fail(
            name,
            `article:modified_time ${page.modified ?? "(none)"} != JSON-LD dateModified ${modified}`
          );
      }
    }
  }
}

const OPENING_TAG = /<[a-z][a-z0-9-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;

/** Whether the opening tag's class list holds `token`. */
function hasClass(tag: string, token: string): boolean {
  return (attr(tag, "class") ?? "").split(/\s+/).includes(token);
}

/** Share row rules: one copy link on posts and notes, none elsewhere. */
function checkShareRow(
  name: string,
  route: string,
  html: string,
  canonical: string | undefined
): void {
  const markup = visibleMarkup(html);
  const hasShareRow = POST_ROUTE.test(route) || NOTE_ROUTE.test(route);
  const tags = [...markup.matchAll(OPENING_TAG)].map(match => ({
    tag: match[0],
    at: match.index,
  }));
  const copyLinks = tags.filter(
    ({ tag }) => /^<a\b/i.test(tag) && /\sdata-copy-link(?=[\s=>/])/i.test(tag)
  );

  if (!hasShareRow) {
    if (copyLinks.length > 0)
      fail(name, "copy link on a page without a share row");
  } else {
    if (copyLinks.length !== 1) {
      fail(name, `${copyLinks.length} copy links`);
    } else if (copyLinks[0]) {
      const href = attr(copyLinks[0].tag, "href");
      if (href !== canonical)
        fail(
          name,
          `copy link href ${href ?? "(none)"} != canonical ${canonical ?? "(none)"}`
        );
      const row = tags.find(
        ({ tag, at }) =>
          /^<div\b/i.test(tag) &&
          hasClass(tag, "share-row") &&
          at < copyLinks[0].at
      );
      if (!row || !/\sdata-pagefind-ignore(?=[\s=>/])/i.test(row.tag))
        fail(name, "share row is not excluded from the search index");
    }
  }

  for (const { tag } of tags) {
    if (/^<a\b/i.test(tag) && hasClass(tag, "u-syndication")) {
      const href = attr(tag, "href") ?? "";
      if (!/^https?:\/\//i.test(href))
        fail(name, `syndication link ${href || "(none)"} is not http(s)`);
      if (!(attr(tag, "rel") ?? "").split(/\s+/).includes("syndication"))
        fail(name, `syndication link ${href} lacks rel="syndication"`);
      if (!hasShareRow)
        fail(name, `syndication link ${href} is on a page without a share row`);
    }
  }
  for (const [, open = "", body = ""] of markup.matchAll(
    /(<p\b(?:[^>"']|"[^"]*"|'[^']*')*>)([\s\S]*?)<\/p>/gi
  )) {
    if (!hasClass(open, "syndication")) continue;
    if (!/<a\b[^>]*\sclass=["'][^"']*\bu-syndication\b/i.test(body))
      fail(name, "syndication line without links");
  }
}

/** What the page head tells the share-row and JSON-LD checks. */
type HeadFacts = {
  canonical: string | undefined;
  ogImage: string | undefined;
  modified: string | undefined;
  published: string | undefined;
};

function checkPageHead(
  file: string,
  html: string,
  origin: string,
  entries: Entry[]
): HeadFacts {
  const name = rel(file);
  const route = routeOf(file);
  const head = headOf(html);

  const canonicals = [
    ...head.matchAll(/<link\b[^>]*\srel=["']?canonical["']?[^>]*>/gi),
  ].map(match => attr(match[0], "href") ?? "");
  if (canonicals.length !== 1)
    fail(name, `${canonicals.length} canonical links`);
  const canonical = canonicals[0];
  if (canonical !== undefined) {
    if (route === "/404.html") {
      // The one non-directory page: its canonical is its own file URL.
      if (canonical !== `${origin}/404.html`)
        fail(name, `canonical ${canonical} != ${origin}/404.html`);
    } else {
      // A `canonicalUrl` in the frontmatter replaces the derived URL.
      const expected = CANONICAL_OVERRIDES.get(route) ?? `${origin}${route}`;
      if (canonical !== expected)
        fail(name, `canonical ${canonical} != ${expected}`);
    }
  }

  const metas = metaTags(head);
  const count = (key: string): Meta[] => metas.filter(meta => meta.key === key);
  const singletons = [
    "og:type",
    "og:url",
    "og:title",
    "og:description",
    "og:image",
    "og:image:alt",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:image:alt",
  ];
  for (const key of singletons) {
    if (count(key).length !== 1) fail(name, `${count(key).length} ${key} tags`);
  }
  const noindex = count("robots").some(meta => meta.content === "noindex");
  if (route === "/404.html" && !noindex) fail(name, "missing robots noindex");
  if (route !== "/404.html" && noindex) fail(name, "unexpected robots noindex");

  const verification = process.env.PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const verifications = count("google-site-verification");
  const matching = verifications.filter(
    meta => meta.content === verification
  ).length;
  const wanted = verification ? 1 : 0;
  if (verifications.length !== wanted || matching !== wanted)
    fail(
      name,
      `${verifications.length} google-site-verification meta tags (expected ${wanted}${verification ? ` with content ${verification}` : ""})`
    );

  const titles = (head.match(/<title[\s>]/gi) ?? []).length;
  if (titles !== 1) fail(name, `${titles} <title> tags`);
  if (count("description").length !== 1)
    fail(name, `${count("description").length} meta description tags`);

  const ogUrl = count("og:url")[0]?.content;
  if (ogUrl !== undefined && canonical !== undefined && ogUrl !== canonical) {
    fail(name, `og:url ${ogUrl} != canonical ${canonical}`);
  }

  const ogImage = count("og:image")[0]?.content;
  if (ogImage !== undefined) checkOgImageUrl(name, route, ogImage, origin);
  checkOgPreviewTags(name, route, html, head, entries, origin);

  const ogType = count("og:type")[0]?.content;
  const expectedType =
    POST_ROUTE.test(route) || NOTE_ROUTE.test(route) ? "article" : "website";
  if (ogType !== undefined && ogType !== expectedType)
    fail(name, `og:type ${ogType} != ${expectedType}`);

  return {
    canonical,
    ogImage,
    modified: count("article:modified_time")[0]?.content,
    published: count("article:published_time")[0]?.content,
  };
}

function checkHeadings(file: string, markup: string): void {
  const name = rel(file);
  const headings = [
    ...markup.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi),
  ].map(match => ({
    level: Number(match[1]),
    text: plainText(match[2] ?? "").slice(0, 60),
  }));
  const h1Count = (markup.match(/<h1[\s>]/gi) ?? []).length;
  if (h1Count !== 1) fail(name, `expected exactly 1 <h1>, found ${h1Count}`);
  let previous = 0;
  for (const heading of headings) {
    if (previous > 0 && heading.level > previous + 1) {
      fail(
        name,
        `heading level jumps from h${previous} to h${heading.level} at "${heading.text}"`
      );
    }
    previous = heading.level;
  }
}

function checkImageAlt(file: string, markup: string): void {
  for (const [tag] of markup.matchAll(/<img\b[^>]*>/gi)) {
    if (!attr(tag, "alt")?.trim()) {
      fail(
        rel(file),
        `<img src="${attr(tag, "src") ?? ""}"> has a missing or empty alt`
      );
    }
  }
}

const ASSET_ATTRIBUTES = [
  "src",
  "srcset",
  "href",
  "content",
  "poster",
  "imagesrcset",
];
const PAGE_ELEMENTS = new RegExp(
  String.raw`<!--[\s\S]*?-->|(<(script|style)\b${TAG_REST}>)([\s\S]*?)<\/\2\s*>|(<[a-z][a-z0-9-]*\b${TAG_REST}>)`,
  "gi"
);

/** Local `/_astro/...` paths inside CSS `url(...)` values. */
function cssAssetUrls(css: string, origin: string): string[] {
  const urls: string[] = [];
  for (const [, raw = ""] of css.matchAll(/url\(\s*["']?([^"')\s]+)/gi)) {
    const url = decodeEntities(raw);
    if (url.startsWith(`${BASE}/_astro/`)) urls.push(url.slice(BASE.length));
    else if (url.startsWith(`${origin}/_astro/`))
      urls.push(url.slice(origin.length));
  }
  return urls;
}

type PageTag = { tag: string; styleBody?: string };

/** Real opening tags of a page, with a style element's text. Comments and script text are skipped. */
function pageTags(html: string): PageTag[] {
  const tags: PageTag[] = [];
  for (const [, scriptTag, , body, tag] of html.matchAll(PAGE_ELEMENTS)) {
    const opening = scriptTag ?? tag;
    if (opening === undefined) continue;
    tags.push({
      tag: opening,
      styleBody: /^<style\b/i.test(opening) ? body : undefined,
    });
  }
  return tags;
}

/** Every `/_astro/...` URL a page's tags, inline styles and style attributes reference. */
function pageAssetUrls(html: string, origin: string): string[] {
  const urls: string[] = [];
  for (const { tag, styleBody } of pageTags(html)) {
    if (styleBody !== undefined) urls.push(...cssAssetUrls(styleBody, origin));
    for (const name of ASSET_ATTRIBUTES) {
      for (const token of (attr(tag, name) ?? "").trim().split(/[\s,]+/)) {
        if (token.startsWith(`${BASE}/_astro/`))
          urls.push(token.slice(BASE.length));
        else if (token.startsWith(`${origin}/_astro/`))
          urls.push(token.slice(origin.length));
      }
    }
    urls.push(...cssAssetUrls(attr(tag, "style") ?? "", origin));
  }
  return urls;
}

/** A `/_astro/...` reference must name a file in dist, or the page ships a broken asset. */
function checkAssetUrls(name: string, urls: string[]): void {
  for (const url of new Set(urls)) {
    let path: string;
    try {
      path = decodeURIComponent(url.replace(/[?#].*$/, ""));
    } catch {
      fail(name, `references malformed asset URL ${url}`);
      continue;
    }
    const target = join(DIST, path);
    if (!existsSync(target) || !statSync(target).isFile())
      fail(name, `references missing asset ${url}`);
  }
}

function isThirdParty(url: string, origin: string): boolean {
  if (url.startsWith("data:")) return false;
  if (url.startsWith("//")) return true;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) return false;
  try {
    return new URL(url).origin !== origin;
  } catch {
    return true;
  }
}

function checkThirdParties(file: string, html: string, origin: string): void {
  const name = rel(file);
  for (const [tag] of html.matchAll(/<script\b[^>]*>/gi)) {
    const src = attr(tag, "src");
    if (src !== undefined && isThirdParty(src, origin))
      fail(name, `third-party script ${src}`);
  }
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const href = attr(tag, "href");
    const relations = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    const kind = ["stylesheet", "preload", "modulepreload", "icon"].find(
      value => relations.includes(value)
    );
    if (kind && href !== undefined && isThirdParty(href, origin))
      fail(name, `third-party ${kind} ${href}`);
  }
  for (const [tag] of visibleMarkup(html).matchAll(/<iframe\b[^>]*>/gi)) {
    fail(name, `third-party iframe ${attr(tag, "src") ?? "(no src)"}`);
  }
}

const CONNECTOR_MARKER = /giscus|cloudflareinsights/i;
/** The attributes that load or navigate to a URL, by element. */
const URL_ATTRIBUTES: Record<string, string[]> = {
  script: ["src"],
  iframe: ["src"],
  link: ["href"],
  form: ["action", "href"],
  a: ["href"],
};

/**
 * No comment or analytics connector and no share-intent link. Only
 * markup counts: script and iframe sources, link and anchor targets, form
 * actions, element names and the beacon attribute. Prose and code that mention
 * Giscus or a share URL are allowed.
 */
function checkConnectorMarkers(file: string, html: string): void {
  const name = rel(file);
  const markers = new Set<string>();
  const intents = new Set<string>();
  for (const { tag } of pageTags(html)) {
    const element = /^<([a-z][a-z0-9-]*)/i.exec(tag)?.[1]?.toLowerCase() ?? "";
    const connector = element.match(CONNECTOR_MARKER)?.[0];
    if (connector) markers.add(connector.toLowerCase());
    // Attribute names only: a quoted value may hold any text.
    if (
      /\sdata-cf-beacon(?=[\s=>/])/i.test(tag.replace(/"[^"]*"|'[^']*'/g, '""'))
    )
      markers.add("data-cf-beacon");
    for (const attribute of URL_ATTRIBUTES[element] ?? []) {
      const value = attr(tag, attribute) ?? "";
      if (element !== "a") {
        const found = value.match(CONNECTOR_MARKER)?.[0];
        if (found) markers.add(found.toLowerCase());
      }
      for (const match of value.matchAll(SHARE_INTENT_PATTERN))
        intents.add(match[0].toLowerCase());
    }
  }
  for (const marker of markers)
    fail(name, `Giscus/Cloudflare marker "${marker}"`);
  for (const intent of intents) fail(name, `share-intent link ${intent}`);
}

/** /search/ shows the nothing-published line exactly when the index is empty. */
function checkSearchPage(indexed: number): void {
  const file = join(DIST, "search", "index.html");
  if (!existsSync(file)) {
    fail("search/index.html", "missing");
    return;
  }
  const empty = /<div\b[^>]*\sdata-search-empty[\s>=]/.test(read(file));
  if (empty !== (indexed === 0)) {
    fail(
      "",
      `pagefind: /search/ shows ${empty ? "empty" : "search"} but ${indexed} page(s) are indexed`
    );
  }
}

// --- Sitemap, robots and draft assets ---------------------------------------

/** Every `<loc>` value of a sitemap file, in order. */
function sitemapLocations(file: string): string[] {
  return [...read(file).matchAll(/<loc>\s*([^<]*?)\s*<\/loc>/g)].map(match =>
    decodeEntities(match[1])
  );
}

/**
 * The sitemap lists exactly the built page routes: absolute, on the origin,
 * with a trailing slash, and never a draft.
 */
function checkSitemap(
  htmlFiles: string[],
  entries: Entry[],
  origin: string
): void {
  const indexFile = join(DIST, "sitemap-index.xml");
  if (!existsSync(indexFile)) {
    fail("", "sitemap-index.xml missing");
    return;
  }
  const built = new Set(
    htmlFiles
      .filter(
        file => rel(file) === "index.html" || /\/index\.html$/.test(rel(file))
      )
      .map(routeOf)
  );
  const draftRoutes = new Set(
    entries.filter(entry => entry.draft).map(entry => entry.route)
  );
  const listed = new Set<string>();
  for (const location of sitemapLocations(indexFile)) {
    const name = location.startsWith(`${origin}/`)
      ? location.slice(origin.length + 1)
      : "";
    if (!/^sitemap-\d+\.xml$/.test(name)) {
      fail("sitemap-index.xml", `${location} is not ${origin}/sitemap-<n>.xml`);
      continue;
    }
    if (!existsSync(join(DIST, name))) {
      fail("sitemap-index.xml", `${location} has no dist file`);
      continue;
    }
    for (const url of sitemapLocations(join(DIST, name))) listed.add(url);
  }
  for (const url of listed) {
    if (!url.startsWith(`${origin}/`)) {
      fail("", `sitemap: ${url} not on ${origin}`);
      continue;
    }
    if (!url.endsWith("/")) fail("", `sitemap: ${url} lacks trailing slash`);
    const route = url.slice(origin.length);
    if (draftRoutes.has(route)) fail("", `sitemap: ${url} is a draft route`);
    else if (!built.has(route)) fail("", `sitemap: ${url} has no dist page`);
  }
  for (const route of built)
    if (!listed.has(`${origin}${route}`))
      fail("", `sitemap: route ${route} missing`);
}

function checkRobots(origin: string): void {
  const file = join(DIST, "robots.txt");
  const lines = existsSync(file)
    ? read(file)
        .split(/\r?\n/)
        .map(line => line.trim())
    : [];
  for (const line of [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${origin}/sitemap-index.xml`,
  ])
    if (!lines.includes(line)) fail("robots.txt", `missing "${line}"`);
}

/** Images that only a draft references must not reach dist/_astro. */
function checkDraftAssets(): void {
  for (const file of findDraftOnlyAssets(DIST))
    fail(rel(file), "draft-only asset shipped");
}

// --- Routes, retired routes and type scale ----------------------------------

/** Every static route of the site exists in dist (entry routes come from source). */
function checkRoutes(): void {
  for (const route of STATIC_ROUTES) {
    const file = route.endsWith("/")
      ? join(DIST, route, "index.html")
      : join(DIST, route);
    if (!existsSync(file)) fail("", `route ${route} missing`);
  }
}

/** The retired /posts/ route is neither built nor linked. */
function checkPostsRoute(files: string[], origin: string): void {
  for (const file of files.filter(name => rel(name).startsWith("posts/")))
    fail("", `posts route built: ${rel(file)}`);
  for (const file of files.filter(name => /\.(html|xml|txt)$/.test(name))) {
    const text = read(file);
    if (text.includes('"/posts/') || text.includes(`${origin}/posts/`))
      fail(rel(file), "links the retired posts route");
  }
}

/** Pixel size of a px or rem length. */
function pixels(value: string, unit: string): number {
  return unit === "rem" ? Number(value) * 16 : Number(value);
}

/** Why a font declaration leaves the scale, or null when it is on it. */
function offScale(property: string, value: string): string | null {
  const v = value.trim();
  if (
    /^(?:inherit|initial|unset|revert)$/.test(v) ||
    /^var\(--[\w-]+\)$/.test(v)
  )
    return null;
  if (property === "font-weight") {
    if (v === "normal") return null;
    return SCALE_WEIGHTS.has(Number(v)) ? null : `font-weight ${v}`;
  }
  if (property === "font-size" || property.startsWith("--text-")) {
    if (v === "1em" || v === "100%") return null;
    const size = /^([\d.]+)(px|rem)$/.exec(v);
    if (!size) return `${property} ${v}`;
    const px = pixels(size[1] ?? "", size[2] ?? "");
    return SCALE_SIZES.has(px) ? null : `${property} ${v}`;
  }
  // The font shorthand and the --t-* tokens: `[weight] size/line-height family`.
  const size = /(?:^|\s)([\d.]+)(px|rem)\s*\//.exec(v);
  if (!size)
    return /\d/.test(v.split(/\s/)[0] ?? "") ? `${property} ${v}` : null;
  const px = pixels(size[1] ?? "", size[2] ?? "");
  if (!SCALE_SIZES.has(px)) return `${property} ${v}`;
  const weight = /^(\d{3})\s/.exec(v)?.[1];
  if (weight && !SCALE_WEIGHTS.has(Number(weight))) return `${property} ${v}`;
  return null;
}

/**
 * Source files stay on the type scale: no size or weight utility outside it,
 * and every font size and weight written in CSS (stylesheets and Astro
 * `<style>` blocks) is one of the scale's sizes and weights or a token.
 */
function checkTypeScale(): void {
  for (const file of walk("src").filter(name => TYPE_SCALE_FILES.test(name))) {
    const path = file.split(sep).join("/");
    const styled = STYLE_FILES.test(file);
    read(file)
      .split(/\r?\n/)
      .forEach((line, index) => {
        for (const match of line.matchAll(OUT_OF_SCALE))
          fail(
            "",
            `${path}:${index + 1}: ${match[1]} is outside the type scale`
          );
        if (!styled) return;
        for (const [, property = "", value = ""] of line.matchAll(
          FONT_DECLARATION
        )) {
          const problem = offScale(property, value);
          if (problem)
            fail(
              "",
              `${path}:${index + 1}: ${problem} is outside the type scale`
            );
        }
      });
  }
}

// --- Palettes ---------------------------------------------------------------

const PALETTE_TEXT = [
  "--foreground",
  "--muted-foreground",
  "--accent",
  "--code-comment",
  "--red",
  "--orange",
  "--yellow",
  "--green",
  "--cyan",
  "--blue",
  "--purple",
];
const PALETTE_SURFACES = ["--background", "--mantle", "--crust", "--muted"];
const AA = 4.5;

function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? [...value].map(c => c + c).join("")
      : value.slice(0, 6);
  const channel = (offset: number): number => {
    const c = parseInt(full.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

/**
 * Every palette the site ships (the inline style in index.html, custom ones
 * included) must meet WCAG AA: each text token on each surface, and
 * accent-foreground on accent. The <html> data-dark / data-light attributes
 * must name a shipped palette.
 */
function checkPalettes(): void {
  const file = join(DIST, "index.html");
  if (!existsSync(file)) return fail("index.html", "palette: missing");
  const html = readFileSync(file, "utf8");
  const rules = [
    ...html.matchAll(/html\[data-(dark|light)="([\w-]+)"\][^{]*\{([^}]*)\}/g),
  ];
  if (rules.length === 0)
    return fail("index.html", "palette: no palette rules");
  const shipped = new Set(rules.map(([, mode, name]) => `${mode}:${name}`));
  for (const mode of ["dark", "light"]) {
    const name = new RegExp(`<html[^>]*\\sdata-${mode}="([\\w-]+)"`).exec(
      html
    )?.[1];
    if (!name || !shipped.has(`${mode}:${name}`))
      fail(
        "index.html",
        `palette: data-${mode}="${name ?? ""}" is not shipped`
      );
  }
  for (const [, mode, name, body] of rules) {
    const vars = new Map(
      [...(body ?? "").matchAll(/(--[\w-]+):(#[0-9a-fA-F]{3,8})/g)].map(
        ([, key, value]) => [key ?? "", value ?? ""]
      )
    );
    const id = `${mode} palette "${name}"`;
    for (const key of [
      ...PALETTE_TEXT,
      ...PALETTE_SURFACES,
      "--accent-foreground",
    ]) {
      if (!vars.has(key)) fail("", `palette: ${id} has no ${key}`);
    }
    for (const text of PALETTE_TEXT) {
      for (const surface of PALETTE_SURFACES) {
        const ratio = contrast(
          vars.get(text) ?? "#000",
          vars.get(surface) ?? "#000"
        );
        if (ratio < AA)
          fail(
            "",
            `palette: ${id} ${text} on ${surface} is ${ratio.toFixed(2)}:1, below ${AA}`
          );
      }
    }
    const onAccent = contrast(
      vars.get("--accent-foreground") ?? "#000",
      vars.get("--accent") ?? "#000"
    );
    if (onAccent < AA)
      fail(
        "",
        `palette: ${id} --accent-foreground on --accent is ${onAccent.toFixed(2)}:1`
      );
  }
}

// --- Open Graph images ------------------------------------------------------

/** With dynamic OG on, every generated PNG must be a 1200x630 PNG. */
function checkOgImages(files: string[]): void {
  if (!existsSync(join(DIST, "og.png"))) return;
  const images = files.filter(
    file => rel(file) === "og.png" || rel(file).endsWith("/index.png")
  );
  for (const file of images) {
    if (
      rel(file) !== "og.png" &&
      !existsSync(join(dirname(file), "index.html"))
    ) {
      fail(rel(file), "OG image without a page");
    }
    const bytes = readFileSync(file);
    if (bytes.subarray(0, 8).toString("hex") !== PNG_SIGNATURE) {
      fail(rel(file), "OG image is not a PNG");
      continue;
    }
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width !== OG_WIDTH || height !== OG_HEIGHT)
      fail(
        rel(file),
        `OG image is ${width}x${height}, expected ${OG_WIDTH}x${OG_HEIGHT}`
      );
  }
}

// --- Run --------------------------------------------------------------------

if (!existsSync(join(DIST, "index.html")))
  stopSetup(`${DIST}/index.html missing, run the production build first`);

const files = walk(DIST);
const htmlFiles = files.filter(
  file => file.endsWith(".html") && !rel(file).startsWith("pagefind/")
);

const robots = existsSync(join(DIST, "robots.txt"))
  ? read(join(DIST, "robots.txt"))
  : "";
const sitemapUrl = /^Sitemap:\s*(\S+)/m.exec(robots)?.[1];
const configured = process.env.SITE_URL || sitemapUrl;
if (!configured)
  stopSetup(
    "no origin: set SITE_URL or build with a Sitemap: line in robots.txt"
  );
// The site root, base path included: https://example.com or https://u.github.io/repo.
const BASE = (
  process.env.BASE_PATH ||
  (sitemapUrl
    ? new URL(sitemapUrl).pathname.replace(/\/sitemap-index\.xml$/, "")
    : "")
).replace(/\/+$/, "");
const origin = new URL(configured).origin + BASE;

const entries = sourceEntries();
let indexed = 0;
run("source-entries", () => checkSourceEntriesBuilt(entries));
run("text-files", () => checkTextFiles(files, entries, origin));
run("search-bundle", () => {
  indexed = checkSearchBundle(files, entries);
});
run("search-page", () => checkSearchPage(indexed));
run("sitemap", () => checkSitemap(htmlFiles, entries, origin));
run("robots", () => checkRobots(origin));
run("draft-assets", () => checkDraftAssets());
run("palettes", () => checkPalettes());
run("og-images", () => checkOgImages(files));
run("routes", () => checkRoutes());
run("posts-route", () => checkPostsRoute(files, origin));
run("type-scale", () => checkTypeScale());
for (const file of htmlFiles) {
  const html = read(file);
  const markup = visibleMarkup(html);
  const name = rel(file);
  const route = routeOf(file);
  const head: { facts?: HeadFacts } = {};
  run("page-head", () => {
    head.facts = checkPageHead(file, html, origin, entries);
  });
  const facts = head.facts;
  if (facts) {
    run("share-row", () => checkShareRow(name, route, html, facts.canonical));
    run("json-ld", () => checkJsonLd(name, route, html, origin, facts));
  }
  run("headings", () => checkHeadings(file, markup));
  run("image-alt", () => checkImageAlt(file, markup));
  run("third-parties", () => checkThirdParties(file, html, origin));
  run("asset-urls", () => checkAssetUrls(name, pageAssetUrls(html, origin)));
  run("connectors", () => checkConnectorMarkers(file, html));
}
for (const file of files.filter(name => name.endsWith(".css")))
  run("asset-urls", () =>
    checkAssetUrls(rel(file), cssAssetUrls(read(file), origin))
  );

if (failures.length > 0) {
  for (const failure of failures) console.error(`verify-dist: FAIL ${failure}`);
  console.error(`verify-dist: ${failedRuns} of ${checkRuns} checks failed.`);
  process.exit(1);
}
console.log(`verify-dist: all ${checkRuns} checks passed.`);
