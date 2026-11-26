import { execFileSync } from "node:child_process";

const cache = new Map<string, Date>();

/**
 * Author date of the last commit that touched `filePath` (it survives amend and
 * rebase, the committer date does not), or `undefined`. Never throws, so the
 * build never depends on git. The path is passed after `--` without a shell,
 * so a crafted filename cannot inject a command or option. Only found dates are
 * memoised, so a file committed while the dev server runs is picked up.
 */
export function getGitLastModified(
  filePath: string | undefined
): Date | undefined {
  if (!filePath) return undefined;
  const cached = cache.get(filePath);
  if (cached) return cached;

  let date: Date | undefined;
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%aI", "--", filePath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    const parsed = out ? new Date(out) : undefined;
    date = parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;
  } catch {
    date = undefined;
  }

  if (date) cache.set(filePath, date);
  return date;
}
