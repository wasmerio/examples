import { getSortedPosts } from "@/utils/posts";
import { withBase } from "@/utils/url";

export async function GET() {
  const posts = await getSortedPosts();
  const index = posts.map((p) => ({
    id: p.id,
    url: withBase(`/posts/${p.id}`),
    title: p.data.title,
    description: p.data.description,
    tags: p.data.tags,
    category: p.data.category,
    body: (p.body ?? "")
      .replace(/[#>*`\-\[\]]/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 2000),
  }));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json" } });
}
