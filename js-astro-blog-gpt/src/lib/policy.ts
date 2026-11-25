import { validSlug, slugRule } from '../../scripts/lib/slug.mjs';

export interface Visibility {
  draft: boolean;
  hidden: boolean;
  date: Date;
}

export function isPublished(data: Visibility, now = new Date()): boolean {
  return !data.draft && data.date.getTime() <= now.getTime();
}

export function canRender(
  data: Visibility,
  dev: boolean,
  previewDrafts: boolean,
  now = new Date(),
): boolean {
  return isPublished(data, now) || (dev && previewDrafts);
}

export function canDiscover(data: Visibility, now = new Date()): boolean {
  return isPublished(data, now) && !data.hidden;
}

export function safeSlug(value: string): string {
  if (!validSlug(value))
    throw new Error(`Invalid slug: ${JSON.stringify(value)}. ${slugRule}`);
  return value;
}

/** Warn with the source file before routing or schema transforms can fail. */
export function validateContentSlugs(
  data: Record<string, unknown>,
  file: string,
  warn: (message: string) => void,
  post = false,
): void {
  const fields: [string, unknown][] = [['slug', data.slug]];
  if (post)
    for (const field of ['category', 'categories', 'tags']) {
      const values = data[field];
      if (values !== undefined)
        for (const value of Array.isArray(values) ? values : [values])
          fields.push([field, value]);
    }
  const invalid = fields.filter(([, value]) => !validSlug(value));
  for (const [field, value] of invalid)
    warn(
      `Invalid ${field === 'slug' ? 'slug' : `${field} slug`} in ${file}: ${JSON.stringify(value)}. ${slugRule}`,
    );
  if (invalid.length)
    throw new Error(`Invalid content slugs in ${file}. ${slugRule}`);
}
