import type { APIRoute } from "astro"
import { siteConfig } from "@/config/site"
import { getPosts, readingTime, summaryOf } from "@/lib/posts"
import { formatDate } from "@/lib/date"
import { url } from "@/lib/url"

function plain(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export const GET: APIRoute = async () => {
  // With search off the index stays empty rather than 404-ing the request.
  if (!siteConfig.search.enabled) {
    return new Response("[]", {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    })
  }

  const posts = await getPosts()
  const limit = siteConfig.search.indexContentLength

  const records = posts.map((post) => ({
    title: post.data.title,
    summary: summaryOf(post),
    content: plain(post.body ?? "").slice(0, limit),
    permalink: url(`/posts/${post.id}/`),
    section: "posts",
    date: formatDate(post.data.date),
    readingTime: readingTime(post.body ?? ""),
    tags: post.data.tags,
    categories: post.data.categories,
  }))

  return new Response(JSON.stringify(records), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}
