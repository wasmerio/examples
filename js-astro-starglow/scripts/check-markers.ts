// Lists every unfilled `[[TODO: ...]]` placeholder marker in the source.
//
// Run: ./dev.sh pnpm markers          (node scripts/check-markers.ts [--strict])
//
// Zero dependencies: `node:` builtins only and erasable TypeScript only, so
// Node >= 22.18 strips the types natively.
//
// Warn mode (default) exits 0. Strict mode (`--strict` or MARKERS_STRICT=true)
// exits 1 while any marker remains, so a deploy cannot publish one. No `.env`
// is read, so a local `.env` can never make a local build strict.
//
// Drafts, `_` entries and code (fenced and inline) are skipped, so docs that
// show the syntax are not markers. src/utils/rehypeTodoMarkers.ts uses the same
// marker shape. The built dist/**/*.html is scanned too, as a backstop; strict
// mode also fails when dist/ is missing or has no HTML.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";

const SCANNED = /\.(md|mdx|ts|astro|json|ya?ml)$/;
const MARKDOWN = /\.mdx?$/;
const CONTENT_ROOTS = [
  "src/content/blog",
  "src/content/notes",
  "src/content/projects",
];
const EXTRA_FILES = ["starglow.config.ts"];
const DIST = "dist";

// Each bracket may carry a Markdown backslash escape, in case a formatter
// writes one. The body runs to the first closing pair: it may hold a single `]`
// and wrap across soft line breaks, but never a blank line (a paragraph break).
// Global: use it with matchAll only (never `.test()`, which keeps lastIndex).
const MARKER =
  /\\?\[\\?\[TODO:((?:(?!\\?\]\\?\])[^\n]|\n(?![ \t]*\n))+)\\?\]\\?\]/g;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
// A run of non-blank lines: one Markdown paragraph. Code spans never cross it.
const PARAGRAPH = /[^\n]*\S[^\n]*(?:\n[^\n]*\S[^\n]*)*/g;

type Marker = { path: string; line: number; text: string };

const strict =
  process.argv.includes("--strict") || process.env.MARKERS_STRICT === "true";
const annotate = process.env.GITHUB_ACTIONS === "true";

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  );
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function posix(file: string): string {
  return file.split(sep).join("/");
}

