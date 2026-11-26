import { execFileSync } from "node:child_process";

// A shallow clone or a checkout with no `.git` silently yields no dates, so no page
// shows "Updated". Fetch full history in CI if the line matters.
const CONTENT_DIR = "src/content";

let dates = null;

function run(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  });
}

function load() {
  const map = new Map();

  let prefix = "";
  let log = "";

  try {
    // git paths are repo-root relative; `entry.filePath` is project relative (a monorepo differs).
    prefix = run(["rev-parse", "--show-prefix"]).trim();
    log = run([
      "-c",
      "core.quotepath=false",
      "log",
      "--pretty=format:%x00%cI",
      "--name-only",
      "--diff-filter=ACMRT",
      "--",
      CONTENT_DIR,
    ]);
  } catch {
    return map;
  }

  for (const commit of log.split("\0")) {
    const [iso, ...paths] = commit.split("\n");

    if (!iso) continue;

    for (const path of paths) {
      if (!path) continue;

      const relative = prefix && path.startsWith(prefix) ? path.slice(prefix.length) : path;

      if (!map.has(relative)) map.set(relative, iso);
    }
  }

  return map;
}

export function gitLastModified(filePath) {
  dates ??= load();

  const iso = filePath ? dates.get(filePath) : undefined;

  return iso ? new Date(iso) : null;
}
