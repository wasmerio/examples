/** Shared by the layout helpers (Stack, Grid, Split): the space between children, as a spacing role. */
export type LayoutGap = "item" | "blocks" | "section";

/** The gap class for each spacing role (theme.css: --ui-space-item, --ui-space-block, --ui-space-section). */
export const layoutGap: Record<LayoutGap, string> = { item: "gap-item", blocks: "gap-blocks", section: "gap-section" };

/**
 * The same spacing roles as CSS values, for a helper that needs the gap inside its own math (Grid's column width).
 * Each has theme.css's fallback, since the role tokens are optional.
 */
export const layoutGapValue: Record<LayoutGap, string> = {
	item: "var(--ui-space-item, calc(var(--ui-space) * 2.5))",
	blocks: "var(--ui-space-block, calc(var(--ui-space) * 8))",
	section: "var(--ui-space-section, clamp(calc(var(--ui-space) * 16), calc(var(--ui-space) * 8 + 8vw), calc(var(--ui-space) * 32)))",
};
