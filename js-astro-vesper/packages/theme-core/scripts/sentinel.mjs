/**
 * The sentinel scanner, for the access tests: finds secret strings (sentinels placed only in locked bodies) in a
 * build folder and in recorded responses.
 *
 *   const hits = await findSentinel({ dir: "dist", responses }, ["LOCKED-BODY-7f3a"]);
 *   // [{ where: "letters/members/index.html", sentinel: "LOCKED-BODY-7f3a" }, ...]
 *
 * - `dir`: every file under it, binary files included. Each is searched as UTF-8 and as Latin-1 text. A gzipped
 *   file (it starts with 1f 8b) is also gunzipped and searched: Pagefind 1.5 writes its `.pf_fragment`,
 *   `.pf_index` and `.pf_meta` files gzipped, and their content starts with the `pagefind_dcd` header (fragments
 *   hold the page text as JSON; the index holds words). An uncompressed file that starts with that header is read
 *   as it is, as Pagefind's client does.
 * - `responses`: `{ url, status, headers, body }` records (headers as an object or a Headers; body as text or
 *   bytes): each header value and the body.
 * - Each sentinel is matched ignoring case, as it is and URL-encoded (`encodeURIComponent`), with each "-" also
 *   as a decimal or hex HTML entity or as `%2D`.
 * - Blind spot: text drawn into an image (a share card PNG) is pixels, not bytes. Check card input text instead.
 *
 * Plain Node; no imports from the package's TypeScript.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { gunzipSync } from "node:zlib";

/** The hyphen as HTML entities (decimal and hex, with and without leading zeros) and percent-encoded. */
const HYPHENS = ["-", "&#45;", "&#045;", "&#0045;", "&#x2d;", "&#x02d;", "&#x002d;", "%2d"];

/** The forms of one sentinel to look for, lower case (matching ignores case). */
function forms(sentinel) {
	const out = new Set();
	for (const base of [sentinel, encodeURIComponent(sentinel)]) {
		for (const hyphen of HYPHENS) out.add(base.replaceAll("-", hyphen).toLowerCase());
	}
	return [...out];
}

function walk(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) out.push(...walk(path));
		else out.push(path);
	}
	return out;
}

/** The texts of one file's bytes: UTF-8 and Latin-1. */
const texts = (bytes) => [bytes.toString("utf8"), bytes.toString("latin1")];

/** Every readable text of a file, each with a label for `where`. */
function fileTexts(bytes) {
	const out = [{ label: "", texts: texts(bytes) }];
	if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
		try {
			out.push({ label: " (gunzipped)", texts: texts(gunzipSync(bytes)) });
		} catch {
			// Not a whole gzip stream: the raw texts are still searched.
		}
	}
	return out;
}

function matches(textList, sentinel) {
	const wanted = forms(sentinel);
	return textList.some((t) => {
		const lower = t.toLowerCase();
		return wanted.some((f) => lower.includes(f));
	});
}

function headerEntries(headers) {
	if (!headers) return [];
	if (typeof headers.entries === "function" && !(headers instanceof Array)) return [...headers.entries()];
	return Object.entries(headers);
}

function bodyText(body) {
	if (body === undefined || body === null) return [];
	if (typeof body === "string") return [body];
	const bytes = Buffer.from(body instanceof ArrayBuffer ? new Uint8Array(body) : body);
	return [...fileTexts(bytes).flatMap((f) => f.texts)];
}

/**
 * @param {{ dir?: string; responses?: { url: string; status?: number; headers?: Record<string, string> | Headers; body?: string | Uint8Array | ArrayBuffer }[] }} input
 * @param {string[]} sentinels
 * @returns {Promise<{ where: string; sentinel: string }[]>}
 */
export async function findSentinel({ dir, responses = [] } = {}, sentinels) {
	const hits = [];
	if (dir) {
		for (const path of walk(dir)) {
			const rel = relative(dir, path).split(sep).join("/");
			const all = fileTexts(readFileSync(path));
			for (const sentinel of sentinels) {
				const found = all.find((f) => matches(f.texts, sentinel));
				if (found) hits.push({ where: `${rel}${found.label}`, sentinel });
			}
		}
	}
	for (const res of responses) {
		for (const sentinel of sentinels) {
			for (const [name, value] of headerEntries(res.headers)) {
				if (matches([String(value)], sentinel)) hits.push({ where: `${res.url} header ${name}`, sentinel });
			}
			if (matches(bodyText(res.body), sentinel)) hits.push({ where: `${res.url} body`, sentinel });
		}
	}
	return hits;
}
