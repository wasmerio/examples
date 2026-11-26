#!/usr/bin/env node
// sync-examples.mjs - regenerate each examples/* sample repo's copies of the
// sync skill from the canonical tree (nimbus "canonical source -> generator ->
// verified artifacts" in miniature).
//
// The canonical skill lives at examples/_shared/site-content-sync/
// (SKILL.md + scripts/ + templates/). This script:
//   1. Mirror-copies it into every example's skills/site-content-sync/
//      (extra files in a copy that are not in the canonical tree are removed),
//   2. Regenerates each example's .github/workflows/sync-*.yml from the
//      canonical templates (see EXAMPLE_WORKFLOWS in examples-lib.mjs) and
//      removes stale sync-*.yml files not in that example's set.
//
// Hand-edits happen ONLY in the canonical tree (or in scripts/examples-lib.mjs
// for per-example workflow config); the copies are sync output.
//
// Idempotent: prints what changed, exits 0 on a clean tree.
//
// Usage: node scripts/sync-examples.mjs   (or: npm run sync:examples)

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import {
  EXAMPLE_WORKFLOWS,
  EXAMPLES_DIR,
  SHARED_SKILL_DIR,
  listExamples,
  renderWorkflow,
  walkFiles,
} from './examples-lib.mjs';

/** Mirror-copy `src` into `dest`: every src file is written (created or
 *  overwritten), and any dest file not present in src is removed. Returns
 *  human-readable change messages. */
function mirrorCopy(src, dest, label) {
  const messages = [];
  const srcFiles = walkFiles(src);
  const destFiles = walkFiles(dest);

  for (const rel of srcFiles) {
    const s = join(src, rel);
    const d = join(dest, rel);
    const sBytes = readFileSync(s);
    const dBytes = existsSync(d) ? readFileSync(d) : null;
    if (dBytes === null || !sBytes.equals(dBytes)) {
      mkdirSync(dirname(d), { recursive: true });
      writeFileSync(d, sBytes);
      messages.push(
        dBytes === null ? `${label}/${rel} (created)` : `${label}/${rel} (updated)`
      );
    }
  }

  for (const rel of destFiles) {
    if (!srcFiles.includes(rel)) {
      rmSync(join(dest, rel), { force: true });
      messages.push(`${label}/${rel} (removed - not in canonical tree)`);
    }
  }

  return messages;
}

/** Regenerate an example's .github/workflows/sync-*.yml from the canonical
 *  templates and drop stale sync-*.yml files. Returns change messages. */
function syncWorkflows(exampleDir, specs) {
  const messages = [];
  const wfDir = join(exampleDir, '.github', 'workflows');
  const expectedNames = new Set(specs.map((s) => s.template));

  for (const spec of specs) {
    const { name, content } = renderWorkflow(spec);
    const dest = join(wfDir, name);
    const current = existsSync(dest) ? readFileSync(dest, 'utf8') : null;
    if (current !== content) {
      mkdirSync(wfDir, { recursive: true });
      writeFileSync(dest, content);
      messages.push(
        `.github/workflows/${name} (${current === null ? 'created' : 'updated'})`
      );
    }
  }

  if (existsSync(wfDir)) {
    for (const f of readdirSync(wfDir)) {
      if (f.startsWith('sync-') && f.endsWith('.yml') && !expectedNames.has(f)) {
        rmSync(join(wfDir, f), { force: true });
        messages.push(
          `.github/workflows/${f} (removed - not in example's workflow set)`
        );
      }
    }
  }

  return messages;
}

function main() {
  if (!existsSync(SHARED_SKILL_DIR)) {
    console.error(`✗ canonical skill tree not found: ${SHARED_SKILL_DIR}`);
    process.exit(1);
  }

  const examples = listExamples();
  let changedCount = 0;

  console.log('Syncing examples from canonical skill tree...\n');
  for (const example of examples) {
    const exampleDir = join(EXAMPLES_DIR, example);
    const specs = EXAMPLE_WORKFLOWS[example];

    if (!specs) {
      console.error(
        `✗ ${example}: not declared in EXAMPLE_WORKFLOWS (scripts/examples-lib.mjs).`
      );
      console.error(
        '  Add an entry there so its workflow is generated and drift-checked, then re-run.'
      );
      process.exitCode = 1;
      continue;
    }

    const messages = [
      ...mirrorCopy(
        SHARED_SKILL_DIR,
        join(exampleDir, 'skills', 'site-content-sync'),
        'skills/site-content-sync'
      ),
      ...syncWorkflows(exampleDir, specs),
    ];

    console.log(example);
    if (messages.length === 0) {
      console.log('  (already in sync)');
    } else {
      for (const m of messages) console.log(`  ${m}`);
      changedCount += 1;
    }
  }

  console.log('');
  if (process.exitCode === 1) {
    console.error('✗ sync finished with errors (see above).');
    process.exit(1);
  }
  if (changedCount === 0) {
    console.log('✓ all examples in sync - nothing changed.');
  } else {
    console.log(`✓ regenerated ${changedCount} example(s); re-run to confirm a clean tree.`);
  }
}

main();
