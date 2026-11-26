import type { RichText, TableCell, TextAnnotation } from "./blocks";
import { BLOCK_BACKGROUND_COLORS, BLOCK_TEXT_COLORS } from "./color-palette";

export type InlineMark = keyof TextAnnotation;

export type EditorBlockType =
  | "paragraph"
  | "heading"
  | "bulleted_list"
  | "numbered_list"
  | "todo"
  | "toggle"
  | "quote"
  | "callout"
  | "code"
  | "divider"
  | "image"
  | "bookmark"
  | "equation"
  | "table"
  | "table_of_contents"
  | "context";

export type EditorBlock = {
  id: string;
  type: EditorBlockType;
  richText?: RichText[];
  level?: 1 | 2 | 3;
  checked?: boolean;
  isOpen?: boolean;
  icon?: string;
  language?: string;
  code?: string;
  equation?: string;
  src?: string;
  alt?: string;
  caption?: RichText[];
  isHeroImage?: boolean;
  displayWidth?: number;
  url?: string;
  title?: string;
  description?: string;
  rows?: TableCell[][];
  hasHeaderRow?: boolean;
  backgroundColor?: string;
  textColor?: string;
  children?: EditorBlock[];
};

export type EditorMeta = {
  title: string;
  slug: string;
  description: string;
  pubDate: string;
  category: string;
  tags: string;
  status: string[];
};

export type EditorPageAppearance = {
  icon?: string;
  cover?: {
    type: "color" | "image";
    value: string;
    position?: number;
  };
};

export type EditorDocument = {
  version: 2;
  meta: EditorMeta;
  page: EditorPageAppearance;
  blocks: EditorBlock[];
};

const BOOLEAN_MARKS: InlineMark[] = ["bold", "italic", "underline", "strike", "code"];

const INLINE_TEXT_COLORS: Record<string, string> = BLOCK_TEXT_COLORS;
const INLINE_BACKGROUND_COLORS: Record<string, string> = BLOCK_BACKGROUND_COLORS;

