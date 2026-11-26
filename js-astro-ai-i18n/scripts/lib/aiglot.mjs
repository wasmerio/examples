/**
 * The only file that talks to AI Glot.
 *
 * It does one thing: take a flat `{ key: "English text" }` object, send it to
 * be translated into every target language in ONE batch, and hand back
 * `{ locale: { key: "translated text" } }`. Everything above it (which strings
 * are missing, where they are written back) lives in `scripts/i18n.mjs`, and
 * everything below it is either the `aiglot` CLI or four HTTP calls.
 *
 * WHY JSON AND NOT CSV. AI Glot reads JSON keys as structure, so a key is
 * never sent as translatable content and cannot come back translated. In a CSV
 * every cell is content, which is why the CSV version of this needed a
 * column-selection step and could still mangle an identifier.
 *
 * WHY ONE BATCH FOR EVERY LANGUAGE. The payload nests by language code, so
 * three locales are one analysis, one plan, one approval and one poll instead
 * of three of each. It is faster, cheaper in round trips, and the translator
 * sees the whole site's copy at once, which is what keeps one term consistent
 * between the home page and the post that links to it.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const API = process.env.AIGLOT_API_URL ?? 'https://api.ai-glot.com/v1';

/**
 * Rules that hold for every string this site translates.
 *
 * These are STRING-LEVEL: they are applied while each individual string is
 * written, so they can only describe something visible inside one string. A
 * file-shaped sentence ("translate every value", "skip the first column")
 * belongs in the plan instruction and does nothing here — silently, which is
 * what makes the distinction worth learning once.
 */
export const HOUSE_RULES = [
  'Keep the product name AI Glot and the site name AI i18n exactly as written, in every language.',
  /* Added after a real run: Spanish translated the section name in the page
     heading ("Journal") but not in the navigation ("Diario"), so the menu and
     the page it opened disagreed. Either answer was defensible; disagreeing
     with itself was not. A name a site uses as a label belongs in a rule, or
     better in an AI Glot glossary, which reaches every surface and every
     future run. */
  'Journal is the name of this site\'s writing section. Keep it as Journal in every language, in navigation, headings and titles alike.',
  'Leave URLs, paths and anchors untranslated, byte for byte, including their slugs.',
  'Keep anything inside backticks verbatim: file names, commands, flags, identifiers.',
  'Keep placeholders exactly as written, including {curly}, %s and $1 forms.',
  'Keep numbers, dates, currencies and units as written. Do not convert them.',
  'Leave product and company names untranslated: Astro, AI Glot, GitHub, Cloudflare.',
  'Match the register of the source: direct, concrete, no marketing adjectives the source does not have.',
  'Do not use em dashes. Use a comma, a colon or a full stop.',
];

/** Extra rules for values that are Markdown rather than plain text. */
export const MARKDOWN_RULES = [
  'Each value is Markdown. Return Markdown, not a description of it.',
  'Keep every construct exactly: headings, lists, bold, italics, code fences, block quotes, tables.',
  'Keep link syntax intact and never translate a link target.',
  'Keep the heading structure: one translated heading per source heading, at the same level.',
];

/**
 * Rules about length, which a translator cannot infer from the string itself.
 *
 * Search results truncate around 67 characters, and German runs roughly a
 * third longer than English. Without this the translated titles come back
 * correct and 30% over, and the truncation undoes an English title that was
 * right.
 */
export const SEO_RULES = [
  'A key ending in meta.title is a page title: it must read naturally in 67 characters or fewer. Shorten rather than translate literally.',
  'A key ending in meta.description is a meta description: aim for 140 to 155 characters and never exceed 155.',
  'A key that is a short label — a menu item, a button, a column heading — must stay short enough to fit where the English fits.',
];

const log = (line) => process.stderr.write(`${line}\n`);

/**
 * Translate one bundle into every locale, in a single batch.
 *
 * @param {object} options
 * @param {Record<string,string>} options.strings key -> English text.
 * @param {Record<string,string>} options.locales code -> language name, e.g. `{ fr: 'French' }`.
 * @param {string[]} [options.rules] extra string-level rules.
 * @param {'lite'|'standard'} [options.quality]
 * @param {string} [options.label] names the temporary file, and the batch in the UI.
 * @param {boolean} [options.dryRun] price the work and stop before spending anything.
 * @returns {Promise<Record<string, Record<string,string>>>}
 */
