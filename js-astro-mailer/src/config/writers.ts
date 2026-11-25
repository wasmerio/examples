import type { ImageMetadata } from "astro";
import irisNovak from "@/assets/writers/iris-novak.jpg";
import leahMorgan from "@/assets/writers/leah-morgan.jpg";
import maraChen from "@/assets/writers/mara-chen.jpg";
import samPatel from "@/assets/writers/sam-patel.jpg";

/**
 * Writer profiles, keyed by the `author.name` in issue frontmatter. A name with
 * no entry still works — it falls back to a monogram avatar and an empty bio.
 *
 * The bundled portraits are Unsplash placeholders of models with no connection
 * to these fictional bylines. Replace them before you publish.
 */
export interface WriterProfile {
  bio: string;
  image: ImageMetadata;
  creditName: string;
  creditUrl: string;
}

export const writerProfiles: Record<string, WriterProfile> = {
  "Mara Chen": {
    bio: "Edits Mailer and writes most of the craft pieces. Ran a books newsletter for six years before this one and still thinks the hardest part of any issue is the last paragraph.",
    image: maraChen,
    creditName: "Ayo Ogunseinde",
    creditUrl: "https://unsplash.com/photos/8VghbLlZUdQ",
  },
  "Iris Novak": {
    bio: "Covers the plumbing: sending infrastructure, deliverability, and the analytics dashboards that promise more than they can measure. Reads DMARC reports voluntarily.",
    image: irisNovak,
    creditName: "Ryan Hoffman",
    creditUrl: "https://unsplash.com/photos/2QDYXAEfFPk",
  },
  "Sam Patel": {
    bio: "Writes about audience: where readers come from, why they leave, and which growth tactics survive contact with a real list.",
    image: samPatel,
    creditName: "Junior REIS",
    creditUrl: "https://unsplash.com/photos/p98UJsuyVRU",
  },
  "Leah Morgan": {
    bio: "Runs the interviews. Prefers writers who have been at it long enough to be honest about the boring parts.",
    image: leahMorgan,
    creditName: "Cemrecan Yurtman",
    creditUrl: "https://unsplash.com/photos/ih03D0F6M6M",
  },
};

export const writerProfile = (name: string): WriterProfile | undefined => writerProfiles[name];

export const writerBio = (name: string): string => writerProfiles[name]?.bio ?? "";
