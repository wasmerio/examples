import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dates } from '@/config';

/**
 * Commits that touched posts mechanically (syntax migrations, formatting) and
 * must not count as content updates. Same file and format as git's
 * `blame.ignoreRevsFile`, so `git blame` and GitHub skip them too.
 */
export const IGNORE_REVS_FILE = '.git-blame-ignore-revs';

/**
 * Only commits after this moment count (`dates.gitSince` in src/config.ts).
 * Empty = the whole history. A blog moved from elsewhere sets it to the move:
 * history before that is copies and renames, its front matter has the truth.
 */
const since = (): Date => {
  const v = dates?.gitSince;
  const d = v ? new Date(v) : new Date(0);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
};

const norm = (p: string) => p.replace(/\\/g, '/').replace(/^\.\//, '');

function git(args: string[]): string | undefined {
  try {
    return execFileSync('git', ['-c', 'core.quotepath=false', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return undefined; // git missing or not a repository
  }
}

export function readIgnoreRevs(file = IGNORE_REVS_FILE): Set<string> {
  if (!existsSync(file)) return new Set();
  return new Set(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.replace(/#.*/, '').trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Parse `git log --format=COMMIT:%H %aI --name-only` output into
 * path -> newest author date, skipping ignored commits and those not after `since`.
 */
export function parseGitLog(stdout: string, ignore: Set<string>, since = new Date(0)): Map<string, Date> {
  const map = new Map<string, Date>();
  let current: Date | null = null;
  for (const raw of stdout.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('COMMIT:')) {
      const [sha, iso] = line.slice(7).split(' ');
      const skip = [...ignore].some((rev) => sha.toLowerCase().startsWith(rev));
      const d = new Date(iso);
      current = skip || Number.isNaN(d.getTime()) || d <= since ? null : d;
    } else if (current) {
      const file = norm(line);
      const prev = map.get(file);
      if (!prev || current > prev) map.set(file, current);
    }
  }
  return map;
}

let committed: Map<string, Date> | undefined;
let dirty: Set<string> | undefined;

function committedDates(): Map<string, Date> {
  // Author date survives rebases and cherry-picks; committer date doesn't.
  committed ??= parseGitLog(
    git(['log', '--format=COMMIT:%H %aI', '--name-only', '--no-renames']) ?? '',
    readIgnoreRevs(),
    since(),
  );
  return committed;
}

function dirtyFiles(): Set<string> {
  dirty ??= new Set(
    (git(['status', '--porcelain', '-z', '--untracked-files=all', '--no-renames']) ?? '')
      .split('\0')
      .filter(Boolean)
      .map((entry) => norm(entry.slice(3))),
  );
  return dirty;
}

/**
 * When git last saw a content change to a file: its mtime while it has
 * uncommitted edits, otherwise the author date of the newest trusted commit
 * (after `dates.gitSince`, not in `.git-blame-ignore-revs`). `undefined` if none.
 */
export function getFileGitDate(path: string): Date | undefined {
  const file = norm(path);
  if (dirtyFiles().has(file)) {
    try {
      return statSync(file).mtime;
    } catch {
      return undefined; // deleted in the working tree
    }
  }
  return committedDates().get(file);
}

/** Post update date: the later of the frontmatter record and git. */
export function resolveUpdated(file: string | undefined, frontmatter: Date | undefined, date: Date): Date {
  const git = file ? getFileGitDate(file) : undefined;
  const candidates = [frontmatter, git].filter((d): d is Date => !!d);
  return candidates.length ? new Date(Math.max(...candidates.map((d) => d.getTime()))) : date;
}
