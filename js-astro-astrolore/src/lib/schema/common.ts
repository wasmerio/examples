import { z } from "astro/zod";
import type { ImageFunction } from "astro:content";

export const ImageOrUrl = (image: ImageFunction) => z.union([image(), z.url()]);
