// The "Ask AI" dialog's prompt and provider links. Shared by the server render
// (the initial links work before the script runs) and the dialog script.
import { siClaude, siGooglegemini } from "simple-icons";
import { openAiPath } from "$lib/ai/links";

// Prefilled chat links. Past this length some providers truncate or reject the URL.
export const MAX_LINK_PROMPT = 6000;

export type AskAiQuestion = { id: string; label: string; ask: string };

// Claude and ChatGPT accept a prefilled prompt in the URL. Gemini does not,
// so its button copies the prompt first and the visitor pastes it.
export const providers = [
  {
    name: "Claude",
    path: siClaude.path,
    color: `#${siClaude.hex}`,
    prefills: true,
  },
  {
    name: "ChatGPT",
    path: openAiPath,
    color: "currentColor",
    prefills: true,
  },
  {
    name: "Gemini",
    path: siGooglegemini.path,
    color: `#${siGooglegemini.hex}`,
    prefills: false,
  },
];

export function providerHref(name: string, prompt: string) {
  const q = encodeURIComponent(prompt);
  if (name === "Claude") return `https://claude.ai/new?q=${q}`;
  if (name === "ChatGPT") return `https://chatgpt.com/?q=${q}`;
  return "https://gemini.google.com/app";
}

export function askAiPrompt(
  { siteUrl, name }: { siteUrl: string; name: string },
  question: AskAiQuestion,
  posting = "",
) {
  return (
    `Read ${siteUrl}/llms-full.txt (${name}'s portfolio) and ${question.ask}` +
    (question.id === "fit" && posting.trim() ? `\n\nJob posting:\n${posting.trim()}` : "")
  );
}
