// Pure id builders for content collections. No `astro:` imports, so
// `content.config.ts` can import this module.

export const NOTE_PATH = "src/content/notes";

const NOTE_ENTRY_PATTERN = /^(\d{4})\/([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx?$/;
const NOTE_ID_PATTERN = /^(\d{4})\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

/**
 * Content id of a note, `<year>/<slug>`, from its path under `src/content/notes/`
 * alone, so frontmatter cannot change a note URL.
 */
export function noteEntryId(entry: string): string {
  const match = NOTE_ENTRY_PATTERN.exec(entry);
  if (!match) {
    throw new Error(
      `[notes] ${entry}: expected src/content/notes/YYYY/<kebab-case-slug>.md or .mdx`
    );
  }
  const [, year, slug] = match;
  return `${year}/${slug}`;
}

/** Splits a `YYYY/slug` note id into the route params of the note page. */
export function getNoteParts(id: string): { year: string; slug: string } {
  const match = NOTE_ID_PATTERN.exec(id);
  if (!match) {
    throw new Error(`[notes] unexpected note id "${id}"`);
  }
  return { year: match[1], slug: match[2] };
}

export const PROJECT_PATH = "src/content/projects";

const PROJECT_ENTRY_PATTERN = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

/**
 * Content id of a project: the filename slug of a top-level file under
 * `src/content/projects/`, from the path alone.
 */
export function projectEntryId(entry: string): string {
  const match = PROJECT_ENTRY_PATTERN.exec(entry);
  if (!match) {
    throw new Error(
      `[projects] ${entry}: expected src/content/projects/<kebab-case-slug>.md (top level, Markdown only)`
    );
  }
  return match[1];
}
