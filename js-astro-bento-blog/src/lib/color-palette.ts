export type BlockColorName =
  | "default"
  | "gray"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "teal";

export type BlockColorOption = {
  value: BlockColorName;
  label: string;
  text: string;
  background: string;
};

export const BLOCK_COLOR_PALETTE: readonly BlockColorOption[] = [
  { value: "default", label: "기본", text: "#45474b", background: "#ffffff" },
  { value: "gray", label: "회색", text: "#5f6368", background: "#f1f3f4" },
  { value: "brown", label: "갈색", text: "#7a5c4f", background: "#f4eeee" },
  { value: "red", label: "빨간색", text: "#a4473f", background: "#faeceb" },
  { value: "orange", label: "주황색", text: "#a85f16", background: "#fbecdd" },
  { value: "yellow", label: "노란색", text: "#80620b", background: "#fff4cc" },
  { value: "green", label: "초록색", text: "#2f6f4e", background: "#edf3ec" },
  { value: "blue", label: "파란색", text: "#27679b", background: "#eaf4ff" },
  { value: "purple", label: "보라색", text: "#72549a", background: "#f3eefd" },
  { value: "pink", label: "분홍색", text: "#9a4d70", background: "#fbeaf2" },
  { value: "teal", label: "청록색", text: "#1f6f68", background: "#e7f6f4" },
];

export const BLOCK_TEXT_COLORS: Record<BlockColorName, string> = Object.fromEntries(
  BLOCK_COLOR_PALETTE.map(({ value, text }) => [value, value === "default" ? "inherit" : text]),
) as Record<BlockColorName, string>;

export const BLOCK_BACKGROUND_COLORS: Record<BlockColorName, string> = Object.fromEntries(
  BLOCK_COLOR_PALETTE.map(({ value, background }) => [value, value === "default" ? "transparent" : background]),
) as Record<BlockColorName, string>;