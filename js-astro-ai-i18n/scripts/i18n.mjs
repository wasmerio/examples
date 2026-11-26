#!/usr/bin/env node
/**
 * The translation workflow, in one command.
 *
 *   npm run i18n:status              what is missing, what is out of date, what it costs
 *   npm run i18n:translate           translate exactly that, and write it back
 *   npm run i18n:translate -- fr     one locale
 *   npm run i18n:translate -- --dry-run     price it without spending anything
 *   npm run i18n:check               fail CI on a translation with no source
 *   npm run i18n:bless -- --only ui  accept existing translations as current
 *
 * TWO SURFACES, ONE MECHANISM. The UI copy is nested JSON; the journal is
 * Markdown files in parallel folders. What they share is the middle: collect
 * English, send it in one batch, write the results back, record what each
 * translation was made from. What they do not share is collection and
 * write-back, which is why those are two small functions here rather than one
 * abstraction that half fits both.
 *
 * STALENESS IS THE POINT. Translating once is easy. `.i18n-lock.json` stores
 * the hash of the English text each translation was made from, so "the English
 * changed and the German did not" is a fact this script reports rather than
 * something a person has to notice.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { MARKDOWN_RULES, SEO_RULES, translateBundle } from './lib/aiglot.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

/* The site's own locale list, imported rather than repeated: a second list
   here would be one more thing to forget when a language is added. Node strips
   the types on the way in, which is why this needs Node 22.18 or newer. */
const { defaultLocale, locales, translationLanguage } = await import('../src/i18n/config.ts');
const targets = locales.filter((locale) => locale !== defaultLocale);

const hash = (text) => createHash('sha256').update(String(text)).digest('hex').slice(0, 16);
const read = (file) => readFileSync(path.join(ROOT, file), 'utf8');
const write = (file, body) => {
  const abs = path.join(ROOT, file);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, body);
};
const loadJson = (file) => (existsSync(path.join(ROOT, file)) ? JSON.parse(read(file)) : {});
const countWords = (text) => String(text).split(/\s+/).filter(Boolean).length;

/* ============================================================ surface: ui */

const UI_DIR = 'src/i18n/strings';
const UI_LOCK = `${UI_DIR}/.i18n-lock.json`;

/**
 * Keys whose values are data, not copy.
 *
 * A translated `name` renames a person; a translated `value` turns "2019" into
 * a word; a translated `href` is a 404. All three fail silently, which is why
 * this is a hard skip in the extractor rather than a sentence in the
 * instructions. Scope is not something to ask a translator to respect string
 * by string.
 */
const NOT_COPY = new Set(['name', 'value', 'href', 'id', 'icon', 'slug', 'image']);

/** Every translatable leaf of an object, keyed by its path. */
function flatten(value, prefix = '', out = {}) {
  if (typeof value === 'string') {
    out[prefix] = value;
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, out));
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (NOT_COPY.has(key)) continue;
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

function setPath(target, pointer, text) {
  const parts = pointer.replace(/\[(\d+)\]/g, '.$1').split('.');
  let node = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (node[key] === undefined) node[key] = /^\d+$/.test(parts[index + 1]) ? [] : {};
    node = node[key];
  }
  node[parts.at(-1)] = typeof text === 'string' ? text.trim() : text;
}

function uiGaps() {
  const english = flatten(JSON.parse(read(`${UI_DIR}/en.json`)));
  const lock = loadJson(UI_LOCK);
  const gaps = {};
  for (const locale of targets) {
    const file = `${UI_DIR}/${locale}.json`;
    const current = existsSync(path.join(ROOT, file)) ? flatten(JSON.parse(read(file))) : {};
    const recorded = lock[locale] ?? {};
    const missing = [];
    const stale = [];
    for (const [pointer, text] of Object.entries(english)) {
      if (typeof current[pointer] !== 'string' || current[pointer].trim() === '') missing.push(pointer);
      else if (recorded[pointer] !== hash(text)) stale.push(pointer);
    }
    gaps[locale] = { missing, stale };
  }
  return { english, gaps, total: Object.keys(english).length };
}

