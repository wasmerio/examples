// Put photographs on the demo stock.
//
// An agency uploads its own through the media library. This is for the demo
// site and for anybody evaluating the template, who should see what a property
// card looks like with a picture on it rather than a coloured panel.
//
// The pictures are the ones TerraSuite ships in its regional content packs:
// Unsplash and Pexels licences, free for commercial use, no attribution
// required.
//
// POINT --from AT A FOLDER OF PACKS, one sub-folder per subject:
//
//   homes/       the exterior of one dwelling, its terrace or its pool
//   interiors/   a room
//   towns/       a town, a street, a panorama
//
// The subject is what matters, not the region. A folder named for a region is
// where the trouble starts: a pack called "mediterranean" holds villages,
// harbours, restaurants and the Greek islands as well as houses, so a finca in
// Benissa was illustrated with Santorini and a bungalow in Orba with a harbour
// full of boats. Sorting by subject is the whole fix, and it has to be done by
// eye - nothing in a filename can tell a villa from the village it stands in.
//
// A pack with no rule against its name is loaded into the media library and
// left unused, which is what "towns" is for: an area page can have it later,
// a property card never should.
//
// Two things happen per file: a row in media, and the file under the storage
// directory at the key that row names. EmDash's local storage adapter maps a
// storage key straight onto the URL after /_emdash/api/media/file/, so the key
// is the path and nothing else has to agree.
import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "node:fs";
import { join, basename, extname } from "node:path";

