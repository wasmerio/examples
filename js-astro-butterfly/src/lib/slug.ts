/**
 * Port of hexo-util `slugize` (transform: none). Used for heading ids and
 * tag/category URLs so every link from the Hexo era keeps working.
 */
const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\;:"'<>,.?/]+/g;

export function slugize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Hexo-style duplicate handling: foo, foo-1, foo-2 ... */
/** Hexo's markdown renderer slugged the HTML-escaped heading text (`&` → `&amp;` → `-amp-`). */
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export class HexoSlugger {
  private seen = new Map<string, number>();
  slug(text: string): string {
    const base = slugize(escapeHtml(text));
    const n = this.seen.get(base);
    if (n === undefined) {
      this.seen.set(base, 1);
      return base;
    }
    this.seen.set(base, n + 1);
    return `${base}-${n}`;
  }
}
