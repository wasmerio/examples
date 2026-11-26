// Finds the images of draft entries in dist/_astro. Astro emits every image a
// Markdown entry references, draft or not, so a draft's image would ship.
//
// A source is draft-only when a draft references it and no published entry
// references a file with the same bytes (Astro names a built asset after the
// first file with that content, so identical images share one dist file).
// Built files are matched on full source name and content hash, never the stem
// alone. Only assets inside the content tree are considered, and nothing whose
// bytes match a file under `src/assets`.
//
// Used by the build (`--prune`, before the search index) and by verify-dist,
// which fails on any file this returns.
//
// Run: node scripts/draft-assets.ts --prune
//
// Zero dependencies: `node:` builtins only and erasable TypeScript only.
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { basename, dirname, extname, join, resolve, sep } from "node:path";

const COLLECTIONS = ["blog", "notes", "projects", "pages"];
/** Astro names a built asset `<stem>.<hash>.<ext>`, the hash being one segment. */
const BUILT_HASH = /^[A-Za-z0-9_-]+$/;
const HASH_AND_EXT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/;

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const RELATIVE = /^\.{1,2}\//;

/** The `ogImage:` value of a frontmatter line: quoted, or bare up to a ` #` comment. */
function ogImageValue(line: string): string | undefined {
  const raw = /^ogImage:[ \t]*(.*)$/.exec(line)?.[1]?.trim();
  if (raw === undefined || raw === "") return undefined;
  const quote = raw[0];
  if (quote === '"' || quote === "'") {
    const end = raw.indexOf(quote, 1);
    return end === -1 ? undefined : raw.slice(1, end);
  }
  return raw.replace(/\s+#.*$/, "");
}

/** `./a%20b.png?x#y` -> `./a b.png`. The query and hash go before decoding. */
function clean(target: string): string {
  const path = target.replace(/[?#].*$/, "");
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

/**
 * Relative asset targets in an entry: Markdown images (inline, `<>`-wrapped,
 * reference definitions), `src` attributes, MDX imports and `ogImage`.
 */
function relativeReferences(source: string): string[] {
  const targets: string[] = [];
  const patterns = [
    /!\[(?:[^[\]\\]|\\.|\[[^\]]*\])*\]\(\s*(?:<([^>\r\n]+)>|([^)\s]+))/g,
    /^ {0,3}\[(?:[^\]\\]|\\.)+\]:\s*(?:<([^>\r\n]+)>|(\S+))/gm,
    /\bsrc\s*=\s*\{?\s*["'`]([^"'`\r\n]+)["'`]/g,
    /\bimport\s+(?:[^"'`;]*?\s+from\s+)?["']([^"'\r\n]+)["']/g,
    /\bimport\s*\(\s*["']([^"'\r\n]+)["']\s*\)/g,
  ];
  for (const pattern of patterns)
    for (const match of source.matchAll(pattern)) {
      const target = match[1] ?? match[2];
      if (target !== undefined && RELATIVE.test(target))
        targets.push(clean(target));
    }
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? "";
  for (const line of frontmatter.split(/\r?\n/)) {
    const value = ogImageValue(line);
    if (value !== undefined && RELATIVE.test(value)) targets.push(clean(value));
  }
  return targets;
}

function digest(file: string): string {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function isDraft(source: string): boolean {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? "";
  return /^draft:\s*true\s*$/m.test(frontmatter);
}

/** Files in `<dist>/_astro/` that belong only to draft entries. */
export function findDraftOnlyAssets(
  dist = "dist",
  contentRoot = "src/content",
  assetsRoot = "src/assets"
): string[] {
  const root = resolve(contentRoot);
  const draftSources = new Map<string, string>();
  const publishedDigests = new Set<string>();
  for (const collection of COLLECTIONS) {
    const base = join(contentRoot, collection);
    for (const file of walk(base)) {
      if (!/\.mdx?$/.test(file)) continue;
      // Underscore folders hold assets, they are not entries.
      const inside = file.slice(base.length + 1).split(sep);
      if (inside.some(part => part.startsWith("_"))) continue;
      const source = readFileSync(file, "utf8");
      const draft = isDraft(source);
      for (const target of relativeReferences(source)) {
        const resolved = resolve(dirname(file), target);
        if (!existsSync(resolved) || !statSync(resolved).isFile()) continue;
        if (!draft) publishedDigests.add(digest(resolved));
        else if (resolved.startsWith(root + sep))
          draftSources.set(resolved, digest(resolved));
      }
    }
  }
  const assets = join(dist, "_astro");
  if (draftSources.size === 0 || !existsSync(assets)) return [];
  // Icons, fonts and other site assets are never draft content.
  const protectedDigests = new Set(walk(assetsRoot).map(digest));
  const wanted = [...draftSources].filter(
    ([, hash]) => !publishedDigests.has(hash) && !protectedDigests.has(hash)
  );
  const names = readdirSync(assets, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name);
  const doomed = new Set<string>();
  for (const [source, hash] of wanted) {
    const ext = extname(source);
    const stem = basename(source, ext);
    for (const name of names) {
      // The original is `<stem>.<hash><ext>` and holds the source bytes.
      if (!name.startsWith(`${stem}.`)) continue;
      if (
        name.slice(name.length - ext.length).toLowerCase() !== ext.toLowerCase()
      )
        continue;
      const built = name.slice(stem.length + 1, name.length - ext.length);
      if (!BUILT_HASH.test(built) || digest(join(assets, name)) !== hash)
        continue;
      doomed.add(name);
      // Its optimized variants are `<stem>.<hash>_<variant>.<any ext>`.
      for (const other of names)
        if (
          other.startsWith(`${stem}.${built}_`) &&
          HASH_AND_EXT.test(other.slice(stem.length + 1))
        )
          doomed.add(other);
    }
  }
  return [...doomed].map(name => join(assets, name)).sort();
}

if (
  process.argv[1] !== undefined &&
  import.meta.filename === resolve(process.argv[1]) &&
  process.argv.includes("--prune")
) {
  const files = findDraftOnlyAssets();
  for (const file of files) rmSync(file);
  console.log(`draft-assets: pruned ${files.length} file(s)`);
}
