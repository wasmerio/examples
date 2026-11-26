/**
 * The demo's CV file holds no address on a fake host. Reading a PDF's text takes `pdftotext`: with none on the machine,
 * or with the demo's CV replaced, this has nothing to check.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("../../public/files/rowan-ellery-cv.pdf", import.meta.url));
const read = () => spawnSync("pdftotext", [file, "-"], { encoding: "utf8" });
const skip = !existsSync(file) ? "the demo's CV is gone" : read().error ? "no pdftotext" : false;

test("the demo's CV gives its email on example.com, and names no other fake host", { skip }, () => {
	const { stdout: text } = read();
	assert.match(text, /Rowan Ellery/, "the text was read");
	assert.match(text, /\bname@example\.com\b/);
	assert.doesNotMatch(text, /\.example\b(?!\.com)/);
});
