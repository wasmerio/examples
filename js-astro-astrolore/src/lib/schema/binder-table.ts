import { z } from "astro/zod";

export const TableItem = z.object({
    weight: z.number().int().positive().default(1),
    value: z.string(),
});
export type TableItem = z.infer<typeof TableItem>;

export const TableData = z.object({
    title: z.string(),
    caption: z.string().optional(),
    tags: z.string().array().optional(),
    header: z.string(),
    items: TableItem.array(),
});
export type TableData = z.infer<typeof TableData>;
