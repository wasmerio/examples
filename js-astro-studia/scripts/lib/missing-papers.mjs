/**
 * Source-independent half of the find-missing-papers scripts: parsing papers.bib,
 * matching publications against it, Crossref enrichment, entry formatting in the
 * file's style, byte-preserving insertion, the ignore list, Scholar-id lookup, and
 * the propose / ask / write loop. A script supplies only its source (a list of
 * publications shaped like below) and a thin main.
 *
 * Publication shape: {sourceId, kind, title, authors ("First Last"), year, venue,
 * volume, number, pages, school, doi, arxivId, preprint}.
 */
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { parse as parseYaml } from 'yaml';

export const BIB_FILE = 'src/data/papers.bib';
export const SOCIALS_FILE = 'src/data/socials.yml';
export const IGNORE_FILE = 'src/data/papers-ignore.yml';
export const CITATIONS_FILE = 'src/data/citations.yml';
// Crossref and OpenAlex ask for a contact address; set CROSSREF_MAILTO to yours
// (also read by scripts/update-bib.mjs).
export const MAILTO = process.env.CROSSREF_MAILTO ?? 'you@example.com';
export const USER_AGENT = `astro-studia-missing-papers/1.0 (mailto:${MAILTO})`;

// Titles at or above this similarity (on normalized text) are the same paper.
export const TITLE_MATCH_RATIO = 0.9;
// Crossref's search always returns something; only a near-identical title is a hit.
const CROSSREF_MATCH_RATIO = 0.95;
// Words skipped when picking the title word for a key (`fuchs_expert_2023`).
const KEY_STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'on',
  'of',
  'in',
  'for',
  'to',
  'and',
  'with',
  'towards',
  'toward',
]);
// Fields printed first, in this order; the rest follows alphabetically.
const LEADING_FIELDS = ['title', 'author', 'abbr'];

export class SourceUnavailable extends Error {}

export const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// --------------------------------------------------------------------------- //
// BibTeX block parsing (keeps offsets so we can insert in place)
// --------------------------------------------------------------------------- //
export function parseEntries(text) {
  const entries = [];
  for (const header of text.matchAll(/@(\w+)\s*\{\s*([^,\s]+)\s*,/g)) {
    const bodyOpen = text.indexOf('{', header.index);
    let depth = 0;
    let position = bodyOpen;
    for (; position < text.length; position += 1) {
      if (text[position] === '{') depth += 1;
      else if (text[position] === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const end = position + 1;
    entries.push({
      type: header[1].toLowerCase(),
      key: header[2],
      start: header.index,
      end,
      fields: parseFields(text.slice(header.index + header[0].length, end - 1)),
    });
  }
  return entries;
}

/** {name: raw value} for one entry body; handles braced, quoted and bare values. */
function parseFields(body) {
  const fields = {};
  const fieldStart = /([A-Za-z][\w-]*)\s*=\s*/y;
  let position = 0;
  while (position < body.length) {
    fieldStart.lastIndex = position;
    const start = fieldStart.exec(body);
    if (!start) {
      position += 1;
      continue;
    }
    position = fieldStart.lastIndex;
    let value;
    if (body[position] === '{') {
      let depth = 0;
      let cursor = position;
      for (; cursor < body.length; cursor += 1) {
        if (body[cursor] === '{') depth += 1;
        else if (body[cursor] === '}' && --depth === 0) break;
      }
      value = body.slice(position + 1, cursor);
      position = cursor + 1;
    } else if (body[position] === '"') {
      const closing = body.indexOf('"', position + 1);
      value = body.slice(position + 1, closing);
      position = closing + 1;
    } else {
      const bareEnd = body.slice(position).search(/[,\n]/);
      const end = bareEnd === -1 ? body.length : position + bareEnd;
      value = body.slice(position, end).trim();
      position = end;
    }
    fields[start[1].toLowerCase()] = value;
  }
  return fields;
}

// --------------------------------------------------------------------------- //
// Normalisation and similarity (LaTeX-vs-Unicode insensitive)
// --------------------------------------------------------------------------- //
export function normalize(value) {
  return value
    .replaceAll('\\ss', 'ss')
    .replaceAll('\\&', '&')
    .replaceAll('\\_', '_')
    .replaceAll('\\%', '%')
    .replaceAll('\\#', '#')
    .replaceAll('~', ' ')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\\./g, '')
    .replaceAll('{', '')
    .replaceAll('}', '')
    .replaceAll('ß', 'ss')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^0-9a-zA-Z]/g, '')
    .toLowerCase();
}

