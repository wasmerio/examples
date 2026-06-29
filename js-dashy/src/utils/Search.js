/* Dashy: Licensed under MIT, (C) Alicia Sykes 2024 <https://aliciasykes.com> */

/* Tile filtering utility */
import ErrorHandler from '@/utils/logging/ErrorHandler';

/* Normalize a string for case/punctuation-insensitive matching */
const NORMALIZE_RE = /[^\w\s\p{Alpha}]/giu;
const normalize = (input) => (input == null ? '' : input.toString().toLowerCase().replace(NORMALIZE_RE, ''));

/* Per-tile cache of the concatenated searchable text */
const haystackCache = new WeakMap();

const buildHaystack = (tile) => {
  const {
    title, description, provider, url, tags, subItems,
  } = tile;
  const tagsStr = Array.isArray(tags) ? tags.join(' ') : (tags || '');
  const subText = Array.isArray(subItems)
    ? subItems.map((s) => `${s.title || ''} ${s.url || ''}`).join(' ')
    : '';
  return normalize(`${title || ''} ${provider || ''} ${description || ''} ${tagsStr} ${url || ''} ${subText}`);
};

const getHaystack = (tile) => {
  let h = haystackCache.get(tile);
  if (h === undefined) {
    h = buildHaystack(tile);
    haystackCache.set(tile, h);
  }
  return h;
};

/**
 * Filter tiles based on users search term, and returns a filtered list
 * Will match based on title, description, provider, hostname from url and tags
 * Ignores case, special characters and other irrelevant things
 * @param {array} allTiles An array of tiles
 * @param {string} searchTerm The users search term
 * @returns A filtered array of tiles
 */
export const searchTiles = (allTiles, searchTerm, extraHaystack = '') => {
  if (!searchTerm) return allTiles;
  if (!allTiles) return [];
  const words = normalize(searchTerm).split(/\s+/).filter(Boolean);
  if (!words.length) return allTiles;
  const extra = normalize(extraHaystack);
  return allTiles.filter((tile) => {
    const haystack = getHaystack(tile);
    return words.every((word) => haystack.includes(word) || extra.includes(word));
  });
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sortedBangs = (bangList) => Object.keys(bangList || {}).sort((a, b) => b.length - a.length);
const bangPattern = (bang, flags = '') => new RegExp(`(^|\\s)${escapeRegex(bang)}(?=\\s|$)`, flags);

/* From a list of search bangs, return the URL associated with it */
export const getSearchEngineFromBang = (searchQuery, bangList) => {
  if (!bangList) return undefined;
  const found = sortedBangs(bangList).find((bang) => bangPattern(bang).test(searchQuery));
  return bangList[found];
};

/* For a given search engine key, return the corresponding URL, or throw error */
export const findUrlForSearchEngine = (searchEngine, availableSearchEngines) => {
  // If missing search engine, report error return false
  if (!searchEngine) { ErrorHandler('No search engine specified'); return undefined; }
  // If search engine is already a URL, then return it
  if ((/(http|https):\/\/[^]*/).test(searchEngine)) return searchEngine;
  // If search engine was found successfully, return the URL
  if (availableSearchEngines[searchEngine]) return availableSearchEngines[searchEngine];
  // Otherwise, there's been an error, log it and return false
  ErrorHandler(`Specified Search Engine was not Found: '${searchEngine}'`);
  return undefined;
};

/* Removes all known bangs from a search query, leaving the actual terms */
export const stripBangs = (searchQuery, bangList) => sortedBangs(bangList)
  .reduce((q, bang) => q.replace(bangPattern(bang, 'g'), '$1'), searchQuery)
  .replace(/\s+/g, ' ')
  .trim();

/* Check if a given input looks like a URL (to open directly on enter, if configured) */
export const isUrlLike = (input) => {
  const s = (input || '').trim();
  if (!s || /\s/.test(s)) return false;
  if (/^https?:\/\//i.test(s)) return true;
  if (/^localhost(:\d+)?(\/\S*)?$/i.test(s)) return true;
  return /^[\w-]+(\.[\w-]+)*(:\d+)?(\/\S*)?$/.test(s) && /[.:/]/.test(s);
};
