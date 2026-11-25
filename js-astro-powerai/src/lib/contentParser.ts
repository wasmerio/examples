// Content parser utilities for Astro
// In Astro, we use getCollection/getEntry from astro:content
// This file provides helper functions that map the old API to the new one

import { getCollection, getEntry } from "astro:content";

/**
 * Get a list/index page data (e.g., homepage/_index.md, sections/call-to-action.md)
 */
export async function getListPage(filePath: string) {
  // Parse the filepath to get collection and slug
  // e.g. "homepage/_index.md" -> collection: "homepage", slug: "-index"
  // e.g. "sections/call-to-action.md" -> collection: "sections", slug: "call-to-action"
  const parts = filePath.split("/");
  const collection = parts[0] as any;
  let slug = parts.slice(1).join("/").replace(".md", "").replace(".mdx", "");
  
  // Convert _index to -index for Astro naming convention
  slug = slug.replace("_index", "-index");
  
  try {
    const entry = await getEntry(collection, slug);
    if (!entry) {
      return { frontmatter: {}, content: "" };
    }
    
    return {
      frontmatter: entry.data as any,
      content: entry.body || "",
    };
  } catch {
    return { frontmatter: {}, content: "" };
  }
}

/**
 * Get all single pages from a collection folder
 */
export async function getSinglePage(folder: string) {
  try {
    const allEntries = await getCollection(folder as any);
    
    // Filter out index pages and drafts
    const singlePages = allEntries
      .filter((entry: any) => !entry.id.startsWith("-"))
      .filter((entry: any) => !entry.data?.draft)
      .map((entry: any) => ({
        frontmatter: entry.data,
        slug: entry.data?.url || entry.id.replace(/\.(md|mdx)$/, ""),
        content: entry.body || "",
      }));
    
    // Filter by date
    const filterByDate = singlePages.filter(
      (page: any) => new Date(page.frontmatter.date || new Date()) <= new Date(),
    );
    
    return filterByDate;
  } catch {
    return [];
  }
}
