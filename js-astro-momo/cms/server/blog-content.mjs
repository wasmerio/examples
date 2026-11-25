// blog-content.mjs — 文章文件夹内的静态资源（预览图片等）
import { Hono } from 'hono'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { safeRel, blogPath } from './store.mjs'

const MIME = {
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
}

const blogContent = new Hono()

// GET /blog-content/<相对路径>
blogContent.get('/*', async (c) => {
  const rel = safeRel(decodeURIComponent(c.req.path.slice('/blog-content/'.length)))
  if (!rel) return c.json({ error: '无效路径' }, 400)
  const file = blogPath(rel)
  const buf = await readFile(file).catch(() => null)
  if (!buf) return c.notFound()
  return c.body(buf, 200, {
    'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'public, max-age=3600',
    // 预览 iframe（srcdoc，origin 为 null）跨源加载文章图片需要放行
    'Access-Control-Allow-Origin': '*',
  })
})

export { blogContent }
