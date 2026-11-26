// Same rules as src/lib/content/frontmatter.ts, kept separate so scripts run without the app.
export function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, string>, body: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    data[line.slice(0, separator).trim()] = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return { data, body: match[2] };
}

export const parseList = (value = "") =>
  value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
