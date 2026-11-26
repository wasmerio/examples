#!/usr/bin/env node
// check-upstream.mjs - "can I upgrade?" drift guard for template adopters
// (the mirror image of check-examples.mjs).
//
// A template repo and its adopters diverge: the upstream repo evolves
// Machinery, each adopter rebrands Your-site files. Git 3-way merges handle
// the common cases, but we verified they silently lose changes in two
// scenarios (see UPGRADING.md):
//
//   1. an adopter RENAMES/MOVES a Machinery file - the merge succeeds, the
//      upstream path is gone, no conflict, and the site can break (e.g. the
//      index route disappears);
//   2. an adopter EDITS a Machinery file before an upstream change - git
//      considers it "already merged" (the adopter's base already had the old
//      content, and their edit is newer than the upstream edit), so the
//      upstream fix is silently dropped.
//
// Git cannot detect either case. What CAN: byte-comparing every Machinery
// file against the bytes shipped in the latest upstream release. That is this
// script, for a template repo itself: it verifies the current tree still
// contains the release's Machinery bytes, and reports anything an adopter
// would have to reconcile by hand.
//
// Run it inside an UPSTREAM-maintained checkout (this repo, on a release
// branch). The baseline is the newest vX.Y.Z tag (override with
// UPSTREAM_TAG); on an adopter fork the same check needs network access to
// the upstream repo - that is documented in UPGRADING.md as an opt-in extra,
// not part of this script.
//
// Exit: 0 = clean, 1 = drift found (actionable lines above).
//
// Usage: node scripts/check-upstream.mjs        (or: npm run check:upstream)

import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const TAG = process.env.UPSTREAM_TAG || resolveLatestTag();

/** Resolve the newest vX.Y.Z tag (semver-ish, 'v' prefix required) to use as
 *  the upgrade baseline. Tags are the release contract; if none exists yet,
 *  the caller should set UPSTREAM_TAG explicitly (or tag the first release). */
function resolveLatestTag() {
  try {
    const tags = execFileSync('git', ['tag', '-l', 'v[0-9]*'], {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean)
      // Sort by version, not lexicographic: v1.10.0 > v1.9.0.
      .sort((a, b) => {
        const pa = a.slice(1).split('.').map(Number);
        const pb = b.slice(1).split('.').map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
          const d = (pa[i] || 0) - (pb[i] || 0);
          if (d !== 0) return d;
        }
        return 0;
      });
    return tags[tags.length - 1] || null;
  } catch {
    return null;
  }
}

// ---- Machinery/contract paths the template ships to adopters (hardcoded
//      deliberately - the set itself is part of the upgrade contract and
//      should not drift). Every path here is matched against the release
//      tree and checked byte-for-byte.
const CONTRACT = [
  'astro.config.mjs',
  'tsconfig.json',
  'src/content.config.ts',
  'src/env.d.ts',
  'src/lib/',
  'src/pages/',
  'scripts/',
  'skills/',
  '.github/workflows/',
  'docs/en/upgrading.md',
];

/** All files under the release tag (sorted). */
function releaseFiles() {
  const out = execFileSync('git', ['ls-tree', '-r', '--name-only', TAG], {
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean)
    .sort();
  return out;
}

/** All files in the working tree (sorted). */
function currentFiles() {
  const out = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)
    .sort();
  return out;
}

/** True if `rel` is a contract path (or lives under one). */
function isContract(rel) {
  return CONTRACT.some(
    (p) => rel === p || (p.endsWith('/') && rel.startsWith(p))
  );
}

function main() {
  if (!existsSync(join(ROOT, '.git'))) {
    console.error('✗ check:upstream must run inside a git checkout (this repo).');
    process.exit(1);
  }

  let tagOk = true;
  try {
    execFileSync('git', ['rev-parse', '--verify', `${TAG}^{commit}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  } catch {
    tagOk = false;
  }
  if (!tagOk) {
    console.error(
      `✗ no release tag to check against (tried ${TAG}). Tag a release first ` +
        '(git tag vX.Y.Z && git push --tags), or set UPSTREAM_TAG explicitly.'
    );
    process.exit(1);
  }

  const release = releaseFiles().filter(isContract);
  const current = currentFiles().filter(isContract);
  const releaseSet = new Set(release);
  const currentSet = new Set(current);

  let failed = false;
  const report = (kind, msg) => {
    console.error(`  ${kind} ${msg}`);
    failed = true;
  };

  // 1. Contract files shipped in the release must still exist (a rename /
  //    delete here is exactly the silent-loss scenario we guard against).
  for (const rel of release) {
    if (!currentSet.has(rel)) {
      report('MISSING', `${rel} (was in ${TAG})`);
    }
  }

  // 2. For contract files that exist on both sides, compare byte-for-byte.
  //    Adopters must not hand-edit these; a diff is actionable drift.
  for (const rel of release) {
    if (!currentSet.has(rel)) continue;
    const a = readFileSync(join(ROOT, rel));
    const b = Buffer.from(
      execFileSync('git', ['show', `${TAG}:${rel}`], { encoding: 'utf8' })
    );
    if (!a.equals(b)) {
      report('DIFFERS', `${rel} (adopter edit - must reconcile or revert)`);
    }
  }

  // 3. Contract files in the working tree that are NOT in the release are
  //    adopter additions (a new src/lib helper, a new workflow). These are
  //    allowed but worth listing - they are not Machinery and will not be
  //    maintained upstream.
  const additions = current.filter((rel) => !releaseSet.has(rel));
  if (additions.length) {
    console.log(`  + ${additions.length} contract-path file(s) not in ${TAG} (adopter additions - not Machinery):`);
    for (const rel of additions) console.log(`    - ${rel}`);
  }

  console.log('');
  if (failed) {
    console.error(
      `✗ check:upstream FAILED against ${TAG}. The adopter must reconcile the ` +
        'flagged files before the next upgrade merge (see UPGRADING.md).'
    );
    process.exit(1);
  }
  console.log(
    `✓ ${release.length} Machinery/contract files match ${TAG} byte-for-byte. ` +
      'Clean upgrade state - a 3-way merge will be routine.'
  );
}

main();
