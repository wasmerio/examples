import type { SnippetEvidence } from "../snippet-registry";

export interface ExampleGroup {
	id: string;
	title: string;
	caption: string;
	note: string;
	sourceText: string;
	evidence: SnippetEvidence;
}
