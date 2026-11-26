// The indexes a native TerraSuite plugin would add to EmDash's collection table.
//
// EmDash indexes the system columns it owns - slug, status, locale, the
// revision pointers and the date orderings - and nothing on the fields a
// collection declares. That is the right default for a CMS: it has no idea
// which of your fields anybody filters on. It is not enough for a property
// search, where every query carries a department, a price range and half a
// dozen equality filters.
//
// A native plugin has direct database access, so it can add these on install
// the way TerraSuite's activation builds its own index table today. They are
// named ts_* so the measurement script can tell whether they are present.
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(process.argv[2] ?? "./data.db");
const drop = process.argv.includes("--drop");

const INDEXES = {
	// The ordinary search: narrowed by department, then a price range, with the
	// remaining equality filters available from the index itself.
	// Measured against four shapes at 20,000 properties: leading with the price
	// range costs 2.1 ms, seeking by town costs 0.75 ms, and carrying the rest of
	// the query in the index costs 0.09 ms, because SQLite then never reads the
	// table at all. The payload columns are there to be read, not to be sought.
	ts_props_search:
		"CREATE INDEX ts_props_search ON ec_properties " +
		"(deleted_at, status, dept, town, price, beds, baths, built_area, pool, " +
		"availability, property_type, id, slug, title)",

	// Browsing a town or a type, which is what a search-engine visitor lands on.
	ts_props_town: "CREATE INDEX ts_props_town ON ec_properties (deleted_at, status, town, price)",
	ts_props_type:
		"CREATE INDEX ts_props_type ON ec_properties (deleted_at, status, property_type, price)",

	// The bounding box that precedes an exact distance measure.
	ts_props_geo: "CREATE INDEX ts_props_geo ON ec_properties (deleted_at, status, lat, lng)",

	// Newest first, the default order on an agency's own site.
	ts_props_listed: "CREATE INDEX ts_props_listed ON ec_properties (deleted_at, status, listed_at DESC, id DESC)",
};

const started = Date.now();

for (const [name, sql] of Object.entries(INDEXES)) {
	db.exec(`DROP INDEX IF EXISTS ${name}`);
	if (!drop) db.exec(sql);
}

db.exec("ANALYZE");

const rows = db.prepare(
	"SELECT COUNT(*) c FROM sqlite_master WHERE type='index' AND tbl_name='ec_properties' AND name LIKE 'ts_%'",
).get().c;

console.log(`${drop ? "dropped" : "built"} ${drop ? Object.keys(INDEXES).length : rows} indexes in ${Date.now() - started} ms`);
