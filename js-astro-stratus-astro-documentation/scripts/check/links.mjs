/**
 * Fail on any internal href in `dist/` with no matching file; warn on orphan pages
 * (in practice a page with no `group` that nothing links to).
 *
 *   node scripts/check/links.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { glob } from "glob";

const root = join(import.meta.dirname, "..", "..");
const dist = join(root, "dist");

// A build older than any of these is a false pass.
const SOURCES = ["src", "public", "astro.config.mjs", "site-fonts.mjs"];

async function newestMtime(target) {
  const absolute = join(root, target);

  if (!existsSync(absolute)) return 0;

  const files = statSync(absolute).isDirectory()
    ? await glob("**/*", { cwd: absolute, nodir: true, absolute: true, dot: true })
    : [absolute];

  let newest = 0;

  for (const file of files) {
    const { mtimeMs } = statSync(file);

    if (mtimeMs > newest) newest = mtimeMs;
  }
  return newest;
}

async function staleReason() {
  if (!existsSync(dist)) return "dist/ not found";

  const built = await newestMtime("dist");
  const edited = Math.max(...(await Promise.all(SOURCES.map(newestMtime))));

  return edited > built ? "dist/ is older than the last source edit" : null;
}

const reason = await staleReason();

if (reason) {
  console.log(`${reason} — building the site first.`);
  execSync("npx astro build", { cwd: root, stdio: "inherit" });
}

// `COMPONENT_PREVIEWS=true` harness pages synthesize links the site never ships.
const HARNESS = "preview-renders/";

// Entry points a reader arrives at directly, never by following a link.
const PAGES_WITHOUT_INBOUND_LINKS = ["/", "/404/"];

const pages = (await glob("**/*.html", { cwd: dist })).filter((page) => !page.startsWith(HARNESS));
const known = new Set();
const pageUrl = (page) => `/${page.replace(/index\.html$/, "").replace(/\.html$/, "/")}`;
const linkedPages = new Set(PAGES_WITHOUT_INBOUND_LINKS);

for (const page of pages) {
  const url = `/${page.replace(/index\.html$/, "").replace(/\.html$/, "")}`;

  known.add(url.endsWith("/") ? url : `${url}/`);
  known.add(url);
}

for (const asset of await glob("**/*", { cwd: dist, nodir: true })) known.add(`/${asset}`);

const HREF = /\shref="([^"]+)"/g;
const failures = [];

for (const page of pages) {
  const html = readFileSync(join(dist, page), "utf8");
  const from = `/${page.replace(/index\.html$/, "")}`;

  for (const [, href] of html.matchAll(HREF)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;

    const path = href.split(/[?#]/)[0];

    if (!path || path === "/") continue;

    const target = path.endsWith("/") ? path : `${path}/`;

    if (target !== pageUrl(page)) linkedPages.add(target);
    if (known.has(path) || known.has(`${path}/`)) continue;

    failures.push({ from, href });
  }
}

const orphans = pages.map(pageUrl).filter((url) => !linkedPages.has(url));

for (const url of orphans) {
  console.warn(`WARN   ${url} is an orphan — no other page links to it`);
}

if (failures.length) {
  for (const { from, href } of failures) {
    console.error(`FAIL   ${from} links to ${href}, which no page or asset provides`);
  }
  console.error(`\n${failures.length} dead internal link(s).`);
  process.exit(1);
}

const orphanNote = orphans.length ? ` ${orphans.length} orphan page(s), see warnings above.` : "";

console.log(`ok     every internal link resolves — ${pages.length} page(s) checked.${orphanNote}`);