function uiWrite(locale, translated, english) {
  const file = `${UI_DIR}/${locale}.json`;
  /*
   * Three layers, in this order: English deep-cloned for the whole shape
   * (including the data fields the extractor never sends, so `value` and
   * `name` stay English), then whatever the locale already had so untouched
   * strings survive, then what came back.
   */
  /* `source` rather than `english`: this function already takes a parameter by
     that name, holding the FLATTENED English strings. Two different shapes
     under one name is how the first version of this shadowed itself. */
  const source = JSON.parse(read(`${UI_DIR}/en.json`));
  const merged = structuredClone(source);
  const known = new Set(Object.keys(flatten(source)));
  if (existsSync(path.join(ROOT, file))) {
    for (const [pointer, text] of Object.entries(flatten(JSON.parse(read(file))))) {
      /*
       * Only pointers English still has.
       *
       * `setPath` creates whatever path it is given, so without this filter a
       * key deleted from en.json is resurrected in every locale file on the
       * next write, forever. It reads as a translation of a string that no
       * longer exists, nothing renders it, and nothing reports it either: the
       * status command walks the English shape and never looks at the extra.
       * Caught by `no locale file invents a key English does not have` in
       * test/i18n.test.mjs, which is the only thing that can see it.
       */
      if (known.has(pointer)) setPath(merged, pointer, text);
    }
  }
  for (const [pointer, text] of Object.entries(translated)) setPath(merged, pointer, text);
  write(file, `${JSON.stringify(merged, null, 2)}\n`);

  const lock = loadJson(UI_LOCK);
  lock[locale] = { ...(lock[locale] ?? {}) };
  for (const pointer of Object.keys(translated)) lock[locale][pointer] = hash(english[pointer]);
  write(UI_LOCK, `${JSON.stringify(sortDeep(lock), null, 2)}\n`);
}

/* ========================================================== surface: blog */

const BLOG_DIR = 'src/content/blog';
const BLOG_LOCK = `${BLOG_DIR}/.i18n-lock.json`;

const postFiles = (locale) => {
  const dir = path.join(ROOT, BLOG_DIR, locale);
  return existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.md')).sort() : [];
};

/**
 * Frontmatter and body, without a YAML parser.
 *
 * The frontmatter here is flat and this only ever reads or rewrites two known
 * keys. A parser would be a dependency defending against a shape this
 * repository does not have.
 */
function splitPost(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('A post must start with a frontmatter block');
  return { front: match[1], body: match[2] };
}

const field = (front, key) => {
  const match = front.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^['"]|['"]$/g, '');
};

function blogGaps() {
  const lock = loadJson(BLOG_LOCK);
  const sources = postFiles(defaultLocale);
  const gaps = {};
  for (const locale of targets) {
    const present = new Set(postFiles(locale));
    const missing = [];
    const stale = [];
    for (const file of sources) {
      const source = read(`${BLOG_DIR}/${defaultLocale}/${file}`);
      const slug = file.replace(/\.md$/, '');
      if (!present.has(file)) missing.push(slug);
      else if (lock[locale]?.[slug] !== hash(source)) stale.push(slug);
    }
    gaps[locale] = { missing, stale };
  }
  return { sources, gaps, total: sources.length };
}

/** The three translatable pieces of one post. The rest of the frontmatter is data. */
function postStrings(slug) {
  const { front, body } = splitPost(read(`${BLOG_DIR}/${defaultLocale}/${slug}.md`));
  return {
    [`${slug}::title`]: field(front, 'title'),
    [`${slug}::description`]: field(front, 'description'),
    [`${slug}::body`]: body.trim(),
  };
}

/**
 * One or two spaces in front of a paragraph, which the engine returns now and
 * then. Markdown ignores an indent of 1 to 3 spaces at the start of a block,
 * so this changes nothing a reader sees and everything a diff does: without it
 * a re-run shows phantom changes on lines whose words did not move. Four or
 * more is a code block and is left alone.
 */
function normalizeMarkdown(body) {
  let previousBlank = true;
  return body
    .trim()
    .split('\n')
    .map((line) => {
      const clean = previousBlank && /^ {1,3}\S/.test(line) ? line.replace(/^ +/, '') : line;
      previousBlank = clean.trim() === '';
      return clean;
    })
    .join('\n');
}

function blogWrite(locale, slug, translated) {
  const source = read(`${BLOG_DIR}/${defaultLocale}/${slug}.md`);
  const { front } = splitPost(source);
  /*
   * Date, author and glyph come from the English file every time. A post has
   * one publication date whatever language you read it in, and a translated
   * glyph name draws nothing.
   */
  const front_ = [
    '---',
    `title: ${JSON.stringify(translated[`${slug}::title`])}`,
    `description: ${JSON.stringify(translated[`${slug}::description`])}`,
    `date: ${field(front, 'date')}`,
    ...(field(front, 'author') ? [`author: ${field(front, 'author')}`] : []),
    `glyph: ${field(front, 'glyph') ?? 'grid'}`,
    '---',
    '',
  ].join('\n');

  write(`${BLOG_DIR}/${locale}/${slug}.md`, `${front_}${normalizeMarkdown(translated[`${slug}::body`])}\n`);

  const lock = loadJson(BLOG_LOCK);
  lock[locale] = { ...(lock[locale] ?? {}), [slug]: hash(source) };
  write(BLOG_LOCK, `${JSON.stringify(sortDeep(lock), null, 2)}\n`);
}

/* =============================================================== commands */

/* `argv.indexOf(flag) + 1` is 0 when the flag is absent, which reads the FIRST
   argument as the flag's value. That turned `translate --dry-run` into
   `--only=--dry-run`, so it matched no surface and cheerfully reported nothing
   to do. */
function flagValue(argv, flag) {
  const at = argv.indexOf(flag);
  return at === -1 ? undefined : argv[at + 1];
}

function sortDeep(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortDeep(value[key])]),
  );
}

