import { getCollection } from "astro:content";
import { calcReadTime } from "../utils/reading-time";

export async function GET() {
  const entries = await getCollection("post");
  const posts = entries.filter((e) => !e.data.draft);

  const searchIndex = posts.map((entry) => ({
    title: entry.data.title,
    date: entry.data.date,
    frontmatter: entry.data.frontmatter,
    tags: entry.data.tags,
    link: `/posts/${entry.id}`,
    readTime: calcReadTime(entry.body ?? ""),
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
