// GitHub data for the about page: a user's contributions calendar (the
// activity block), read from github.com/<user>'s public page, and the stars of
// a repository (projects without a `stars:` of their own), from the public
// REST API. Neither needs a token.
//
// Each result is cached in node_modules/.cache/lemma/: the dev server reuses
// one up to 6 hours old, a build always asks GitHub first, and either falls
// back to the cached copy when GitHub cannot be reached. The cache is not
// committed: it changes every day.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../node_modules/.cache/lemma/', import.meta.url));
const FRESH = 6 * 3600 * 1000;
// The dev server renders the page on every request: it asks again after this
// long, so a failed fetch is not retried on every reload, nor never.
const RETRY = 5 * 60 * 1000;
const memo = new Map();

/** @typedef {{ date: string, count: number, level: number }} Day */
/** @typedef {{ user: string, fetched: string, days: Day[] }} Calendar */

/**
 * The last year of a user's contributions, oldest day first; undefined when
 * GitHub cannot be reached and nothing is cached.
 * @param {string} user
 * @param {{ refresh?: boolean }} [options] refresh: ask GitHub even when the cache is recent (a build).
 * @returns {Promise<Calendar | undefined>}
 */
export const contributions = (user, options) =>
  cached(`github-${user}`, `GitHub contributions of ${user}`, options, () => calendar(user));

/**
 * The stars of a GitHub repository, from its URL; undefined for another URL,
 * or when GitHub cannot be reached and nothing is cached.
 * @param {string} url
 * @param {{ refresh?: boolean }} [options]
 * @returns {Promise<number | undefined>}
 */
export async function stars(url, options) {
  const repo = url.match(/^https?:\/\/(?:www\.)?github\.com\/([\w.-]+\/[\w.-]+?)(?:\.git)?\/?$/i)?.[1];
  if (!repo) return undefined;
  const result = await cached(`stars-${repo.replace('/', '--')}`, `stars of ${repo}`, options, async () => {
    const res = await get(`https://api.github.com/repos/${repo}`);
    return { fetched: new Date().toISOString(), stars: (await res.json()).stargazers_count };
  });
  return result?.stars;
}

/** A value from GitHub through the cache (see above); one fetch at a time per key. */
function cached(key, what, { refresh = false } = {}, fetcher) {
  const hit = memo.get(key);
  // A build keeps its answer; the dev server asks again after RETRY.
  if (hit && (refresh || Date.now() - hit.at < RETRY)) return hit.value;
  const value = load(join(DIR, `${key}.json`), what, refresh, fetcher);
  memo.set(key, { at: Date.now(), value });
  return value;
}

async function load(file, what, refresh, fetcher) {
  let copy;
  try {
    copy = JSON.parse(readFileSync(file, 'utf8'));
  } catch {}
  if (copy && !refresh && Date.now() - Date.parse(copy.fetched) < FRESH) return copy;
  try {
    const value = await fetcher();
    mkdirSync(DIR, { recursive: true });
    writeFileSync(file, JSON.stringify(value));
    return value;
  } catch (error) {
    console.warn(`[about] ${what}: ${error.message}; ${copy ? `using the copy from ${copy.fetched}` : 'nothing cached'}`);
    return copy;
  }
}

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res;
}

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

/** @returns {Promise<Calendar>} */
async function calendar(user) {
  const html = await (await get(`https://github.com/users/${encodeURIComponent(user)}/contributions`)).text();
  // Each day is a <td> with its date and level (0-4, as github.com shades
  // it); its count is in the <tool-tip> that names the cell's id ("No
  // contributions on ...", "1 contribution on ...", "1,024 contributions on ...").
  // The cells come row by row (weekdays), so days are sorted by date.
  const tips = new Map();
  for (const [, id, text] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) tips.set(id, text);
  const days = [...html.matchAll(/<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g)]
    .map(([td]) => ({
      date: attr(td, 'data-date'),
      level: Number(attr(td, 'data-level') ?? 0),
      count: Number(tips.get(attr(td, 'id'))?.match(/^([\d,]+) contributions? on/)?.[1].replaceAll(',', '') ?? 0),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300) throw new Error(`found ${days.length} days on the page, expected a year`);
  return { user, fetched: new Date().toISOString(), days };
}
