import { z } from "astro/zod";
import type { ImageFunction } from "astro:content";
import { StatblockDND5eData } from "./statblocks/dnd5e";
import { StatblockShadowdarkData } from "./statblocks/shadowdark";
import { StatblockPathfinder1eData } from "./statblocks/pathfinder1e";
import { ImageOrUrl } from "./common";

export const GameSystem = z.enum(["dnd5e", "shadowdark", "pathfinder1e"]);
export type GameSystem = z.infer<typeof GameSystem>;

export const StatblockData = (image: ImageFunction) =>
    z.object({
        name: z.string(),
        description: z.string().optional(),
        image: ImageOrUrl(image).optional(),
        systems: z.object({
            dnd5e: StatblockDND5eData.optional(),
            shadowdark: StatblockShadowdarkData.optional(),
            pathfinder1e: StatblockPathfinder1eData.optional(),
        }),
    });
export type StatblockData = z.infer<ReturnType<typeof StatblockData>>;
