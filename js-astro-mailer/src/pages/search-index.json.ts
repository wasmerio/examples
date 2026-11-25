import { getCollection } from "astro:content";
import { searchItems } from "@/lib/search";

export async function GET() {
  const index = searchItems(await getCollection("issues"));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
