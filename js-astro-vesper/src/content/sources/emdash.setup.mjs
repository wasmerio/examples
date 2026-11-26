/**
 * Astro setup for the EmDash source: server output, the Node adapter and the `emdash()` integration. Imports are
 * dynamic, so projects that use another source do not need these packages.
 */
export default async function setup() {
	const [{ default: node }, { default: emdash, local }, { sqlite }] = await Promise.all([
		import("@astrojs/node"),
		import("emdash/astro"),
		import("emdash/db"),
	]);
	return {
		output: "server",
		adapter: node({ mode: "standalone" }),
		integrations: [
			emdash({
				// EMDASH_DATABASE_URL lets a deploy or a test point at another database.
				database: sqlite({ url: process.env.EMDASH_DATABASE_URL || "file:./data.db" }),
				// baseUrl must match `mediaBaseUrl` in the adapter (the default does).
				storage: local({ directory: "./uploads", baseUrl: "/_emdash/api/media/file" }),
			}),
		],
	};
}
