import type { ContentSnippet, SnippetEvidence } from "./snippets";
import {
	snippetById as findRegisteredSnippetById,
	contentSnippets as registeredContentSnippets,
} from "./snippets";

export type { ContentSnippet, SnippetEvidence };

export const contentSnippets = registeredContentSnippets;
export const snippetById = findRegisteredSnippetById;
