// Bulk-load properties straight into the collection table.
//
// EmDash gives every collection a real SQL table with a real column per field -
// ec_properties has price REAL, beds INTEGER, lat REAL and so on. That is the
// same shape as TerraSuite's own flat search index, so this is a fair place to
// measure what a ten-filter property search costs.
//
// Writing rows directly is what an importer inside a native plugin would do,
// and it is the only way to get to five figures of stock without driving the
// admin. Nothing here invents a column: every name comes from the table EmDash
// created from the seed.
import { DatabaseSync } from "node:sqlite";

const count = Number(process.argv[2] ?? 5000);
const db = new DatabaseSync("./data.db");

const TYPES = ["villa", "apartment", "townhouse", "finca", "bungalow", "penthouse",
	"plot", "commercial", "duplex", "country-house"];
const TOWNS = ["javea", "denia", "moraira", "calpe", "altea", "benissa", "teulada",
	"gata-de-gorgos", "pedreguer", "ondara", "oliva", "pego", "benitachell", "orba", "jalon"];
const REGIONS = ["alicante", "valencia", "murcia"];
const FEATURES = ["sea-view", "air-conditioning", "central-heating", "terrace", "garage",
	"storage", "lift", "furnished", "fireplace", "solarium", "guest-apartment", "gated",
	"tourist-licence", "south-facing", "mountain-view", "walking-distance", "corner-plot", "basement"];
const ENERGY = ["A", "B", "C", "D", "E", "F", "G"];
const FOR_SALE = ["available", "available", "available", "available",
	"under-offer", "reserved", "sold"];
const TO_LET = ["available", "available", "available", "let"];

// A fixed sequence, so a rerun produces the same stock and the same timings.
// mulberry32. The first version here was a linear congruential generator,
// which put two properties with identical price, bedrooms, bathrooms and floor
// area side by side in the shop window - different records that looked like a
// duplicate, which is worse than a duplicate.
let seed = 20260929;
const rnd = () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (a) => a[Math.floor(rnd() * a.length)];
const title = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const between = (lo, hi) => lo + Math.floor(rnd() * (hi - lo));

const existing = db.prepare("SELECT COUNT(*) c FROM ec_properties").get().c;

const insert = db.prepare(`INSERT INTO ec_properties
 (id, slug, status, created_at, updated_at, published_at, version, locale, translation_group,
  title, reference, dept, price, currency, beds, baths, receptions, built_area, plot_area,
  property_type, town, region, country, lat, lng, new_build, pool, parking, garden,
  chain_free, energy, availability, features, listed_at, description)
 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

const started = Date.now();
db.exec("BEGIN");

for (let i = existing + 1; i <= existing + count; i += 1) {
	const t = pick(TYPES);
	const town = pick(TOWNS);
	// Land and commercial premises have no bedrooms, and a rent that ignores the
	// size of the house makes the stock look invented the moment anybody reads a
	// card. Both matter: this data is the template's shop window as well as its
	// load test.
	const dwelling = !["plot", "commercial"].includes(t);
	const beds = dwelling ? pick([1, 2, 2, 3, 3, 3, 4, 4, 5, 6]) : 0;
	const baths = dwelling ? Math.max(1, beds - pick([0, 1, 1, 2])) : 0;
	const dept = rnd() < 0.18 ? "rent" : "sale";
	const price = dept === "rent"
		? between(450, 900) * Math.max(beds, 1)
		: between(60, 320) * 1000 + beds * between(15, 70) * 1000;
	const built = dwelling
		? between(40 + beds * 18, 70 + beds * 45)
		: between(60, 400);
	const plot = ["apartment", "penthouse", "duplex"].includes(t) ? 0 : between(200, 5000);
	const feats = FEATURES.filter(() => rnd() < 0.3);
	const id = `p-${String(i).padStart(6, "0")}`;
	const when = new Date(Date.UTC(2026, between(0, 9), between(1, 28), 9)).toISOString();

	insert.run(
		id, `${id}-${town}`, "published", when, when, when, 1, "en", id,
		dwelling
			? `${beds} bedroom ${t.replace(/-/g, " ")} in ${title(town)}`
			: `${title(t)} in ${title(town)}`,
		`TS-${String(i).padStart(6, "0")}`, dept, price, "EUR", beds, baths, between(1, 4),
		built, plot, t, town, pick(REGIONS), "ES",
		Number((38.6 + rnd() * 0.7).toFixed(6)), Number((-0.35 + rnd() * 0.75).toFixed(6)),
		rnd() < 0.15 ? 1 : 0, rnd() < 0.55 ? 1 : 0, rnd() < 0.6 ? 1 : 0, rnd() < 0.5 ? 1 : 0,
		rnd() < 0.3 ? 1 : 0, pick(ENERGY), pick(dept === "rent" ? TO_LET : FOR_SALE),
		JSON.stringify(feats), when,
		JSON.stringify([{ _type: "block", style: "normal", _key: "k0",
			children: [{ _type: "span", _key: "k1",
				text: `A ${t.replace(/-/g, " ")} of ${built} square metres in ${title(town)}.` }] }]),
	);
}

db.exec("COMMIT");

const total = db.prepare("SELECT COUNT(*) c FROM ec_properties").get().c;
console.log(`inserted ${count} in ${Date.now() - started} ms, ${total} rows total`);
