interface BibAuthor {
	given: string;
	family: string;
	suffix?: string;
	literal?: string;
}

export interface BibEntry {
	id: string;
	type: string;
	title: string;
	authors: string[];
	authorParts?: BibAuthor[];
	rawBibtex?: string;
	year?: number;
	venue?: string;
	url?: string;
	doi?: string;
	volume?: string;
	number?: string;
	pages?: string;
	abstract?: string;
	category: string;
	keywords: string[];
}

export const citationStyleLabels = {
	bibtex: 'BibTeX',
	apa: 'APA 7',
	chicago: 'Chicago',
	harvard: 'Harvard'
} as const;

export type CitationStyle = keyof typeof citationStyleLabels;

function displayText(value: string): string {
	return value.replace(/(?<!\\)[{}]/g, '').replace(/\\([{}%&_#$])/g, '$1').replace(/\s+/g, ' ').trim();
}

function splitOutsideBraces(value: string, separator: RegExp): string[] {
	const delimiter = new RegExp(separator.source, 'iy');
	const parts: string[] = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < value.length; i++) {
		if (value[i] === '\\') { i++; continue; }
		if (value[i] === '{') depth++;
		if (value[i] === '}') depth--;
		delimiter.lastIndex = i;
		const match = depth === 0 ? delimiter.exec(value) : null;
		if (match) {
			parts.push(value.slice(start, i).trim());
			i += match[0].length - 1;
			start = i + 1;
		}
	}
	parts.push(value.slice(start).trim());
	return parts.filter(Boolean);
}

function nameParts(name: string): BibAuthor {
	const trimmed = name.trim();
	if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
		return { literal: displayText(trimmed), given: '', family: '' };
	}
	const commaParts = splitOutsideBraces(trimmed, /,/).map(displayText);
	if (commaParts.length > 1) {
		return {
			family: commaParts[0],
			given: commaParts.at(-1) ?? '',
			...(commaParts.length > 2 ? { suffix: commaParts[1] } : {}),
		};
	}
	const words = splitOutsideBraces(trimmed, /\s+/);
	const particle = words.findIndex((word, index) => index > 0 && /^\p{Ll}/u.test(word));
	const familyStart = particle === -1 ? words.length - 1 : particle;
	return {
		given: displayText(words.slice(0, familyStart).join(' ')),
		family: displayText(words.slice(familyStart).join(' ')),
	};
}

function displayAuthor(author: BibAuthor): string {
	return author.literal ?? [author.given, author.family].filter(Boolean).join(' ') +
		(author.suffix ? `, ${author.suffix}` : '');
}

function initials(name: string): string {
	return name.split(/\s+/).filter(Boolean).map((part) =>
		part.split('-').map((piece) => `${piece.charAt(0).toUpperCase()}.`).join('-')
	).join(' ');
}

function joinAuthors(authors: string[], conjunction: string, serialComma: boolean): string {
	if (authors.length < 2) return authors[0] ?? '';
	if (authors.length === 2) return `${authors[0]}${serialComma ? ',' : ''} ${conjunction} ${authors[1]}`;
	return `${authors.slice(0, -1).join(', ')}${serialComma ? ',' : ''} ${conjunction} ${authors.at(-1)}`;
}

function sentence(value?: string): string {
	const trimmed = value?.trim();
	return !trimmed ? '' : /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function toBibtex(paper: BibEntry): string {
	if (paper.rawBibtex) return paper.rawBibtex;
	const type = paper.type?.toLowerCase() || 'article';
	const fields = {
		title: paper.title,
		author: paper.authors.join(' and '),
		[type === 'inproceedings' ? 'booktitle' : 'journal']: paper.venue,
		year: paper.year,
		volume: paper.volume,
		number: paper.number,
		pages: paper.pages,
		doi: paper.doi,
		url: paper.url,
	};
	return [`@${type}{${paper.id},`, ...Object.entries(fields)
		.filter(([, value]) => value !== undefined && value !== '')
		.map(([key, value]) => `  ${key} = {${value}},`), '}'].join('\n');
}

export function formatCitations(paper: BibEntry): Record<CitationStyle, string> {
	// ponytail: plain-text styles cover common article fields; use CSL for type-specific publication rules.
	const authors = paper.authorParts ?? paper.authors.map(nameParts);
	const abbreviated = authors.map((author) => author.literal ??
		[author.family, initials(author.given), author.suffix].filter(Boolean).join(', '));
	const apaAuthors = joinAuthors(abbreviated, '&', true);
	const chicagoAuthors = joinAuthors(authors.map((author, index) =>
		author.literal ?? (index === 0
			? [author.family, author.given, author.suffix].filter(Boolean).join(', ')
			: displayAuthor(author))), 'and', true);
	const harvardAuthors = joinAuthors(abbreviated, 'and', false);
	const year = paper.year ? String(paper.year) : 'n.d.';
	const url = paper.doi ? `https://doi.org/${paper.doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')}` : paper.url?.trim();
	const pages = paper.pages?.replace(/--/g, '–');
	const volume = `${paper.volume ?? ''}${paper.number ? `(${paper.number})` : ''}`;
	const venue = [paper.venue, volume, pages].filter(Boolean).join(', ');

	return {
		bibtex: toBibtex(paper),
		apa: [sentence(apaAuthors), `(${year}).`, sentence(paper.title), sentence(venue), url].filter(Boolean).join(' '),
		chicago: [sentence(chicagoAuthors), `“${paper.title.replace(/[.!?]+$/, '')}.”`,
			sentence([venue, paper.year ? `(${paper.year})` : ''].filter(Boolean).join(' ')), url].filter(Boolean).join(' '),
		harvard: [`${harvardAuthors ? `${harvardAuthors} ` : ''}(${year})`,
			`‘${paper.title.replace(/[.!?]+$/, '')}’,`, sentence(venue), url ? `Available at: ${url}.` : ''].filter(Boolean).join(' '),
	};
}

function skipTrivia(source: string, start: number): number {
	let i = start;
	while (i < source.length) {
		if (/\s/.test(source[i])) i++;
		else if (source[i] === '%') {
			const end = source.indexOf('\n', i);
			i = end === -1 ? source.length : end + 1;
		} else break;
	}
	return i;
}

// Read one balanced entry or field, without treating braces inside quoted fields as entry boundaries.
function readBlock(source: string, start: number, entry = false) {
	const opener = source[start];
	const closer = opener === '(' ? ')' : opener === '"' ? '"' : '}';
	let depth = 0;
	let quoted = false;
	for (let i = start + 1; i < source.length; i++) {
		const char = source[i];
		if (char === '\\') { i++; continue; }
		if (entry && depth === 0 && !quoted && char === '%') {
			i = skipTrivia(source, i) - 1;
			continue;
		}
		if (entry && depth === 0 && char === '"') { quoted = !quoted; continue; }
		if (!quoted && depth === 0 && char === closer) return { value: source.slice(start + 1, i), end: i + 1 };
		if (char === '{') depth++;
		if (char === '}') depth--;
		if (depth < 0) break;
	}
	throw new Error(`Unterminated BibTeX block: ${source.slice(start, start + 60)}`);
}

function parseFields(body: string, macros: Map<string, string>): Record<string, string> {
	const fields: Record<string, string> = {};
	let index = skipTrivia(body, 0);
	while (index < body.length) {
		const keyMatch = body.slice(index).match(/^([A-Za-z][\w-]*)\s*=\s*/);
		if (!keyMatch) throw new Error(`Invalid BibTeX field near: ${body.slice(index, index + 60)}`);
		const key = keyMatch[1].toLowerCase();
		index += keyMatch[0].length;
		let value = '';
		do {
			index = skipTrivia(body, index);
			if (body[index] === '{' || body[index] === '"') {
				const block = readBlock(body, index);
				value += block.value;
				index = block.end;
			} else {
				const token = body.slice(index).match(/^[\w:+.-]+/)?.[0];
				if (!token) throw new Error(`Missing BibTeX value for ${key}`);
				const expanded = /^\d+$/.test(token) ? token : macros.get(token.toLowerCase());
				if (expanded === undefined) throw new Error(`Undefined BibTeX string: ${token}`);
				value += expanded;
				index += token.length;
			}
			index = skipTrivia(body, index);
			if (body[index] !== '#') break;
			index++;
		} while (index <= body.length);
		fields[key] = value;
		if (index < body.length && body[index] !== ',') throw new Error(`Expected comma after BibTeX field ${key}`);
		index = skipTrivia(body, index + 1);
	}
	return fields;
}

export function parseBibtex(raw: string): BibEntry[] {
	const entries: BibEntry[] = [];
	const ids = new Set<string>();
	const definitions: string[] = [];
	const macros = new Map(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		.map((month) => [month.slice(0, 3).toLowerCase(), month]));
	let index = 0;
	while (index < raw.length) {
		index = skipTrivia(raw, index);
		if (index >= raw.length) break;
		if (raw[index] !== '@') { index++; continue; }
		const header = raw.slice(index).match(/^@(\w+)\s*([{(])/);
		if (!header) throw new Error(`Invalid BibTeX entry near: ${raw.slice(index, index + 60)}`);
		const type = header[1].toLowerCase();
		const block = readBlock(raw, index + header[0].length - 1, true);
		const source = raw.slice(index, block.end);
		index = block.end;
		if (type === 'comment' || type === 'preamble') continue;
		if (type === 'string') {
			for (const [key, value] of Object.entries(parseFields(block.value, macros))) macros.set(key, value);
			definitions.push(source);
			continue;
		}
		const comma = block.value.indexOf(',');
		const id = block.value.slice(0, comma).trim();
		if (comma < 1 || !id) throw new Error('BibTeX entry needs a citation key and fields');
		if (ids.has(id)) throw new Error(`Duplicate BibTeX key: ${id}`);
		ids.add(id);
		const fields = parseFields(block.value.slice(comma + 1), macros);
		if (!fields.title?.trim()) throw new Error(`BibTeX entry ${id} needs a title`);
		const authorParts = fields.author ? splitOutsideBraces(fields.author, /\s+and\s+/).map(nameParts) : [];
		const text = (key: string) => fields[key] ? displayText(fields[key]) : undefined;
		const publicField = text('public')?.toLowerCase();
		const year = fields.year ? Number(displayText(fields.year)) : undefined;
		if (year !== undefined && !Number.isInteger(year)) throw new Error(`Invalid BibTeX year in ${id}`);
		entries.push({
			id, type,
			title: displayText(fields.title),
			authors: authorParts.map(displayAuthor),
			authorParts,
			rawBibtex: [...definitions, source].join('\n'),
			year,
			venue: text('journal') ?? text('booktitle'),
			url: text('url'),
			doi: text('doi'),
			volume: text('volume'),
			number: text('number'),
			pages: text('pages'),
			abstract: text('abstract'),
			category: publicField === 'yes' || publicField === 'pub' ? 'Publication' : publicField === 'wp' ? 'Working Paper' : publicField === 'wip' ? 'Work in Progress' : 'Other',
			keywords: text('keywords')?.split(',').map((keyword) => keyword.trim()).filter(Boolean) ?? [],
		});
	}
	return entries.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}
