import { z } from "astro/zod";

export const contentTextSchema = z.string().trim().min(1);
