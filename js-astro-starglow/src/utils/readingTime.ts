const WORDS_PER_MINUTE = 200;

// MDX top-level ESM: starts in column 0 and looks like a real statement.
const ESM_LINE =
  /^(?:import\s+(?:[\w*${},\s]+\s+from\s+)?["'].*|export\s+(?:const|let|var|function|class|default|async|type|interface)\b.*|export\s*[{*].*)$/;
const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/;

/**
 * Drops MDX import/export statements that sit outside fenced code blocks.
 * Code inside fences stays, since it is read like any other text.
 */
function stripEsmOutsideFences(body: string): string {
  const kept: string[] = [];
  let fence: string | null = null;
  for (const line of body.split("\n")) {
    if (fence === null) {
      const open = FENCE_OPEN.exec(line);
      if (open) fence = open[1];
      else if (ESM_LINE.test(line)) continue;
    } else if (
      line.trimStart().startsWith(fence) &&
      line.trim().replace(new RegExp(`^${fence[0]}+`), "") === ""
    ) {
      fence = null;
    }
    kept.push(line);
  }
  return kept.join("\n");
}

/** Minutes to read a Markdown/MDX body at 200 wpm, rounded up, at least 1. */
export function readingTime(body?: string): number {
  const text = stripEsmOutsideFences(body ?? "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