/** True for a built-never entry: a `_` name or `draft: true` content entry. */
function isSkippedEntry(file: string, text: string): boolean {
  const path = posix(file);
  const root = CONTENT_ROOTS.find(base => path.startsWith(`${base}/`));
  if (!root) return false;
  if (
    path
      .slice(root.length + 1)
      .split("/")
      .some(part => part.startsWith("_"))
  )
    return true;
  if (!MARKDOWN.test(path)) return false;
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "";
  // YAML allows a trailing comment after the value.
  return /^draft:\s*true\s*(?:#.*)?$/m.test(frontmatter);
}

/** Blanks Markdown code spans (CommonMark rules) of one paragraph, keeping offsets and line breaks. */
function blankCodeSpans(paragraph: string): string {
  let out = "";
  let i = 0;
  while (i < paragraph.length) {
    const char = paragraph.charAt(i);
    if (char === "\\") {
      // An escaped character, including an escaped backtick, opens nothing.
      out += paragraph.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (char !== "`") {
      out += char;
      i += 1;
      continue;
    }
    let runEnd = i;
    while (paragraph.charAt(runEnd) === "`") runEnd += 1;
    const size = runEnd - i;
    let close = -1;
    for (let k = runEnd; k < paragraph.length;) {
      if (paragraph.charAt(k) !== "`") {
        k += 1;
        continue;
      }
      let end = k;
      while (paragraph.charAt(end) === "`") end += 1;
      if (end - k === size) {
        close = end;
        break;
      }
      k = end;
    }
    if (close === -1) {
      out += paragraph.slice(i, runEnd);
      i = runEnd;
    } else {
      out += paragraph.slice(i, close).replace(/[^\n]/g, " ");
      i = close;
    }
  }
  return out;
}

/** Blanks fenced code blocks (whole lines) and then inline code spans of a Markdown file. */
function maskMarkdownCode(text: string): string {
  let fence: { char: string; size: number } | undefined;
  const lines = text.split("\n").map(line => {
    const opening = FENCE.exec(line)?.[1];
    if (fence) {
      const closes =
        opening !== undefined &&
        opening.startsWith(fence.char) &&
        opening.length >= fence.size &&
        line.trim().length === opening.length;
      if (closes) fence = undefined;
      return "";
    }
    if (opening !== undefined) {
      fence = { char: opening.charAt(0), size: opening.length };
      return "";
    }
    return line;
  });
  return lines.join("\n").replace(PARAGRAPH, blankCodeSpans);
}

function markersIn(file: string): Marker[] {
  const raw = readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  if (isSkippedEntry(file, raw)) return [];
  const path = posix(file);
  const text = MARKDOWN.test(path) ? maskMarkdownCode(raw) : raw;
  const found: Marker[] = [];
  for (const match of text.matchAll(MARKER)) {
    const body = (match[1] ?? "").replace(/\s+/g, " ");
    if (body.trim() === "") continue;
    const line = text.slice(0, match.index).split("\n").length;
    found.push({ path, line, text: `[[TODO:${body}]]` });
  }
  return found;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

/** Plain text of a rendered marker: entities decoded, whitespace collapsed. */
function renderedText(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(parseInt(dec, 10))
    )
    .replace(/&([a-z]+);/gi, (all, name: string) => ENTITIES[name] ?? all)
    .replace(/\s+/g, " ");
}

/**
 * Literal `[[TODO` in the built HTML that the source scan did not report. Text
 * inside `pre` and `code` is skipped, like the source scan skips code. Returns
 * undefined when dist/ is absent or holds no HTML.
 */
function distHits(reported: Marker[]): Marker[] | undefined {
  const pages = walk(DIST).filter(file => file.endsWith(".html"));
  if (pages.length === 0) return undefined;
  const known = new Set(reported.map(marker => renderedText(marker.text)));
  const found: Marker[] = [];
  for (const page of pages) {
    const html = readFileSync(page, "utf8")
      .replace(/<pre\b[\s\S]*?<\/pre>/gi, "")
      .replace(/<code\b[\s\S]*?<\/code>/gi, "");
    for (const match of html.matchAll(/\[\[TODO[^<]{0,120}/g)) {
      const shown = renderedText(match[0]);
      const closed = /^[\s\S]*?\]\]/.exec(shown)?.[0] ?? shown;
      if (known.has(closed)) continue;
      const line = html.slice(0, match.index).split("\n").length;
      found.push({ path: posix(page), line, text: closed.trim() });
    }
  }
  return found;
}

// Fail closed: a gate that scanned nothing must not report "clean".
if (!existsSync("src")) {
  console.error(
    "error: Placeholder check: src/ not found. Run it from the repository root."
  );
  process.exit(2);
}
const files = [
  ...walk("src").filter(file => SCANNED.test(file)),
  ...EXTRA_FILES.filter(file => existsSync(file)),
];
if (files.length === 0) {
  console.error("error: Placeholder check: no files to scan.");
  process.exit(2);
}
const markers = files.flatMap(markersIn);

// GitHub workflow commands: properties escape `:` and `,` as well as `%` and newlines.
const escapeData = (value: string): string =>
  value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
const escapeProperty = (value: string): string =>
  escapeData(value).replace(/:/g, "%3A").replace(/,/g, "%2C");

const built = distHits(markers);
if (built === undefined && strict) {
  console.error(
    `error: Placeholder check: no HTML in ${DIST}/. Build first (./dev.sh build); the strict check scans the built output.`
  );
  process.exit(2);
}
const unreported = built ?? [];

if (markers.length === 0 && unreported.length === 0) {
  console.log("Placeholder check: no [[TODO]] markers found.");
  process.exit(0);
}

for (const marker of markers) {
  console.log(`${marker.path}:${marker.line}: ${marker.text}`);
  if (annotate) {
    const level = strict ? "error" : "warning";
    console.log(
      `::${level} file=${escapeProperty(marker.path)},line=${marker.line}::Unfilled placeholder: ${escapeData(marker.text)}`
    );
  }
}
for (const hit of unreported) {
  console.log(`${hit.path}: ${hit.text}`);
  if (annotate) {
    const level = strict ? "error" : "warning";
    console.log(
      `::${level} file=${escapeProperty(hit.path)}::Literal placeholder in the built output: ${escapeData(hit.text)}`
    );
  }
}

const count = markers.length;
const fileCount = new Set(markers.map(marker => marker.path)).size;
const counted = `${count} [[TODO]] ${count === 1 ? "marker remains" : "markers remain"} in ${fileCount} ${fileCount === 1 ? "file" : "files"}`;
const builtCounted = `${DIST}/ holds ${unreported.length} literal [[TODO]] ${unreported.length === 1 ? "string" : "strings"} the source scan did not report`;

if (strict) {
  if (count > 0) {
    console.error(
      `error: Placeholder check failed: ${counted}. Deploy blocked until they are filled.`
    );
  }
  if (unreported.length > 0) {
    console.error(
      `error: Placeholder check failed: ${builtCounted}. Deploy blocked until they are filled.`
    );
  }
  process.exit(1);
}
if (count > 0) {
  console.log(
    `warning: Placeholder check: ${counted}. Fill them before deploying (README: External setup checklist).`
  );
}
if (unreported.length > 0) {
  console.log(
    `warning: Placeholder check: ${builtCounted}. The strict check (deploy) fails on them.`
  );
}
