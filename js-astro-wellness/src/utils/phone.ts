/** Build a safe `tel:` href from a phone number, stripping non-dialable chars. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}