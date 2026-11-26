import { z } from "astro/zod";
import { CustomCalendar } from "./codex-calendar";
import { GameSystem } from "./binder-statblock";

export const LanguageCode = z.enum(["en", "it"]);
export type LanguageCode = z.infer<typeof LanguageCode>;

export const ProjectFrontmatter = z.object({
    title: z.string(),
    language: LanguageCode.default("en"),
    description: z.string().optional(),
    pinned: z.string().array().optional(),
    calendar: CustomCalendar.optional(),
    preferredGameSystem: GameSystem.optional(),
});
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatter>;
