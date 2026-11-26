/**
 * The Vesper Mono files are a Modified Version of IBM Plex Mono, so the OFL bars them from the Reserved Font Name "Plex":
 * no record that names the font may hold that word or IBM's name, and the copyright notice must stay.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { brotliDecompressSync } from "node:zlib";

const read = (path) => readFileSync(new URL(`../../src/styles/${path}`, import.meta.url), "utf8");
const fontFile = (name) => new URL(`../../src/assets/fonts/${name}`, import.meta.url);

/** The name table's records of a WOFF2 file, as [nameID, text], and the OS/2 vendor ID. The tables sit one after another in one Brotli stream. */
function readFont(file) {
	const woff2 = readFileSync(file);
	assert.equal(woff2.toString("latin1", 0, 4), "wOF2");
	const count = woff2.readUInt16BE(12);
	const compressed = woff2.readUInt32BE(20);
	let at = 48;
	const base128 = () => {
		let value = 0;
		for (;;) {
			const byte = woff2[at++];
			value = value * 128 + (byte & 0x7f);
			if (!(byte & 0x80)) return value;
		}
	};
	let offset = 0;
	let name;
	let os2;
	for (let i = 0; i < count; i++) {
		const flags = woff2[at++];
		const known = flags & 0x3f;
		if (known === 63) at += 4;
		const version = flags >> 6;
		const original = base128();
		// glyf (10) and loca (11) are transformed at version 0; every other table at any other version.
		const transformed = known === 10 || known === 11 ? version !== 3 : version !== 0;
		const length = transformed ? base128() : original;
		if (known === 5) name = { offset, length };
		if (known === 6) os2 = { offset, length };
		offset += length;
	}
	assert.ok(name, "no name table");
	assert.ok(os2, "no OS/2 table");
	const data = brotliDecompressSync(woff2.subarray(at, at + compressed));
	const table = data.subarray(name.offset, name.offset + name.length);
	const strings = table.readUInt16BE(4);
	const records = Array.from({ length: table.readUInt16BE(2) }, (_, i) => {
		const record = 6 + i * 12;
		const start = strings + table.readUInt16BE(record + 10);
		const bytes = Buffer.from(table.subarray(start, start + table.readUInt16BE(record + 8)));
		// Platforms 0 and 3 are UTF-16 big-endian; platform 1 is single bytes.
		const text = table.readUInt16BE(record) === 1 ? bytes.toString("latin1") : bytes.swap16().toString("utf16le");
		return [table.readUInt16BE(record + 6), text];
	});
	return { records, vendor: data.toString("latin1", os2.offset + 58, os2.offset + 62) };
}

for (const [file, family, full, postscript] of [
	["VesperMono-latin-400.woff2", "Vesper Mono", "Vesper Mono Regular", "VesperMono-Regular"],
	["VesperMono-latin-500.woff2", "Vesper Mono Medium", "Vesper Mono Medium", "VesperMono-Medium"],
]) {
	test(`${file} is named Vesper Mono and keeps the copyright notice`, () => {
		const { records, vendor } = readFont(fontFile(file));
		const notices = new Set([0, 7, 13, 14]);
		const names = records.filter(([id]) => !notices.has(id));
		assert.ok(names.length > 4, "the name table was not read");
		for (const [id, text] of names) assert.doesNotMatch(text, /plex|ibm/i, `name record ${id}`);
		const one = (id) => records.find(([found]) => found === id)?.[1];
		assert.equal(one(1), family);
		assert.equal(one(4), full);
		assert.equal(one(6), postscript);
		assert.equal(one(3), `2.3;NONE;${postscript}`);
		assert.equal(one(0), "Copyright 2017 IBM Corp. All rights reserved.");
		assert.match(one(14), /OFL/);
		assert.equal(vendor, "NONE");
	});
}

test("the old file names and family are gone, and the license says what the rename is", () => {
	for (const old of ["IBMPlexMono-latin-400.woff2", "IBMPlexMono-latin-500.woff2"]) assert.ok(!existsSync(fontFile(old)), old);
	const css = read("fonts.css") + read("looks/clear.css") + read("looks/field.css");
	assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ""), /Plex/);
	assert.match(css, /font-family: "Vesper Mono";/);
	const ofl = readFileSync(fontFile("OFL.txt"), "utf8");
	assert.ok(ofl.includes('Copyright 2017 IBM Corp. with Reserved Font Name "Plex".'));
	assert.ok(ofl.includes('Vesper Mono is a Modified Version of IBM Plex Mono: the Latin subset, with its names changed, and it stays under the OFL. Its name differs because "Plex" is a Reserved Font Name.'));
});