export async function translateBundle({
  strings,
  locales,
  rules = [],
  quality = process.env.AIGLOT_QUALITY === 'standard' ? 'standard' : 'lite',
  label = 'bundle',
  dryRun = false,
}) {
  const keys = Object.keys(strings);
  const codes = Object.keys(locales);
  if (keys.length === 0 || codes.length === 0) {
    return Object.fromEntries(codes.map((code) => [code, {}]));
  }

  /* One object per language code, each holding the same keys. The outer key is
     what tells the engine which language that block is for. */
  const payload = Object.fromEntries(codes.map((code) => [code, { ...strings }]));

  const named = codes.map((code) => `under "${code}" into ${locales[code]}`).join(', ');
  const instruction =
    `This file has one top-level key per target language. Translate the values ${named}. ` +
    'The inner keys are identifiers: never translate them, never reorder them, never drop one. ' +
    'Return every key in every language block.';

  const custom = [...HOUSE_RULES, ...rules].join(' ');
  const words = keys.reduce((total, key) => total + String(strings[key]).split(/\s+/).length, 0);
  log(`${keys.length} strings, ~${words} source words, ${codes.length} locales, one batch`);

  const transport = process.env.AIGLOT_TRANSPORT === 'api' ? api : cli;
  const raw = await transport({
    content: `${JSON.stringify(payload, null, 2)}\n`,
    filename: `${label}.json`,
    instruction,
    custom,
    quality,
    dryRun,
  });

  if (dryRun) return Object.fromEntries(codes.map((code) => [code, {}]));

  const out = JSON.parse(raw);

  /*
   * A key that came back missing or empty means the file changed shape between
   * going out and coming back, which is a silent way to lose a string: the
   * writer would fall back to English for it and `status` would report the
   * locale as complete. Fail the whole run instead, before anything is written.
   */
  const holes = [];
  for (const code of codes) {
    for (const key of keys) {
      const value = out?.[code]?.[key];
      if (typeof value !== 'string' || value.trim() === '') holes.push(`${code}:${key}`);
    }
  }
  if (holes.length > 0) {
    throw new Error(
      `The translation came back incomplete: ${holes.length} of ${keys.length * codes.length} values are missing. ` +
        `First few: ${holes.slice(0, 5).join(', ')}. Nothing has been written.`,
    );
  }

  /* Trim, always. A leading space in a translated button label is a visible
     defect that every "is it present and non-empty" check waves through. */
  return Object.fromEntries(
    codes.map((code) => [code, Object.fromEntries(keys.map((key) => [key, out[code][key].trim()]))]),
  );
}

/* --------------------------------------------------------------- transport */

/**
 * The CLI transport, and the recommended one.
 *
 * `aiglot` handles credentials (keychain, then `AIGLOT_API_KEY`), retries what
 * is safe to retry, and keeps working when the REST shapes move. Four calls,
 * and only the third one spends anything.
 */
