import { z } from "astro/zod";

export const CustomCalendar = z.object({
    week: z
        .object({
            name: z.string(),
            short: z.string().optional(),
        })
        .array()
        .optional(),
    year: z
        .object({
            seasons: z
                .object({
                    name: z.string(),
                    start: z.string(),
                })
                .array()
                .optional(),
            months: z
                .object({
                    name: z.string(),
                    description: z.string().optional(),
                    days: z.number(),
                })
                .array()
                .optional(),
        })
        .optional(),
    splits: z
        .object({
            pre: z.object({
                name: z.string(),
                short: z.string(),
            }),
            post: z.object({
                name: z.string(),
                short: z.string(),
            }),
        })
        .optional(),
    events: z
        .object({
            name: z.string(),
            date: z.string(),
        })
        .array()
        .optional(),
});
export type CustomCalendar = z.infer<typeof CustomCalendar>;
