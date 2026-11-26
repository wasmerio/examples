#!/usr/bin/env node
// Applies a sync-delete.list: removes listed files/directories from a hub
// content collection during sync, so content retired from the source project
// is also removed from the hub. The normal rsync copy only adds/overwrites;
// it never deletes hub-only files (by design, to protect content contributed
// by other projects). This script provides an explicit, reviewed deletion
// channel: only the paths the source project lists are removed.
//
// Usage:
//   node apply-delete-list.mjs <hub-collection-dir> <prefix>
//
//   <hub-collection-dir>  The hub collection directory to delete inside, e.g.
//                         "$CLONE_DIR/src/content/posts".
//   <prefix>              The external-side namespace this workflow owns, e.g.
//                         "posts". Only list entries starting with "<prefix>/"
//                         are processed; entries for the other namespace
//                         (e.g. "docs/..." in sync-posts) are skipped silently
//                         because the sibling sync workflow handles them.
//
// The list is read from "$GITHUB_WORKSPACE/sync-delete.list" if it exists; if
// not, the script is a no-op. Each non-empty, non-comment line is a path
// relative to the external project root, matching the external file path so
// it maps through the copy:
//   posts/en/old-post.md  ->  src/content/posts/en/old-post.md         (file)
//   docs/en/legacy/       ->  src/content/docs/${PRODUCT}/en/legacy/   (whole dir)
// For docs the ${PRODUCT}/ segment is part of the <hub-collection-dir> arg
// passed by sync-docs.yml (already includes the product), so the list entry
// itself stays flat (docs/en/..., mirroring the external repo).
// A trailing slash means "delete the whole directory".
//
// Blank lines and lines starting with '#' are ignored. Unsafe paths (parent
// traversal "..", absolute paths, or anything that resolves outside the
// collection dir, including the collection dir itself) are skipped with a
// warning. Symlinks are removed as links (never followed). The script never
// exits non-zero: a missing list, a not-found entry, or an unsafe entry is a
// no-op so it cannot block the sync. The workflow's `git add .` afterwards
// stages the deletions.

import { existsSync, rmSync, lstatSync, readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

const [, , hubDirArg, prefix] = process.argv;
if (!hubDirArg || !prefix) {
  console.error('usage: apply-delete-list.mjs <hub-collection-dir> <prefix>');
  process.exit(2);
}

const HUB_DIR = resolve(hubDirArg);
const WORKSPACE = process.env.GITHUB_WORKSPACE || process.cwd();
const LIST_PATH = resolve(WORKSPACE, 'sync-delete.list');

if (!existsSync(LIST_PATH)) {
  console.log('sync-delete.list: not found, nothing to delete.');
  process.exit(0);
}

/** True if `child` is strictly inside `parent` (neither equal nor escaping). */
function isWithin(parent, child) {
  const rel = relative(parent, child);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
}

const lines = readFileSync(LIST_PATH, 'utf8').split(/\r?\n/);
let deleted = 0;
let missing = 0;
let skipped = 0;

for (const raw of lines) {
  const line = raw.trim();
  if (line === '' || line.startsWith('#')) continue;

  // Only process entries for this workflow's namespace; the sibling workflow
  // (sync-docs vs sync-posts) handles the other one.
  if (!line.startsWith(prefix + '/')) {
    skipped++;
    continue;
  }

  const rel = line.slice(prefix.length + 1).replace(/\/+$/, '');

  // The `landing` namespace renames at copy time: landing/<locale>.md ->
  // product-info/<locale>/${PRODUCT}.md. So the delete target is not a straight
  // path mirror (unlike posts/docs) but <locale>/${PRODUCT}.md under HUB_DIR.
  let targetRel = rel;
  if (prefix === 'landing') {
    const locale = rel.replace(/\.md$/, '');
    const SUPPORTED = ['en', 'zh-Hans'];
    if (!SUPPORTED.includes(locale)) {
      console.warn(`  skip (not a known locale): ${line}`);
      skipped++;
      continue;
    }
    if (!process.env.PRODUCT) {
      console.warn(`  skip (PRODUCT env not set; needed for landing deletes): ${line}`);
      skipped++;
      continue;
    }
    targetRel = `${locale}/${process.env.PRODUCT}.md`;
  }
  const target = resolve(HUB_DIR, targetRel);

  if (!isWithin(HUB_DIR, target)) {
    // Catches "..", absolute paths, the bare "<prefix>/" (collection root),
    // and any traversal like "a/../../etc".
    console.warn(`  skip unsafe (outside collection): ${line}`);
    skipped++;
    continue;
  }

  if (!existsSync(target)) {
    console.warn(`  not found: ${prefix}/${rel}`);
    missing++;
    continue;
  }

  const stat = lstatSync(target);
  if (stat.isDirectory()) {
    rmSync(target, { recursive: true, force: true });
    console.log(`  deleted dir: ${prefix}/${rel}/`);
  } else {
    rmSync(target, { force: true });
    console.log(`  deleted: ${prefix}/${rel}`);
  }
  deleted++;
}

console.log(
  `sync-delete.list (${prefix}): ${deleted} deleted, ${missing} not found, ${skipped} skipped.`
);
