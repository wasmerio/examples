import { z } from "astro/zod";

const HandoutKind = z.enum(["generic", "guide", "book", "newspaper"]);
export type HandoutKind = z.infer<typeof HandoutKind>;

export const HandoutData = z.object({
    title: z.string(),
    kind: HandoutKind.default("generic"),
    description: z.string().optional(),
    file: z.string(),
});
export type HandoutData = z.infer<typeof HandoutData>;
