#!/usr/bin/env node
/**
 * Check (and optionally update) BibTeX entries against Crossref via their DOI.
 *
 * Usage:  npm run bib:check                    dry-run: report differences
 *         npm run bib:check -- --write         apply updates to safe fields
 *         npm run bib:check -- --all-fields    also report title/author
 *         npm run bib:check -- -f path.bib     use a different .bib file
 *
 * Only pages, volume, number, year, month, isbn and issn are ever written. Venue
 * and publisher are curated (the site uses cleaner names than Crossref) and
 * title/author need LaTeX escaping, so those are report-only. Other fields and
 * the file's formatting are left untouched.
 *
 * Demo DOIs use the reserved 10.5555 prefix, so "not found in Crossref" is expected.
 * Set CROSSREF_MAILTO to your address for Crossref's faster pool.
 *
 * Exit code: 1 when any entry differs from Crossref, else 0.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import {
  BIB_FILE,
  crossrefByDoi,
  crossrefFields,
  normalize,
  parseEntries,
  printHeaderHelp,
  sleep,
  unescapeDoi,
} from './lib/missing-papers.mjs';

const SAFE_FIELDS = ['pages', 'volume', 'number', 'year', 'month', 'isbn', 'issn'];
const CURATED_FIELDS = ['journal', 'booktitle', 'publisher'];
const VERBOSE_FIELDS = ['title', 'author'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export function normalizeField(value, field) {
  if (field !== 'month') return normalize(value);
  const month = MONTHS.indexOf(value.trim().toLowerCase().slice(0, 3));
  if (month !== -1) return String(month + 1);
  return value.replace(/[^0-9]/g, '') || normalize(value);
}

/** Replace or insert `{field: value}` in one raw entry block, aligned like its neighbours. */
export function applyUpdates(block, updates) {
  const indent = /^(\s*)[A-Za-z][\w-]*\s*=/m.exec(block)?.[1] ?? '  ';
  const columns = [...block.matchAll(/^(\s*[A-Za-z][\w-]*\s*)=/gm)].map((match) => match[1].length);
  const equalsColumn = columns.length ? Math.max(...columns) : indent.length + 2;
  for (const [field, value] of Object.entries(updates)) {
    const existing = new RegExp(
      `^(\\s*${field}\\s*=\\s*)(\\{.*?\\}|".*?"|[^,\\n]+)(\\s*,?)`,
      'ims',
    );
    if (existing.test(block)) {
      block = block.replace(
        existing,
        (_, head, __, tail) => `${head}{${value}}${tail.trim() ? tail : ','}`,
      );
    } else {
      const pad = ' '.repeat(Math.max(1, equalsColumn - indent.length - field.length));
      let close = block.lastIndexOf('}');
      // The last field may lack its trailing comma (bib:missing writes it so).
      const lastField = block.slice(0, close).trimEnd().length;
      if (!block.slice(0, lastField).endsWith(',')) {
        block = `${block.slice(0, lastField)},${block.slice(lastField)}`;
        close += 1;
      }
      block = `${block.slice(0, close)}${indent}${field}${pad}= {${value}},\n${block.slice(close)}`;
    }
  }
  return block;
}

async function main() {
  const { values } = parseArgs({
    options: {
      file: { type: 'string', short: 'f', default: BIB_FILE },
      write: { type: 'boolean', default: false },
      'all-fields': { type: 'boolean', default: false },
      delay: { type: 'string', default: '0.5' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    printHeaderHelp(import.meta.url);
    return 0;
  }
  const delaySeconds = Number(values.delay);
  let text = readFileSync(values.file, 'utf8');
  const compareFields = [
    ...SAFE_FIELDS,
    ...CURATED_FIELDS,
    ...(values['all-fields'] ? VERBOSE_FIELDS : []),
  ];

  let withDoi = 0;
  let changed = 0;
  const edits = [];
  for (const entry of parseEntries(text)) {
    if (!entry.fields.doi) continue;
    withDoi += 1;
    const doi = unescapeDoi(entry.fields.doi);
    let message;
    try {
      message = await crossrefByDoi(doi);
    } catch (error) {
      console.error(`[${entry.key}] ERROR fetching ${doi}: ${error.message}`);
      continue;
    }
    if (!message) {
      console.log(`[${entry.key}] DOI not found in Crossref: ${doi}`);
      continue;
    }

    const crossref = crossrefFields(message, entry.type, 'journal' in entry.fields);
    const diffs = [];
    const updates = {};
    for (const field of compareFields) {
      if (!(field in crossref)) continue;
      const current = entry.fields[field] ?? '';
      if (normalizeField(current, field) !== normalizeField(crossref[field], field)) {
        diffs.push([field, current, crossref[field]]);
        if (SAFE_FIELDS.includes(field)) updates[field] = crossref[field];
      }
    }
    if (diffs.length) {
      changed += 1;
      console.log(`\n[${entry.key}]  (${doi})`);
      for (const [field, current, next] of diffs) {
        const tag = SAFE_FIELDS.includes(field) ? '' : '  (report-only, curated)';
        console.log(`  ${field}${tag}`);
        console.log(`      bib:      ${current || '(missing)'}`);
        console.log(`      crossref: ${next}`);
      }
      if (Object.keys(updates).length) edits.push({ entry, updates });
    }
    await sleep(delaySeconds * 1000);
  }

  console.log(`\nChecked ${withDoi} entries with a DOI; ${changed} differ from Crossref.`);
  if (values.write && edits.length) {
    // Back to front so earlier offsets stay valid.
    for (const { entry, updates } of edits.sort((a, b) => b.entry.start - a.entry.start)) {
      const block = applyUpdates(text.slice(entry.start, entry.end), updates);
      text = text.slice(0, entry.start) + block + text.slice(entry.end);
    }
    writeFileSync(values.file, text);
    console.log(`Wrote updates to ${edits.length} entries in ${values.file}.`);
  } else if (edits.length) {
    console.log('Run with --write to apply the safe-field updates above.');
  }
  return changed ? 1 : 0;
}

process.exitCode = await main();