const arg = (name, fallback) => {
	const i = process.argv.indexOf(`--${name}`);
	return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const from = arg("from", "./demo-photos");
const db = new DatabaseSync(arg("db", "./data.db"));
const uploads = arg("uploads", "./uploads");
const prefix = "demo";

// Alt text per pack. The filenames are "home-003.jpg" and say nothing worth
// reading aloud, and a screen reader announcing "a home 003 photograph" is
// worse than a plain description. A real agency writes its own per photograph.
const ALT = {
	homes: "The outside of the property",
	interiors: "A room inside the property",
	towns: "The town the property is in",
	misc: "Property photograph",
};

if (!existsSync(from)) {
	console.error(`No such folder: ${from}`);
	process.exit(1);
}

// Crockford base32, twenty-six characters, time then randomness: a ULID, which
// is what EmDash gives its own rows.
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ulid = () => {
	let time = Date.now();
	let out = "";
	for (let i = 9; i >= 0; i -= 1) {
		out = CROCKFORD[time % 32] + out;
		time = Math.floor(time / 32);
	}
	for (let i = 0; i < 16; i += 1) out += CROCKFORD[Math.floor(Math.random() * 32)];
	return out;
};

/** Width and height straight out of the JPEG or PNG header. */
function dimensions(file) {
	const d = readFileSync(file);

	if (d[0] === 0x89 && d[1] === 0x50) {
		return { width: d.readUInt32BE(16), height: d.readUInt32BE(20), mime: "image/png" };
	}

	if (d[0] === 0xff && d[1] === 0xd8) {
		let i = 2;
		while (i < d.length - 9) {
			if (d[i] !== 0xff) { i += 1; continue; }
			const marker = d[i + 1];
			if (marker >= 0xc0 && marker <= 0xc2) {
				return { height: d.readUInt16BE(i + 5), width: d.readUInt16BE(i + 7), mime: "image/jpeg" };
			}
			i += 2 + d.readUInt16BE(i + 2);
		}
	}

	return null;
}

// One sub-folder per pack. A loose file at the top level goes into a pack
// called "misc", so pointing this at a flat folder still works and still says
// what it did.
// A pack called "rejected" is where curation puts what it threw out, so it is
// a working folder rather than a pack. Loading it would put restaurants and
// empty landscape into the agency's media library for somebody to pick by
// accident. Anything starting with a dot or an underscore is skipped for the
// same reason.
const IGNORE = (name) => name === "rejected" || name.startsWith(".") || name.startsWith("_");

const packs = new Map();

for (const entry of readdirSync(from).sort()) {
	const full = join(from, entry);

	if (IGNORE(entry)) continue;

	if (statSync(full).isDirectory()) {
		const inside = readdirSync(full).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
		if (inside.length) packs.set(entry, inside.map((f) => join(entry, f)));
	} else if (/\.(jpe?g|png)$/i.test(entry)) {
		if (!packs.has("misc")) packs.set("misc", []);
		packs.get("misc").push(entry);
	}
}

const files = [...packs.values()].flat();

if (!files.length) {
	console.error(`No photographs in ${from}`);
	process.exit(1);
}

for (const pack of packs.keys()) {
	mkdirSync(join(uploads, prefix, pack), { recursive: true });
}

const insert = db.prepare(
	`INSERT INTO media (id, filename, mime_type, size, width, height, alt, storage_key, status, created_at)
	 VALUES (?,?,?,?,?,?,?,?,'ready',?)`,
);

// A file already loaded keeps the media row it has, so the script can be run
// again with a bigger folder without duplicating what is already there.
const known = new Set(
	db.prepare("SELECT storage_key FROM media WHERE storage_key LIKE ?")
		.all(`${prefix}/%`)
		.map((r) => r.storage_key),
);

const now = new Date().toISOString();
let added = 0;

db.exec("BEGIN");

for (const file of files) {
	const key = `${prefix}/${file}`;

	if (known.has(key)) continue;

	const source = join(from, file);
	const size = readFileSync(source).length;
	const dim = dimensions(source);

	if (!dim) {
		console.warn(`skipped ${file}: not a JPEG or PNG`);
		continue;
	}

	copyFileSync(source, join(uploads, key));

	const pack = file.includes("/") ? file.split("/")[0] : "misc";
	const alt = ALT[pack] || "Property photograph";

	insert.run(ulid(), basename(file), dim.mime, size, dim.width, dim.height,
		alt, key, now);
	added += 1;
}

db.exec("COMMIT");

const library = db
	.prepare(
		`SELECT id, storage_key, filename, mime_type, width, height, alt
		 FROM media WHERE storage_key LIKE ? ORDER BY storage_key`,
	)
	.all(`${prefix}/%`);

// An image field is a TEXT column holding the JSON EmDash's own image field
// defines, not a bare media id: id, and the src, alt and dimensions cached at
// the moment an editor picked it (MediaValue, in emdash/src/media/types.ts).
// Writing the id alone renders as <img src="01M3MY..."> on a property page and
// matches nothing at all in code that expects the real shape.
const value = (m) =>
	JSON.stringify({
		provider: "local",
		id: m.id,
		src: `/_emdash/api/media/file/${m.storage_key.split("/").map(encodeURIComponent).join("/")}`,
		filename: m.filename,
		mimeType: m.mime_type,
		width: m.width,
		height: m.height,
		alt: m.alt || "Property photograph",
	});

// Which pack each kind of property draws from. A flat above a shop is sold on
// its rooms and a villa on its outside, which is how an agency photographs
// them. Land and commercial premises get nothing: a building plot with a
// picture of somebody's house on it tells a reader the data is invented.
const WANTS = {
	apartment: "interiors",
	penthouse: "interiors",
	duplex: "interiors",
	townhouse: "interiors",
	studio: "interiors",
	villa: "homes",
	finca: "homes",
	bungalow: "homes",
	"country-house": "homes",
	chalet: "homes",
	plot: null,
	commercial: null,
	land: null,
};
const FALLBACK_PACK = "homes";

const inPack = (name) =>
	library.filter((r) => r.storage_key.startsWith(`${prefix}/${name}/`)).map(value);

const pool = new Map();
for (const name of new Set(Object.values(WANTS).filter(Boolean).concat(FALLBACK_PACK))) {
	pool.set(name, inPack(name));
}

const properties = db
	.prepare(
		"SELECT id, property_type FROM ec_properties WHERE deleted_at IS NULL ORDER BY id",
	)
	.all();

const setImage = db.prepare("UPDATE ec_properties SET featured_image = ? WHERE id = ?");

// Pick by a hash of the property's own id rather than by its position in this
// list. Dealing round robin looks even until the page is sorted by something
// else: a price-ordered search puts neighbouring properties next to each other,
// their positions were consecutive, and the same photograph appears twice in one
// row of cards. A hash has no such correlation with any ordering the site uses.
// FNV-1a, which is short enough to read and good enough for dealing pictures.
const hash = (s) => {
	let h = 0x811c9dc5;
	for (let i = 0; i < s.length; i += 1) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h;
};

db.exec("BEGIN");

let placed = 0;

const unknown = new Set();

for (const row of properties) {
	const type = row.property_type;

	if (type in WANTS && WANTS[type] === null) {
		setImage.run(null, row.id);
		continue;
	}

	if (!(type in WANTS)) unknown.add(type);

	const want = WANTS[type] || FALLBACK_PACK;
	const from = pool.get(want)?.length ? pool.get(want) : pool.get(FALLBACK_PACK);

	if (!from?.length) continue;

	setImage.run(from[hash(row.id) % from.length], row.id);
	placed += 1;
}

db.exec("COMMIT");

console.log(
	`${library.length} photographs in ${pool.size} packs `
	+ `(${[...pool].map(([n, p]) => `${n} ${p.length}`).join(", ")}; ${added} new this run), `
	+ `on ${placed} of ${properties.length} properties (${uploads}/${prefix}/)`,
);

if (unknown.size) {
	console.warn(
		`no pack named for ${[...unknown].sort().join(", ")} - used ${FALLBACK_PACK}. `
		+ `Add them to WANTS if that is wrong.`,
	);
}

// A page of results shows twelve cards, so say plainly whether a pack is big
// enough for twelve different ones. Fewer photographs than cards guarantees a
// repeat however they are dealt, and a demo that repeats looks like a bug.
for (const [name, p] of pool) {
	if (p.length && p.length < 12) {
		console.warn(
			`only ${p.length} in the ${name} pack: a full page of results cannot `
			+ `show twelve different ones. Put more in it.`,
		);
	}
}
