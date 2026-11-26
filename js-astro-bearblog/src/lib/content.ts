import type { CollectionEntry } from "astro:content";
import { SITE_DESCRIPTION } from "../consts";

export function getPostUrl(post: CollectionEntry<"blog">): string {
  return `/blog/${post.id}/`;
}

export function getDescription(entry: CollectionEntry<"blog">): string {
  return entry.data.description || excerpt(entry.body) || SITE_DESCRIPTION;
}

export function excerpt(markdown = "", length = 157): string {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!?(\[[^\]]*\])\([^)]*\)/g, "$1")
    .replace(/[*_~`>#|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return "";
  return plainText.length > length ? `${plainText.slice(0, length - 1).trimEnd()}…` : plainText;
}

export function isPublished(post: CollectionEntry<"blog">): boolean {
  return !post.data.draft && post.data.pubDate <= new Date();
}

export function tagPath(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}/`;
}
