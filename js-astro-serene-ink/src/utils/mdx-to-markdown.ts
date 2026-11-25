export interface PostContentOptions {
  title: string;
  frontmatter?: string;
  body?: string;
}

function extractAttribute(tagStr: string, attrName: string): string | undefined {
  const regex = new RegExp(
    `${attrName}=(?:["']([^"']*)["']|\\{["']([^"']*)["']\\}|\\{([^{}]+)\\})`,
    "i"
  );
  const match = tagStr.match(regex);
  if (!match) return undefined;
  return (match[1] ?? match[2] ?? match[3])?.trim();
}

function extractArrayAttribute(tagStr: string, attrName: string): string[] {
  const regex = new RegExp(`${attrName}=\\{\\s*\\[([\\s\\S]*?)\\]\\s*\\}`, "i");
  const match = tagStr.match(regex);
  if (!match || !match[1]) return [];

  const rawContent = match[1];
  const items: string[] = [];
  const itemRegex = /(?:'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`)/g;
  let itemMatch: RegExpExecArray | null;

  while ((itemMatch = itemRegex.exec(rawContent)) !== null) {
    const val = itemMatch[1] ?? itemMatch[2] ?? itemMatch[3];
    if (val !== undefined) {
      items.push(val.replace(/\\'/g, "'").replace(/\\"/g, '"'));
    }
  }

  return items;
}

function deindent(text: string): string {
  const lines = text.split(/\r?\n/);
  const nonEmptyLines = lines.filter((l) => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return text.trim();

  const minIndent = Math.min(
    ...nonEmptyLines.map((l) => l.match(/^(\s*)/)?.[1].length ?? 0)
  );

  return lines
    .map((l) => (l.length >= minIndent ? l.slice(minIndent) : l.trim()))
    .join("\n")
    .trim();
}

function toBlockquote(content: string, header?: string): string {
  const lines = content.trim().split(/\r?\n/);
  const formattedLines: string[] = [];

  if (header) {
    formattedLines.push(`> ${header}`);
  }

  for (const line of lines) {
    formattedLines.push(line.length > 0 ? `> ${line}` : ">");
  }

  return formattedLines.join("\n");
}

export function mdxToMarkdown(rawMdx: string): string {
  if (!rawMdx) return "";

  let md = rawMdx;

  // stash code blocks and inline code to prevent regex transforms inside them
  const codeVault: string[] = [];

  md = md.replace(/```[\s\S]*?```/g, (match) => {
    const token = `%%CODE_BLOCK_${codeVault.length}%%`;
    codeVault.push(match);
    return token;
  });

  md = md.replace(/`[^`\n]+`/g, (match) => {
    const token = `%%INLINE_CODE_${codeVault.length}%%`;
    codeVault.push(match);
    return token;
  });

  md = md.replace(/^import\s+[\s\S]*?from\s+['"].*?['"];?\s*$/gm, "");
  md = md.replace(/<(?:Divider|Separator)\s*\/?>/gi, "\n\n---\n\n");

  md = md.replace(
    /<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/gi,
    (_, attrs, body) => {
      const type = (extractAttribute(attrs, "type") || "note").toLowerCase();
      const title = extractAttribute(attrs, "title");
      const cleanBody = deindent(body);

      const alertTypeMap: Record<string, string> = {
        note: "NOTE",
        tip: "TIP",
        warning: "WARNING",
        danger: "CAUTION",
        caution: "CAUTION",
        important: "IMPORTANT",
      };

      const alertType = alertTypeMap[type] || "NOTE";
      const header = `[!${alertType}]`;
      const titleLine = title ? `**${title}**\n\n` : "";

      return `\n\n${toBlockquote(`${titleLine}${cleanBody}`, header)}\n\n`;
    }
  );

  md = md.replace(
    /<Quote\b([^>]*)>([\s\S]*?)<\/Quote>/gi,
    (_, attrs, body) => {
      const author = extractAttribute(attrs, "author");
      const title = extractAttribute(attrs, "title");
      const cleanBody = deindent(body);

      let attribution = "";
      if (author && title) {
        attribution = `\n\n— **${author}**, *${title}*`;
      } else if (author) {
        attribution = `\n\n— **${author}**`;
      } else if (title) {
        attribution = `\n\n— *${title}*`;
      }

      return `\n\n${toBlockquote(`${cleanBody}${attribution}`)}\n\n`;
    }
  );

  md = md.replace(/<ProsCons\b([^>]*)\/?>/gi, (_, attrs) => {
    const pros = extractArrayAttribute(attrs, "pros");
    const cons = extractArrayAttribute(attrs, "cons");

    const sections: string[] = [];
    if (pros.length > 0) {
      sections.push(`**Pros:**\n${pros.map((p) => `- ${p}`).join("\n")}`);
    }
    if (cons.length > 0) {
      sections.push(`**Cons:**\n${cons.map((c) => `- ${c}`).join("\n")}`);
    }

    return `\n\n${sections.join("\n\n")}\n\n`;
  });

  md = md.replace(
    /<Tabs\b([^>]*)>([\s\S]*?)<\/Tabs>/gi,
    (_, tabsAttrs, tabsBody) => {
      const tabLabels = extractArrayAttribute(tabsAttrs, "tabs");
      const items: string[] = [];

      const tabItemRegex = /<TabItem\b[^>]*>([\s\S]*?)<\/TabItem>/gi;
      let itemMatch: RegExpExecArray | null;
      let index = 0;

      while ((itemMatch = tabItemRegex.exec(tabsBody)) !== null) {
        const itemContent = deindent(itemMatch[1]);
        const label = tabLabels[index] || `Option ${index + 1}`;
        items.push(`**${label}:**\n\n${itemContent}`);
        index++;
      }

      if (items.length === 0) {
        return `\n\n${deindent(tabsBody.replace(/<\/?TabItem\b[^>]*>/gi, ""))}\n\n`;
      }

      return `\n\n${items.join("\n\n")}\n\n`;
    }
  );

  md = md.replace(/<Steps\b[^>]*>([\s\S]*?)<\/Steps>/gi, (_, body) => {
    const stepDivRegex = /<div\b[^>]*>([\s\S]*?)<\/div>/gi;
    const stepItems: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = stepDivRegex.exec(body)) !== null) {
      stepItems.push(deindent(match[1]));
    }

    if (stepItems.length > 0) {
      return `\n\n${stepItems.join("\n\n")}\n\n`;
    }

    return `\n\n${deindent(body)}\n\n`;
  });

  md = md.replace(/<Figure\b([^>]*)\/?>/gi, (_, attrs) => {
    const src = extractAttribute(attrs, "src") || "";
    const alt = extractAttribute(attrs, "alt") || "";
    const caption = extractAttribute(attrs, "caption");

    let result = `![${alt}](${src})`;
    if (caption) {
      result += `\n*${caption}*`;
    }
    return `\n\n${result}\n\n`;
  });

  md = md.replace(/<YouTube\b([^>]*)\/?>/gi, (_, attrs) => {
    const id = extractAttribute(attrs, "id") || "";
    const start = extractAttribute(attrs, "start");
    const url = start
      ? `https://www.youtube.com/watch?v=${id}&t=${start}s`
      : `https://www.youtube.com/watch?v=${id}`;

    return `\n\n[Watch on YouTube](${url})\n\n`;
  });

  md = md.replace(/<LinkCard\b([^>]*)\/?>/gi, (_, attrs) => {
    const href = extractAttribute(attrs, "href") || "#";
    const title = extractAttribute(attrs, "title") || href;
    const description = extractAttribute(attrs, "description");

    const text = description ? `[${title}](${href}) — ${description}` : `[${title}](${href})`;
    return `\n\n${text}\n\n`;
  });

  md = md.replace(/<Badge\b([^>]*)\/?>/gi, (_, attrs) => {
    const content = extractAttribute(attrs, "content") || "";
    const href = extractAttribute(attrs, "href");

    return href ? `[${content}](${href})` : content;
  });

  md = md.replace(/<\/?(div|span|section|article)\b[^>]*>/gi, "");

  for (let i = 0; i < codeVault.length; i++) {
    md = md.replace(`%%CODE_BLOCK_${i}%%`, () => codeVault[i]);
    md = md.replace(`%%INLINE_CODE_${i}%%`, () => codeVault[i]);
  }

  md = md.replace(/\n{3,}/g, "\n\n").trim();

  return md;
}

export function buildCopyablePostContent({
  title,
  frontmatter,
  body,
}: PostContentOptions): string {
  const parts: string[] = [`# ${title}`];

  if (frontmatter && frontmatter.trim().length > 0) {
    parts.push(`> ${frontmatter.trim()}`);
  }

  const translatedBody = mdxToMarkdown(body || "");
  if (translatedBody.length > 0) {
    parts.push(translatedBody);
  }

  return parts.join("\n\n");
}
