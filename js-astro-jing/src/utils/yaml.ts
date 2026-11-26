/** Escape a string for use inside a single-quoted YAML scalar. */
export function yamlEscape(value: string): string {
  return value.replace(/'/g, "''");
}
