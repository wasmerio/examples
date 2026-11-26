#!/usr/bin/env node
// check-examples.mjs - drift guard for examples/ (nimbus templates-check in
// miniature). For each example repo under examples/ it verifies:
//   1. skills/site-content-sync/** is byte-identical to the canonical tree
//      (examples/_shared/site-content-sync/),
//   2. .github/workflows/sync-*.yml matches what the generator would produce
//      from the canonical templates (EXAMPLE_WORKFLOWS in examples-lib.mjs),
//   3. the example's own content passes its own validator (validate.mjs),
//      proving the shipped validator works and the example content is valid.
//
// Exits non-zero on any drift. Pure Node stdlib - no dependencies, no build.
//
// Usage: node scripts/check-examples.mjs   (or: npm run check:examples)

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  EXAMPLE_WORKFLOWS,
  EXAMPLES_DIR,
  SHARED_SKILL_DIR,
  listExamples,
  renderWorkflow,
  walkFiles,
} from './examples-lib.mjs';

let failed = false;
function error(msg) {
  console.error(`  ✗ ${msg}`);
  failed = true;
}

/** Byte-compare the example's skill copy against the canonical tree. */
function checkSkillCopy(exampleDir, example) {
  const copyDir = join(exampleDir, 'skills', 'site-content-sync');
  if (!existsSync(copyDir)) {
    error(`${example}: skills/site-content-sync/ is missing (run npm run sync:examples)`);
    return;
  }

  const canonical = walkFiles(SHARED_SKILL_DIR);
  const copy = walkFiles(copyDir);

  for (const rel of canonical) {
    const a = readFileSync(join(SHARED_SKILL_DIR, rel));
    const b = readFileSync(join(copyDir, rel));
    if (!a.equals(b)) {
      error(
        `${example}: skills/site-content-sync/${rel} differs from canonical (run npm run sync:examples)`
      );
    }
  }
  for (const rel of copy) {
    if (!canonical.includes(rel)) {
      error(
        `${example}: skills/site-content-sync/${rel} is not in the canonical tree (run npm run sync:examples)`
      );
    }
  }
}

/** Compare the example's workflows against what the generator would produce. */
function checkWorkflows(exampleDir, example, specs) {
  const wfDir = join(exampleDir, '.github', 'workflows');
  const expectedNames = new Set(specs.map((s) => s.template));

  for (const spec of specs) {
    const { name, content } = renderWorkflow(spec);
    const dest = join(wfDir, name);
    if (!existsSync(dest)) {
      error(`${example}: .github/workflows/${name} is missing (run npm run sync:examples)`);
      continue;
    }
    if (readFileSync(dest, 'utf8') !== content) {
      error(
        `${example}: .github/workflows/${name} differs from the generated template (run npm run sync:examples)`
      );
    }
  }

  if (existsSync(wfDir)) {
    for (const f of readdirSync(wfDir)) {
      if (f.startsWith('sync-') && f.endsWith('.yml') && !expectedNames.has(f)) {
        error(
          `${example}: .github/workflows/${f} is stale - not in the example's workflow set (run npm run sync:examples)`
        );
      }
    }
  }
}

/** Run the example's own validator against its content, from its repo root. */
function checkValidation(exampleDir, example) {
  const res = spawnSync(
    process.execPath,
    ['skills/site-content-sync/scripts/validate.mjs'],
    { cwd: exampleDir, encoding: 'utf8' }
  );

  for (const line of (res.stdout || '').trim().split('\n')) {
    if (line) console.log(`    ${line}`);
  }
  for (const line of (res.stderr || '').trim().split('\n')) {
    if (line) console.error(`    ${line}`);
  }

  if (res.status !== 0) {
    error(
      `${example}: its own validator exited ${res.status === null ? `(signal ${res.signal})` : res.status}`
    );
  }
}

function main() {
  const examples = listExamples();
  if (examples.length === 0) {
    console.error('✗ no example dirs found under examples/');
    process.exit(1);
  }

  console.log('Checking examples consistency...');
  for (const example of examples) {
    const exampleDir = join(EXAMPLES_DIR, example);
    const specs = EXAMPLE_WORKFLOWS[example];

    console.log(`\n[${example}]`);
    checkSkillCopy(exampleDir, example);
    if (!specs) {
      error(
        `${example}: not declared in EXAMPLE_WORKFLOWS (scripts/examples-lib.mjs)`
      );
    } else {
      checkWorkflows(exampleDir, example, specs);
    }
    checkValidation(exampleDir, example);
  }

  console.log('');
  if (failed) {
    console.error(
      '✗ examples check FAILED - drift detected (see above). Run `npm run sync:examples` to regenerate.'
    );
    process.exit(1);
  }
  console.log(
    '✓ all examples consistent: skill copies match canonical, workflows match templates, content validates.'
  );
}

main();
