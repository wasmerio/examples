import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = resolve(__dirname, "../../.cache/logos");

const BASE_URL =
	"https://raw.githubusercontent.com/fastfetch-cli/fastfetch/refs/heads/dev/src/logo/ascii/";

export async function fetchLogo(distro: string): Promise<string> {
	const cachePath = resolve(CACHE_DIR, `${distro}.txt`);
	if (existsSync(cachePath)) {
		return readFileSync(cachePath, "utf-8");
	}
	const logo = await fetch(`${BASE_URL}/${distro.at(0)}/${distro}.txt`);
	const text = await logo.text();
	mkdirSync(CACHE_DIR, { recursive: true });
	writeFileSync(cachePath, text);
	return text;
}
