#!/usr/bin/env node
/**
 * Find papers the author has published that src/data/papers.bib does not list yet,
 * and propose them as entries in the file's own style.
 *
 * Usage:  npm run bib:missing                      dry-run: print proposed entries
 *         npm run bib:missing -- -i                ask per entry: add / skip / ignore / quit
 *         npm run bib:missing -- --yes             add every proposed entry
 *         npm run bib:missing -- -f path.bib       use a different .bib file
 *         npm run bib:missing -- --source openalex force one source (dblp | openalex)
 *         npm run bib:missing -- --dblp-xml FILE   read a saved copy of the DBLP person XML
 *
 * The publication list comes from DBLP (PID from `dblp_url` in src/data/socials.yml).
 * DBLP currently serves a bot check to scripts; in a terminal the script then offers
 * to open https://dblp.org/pid/<pid>.xml in the browser and reads the copy you save
 * (or pass one with --dblp-xml). Otherwise it falls back to OpenAlex (looked up by
 * `orcid_id`, noisier, filtered harder).
 *
 * A record counts as present when its DOI or its fuzzy title matches a bib entry, or
 * when its source id is listed in src/data/papers-ignore.yml. Venue, pages and date
 * are completed from Crossref where a DOI (or a close title match) exists, and
 * `google_scholar_id` is taken from src/data/citations.yml by title. New entries go
 * after the last entry of the same year; the rest of the file is preserved byte for
 * byte and existing entries are never modified.
 *
 * Exit code: 0 when nothing is missing (or no source could be reached), 1 when
 * something is missing (also after adding it, so the dry-run works as a check).
 */
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { XMLParser } from 'fast-xml-parser';
import { COMMON_HTML, CURRENCY, EntityDecoder, XML } from '@nodable/entities';
import {
  BIB_FILE,
  SOCIALS_FILE,
  SourceUnavailable,
  USER_AGENT,
  MAILTO,
  TITLE_MATCH_RATIO,
  arxivIdFromDoi,
  decodeEntities,
  loadYaml,
  normalize,
  printHeaderHelp,
  proposeMissingPapers,
  similarity,
  sleep,
} from './lib/missing-papers.mjs';

const DBLP_RECORD_TAGS = new Set([
  'article',
  'inproceedings',
  'incollection',
  'phdthesis',
  'mastersthesis',
]);
// OpenAlex work types worth proposing, mapped to the DBLP record kind they resemble.
// Everything else (software, dataset, paratext, peer-review, ...) is skipped.
const OPENALEX_KINDS = {
  article: 'article',
  'conference-paper': 'inproceedings',
  'book-chapter': 'incollection',
  dissertation: 'phdthesis',
  preprint: 'article',
  review: 'article',
};
// OpenAlex also files replication packages and demo videos under article-like types.
const OPENALEX_ARTIFACT_TITLE =
  /^(replication package|dataset for|supplementary material|demo video)/i;
// DOI prefixes of institutional repository copies that duplicate the real publication.
const REPOSITORY_DOI_PREFIXES = ['10.5445/', '10.34657/', '10.48366/'];

