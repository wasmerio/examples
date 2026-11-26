/**
 * Set this template up: pick the features you want, and say who it is about.
 *
 *   npm run init                                 interactive
 *   node scripts/init.mjs --preset profile       non-interactive
 *   node scripts/init.mjs --features cv,imprint  exactly these, nothing else
 *   node scripts/init.mjs --preset project --dry-run
 *
 * IT DELETES NOTHING: it writes booleans into src/features.ts, four strings
 * into src/consts.ts and two into src/content/pages/site/site.md, and nothing
 * else. Run it twice and the second run is a no-op.
 *
 * It refuses a combination that cannot build rather than fixing one, because
 * `papers` without `authors` is a choice between two features and not this
 * script's to guess. src/features.ts asserts the same rules at build time.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { FEATURES, PRESETS, PRESET_FEED, byId, check, featuresFor } from './features.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FLAGS = 'src/features.ts';
const CONSTS = 'src/consts.ts';
const SITE_TEXT = 'src/content/pages/site/site.md';

// ---------------------------------------------------------------------------
// output
// ---------------------------------------------------------------------------

const say = (line = '') => console.log(line);
const step = (line) => console.log(`  · ${line}`);
const warn = (line) => console.log(`  ! ${line}`);

class Abort extends Error {}

const stop = (msg) => {
  throw new Abort(msg);
};

const ESC = String.fromCharCode(27);
const bold = (text) => (output.isTTY ? `${ESC}[1m${text}${ESC}[0m` : text);

// ---------------------------------------------------------------------------
// arguments
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { preset: null, features: null, dryRun: false, yes: false, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = () => {
      const given = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[++index];
      if (!given) stop(`${arg} needs a value`);
      return given;
    };
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--yes' || arg === '-y') opts.yes = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--preset' || arg.startsWith('--preset=')) opts.preset = value();
    else if (arg === '--features' || arg.startsWith('--features=')) {
      opts.features = value()
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
    } else stop(`unknown argument: ${arg}`);
  }
  if (opts.preset && !PRESETS.includes(opts.preset)) {
    stop(`unknown preset "${opts.preset}" — known presets: ${PRESETS.join(', ')}`);
  }
  for (const id of opts.features ?? []) {
    if (!byId(id)) {
      stop(`unknown feature "${id}" — known: ${FEATURES.map((feature) => feature.id).join(', ')}`);
    }
  }
  return opts;
}

const HELP = `
Set up Studia Theme. Writes src/features.ts, src/consts.ts and
src/content/pages/site/site.md; deletes nothing.

  node scripts/init.mjs                      pick interactively
  node scripts/init.mjs --preset <${PRESETS.join('|')}>
  node scripts/init.mjs --features a,b,c     turn on exactly these
  node scripts/init.mjs --dry-run            print the changes, write nothing
  node scripts/init.mjs --yes                keep every current string, no prompts

Features: ${FEATURES.map((feature) => feature.id).join(', ')}
`;

// ---------------------------------------------------------------------------
// reading and writing the two files
// ---------------------------------------------------------------------------

const abs = (rel) => join(ROOT, rel);
const slurp = (rel) => readFileSync(abs(rel), 'utf8');

/** The bounds of one `export const <NAME> = { … } as const;` block. */
function constBlock(src, name) {
  const open = src.indexOf(`export const ${name} = {`);
  if (open === -1) stop(`${CONSTS}: no \`export const ${name} = {\` — edit it by hand`);
  const close = src.indexOf('\n} as const;', open);
  if (close === -1) {
    stop(`${CONSTS}: \`${name}\` does not end in \`} as const;\` — edit it by hand`);
  }
  return [open, close];
}

const STRING_VALUE = String.raw`'(?:[^'\\]|\\.)*'`;

/**
 * Replace `key: '<old>'` inside one `export const <NAME>` block. Scoped to the
 * block because `title` and `url` occur in half a dozen other objects here. A
 * missing key is a hard stop, not a skip: writing half the answers and
 * reporting success is worse.
 */
