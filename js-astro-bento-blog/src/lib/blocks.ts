import { BLOCK_BACKGROUND_COLORS, BLOCK_TEXT_COLORS } from "./color-palette";
export type TextAlign = "left" | "center" | "right";
export type HeadingLevel = 1 | 2 | 3;

export type TextAnnotation = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
};

export type RichText = {
  text: string;
  href?: string;
  annotations?: TextAnnotation;
  textColor?: string;
  backgroundColor?: string;
};

export type BaseBlock = {
  id: string;
  type: string;
  children?: Block[];
  textColor?: string;
  backgroundColor?: string;
  align?: TextAlign;
  metadata?: Record<string, unknown>;
};

export type ParagraphBlock = BaseBlock & {
  type: "paragraph";
  richText: RichText[];
};

export type HeadingBlock = BaseBlock & {
  type: "heading";
  level: HeadingLevel;
  richText: RichText[];
};

export type ListBlock = BaseBlock & {
  type: "bulleted_list" | "numbered_list";
  richText: RichText[];
};

export type TodoBlock = BaseBlock & {
  type: "todo";
  checked: boolean;
  richText: RichText[];
};

export type QuoteBlock = BaseBlock & {
  type: "quote";
  richText: RichText[];
};

export type CalloutBlock = BaseBlock & {
  type: "callout";
  icon?: string;
  richText: RichText[];
};

export type ToggleBlock = BaseBlock & {
  type: "toggle";
  richText: RichText[];
  isOpen?: boolean;
};

export type CodeBlock = BaseBlock & {
  type: "code";
  language?: string;
  code: string;
};

export type DividerBlock = BaseBlock & {
  type: "divider";
};

export type ImageBlock = BaseBlock & {
  type: "image";
  src: string;
  alt: string;
  caption?: RichText[];
  isHeroImage?: boolean;
  displayWidth?: number;
};

export type BookmarkBlock = BaseBlock & {
  type: "bookmark";
  url: string;
  title: string;
  description?: string;
};

export type EquationBlock = BaseBlock & {
  type: "equation";
  equation: string;
};

export type TableOfContentsBlock = BaseBlock & {
  type: "table_of_contents";
};

export type ContextBlock = BaseBlock & {
  type: "context";
  title: string;
  richText: RichText[];
};

export type TableCell = {
  richText: RichText[];
  align?: TextAlign;
};

export type TableBlock = BaseBlock & {
  type: "table";
  hasHeaderRow?: boolean;
  rows: TableCell[][];
};

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | TodoBlock
  | QuoteBlock
  | CalloutBlock
  | ToggleBlock
  | CodeBlock
  | DividerBlock
  | ImageBlock
  | BookmarkBlock
  | EquationBlock
  | TableOfContentsBlock
  | ContextBlock
  | TableBlock;

export function getRichTextPlainText(richText: RichText[] = []): string {
  return richText.map((part) => part.text).join("");
}

export function getBlockText(block: Block): string {
  switch (block.type) {
    case "code":
      return block.code;
    case "divider":
      return "";
    case "equation":
      return block.equation;
    case "image":
      return block.caption ? getRichTextPlainText(block.caption) : block.alt;
    case "bookmark":
      return [block.title, block.description, block.url].filter(Boolean).join(" ");
    case "table":
      return block.rows
        .map((row) => row.map((cell) => getRichTextPlainText(cell.richText)).join(" "))
        .join(" ");
    default: {
      const ownText = "richText" in block ? getRichTextPlainText(block.richText) : "";
      const childText = block.children?.map(getBlockText).join(" ") ?? "";
      return [ownText, childText].filter(Boolean).join(" ");
    }
  }
}

export function resolveTextColor(color?: string): string | undefined {
  return color ? BLOCK_TEXT_COLORS[color as keyof typeof BLOCK_TEXT_COLORS] ?? color : undefined;
}

export function resolveBackgroundColor(color?: string): string | undefined {
  return color
    ? BLOCK_BACKGROUND_COLORS[color as keyof typeof BLOCK_BACKGROUND_COLORS] ?? color
    : undefined;
}

export function resolveBlockColor(color?: string): string | undefined {
  return resolveTextColor(color);
}
