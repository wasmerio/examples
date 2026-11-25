import type { CollectionEntry } from "astro:content";

export type Blog = CollectionEntry<"blog">;
export type Note = CollectionEntry<"notes">;
export type Bookmark = CollectionEntry<"bookmarks">;
export type Project = CollectionEntry<"projects">;
export type Experience = CollectionEntry<"experience">; 