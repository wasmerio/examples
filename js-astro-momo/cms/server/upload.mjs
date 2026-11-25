// upload.mjs — 封面图上传 API
import { Hono } from 'hono'
import { writeFile, mkdir } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'
import { safeRel, blogPath } from './store.mjs'

const upload = new Hono()

const ALLOWED = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

// POST /api/upload  (multipart: file + path)
upload.post('/', async (c) => {
  const form = await c.req.parseBody().catch(() => null)
  if (!form) return c.json({ error: '无法解析表单' }, 400)

  const file = form['file']
  const path = String(form['path'] || '')

  if (typeof File === 'undefined' || !(file instanceof File)) {
    return c.json({ error: '缺少文件字段 file' }, 400)
  }
  if (!ALLOWED.includes(file.type)) return c.json({ error: '仅支持图片文件' }, 400)
  if (file.size > MAX_SIZE) return c.json({ error: '图片大小不能超过 10MB' }, 400)

  const rel = safeRel(path)
  if (!rel) return c.json({ error: '无效的文章路径' }, 400)

  const name = basename(file.name || 'image.png').replace(/[^\w.\-]+/g, '_') || 'image.png'
  const dir = blogPath(rel)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, name), new Uint8Array(await file.arrayBuffer()))

  return c.json({ name, url: './' + name })
})

export { upload }
