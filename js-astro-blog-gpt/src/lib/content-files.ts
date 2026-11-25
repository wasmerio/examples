import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import { extractFrontmatter } from '@astrojs/markdown-remark';
import { fileIdentity } from './content-variants.ts';

export const contentKinds = ['pages', 'posts', 'categories', 'tags'] as const;
export type ContentKind = (typeof contentKinds)[number];

/** An index owns its entire subtree; other Markdown files there are attachments. */
export async function contentFiles(
  directory: string,
  locales: readonly string[],
): Promise<string[]> {
  async function visit(folder: string): Promise<string[]> {
    const entries = await readdir(path.join(directory, folder), {
      withFileTypes: true,
    }).catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
    const markdown = entries.filter(
      (e) => e.isFile() && /\.(md|mdx)$/i.test(e.name),
    );
    const indexes = markdown.filter(
      (e) => fileIdentity(e.name, locales).bundle,
    );
    if (indexes.length)
      return indexes.map((e) => path.posix.join(folder, e.name));
    return [
      ...markdown.map((e) => path.posix.join(folder, e.name)),
      ...(
        await Promise.all(
          entries
            .filter((e) => e.isDirectory())
            .map((e) => visit(path.posix.join(folder, e.name))),
        )
      ).flat(),
    ];
  }
  return (await visit('')).sort();
}

export function frontmatter(source: string): Record<string, unknown> {
  // Share Astro's boundaries while retaining YAML scalar types for validation.
  // Astro's full parser coerces unquoted ISO date strings into Date objects.
  const raw = extractFrontmatter(source);
  const data: unknown =
    raw === undefined ? {} : parse(raw, { schema: 'core', merge: true });
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('Frontmatter must be a YAML mapping.');
  return data as Record<string, unknown>;
}

export async function readContentFiles(
  root: string,
  locales: readonly string[],
) {
  return (
    await Promise.all(
      contentKinds.map(async (kind) => {
        const base = path.join(root, 'content', kind);
        return Promise.all(
          (await contentFiles(base, locales)).map(async (file) => ({
            kind,
            file,
            absolute: path.join(base, file),
            data: frontmatter(await readFile(path.join(base, file), 'utf8')),
            identity: fileIdentity(file, locales),
          })),
        );
      }),
    )
  ).flat();
}
