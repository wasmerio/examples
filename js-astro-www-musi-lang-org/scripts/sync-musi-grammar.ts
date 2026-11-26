import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const upstreamGrammarUrl =
	"https://raw.githubusercontent.com/musi-lang/vscode-musi/main/syntaxes/musi.tmLanguage.json";
const repoRoot = join(import.meta.dir, "..");
const grammarPath = join(
	repoRoot,
	"src",
	"content",
	"grammars",
	"musi.tmLanguage.json",
);

const checkMode = Bun.argv.includes("--check");

async function fetchUpstreamGrammar(): Promise<Uint8Array> {
	const response = await fetch(upstreamGrammarUrl, {
		headers: { accept: "application/json" },
	});

	if (!response.ok) {
		throw new Error(
			`failed to fetch upstream Musi grammar: ${response.status} ${response.statusText}`,
		);
	}

	const bytes = new Uint8Array(await response.arrayBuffer());
	const text = new TextDecoder().decode(bytes);
	const parsed = JSON.parse(text) as { name?: unknown; scopeName?: unknown };

	if (parsed.name !== "Musi" || parsed.scopeName !== "source.musi") {
		throw new Error("upstream Musi grammar did not look like source.musi");
	}

	return bytes;
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
	if (left.byteLength !== right.byteLength) {
		return false;
	}

	return left.every((value, index) => value === right[index]);
}

const upstreamBytes = await fetchUpstreamGrammar();

if (checkMode) {
	const localBytes = await readFile(grammarPath);
	if (!bytesEqual(localBytes, upstreamBytes)) {
		console.error(
			`Musi grammar is not synced\nsource: ${upstreamGrammarUrl}\ntarget: ${grammarPath}\nrun: bun run sync:musi-grammar`,
		);
		process.exit(1);
	}

	console.log(`Musi grammar is synced: ${grammarPath}`);
	process.exit(0);
}

await mkdir(dirname(grammarPath), { recursive: true });
await writeFile(grammarPath, upstreamBytes);
console.log(`synced Musi grammar from ${upstreamGrammarUrl}`);
