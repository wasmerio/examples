import { z } from "astro/zod";
import type { ImageFunction } from "astro:content";
import { ImageOrUrl } from "./common";

const MapMarker = z.object({
    x: z.number(),
    y: z.number(),
    label: z.string().optional(),
    link: z.string().optional(),
});
export type MapMarker = z.infer<typeof MapMarker>;

export const MapImageSchema = (image: ImageFunction) =>
    z.object({
        name: z.string().optional(),
        caption: z.string().optional(),
        description: z.string().optional(),
        image: ImageOrUrl(image),
        markers: MapMarker.array().optional(),
    });
