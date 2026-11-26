import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export const getAllLogs = async (): Promise<CollectionEntry<"log">[]> => {
  const logs = await getCollection("log");
  return logs.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
};
