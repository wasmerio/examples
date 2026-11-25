import { getPublishedPosts } from "@/utils/posts"
import { renderLlmsFullTxt } from "@/utils/agent-markdown"

export async function GET() {
  const posts = await getPublishedPosts()
  const payload = renderLlmsFullTxt(posts)
  const bytes = new TextEncoder().encode(`\uFEFF${payload}`)

  return new Response(bytes, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
