/** TOC / heading anchor slug — matches upstream `my_custom_slugify` (Unicode-aware). */
export function headingSlugify(value: string, separator = '-'): string {
  let s = String(value).toLowerCase().trim();
  s = s.normalize('NFKD');
  // JS `\w` is ASCII-only; use Unicode letters/numbers like Python `\w` with CJK.
  s = s.replace(/[^\p{L}\p{N}_\s-]/gu, '');
  s = s.replace(/[\s-]+/g, separator).replace(
    new RegExp(`^${separator}+|${separator}+$`, 'g'),
    '',
  );
  return s;
}

/** Tag URL segment — matches upstream `tag_to_slug`. */
export function tagToSlug(tagName: string): string {
  const slug = headingSlugify(tagName, '-');
  return slug || encodeURIComponent(tagName);
}
