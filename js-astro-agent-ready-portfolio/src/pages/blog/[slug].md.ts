import type { APIRoute, GetStaticPaths } from "astro";
import { postMarkdown } from "$lib/content/agent-markdown";
import { blogEntries, type BlogEntry } from "$lib/content/blog";

export const getStaticPaths = (() =>
  blogEntries.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }))) satisfies GetStaticPaths;

// The post as plain markdown, for agents and "Copy as Markdown".
export const GET: APIRoute<{ entry: BlogEntry }> = ({ props: { entry } }) =>
  new Response(postMarkdown(entry), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