export function createId(): string {
  return `block-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createRichText(text = ""): RichText[] {
  return text ? [{ text }] : [];
}

function normalizedAnnotations(value: unknown): TextAnnotation | undefined {
  if (!value || typeof value !== "object") return undefined;
  const source = value as Record<string, unknown>;
  const annotations = Object.fromEntries(
    BOOLEAN_MARKS.filter((mark) => source[mark] === true).map((mark) => [mark, true]),
  ) as TextAnnotation;
  return Object.keys(annotations).length ? annotations : undefined;
}

function segmentStyleKey(part: RichText): string {
  return JSON.stringify({
    href: part.href ?? "",
    annotations: part.annotations ?? {},
    textColor: part.textColor ?? "",
    backgroundColor: part.backgroundColor ?? "",
  });
}

export function normalizeRichText(value: unknown, fallbackText = ""): RichText[] {
  const parts = Array.isArray(value)
    ? value
        .map((raw) => {
          if (!raw || typeof raw !== "object") return null;
          const source = raw as Record<string, unknown>;
          const text = String(source.text ?? "");
          if (!text) return null;
          const part: RichText = { text };
          const annotations = normalizedAnnotations(source.annotations);
          if (annotations) part.annotations = annotations;
          if (typeof source.href === "string" && source.href) part.href = source.href;
          if (typeof source.textColor === "string" && source.textColor) part.textColor = source.textColor;
          if (typeof source.backgroundColor === "string" && source.backgroundColor) {
            part.backgroundColor = source.backgroundColor;
          }
          return part;
        })
        .filter((part): part is RichText => Boolean(part))
    : createRichText(fallbackText);

  return mergeRichText(parts);
}

export function mergeRichText(value: RichText[]): RichText[] {
  const merged: RichText[] = [];
  value.forEach((part) => {
    if (!part.text) return;
    const normalized = normalizeRichTextPart(part);
    const previous = merged.at(-1);
    if (previous && segmentStyleKey(previous) === segmentStyleKey(normalized)) {
      previous.text += normalized.text;
    } else {
      merged.push(normalized);
    }
  });
  return merged;
}

function normalizeRichTextPart(part: RichText): RichText {
  const normalized: RichText = { text: String(part.text ?? "") };
  const annotations = normalizedAnnotations(part.annotations);
  if (annotations) normalized.annotations = annotations;
  if (part.href) normalized.href = part.href;
  if (part.textColor) normalized.textColor = part.textColor;
  if (part.backgroundColor) normalized.backgroundColor = part.backgroundColor;
  return normalized;
}

export function getRichTextPlainText(value: RichText[] = []): string {
  return value.map((part) => part.text).join("");
}

function mutateRange(
  value: RichText[],
  start: number,
  end: number,
  mutate: (part: RichText) => RichText,
): RichText[] {
  const total = getRichTextPlainText(value).length;
  const safeStart = Math.max(0, Math.min(start, total));
  const safeEnd = Math.max(safeStart, Math.min(end, total));
  if (safeStart === safeEnd) return value;

  let offset = 0;
  const result: RichText[] = [];
  value.forEach((part) => {
    const partStart = offset;
    const partEnd = offset + part.text.length;
    offset = partEnd;
    if (partEnd <= safeStart || partStart >= safeEnd) {
      result.push(part);
      return;
    }

    const localStart = Math.max(0, safeStart - partStart);
    const localEnd = Math.min(part.text.length, safeEnd - partStart);
    if (localStart > 0) result.push({ ...part, text: part.text.slice(0, localStart) });
    result.push(mutate({ ...part, text: part.text.slice(localStart, localEnd) }));
    if (localEnd < part.text.length) result.push({ ...part, text: part.text.slice(localEnd) });
  });

  return mergeRichText(result);
}

export function rangeHasMark(value: RichText[], start: number, end: number, mark: InlineMark): boolean {
  let offset = 0;
  let found = false;
  let allMarked = true;
  value.forEach((part) => {
    const partStart = offset;
    const partEnd = offset + part.text.length;
    offset = partEnd;
    if (partEnd <= start || partStart >= end) return;
    found = true;
    if (!part.annotations?.[mark]) allMarked = false;
  });
  return found && allMarked;
}

export function toggleInlineMark(
  value: RichText[],
  start: number,
  end: number,
  mark: InlineMark,
): RichText[] {
  const enabled = !rangeHasMark(value, start, end, mark);
  return mutateRange(value, start, end, (part) => {
    const annotations = { ...(part.annotations ?? {}) };
    if (enabled) annotations[mark] = true;
    else delete annotations[mark];
    return {
      ...part,
      annotations: Object.keys(annotations).length ? annotations : undefined,
    };
  });
}

export function applyInlineTextColor(
  value: RichText[],
  start: number,
  end: number,
  color?: string,
): RichText[] {
  return mutateRange(value, start, end, (part) => {
    const next = { ...part };
    if (color && color !== "default" && color !== "clear") next.textColor = color;
    else delete next.textColor;
    return next;
  });
}

export function applyInlineHref(
  value: RichText[],
  start: number,
  end: number,
  href?: string,
): RichText[] {
  return mutateRange(value, start, end, (part) => {
    const next = { ...part };
    if (href) next.href = href;
    else delete next.href;
    return next;
  });
}

export function sliceRichText(value: RichText[], start: number, end?: number): RichText[] {
  const total = getRichTextPlainText(value).length;
  const safeStart = Math.max(0, Math.min(start, total));
  const safeEnd = Math.max(safeStart, Math.min(end ?? total, total));
  let offset = 0;
  const result: RichText[] = [];
  value.forEach((part) => {
    const partStart = offset;
    const partEnd = offset + part.text.length;
    offset = partEnd;
    if (partEnd <= safeStart || partStart >= safeEnd) return;
    const localStart = Math.max(0, safeStart - partStart);
    const localEnd = Math.min(part.text.length, safeEnd - partStart);
    result.push({ ...part, text: part.text.slice(localStart, localEnd) });
  });
  return mergeRichText(result);
}

export function rangeTextColor(value: RichText[], start: number, end: number): string {
  let offset = 0;
  let active: string | undefined;
  let mixed = false;
  value.forEach((part) => {
    const partStart = offset;
    const partEnd = offset + part.text.length;
    offset = partEnd;
    if (partEnd <= start || partStart >= end) return;
    const color = part.textColor ?? "default";
    if (active === undefined) active = color;
    else if (active !== color) mixed = true;
  });
  return mixed ? "" : active ?? "default";
}

export function richTextToHtml(value: RichText[] = []): string {
  return value
    .map((part, index) => {
      const classes = [
        "editor-rich-segment",
        part.annotations?.bold && "is-bold",
        part.annotations?.italic && "is-italic",
        part.annotations?.underline && "is-underline",
        part.annotations?.strike && "is-strike",
        part.annotations?.code && "is-code",
      ]
        .filter(Boolean)
        .join(" ");
      const color = part.textColor ? INLINE_TEXT_COLORS[part.textColor] ?? part.textColor : "";
      const background = part.backgroundColor
        ? INLINE_BACKGROUND_COLORS[part.backgroundColor] ?? part.backgroundColor
        : "";
      const styles = [color && `color:${escapeHtml(color)}`, background && `background:${escapeHtml(background)}`]
        .filter(Boolean)
        .join(";");
      const style = styles ? ` style="${styles}"` : "";
      const textColor = part.textColor ? ` data-text-color="${escapeHtml(part.textColor)}"` : "";
      const backgroundColor = part.backgroundColor
        ? ` data-background-color="${escapeHtml(part.backgroundColor)}"`
        : "";
      const href = part.href ? ` data-href="${escapeHtml(part.href)}"` : "";
      const linkClass = part.href ? " is-link" : "";
      return `<span class="${classes}${linkClass}" data-rich-segment="${index}"${style}${textColor}${backgroundColor}${href}>${escapeHtml(part.text)}</span>`;
    })
    .join("");
}

export function normalizeTableRows(value: unknown): TableCell[][] {
  const source = Array.isArray(value) && value.length
    ? value
    : [
        ["Item", "Value", "Note"],
        ["", "", ""],
        ["", "", ""],
      ];
  const width = Math.max(
    1,
    ...source.map((row) => (Array.isArray(row) ? row.length : 0)),
  );

  return source.map((rawRow) => {
    const row = Array.isArray(rawRow) ? rawRow : [];
    return Array.from({ length: width }, (_, index) => {
      const rawCell = row[index];
      if (typeof rawCell === "string") return { richText: createRichText(rawCell) };
      if (rawCell && typeof rawCell === "object") {
        const cell = rawCell as Record<string, unknown>;
        return {
          richText: normalizeRichText(cell.richText, String(cell.text ?? "")),
          ...(cell.align === "center" || cell.align === "right" ? { align: cell.align } : {}),
        } as TableCell;
      }
      return { richText: [] };
    });
  });
}

export function createEditorBlock(
  type: EditorBlockType = "paragraph",
  text = "",
  options: Partial<EditorBlock> = {},
): EditorBlock {
  const block: EditorBlock = { id: createId(), type, ...options };
  if (isRichTextBlock(type)) block.richText = normalizeRichText(options.richText, text);
  if (type === "toggle") {
    block.isOpen = options.isOpen === true;
    if (!Object.hasOwn(options, "children")) block.children = [createEditorBlock("paragraph")];
  }
  if (type === "heading") block.level = options.level ?? 1;
  if (type === "todo") block.checked = options.checked ?? false;
  if (type === "callout") block.icon = options.icon ?? "i";
  if (type === "code") {
    block.language = options.language ?? "text";
    block.code = options.code ?? text;
  }
  if (type === "equation") block.equation = (options.equation ?? text) || "E = mc^2";
  if (type === "image") {
    block.src = options.src ?? "";
    block.alt = options.alt ?? "";
    block.caption = normalizeRichText(options.caption);
  }
  if (type === "bookmark") {
    block.url = options.url ?? "https://example.com";
    block.title = (options.title ?? text) || "Bookmark";
    block.description = options.description ?? "";
  }
  if (type === "table") {
    block.rows = normalizeTableRows(options.rows);
    block.hasHeaderRow = options.hasHeaderRow ?? true;
  }
  if (type === "context") {
    block.title = options.title ?? "Context";
    block.richText = normalizeRichText(options.richText, text);
    block.backgroundColor = options.backgroundColor ?? "blue";
  }
  return block;
}

export function isRichTextBlock(type: EditorBlockType): boolean {
  return [
    "paragraph",
    "heading",
    "bulleted_list",
    "numbered_list",
    "todo",
    "toggle",
    "quote",
    "callout",
    "context",
  ].includes(type);
}

export function blockPlainText(block: EditorBlock): string {
  if (isRichTextBlock(block.type)) return getRichTextPlainText(block.richText);
  if (block.type === "code") return block.code ?? "";
  if (block.type === "equation") return block.equation ?? "";
  return "";
}

export function escapeHtml(value = ""): string {
  return String(value).replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char,
  );
}
