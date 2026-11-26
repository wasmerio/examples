import { z } from "astro/zod";

const DocumentType = z.enum(["generic", "diary", "letter"]);
export type DocumentKind = z.infer<typeof DocumentType>;

export const DocumentFrontmatter = z.object({
    kind: DocumentType.default("generic"),
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
});
export type DocumentFrontmatter = z.infer<typeof DocumentFrontmatter>;
