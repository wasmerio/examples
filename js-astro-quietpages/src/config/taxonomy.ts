export interface Term {
  slug: string;
  name: string;
}

export interface Category extends Term {
  description: string;
}

/** Order matters: the homepage and footer list sections in this order. */
export const categories = [
  {
    slug: "essays",
    name: "Essays",
    description: "Long-form arguments about writing, reading, and making things for the web.",
  },
  {
    slug: "design",
    name: "Design",
    description: "Typography, interfaces, and the small decisions that make a page feel calm.",
  },
  {
    slug: "engineering",
    name: "Engineering",
    description: "Building tools that get out of the way, written for people who ship.",
  },
  {
    slug: "field-notes",
    name: "Field Notes",
    description: "Dispatches from walks, harbours, and the places where ideas start.",
  },
  {
    slug: "interviews",
    name: "Interviews",
    description: "Conversations with people who make things slowly and with their hands.",
  },
] as const satisfies readonly Category[];

export const tags = [
  { slug: "writing", name: "Writing" },
  { slug: "typography", name: "Typography" },
  { slug: "minimalism", name: "Minimalism" },
  { slug: "tools", name: "Tools" },
  { slug: "travel", name: "Travel" },
  { slug: "process", name: "Process" },
  { slug: "web", name: "Web" },
  { slug: "books", name: "Books" },
] as const satisfies readonly Term[];

export type CategorySlug = (typeof categories)[number]["slug"];
export type TagSlug = (typeof tags)[number]["slug"];