function setString(src, name, key, value) {
  const [open, close] = constBlock(src, name);
  const block = src.slice(open, close);
  const line = new RegExp(`^(\\s*${key}: )${STRING_VALUE}(,?)$`, 'm');
  if (!line.test(block)) {
    stop(`${CONSTS}: \`${name}.${key}\` is not a one-line single-quoted string — edit by hand`);
  }
  const quoted = `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  // A function replacer, because a literal `$` in a URL or a name would
  // otherwise be read as a backreference.
  const next = block.replace(line, (_match, head, tail) => head + quoted + tail);
  return src.slice(0, open) + next + src.slice(close);
}

function readString(src, name, key) {
  const [open, close] = constBlock(src, name);
  const match = new RegExp(`^\\s*${key}: '((?:[^'\\\\]|\\\\.)*)',?$`, 'm').exec(
    src.slice(open, close),
  );
  if (!match) stop(`${CONSTS}: cannot read \`${name}.${key}\` — edit it by hand`);
  return match[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

/**
 * A top-level `key: '<value>'` line in a page's front matter. Single-quoted
 * YAML, where a quote is written twice; anything else is a hard stop, for the
 * same reason as setString().
 */
const YAML_LINE = (key) => new RegExp(`^(${key}: )'((?:[^']|'')*)'$`, 'm');

function readFrontmatter(src, key) {
  const match = YAML_LINE(key).exec(src);
  if (!match)
    stop(`${SITE_TEXT}: \`${key}\` is not a one-line single-quoted string — edit it by hand`);
  return match[2].replace(/''/g, "'");
}

function setFrontmatter(src, key, value) {
  if (!YAML_LINE(key).test(src)) {
    stop(`${SITE_TEXT}: \`${key}\` is not a one-line single-quoted string — edit it by hand`);
  }
  const quoted = `'${value.replace(/'/g, "''")}'`;
  return src.replace(YAML_LINE(key), (_match, head) => head + quoted);
}

/** The booleans currently in src/features.ts. */
function readFlags(src) {
  const flags = new Map();
  for (const [, id, value] of src.matchAll(/^\s*(\w+): (true|false),$/gm)) {
    flags.set(id, value === 'true');
  }
  return flags;
}

function setFlags(src, on) {
  let out = src;
  for (const feature of FEATURES) {
    const line = new RegExp(`^(\\s*${feature.id}: )(?:true|false)(,)$`, 'm');
    if (!line.test(out)) {
      stop(`${FLAGS}: no flag line for \`${feature.id}\` — run \`npm run docs\` first`);
    }
    out = out.replace(line, (_match, head, tail) => `${head}${on.has(feature.id)}${tail}`);
  }
  return out;
}

const CHOICE = /^export const (HOME_SHAPE|FEED_SOURCE): [^=]+= '([^']*)';$/gm;

function readChoice(src, name) {
  for (const [, found, value] of src.matchAll(CHOICE)) if (found === name) return value;
  return stop(`${FLAGS}: no \`export const ${name}\` line — edit it by hand`);
}

function setChoice(src, name, value) {
  let seen = false;
  const out = src.replace(CHOICE, (whole, found, old) => {
    if (found !== name) return whole;
    seen = true;
    return whole.replace(`'${old}';`, `'${value}';`);
  });
  if (!seen) stop(`${FLAGS}: no \`export const ${name}\` line — edit it by hand`);
  return out;
}

// ---------------------------------------------------------------------------
// interaction
// ---------------------------------------------------------------------------

/** Ask, when there is somebody there to answer. null when stdin is not a
    terminal, which every caller reads as "leave it as it is" — so a piped
    invocation changes only what its flags named. */
async function ask(terminal, question) {
  if (!terminal) return null;
  try {
    return (await terminal.question(question)).trim();
  } catch (err) {
    // Ctrl+D (or a closed stdin) arrives here as AbortError. That is somebody
    // leaving, not a crash, so it must not print a stack trace.
    if (err?.name === 'AbortError') throw new Abort('cancelled — nothing was written');
    throw err;
  }
}

const yes = (answer) => /^(y|yes)$/i.test(answer ?? '');

/** One string, offering the current value as the default. */
async function askString(terminal, label, current) {
  const answer = await ask(terminal, `  ${label.padEnd(12)} [${current}]: `);
  return answer ? answer : current;
}

async function askChoice(terminal, label, options, current) {
  for (;;) {
    const answer = await ask(
      terminal,
      `  ${label.padEnd(12)} [${options.join('/')}, default ${current}]: `,
    );
    if (!answer) return current;
    if (options.includes(answer)) return answer;
    say(`  ? not one of ${options.join(', ')}`);
  }
}

