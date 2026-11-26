import { getCollection } from 'astro:content';

/* Collection access that tolerates an adopter who never defined (or has no
   entries in) a collection: returns [] instead of undefined. Sites that
   replace part of the content model should also disable the matching
   injected route (popular({ routes: { venues: false } })), which silences
   Astro's missing-collection warning entirely. */
export async function safeCollection(name: string): Promise<any[]> {
  try {
    return ((await getCollection(name as any)) as any[]) ?? [];
  } catch {
    return [];
  }
}
