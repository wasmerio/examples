/**
 * Refresh src/data/citations.yml from a Google Scholar profile.
 *
 *   npm run data:citations
 *
 * OPT-IN, and needs a network: Scholar rate-limits hard and has no API. It is
 * wired to .github/workflows/update-citations.yml, which runs on demand only.
 * Nothing depends on ever running it: citations.yml is committed, so the chips
 * and h-index render offline from whatever was last written. Set
 * `scholar_userid` in src/data/socials.yml; with it unset the script exits and
 * says so. Scholar unreachable, rate-limited or too slow leaves the file alone
 * and exits 0.
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { Scalar, parse, stringify } from 'yaml';
import { decodeEntities } from './lib/missing-papers.mjs';

const ROOT = process.cwd();
const CONFIG = join(ROOT, 'src/data/socials.yml');
const OUT = join(ROOT, 'src/data/citations.yml');
const OUT_REL = 'src/data/citations.yml';

const PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 15_000;
const RETRIES = 3;
const BUDGET_S = Number(process.env.SCHOLAR_TIME_BUDGET) || 270;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

class ScholarUnavailable extends Error {}

/** Parse the `tr.gsc_a_tr` rows of one profile page. */
export function parseRows(html) {
  html = html.replaceAll('\u00a0', ' '); // as scholarly did
  const rows = [];
  for (const [, row] of html.matchAll(
    /<tr[^>]*class="[^"]*\bgsc_a_tr\b[^"]*"[^>]*>([\s\S]*?)<\/tr>/g,
  )) {
    const link = row.match(/<a[^>]*class="[^"]*\bgsc_a_at\b[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    if (!link) continue;
    const href = decodeEntities(link[0].match(/href="([^"]*)"/)?.[1] ?? '');
    const id = href.match(/citation_for_view=([^&"]+)/)?.[1];
    if (!id) continue;
    const text = (re) =>
      row
        .match(re)?.[1]
        .replace(/<[^>]*>/g, '')
        .trim() ?? '';
    const cites = text(/<a[^>]*class="[^"]*\bgsc_a_ac\b[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    rows.push({
      id: decodeURIComponent(id),
      title: decodeEntities(link[1].replace(/<[^>]*>/g, '').trim()),
      year:
        text(/<span[^>]*class="[^"]*\bgsc_a_h\b[^"]*"[^>]*>([\s\S]*?)<\/span>/) || 'Unknown Year',
      citations: /^\d+$/.test(cites) ? Number(cites) : 0,
    });
  }
  return rows;
}

async function fetchPage(url, signal) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': USER_AGENT, 'accept-language': 'en' },
        signal: AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
      });
      if (res.status === 404) return null;
      if (res.status === 429 || res.status === 403)
        throw new ScholarUnavailable(`HTTP ${res.status}`);
      if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) throw new ScholarUnavailable(`HTTP ${res.status}`);
      const html = await res.text();
      if (
        /unusual traffic|id="gs_captcha|\/sorry\/|recaptcha/i.test(html) &&
        !html.includes('gsc_a_tr')
      ) {
        throw new ScholarUnavailable('CAPTCHA / unusual-traffic page');
      }
      return html;
    } catch (err) {
      if (err instanceof ScholarUnavailable || signal.aborted || attempt >= RETRIES) {
        throw err instanceof ScholarUnavailable ? err : new ScholarUnavailable(err.message);
      }
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function fetchAll(userId, signal) {
  const papers = {};
  for (let start = 0; ; start += PAGE_SIZE) {
    const url = `https://scholar.google.com/citations?user=${encodeURIComponent(userId)}&hl=en&cstart=${start}&pagesize=${PAGE_SIZE}`;
    const html = await fetchPage(url, signal);
    if (html === null) {
      console.log(
        `No Scholar profile found for user ID '${userId}'. Please verify the ID and try again.`,
      );
      process.exit(1);
    }
    const rows = parseRows(html);
    for (const { id, title, year, citations } of rows) {
      console.log(`Found: ${title} (${year}) - Citations: ${citations}`);
      papers[id] = { title, year, citations };
    }
    if (rows.length < PAGE_SIZE) return papers;
  }
}

function loadUserId() {
  if (!existsSync(CONFIG)) {
    console.log(
      `Configuration file src/data/socials.yml not found. Please ensure the file exists and contains your Google Scholar user ID.`,
    );
    process.exit(1);
  }
  let config;
  try {
    config = parse(readFileSync(CONFIG, 'utf8'));
  } catch (err) {
    console.log(
      `Error parsing YAML file src/data/socials.yml: ${err.message}. Please check the file for correct YAML syntax.`,
    );
    process.exit(1);
  }
  const id = config?.scholar_userid;
  if (!id) {
    console.log(
      "No 'scholar_userid' found in the configuration file. Please add 'scholar_userid' to src/data/socials.yml.",
    );
    process.exit(1);
  }
  return String(id);
}

async function main() {
  const userId = loadUserId();
  console.log(`Fetching citations for Google Scholar ID: ${userId}`);
  const today = new Date().toLocaleDateString('sv-SE'); // local YYYY-MM-DD

  let existing = null;
  let header = '';
  if (existsSync(OUT)) {
    try {
      const text = readFileSync(OUT, 'utf8');
      header = text.match(/^((?:#.*\n|\n)*)/)[1];
      existing = parse(text);
    } catch (err) {
      console.log(
        `Warning: Could not read existing citation data from ${OUT_REL}: ${err.message}. The file may be missing or corrupted.`,
      );
    }
    const last = existing?.metadata?.last_updated;
    if (last) console.log(`Last updated on: ${last}`);
    if (last === today) {
      console.log('Citations data is already up-to-date. Skipping fetch.');
      return;
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BUDGET_S * 1000);
  process.once('SIGTERM', () => controller.abort());

  let papers;
  try {
    papers = await fetchAll(userId, controller.signal);
  } catch (err) {
    if (!(err instanceof ScholarUnavailable)) throw err;
    const why = controller.signal.aborted
      ? `did not answer within ${BUDGET_S}s`
      : `could not be reached (${err.message})`;
    console.log(
      `Google Scholar ${why}. Leaving ${OUT_REL} unchanged; the next scheduled run will retry.`,
    );
    return;
  } finally {
    clearTimeout(timer);
  }

  if (Object.keys(papers).length === 0) {
    console.log(`No publications found for user ID '${userId}'.`);
    process.exit(1);
  }
  const sorted = Object.fromEntries(
    Object.entries(papers).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
  if (isDeepStrictEqual(existing?.papers, sorted)) {
    console.log('No changes in citation data. Skipping file update.');
    return;
  }

  const date = new Scalar(today);
  date.type = Scalar.QUOTE_SINGLE;
  const body = stringify(
    { metadata: { last_updated: date }, papers: sorted },
    { singleQuote: true, lineWidth: 0, sortMapEntries: true },
  );
  const tmp = `${OUT}.tmp`;
  writeFileSync(tmp, header + body);
  renameSync(tmp, OUT);
  console.log(`Citation data saved to ${OUT_REL}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main().catch((err) => {
    console.log(`Unexpected error: ${err.message}`);
    process.exit(1);
  });
}