/** Ratcliff/Obershelp ratio, the same measure as Python's difflib.SequenceMatcher. */
export function similarity(left, right) {
  if (!left.length && !right.length) return 1;
  const matchingCharacters = (leftPart, rightPart) => {
    if (!leftPart.length || !rightPart.length) return 0;
    let bestLength = 0;
    let bestLeftStart = 0;
    let bestRightStart = 0;
    for (let leftStart = 0; leftStart < leftPart.length; leftStart += 1) {
      for (let rightStart = 0; rightStart < rightPart.length; rightStart += 1) {
        let length = 0;
        while (
          leftStart + length < leftPart.length &&
          rightStart + length < rightPart.length &&
          leftPart[leftStart + length] === rightPart[rightStart + length]
        ) {
          length += 1;
        }
        if (length > bestLength) {
          bestLength = length;
          bestLeftStart = leftStart;
          bestRightStart = rightStart;
        }
      }
    }
    if (!bestLength) return 0;
    return (
      bestLength +
      matchingCharacters(leftPart.slice(0, bestLeftStart), rightPart.slice(0, bestRightStart)) +
      matchingCharacters(
        leftPart.slice(bestLeftStart + bestLength),
        rightPart.slice(bestRightStart + bestLength),
      )
    );
  };
  return (2 * matchingCharacters(left, right)) / (left.length + right.length);
}

/**
 * Same paper by title: fuzzy match, or one title is the start of the other (OpenAlex
 * sometimes repeats a subtitle, which drags the ratio down).
 */
export function sameTitle(left, right) {
  const [shorter, longer] = left.length <= right.length ? [left, right] : [right, left];
  return (
    similarity(left, right) >= TITLE_MATCH_RATIO ||
    (shorter.length >= 25 && longer.startsWith(shorter))
  );
}

// --------------------------------------------------------------------------- //
// Configuration
// --------------------------------------------------------------------------- //
export function loadYaml(path) {
  return existsSync(path) ? (parseYaml(readFileSync(path, 'utf8')) ?? null) : null;
}

export function loadIgnoredIds() {
  return new Set((loadYaml(IGNORE_FILE) ?? []).map(String));
}

/** Add one id (with its title as a comment); never rewrites existing lines. */
export function appendToIgnoreFile(sourceId, title) {
  const header = existsSync(IGNORE_FILE)
    ? ''
    : '# Source ids (DBLP keys or OpenAlex ids) that scripts/find-missing-papers.mjs must not propose again.\n' +
      "# One '- id # title' per line.\n";
  appendFileSync(IGNORE_FILE, `${header}- ${sourceId} # ${title}\n`);
}

/** [{title, scholarId}] from the local Scholar dump (ids lose the user part). */
export function loadScholarTitles() {
  const papers = loadYaml(CITATIONS_FILE)?.papers ?? {};
  return Object.entries(papers).map(([fullId, paper]) => ({
    title: paper.title ?? '',
    scholarId: fullId.split(':').at(-1),
  }));
}

export function matchScholarId(title, scholarTitles) {
  const titleNormalized = normalize(title);
  let bestRatio = 0;
  let bestId = null;
  for (const { title: scholarTitle, scholarId } of scholarTitles) {
    const ratio = similarity(titleNormalized, normalize(scholarTitle));
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = scholarId;
    }
  }
  return bestRatio >= TITLE_MATCH_RATIO ? bestId : null;
}

// --------------------------------------------------------------------------- //
// Sources. Each returns publications shaped like:
//   {sourceId, kind, title, authors ("First Last"), year, venue, volume, number,
//    pages, school, doi, arxivId, preprint}
// --------------------------------------------------------------------------- //
export function decodeEntities(text) {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&');
}

export function arxivIdFromDoi(doi) {
  return doi?.toLowerCase().startsWith('10.48550/arxiv.')
    ? doi.slice('10.48550/arxiv.'.length)
    : null;
}

// --------------------------------------------------------------------------- //
// Matching against the bib file
// --------------------------------------------------------------------------- //
export function findMissing(publications, bibEntries, ignoredIds) {
  const knownDois = new Set();
  const knownTitles = [];
  for (const entry of bibEntries) {
    if (entry.fields.doi) knownDois.add(unescapeDoi(entry.fields.doi).toLowerCase());
    if (entry.fields.title) knownTitles.push(normalize(entry.fields.title));
  }
  const missing = [];
  let presentCount = 0;
  let ignoredCount = 0;
  for (const publication of publications) {
    if (ignoredIds.has(publication.sourceId)) {
      ignoredCount += 1;
      continue;
    }
    const titleNormalized = normalize(publication.title);
    const doiKnown = Boolean(publication.doi) && knownDois.has(publication.doi.toLowerCase());
    const titleKnown = knownTitles.some((known) => sameTitle(titleNormalized, known));
    if (doiKnown || titleKnown) presentCount += 1;
    else missing.push(publication);
  }
  return { missing, presentCount, ignoredCount };
}

