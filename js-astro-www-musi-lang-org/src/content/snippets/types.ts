export interface SnippetEvidence {
	path: string;
	line: number;
}

export interface ContentSnippet {
	id: string;
	language: string;
	sourceText: string;
	evidence: SnippetEvidence;
}
