import type { CollectionEntry } from "astro:content";
import path from "path";

export function sortMDByDate(posts: CollectionEntry<"blog">[] = []) {
  return posts.sort(
    (a, b) =>
      new Date(b.data.publishDate).valueOf() -
      new Date(a.data.publishDate).valueOf()
  );
}

export function getBlogImage(slug: string, fileName: string) {
  const filename = path.parse(fileName);
  const name = filename.name;
  const ext = filename.ext;

  switch (ext) {
    case ".webp":
      return import(`../content/blog/${slug}/${name}.webp`);
    case ".jpg":
      return import(`../content/blog/${slug}/${name}.jpg`);
    case ".png":
      return import(`../content/blog/${slug}/${name}.png`);
    case ".svg":
      return import(`../content/blog/${slug}/${name}.svg`);
    case ".gif":
      return import(`../content/blog/${slug}/${name}.gif`);
    case ".avif":
      return import(`../content/blog/${slug}/${name}.avif`);
    case ".jpeg":
      return import(`../content/blog/${slug}/${name}.jpeg`);
    default:
      return import(`../content/blog/${slug}/${name}.jpg`);
  }
}