function status() {
  const ui = uiGaps();
  const blog = blogGaps();
  let words = 0;

  console.log(`\nUI copy: ${UI_DIR}/en.json, ${ui.total} strings\n`);
  for (const locale of targets) {
    const { missing, stale } = ui.gaps[locale];
    words += [...missing, ...stale].reduce((sum, pointer) => sum + countWords(ui.english[pointer]), 0);
    console.log(
      `  ${locale}  ${String(ui.total - missing.length - stale.length).padStart(3)} current` +
        `   ${String(missing.length).padStart(3)} missing   ${String(stale.length).padStart(3)} out of date`,
    );
  }

  console.log(`\nJournal: ${BLOG_DIR}/${defaultLocale}/, ${blog.total} posts\n`);
  for (const locale of targets) {
    const { missing, stale } = blog.gaps[locale];
    for (const slug of [...missing, ...stale]) {
      words += Object.values(postStrings(slug)).reduce((sum, text) => sum + countWords(text), 0);
    }
    const detail = [...missing.map((s) => `+${s}`), ...stale.map((s) => `~${s}`)].join(' ');
    console.log(
      `  ${locale}  ${String(blog.total - missing.length - stale.length).padStart(3)} current` +
        `   ${String(missing.length).padStart(3)} missing   ${String(stale.length).padStart(3)} out of date` +
        (detail ? `   ${detail}` : ''),
    );
  }

  /* Lite is one credit per three words. The estimate is deliberately of SOURCE
     words: it is what you can know before sending anything, and it is what the
     plan will price. */
  console.log(
    `\n~${words.toLocaleString('en-US')} source words behind` +
      ` (~${Math.ceil(words / 3).toLocaleString('en-US')} credits in Lite,` +
      ` ~${words.toLocaleString('en-US')} in Standard).\n`,
  );
  console.log('  + missing    ~ English changed since the translation was made\n');
}

async function translate(argv) {
  const all = argv.includes('--all');
  const dryRun = argv.includes('--dry-run');
  const only = flagValue(argv, '--only');
  const wanted = argv.filter((arg) => targets.includes(arg));
  const chosen = wanted.length > 0 ? wanted : targets;

  const doUi = !only || only === 'ui';
  const doBlog = !only || only === 'blog';

  const ui = uiGaps();
  const blog = blogGaps();

  /* One request per locale set, keyed so the results can be split back out.
     `ui::` and `post::` are namespaces, not content: the engine never
     translates a key. */
  const strings = {};
  const plan = { ui: {}, blog: {} };

  for (const locale of chosen) {
    if (doUi) {
      const pointers = all ? Object.keys(ui.english) : [...ui.gaps[locale].missing, ...ui.gaps[locale].stale];
      plan.ui[locale] = pointers;
      for (const pointer of pointers) strings[`ui::${pointer}`] = ui.english[pointer];
    }
    if (doBlog) {
      const slugs = all
        ? blog.sources.map((file) => file.replace(/\.md$/, ''))
        : [...blog.gaps[locale].missing, ...blog.gaps[locale].stale];
      plan.blog[locale] = slugs;
      for (const slug of slugs) {
        for (const [key, text] of Object.entries(postStrings(slug))) strings[`post::${key}`] = text;
      }
    }
  }

  if (Object.keys(strings).length === 0) {
    console.log('Everything is up to date. Nothing to send.');
    return;
  }

  /*
   * ONE BATCH. Every locale and both surfaces travel together, so the
   * translator sees the site's whole vocabulary at once. That is what keeps a
   * term consistent between a navigation label and the post that uses it, and
   * it is one analysis and one approval instead of six.
   */
  const results = await translateBundle({
    strings,
    locales: Object.fromEntries(chosen.map((locale) => [locale, translationLanguage[locale]])),
    rules: [...MARKDOWN_RULES, ...SEO_RULES],
    label: 'site-copy',
    dryRun,
  });

  if (dryRun) {
    console.log('\nDry run. Nothing was approved, nothing was spent, nothing was written.');
    return;
  }

  for (const locale of chosen) {
    const mine = results[locale];

    if (doUi && plan.ui[locale].length > 0) {
      const translated = {};
      for (const pointer of plan.ui[locale]) translated[pointer] = mine[`ui::${pointer}`];
      uiWrite(locale, translated, ui.english);
      console.log(`${locale}: ${plan.ui[locale].length} UI strings written`);
    }

    if (doBlog) {
      for (const slug of plan.blog[locale]) {
        const translated = {};
        for (const key of Object.keys(postStrings(slug))) translated[key] = mine[`post::${key}`];
        blogWrite(locale, slug, translated);
      }
      if (plan.blog[locale].length > 0) {
        console.log(`${locale}: ${plan.blog[locale].length} post(s) written`);
      }
    }
  }

  console.log('\nRead the diff before committing. That is the review step this workflow keeps for a person.');
}

