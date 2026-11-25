import type { ImageMetadata } from "astro";
import elenaMarch from "@/assets/authors/elena-march.jpg";
import miraIwasaki from "@/assets/authors/mira-iwasaki.jpg";
import samuelOkafor from "@/assets/authors/samuel-okafor.jpg";

export interface Author {
  /** What a post's `author` field refers to, and the URL: `/authors/<slug>/`. */
  slug: string;
  name: string;
  role: string;
  /** One line, shown under the author's name on articles and cards. */
  bio: string;
  /** The standfirst on the author's page. */
  longBio: string;
  avatar: ImageMetadata;
  photoCredit?: { name: string; url: string };
}

export const authors = [
  {
    slug: "elena-march",
    name: "Elena March",
    role: "Editor",
    bio: "Writer and editor covering design, craft, and slow technology.",
    longBio:
      "Elena March writes about the quiet edges of design and technology. Previously an editor at two small magazines, she now publishes essays and field notes from a desk overlooking the harbour.",
    avatar: elenaMarch,
    photoCredit: {
      name: "Augusto Carneiro Junior / Pexels",
      url: "https://www.pexels.com/photo/30479371/",
    },
  },
  {
    slug: "samuel-okafor",
    name: "Samuel Okafor",
    role: "Contributing writer",
    bio: "Software engineer with a soft spot for typography and the open web.",
    longBio:
      "Samuel builds tools for writers and reads more than he ships. He believes the best interfaces are the ones you don't notice.",
    avatar: samuelOkafor,
    photoCredit: {
      name: "Vincent Santamaria / Pexels",
      url: "https://www.pexels.com/photo/37148308/",
    },
  },
  {
    slug: "mira-iwasaki",
    name: "Mira Iwasaki",
    role: "Contributing photographer",
    bio: "Photographer and essayist based between Kyoto and Lisbon.",
    longBio:
      "Mira's work sits at the intersection of place, memory, and the everyday object. Her essays have appeared in a number of small but loved publications.",
    avatar: miraIwasaki,
    photoCredit: {
      name: "Tran Nhu Tuan / Pexels",
      url: "https://www.pexels.com/photo/29995646/",
    },
  },
] as const satisfies readonly Author[];

export type AuthorSlug = (typeof authors)[number]["slug"];
