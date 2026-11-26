import { z } from "astro/zod";

export const TimelineData = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
});
