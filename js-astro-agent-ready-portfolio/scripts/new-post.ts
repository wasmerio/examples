import { parseArgs } from "node:util";
import { createPost, UsageError } from "./lib/scaffold.ts";

// pnpm new:post "Title" [--description ...] [--tags a,b] [--projects Name] [--cover /images/x.jpg]
//                       [--published 2026-01-31] [--publish] [--root <dir>]
// Without --publish the post is a hidden draft.
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    description: { type: "string" },
    tags: { type: "string" },
    projects: { type: "string" },
    cover: { type: "string" },
    published: { type: "string" },
    publish: { type: "boolean" },
    root: { type: "string", default: process.cwd() },
  },
});

try {
  const { root, ...options } = values;
  console.log(`Created ${createPost(root!, { ...options, title: positionals.join(" ") })}`);
} catch (error) {
  if (!(error instanceof UsageError)) throw error;
  console.error(`new-post: ${error.message}`);
  process.exit(1);
}
