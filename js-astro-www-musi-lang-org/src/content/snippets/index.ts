import { coreSnippets } from "./core";
import type { ContentSnippet } from "./types";

export type { ContentSnippet, SnippetEvidence } from "./types";

export const contentSnippets = [
	...coreSnippets,
] satisfies readonly ContentSnippet[];

export function snippetById(id: string) {
	return contentSnippets.find((snippet) => snippet.id === id);
}
