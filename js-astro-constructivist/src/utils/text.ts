/**
 * Work and project highlights are authored with a leading emoji. The print
 * design uses geometric markers instead, so remove the pictograph but keep the
 * sentence untouched.
 */
export function stripLeadingEmoji(value: string): string {
  return value.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '').trim()
}
