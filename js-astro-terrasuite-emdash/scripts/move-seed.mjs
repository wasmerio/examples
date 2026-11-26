// makeseed.py writes seed.json beside itself; EmDash reads seed/seed.json.
//
// A two-line script rather than a shell pipeline, because the seed step has to
// work the same way on Windows as it does on a Mac and on the server.
import { renameSync, existsSync } from "node:fs";

const from = "seed.json";
const to = "seed/seed.json";

if (!existsSync(from)) {
	console.error(`${from} is not there. Run: python3 seed/makeseed.py 24`);
	process.exit(1);
}

renameSync(from, to);
console.log(`${from} -> ${to}`);