// --------------------------------------------------------------------------- //
// Crossref (shared with scripts/update-bib.mjs)
// --------------------------------------------------------------------------- //
export const unescapeDoi = (doi) =>
  doi.replaceAll('\\_', '_').replaceAll('\\&', '&').replaceAll('\\%', '%');

export async function crossrefRequest(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': USER_AGENT },
        signal: AbortSignal.timeout(30_000),
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return (await response.json()).message;
    } catch (error) {
      if (attempt === retries) throw error;
      await sleep(2000 * attempt);
    }
  }
  return null;
}

export function crossrefFields(message, entryType, hasJournal) {
  const fields = {};
  const first = (name) => (Array.isArray(message[name]) ? message[name][0] : message[name]);
  const title = first('title');
  if (title) fields.title = title.trim();
  const names = (message.author ?? []).flatMap((author) => {
    const family = (author.family ?? '').trim();
    const given = (author.given ?? '').trim();
    return family ? [given ? `${family}, ${given}` : family] : [];
  });
  if (names.length) fields.author = names.join(' and ');
  const container = first('container-title');
  if (container)
    fields[entryType === 'article' || hasJournal ? 'journal' : 'booktitle'] = container.trim();
  if (message.page) fields.pages = message.page.replaceAll('-', '--');
  if (message.volume) fields.volume = String(message.volume).trim();
  if (message.issue) fields.number = String(message.issue).trim();
  if (message.publisher) fields.publisher = message.publisher.trim();
  const isbn = first('ISBN');
  if (isbn) fields.isbn = isbn.replaceAll('-', '').trim();
  // Prefer the electronic ISSN: the DOI resolves to the online version.
  const issn =
    (message['issn-type'] ?? []).find(
      (issnType) => issnType.type === 'electronic' && issnType.value,
    )?.value ?? first('ISSN');
  if (issn) fields.issn = issn.trim();
  const dateParts = (message.issued ?? message.published)?.['date-parts']?.[0];
  if (dateParts?.[0]) fields.year = String(dateParts[0]);
  if (dateParts?.[1]) fields.month = String(dateParts[1]);
  return fields;
}

export const crossrefByDoi = (doi) =>
  crossrefRequest(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);

export async function crossrefMessageFor(publication, delaySeconds) {
  if (publication.arxivId) return null; // preprints are described by the source alone
  try {
    const message = publication.doi
      ? await crossrefByDoi(publication.doi)
      : await searchCrossref(publication.title);
    return message;
  } catch (error) {
    console.error(`  Crossref lookup failed: ${error.message}`);
    return null;
  } finally {
    await sleep(delaySeconds * 1000);
  }
}

