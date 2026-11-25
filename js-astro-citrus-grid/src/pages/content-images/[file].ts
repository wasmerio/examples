import fs from 'node:fs/promises'
import path from 'node:path'
import type { APIRoute } from 'astro'
import { contentImageName, isContentImageFile } from '@/lib/contentImages'

export const prerender = true

const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
}

interface ImageProps {
  rel: string
}

export async function getStaticPaths() {
  const root = path.join(process.cwd(), 'src', 'content')
  const routes: { params: { file: string }; props: ImageProps }[] = []

  async function walk(dir: string) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(abs)
        continue
      }
      if (!isContentImageFile(entry.name)) continue
      const rel = path.relative(root, abs).split(path.sep).join('/')
      routes.push({ params: { file: contentImageName(rel) }, props: { rel } })
    }
  }
  await walk(root)
  return routes
}

export const GET: APIRoute = async ({ props }) => {
  const { rel } = props as ImageProps
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'src', 'content', rel))
    const ext = path.posix.extname(rel).toLowerCase()
    return new Response(data, {
      headers: {
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
        'Cache-Control': import.meta.env.PROD
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=3600',
      },
    })
  } catch {
    return new Response('Not Found', { status: 404 })
  }
}
