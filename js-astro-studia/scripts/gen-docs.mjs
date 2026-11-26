/**
 * Keep the two generated regions in step with scripts/features.mjs:
 *
 *   src/features.ts   the flags, and the dependencies between them
 *   docs/Features.md  the table of what each feature is and owns
 *
 *   npm run docs         rewrite both regions
 *   npm run docs:check   fail if either is out of date (prints a diff)
 *
 * Only the text between a target's markers is touched, and your true/false
 * values are read out of the old region and written back, so regenerating
 * never switches a feature behind you.
 *
 * `docs:check` also catches an impossible combination in CI without building:
 * src/features.ts asserts the same rules at config load, but `astro check`
 * does not execute the module.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { FEATURES, check as checkSelection } from './features.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const checkOnly = process.argv.includes('--check');

// ---- the docs table --------------------------------------------------------

/** `|` ends a Markdown cell, and a `<…>` is parsed as HTML and vanishes from the
    page. The manifest is prose written for humans and contains both. */
const cell = (s) =>
  String(s).replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, ' ');

const code = (items) => (items.length === 0 ? '—' : items.map((i) => `\`${cell(i)}\``).join(', '));

const prose = (items) => (items.length === 0 ? '—' : items.map(cell).join('; '));

const COLUMNS = ['Feature', 'Flag', 'What you lose', 'Presets', 'Needs', 'Owns', 'Also by hand'];

const needs = (f) => {
  const all = [...f.requires.map((r) => `\`${r}\``)];
  if (f.requiresAny?.length) all.push(f.requiresAny.map((r) => `\`${r}\``).join(' or '));
  return all.length === 0 ? '—' : all.join(', ');
};

const row = (f) => [
  cell(f.label),
  `\`${f.id}\``,
  cell(f.blurb),
  f.presets.length === 0 ? '—' : f.presets.map((p) => `\`${p}\``).join(', '),
  needs(f),
  code(f.paths),
  prose(f.manual),
];

const table = () =>
  [
    `| ${COLUMNS.join(' | ')} |`,
    `| ${COLUMNS.map(() => '---').join(' | ')} |`,
    ...FEATURES.map((f) => `| ${row(f).join(' | ')} |`),
  ].join('\n');

// ---- the flag region -------------------------------------------------------

/** The booleans currently in the file, so regenerating preserves them. A new
    feature starts on, like everything else. */
function currentFlags(region) {
  const flags = new Map();
  for (const [, id, value] of region.matchAll(/^\s*(\w+): (true|false),/gm)) {
    flags.set(id, value === 'true');
  }
  return flags;
}

/** Quoted ids on one line, for the dependency tables. */
const ids = (list) => list.map((i) => `'${i}'`).join(', ');

function flags(region) {
  const was = currentFlags(region);
  const lines = [];

  lines.push('/** The flags. One boolean per feature; `npm run init` writes them for you. */');
  lines.push('export const FEATURES = {');
  for (const f of FEATURES) {
    lines.push(`  /** ${f.blurb} */`);
    lines.push(`  ${f.id}: ${was.get(f.id) ?? true},`);
  }
  // No `as const`: literal types would make TypeScript call the other branch
  // of every `FEATURES.x ?` dead code and collapse what follows.
  lines.push('};');
  lines.push('');

  const requires = FEATURES.filter((f) => f.requires.length > 0);
  lines.push('/** `a: [b]` — `a` cannot build with `b` off. */');
  lines.push('const REQUIRES: Partial<Record<FeatureId, FeatureId[]>> = {');
  for (const f of requires) lines.push(`  ${f.id}: [${ids(f.requires)}],`);
  lines.push('};');
  lines.push('');

  const any = FEATURES.filter((f) => f.requiresAny?.length);
  lines.push('/** `a: [b, c]` — `a` needs at least one of `b` or `c`. */');
  lines.push('const REQUIRES_ANY: Partial<Record<FeatureId, FeatureId[]>> = {');
  for (const f of any) lines.push(`  ${f.id}: [${ids(f.requiresAny)}],`);
  lines.push('};');

  return lines.join('\n');
}

// ---- targets ---------------------------------------------------------------

const TARGETS = [
  {
    rel: 'src/features.ts',
    begin: '// BEGIN GENERATED: flags',
    end: '// END GENERATED: flags',
    note: '// Generated from scripts/features.mjs by `npm run docs`; your values are kept.',
    body: flags,
  },
  {
    rel: 'docs/Features.md',
    begin: '<!-- BEGIN GENERATED: features -->',
    end: '<!-- END GENERATED: features -->',
    note: '<!-- Generated from scripts/features.mjs by `npm run docs`. Do not edit by hand. -->',
    body: table,
  },
];

