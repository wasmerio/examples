import { z } from "astro/zod";

export const CategoryFrontmatter = z.object({
    title: z.string(),
});
export type CategoryFrontmatter = z.infer<typeof CategoryFrontmatter>;