function cli({ content, filename, instruction, custom, quality, dryRun }) {
  /* Fail with a sentence rather than `spawn aiglot ENOENT`, which sends people
     looking for a bug in this repository. */
  try {
    execFileSync('aiglot', ['--version'], { stdio: 'ignore' });
  } catch {
    throw new Error(
      'The aiglot CLI is not on this machine. Install it with `npm i -g @ai-glot/cli` ' +
        'and run `aiglot auth login`, or set AIGLOT_TRANSPORT=api and AIGLOT_API_KEY to ' +
        'use the REST API instead. See AGENTS.md.',
    );
  }

  const dir = mkdtempSync(join(tmpdir(), 'aiglot-'));
  const upload = join(dir, filename);
  const result = join(dir, `translated-${filename}`);
  writeFileSync(upload, content);

  const run = (args) =>
    execFileSync('aiglot', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

  /* `create --instruction` returns the file AND its priced plan in one call.
     Creating and planning are free and repeatable, so an agent can iterate on
     the instruction as often as it likes before committing to anything. */
  const created = JSON.parse(run(['batches', 'create', upload, '--instruction', instruction, '--json']));
  const id = created.id ?? created.data?.id;
  const planned = created.word_count ?? created.plan?.totals?.words;
  log(`batch ${id}${planned ? `, ${planned} words planned` : ''}`);

  if (dryRun) {
    log(`dry run: not approving. Inspect it with: aiglot batches get ${id}`);
    return '{}';
  }

  /* The only call that spends credits. Everything above this line is free. */
  run(['batches', 'approve', id, '--quality', quality, '--instructions', custom, '--json', '--yes']);

  for (let attempt = 0; ; attempt += 1) {
    const batch = JSON.parse(run(['batches', 'get', id, '--json']));
    const status = batch.status ?? batch.data?.status;
    /* Wait for a TERMINAL status, never for one specific value. A status added
       later would otherwise read as "still running" forever. */
    if (status === 'completed') break;
    if (status === 'failed' || status === 'cancelled') {
      throw new Error(`Batch ${id} ${status}: ${JSON.stringify(batch.error ?? null)}`);
    }
    if (attempt > 240) throw new Error(`Batch ${id} is still ${status}. Check: aiglot batches get ${id}`);
    process.stderr.write(`\r  ${status}${batch.progress?.percent != null ? ` ${batch.progress.percent}%` : ''}   `);
    sleepSync(Math.min(2000 + attempt * 250, 10000));
  }
  process.stderr.write('\r  completed          \n');

  run(['batches', 'download', id, '--output', result]);
  return readFileSync(result, 'utf8');
}

/**
 * The API transport: the same four calls over HTTP, with no dependency and no
 * CLI installed. Use it in a CI image you do not control, or from a language
 * that is not Node.
 *
 *   POST /v1/batches                     create, with the plan instruction
 *   GET  /v1/batches/{id}                poll (also how you read the plan)
 *   POST /v1/batches/{id}/approve        the only call that spends credits
 *   GET  /v1/batches/{id}/result?format=content   the translated file
 *
 * A fifth exists and is worth knowing: POST /v1/batches/{id}/plan rewrites the
 * plan (`instruction`) or edits it (`refinement`) before approval, as often as
 * you like, for nothing.
 */
async function api({ content, filename, instruction, custom, quality, dryRun }) {
  const key = process.env.AIGLOT_API_KEY;
  if (!key) throw new Error('AIGLOT_API_KEY is not set. See .env.example.');

  const call = async (path, init = {}) => {
    const response = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    const body = await response.json();
    if (!response.ok) {
      /* Branch on error.code, never on the message text. */
      throw new Error(
        `${init.method ?? 'GET'} ${path} -> ${response.status} ${body?.error?.code ?? ''} ${body?.error?.message ?? ''}`.trim(),
      );
    }
    return body.data;
  };

  const created = await call('/batches', {
    method: 'POST',
    body: JSON.stringify({ content, filename, instruction }),
  });
  log(`batch ${created.id}${created.word_count ? `, ${created.word_count} words planned` : ''}`);

  /* The plan is produced asynchronously; `awaiting_approval` is the state that
     says it is priced and waiting for a decision. */
  let batch = created;
  for (let attempt = 0; batch.status === 'analyzing' && attempt < 60; attempt += 1) {
    await sleep(1500);
    batch = await call(`/batches/${created.id}`);
  }

  if (dryRun) {
    log(`dry run: not approving. Plan: ${JSON.stringify(batch.plan?.summary ?? batch.status)}`);
    return '{}';
  }

  await call(`/batches/${created.id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ quality, custom_instructions: custom }),
  });

  for (let attempt = 0; ; attempt += 1) {
    batch = await call(`/batches/${created.id}`);
    if (batch.status === 'completed') break;
    if (batch.status === 'failed' || batch.status === 'cancelled') {
      throw new Error(`Batch ${created.id} ${batch.status}: ${JSON.stringify(batch.error ?? null)}`);
    }
    if (attempt > 240) throw new Error(`Batch ${created.id} is still ${batch.status}.`);
    process.stderr.write(`\r  ${batch.status}${batch.progress?.percent != null ? ` ${batch.progress.percent}%` : ''}   `);
    await sleep(Math.min(2000 + attempt * 250, 10000));
  }
  process.stderr.write('\r  completed          \n');

  /* `format=content` returns the translated file in the JSON response, up to
     2 MB. Above that, drop `format` and follow the signed `download_url`. */
  const result = await call(`/batches/${created.id}/result?format=content`);
  return result.content;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* The CLI transport is synchronous end to end, so its wait is too: one fewer
   way for a half-written file to exist if the process is interrupted. */
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