/** Concatenated text of a fast-xml-parser (preserveOrder) node list, markup stripped. */
function textOf(nodes) {
  return nodes
    .map((node) => {
      if ('#text' in node) return String(node['#text']);
      const tagName = Object.keys(node).find((name) => name !== ':@');
      return textOf(node[tagName]);
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDblpRecords(xmlText) {
  const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    attributeNamePrefix: '',
    entityDecoder: new EntityDecoder({
      namedEntities: { ...XML, ...COMMON_HTML, ...CURRENCY },
      numericAllowed: true,
    }),
    trimValues: false,
  });
  const publications = [];
  const collectRecords = (nodes) => {
    for (const node of nodes) {
      const tagName = Object.keys(node).find((name) => name !== ':@');
      if (!tagName || tagName === '#text') continue;
      if (!DBLP_RECORD_TAGS.has(tagName)) {
        collectRecords(node[tagName]);
        continue;
      }
      const children = node[tagName];
      const childrenNamed = (name) =>
        children.filter((child) => name in child).map((child) => textOf(child[name]));
      const authors = childrenNamed('author').map((name) => name.replace(/\s+\d{4}$/, ''));
      const [title] = childrenNamed('title');
      if (!authors.length || !title) continue;
      let doi = null;
      let arxivId = null;
      for (const link of childrenNamed('ee')) {
        doi ??= link.match(/^https?:\/\/(?:dx\.)?doi\.org\/(.+)$/)?.[1] ?? null;
        arxivId = link.match(/^https?:\/\/arxiv\.org\/abs\/(.+)$/)?.[1] ?? arxivId;
      }
      if (arxivId && !doi) doi = `10.48550/arxiv.${arxivId}`;
      const venue = childrenNamed('journal')[0] ?? childrenNamed('booktitle')[0] ?? null;
      publications.push({
        sourceId: node[':@'].key,
        kind: tagName,
        title: title.replace(/\.$/, ''),
        authors,
        year: childrenNamed('year')[0] ?? null,
        venue,
        volume: childrenNamed('volume')[0] ?? null,
        number: childrenNamed('number')[0] ?? null,
        pages: childrenNamed('pages')[0] ?? null,
        school: childrenNamed('school')[0] ?? null,
        doi,
        arxivId,
        preprint: venue === 'CoRR' || node[':@'].publtype === 'informal',
      });
    }
  };
  collectRecords(parser.parse(xmlText));
  return publications;
}

/** A CoRR/arXiv record is redundant once DBLP lists a published version. */
function dropPreprintDuplicates(publications) {
  const publishedTitles = publications
    .filter((publication) => !publication.preprint)
    .map((publication) => normalize(publication.title));
  return publications.filter(
    (publication) =>
      !publication.preprint ||
      !publishedTitles.some(
        (published) => similarity(normalize(publication.title), published) >= TITLE_MATCH_RATIO,
      ),
  );
}

async function fetchDblpPublications(pid, localXmlFile) {
  let body;
  if (localXmlFile) {
    body = readFileSync(localXmlFile, 'utf8');
  } else {
    try {
      const response = await fetch(`https://dblp.org/pid/${pid}.xml`, {
        headers: { 'user-agent': USER_AGENT },
        signal: AbortSignal.timeout(30_000),
      });
      body = await response.text();
    } catch (error) {
      throw new SourceUnavailable(`DBLP request failed: ${error.message}`);
    }
  }
  // When busy, DBLP puts a proof-of-work challenge page (HTML, status 200) in front.
  if (!body.trimStart().startsWith('<?xml') && !body.includes('<dblpperson')) {
    throw new SourceUnavailable(
      `DBLP answered with a bot check instead of XML. Open https://dblp.org/pid/${pid}.xml ` +
        'in a browser, save it, and pass it with --dblp-xml FILE.',
    );
  }
  return dropPreprintDuplicates(parseDblpRecords(body));
}

// DBLP lets browsers through its bot check, so in a terminal offer to open the person
// XML there and read the copy the user saves. Returns the file path, or null to skip.
async function askForSavedDblpXml(pid) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return null;
  const xmlUrl = `https://dblp.org/pid/${pid}.xml`;
  const defaultPath = join(homedir(), 'Downloads', `${pid.split('/').pop()}.xml`);
  const dialog = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const openAnswer = await dialog.question(
      `\nDBLP blocks scripts but not browsers. Open ${xmlUrl} in your browser to save it? [Y/n] `,
    );
    if (openAnswer.trim().toLowerCase().startsWith('n')) return null;
    const opener = { darwin: 'open', win32: 'explorer' }[process.platform] ?? 'xdg-open';
    spawn(opener, [xmlUrl], { detached: true, stdio: 'ignore' })
      .on('error', () => console.log(`Could not start a browser; open ${xmlUrl} yourself.`))
      .unref();
    const pathAnswer = await dialog.question(
      `Save the page (Cmd/Ctrl+S), then enter its path [${defaultPath}], or "-" for OpenAlex: `,
    );
    // Dragging a file into the terminal quotes it or escapes its spaces.
    const enteredPath = pathAnswer
      .trim()
      .replace(/^(['"])(.*)\1$/, '$2')
      .replace(/\\ /g, ' ')
      .replace(/^~(?=\/|$)/, homedir());
    if (enteredPath === '-') return null;
    const xmlPath = enteredPath || defaultPath;
    if (!existsSync(xmlPath)) {
      console.log(`${xmlPath} does not exist.`);
      return null;
    }
    return xmlPath;
  } catch {
    return null; // stdin closed
  } finally {
    dialog.close();
  }
}

async function fetchOpenAlexPublications(orcid, delaySeconds) {
  if (!orcid) throw new SourceUnavailable(`no 'orcid_id' in ${SOCIALS_FILE}`);
  const works = [];
  let cursor = '*';
  while (cursor) {
    const url =
      'https://api.openalex.org/works?filter=author.orcid:' +
      `${orcid}&per-page=200&mailto=${MAILTO}&cursor=${encodeURIComponent(cursor)}`;
    let page;
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': USER_AGENT },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      page = await response.json();
    } catch (error) {
      throw new SourceUnavailable(`OpenAlex request failed: ${error.message}`);
    }
    works.push(...page.results);
    cursor = page.results.length ? page.meta.next_cursor : null;
    await sleep(delaySeconds * 1000);
  }

  const candidates = [];
  for (const work of works) {
    const kind = OPENALEX_KINDS[work.type];
    const title = decodeEntities((work.title ?? '').replace(/\s+/g, ' ').trim()).replaceAll(
      '’',
      "'",
    );
    if (!kind || !title || OPENALEX_ARTIFACT_TITLE.test(title)) continue;
    const doi = work.doi ? work.doi.replace(/^https?:\/\/doi\.org\//, '').toLowerCase() : null;
    const rawVenue = work.primary_location?.raw_source_name;
    const { first_page: firstPage, last_page: lastPage } = work.biblio ?? {};
    candidates.push({
      sourceId: work.id.replace('https://openalex.org/', 'openalex:'),
      kind,
      title,
      authors: work.authorships.map((authorship) => authorship.author.display_name),
      year: work.publication_year ? String(work.publication_year) : null,
      venue: rawVenue && !rawVenue.startsWith('ISSN:') ? decodeEntities(rawVenue) : null,
      volume: work.biblio?.volume ?? null,
      number: work.biblio?.issue ?? null,
      pages: firstPage
        ? lastPage && lastPage !== firstPage
          ? `${firstPage}-${lastPage}`
          : firstPage
        : null,
      school: null,
      doi,
      arxivId: arxivIdFromDoi(doi),
      preprint: work.type === 'preprint',
    });
  }

  // One record per paper: OpenAlex lists repository copies and preprints separately.
  // Prefer a published version, then a publisher DOI over an institutional repository.
  const rank = (publication) =>
    (publication.preprint ? 2 : 0) +
    (REPOSITORY_DOI_PREFIXES.some((prefix) => publication.doi?.startsWith(prefix)) ? 1 : 0);
  const bestByTitle = new Map();
  for (const candidate of candidates) {
    const titleKey = normalize(candidate.title);
    const incumbent = bestByTitle.get(titleKey);
    if (!incumbent || rank(candidate) < rank(incumbent)) bestByTitle.set(titleKey, candidate);
  }
  const seenDois = new Set();
  return [...bestByTitle.values()].filter((publication) => {
    if (!publication.doi) return true;
    if (seenDois.has(publication.doi)) return false;
    seenDois.add(publication.doi);
    return true;
  });
}

// --------------------------------------------------------------------------- //
async function main() {
  const { values: options } = parseArgs({
    options: {
      file: { type: 'string', short: 'f', default: BIB_FILE },
      interactive: { type: 'boolean', short: 'i', default: false },
      yes: { type: 'boolean', default: false },
      delay: { type: 'string', default: '0.5' },
      source: { type: 'string' },
      'dblp-xml': { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (options.help) {
    printHeaderHelp(import.meta.url);
    return 0;
  }
  if (options.source && !['dblp', 'openalex'].includes(options.source)) {
    console.error('--source must be dblp or openalex');
    return 2;
  }
  const delaySeconds = Number(options.delay);

  const text = readFileSync(options.file, 'utf8');
  const socials = loadYaml(SOCIALS_FILE) ?? {};
  const pid = socials.dblp_url?.match(/\/pid\/([\w/-]+?)(?:\.html|\.xml)?\/?$/)?.[1];
  if (!pid && !socials.orcid_id) {
    console.log(
      `No publication source configured. Set 'dblp_url' (preferred) or 'orcid_id' in ${SOCIALS_FILE}.\n` +
        `${options.file} left unchanged.`,
    );
    return 0;
  }

  // The one place that picks a source; both return the same publication shape.
  let publications;
  let sourceName;
  try {
    if (options.source === 'openalex' || (!pid && options.source !== 'dblp')) {
      sourceName = 'openalex';
      publications = await fetchOpenAlexPublications(socials.orcid_id, delaySeconds);
    } else {
      if (!pid) throw new SourceUnavailable(`no usable 'dblp_url' in ${SOCIALS_FILE}`);
      sourceName = 'dblp';
      try {
        publications = await fetchDblpPublications(pid, options['dblp-xml']);
      } catch (error) {
        if (
          !(error instanceof SourceUnavailable) ||
          options.source === 'dblp' ||
          options['dblp-xml']
        ) {
          throw error;
        }
        console.log(error.message);
        const savedXmlPath = await askForSavedDblpXml(pid);
        try {
          if (!savedXmlPath) throw new SourceUnavailable('no saved DBLP XML');
          publications = await fetchDblpPublications(pid, savedXmlPath);
        } catch (savedXmlError) {
          if (savedXmlPath) console.log(savedXmlError.message);
          console.log('Falling back to OpenAlex.');
          sourceName = 'openalex';
          publications = await fetchOpenAlexPublications(socials.orcid_id, delaySeconds);
        }
      }
    }
  } catch (error) {
    if (!(error instanceof SourceUnavailable)) throw error;
    console.log(`Could not fetch publications: ${error.message}\n${options.file} left unchanged.`);
    return 0;
  }

  return proposeMissingPapers({
    publications,
    sourceName,
    bibFile: options.file,
    bibText: text,
    interactive: options.interactive,
    yes: options.yes,
    delaySeconds,
  });
}

process.exitCode = await main();
