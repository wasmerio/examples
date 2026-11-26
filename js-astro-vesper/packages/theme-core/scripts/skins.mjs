/**
 * The skins runner (a theme's `pnpm test:skins`).
 *
 * Checks the color skins in `dir`:
 *   - every id in skins.json has <id>.css, and every .css file is listed
 *   - the global stylesheet imports every skin file from `dir` (the path from
 *     the stylesheet's folder to `dir`, e.g. ./skins/<id>.css)
 *   - each file holds its light and dark accent (the values in skins.json)
 *   - the default skin (`skinFile`) is listed
 *   - contrast is at least `min`: white on the accent and the accent on the
 *     light ground; dark text on the dark accent and the dark accent on the
 *     dark ground
 *   - with `scrim`, the scrim in its file (light and both dark rules): text on
 *     an image (--ui-scrim-fg) reads at `min` over a black and a white image,
 *     under the kit's scrim layers (SCRIM_LAYERS, CardOverlay and HeroCover);
 *     and HeroCover's action Buttons (buttonOnImage in the kit's lib/button.ts):
 *     the label at `min` and the edge at 3:1, at rest and on hover
 *
 * `config`: `dir` (the skins folder), `globalCss`, `skinFile`, `lightBg` and
 * `darkBg` (the theme's two grounds, as --ui-bg), `min` (e.g. 4.5), and
 * `scrim` (`{ file }`, the stylesheet with the scrim pairs; leave it out to
 * skip the scrim and Button checks). Paths are absolute, or relative to
 * `root` (default: the working directory).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { contrast, contrastOnImage, over, SCRIM_LAYERS, scrimBackdrops } from "@astronomic/ui/system/contrast";

const WHITE = [255, 255, 255];
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const ratio = (a, b) => contrast(rgb(a), rgb(b));

export function runSkins(config) {
	const at = (path) => resolve(config.root ?? process.cwd(), path);
	const dir = at(config.dir);
	const LIGHT_BG = config.lightBg;
	const DARK_BG = config.darkBg;
	const MIN = config.min;

	const problems = [];
	const skins = JSON.parse(readFileSync(join(dir, "skins.json"), "utf8"));
	const ids = skins.map((s) => s.id);
	const files = readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => f.slice(0, -4));
	const globalCss = readFileSync(at(config.globalCss), "utf8");
	// The import path of a skin file as the global stylesheet writes it: the skins folder relative to that stylesheet.
	const fromGlobal = relative(dirname(at(config.globalCss)), dir).split(sep).join("/");
	const skinImport = (id) => (/^\.\.(\/|$)/.test(fromGlobal) ? "" : "./") + (fromGlobal ? `${fromGlobal}/` : "") + `${id}.css`;
	const skinFile = at(config.skinFile);
	const defaultSkin = existsSync(skinFile) ? readFileSync(skinFile, "utf8").match(/export\s+const\s+skin\b[^=]*=\s*["']([^"']+)["']/)?.[1] : undefined;

	for (const file of files) if (!ids.includes(file)) problems.push(`${file}.css is not listed in skins.json`);
	if (!ids.includes(defaultSkin)) problems.push(`default skin "${defaultSkin}" (${config.skinFile}) is not in skins.json`);

	for (const { id, label, swatch, dark } of skins) {
		if (!/^[a-z][a-z0-9-]*$/.test(id)) problems.push(`bad id: ${id}`);
		if (!label) problems.push(`${id}: no label`);
		const file = join(dir, `${id}.css`);
		if (!existsSync(file)) {
			problems.push(`${id}: no ${id}.css`);
			continue;
		}
		const css = readFileSync(file, "utf8").toLowerCase();
		// The light rule sets --ui-accent to the swatch; both dark rules set it to the dark accent.
		const declared = (hex) => css.match(new RegExp(`--ui-accent:\\s*${hex.toLowerCase()}\\s*;`, "g"))?.length ?? 0;
		if (declared(swatch) < 1) problems.push(`${id}.css does not set --ui-accent to the light accent ${swatch}`);
		if (declared(dark) < 2) problems.push(`${id}.css does not set --ui-accent to the dark accent ${dark} in both dark rules`);
		if (!globalCss.includes(skinImport(id))) problems.push(`${basename(config.globalCss)} does not import ${skinImport(id)}`);
		const checks = [
			["white on accent", contrast(WHITE, rgb(swatch))],
			["accent on ground", ratio(swatch, LIGHT_BG)],
			["dark: text on accent", ratio(DARK_BG, dark)],
			["dark: accent on ground", ratio(dark, DARK_BG)],
		];
		for (const [name, value] of checks) {
			if (value < MIN) problems.push(`${id}: ${name} is ${value.toFixed(2)}, needs ${MIN}`);
			else console.log(`${id}: ${name} ${value.toFixed(2)}`);
		}
	}

	if (config.scrim) {
		// The shares of scrim-fg in the kit's on-image Buttons (buttonOnImage), read from its source so this tracks it.
		const buttonTs = readFileSync(fileURLToPath(new URL("../lib/button.ts", import.meta.resolve("@astronomic/ui/system/contrast"))), "utf8");
		const onImageBlock = /export const buttonOnImage[^{]*\{([\s\S]*?)\n\};/.exec(buttonTs)?.[1] ?? "";
		const shareIn = (variant, prefix) => {
			const line = new RegExp(`\\b${variant}:\\s*"([^"]*)"`).exec(onImageBlock)?.[1] ?? "";
			const n = new RegExp(`(?:^|\\s)${prefix}scrim-fg/(\\d+)(?:\\s|$)`).exec(line)?.[1];
			if (n === undefined) problems.push(`lib/button.ts: no ${prefix}scrim-fg/<n> in buttonOnImage.${variant}`);
			return Number(n) / 100;
		};
		const HOVER = "hover:not-disabled:not-aria-disabled:";
		const onImage = {
			primaryHover: shareIn("primary", `${HOVER}bg-`),
			secondaryEdge: shareIn("secondary", "border-"),
			secondaryHover: shareIn("secondary", `${HOVER}bg-`),
			ghostHover: shareIn("ghost", `${HOVER}bg-`),
		};

		// The scrim is the theme's, not a skin's: one pair in the light :root and one in each dark rule.
		const scrimCss = readFileSync(at(config.scrim.file), "utf8");
		const scrims = [...scrimCss.matchAll(/--ui-scrim:\s*(#[0-9a-f]{6});\s*--ui-scrim-fg:\s*(#[0-9a-f]{6});/gi)];
		if (scrims.length !== 3) problems.push(`${basename(config.scrim.file)}: ${scrims.length} --ui-scrim / --ui-scrim-fg pairs, expected 3 (light and both dark rules)`);
		for (const [i, [, scrim, fg]] of scrims.entries()) {
			const rule = ["light", "dark (media)", "dark (data-theme)"][i] ?? `rule ${i + 1}`;
			const value = contrastOnImage(rgb(fg), rgb(scrim), SCRIM_LAYERS);
			if (value < MIN) problems.push(`scrim ${rule}: text on an image (CardOverlay, HeroCover) is ${value.toFixed(2)}, needs ${MIN}`);
			else console.log(`scrim ${rule}: text on an image (CardOverlay, HeroCover) ${value.toFixed(2)}`);
			// HeroCover's action Buttons, over a black and a white image under SCRIM_LAYERS. A ghost has no edge.
			const [s, f] = [rgb(scrim), rgb(fg)];
			for (const [k, backdrop] of scrimBackdrops(s, SCRIM_LAYERS).entries()) {
				const hoverFill = over(f, onImage.primaryHover, backdrop);
				const edge = over(f, onImage.secondaryEdge, backdrop);
				const buttons = [
					["primary label", contrast(s, f), MIN],
					["primary label (hover)", contrast(s, hoverFill), MIN],
					["primary edge", contrast(f, backdrop), 3],
					["primary edge (hover)", contrast(hoverFill, backdrop), 3],
					["secondary and ghost label", contrast(f, backdrop), MIN],
					["secondary label (hover)", contrast(f, over(f, onImage.secondaryHover, backdrop)), MIN],
					["ghost label (hover)", contrast(f, over(f, onImage.ghostHover, backdrop)), MIN],
					["secondary edge", contrast(edge, backdrop), 3],
					["secondary edge (hover)", contrast(over(f, onImage.secondaryEdge, over(f, onImage.secondaryHover, backdrop)), backdrop), 3],
				];
				const image = ["black", "white"][k];
				for (const [name, value, min] of buttons) {
					if (value < min) problems.push(`scrim ${rule}: Button on a ${image} image, ${name} is ${value.toFixed(2)}, needs ${min}`);
					else console.log(`scrim ${rule}: Button on a ${image} image, ${name} ${value.toFixed(2)}`);
				}
			}
		}
	}

	if (problems.length) {
		console.log(`\n${problems.length} problem(s):`);
		for (const p of problems) console.log(`  - ${p}`);
	}
	console.log(problems.length ? "\nFAIL" : "\nOK");
	process.exit(problems.length ? 1 : 0);
}