async function searchCrossref(title) {
  const query = encodeURIComponent(title);
  const response = await fetch(
    `https://api.crossref.org/works?rows=3&query.bibliographic=${query}`,
    { headers: { 'user-agent': USER_AGENT }, signal: AbortSignal.timeout(30_000) },
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { items } = (await response.json()).message;
  return (
    items.find(
      (candidate) =>
        similarity(normalize(title), normalize(candidate.title?.[0] ?? '')) >= CROSSREF_MATCH_RATIO,
    ) ?? null
  );
}

// --------------------------------------------------------------------------- //
// Building an entry in papers.bib's style
// --------------------------------------------------------------------------- //
/** ASCII-fold for citation keys; umlauts become ae/oe/ue like `kuehn_...`. */
export function foldForKey(text) {
  const umlauts = { ß: 'ss', ä: 'ae', ö: 'oe', ü: 'ue', Ä: 'Ae', Ö: 'Oe', Ü: 'Ue' };
  return text
    .replace(/[ßäöüÄÖÜ]/g, (character) => umlauts[character])
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** 'Ada von Neumann' -> ['von Neumann', 'Ada']; lowercase particles stay with the surname. */
export function splitAuthorName(fullName) {
  const tokens = fullName.split(/\s+/);
  if (tokens.length === 1) return [tokens[0], ''];
  let surnameStart = tokens.length - 1;
  while (
    surnameStart > 1 &&
    tokens[surnameStart - 1][0] === tokens[surnameStart - 1][0].toLowerCase()
  ) {
    surnameStart -= 1;
  }
  return [tokens.slice(surnameStart).join(' '), tokens.slice(0, surnameStart).join(' ')];
}

/** `<lastname>_<first significant title word>_<year>`, made unique with a/b/c. */
export function makeKey(firstAuthor, title, year, takenKeys) {
  const surname = foldForKey(splitAuthorName(firstAuthor)[0]);
  const titleWords = title.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? ['untitled'];
  const significant = titleWords.filter((word) => !KEY_STOP_WORDS.has(word.toLowerCase()));
  const base = `${surname}_${foldForKey(significant[0] ?? titleWords[0])}_${year}`;
  let key = base;
  for (let suffixIndex = 0; takenKeys.has(key); suffixIndex += 1) {
    key = base + 'abcdefghijklmnopqrstuvwxyz'[suffixIndex];
  }
  return key;
}

/** Escape what BibTeX treats specially, and ß the way the file writes it. */
export function texEscape(text) {
  return text.replace(/[&%#_]/g, (special) => `\\${special}`).replaceAll('ß', '{\\ss}');
}

/** Brace every capitalised word part: "Who's Who" -> "{Who}'s {Who}". */
export function protectTitle(title) {
  const braced = title.replace(/[\p{L}\p{N}]+/gu, (word) =>
    word !== word.toLowerCase() ? `{${word}}` : word,
  );
  return texEscape(braced);
}

export function formatAuthorList(authors) {
  return authors
    .map((author) => {
      const [surname, givenNames] = splitAuthorName(author);
      return texEscape(givenNames ? `${surname}, ${givenNames}` : surname);
    })
    .join(' and ');
}

export function entryTypeFor(publication, crossrefMessage) {
  if (publication.arxivId) return 'misc';
  const crossrefType = crossrefMessage?.type;
  if (crossrefType === 'journal-article') return 'article';
  if (crossrefType === 'proceedings-article') return 'inproceedings';
  if (crossrefType === 'book-chapter') return 'incollection';
  return (
    {
      phdthesis: 'phdthesis',
      mastersthesis: 'masterthesis',
      article: 'article',
      incollection: 'incollection',
    }[publication.kind] ?? 'inproceedings'
  );
}

/** {field: LaTeX-safe value} from the source, overridden by Crossref where present. */
export function buildFields(publication, crossrefMessage, entryType, source) {
  const fields = {
    title: protectTitle(publication.title),
    author: formatAuthorList(publication.authors),
    year: publication.year,
  };
  const venueField = entryType === 'article' ? 'journal' : 'booktitle';
  if (publication.arxivId) {
    Object.assign(fields, {
      abbr: 'arXiv',
      journal: 'arXiv',
      publisher: 'arXiv',
      volume: `abs/${publication.arxivId}`,
      url: `https://arxiv.org/abs/${publication.arxivId}`,
    });
  } else if (publication.school) {
    fields.school = texEscape(publication.school);
  } else {
    // DBLP's venue is an acronym ("ECSA", "TAAS"), which is the file's `abbr`.
    if (source === 'dblp' && publication.venue) fields.abbr = texEscape(publication.venue);
    fields.volume = publication.volume;
    fields.number = publication.number;
    if (publication.pages)
      fields.pages = publication.pages.replaceAll('-', '--').replaceAll('----', '--');
  }
  if (publication.doi) fields.doi = texEscape(publication.doi);

  if (crossrefMessage) {
    // Crossref has the full venue name and publication date the sources lack.
    const enriched = crossrefFields(crossrefMessage, entryType, entryType === 'article');
    for (const name of [
      'journal',
      'booktitle',
      'pages',
      'volume',
      'number',
      'publisher',
      'isbn',
      'issn',
      'year',
      'month',
    ]) {
      if (enriched[name]) fields[name] = texEscape(enriched[name]);
    }
    if (crossrefMessage.DOI) {
      fields.doi = texEscape(crossrefMessage.DOI.toLowerCase());
    }
    if (!fields.journal && !fields.booktitle && publication.venue) {
      fields[venueField] = texEscape(publication.venue);
    }
  } else if (publication.venue && !publication.arxivId && !publication.school) {
    fields[venueField] = texEscape(publication.venue);
  }
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value));
}

/** Two-space indent, `=` aligned, leading title/author/abbr, rest alphabetical. */
export function formatEntry(entryType, key, fields) {
  const names = [
    ...LEADING_FIELDS.filter((name) => name in fields),
    ...Object.keys(fields)
      .filter((name) => !LEADING_FIELDS.includes(name))
      .sort(),
  ];
  const width = Math.max(...names.map((name) => name.length));
  const lines = names.map((name) => `  ${name.padEnd(width)} = {${fields[name]}}`);
  return `@${entryType}{${key},\n${lines.join(',\n')}\n}`;
}

/** Insert after the last entry of `year` (or the last earlier one); rest untouched. */
export function insertEntry(text, entryText, year) {
  let anchor = null;
  for (const entry of parseEntries(text)) {
    const entryYear = entry.fields.year ?? '';
    if (/^\d+$/.test(entryYear) && Number(entryYear) > Number(year)) break;
    anchor = entry;
  }
  if (!anchor) return `${entryText}\n\n${text}`;
  return `${text.slice(0, anchor.end)}\n\n${entryText}${text.slice(anchor.end)}`;
}

// --------------------------------------------------------------------------- //
/** Print the usage block of a script's header comment (for -h). */
export function printHeaderHelp(scriptUrl) {
  console.log(
    readFileSync(new URL(scriptUrl), 'utf8')
      .match(/\/\*\*([\s\S]*?)\*\//)[1]
      .replace(/^ \* ?/gm, ''),
  );
}

/**
 * Compare publications with the bib, propose entries for the missing ones, optionally
 * ask per entry, and write. Returns the exit code (0 nothing missing, 1 otherwise).
 */
export async function proposeMissingPapers({
  publications,
  sourceName,
  bibFile,
  bibText,
  interactive,
  yes,
  delaySeconds,
}) {
  const bibEntries = parseEntries(bibText);
  const { missing, presentCount, ignoredCount } = findMissing(
    publications,
    bibEntries,
    loadIgnoredIds(),
  );
  console.log(
    `Source: ${sourceName}. ${publications.length} records: ${presentCount} already in the bib, ` +
      `${ignoredCount} ignored, ${missing.length} missing.`,
  );
  if (!missing.length) return 0;

  const takenKeys = new Set(bibEntries.map((entry) => entry.key));
  const scholarTitles = loadScholarTitles();
  const proposals = [];
  for (const publication of missing) {
    const crossrefMessage = await crossrefMessageFor(publication, delaySeconds);
    const entryType = entryTypeFor(publication, crossrefMessage);
    const fields = buildFields(publication, crossrefMessage, entryType, sourceName);
    const key = makeKey(
      publication.authors[0],
      publication.title,
      fields.year ?? 'xxxx',
      takenKeys,
    );
    takenKeys.add(key);
    const scholarId = matchScholarId(publication.title, scholarTitles);
    if (scholarId) fields.google_scholar_id = scholarId;
    proposals.push({ publication, entryType, key, fields });
  }

  const readline =
    interactive && !yes ? createInterface({ input: process.stdin, output: process.stdout }) : null;
  let updatedText = bibText;
  let addedCount = 0;
  for (const { publication, entryType, key, fields } of proposals) {
    console.log(`\n[${publication.sourceId}]\n${formatEntry(entryType, key, fields)}`);
    console.log(
      fields.abbr
        ? '  reminder: check `abbr` (taken from the source venue)'
        : '  reminder: set `abbr` by hand',
    );
    if (!fields.google_scholar_id) {
      console.log('  note: not in citations.yml (not on Scholar yet?); no google_scholar_id');
    }
    if (!interactive && !yes) continue;
    if (readline) {
      let answer;
      try {
        answer = (await readline.question('Add? [y]es / [n]o / [i]gnore forever / [q]uit: '))
          .trim()
          .toLowerCase();
      } catch {
        answer = 'q'; // stdin closed
      }
      if (answer === 'q') break;
      if (answer === 'i') {
        appendToIgnoreFile(publication.sourceId, publication.title);
        console.log(`  added to ${IGNORE_FILE}`);
        continue;
      }
      if (answer !== 'y') continue;
    }
    updatedText = insertEntry(
      updatedText,
      formatEntry(entryType, key, fields),
      fields.year ?? '9999',
    );
    addedCount += 1;
  }
  readline?.close();

  if (addedCount) {
    writeFileSync(bibFile, updatedText);
    console.log(`\nAdded ${addedCount} entries to ${bibFile}.`);
  } else {
    console.log(`\n${proposals.length} missing entries. Run with -i or --yes to add them.`);
  }
  return 1;
}
