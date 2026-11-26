/** Slugify a tag the way Hugo urlizes taxonomy terms, so both theme
    implementations generate the same tag URLs (see PARITY.md).
    Display labels keep the tag's first-seen spelling; only URLs use this. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