/** The target's region replaced, markers and note included. The markers must
    already be there — guessing where they belong is how a generator eats a
    file it did not write. */
function render(target, src) {
  const b = src.indexOf(target.begin);
  const e = src.indexOf(target.end);
  if (b === -1 || e === -1) {
    fail(
      `${target.rel} is missing the ${b === -1 ? 'BEGIN' : 'END'} marker ` +
        `(${b === -1 ? target.begin : target.end}). Put it back where the region belongs.`,
    );
  }
  if (e < b) fail(`${target.rel}: the END marker comes before the BEGIN marker.`);

  const region = src.slice(b, e);
  const block = [target.begin, target.note, '', target.body(region), '', target.end].join('\n');
  return src.slice(0, b) + block + src.slice(e + target.end.length);
}

// ---- diff (line based, no dependency) --------------------------------------

function diff(a, b) {
  const A = a.split('\n');
  const B = b.split('\n');
  // Longest common subsequence over lines. These files are a few hundred lines;
  // the quadratic table is free and the output is easy to read.
  const n = A.length;
  const m = B.length;
  const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      lcs[i][j] = A[i] === B[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      out.push(`  ${A[i]}`);
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push(`- ${A[i]}`);
      i += 1;
    } else {
      out.push(`+ ${B[j]}`);
      j += 1;
    }
  }
  for (; i < n; i += 1) out.push(`- ${A[i]}`);
  for (; j < m; j += 1) out.push(`+ ${B[j]}`);

  // Only the changed neighbourhoods are interesting.
  const keep = new Set();
  out.forEach((l, k) => {
    if (l.startsWith('- ') || l.startsWith('+ ')) {
      for (let d = -2; d <= 2; d += 1) keep.add(k + d);
    }
  });
  const shown = [];
  let gap = false;
  out.forEach((l, k) => {
    if (keep.has(k)) {
      shown.push(l);
      gap = false;
    } else if (!gap) {
      shown.push('  …');
      gap = true;
    }
  });
  return shown.join('\n');
}

// ---- prettier --------------------------------------------------------------

/** Formatted through prettier because `npm run check` runs `prettier --check`
    over the repo: an unformatted region would fail that check forever. */
async function format(text, file) {
  try {
    const prettier = await import('prettier');
    const config = (await prettier.resolveConfig(file)) ?? {};
    return await prettier.format(text, { ...config, filepath: file });
  } catch (err) {
    console.error(`! prettier could not format ${file} (${err.message}); writing unformatted.`);
    return text;
  }
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// ---- the combination itself -------------------------------------------------

/** The same rules src/features.ts asserts, on what it currently says. */
function assertCombination(src) {
  const on = [...currentFlags(src.slice(src.indexOf('export const FEATURES')))]
    .filter(([, value]) => value)
    .map(([id]) => id);

  const { missing, unmet } = checkSelection(on);
  const problems = [
    ...missing.map(({ id, dep }) => `${id} is on and ${dep} is off`),
    ...unmet.map(({ id, options }) => `${id} is on and all of ${options.join(', ')} are off`),
  ];

  const source = /FEED_SOURCE: 'posts' \| 'papers' = '(posts|papers)'/.exec(src)?.[1];
  const needed = source === 'posts' ? 'blog' : 'papers';
  if (on.includes('feed') && source && !on.includes(needed)) {
    problems.push(`FEED_SOURCE is '${source}' and ${needed} is off`);
  }

  if (problems.length > 0) {
    fail(
      `src/features.ts holds a combination that cannot build:\n` +
        problems.map((p) => `    · ${p}`).join('\n'),
    );
  }
}

// ---- main ------------------------------------------------------------------

let stale = 0;

for (const target of TARGETS) {
  const file = join(ROOT, target.rel);
  const current = readFileSync(file, 'utf8');
  const next = await format(render(target, current), file);

  if (current === next) {
    console.log(`${checkOnly ? '✓' : '·'} ${target.rel} is up to date`);
  } else if (checkOnly) {
    console.error(`✗ ${target.rel} is out of date. Run \`npm run docs\`.\n`);
    console.error(diff(current, next));
    stale += 1;
  } else {
    writeFileSync(file, next);
    console.log(`✓ wrote ${target.rel} (${FEATURES.length} features)`);
  }
}

assertCombination(readFileSync(join(ROOT, 'src/features.ts'), 'utf8'));

if (stale > 0) process.exit(1);
