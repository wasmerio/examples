import Audio from "@/components/content/Audio.astro";
import Bookmark from "@/components/content/Bookmark.astro";
import Callout from "@/components/content/Callout.astro";
import Figure from "@/components/content/Figure.astro";
import FileCard from "@/components/content/FileCard.astro";
import Toggle from "@/components/content/Toggle.astro";

/**
 * Every block an issue can use, handed to MDX through `<Content components />`.
 *
 * This is what lets an MDX issue skip the imports at the top of the file: MDX
 * resolves a capitalised tag against this map, so writing `<Callout ... />` in
 * an issue just works. A file that imports a component by hand still wins, so
 * nothing here overrides what a writer wrote.
 *
 * See `/styleguide/` for what each one looks like and the props it takes.
 */
export const issueComponents = {
  Audio,
  Bookmark,
  Callout,
  Figure,
  FileCard,
  Toggle,
};