async function chooseInteractively(terminal) {
  say(bold('\nPresets'));
  PRESETS.forEach((name, index) => {
    const ids = featuresFor(name);
    say(`  ${index + 1}) ${name.padEnd(8)} ${ids.length} features: ${ids.join(', ')}`);
  });
  say(`  ${PRESETS.length + 1}) custom   start from everything and untick`);

  let preset = null;
  for (;;) {
    const answer =
      (await ask(terminal, `\nStart from [1-${PRESETS.length + 1}, default 1]: `)) || '1';
    const number = Number(answer);
    if (Number.isInteger(number) && number >= 1 && number <= PRESETS.length) {
      preset = PRESETS[number - 1];
      break;
    }
    if (Number.isInteger(number) && number === PRESETS.length + 1) break;
    if (PRESETS.includes(answer)) {
      preset = answer;
      break;
    }
    say('  ? not one of those');
  }

  const selected = new Set(preset ? featuresFor(preset) : FEATURES.map((feature) => feature.id));

  say(
    bold('\nFeatures') +
      ' — type numbers to toggle (space or comma separated), `a` all, `n` none, `d` done.',
  );
  for (;;) {
    say('');
    FEATURES.forEach((feature, index) => {
      const mark = selected.has(feature.id) ? 'x' : ' ';
      say(
        `  ${String(index + 1).padStart(2)}) [${mark}] ${feature.label.padEnd(16)} ${feature.blurb}`,
      );
    });
    const answer = (await ask(terminal, '\n> ')) ?? 'd';
    if (answer === '' || /^(d|done)$/i.test(answer)) break;
    if (/^(a|all)$/i.test(answer)) {
      FEATURES.forEach((feature) => selected.add(feature.id));
      continue;
    }
    if (/^(n|none)$/i.test(answer)) {
      selected.clear();
      continue;
    }
    if (/^(q|quit)$/i.test(answer)) throw new Abort('cancelled — nothing was written');
    let understood = false;
    for (const token of answer.split(/[\s,]+/).filter(Boolean)) {
      const number = Number(token);
      const feature = Number.isInteger(number) ? FEATURES[number - 1] : byId(token);
      if (!feature) {
        say(`  ? "${token}" is not a number on the list or a feature id`);
        continue;
      }
      understood = true;
      if (selected.has(feature.id)) selected.delete(feature.id);
      else selected.add(feature.id);
    }
    if (!understood) say('  ? nothing toggled');
  }

  return { preset, selected: [...selected] };
}

// ---------------------------------------------------------------------------
// after the write
// ---------------------------------------------------------------------------

function formatFiles(rels) {
  const run = spawnSync('npx', ['prettier', '--write', ...rels], { cwd: ROOT, stdio: 'pipe' });
  if (run.status === 0) step(`prettier formatted ${rels.join(', ')}`);
  else warn(`prettier failed — run \`npm run format\` by hand`);
}

