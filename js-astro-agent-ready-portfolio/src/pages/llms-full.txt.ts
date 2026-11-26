import { blogPostsMarkdown, fullMarkdown } from "$lib/agent/knowledge";


export const GET = () =>
  new Response(`${[fullMarkdown(), blogPostsMarkdown()].filter(Boolean).join("\n\n---\n\n")}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
