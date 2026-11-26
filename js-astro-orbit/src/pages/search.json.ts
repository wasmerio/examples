import { getCollection } from "astro:content";
import { withBase } from "../config";

export async function GET() {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const index = [
    ...projects.map((project) => ({
      kind: "Project",
      title: project.data.title,
      description: project.data.summary,
      href: withBase(`/work/${project.id}/`),
      terms: [project.data.category, ...project.data.stack].join(" "),
    })),
    ...posts.map((post) => ({
      kind: "Blog",
      title: post.data.title,
      description: post.data.description,
      href: withBase(`/blog/${post.id}/`),
      terms: post.data.tags.join(" "),
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
}
