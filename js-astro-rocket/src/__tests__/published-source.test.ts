import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

/**
 * Tutorials on this blog publish whole files. A reader copies the block into
 * their own project, so a block that has fallen behind the file it came from
 * hands out code the theme itself stopped using.
 *
 * That happened. The LetterGlitch tutorial published a component two versions
 * old — including the performance fault reported as #646 — and a wrapper
 * missing its whole shadow treatment, for three months. Nothing failed,
 * because nothing was comparing them.
 *
 * Any post that writes "Save this as `some/path`" and follows it with a code
 * block is making a promise about that path. This checks the promise.
 *
 * A block that is deliberately a simplified extract should not use that
 * phrasing — say "here is the shape of it", or something else that does not
 * read as "copy this".
 */
const ROOT = new URL('../../', import.meta.url);

/** "Save this as `path`" (or "Save it as"), then the next fenced block. */
const CLAIM = /Save (?:this|it) as `([^`]+)`[^\n]*\n+```[a-z]*\n([\s\S]*?)^```$/gm;

interface Claim {
  post: string;
  path: string;
  published: string;
}

function claimsIn(post: string, markdown: string): Claim[] {
  const found: Claim[] = [];
  for (const match of markdown.matchAll(CLAIM)) {
    found.push({ post, path: match[1], published: match[2] });
  }
  return found;
}

const posts = globSync('src/content/blog/**/*.mdx', {
  cwd: fileURLToPath(ROOT),
});

const claims = posts.flatMap((post) =>
  claimsIn(post, readFileSync(fileURLToPath(new URL(post, ROOT)), 'utf8'))
);

describe('source published in tutorials', () => {
  it('finds the blocks that claim to be a file', () => {
    // A guard on the parser itself: if the phrasing changes and this drops to
    // zero, the suite would pass by checking nothing.
    expect(claims.length).toBeGreaterThan(0);
  });

  it.each(claims)('$post publishes $path as it ships', ({ path, published }) => {
    const file = fileURLToPath(new URL(path, ROOT));
    expect(existsSync(file), `${path} does not exist in the theme`).toBe(true);
    expect(published).toBe(readFileSync(file, 'utf8'));
  });
});