function runCommands(names) {
  const results = [];
  for (const name of names) {
    say(bold(`\n$ npm run ${name}`));
    const run = spawnSync('npm', ['run', '--silent', name], { cwd: ROOT, stdio: 'inherit' });
    results.push({ name, ok: run.status === 0 });
  }
  return results;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

/** The feed source for a selection, preferring what is already set. */
function feedFor(on, current, preset) {
  const possible = ['posts', 'papers'].filter((source) =>
    source === 'posts' ? on.has('blog') : on.has('papers'),
  );
  if (possible.length === 0) return current;
  const wanted = preset ? PRESET_FEED[preset] : current;
  return possible.includes(wanted) ? wanted : possible[0];
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    say(HELP.trim());
    return 0;
  }

  const interactive = Boolean(input.isTTY) && !opts.yes;
  const terminal = interactive ? createInterface({ input, output }) : null;

  try {
    let flagsSrc = slurp(FLAGS);
    let constsSrc = slurp(CONSTS);
    let siteSrc = slurp(SITE_TEXT);
    const before = readFlags(flagsSrc);

    // ---- which features ----
    let preset = opts.preset;
    let selected;
    if (opts.features) {
      selected = opts.features;
    } else if (opts.preset) {
      selected = featuresFor(opts.preset);
    } else if (interactive) {
      ({ preset, selected } = await chooseInteractively(terminal));
    } else {
      say(HELP.trim());
      say('\nNothing to do: stdin is not a terminal and no --preset or --features was given.');
      return 1;
    }
    const on = new Set(selected);

    const { missing, unmet } = check(selected);
    if (missing.length > 0 || unmet.length > 0) {
      const lines = [
        ...missing.map(({ id, dep }) => `${id} is on, and ${dep}, which it needs, is off`),
        ...unmet.map(({ id, options }) => `${id} is on, and all of ${options.join(', ')} are off`),
      ];
      stop(
        `that selection cannot build:\n${lines.map((line) => `    · ${line}`).join('\n')}\n` +
          '  Turn the dependency on, or turn the dependent feature off.',
      );
    }

    // ---- the two shape choices ----
    let home = preset ?? readChoice(flagsSrc, 'HOME_SHAPE');
    let feed = feedFor(on, readChoice(flagsSrc, 'FEED_SOURCE'), preset);

    if (interactive) {
      say(bold('\nShape') + ' — press Enter to keep the value in brackets.');
      home = await askChoice(terminal, 'home page', ['profile', 'project'], home);
      const sources = ['posts', 'papers'].filter((source) =>
        source === 'posts' ? on.has('blog') : on.has('papers'),
      );
      if (on.has('feed') && sources.length > 1) {
        feed = await askChoice(terminal, 'feed of', sources, feed);
      }
    }

    // ---- who the site is about ----
    // Where each answer lives: config in src/consts.ts, words in site.md.
    const SITE_KEYS = ['url', 'email'];
    const TEXT_KEYS = ['title', 'brand'];
    const identity = {
      url: readString(constsSrc, 'SITE', 'url'),
      title: readFrontmatter(siteSrc, 'title'),
      brand: readFrontmatter(siteSrc, 'brand'),
      email: readString(constsSrc, 'SITE', 'email'),
      first: readString(constsSrc, 'SELF', 'first'),
      last: readString(constsSrc, 'SELF', 'last'),
    };
    if (interactive) {
      say(bold('\nWho the site is about') + ' — press Enter to keep the value in brackets.');
      identity.url = await askString(terminal, 'site url', identity.url);
      say('  The title may say {name}, which is filled in from the first and last name.');
      identity.title = await askString(terminal, 'title', identity.title);
      identity.brand = await askString(terminal, 'nav brand', identity.brand);
      identity.email = await askString(terminal, 'email', identity.email);
      identity.first = await askString(terminal, 'first name', identity.first);
      identity.last = await askString(terminal, 'last name', identity.last);
    }

    // ---- compose ----
    flagsSrc = setFlags(flagsSrc, on);
    flagsSrc = setChoice(flagsSrc, 'HOME_SHAPE', home);
    flagsSrc = setChoice(flagsSrc, 'FEED_SOURCE', feed);
    for (const [key, value] of Object.entries(identity)) {
      if (TEXT_KEYS.includes(key)) siteSrc = setFrontmatter(siteSrc, key, value);
      else constsSrc = setString(constsSrc, SITE_KEYS.includes(key) ? 'SITE' : 'SELF', key, value);
    }

    // ---- report ----
    say(bold('\nFeatures'));
    for (const feature of FEATURES) {
      const now = on.has(feature.id);
      const was = before.get(feature.id);
      const note = was === undefined || was === now ? '' : `   <- was ${was ? 'on' : 'off'}`;
      say(`  ${now ? 'on ' : 'off'}  ${feature.id.padEnd(14)}${note}`);
    }
    say(bold('\nShape'));
    say(`  home page    ${home}`);
    say(`  feed of      ${on.has('feed') ? feed : '— (feed is off)'}`);
    say(bold('\nWho the site is about'));
    for (const [key, value] of Object.entries(identity)) say(`  ${key.padEnd(12)} ${value}`);

    if (opts.dryRun) {
      say(bold('\n--dry-run: nothing was written.'));
      return 0;
    }

    writeFileSync(abs(FLAGS), flagsSrc);
    writeFileSync(abs(CONSTS), constsSrc);
    writeFileSync(abs(SITE_TEXT), siteSrc);
    say(bold('\nWritten'));
    step(`${FLAGS} — ${on.size} of ${FEATURES.length} features on`);
    step(`${CONSTS} — url, email, first and last name`);
    step(`${SITE_TEXT} — title and brand`);
    formatFiles([FLAGS, CONSTS, SITE_TEXT]);

    // ---- what is left for a human ----
    say(bold('\nStill yours to do'));
    [
      'SELF.surnames is how an author in papers.bib is recognised as you — list every spelling you publish under',
      'src/consts.ts still holds the demo brand logo, repo and ogImage',
      'SITE.demoNotice prints a banner on the entry page; set it to false once the content is yours',
      "src/content/pages/ still holds the demo's words: the tagline, description, footer, and every page's text",
      "src/data/ and src/content/ are still Cicero's",
      ...FEATURES.filter((feature) => !on.has(feature.id)).flatMap((feature) =>
        feature.manual.map((edit) => `${feature.id}: ${edit}`),
      ),
    ].forEach((todo) => say(`  · ${todo}`));

    // ---- verify ----
    if (!interactive || !yes(await ask(terminal, '\nRun check, build and audit now? [y/N] '))) {
      say('\nRun `npm run check && npm run build && npm run audit` when you are ready.');
      return 0;
    }

    const failed = runCommands(['check', 'build', 'audit'])
      .filter((result) => !result.ok)
      .map((result) => result.name);
    if (failed.length === 0) {
      say(bold('\nPassed: check, build and audit.'));
      return 0;
    }
    say(bold(`\nFailed: ${failed.join(' and ')}.`));
    say(
      `Nothing was deleted, so \`git diff ${FLAGS} ${CONSTS} ${SITE_TEXT}\` is the whole change.`,
    );
    return 1;
  } finally {
    terminal?.close();
  }
}

try {
  process.exitCode = await main();
} catch (err) {
  if (err instanceof Abort) {
    console.error(`\n✗ ${err.message}`);
    process.exitCode = 1;
  } else {
    throw err;
  }
}
