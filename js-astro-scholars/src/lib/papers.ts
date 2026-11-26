import publicationsRaw from '../data/publications.bib?raw';
import { parseBibtex, type BibEntry } from './bibtex';

const papersCache: BibEntry[] = parseBibtex(publicationsRaw);

export function getAllPapers(): BibEntry[] {
	return papersCache;
}

export function getFeaturedPapers(
	limit = 3,
	papers: BibEntry[] = papersCache,
): BibEntry[] {
	return papers.filter((paper) => paper.category === 'Publication').slice(0, limit);
}
