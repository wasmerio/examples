/** Shared types and small helpers for every theme. No CMS imports. */
export type { OutlineItem } from "./outline.ts";

/** "1 post", "3 posts". */
export const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
