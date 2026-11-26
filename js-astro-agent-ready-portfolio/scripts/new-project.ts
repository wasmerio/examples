import { parseArgs } from "node:util";
import { createProject, UsageError } from "./lib/scaffold.ts";

// pnpm new:project "Name" --repo https://github.com/owner/name --description "One sentence."
//                         [--updated 2026-01-31] [--root <dir>]
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    repo: { type: "string" },
    description: { type: "string" },
    updated: { type: "string" },
    root: { type: "string", default: process.cwd() },
  },
});

try {
  const { root, ...options } = values;
  console.log(`Created ${createProject(root!, { ...options, title: positionals.join(" ") })}`);
} catch (error) {
  if (!(error instanceof UsageError)) throw error;
  console.error(`new-project: ${error.message}`);
  process.exit(1);
}