/**
 * Record the current English as the baseline for translations that already
 * exist, without translating anything.
 *
 * For translations that predate this lock file and whose English has not moved
 * since: they are not out of date, the lock simply has no record of them, and
 * paying to redo them would replace working copy with machine copy for
 * nothing. Never use it to silence a real gap: it only ever blesses a
 * translation that is present and non-empty.
 */
function bless(argv) {
  const only = flagValue(argv, '--only');

  if (!only || only === 'ui') {
    const english = flatten(JSON.parse(read(`${UI_DIR}/en.json`)));
    const lock = loadJson(UI_LOCK);
    for (const locale of targets) {
      const file = `${UI_DIR}/${locale}.json`;
      if (!existsSync(path.join(ROOT, file))) continue;
      const current = flatten(JSON.parse(read(file)));
      lock[locale] = { ...(lock[locale] ?? {}) };
      let blessed = 0;
      for (const [pointer, text] of Object.entries(english)) {
        if (typeof current[pointer] === 'string' && current[pointer].trim() !== '') {
          lock[locale][pointer] = hash(text);
          blessed += 1;
        }
      }
      console.log(`ui   ${locale}: ${blessed} existing translations accepted as current`);
    }
    write(UI_LOCK, `${JSON.stringify(sortDeep(lock), null, 2)}\n`);
  }

  if (!only || only === 'blog') {
    const lock = loadJson(BLOG_LOCK);
    for (const locale of targets) {
      lock[locale] = { ...(lock[locale] ?? {}) };
      let blessed = 0;
      for (const file of postFiles(locale)) {
        const source = `${BLOG_DIR}/${defaultLocale}/${file}`;
        if (!existsSync(path.join(ROOT, source))) continue;
        lock[locale][file.replace(/\.md$/, '')] = hash(read(source));
        blessed += 1;
      }
      console.log(`blog ${locale}: ${blessed} existing translations accepted as current`);
    }
    write(BLOG_LOCK, `${JSON.stringify(sortDeep(lock), null, 2)}\n`);
  }
}

/**
 * The check CI runs.
 *
 * An ORPHAN always fails: a translated file whose English source does not
 * exist is a file nothing serves, nothing lists and nothing reports. It sits
 * in the repository looking like work that shipped. A typo in a file name
 * produces exactly this.
 *
 * Translation DEBT only fails with `--strict`. A site is permanently
 * half-translated; that is the steady state, not a broken build.
 */
function check(argv) {
  const strict = argv.includes('--strict');
  let failures = 0;

  const sources = new Set(postFiles(defaultLocale));
  for (const locale of targets) {
    for (const file of postFiles(locale)) {
      if (!sources.has(file)) {
        console.error(
          `orphan: ${BLOG_DIR}/${locale}/${file} has no source at ${BLOG_DIR}/${defaultLocale}/${file}`,
        );
        failures += 1;
      }
    }
  }

  const ui = uiGaps();
  const blog = blogGaps();
  let debt = 0;
  for (const locale of targets) {
    debt +=
      ui.gaps[locale].missing.length +
      ui.gaps[locale].stale.length +
      blog.gaps[locale].missing.length +
      blog.gaps[locale].stale.length;
  }

  if (failures > 0) {
    console.error(`\n${failures} orphaned translation(s).`);
    process.exit(1);
  }

  if (debt > 0) {
    console.log(`${debt} item(s) missing or out of date. Run \`npm run i18n:status\` for the breakdown.`);
    if (strict) process.exit(1);
  } else {
    console.log('Every locale is current.');
  }
}

/* =================================================================== main */

const [command, ...rest] = process.argv.slice(2);
if (command === 'status') status();
else if (command === 'translate') await translate(rest);
else if (command === 'bless') bless(rest);
else if (command === 'check') check(rest);
else {
  console.error(
    'Usage:\n' +
      '  i18n.mjs status\n' +
      '  i18n.mjs translate [locale...] [--only ui|blog] [--all] [--dry-run]\n' +
      '  i18n.mjs bless [--only ui|blog]\n' +
      '  i18n.mjs check [--strict]',
  );
  process.exit(2);
}
