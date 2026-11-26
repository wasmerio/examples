#!/usr/bin/env node
/**
 * Plain-language readability gate.
 * Reads all markdown content files, estimates the school grade level needed to
 * read each one, and exits 1 if any file exceeds the threshold.
 *
 * Content is scored with a formula built for the language it is written in:
 * Flesch-Kincaid for English, and Fernández Huerta / Crawford for Spanish.
 * Running Flesch-Kincaid over Spanish would not measure readability — Spanish
 * words carry more syllables than English ones on average, so every Spanish
 * file would score several grades too high and a perfectly plain translation
 * would fail the gate. Language is taken from the locale subdirectory, the same
 * convention the content collections use (see src/utils/content.ts).
 *
 * Threshold: grade ≤ 8 (readable at ~8th-grade level).
 * Run: node scripts/plain-language.mjs [--threshold=8] [--verbose]
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const args = process.argv.slice(2);
const threshold = parseFloat(args.find(a => a.startsWith('--threshold='))?.split('=')[1] ?? '8');
const verbose = args.includes('--verbose');

// ─── Readability helpers ──────────────────────────────────────────────────────

function countSyllablesEn(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  // Strip silent e and common suffixes
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? Math.max(1, m.length) : 1;
}

// Spanish syllables track vowel groups closely. Two strong vowels side by side
// (a, e, o, or any accented vowel) form separate syllables — "le-er", "ca-os" —
// while a weak vowel (i, u) beside another vowel forms one diphthong: "bien".
const STRONG = 'aeoáéíóúý';
const WEAK = 'iu';

function countSyllablesEs(word) {
  word = word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
  if (!word) return 0;
  const groups = word.match(/[aeiouáéíóúü]+/g);
  if (!groups) return 1;
  let syllables = 0;
  for (const group of groups) {
    syllables += 1;
    // Each additional strong vowel in a run opens another syllable.
    for (let i = 1; i < group.length; i++) {
      const prev = group[i - 1];
      const cur = group[i];
      if (STRONG.includes(prev) && STRONG.includes(cur)) syllables += 1;
      else if (WEAK.includes(prev) && WEAK.includes(cur) && prev !== cur) continue;
    }
  }
  return Math.max(1, syllables);
}

function stripMarkdown(text) {
  return text
    .replace(/^---[\s\S]*?---/m, '')   // frontmatter
    .replace(/```[\s\S]*?```/g, ' ')   // code blocks
    .replace(/`[^`]+`/g, ' ')          // inline code
    .replace(/!\[.*?\]\(.*?\)/g, ' ')  // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text
    .replace(/#{1,6}\s+/g, '')         // headings
    .replace(/[*_~>|]+/g, ' ')         // emphasis, tables, blockquotes
    .replace(/[^\S\n]+/g, ' ')         // collapse horizontal whitespace, preserve newlines
    .replace(/\n{3,}/g, '\n\n')        // collapse blank lines
    .trim();
}

const LETTER = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ¿¡]/;

function gradeLevel(text, lang) {
  // Split on punctuation OR newlines — each bullet-point line is a sentence unit.
  const sentences = text
    .split(/[.!?]+|\n/)
    .map(s => s.trim())
    .filter(s => s.length > 8 && LETTER.test(s));
  if (sentences.length === 0) return null;

  const words = text.split(/\s+/).filter(w => LETTER.test(w));
  if (words.length < 10) return null; // too short to score

  const countSyllables = lang === 'es' ? countSyllablesEs : countSyllablesEn;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  let grade;
  if (lang === 'es') {
    // Fórmula de Crawford — years of schooling needed for a Spanish text, from
    // sentences per 100 words (OP) and syllables per 100 words (SP).
    const op = (sentences.length / words.length) * 100;
    const sp = (syllables / words.length) * 100;
    grade = -0.205 * op + 0.049 * sp - 3.407;
  } else {
    const asl = words.length / sentences.length; // avg sentence length
    const asw = syllables / words.length;        // avg syllables per word
    grade = 0.39 * asl + 11.8 * asw - 15.59;     // Flesch-Kincaid Grade Level
  }

  return {
    grade: Math.round(grade * 10) / 10,
    words: words.length,
    sentences: sentences.length,
    lang,
  };
}

/** Language a content file is written in, from its locale subdirectory. */
function fileLang(relativePath) {
  return /(^|\/)es\//.test(relativePath) ? 'es' : 'en';
}

// ─── File walker ─────────────────────────────────────────────────────────────

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (['.md', '.mdx'].includes(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const contentDir = join(process.cwd(), 'src/content');
const files = walk(contentDir);

if (files.length === 0) {
  console.log('No markdown files found in src/content — skipping plain-language check.');
  process.exit(0);
}

const results = [];
let failed = false;

for (const file of files) {
  const raw = readFileSync(file, 'utf-8');
  const text = stripMarkdown(raw);
  const rel = file.replace(process.cwd() + '/', '');
  const score = gradeLevel(text, fileLang(rel));

  if (!score) {
    if (verbose) console.log(`  SKIP  ${rel} (too short)`);
    continue;
  }

  const status = score.grade <= threshold ? 'PASS' : 'FAIL';
  if (status === 'FAIL') failed = true;

  results.push({ file: rel, ...score, status });

  if (verbose || status === 'FAIL') {
    const icon = status === 'PASS' ? '✓' : '✗';
    console.log(`  ${icon} ${rel}`);
    console.log(`      lang=${score.lang}  grade=${score.grade}  words=${score.words}  sentences=${score.sentences}`);
  }
}

if (results.length === 0) {
  console.log('No scoreable content found — skipping plain-language check.');
  process.exit(0);
}

const avg = results.reduce((sum, r) => sum + r.grade, 0) / results.length;
const rounded = Math.round(avg * 10) / 10;
const pass = results.filter(r => r.status === 'PASS').length;
const total = results.length;

const byLang = (lang) => results.filter(r => r.lang === lang);
const avgFor = (rows) =>
  rows.length ? Math.round((rows.reduce((sum, r) => sum + r.grade, 0) / rows.length) * 10) / 10 : null;

console.log('');
console.log(`Plain-language check — reading grade level`);
console.log(`  Threshold : ≤ ${threshold}`);
console.log(`  Average   : ${rounded}  (${pass}/${total} files pass individually)`);
for (const lang of ['en', 'es']) {
  const rows = byLang(lang);
  if (!rows.length) continue;
  const formula = lang === 'es' ? 'Crawford' : 'Flesch-Kincaid';
  console.log(`  ${lang}        : ${avgFor(rows)}  (${rows.length} files, ${formula})`);
}

if (failed) {
  console.log('');
  console.log('FAIL: One or more content files exceed the grade-level threshold.');
  console.log('Simplify sentences and use shorter words in the files listed above.');
  process.exit(1);
}

console.log('  Result    : PASS');
